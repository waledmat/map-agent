# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
npm install

# Run the web dashboard (http://localhost:3000)
node server.js

# Run the agent directly (CLI, no server)
node agent/index.js

# Test a single stage in isolation
node agent/stages/1-trend-scan.js
node agent/stages/2-analysis.js
# ... etc

# Deploy to Vercel
vercel --prod
```

## Required Environment Variables

Copy `.env.example` to `.env` and fill in keys:
- `ANTHROPIC_API_KEY` — required (get from console.anthropic.com)
- `YOUTUBE_API_KEY` — optional, enhances stage 1 & 2 data
- `CURSEFORGE_API_KEY` — optional, enhances Minecraft map data

Gmail and Google Calendar MCPs use the user's Claude session — no extra keys needed.

## Architecture

The agent runs 6 stages sequentially, each receiving the previous stage's JSON output as input:

```
Stage 1: Trend Scan     → top 10 trending maps across Fortnite/Minecraft/Roblox
Stage 2: Analysis       → deep player behavior research (Reddit/YouTube/Discord)
Stage 3: Scoring        → opportunity scoring on 4 axes (0-100 total)
Stage 4: Clone Engine   → generates original remixed map concept
Stage 5: Build Guide    → step-by-step UEFN/Minecraft build instructions
Stage 6: Marketing      → full viral marketing package (TikTok/YouTube/Reddit/Discord)
→ Gmail MCP             → sends influencer outreach emails
→ Calendar MCP          → creates 30-day posting schedule in Google Calendar
```

**Key files:**
- `agent/claude.js` — shared Claude client used by all stages; handles web_search, JSON parsing, and rate-limit retries
- `agent/index.js` — orchestrator; calls all stages in sequence and passes data between them
- `server.js` — Express server exposing `POST /api/agent` endpoint; serves the dashboard

## Claude API Pattern

Every stage calls `callClaude(systemPrompt, userPrompt)` from `agent/claude.js`. This uses model `claude-sonnet-4-20250514` with `web_search_20250305` tool enabled. Response may contain `tool_use` blocks — the client filters for `text` blocks only before JSON parsing.

MCP calls use `callClaudeWithMCP(prompt, mcpUrl, mcpName)` with `mcp_servers` param instead of tools.

## Troubleshooting

- **web_search not working**: Some SDK versions need `betas: ['web-search-2025-03-05']` added to `client.messages.create()`
- **Gmail/Calendar MCP failing**: User must be authenticated to Claude account. MCP URLs must be exactly `https://gmail.mcp.claude.com/mcp` and `https://gcal.mcp.claude.com/mcp`
- **JSON parse errors**: `parseClaudeJSON()` in `agent/claude.js` strips markdown fences — check the raw output logged on error

## References

- `references/prompts.md` — exact system + user prompts for all 6 stages
- `references/api-setup.md` — API key setup and integration code patterns
- `references/deploy.md` — Vercel deployment steps
