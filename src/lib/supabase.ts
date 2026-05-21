import { createClient } from '@supabase/supabase-js';

// These should be configured in the AI Studio Secrets panel (.env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Real-time features will not work.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
