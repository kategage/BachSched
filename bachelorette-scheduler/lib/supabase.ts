import { createClient } from '@supabase/supabase-js';

// Use placeholder values if environment variables are not set (for build time)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface Participant {
  id: string;
  name: string;
  unique_id: string;
  submission_timestamp: string;
  last_updated: string;
  created_at: string;
}

export interface Availability {
  id: string;
  participant_id: string;
  date: string;
  status: 'yes' | 'no' | 'maybe';
  created_at: string;
  updated_at: string;
}

export interface AvailabilityInput {
  date: string;
  status: 'yes' | 'no' | 'maybe';
}
