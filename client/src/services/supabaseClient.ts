import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseClient;

// Check if environment variables are properly configured
const isConfigured = supabaseUrl && 
                    supabaseAnonKey && 
                    supabaseUrl !== 'your-supabase-url' && 
                    supabaseAnonKey !== 'your-supabase-anon-key' &&
                    supabaseUrl.includes('supabase.co') &&
                    supabaseAnonKey.length > 50;

if (!isConfigured) {
  console.warn('Supabase environment variables not configured. Using mock mode.');
  // Create a mock client that won't make actual requests
  supabaseClient = {
    auth: {
      signUp: () => Promise.resolve({ 
        data: null, 
        error: { 
          message: 'Please click "Connect to Supabase" button in the top right to set up your database connection.' 
        } 
      }),
      signInWithPassword: () => Promise.resolve({ 
        data: null, 
        error: { 
          message: 'Please click "Connect to Supabase" button in the top right to set up your database connection.' 
        } 
      }),
      signOut: () => Promise.resolve({ error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    from: () => ({
      insert: () => ({ 
        select: () => ({ 
          single: () => Promise.resolve({ 
            data: null, 
            error: { message: 'Database not connected. Please set up Supabase.' } 
          }) 
        }) 
      }),
      update: () => ({ 
        eq: () => Promise.resolve({ 
          data: null, 
          error: { message: 'Database not connected. Please set up Supabase.' } 
        }) 
      }),
      select: () => Promise.resolve({ data: [], error: null })
    })
  };
} else {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
      }
    });
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    // Fallback to mock client if initialization fails
    supabaseClient = {
      auth: {
        signUp: () => Promise.resolve({ 
          data: null, 
          error: { 
            message: 'Supabase connection failed. Please check your configuration.' 
          } 
        }),
        signInWithPassword: () => Promise.resolve({ 
          data: null, 
          error: { 
            message: 'Supabase connection failed. Please check your configuration.' 
          } 
        }),
        signOut: () => Promise.resolve({ error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
      },
      from: () => ({
        insert: () => ({ 
          select: () => ({ 
            single: () => Promise.resolve({ 
              data: null, 
              error: { message: 'Database connection failed.' } 
            }) 
          }) 
        }),
        update: () => ({ 
          eq: () => Promise.resolve({ 
            data: null, 
            error: { message: 'Database connection failed.' } 
          }) 
        }),
        select: () => Promise.resolve({ data: [], error: null })
      })
    };
  }
}

export const supabase = supabaseClient;

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