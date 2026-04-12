require('dotenv').config();
const { callClaude } = require('../claude');

const SYSTEM_PROMPT = `You are a game market intelligence analyst specializing in user-generated content
platforms: Fortnite Creative (UEFN), Minecraft Marketplace, and Roblox.

Your job is to find the TOP 10 trending maps RIGHT NOW across all 3 platforms
using web search. For each map collect:
- Map name and platform
- Estimated player count or download count
- Rating or engagement level
- Growth trend (rising fast, stable, declining)
- Core game mode (PvP, survival, parkour, horror, roleplay, etc.)

Search these sources:
- Fortnite: search "top Fortnite Creative maps 2026", "trending UEFN islands"
- Minecraft: search "trending Minecraft maps 2026 CurseForge", "most downloaded Minecraft maps"
- Roblox: search "most popular Roblox games 2026 trending"
- Also search TikTok/YouTube: "viral Fortnite map 2026", "minecraft map going viral"

Return ONLY a JSON array. No explanation. No markdown. Raw JSON only.`;

async function stage1TrendScan() {
  const userPrompt = `Search the web right now and find the top 10 trending game maps across
Fortnite, Minecraft, and Roblox. Today's date is ${new Date().toDateString()}.

Return this exact JSON structure:
{
  "maps": [
    {
      "rank": 1,
      "name": "map name",
      "platform": "Fortnite|Minecraft|Roblox",
      "gameMode": "PvP|Survival|Parkour|Horror|Roleplay|Other",
      "playerCount": "estimated number or range",
      "rating": "out of 5 or percentage",
      "trend": "rising|stable|declining",
      "source": "where you found this data",
      "islandCode": "if Fortnite, the code",
      "description": "one sentence about what the map is"
    }
  ],
  "searchedAt": "${new Date().toISOString()}"
}`;

  return callClaude(SYSTEM_PROMPT, userPrompt);
}

module.exports = stage1TrendScan;

if (require.main === module) {
  stage1TrendScan()
    .then(data => console.log(JSON.stringify(data, null, 2)))
    .catch(err => { console.error(err.message); process.exit(1); });
}
