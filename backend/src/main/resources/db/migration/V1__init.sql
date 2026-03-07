CREATE TABLE app_user (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE incident_report (
  id BIGSERIAL PRIMARY KEY,
  reporter_id BIGINT REFERENCES app_user(id),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  incident_type TEXT NOT NULL,
  description TEXT,
  reported_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_incident_report_location ON incident_report (latitude, longitude);
CREATE INDEX idx_incident_report_type ON incident_report (incident_type);

CREATE TABLE safe_stop (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  opens_at TIME,
  closes_at TIME,
  is_24_hours BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_safe_stop_location ON safe_stop (latitude, longitude);
CREATE INDEX idx_safe_stop_category ON safe_stop (category);

CREATE TABLE walk_session (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES app_user(id),
  start_latitude DOUBLE PRECISION NOT NULL,
  start_longitude DOUBLE PRECISION NOT NULL,
  end_latitude DOUBLE PRECISION NOT NULL,
  end_longitude DOUBLE PRECISION NOT NULL,
  expected_arrival_at TIMESTAMPTZ NOT NULL,
  checked_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'ACTIVE'
);

CREATE INDEX idx_walk_session_user ON walk_session (user_id);
CREATE INDEX idx_walk_session_status ON walk_session (status);

CREATE TABLE route_score (
  id BIGSERIAL PRIMARY KEY,
  session_id BIGINT NOT NULL REFERENCES walk_session(id),
  route_type TEXT NOT NULL,
  risk_score DOUBLE PRECISION NOT NULL,
  confidence_level TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_route_score_session ON route_score (session_id);
CREATE INDEX idx_route_score_type ON route_score (route_type);
