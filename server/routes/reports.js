const express = require('express');
const router = express.Router();
const { generateReport } = require('../services/reportGenerator');

router.post('/generate', async (req, res) => {
  try {
    const result = await generateReport(req.body);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
