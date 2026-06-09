import { useState } from 'react';
import { generateReport } from '../api';

const REPORT_TYPES = [
  { value: 'adverse_event', label: 'Adverse Event Report', desc: 'FDA MedWatch-style AE summary', icon: '🚨' },
  { value: 'deviation', label: 'Protocol Deviation Report', desc: 'IRB protocol deviation documentation', icon: '📋' },
  { value: 'summary', label: 'Patient Progress Summary', desc: 'Full session history and status', icon: '📊' }
];

export default function Reports() {
  const [patientId, setPatientId] = useState('P042');
  const [trialId, setTrialId] = useState('TRIAL-001');
  const [reportType, setReportType] = useState('adverse_event');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true); setResult(null);
    try {
      const { data } = await generateReport({ patientId, trialId, reportType });
      setResult(data);
    } catch (e) { setResult({ error: e.message }); }
    setLoading(false);
  }

  function download() {
    if (!result?.report) return;
    const blob = new Blob([result.report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.reportType}_${result.patientId}_${result.generatedAt?.split('T')[0]}.txt`;
    a.click();
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Report Generator</div>
        <div className="page-sub">Auto-generate clinical reports from patient memory — no manual writing required</div>
      </div>

      <div className="card">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Patient ID</label>
            <input className="form-input" value={patientId} onChange={e => setPatientId(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Trial ID</label>
            <input className="form-input" value={trialId} onChange={e => setTrialId(e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Report Type</label>
          <div className="report-type-grid">
            {REPORT_TYPES.map(t => (
              <div key={t.value}
                className={`report-type-card ${reportType === t.value ? 'selected' : ''}`}
                onClick={() => setReportType(t.value)}>
                <span className="rt-icon">{t.icon}</span>
                <div className="rt-label">{t.label}</div>
                <div className="rt-desc">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
        <button className="btn btn-primary" onClick={generate} disabled={loading}>
          {loading ? 'Generating from memory...' : 'Generate Report'}
        </button>
      </div>

      {result?.error && (
        <div style={{background:'#fff5f5',border:'1px solid #fecaca',borderRadius:8,padding:'14px 16px',fontSize:13,color:'#dc2626'}}>
          Error: {result.error}
        </div>
      )}

      {result?.report && (
        <div className="card">
          <div className="report-header">
            <div>
              <div className="report-meta-title">Generated Report</div>
              <div className="report-meta-sub">
                {result.sourceSessions} source session{result.sourceSessions !== 1 ? 's' : ''} · {result.generatedAt?.split('T')[0]}
              </div>
            </div>
            <button className="btn btn-primary btn-sm" onClick={download}>↓ Download</button>
          </div>
          <div className="divider"/>
          <pre className="report-body">{result.report}</pre>
        </div>
      )}
    </div>
  );
}
