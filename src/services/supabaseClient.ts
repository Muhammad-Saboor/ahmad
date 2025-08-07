import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your-supabase-url' || supabaseAnonKey === 'your-supabase-anon-key') {
  console.warn('Supabase environment variables not configured. Using mock mode.');
  // Create a mock client that won't make actual requests
  export const supabase = {
    auth: {
      signUp: () => Promise.resolve({ data: null, error: { message: 'Please configure Supabase environment variables' } }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Please configure Supabase environment variables' } }),
      signOut: () => Promise.resolve({ error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    from: () => ({
      insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: { message: 'Please configure Supabase environment variables' } }) }) }),
      update: () => ({ eq: () => Promise.resolve({ data: null, error: { message: 'Please configure Supabase environment variables' } }) }),
      select: () => Promise.resolve({ data: [], error: null })
    })
  };
} else {
  export const supabase = createClient(supabaseUrl, supabaseAnonKey);
}


export type Profile = {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
};

export type Assessment = {
  id: string;
  user_id: string;
  created_at: string;
  completed_at: string | null;
  responses: any[];
  results: any;
};