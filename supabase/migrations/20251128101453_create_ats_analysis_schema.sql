/*
  # Create ATS Analysis Schema

  1. New Tables
    - `ats_analyses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `cv_upload_id` (uuid, references cv_uploads)
      - `overall_score` (integer) - 0-100 score
      - `critical_issues` (jsonb) - array of critical issues
      - `warnings` (jsonb) - array of warnings
      - `passed_checks` (jsonb) - array of passed checks
      - `ats_text_extraction` (text) - raw text extracted by ATS
      - `section_scores` (jsonb) - scores for each section
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on ats_analyses table
    - Add policies for users to read/write their own analyses
*/

-- Create ats_analyses table
CREATE TABLE IF NOT EXISTS ats_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cv_upload_id uuid REFERENCES cv_uploads(id) ON DELETE SET NULL,
  overall_score integer NOT NULL DEFAULT 0 CHECK (overall_score >= 0 AND overall_score <= 100),
  critical_issues jsonb DEFAULT '[]'::jsonb,
  warnings jsonb DEFAULT '[]'::jsonb,
  passed_checks jsonb DEFAULT '[]'::jsonb,
  ats_text_extraction text DEFAULT '',
  section_scores jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ats_analyses_user_id ON ats_analyses(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ats_analyses_cv_upload_id ON ats_analyses(cv_upload_id);

-- Enable RLS
ALTER TABLE ats_analyses ENABLE ROW LEVEL SECURITY;

-- Policies for ats_analyses
CREATE POLICY "Users can view own ATS analyses"
  ON ats_analyses FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own ATS analyses"
  ON ats_analyses FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own ATS analyses"
  ON ats_analyses FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own ATS analyses"
  ON ats_analyses FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Trigger for updated_at on ats_analyses
DROP TRIGGER IF EXISTS update_ats_analyses_updated_at ON ats_analyses;
CREATE TRIGGER update_ats_analyses_updated_at
  BEFORE UPDATE ON ats_analyses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
