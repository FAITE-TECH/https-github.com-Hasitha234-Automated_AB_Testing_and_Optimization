import { v4 as uuidv4 } from 'uuid';
import { logEvent } from '../api/experimentApi';

// A simple logger for impression/click/signup events
export const logger = {
  async logImpression({ user_id_hashed, assignment_id, ad_id, campaign_id, page_url, device_type, geo_country, session_id }) {
    const payload = {
      event_id: uuidv4(),
      timestamp_utc: new Date().toISOString(),
      user_id_hashed,
      assignment_id,
      variant: assignment_id.split('|').pop(),
      impression_id: uuidv4(),
      ad_id,
      campaign_id,
      page_url,
      device_type,
      geo_country,
      session_id,
      event_type: 'impression',
      experiment_version: 'v1'
    };
    return logEvent(payload);
  },

  async logClick({ user_id_hashed, assignment_id, impression_id, ...rest }) {
    const payload = {
      event_id: uuidv4(),
      timestamp_utc: new Date().toISOString(),
      user_id_hashed,
      assignment_id,
      variant: assignment_id.split('|').pop(),
      impression_id,
      ...rest,
      event_type: 'click',
      experiment_version: 'v1'
    };
    return logEvent(payload);
  },

  async logSignup({ user_id_hashed, assignment_id, conversion_value = null, ...rest }) {
    const payload = {
      event_id: uuidv4(),
      timestamp_utc: new Date().toISOString(),
      user_id_hashed,
      assignment_id,
      variant: assignment_id.split('|').pop(),
      ...rest,
      event_type: 'signup',
      conversion_value,
      experiment_version: 'v1'
    };
    return logEvent(payload);
  }
};
