-- events table for experiments
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  event_id UUID NOT NULL,
  timestamp_utc TIMESTAMP WITH TIME ZONE NOT NULL,
  user_id_hashed TEXT NOT NULL,
  assignment_id TEXT NOT NULL,
  variant TEXT,
  impression_id UUID,
  ad_id TEXT,
  campaign_id TEXT,
  page_url TEXT,
  device_type TEXT,
  geo_country TEXT,
  session_id TEXT,
  event_type TEXT NOT NULL,
  conversion_value NUMERIC,
  experiment_version TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_events_assignment ON events(assignment_id);
CREATE INDEX idx_events_user ON events(user_id_hashed);
CREATE INDEX idx_events_event_type ON events(event_type);
