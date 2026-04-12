require('dotenv').config();
const { callClaude } = require('../claude');

const SYSTEM_PROMPT = `You are a viral gaming content strategist and social media expert
specializing in Fortnite, Minecraft, and Roblox creator marketing.

You know exactly what makes gaming content go viral on TikTok in 2026:
- Hook in the first 1.5 seconds (shock, curiosity, or challenge)
- Fast pacing, no wasted words
- Trending sounds and hashtags
- Direct CTA with island code

For YouTube: SEO-optimized titles, retention-focused descriptions.
For Reddit: community-native tone, no obvious self-promotion.
For influencer outreach: short, genuine, not spammy.

Return ONLY valid JSON. All content must be ready to use immediately — no placeholders.`;

async function stage6Marketing(concept, analysisData) {
  const playerQuotes = analysisData.analyses[0]?.playerQuotes || [];

  const userPrompt = `Create a complete viral marketing package for this map:
${JSON.stringify(concept, null, 2)}

Player insights to inform tone and hooks:
${JSON.stringify(playerQuotes, null, 2)}

Return this JSON:
{
  "marketing": {
    "tiktokScripts": [
      {
        "type": "shock_hook",
        "hook": "first 1.5 seconds - the scroll stopper",
        "body": "middle 20 seconds - the sell",
        "cta": "last 5 seconds - the call to action with island code",
        "fullScript": "complete word for word script",
        "suggestedSound": "type of trending sound to use",
        "duration": "28 seconds"
      },
      { "type": "curiosity_hook", "hook": "...", "body": "...", "cta": "...", "fullScript": "...", "duration": "30 seconds" },
      { "type": "challenge_hook", "hook": "...", "body": "...", "cta": "...", "fullScript": "...", "duration": "25 seconds" }
    ],
    "youtube": {
      "title": "SEO optimized title under 60 chars",
      "alternativeTitles": ["title 2", "title 3"],
      "description": "full YouTube description with timestamps and links",
      "tags": ["tag1", "tag2", "tag3"],
      "thumbnailBrief": "exact description of what thumbnail should show - colors, text, emotion, layout"
    },
    "redditPosts": [
      { "subreddit": "r/FortniteCreative", "title": "...", "body": "..." },
      { "subreddit": "r/gaming", "title": "...", "body": "..." },
      { "subreddit": "r/Minecraft", "title": "...", "body": "..." },
      { "subreddit": "r/gamedev", "title": "...", "body": "..." },
      { "subreddit": "r/FortNiteBR", "title": "...", "body": "..." }
    ],
    "discordMessage": "full Discord announcement ready to paste",
    "hashtags": {
      "tiktok": ["#hashtag1", "#hashtag2"],
      "youtube": ["hashtag1", "hashtag2"],
      "twitter": ["#hashtag1", "#hashtag2"]
    },
    "influencerDMs": [
      {
        "targetType": "small creator 1K-10K followers",
        "platform": "YouTube",
        "message": "full DM message ready to send"
      },
      {
        "targetType": "mid creator 10K-100K followers",
        "platform": "TikTok",
        "message": "full DM message ready to send"
      },
      {
        "targetType": "gaming Discord server owner",
        "platform": "Discord",
        "message": "full message ready to send"
      }
    ],
    "calendar": [
      {
        "day": 1,
        "date": "Day 1 - Launch Day",
        "platform": "TikTok",
        "contentType": "shock_hook video",
        "time": "6:00 PM",
        "notes": "use the shock hook script"
      }
    ]
  }
}`;

  const result = await callClaude(SYSTEM_PROMPT, userPrompt);
  return result.marketing;
}

module.exports = stage6Marketing;

if (require.main === module) {
  const concept = { name: 'Storm Surge Wars', platform: 'Fortnite', tagline: 'The ultimate zone wars experience' };
  const analysis = { analyses: [{ playerQuotes: ['best map ever'] }] };
  stage6Marketing(concept, analysis)
    .then(data => console.log(JSON.stringify(data, null, 2)))
    .catch(err => { console.error(err.message); process.exit(1); });
}
