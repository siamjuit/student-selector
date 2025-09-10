import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Please check your .env file.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);

// Database schema for reference:
// CREATE TABLE selected_students (
//   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//   email TEXT UNIQUE NOT NULL,
//   added_at TIMESTAMPTZ DEFAULT NOW()
// );
// CREATE INDEX idx_selected_students_email ON selected_students(email);