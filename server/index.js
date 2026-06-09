const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/memory', require('./routes/memory'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/audit', require('./routes/audit'));

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'CTMC API' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`CTMC server running on port ${PORT}`));
