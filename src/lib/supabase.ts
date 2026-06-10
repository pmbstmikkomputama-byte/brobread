import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || "https://jdyojeyeetsbvcsiueae.supabase.co";
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkeW9qZXllZXRzYnZjc2l1ZWFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNTM0OTMsImV4cCI6MjA5NjYyOTQ5M30.YYVFhSL1vUxBVsrOAC9lcX7rF0DsvQwf3f3pamsf5dE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
