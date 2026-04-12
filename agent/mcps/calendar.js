require('dotenv').config();
const { callClaudeWithMCP } = require('../claude');

const MCP_URL = 'https://gcal.mcp.claude.com/mcp';

async function mcpCalendar(calendarEvents) {
  if (!calendarEvents || calendarEvents.length === 0) {
    console.log('[calendar-mcp] No calendar events to create, skipping.');
    return;
  }

  const prompt = `Create these events in Google Calendar for my content posting schedule.
Create them all in a calendar called "Map Launch" (create it if it doesn't exist).

Add a reminder 2 hours before each event.
Color code: TikTok = red, YouTube = blue, Reddit = orange, Discord = purple.

Events:
${JSON.stringify(calendarEvents, null, 2)}`;

  try {
    const response = await callClaudeWithMCP(prompt, MCP_URL, 'google-calendar');
    console.log('[calendar-mcp] Calendar events created successfully');
    return response;
  } catch (err) {
    console.warn('[calendar-mcp] Calendar creation failed (user may need to authenticate):', err.message);
  }
}

module.exports = mcpCalendar;
