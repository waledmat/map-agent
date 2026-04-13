const OpenAI = require('openai');

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'https://map-agent.app',
    'X-Title': 'Map Agent'
  }
});

const MODEL = process.env.OPENROUTER_MODEL || 'anthropic/claude-sonnet-4-5';

let cachedFreeModels = null;

async function getFreeModels() {
  if (cachedFreeModels) return cachedFreeModels;
  try {
    const res = await fetch('https://openrouter.ai/api/v1/models', {
      headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` }
    });
    const json = await res.json();
    const free = (json.data || [])
      .filter(m => m.id.endsWith(':free') && m.context_length >= 4096)
      .map(m => m.id);
    console.log(`[openrouter] Found ${free.length} free models`);
    cachedFreeModels = free;
    return free;
  } catch (e) {
    console.warn('[openrouter] Could not fetch free models:', e.message);
    return [];
  }
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function parseClaudeJSON(text) {
  try { return JSON.parse(text.trim()); } catch (_) {}

  let clean = text
    .replace(/```json\n?/gi, '')
    .replace(/```\n?/g, '')
    .trim();
  try { return JSON.parse(clean); } catch (_) {}

  const objMatch = clean.match(/(\{[\s\S]*\})/);
  if (objMatch) { try { return JSON.parse(objMatch[1]); } catch (_) {} }

  const arrMatch = clean.match(/(\[[\s\S]*\])/);
  if (arrMatch) { try { return JSON.parse(arrMatch[1]); } catch (_) {} }

  console.error('JSON parse failed. Raw output:\n', text.substring(0, 500));
  throw new Error('Agent stage returned invalid JSON');
}

async function tryModel(model, messages, maxTokens) {
  const response = await client.chat.completions.create({
    model,
    max_tokens: maxTokens,
    response_format: { type: 'json_object' },
    messages
  });
  return response.choices[0].message.content || '';
}

async function callClaude(systemPrompt, userPrompt) {
  const messages = [
    { role: 'system', content: systemPrompt + '\n\nYou MUST respond with valid JSON only. No prose, no markdown, no explanation.' },
    { role: 'user', content: userPrompt }
  ];

  // 1. Try paid model
  for (let i = 0; i < 3; i++) {
    try {
      console.log(`[openrouter] Using model: ${MODEL}`);
      const text = await tryModel(MODEL, messages, 4096);
      return parseClaudeJSON(text);
    } catch (e) {
      if (e.status === 402) {
        console.log(`[openrouter] Credits exhausted — switching to free models`);
        break;
      } else if (e.status === 429) {
        await sleep((i + 1) * 5000);
      } else {
        throw e;
      }
    }
  }

  // 2. Auto-discover and try free models
  const freeModels = await getFreeModels();
  for (const model of freeModels) {
    try {
      console.log(`[openrouter] Trying free model: ${model}`);
      const text = await tryModel(model, messages, 4096);
      return parseClaudeJSON(text);
    } catch (e) {
      if (e.status === 404 || e.status === 400) {
        console.log(`[openrouter] ${model} unavailable (${e.status}), trying next...`);
      } else if (e.status === 429) {
        console.log(`[openrouter] ${model} rate limited, trying next...`);
      } else {
        console.log(`[openrouter] ${model} failed: ${e.message}, trying next...`);
      }
    }
  }

  throw new Error('All models failed. Add credits at https://openrouter.ai/settings/credits');
}

async function callClaudeWithMCP(prompt, mcpUrl, mcpName) {
  const allModels = [MODEL, ...(await getFreeModels())];
  for (const model of allModels) {
    try {
      const response = await client.chat.completions.create({
        model,
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }]
      });
      return { content: [{ type: 'text', text: response.choices[0].message.content || '' }] };
    } catch (e) {
      if (e.status === 402 || e.status === 404) {
        console.log(`[openrouter] ${model} unavailable, trying next...`);
      } else throw e;
    }
  }
  throw new Error('All models failed');
}

module.exports = { callClaude, callClaudeWithMCP };
