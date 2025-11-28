/*
  # Create JD Match Analysis Schema

  1. New Tables
    - `jd_matches`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `cv_upload_id` (uuid, references cv_uploads)
      - `jd_text` (text) - job description content
      - `jd_source` (text) - paste/pdf/docx/txt/image
      - `jd_metadata` (jsonb) - file info, detected role, company
      - `overall_score` (integer) - 0-100 match percentage
      - `matched_keywords` (jsonb) - array of matched keywords with details
      - `partial_matches` (jsonb) - array of partial match keywords
      - `missing_keywords` (jsonb) - array of missing keywords with suggestions
      - `strengths` (jsonb) - array of strength analyses
      - `weaknesses` (jsonb) - array of weakness analyses
      - `action_items` (jsonb) - prioritized recommendations
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on jd_matches table
    - Add policies for users to read/write their own analyses
*/

-- Create jd_matches table
CREATE TABLE IF NOT EXISTS jd_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cv_upload_id uuid REFERENCES cv_uploads(id) ON DELETE SET NULL,
  jd_text text NOT NULL DEFAULT '',
  jd_source text DEFAULT 'paste' CHECK (jd_source IN ('paste', 'pdf', 'docx', 'txt', 'image')),
  jd_metadata jsonb DEFAULT '{}'::jsonb,
  overall_score integer NOT NULL DEFAULT 0 CHECK (overall_score >= 0 AND overall_score <= 100),
  matched_keywords jsonb DEFAULT '[]'::jsonb,
  partial_matches jsonb DEFAULT '[]'::jsonb,
  missing_keywords jsonb DEFAULT '[]'::jsonb,
  strengths jsonb DEFAULT '[]'::jsonb,
  weaknesses jsonb DEFAULT '[]'::jsonb,
  action_items jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_jd_matches_user_id ON jd_matches(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jd_matches_cv_upload_id ON jd_matches(cv_upload_id);
CREATE INDEX IF NOT EXISTS idx_jd_matches_score ON jd_matches(overall_score);

-- Enable RLS
ALTER TABLE jd_matches ENABLE ROW LEVEL SECURITY;

-- Policies for jd_matches
CREATE POLICY "Users can view own JD matches"
  ON jd_matches FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own JD matches"
  ON jd_matches FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own JD matches"
  ON jd_matches FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own JD matches"
  ON jd_matches FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Trigger for updated_at on jd_matches
DROP TRIGGER IF EXISTS update_jd_matches_updated_at ON jd_matches;
CREATE TRIGGER update_jd_matches_updated_at
  BEFORE UPDATE ON jd_matches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
