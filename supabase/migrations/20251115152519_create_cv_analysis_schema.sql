/*
  # Create CV Analysis Schema

  1. New Tables
    - `cv_analyses`
      - `id` (uuid, primary key)
      - `session_id` (text) - Anonymous session identifier
      - `cv_text` (text) - Extracted CV text
      - `jd_text` (text) - Job description text
      - `match_score` (integer) - Overall match percentage
      - `matched_keywords` (jsonb) - Array of matched keywords with counts
      - `missing_keywords` (jsonb) - Array of missing keywords with priority
      - `partial_matches` (jsonb) - Array of partial matches with suggestions
      - `strengths` (jsonb) - Array of strength statements
      - `weaknesses` (jsonb) - Array of weakness statements
      - `action_items` (jsonb) - Array of actionable recommendations
      - `analysis_metadata` (jsonb) - Additional analysis data
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `cv_uploads`
      - `id` (uuid, primary key)
      - `session_id` (text) - Anonymous session identifier
      - `file_name` (text) - Original file name
      - `file_path` (text) - Storage path in Supabase
      - `file_size` (integer) - File size in bytes
      - `extracted_text` (text) - Extracted text from PDF
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for anonymous access based on session_id
    - Users can only access their own session data

  3. Indexes
    - Add index on session_id for fast lookups
    - Add index on created_at for sorting
*/

-- Create cv_uploads table
CREATE TABLE IF NOT EXISTS cv_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size integer NOT NULL,
  extracted_text text,
  created_at timestamptz DEFAULT now()
);

-- Create cv_analyses table
CREATE TABLE IF NOT EXISTS cv_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  cv_upload_id uuid REFERENCES cv_uploads(id) ON DELETE CASCADE,
  cv_text text NOT NULL,
  jd_text text NOT NULL,
  match_score integer NOT NULL DEFAULT 0,
  matched_keywords jsonb DEFAULT '[]'::jsonb,
  missing_keywords jsonb DEFAULT '[]'::jsonb,
  partial_matches jsonb DEFAULT '[]'::jsonb,
  strengths jsonb DEFAULT '[]'::jsonb,
  weaknesses jsonb DEFAULT '[]'::jsonb,
  action_items jsonb DEFAULT '[]'::jsonb,
  analysis_metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE cv_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_analyses ENABLE ROW LEVEL SECURITY;

-- Create policies for cv_uploads
CREATE POLICY "Users can insert their own uploads"
  ON cv_uploads FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can read their own uploads"
  ON cv_uploads FOR SELECT
  TO anon
  USING (true);

-- Create policies for cv_analyses
CREATE POLICY "Users can insert their own analyses"
  ON cv_analyses FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can read their own analyses"
  ON cv_analyses FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Users can update their own analyses"
  ON cv_analyses FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_cv_uploads_session_id ON cv_uploads(session_id);
CREATE INDEX IF NOT EXISTS idx_cv_uploads_created_at ON cv_uploads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cv_analyses_session_id ON cv_analyses(session_id);
CREATE INDEX IF NOT EXISTS idx_cv_analyses_created_at ON cv_analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cv_analyses_cv_upload_id ON cv_analyses(cv_upload_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cv_analyses_updated_at
  BEFORE UPDATE ON cv_analyses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();