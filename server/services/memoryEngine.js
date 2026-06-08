const { embed, chat } = require('./qwenClient');
const { v4: uuidv4 } = require('uuid');
const store = require('./store');

async function ingestSession({ patientId, trialId, sessionDate, notes, authorId }) {
  const chunks = chunkText(notes);
  const stored = [];

  for (const chunk of chunks) {
    const vector = await embed(chunk.text);
    const memory = {
      id: uuidv4(),
      patientId,
      trialId,
      sessionDate,
      authorId,
      content: chunk.text,
      chunkType: chunk.type,
      embedding: vector,
      createdAt: new Date().toISOString()
    };
    store.append(memory);
    stored.push(memory.id);
  }

  const priorMemory = store.filter(m =>
    m.patientId === patientId && m.trialId === trialId && m.sessionDate !== sessionDate
  );

  let anomalyResult = { hasAnomaly: false, alerts: [] };
  if (priorMemory.length > 0) {
    const { checkForAnomalies } = require('./anomalyDetector');
    anomalyResult = await checkForAnomalies({ patientId, trialId, newSessionNotes: notes, sessionDate });
  }

  return { chunksStored: stored.length, chunkIds: stored, anomalyCheck: anomalyResult };
}

async function recall({ query, patientId, trialId, topK = 5 }) {
  const filtered = store.filter(m =>
    m.patientId === patientId && m.trialId === trialId
  );
  if (filtered.length === 0) return { answer: 'No sessions recorded for this patient.', sources: [] };

  const queryVec = await embed(query);
  const ranked = filtered
    .map(m => ({ ...m, score: cosineSim(queryVec, m.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  const context = ranked.map((m, i) =>
    `[Memory ${i+1} — ${m.sessionDate} — ${m.chunkType}]\n${m.content}`
  ).join('\n\n');

  const systemPrompt = `You are a clinical trial memory assistant. Answer questions strictly based on the session memories provided. Always cite which session date your answer comes from. If the answer is not in the memories, say so clearly. Never guess or invent clinical details.`;

  const answer = await chat([
    { role: 'user', content: `Context memories:\n${context}\n\nQuestion: ${query}` }
  ], systemPrompt);

  return {
    answer,
    sources: ranked.map(m => ({ id: m.id, date: m.sessionDate, type: m.chunkType, score: m.score.toFixed(3) }))
  };
}

function chunkText(text) {
  const raw = text.split(/\n\n+/).filter(s => s.trim().length > 20);
  return raw.map(t => ({ text: t.trim(), type: detectType(t) }));
}

function detectType(text) {
  const t = text.toLowerCase();
  if (t.includes('adverse') || t.includes('side effect') || t.includes('reaction')) return 'adverse_event';
  if (t.includes('protocol') || t.includes('deviation') || t.includes('amendment')) return 'protocol_note';
  if (t.includes('vital') || t.includes('blood') || t.includes('lab') || t.includes('result')) return 'observation';
  if (t.includes('regulatory') || t.includes('fda') || t.includes('irb')) return 'regulatory';
  return 'general';
}

function cosineSim(a, b) {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const magA = Math.sqrt(a.reduce((s, ai) => s + ai * ai, 0));
  const magB = Math.sqrt(b.reduce((s, bi) => s + bi * bi, 0));
  return dot / (magA * magB);
}

module.exports = { ingestSession, recall };
