import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  // For static builds, use hardcoded values since env vars aren't available at runtime
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lnmrpwmtvscsczslzvec.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxubXJwd210dnNjc2N6c2x6dmVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNDU1MjAsImV4cCI6MjA2OTcyMTUyMH0.ezg1YgFm3k3yXXCtKbI844tRbh7v2WXwnvD9jnIc7pY';
  
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}