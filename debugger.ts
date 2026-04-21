const { getOverallKPIMetrics, getRegionalKPIMetrics } = require('./lib/services/kpi-service');

async function test() {
  try {
    console.log('Testing Overall KPI...');
    const overall = await getOverallKPIMetrics(2026);
    console.log('Overall SUCCESS:', JSON.stringify(overall, null, 2));

    console.log('Testing Regional KPI...');
    const regional = await getRegionalKPIMetrics(2026);
    console.log('Regional SUCCESS:', JSON.stringify(regional, null, 2));
  } catch (err) {
    console.error('TEST FAILED:');
    console.error(err);
  }
}

test();
