import { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const api = axios.create({ baseURL: BASE_URL });

const ACTION_COLORS = {
  INGEST: { bg: '#eff6ff', color: '#1d4ed8', label: 'INGEST' },
  RECALL: { bg: '#f0fdf4', color: '#059669', label: 'RECALL' },
  REPORT: { bg: '#fef3c7', color: '#d97706', label: 'REPORT' }
};

export default function Audit() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/audit?patientId=P042&trialId=TRIAL-001')
      .then(r => setLogs(r.data.logs))
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page"><div className="page-header"><div className="page-title">Audit Trail</div></div><div style={{color:'#64748b',fontSize:13}}>Loading...</div></div>;

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Audit Trail</div>
        <div className="page-sub">{logs.length} event{logs.length !== 1 ? 's' : ''} logged · Patient P042 · TRIAL-001</div>
      </div>

      {!logs.length ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <div className="empty-title">No audit events yet</div>
          <div className="empty-desc">Events are logged automatically on every ingest, recall, and report</div>
        </div>
      ) : (
        <div className="card" style={{padding:0, overflow:'hidden'}}>
          <table className="audit-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Action</th>
                <th>Patient</th>
                <th>User</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l, i) => {
                const style = ACTION_COLORS[l.action] || ACTION_COLORS.RECALL;
                return (
                  <tr key={i}>
                    <td className="audit-ts">{new Date(l.timestamp).toLocaleString()}</td>
                    <td>
                      <span className="audit-badge" style={{background: style.bg, color: style.color}}>
                        {l.action}
                      </span>
                    </td>
                    <td className="audit-mono">{l.patientId}</td>
                    <td className="audit-mono">{l.userId || '—'}</td>
                    <td className="audit-details">
                      {l.action === 'INGEST' && `${l.details.chunksStored} chunks${l.details.hasAnomaly ? ' · ⚠ anomaly' : ''}`}
                      {l.action === 'RECALL' && `"${l.details.query?.slice(0, 40)}..." · ${l.details.sourcesFound} sources`}
                      {l.action === 'REPORT' && `${l.details.reportType}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
