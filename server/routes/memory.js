const express = require('express');
const router = express.Router();
const { ingestSession, recall } = require('../services/memoryEngine');

router.post('/ingest', async (req, res) => {
  try {
    const result = await ingestSession(req.body);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/recall', async (req, res) => {
  try {
    const result = await recall(req.body);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
