/*
  # Add user_id to existing tables

  1. Changes
    - Add user_id column to cv_uploads table
    - Add user_id column to cv_analyses table
    - Add tool_type column to cv_analyses for tracking which tool was used
    - Add ats_score column to cv_analyses for ATS pass rate tracking
    - Update RLS policies to use user_id instead of session_id
    
  2. Security
    - Update RLS policies for user-based access
*/

-- Add user_id to cv_uploads if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cv_uploads' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE cv_uploads ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
    CREATE INDEX idx_cv_uploads_user_id ON cv_uploads(user_id);
  END IF;
END $$;

-- Add user_id and additional columns to cv_analyses if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cv_analyses' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE cv_analyses ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
    CREATE INDEX idx_cv_analyses_user_id ON cv_analyses(user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cv_analyses' AND column_name = 'tool_type'
  ) THEN
    ALTER TABLE cv_analyses ADD COLUMN tool_type text CHECK (tool_type IN ('ats_analyzer', 'jd_matcher', 'cv_enhancer'));
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cv_analyses' AND column_name = 'ats_score'
  ) THEN
    ALTER TABLE cv_analyses ADD COLUMN ats_score integer DEFAULT 0;
  END IF;
END $$;

-- Drop old session-based policies
DROP POLICY IF EXISTS "Users can read their own CV uploads" ON cv_uploads;
DROP POLICY IF EXISTS "Users can insert their own CV uploads" ON cv_uploads;
DROP POLICY IF EXISTS "Users can read their own CV analyses" ON cv_analyses;
DROP POLICY IF EXISTS "Users can insert their own CV analyses" ON cv_analyses;

-- Create new user-based policies for cv_uploads
CREATE POLICY "Users can view own CV uploads"
  ON cv_uploads FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own CV uploads"
  ON cv_uploads FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own CV uploads"
  ON cv_uploads FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own CV uploads"
  ON cv_uploads FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create new user-based policies for cv_analyses
CREATE POLICY "Users can view own CV analyses"
  ON cv_analyses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own CV analyses"
  ON cv_analyses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own CV analyses"
  ON cv_analyses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own CV analyses"
  ON cv_analyses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
