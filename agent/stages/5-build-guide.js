require('dotenv').config();
const { callClaude } = require('../claude');

const SYSTEM_PROMPT = `You are a professional UEFN (Unreal Editor for Fortnite) map developer
with 3+ years of experience building published Fortnite Creative maps.

Given a map concept, write a complete step-by-step build guide that
a beginner can follow. Be specific about:
- Which UEFN devices to use and where
- Zone layout and sizing
- Weapon placer positions
- Verse scripting requirements (keep it simple)
- Common mistakes to avoid
- Time estimates per section

Also write the guide for Minecraft if the platform is Minecraft,
using WorldEdit and datapack terminology.

Return ONLY valid JSON.`;

async function stage5BuildGuide(concept) {
  const userPrompt = `Write a complete build guide for this map concept:
${JSON.stringify(concept, null, 2)}

Return this JSON:
{
  "buildGuide": {
    "overview": "what we're building in one paragraph",
    "estimatedTotalHours": 15,
    "difficulty": "Beginner|Intermediate|Advanced",
    "zones": [
      {
        "name": "zone name (e.g. Spawn Island)",
        "purpose": "what happens here",
        "size": "dimensions in Fortnite units",
        "devices": ["device 1", "device 2"],
        "buildSteps": ["step 1", "step 2", "step 3"],
        "estimatedHours": 2
      }
    ],
    "weaponPlacements": [
      { "weapon": "weapon name", "location": "where to place", "quantity": 3 }
    ],
    "keyDevices": [
      { "device": "device name", "setting": "important setting", "purpose": "why" }
    ],
    "verseScript": {
      "needed": true,
      "complexity": "Simple|Medium|Complex",
      "features": ["feature 1 that needs scripting"],
      "notes": "key Verse notes for beginner"
    },
    "testingChecklist": ["test item 1", "test item 2"],
    "commonMistakes": ["mistake 1 to avoid"],
    "publishingSteps": ["step 1", "step 2", "step 3"]
  }
}`;

  const result = await callClaude(SYSTEM_PROMPT, userPrompt);
  return result.buildGuide;
}

module.exports = stage5BuildGuide;

if (require.main === module) {
  const sample = { name: 'Storm Surge Wars', platform: 'Fortnite', gameMode: 'PvP', theme: 'futuristic', coreLoop: 'fight to survive' };
  stage5BuildGuide(sample)
    .then(data => console.log(JSON.stringify(data, null, 2)))
    .catch(err => { console.error(err.message); process.exit(1); });
}
