require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { runAgent } = require('./agent/index');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/agent', async (req, res) => {
  try {
    console.log('[server] Agent run started');
    const result = await runAgent();
    console.log('[server] Agent run complete');
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('[server] Agent error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Map Agent running at http://localhost:${PORT}`);
});
