-- Bachelorette Party Scheduler Database Schema
-- Run this SQL in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Participants table
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  unique_id TEXT UNIQUE NOT NULL,
  submission_timestamp TIMESTAMPTZ DEFAULT NOW(),
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Availability table
CREATE TABLE availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('yes', 'no', 'maybe')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(participant_id, date)
);

-- Create indexes for better query performance
CREATE INDEX idx_availability_participant_id ON availability(participant_id);
CREATE INDEX idx_availability_date ON availability(date);
CREATE INDEX idx_participants_unique_id ON participants(unique_id);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_availability_updated_at BEFORE UPDATE ON availability
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_participants_last_updated BEFORE UPDATE ON participants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow all operations for now (you can restrict this further if needed)
CREATE POLICY "Allow all operations on participants" ON participants FOR ALL USING (true);
CREATE POLICY "Allow all operations on availability" ON availability FOR ALL USING (true);

-- Optional: Create a view for easy admin dashboard queries
CREATE OR REPLACE VIEW admin_availability_summary AS
SELECT
  p.name,
  p.unique_id,
  a.date,
  a.status,
  p.submission_timestamp
FROM participants p
LEFT JOIN availability a ON p.id = a.participant_id
ORDER BY a.date, p.name;

-- Grant permissions on the view
GRANT SELECT ON admin_availability_summary TO anon, authenticated;
