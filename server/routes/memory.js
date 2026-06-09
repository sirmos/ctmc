const express = require('express');
const router = express.Router();
const { ingestSession, recall } = require('../services/memoryEngine');
const { log } = require('../services/auditLog');

router.post('/ingest', async (req, res) => {
  try {
    const result = await ingestSession(req.body);
    log({ action: 'INGEST', patientId: req.body.patientId, trialId: req.body.trialId, userId: req.body.authorId, details: { chunksStored: result.chunksStored, hasAnomaly: result.anomalyCheck?.hasAnomaly } });
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/recall', async (req, res) => {
  try {
    const result = await recall(req.body);
    log({ action: 'RECALL', patientId: req.body.patientId, trialId: req.body.trialId, details: { query: req.body.query, sourcesFound: result.sources?.length } });
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
