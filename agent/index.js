require('dotenv').config();
const stage1TrendScan = require('./stages/1-trend-scan');
const stage2Analysis = require('./stages/2-analysis');
const stage3Scoring = require('./stages/3-scoring');
const stage4Clone = require('./stages/4-clone');
const stage5BuildGuide = require('./stages/5-build-guide');
const stage6Marketing = require('./stages/6-marketing');
const mcpGmail = require('./mcps/gmail');
const mcpCalendar = require('./mcps/calendar');

function checkEnvVars() {
  const required = ['ANTHROPIC_API_KEY'];
  const optional = ['YOUTUBE_API_KEY', 'CURSEFORGE_API_KEY'];

  required.forEach(key => {
    if (!process.env[key]) throw new Error(`Missing required env var: ${key}`);
  });

  optional.forEach(key => {
    if (!process.env[key]) {
      console.warn(`[agent] Warning: ${key} not set — some features disabled`);
    }
  });
}

async function runAgent() {
  checkEnvVars();

  console.log('[agent] Stage 1: Scanning trending maps...');
  const trendData = await stage1TrendScan();

  console.log('[agent] Stage 2: Analyzing player behavior...');
  const analysisData = await stage2Analysis(trendData);

  console.log('[agent] Stage 3: Scoring opportunities...');
  const scoredData = await stage3Scoring(analysisData);

  console.log('[agent] Stage 4: Generating map concept...');
  const concept = await stage4Clone(scoredData, analysisData);

  console.log('[agent] Stage 5: Writing build guide...');
  const buildGuide = await stage5BuildGuide(concept);

  console.log('[agent] Stage 6: Creating marketing package...');
  const marketing = await stage6Marketing(concept, analysisData);

  console.log('[agent] MCP: Sending influencer emails...');
  await mcpGmail(marketing.influencerDMs);

  console.log('[agent] MCP: Creating posting calendar...');
  await mcpCalendar(marketing.calendar);

  return {
    opportunity: scoredData.winner,
    concept,
    buildGuide,
    marketing
  };
}

module.exports = { runAgent };

// Run directly
if (require.main === module) {
  runAgent()
    .then(result => {
      console.log('\n=== AGENT COMPLETE ===');
      console.log(JSON.stringify(result, null, 2));
    })
    .catch(err => {
      console.error('[agent] Fatal error:', err.message);
      process.exit(1);
    });
}
