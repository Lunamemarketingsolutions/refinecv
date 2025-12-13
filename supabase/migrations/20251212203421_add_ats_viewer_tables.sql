/*
  # Create ATS Viewer Tables

  1. New Tables
    - `resume_suggestions`
      - `id` (uuid, primary key)
      - `cv_upload_id` (uuid, foreign key to cv_uploads)
      - `user_id` (uuid, references auth.users)
      - `section_name` (text) - Name of the problematic section
      - `section_key` (text) - Normalized key for the section
      - `original_content` (text) - Original text extracted from the section
      - `suggested_content` (text) - AI-generated ATS-friendly alternative
      - `suggestion_reason` (text) - Explanation of why this suggestion helps
      - `status` (text) - Status: 'pending', 'accepted', 'rejected'
      - `line_number` (integer) - Line number where section starts in PDF
      - `coordinates` (jsonb) - Bounding box coordinates for overlay positioning
      - `estimated_score_improvement` (integer) - Expected ATS score increase
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `resume_edits`
      - `id` (uuid, primary key)
      - `cv_upload_id` (uuid, foreign key to cv_uploads)
      - `user_id` (uuid, references auth.users)
      - `suggestion_id` (uuid, foreign key to resume_suggestions, nullable)
      - `edit_type` (text) - Type of edit: 'suggestion_applied', 'manual_edit', 'rollback'
      - `section_affected` (text) - Name of section that was edited
      - `changes_made` (jsonb) - Details of what changed
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create resume_suggestions table
CREATE TABLE IF NOT EXISTS resume_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cv_upload_id uuid NOT NULL REFERENCES cv_uploads(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  section_name text NOT NULL,
  section_key text NOT NULL,
  original_content text,
  suggested_content text NOT NULL,
  suggestion_reason text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  line_number integer,
  coordinates jsonb,
  estimated_score_improvement integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create resume_edits table
CREATE TABLE IF NOT EXISTS resume_edits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cv_upload_id uuid NOT NULL REFERENCES cv_uploads(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  suggestion_id uuid REFERENCES resume_suggestions(id) ON DELETE SET NULL,
  edit_type text NOT NULL CHECK (edit_type IN ('suggestion_applied', 'manual_edit', 'rollback')),
  section_affected text NOT NULL,
  changes_made jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE resume_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_edits ENABLE ROW LEVEL SECURITY;

-- Policies for resume_suggestions
CREATE POLICY "Users can view own resume suggestions"
  ON resume_suggestions FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own resume suggestions"
  ON resume_suggestions FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own resume suggestions"
  ON resume_suggestions FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own resume suggestions"
  ON resume_suggestions FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Policies for resume_edits
CREATE POLICY "Users can view own resume edits"
  ON resume_edits FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own resume edits"
  ON resume_edits FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_resume_suggestions_cv_upload_id 
  ON resume_suggestions(cv_upload_id);

CREATE INDEX IF NOT EXISTS idx_resume_suggestions_user_id 
  ON resume_suggestions(user_id);

CREATE INDEX IF NOT EXISTS idx_resume_suggestions_status 
  ON resume_suggestions(status);

CREATE INDEX IF NOT EXISTS idx_resume_edits_cv_upload_id 
  ON resume_edits(cv_upload_id);

CREATE INDEX IF NOT EXISTS idx_resume_edits_user_id 
  ON resume_edits(user_id);

CREATE INDEX IF NOT EXISTS idx_resume_edits_suggestion_id 
  ON resume_edits(suggestion_id);

-- Add updated_at trigger for resume_suggestions
CREATE TRIGGER update_resume_suggestions_updated_at 
  BEFORE UPDATE ON resume_suggestions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

