import { useState } from 'react';
import { ingestSession } from '../api';

export default function Ingest() {
  const [form, setForm] = useState({ patientId: 'P042', trialId: 'TRIAL-001', sessionDate: '', authorId: '', notes: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({...f, [k]: v}));

  async function submit() {
    if (!form.notes.trim() || !form.sessionDate) return;
    setLoading(true); setResult(null);
    try {
      const { data } = await ingestSession(form);
      setResult(data);
    } catch (e) { setResult({ error: e.message }); }
    setLoading(false);
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Log Session</div>
        <div className="page-sub">Record a patient session — it will be chunked, embedded, and stored in the memory system</div>
      </div>

      <div className="card">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Patient ID</label>
            <input className="form-input" value={form.patientId} onChange={e => set('patientId', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Trial ID</label>
            <input className="form-input" value={form.trialId} onChange={e => set('trialId', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Session Date</label>
            <input className="form-input" type="date" value={form.sessionDate} onChange={e => set('sessionDate', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Author ID</label>
            <input className="form-input" value={form.authorId} onChange={e => set('authorId', e.target.value)} placeholder="e.g. DR-SMITH" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Session Notes</label>
          <textarea className="form-textarea" rows={6} value={form.notes}
            onChange={e => set('notes', e.target.value)}
            placeholder="Enter full session notes. Separate distinct observations with blank lines for better memory chunking — e.g. vitals, adverse events, and protocol notes as separate paragraphs." />
        </div>
        <button className="btn btn-primary" onClick={submit} disabled={loading || !form.notes || !form.sessionDate}>
          {loading ? 'Ingesting into memory...' : 'Ingest Session'}
        </button>
      </div>

      {result && !result.error && (
        <div className="result-success">
          <div className="result-title">✓ Session stored in memory</div>
          <div className="result-meta">{result.chunksStored} memory chunk{result.chunksStored !== 1 ? 's' : ''} created · IDs: {result.chunkIds?.slice(0,2).join(', ')}{result.chunkIds?.length > 2 ? '…' : ''}</div>
        </div>
      )}

      {result?.anomalyCheck?.hasAnomaly && (
        <div className="anomaly-block">
          <div className="anomaly-title">⚠ Anomalies detected against prior session history</div>
          {result.anomalyCheck.alerts.map((a, i) => (
            <div key={i} className="anomaly-item">
              <div className="anomaly-item-title">{a.severity?.toUpperCase()} · {a.type}</div>
              <div style={{fontSize:13, marginBottom:6}}>{a.message}</div>
              <div className="anomaly-item-rec">→ {a.recommendation}</div>
            </div>
          ))}
        </div>
      )}

      {result?.error && (
        <div style={{background:'#fff5f5', border:'1px solid #fecaca', borderRadius:8, padding:'14px 16px', marginTop:14, fontSize:13, color:'#dc2626'}}>
          Error: {result.error}
        </div>
      )}
    </div>
  );
}
