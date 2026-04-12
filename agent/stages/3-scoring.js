require('dotenv').config();
const { callClaude } = require('../claude');

const SYSTEM_PROMPT = `You are a game business analyst and market opportunity evaluator.

Given trend data and player analysis, score each map opportunity on 4 dimensions
(each 0-25, total 0-100):

1. TREND_VELOCITY (0-25): How fast is it growing right now?
   25 = exploding this week, 10 = steady growth, 0 = declining

2. COMPETITION_GAP (0-25): How much room is there for a similar but better map?
   25 = almost no competitors, 10 = some competition, 0 = oversaturated

3. PLAYER_DEMAND (0-25): How loudly are players asking for improvements?
   25 = tons of complaints + feature requests = clear opportunity
   0 = players love it as-is = hard to improve

4. BUILD_FEASIBILITY (0-25): How achievable is building this in UEFN/Minecraft?
   25 = simple mechanics, easy to build fast
   0 = requires advanced programming, months of work

Pick the WINNER — highest total score.
Explain WHY in plain English.
Return ONLY valid JSON.`;

async function stage3Scoring(analysisData) {
  const userPrompt = `Score these map opportunities and pick the best one to clone and improve:
${JSON.stringify(analysisData.analyses, null, 2)}

Return this JSON:
{
  "scores": [
    {
      "mapName": "name",
      "platform": "platform",
      "trendVelocity": 20,
      "competitionGap": 18,
      "playerDemand": 22,
      "buildFeasibility": 21,
      "totalScore": 81,
      "reasoning": "why this scored this way"
    }
  ],
  "winner": {
    "mapName": "winning map name",
    "platform": "platform",
    "totalScore": 81,
    "whyWin": "plain English explanation of why this is the best opportunity",
    "keyInsight": "the single most important thing players want that doesn't exist yet"
  }
}`;

  return callClaude(SYSTEM_PROMPT, userPrompt);
}

module.exports = stage3Scoring;

if (require.main === module) {
  const sample = { analyses: [{ mapName: 'Test Map', platform: 'Fortnite', favoriteWeapons: ['AR'], lovedMechanics: ['fast respawn'], topComplaints: ['no variety'], requestedFeatures: ['more zones'], avgSessionMinutes: 20, retentionHooks: ['leaderboard'], visualStyle: 'colorful', playerQuotes: ['great game!'], overallSentiment: 'positive' }] };
  stage3Scoring(sample)
    .then(data => console.log(JSON.stringify(data, null, 2)))
    .catch(err => { console.error(err.message); process.exit(1); });
}
