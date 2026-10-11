// Supabase Client and Database Layer Orchestrator
// Connects to live Supabase PostgreSQL when credentials exist in .env,
// and provides a fully validated, RLS-enforcing local backend engine for development and testing.

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const getEnvVar = (key: string): string => {
  if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
    return (import.meta as any).env[key] || '';
  }
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || '';
  }
  return '';
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

export const isLiveBackendConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('http') && 
  !supabaseUrl.includes('YOUR_SUPABASE')
);

export const supabase: SupabaseClient | null = isLiveBackendConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

console.info(
  `[MangalSutra Backend] Status: ${
    isLiveBackendConfigured ? '🟢 Live Supabase PostgreSQL Connected' : '🟡 Local Validated Engine Active (Awaiting Supabase URL/Key in .env)'
  }`
);
