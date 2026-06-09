const fs = require('fs');
const path = require('path');

const AUDIT_PATH = path.join(__dirname, '../../data/audit.json');

function log({ action, patientId, trialId, userId = 'system', details = {} }) {
  const entry = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    action,
    patientId,
    trialId,
    userId,
    details
  };
  let logs = [];
  try { logs = JSON.parse(fs.readFileSync(AUDIT_PATH, 'utf8')); } catch {}
  logs.push(entry);
  fs.mkdirSync(path.dirname(AUDIT_PATH), { recursive: true });
  fs.writeFileSync(AUDIT_PATH, JSON.stringify(logs, null, 2));
  return entry;
}

function getLogs({ patientId, trialId, limit = 50 }) {
  try {
    let logs = JSON.parse(fs.readFileSync(AUDIT_PATH, 'utf8'));
    if (patientId) logs = logs.filter(l => l.patientId === patientId);
    if (trialId) logs = logs.filter(l => l.trialId === trialId);
    return logs.slice(-limit).reverse();
  } catch { return []; }
}

module.exports = { log, getLogs };
