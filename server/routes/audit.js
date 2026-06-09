const express = require('express');
const router = express.Router();
const { getLogs } = require('../services/auditLog');

router.get('/', (req, res) => {
  const { patientId, trialId, limit } = req.query;
  const logs = getLogs({ patientId, trialId, limit: limit ? parseInt(limit) : 50 });
  res.json({ success: true, logs, total: logs.length });
});

module.exports = router;
