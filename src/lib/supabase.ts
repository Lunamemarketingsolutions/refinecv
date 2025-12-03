import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if URL is valid (not a placeholder)
const isValidUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  // Check if it's a placeholder or invalid URL
  if (url.includes('your_supabase') || url.includes('placeholder') || url.trim() === '') {
    return false;
  }
  // Check if it's a valid HTTP/HTTPS URL
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

// Create a mock Supabase client if env vars are missing (for pages that don't need it)
const createMockClient = (): SupabaseClient => {
  const mockSubscription = {
    unsubscribe: () => {},
  };

  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: (callback: (event: string, session: any) => void) => {
        // Call callback immediately with null session to initialize auth state
        Promise.resolve().then(() => callback('INITIAL_SESSION', null));
        return { 
          data: { subscription: mockSubscription },
          error: null 
        };
      },
      signInWithPassword: async () => ({ 
        data: { user: null, session: null }, 
        error: { message: 'Supabase not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env.local file.' } as any 
      }),
      signInWithOAuth: async () => ({ 
        data: { url: null, provider: null }, 
        error: { message: 'Supabase not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env.local file.' } as any 
      }),
      signUp: async () => ({ 
        data: { user: null, session: null }, 
        error: { message: 'Supabase not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env.local file.' } as any 
      }),
      signOut: async () => ({ error: null }),
      resetPasswordForEmail: async () => ({ data: {}, error: null }),
    },
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: { message: 'Supabase not configured' } as any }),
      update: () => ({ data: null, error: { message: 'Supabase not configured' } as any }),
      delete: () => ({ data: null, error: { message: 'Supabase not configured' } as any }),
    } as any),
  } as any as SupabaseClient;
};

let supabase: SupabaseClient;

if (!isValidUrl(supabaseUrl) || !supabaseAnonKey || supabaseAnonKey.includes('your_supabase') || supabaseAnonKey.trim() === '') {
  console.warn('Missing or invalid Supabase environment variables. Some features may not work:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    isValidUrl: isValidUrl(supabaseUrl)
  });
  console.warn('Using mock Supabase client. Add valid VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env.local file for full functionality.');
  console.warn('See SUPABASE_SETUP.md for instructions on getting your credentials.');
  supabase = createMockClient();
} else {
  console.log('Supabase initialized with URL:', supabaseUrl);
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

export interface CVUpload {
  id: string;
  session_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  extracted_text: string | null;
  created_at: string;
}

export interface MatchedKeyword {
  keyword: string;
  cvCount: number;
  jdCount: number;
}

export interface MissingKeyword {
  keyword: string;
  jdCount: number;
  priority: 'High' | 'Medium' | 'Low';
  suggestion: string;
  example: string;
}

export interface PartialMatch {
  cvText: string;
  jdText: string;
  recommendation: string;
}

export interface ActionItem {
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  action: string;
  impact: string;
  time: string;
  suggestion?: string;
}

export interface CVAnalysis {
  id: string;
  session_id: string;
  cv_upload_id: string | null;
  cv_text: string;
  jd_text: string;
  match_score: number;
  matched_keywords: MatchedKeyword[];
  missing_keywords: MissingKeyword[];
  partial_matches: PartialMatch[];
  strengths: string[];
  weaknesses: string[];
  action_items: ActionItem[];
  analysis_metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}
