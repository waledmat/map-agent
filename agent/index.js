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
  const required = ['OPENROUTER_API_KEY'];
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

async function runAgent(onProgress = () => {}) {
  checkEnvVars();

  onProgress({ stage: 1, label: 'Scanning trending maps', status: 'running' });
  const trendData = await stage1TrendScan();
  onProgress({ stage: 1, label: 'Scanning trending maps', status: 'done' });

  onProgress({ stage: 2, label: 'Analyzing player behavior', status: 'running' });
  const analysisData = await stage2Analysis(trendData);
  onProgress({ stage: 2, label: 'Analyzing player behavior', status: 'done' });

  onProgress({ stage: 3, label: 'Scoring opportunities', status: 'running' });
  const scoredData = await stage3Scoring(analysisData);
  onProgress({ stage: 3, label: 'Scoring opportunities', status: 'done' });

  onProgress({ stage: 4, label: 'Generating map concept', status: 'running' });
  const concept = await stage4Clone(scoredData, analysisData);
  onProgress({ stage: 4, label: 'Generating map concept', status: 'done' });

  onProgress({ stage: 5, label: 'Writing build guide', status: 'running' });
  const buildGuide = await stage5BuildGuide(concept);
  onProgress({ stage: 5, label: 'Writing build guide', status: 'done' });

  onProgress({ stage: 6, label: 'Creating marketing package', status: 'running' });
  const marketing = await stage6Marketing(concept, analysisData);
  onProgress({ stage: 6, label: 'Creating marketing package', status: 'done' });

  onProgress({ stage: 7, label: 'Sending influencer emails', status: 'running' });
  await mcpGmail(marketing.influencerDMs);
  onProgress({ stage: 7, label: 'Sending influencer emails', status: 'done' });

  onProgress({ stage: 8, label: 'Creating posting calendar', status: 'running' });
  await mcpCalendar(marketing.calendar);
  onProgress({ stage: 8, label: 'Creating posting calendar', status: 'done' });

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
