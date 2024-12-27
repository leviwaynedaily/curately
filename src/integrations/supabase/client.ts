import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kimuizodlerwiullbati.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpbXVpem9kbGVyd2l1bGxiYXRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyNjQyOTksImV4cCI6MjA1MDg0MDI5OX0.c6MQCA1ZbMujCUxtDMFHhfuqqA3XN0szJQK9r-FVBR0";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-my-custom-header': 'my-app-name',
    },
  },
  // Built-in retry configuration
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Add a health check function
export const checkSupabaseConnection = async () => {
  try {
    console.log('Checking Supabase connection...');
    const { data, error } = await supabase
      .from('tenants')
      .select('id')
      .limit(1)
      .single();
    
    if (error) {
      console.error('Supabase connection check failed:', error);
      return false;
    }
    
    console.log('Supabase connection successful');
    return true;
  } catch (error) {
    console.error('Supabase connection check failed with exception:', error);
    return false;
  }
};

// Initialize connection check
checkSupabaseConnection().then(isConnected => {
  console.log('Initial connection check result:', isConnected);
});