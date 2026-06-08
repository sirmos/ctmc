const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
require('dotenv').config();

const BASE_URL = process.env.QWEN_BASE_URL;
const API_KEY  = process.env.QWEN_API_KEY;

async function chat(messages, systemPrompt = '') {
  const body = {
    model: 'qwen-max',
    messages: [
      ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
      ...messages
    ]
  };
  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Qwen API error: ${JSON.stringify(data)}`);
  return data.choices[0].message.content;
}

async function embed(text) {
  const res = await fetch(`${BASE_URL}/embeddings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
    body: JSON.stringify({ model: 'text-embedding-v3', input: text })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Qwen embed error: ${JSON.stringify(data)}`);
  return data.data[0].embedding;
}

module.exports = { chat, embed };
