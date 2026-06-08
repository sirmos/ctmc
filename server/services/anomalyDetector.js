const { chat } = require('./qwenClient');
const { recall } = require('./memoryEngine');

async function checkForAnomalies({ patientId, trialId, newSessionNotes, sessionDate }) {
  const memory = await recall({
    query: newSessionNotes,
    patientId,
    trialId,
    topK: 8
  });

  if (!memory.sources.length) return { hasAnomaly: false, alerts: [] };

  const systemPrompt = `You are a clinical trial safety monitor. Respond ONLY in JSON with no markdown, no backticks, no explanation: {"hasAnomaly": true or false, "alerts": [{"severity": "high/medium/low", "type": "string", "message": "string", "recommendation": "string"}]}`;

  const prompt = `Prior patient history:
${memory.answer}

New session (${sessionDate}):
${newSessionNotes}

Identify any anomalies or safety concerns comparing the new session to prior history.`;

  const raw = await chat([{ role: 'user', content: prompt }], systemPrompt);

  try {
    const clean = raw.replace(/```json|```/g, '').trim();
    const result = JSON.parse(clean);
    return result;
  } catch {
    console.error('Anomaly detector parse error, raw response:', raw);
    return { hasAnomaly: false, alerts: [], parseError: true };
  }
}

module.exports = { checkForAnomalies };
