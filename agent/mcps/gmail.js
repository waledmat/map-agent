require('dotenv').config();
const { callClaudeWithMCP } = require('../claude');

const MCP_URL = 'https://gmail.mcp.claude.com/mcp';

async function mcpGmail(influencerDMs) {
  if (!influencerDMs || influencerDMs.length === 0) {
    console.log('[gmail-mcp] No influencer DMs to send, skipping.');
    return;
  }

  const prompt = `Send these influencer outreach emails using Gmail.
Send each as a separate email with an appropriate subject line.

Emails to send:
${JSON.stringify(influencerDMs, null, 2)}

Use a friendly, genuine tone. Subject line should be short and personal.
Do not make it sound like a mass email.`;

  try {
    const response = await callClaudeWithMCP(prompt, MCP_URL, 'gmail');
    console.log('[gmail-mcp] Emails sent successfully');
    return response;
  } catch (err) {
    console.warn('[gmail-mcp] Email send failed (user may need to authenticate):', err.message);
  }
}

module.exports = mcpGmail;
