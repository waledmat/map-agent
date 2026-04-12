const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function parseClaudeJSON(response) {
  const textContent = response.content
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('');

  const clean = textContent
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();

  try {
    return JSON.parse(clean);
  } catch (e) {
    console.error('JSON parse failed. Raw:', clean.substring(0, 300));
    throw new Error('Agent stage returned invalid JSON');
  }
}

async function callClaude(systemPrompt, userPrompt, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      });
      return parseClaudeJSON(response);
    } catch (e) {
      if (e.status === 429) {
        const wait = (i + 1) * 5000;
        console.log(`[claude] Rate limited — waiting ${wait / 1000}s...`);
        await sleep(wait);
      } else {
        throw e;
      }
    }
  }
  throw new Error('Max retries exceeded');
}

async function callClaudeWithMCP(prompt, mcpUrl, mcpName) {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    mcp_servers: [{ type: 'url', url: mcpUrl, name: mcpName }],
    messages: [{ role: 'user', content: prompt }]
  });
  return response;
}

module.exports = { callClaude, callClaudeWithMCP };
