import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey
  });
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

console.log('Supabase initialized with URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
