/**
 * CTMC — Clinical Trial Memory Coordinator
 * Backend API Server
 * Deployed on Alibaba Cloud ECS (Singapore region)
 * Instance: ecs.e-c1m2.large | Ubuntu 22.04
 * Process manager: PM2
 */
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/memory', require('./routes/memory'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/audit', require('./routes/audit'));

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'CTMC API', deployment: 'Alibaba Cloud ECS - Singapore' }));

// Serve React frontend (built assets)
app.use(express.static(path.join(__dirname, '../client/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`CTMC server running on port ${PORT}`));
