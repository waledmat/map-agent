# API Setup Guide

Read this before writing any API integration code.

---

## 1. Anthropic API Key

**Get it:** https://console.anthropic.com → API Keys → Create Key

**Add to .env:**
```
ANTHROPIC_API_KEY=sk-ant-...
```

**Cost estimate per agent run:**
- ~8 Claude calls per run
- ~4,000 tokens input + 2,000 tokens output per call
- Total: ~50,000 tokens per run
- Cost: ~$0.05 per full agent run (very cheap)

---

## 2. YouTube Data API v3

**Get it (5 minutes):**
1. Go to https://console.cloud.google.com
2. Create new project → "Map Agent"
3. APIs & Services → Enable APIs → search "YouTube Data API v3" → Enable
4. Credentials → Create Credentials → API Key
5. Copy the key

**Add to .env:**
```
YOUTUBE_API_KEY=AIza...
```

**Usage in agent (Stage 1 & 2):**
```javascript
async function searchYouTubeMapVideos(query) {
  const url = `https://www.googleapis.com/youtube/v3/search?` +
    `part=snippet&q=${encodeURIComponent(query)}&type=video&` +
    `videoCategoryId=20&order=viewCount&maxResults=10&` +
    `key=${process.env.YOUTUBE_API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();
  return data.items.map(item => ({
    title: item.snippet.title,
    videoId: item.id.videoId,
    channelTitle: item.snippet.channelTitle,
    description: item.snippet.description,
    publishedAt: item.snippet.publishedAt
  }));
}

// Get comments for analysis
async function getVideoComments(videoId) {
  const url = `https://www.googleapis.com/youtube/v3/commentThreads?` +
    `part=snippet&videoId=${videoId}&maxResults=50&order=relevance&` +
    `key=${process.env.YOUTUBE_API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();
  return data.items?.map(item =>
    item.snippet.topLevelComment.snippet.textDisplay
  ) || [];
}
```

**Free quota:** 10,000 units/day. Each search = 100 units. Each comment fetch = 1 unit.
You can run the agent ~80 times per day on free tier.

---

## 3. CurseForge API (Minecraft data)

**Get it (2 minutes):**
1. Go to https://console.curseforge.com
2. Sign up → Create API Key
3. Copy the key

**Add to .env:**
```
CURSEFORGE_API_KEY=$2a$10...
```

**Usage in agent (Stage 1):**
```javascript
async function getTrendingMinecraftMaps() {
  const res = await fetch(
    'https://api.curseforge.com/v1/mods/search?' +
    'gameId=432&classId=17&sortField=3&sortOrder=desc&pageSize=10',
    {
      headers: {
        'x-api-key': process.env.CURSEFORGE_API_KEY,
        'Accept': 'application/json'
      }
    }
  );
  const data = await res.json();
  return data.data.map(mod => ({
    name: mod.name,
    downloads: mod.downloadCount,
    rating: mod.thumbsUpCount,
    summary: mod.summary,
    gameMode: mod.categories?.[0]?.name || 'Unknown'
  }));
}
```

**Free tier:** 1,000 requests/hour — more than enough.

---

## 4. Gmail MCP (already connected)

No setup needed — already connected to Claude account.

**MCP URL:** `https://gmail.mcp.claude.com/mcp`

**Important:** The API key used is the user's Claude session token, not Anthropic API key.
When calling via Claude API's mcp_servers param, authentication is handled automatically.

**Note:** mcp_servers param requires claude-sonnet or higher model.

---

## 5. Google Calendar MCP (already connected)

No setup needed — already connected to Claude account.

**MCP URL:** `https://gcal.mcp.claude.com/mcp`

Same authentication model as Gmail MCP.

---

## Error Handling Patterns

### API key missing
```javascript
function checkEnvVars() {
  const required = ['ANTHROPIC_API_KEY'];
  const optional = ['YOUTUBE_API_KEY', 'CURSEFORGE_API_KEY'];

  required.forEach(key => {
    if (!process.env[key]) throw new Error(`Missing required: ${key}`);
  });

  optional.forEach(key => {
    if (!process.env[key]) {
      console.warn(`Warning: ${key} not set — some features disabled`);
    }
  });
}
```

### Claude API response parsing
```javascript
function parseClaudeJSON(response) {
  const textContent = response.content
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('');

  // Strip markdown code fences if Claude added them
  const clean = textContent
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();

  try {
    return JSON.parse(clean);
  } catch (e) {
    console.error('JSON parse failed:', clean.substring(0, 200));
    throw new Error('Agent returned invalid JSON');
  }
}
```

### Rate limiting
```javascript
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function callClaudeWithRetry(fn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (e) {
      if (e.status === 429) {
        console.log(`Rate limited — waiting ${(i+1)*5}s...`);
        await sleep((i + 1) * 5000);
      } else throw e;
    }
  }
}
```
