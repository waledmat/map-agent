require('dotenv').config();
const { callClaude } = require('../claude');

const SYSTEM_PROMPT = `You are a game UX researcher and player behavior analyst.

Given a list of trending maps, pick the TOP 3 most promising ones and
deeply analyze each by searching for:
- Player reviews and comments on Reddit, YouTube, Discord
- What weapons or loadouts players say they love
- What mechanics players praise most
- What players complain about or wish was different
- Average session length if mentioned
- What keeps players coming back (retention hooks)
- Visual theme and art style

Search Reddit threads, YouTube comments sections, and gaming forums.
Be specific — not generic. Find real player quotes where possible.

Return ONLY valid JSON. No explanation. No markdown.`;

async function stage2Analysis(trendData) {
  const userPrompt = `Here are the top trending maps found:
${JSON.stringify(trendData.maps.slice(0, 5), null, 2)}

Search the web for deep player analysis on the top 3 most promising maps.
Look for Reddit posts, YouTube comments, Discord discussions about each.

Return this JSON:
{
  "analyses": [
    {
      "mapName": "name",
      "platform": "platform",
      "favoriteWeapons": ["weapon1", "weapon2"],
      "lovedMechanics": ["mechanic1", "mechanic2"],
      "topComplaints": ["complaint1", "complaint2"],
      "requestedFeatures": ["feature1", "feature2"],
      "avgSessionMinutes": 25,
      "retentionHooks": ["hook1", "hook2"],
      "visualStyle": "description of art style",
      "playerQuotes": ["real quote from player"],
      "overallSentiment": "positive|mixed|negative"
    }
  ]
}`;

  return callClaude(SYSTEM_PROMPT, userPrompt);
}

module.exports = stage2Analysis;

if (require.main === module) {
  const sample = { maps: [{ rank: 1, name: 'Test Map', platform: 'Fortnite', gameMode: 'PvP', playerCount: '10000', rating: '4.5', trend: 'rising', source: 'test', islandCode: '1234-5678-9012', description: 'A test map' }] };
  stage2Analysis(sample)
    .then(data => console.log(JSON.stringify(data, null, 2)))
    .catch(err => { console.error(err.message); process.exit(1); });
}
