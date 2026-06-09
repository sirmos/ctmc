const { chat } = require('./qwenClient');
const { recall } = require('./memoryEngine');

async function generateReport({ patientId, trialId, reportType = 'adverse_event' }) {
  const queries = {
    adverse_event: 'adverse events side effects reactions symptoms lab results',
    deviation: 'protocol deviation amendment IRB compliance',
    summary: 'all sessions vitals lab results observations progress'
  };

  const memory = await recall({
    query: queries[reportType] || queries.summary,
    patientId,
    trialId,
    topK: 10
  });

  if (!memory.sources.length) {
    return { error: 'No session memory found for this patient.' };
  }

  const templates = {
    adverse_event: `You are a clinical regulatory writer. Generate a formal FDA MedWatch-style adverse event report based ONLY on the session memories provided. Use this exact structure:

ADVERSE EVENT REPORT
====================
Patient ID: [from memory]
Trial ID: [from memory]
Report Date: ${new Date().toISOString().split('T')[0]}

1. EVENT DESCRIPTION
   Describe the adverse event(s) observed, with dates and severity.

2. TIMELINE
   Chronological sequence of events from session records.

3. LAB VALUES
   Relevant lab results with dates and reference ranges where available.

4. CURRENT STATUS
   Patient's current condition based on most recent session.

5. RECOMMENDED ACTIONS
   Clinical recommendations based on the observed pattern.

6. DATA SOURCES
   List session dates used as sources for this report.

Be precise and clinical. Only include information present in the session memories.`,

    deviation: `You are a clinical regulatory writer. Generate a formal protocol deviation report based ONLY on the session memories provided. Use this structure:

PROTOCOL DEVIATION REPORT
==========================
Patient ID: [from memory]
Trial ID: [from memory]
Report Date: ${new Date().toISOString().split('T')[0]}

1. DEVIATION DESCRIPTION
2. DATE OF DEVIATION
3. REASON FOR DEVIATION
4. IMPACT ASSESSMENT
5. CORRECTIVE ACTIONS TAKEN
6. DATA SOURCES`,

    summary: `You are a clinical writer. Generate a comprehensive patient progress summary based ONLY on the session memories. Use this structure:

PATIENT PROGRESS SUMMARY
=========================
Patient ID: [from memory]
Trial ID: [from memory]
Report Date: ${new Date().toISOString().split('T')[0]}

1. ENROLLMENT OVERVIEW
2. SESSION HISTORY
3. KEY OBSERVATIONS
4. ADVERSE EVENTS (if any)
5. PROTOCOL COMPLIANCE
6. OVERALL ASSESSMENT`
  };

  const systemPrompt = templates[reportType] || templates.summary;

  const report = await chat([
    { role: 'user', content: `Session memories:\n${memory.answer}\n\nGenerate the report now.` }
  ], systemPrompt);

  return {
    report,
    reportType,
    patientId,
    trialId,
    generatedAt: new Date().toISOString(),
    sourceSessions: memory.sources.length
  };
}

module.exports = { generateReport };
