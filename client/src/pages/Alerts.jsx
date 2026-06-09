const DEMO_ALERTS = [
  { severity: 'high', type: 'Liver Enzyme Elevation', message: "Patient P042's ALT increased from 52 U/L to 89 U/L within two weeks — significant escalation indicating potential hepatotoxicity.", recommendation: 'Immediate dose reduction consideration and further diagnostic evaluation of liver function. Monitor closely for acute liver injury.', date: '2026-05-29', patient: 'P042' },
  { severity: 'medium', type: 'Symptomatic Concern', message: 'Persistent fatigue and loss of appetite reported — possibly linked to the observed liver enzyme elevation.', recommendation: 'Conduct thorough clinical assessment. Consider supportive care and re-evaluate dosing schedule.', date: '2026-05-29', patient: 'P042' }
];

export default function Alerts() {
  const alerts = DEMO_ALERTS;

  if (!alerts.length) return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Alerts</div>
        <div className="page-sub">Anomalies detected automatically on session ingestion</div>
      </div>
      <div className="empty-state">
        <div className="empty-icon">✅</div>
        <div className="empty-title">No anomalies detected</div>
        <div className="empty-desc">All sessions are within expected parameters</div>
      </div>
    </div>
  );

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Alerts</div>
        <div className="page-sub">{alerts.length} anomal{alerts.length > 1 ? 'ies' : 'y'} detected · Auto-generated on session ingestion</div>
      </div>
      {alerts.map((a, i) => (
        <div key={i} className={`card alert-card ${a.severity}`}>
          <div className="alert-top">
            <span className={`alert-severity severity-${a.severity}`}>{a.severity}</span>
            <span className="alert-meta">{a.date} · Patient {a.patient}</span>
          </div>
          <div className="alert-type">{a.type}</div>
          <div className="alert-message">{a.message}</div>
          <div className="alert-rec"><strong>Recommendation:</strong> {a.recommendation}</div>
        </div>
      ))}
    </div>
  );
}
