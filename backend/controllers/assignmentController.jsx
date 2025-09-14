const { hmacHash, hexToBucket } = require('../utils/hash.jsx');
const experimentsState = {}; // in-memory kill switch (for demo). Replace with persistent store in prod.

const DEFAULT_BUCKETS = 10000;

/**
 * Request body:
 * {
 *   "experiment_id": "AdCreative_V1_vs_Control_2025-09-15",
 *   "user_id": "user-123",
 *   "variants": [
 *      {"name":"control", "allocation": 50},
 *      {"name":"treatment", "allocation": 50}
 *   ]
 * }
 */
exports.assignVariant = async (req, res) => {
  try {
    const { experiment_id, user_id, variants } = req.body;
    if (!experiment_id || !user_id || !Array.isArray(variants) || variants.length === 0) {
      return res.status(400).json({ error: 'experiment_id, user_id, variants are required' });
    }

    // Check kill-switch
    const killed = experimentsState[experiment_id] && experimentsState[experiment_id].killed;
    if (killed) {
      return res.json({ experiment_id, variant: 'control', assignment_id: `${experiment_id}|control`, killer: true });
    }

    // Build allocation table: each variant gets a contiguous bucket range
    const totalAllocation = variants.reduce((s, v) => s + (v.allocation || 0), 0);
    if (totalAllocation <= 0) {
      return res.status(400).json({ error: 'Total allocation must be > 0' });
    }

    // normalize allocations to bucket counts
    let cumulative = 0;
    const ranges = variants.map(v => {
      const portion = (v.allocation || 0) / totalAllocation;
      const start = cumulative;
      const end = Math.floor((cumulative + portion) * DEFAULT_BUCKETS) - 1;
      cumulative = Math.floor((cumulative + portion) * DEFAULT_BUCKETS);
      return { name: v.name, start, end, meta: v.meta || {} };
    });

    // compute deterministic bucket
    const seed = process.env.HASH_SEED || 'default-seed';
    const salt = process.env.HMAC_SALT || 'temp-salt';
    const combined = `${user_id}|${experiment_id}|${seed}`;
    const hex = hmacHash(salt, combined);
    const bucket = hexToBucket(hex, DEFAULT_BUCKETS);

    // find variant
    const found = ranges.find(r => bucket >= r.start && bucket <= r.end) || ranges[0];
    const assignment_id = `${experiment_id}|${found.name}`;

    return res.json({
      experiment_id,
      user_id,
      variant: found.name,
      assignment_id,
      bucket,
      ranges
    });
  } catch (err) {
    console.error('assign error', err);
    res.status(500).json({ error: 'internal error' });
  }
};

exports.setKillSwitch = async (req, res) => {
  try {
    const { experimentId } = req.params;
    const { kill } = req.body; // { kill: true|false }
    if (!experimentId) return res.status(400).json({ error: 'experimentId required' });
    experimentsState[experimentId] = experimentsState[experimentId] || {};
    experimentsState[experimentId].killed = !!kill;
    return res.json({ experimentId, killed: experimentsState[experimentId].killed });
  } catch (err) {
    console.error('kill switch error', err);
    res.status(500).json({ error: 'internal error' });
  }
};

exports.getKillSwitchStatus = async (req, res) => {
  const experimentId = req.params.experimentId;
  const state = experimentsState[experimentId] || { killed: false };
  res.json({ experimentId, killed: !!state.killed });
};
