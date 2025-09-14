const { v4: uuidv4 } = require('uuid');

/**
Expected event payload:
{
  "event_id": "<optional uuid>",
  "timestamp_utc": "2025-09-15T10:00:00Z",  // optional; server will fill if missing
  "user_id_hashed": "<sha256(user_id + salt)>",
  "assignment_id": "AdCreative_V1_vs_Control_2025-09-15|variant-A",
  "variant": "control|treatment",
  "impression_id": "<uuid>",
  "ad_id": "<ad>",
  "campaign_id": "<campaign>",
  "page_url": "<page url>",
  "device_type": "desktop|mobile|tablet",
  "geo_country": "LK",
  "session_id": "<session>",
  "event_type": "impression|click|signup|purchase|error",
  "conversion_value": 12.50
}
*/
exports.logEvent = async (req, res) => {
  const db = req.app.locals.db;
  try {
    const event = req.body || {};
    const now = new Date().toISOString();
    const event_id = event.event_id || uuidv4();
    const timestamp_utc = event.timestamp_utc || now;

    // basic validation
    if (!event.user_id_hashed || !event.assignment_id || !event.event_type) {
      return res.status(400).json({ error: 'user_id_hashed, assignment_id and event_type required' });
    }

    const insertSql = `
      INSERT INTO events(
        event_id, timestamp_utc, user_id_hashed, assignment_id, variant,
        impression_id, ad_id, campaign_id, page_url, device_type, geo_country,
        session_id, event_type, conversion_value, experiment_version
      ) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      RETURNING id
    `;
    const values = [
      event_id, timestamp_utc, event.user_id_hashed, event.assignment_id, event.variant || null,
      event.impression_id || null, event.ad_id || null, event.campaign_id || null, event.page_url || null,
      event.device_type || null, event.geo_country || null, event.session_id || null, event.event_type, event.conversion_value || null,
      event.experiment_version || null
    ];

    const { rows } = await db.query(insertSql, values);
    return res.json({ ok: true, inserted: rows[0] });
  } catch (err) {
    console.error('logEvent error', err);
    return res.status(500).json({ error: 'internal error' });
  }
};
