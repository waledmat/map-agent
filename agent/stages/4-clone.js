require('dotenv').config();
const { callClaude } = require('../claude');

const SYSTEM_PROMPT = `You are a creative game designer specializing in Fortnite Creative (UEFN),
Minecraft, and Roblox map design.

Given a winning map opportunity, design a NEW original map that:
- Keeps the proven core game loop that makes the original fun
- Completely changes the theme, visual style, and name (no copyright issues)
- Uses the weapons/mechanics players love
- FIXES every complaint players had about the original
- ADDS the features players were begging for
- Has 3 strong retention hooks to keep players coming back

The map must feel fresh and original while being strategically designed
to capture the audience of the original map.

Be specific and creative. Give it a name that would trend on TikTok.
Return ONLY valid JSON.`;

async function stage4Clone(scoredData, analysisData) {
  const winnerAnalysis = analysisData.analyses.find(
    a => a.mapName === scoredData.winner.mapName
  ) || analysisData.analyses[0];

  const userPrompt = `Design a new original map based on this winning opportunity:

WINNER: ${JSON.stringify(scoredData.winner, null, 2)}

PLAYER ANALYSIS (what they love and hate):
${JSON.stringify(winnerAnalysis, null, 2)}

Create a completely original map concept. Return this JSON:
{
  "concept": {
    "name": "catchy map name that would trend",
    "tagline": "one sentence that sells the map",
    "platform": "Fortnite|Minecraft|Roblox",
    "gameMode": "game mode type",
    "theme": "detailed theme description",
    "visualStyle": "art direction description",
    "coreLoop": "what players do every match",
    "weapons": [
      { "name": "weapon name", "role": "why this weapon is here", "playerAppeal": "why players will love it" }
    ],
    "uniqueMechanic": "the one new thing that makes this map different from anything else",
    "twist": "the surprise element players will talk about",
    "retentionHooks": [
      "hook 1 - why players come back",
      "hook 2 - progression element",
      "hook 3 - social/competitive element"
    ],
    "fixedComplaints": ["complaint 1 from original - how this map fixes it"],
    "addedFeatures": ["requested feature 1 - now included"],
    "estimatedAppeal": "who will love this map and why"
  }
}`;

  const result = await callClaude(SYSTEM_PROMPT, userPrompt);
  return result.concept;
}

module.exports = stage4Clone;

if (require.main === module) {
  const scored = { winner: { mapName: 'Test Map', platform: 'Fortnite', totalScore: 85, whyWin: 'High demand', keyInsight: 'Players want more variety' } };
  const analysis = { analyses: [{ mapName: 'Test Map', platform: 'Fortnite', favoriteWeapons: ['AR'], lovedMechanics: ['fast respawn'], topComplaints: ['no variety'], requestedFeatures: ['more zones'], avgSessionMinutes: 20, retentionHooks: ['leaderboard'], visualStyle: 'colorful', playerQuotes: ['great!'], overallSentiment: 'positive' }] };
  stage4Clone(scored, analysis)
    .then(data => console.log(JSON.stringify(data, null, 2)))
    .catch(err => { console.error(err.message); process.exit(1); });
}
