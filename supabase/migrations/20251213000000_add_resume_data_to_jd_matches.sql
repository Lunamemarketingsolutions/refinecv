/*
  # Add Resume Data and Recommendations to JD Matches

  1. Changes
    - Add `resume_data` (jsonb) column to store structured resume data from AI
    - Add `recommendations` (jsonb) column to store AI-generated recommendations
    - Add `applied_recommendations` (jsonb) column to track which recommendations were applied
*/

-- Add resume_data column
ALTER TABLE jd_matches 
ADD COLUMN IF NOT EXISTS resume_data jsonb DEFAULT '{}'::jsonb;

-- Add recommendations column
ALTER TABLE jd_matches 
ADD COLUMN IF NOT EXISTS recommendations jsonb DEFAULT '[]'::jsonb;

-- Add applied_recommendations column
ALTER TABLE jd_matches 
ADD COLUMN IF NOT EXISTS applied_recommendations jsonb DEFAULT '[]'::jsonb;

-- Add index for querying by resume_data
CREATE INDEX IF NOT EXISTS idx_jd_matches_resume_data ON jd_matches USING gin(resume_data);

-- Add index for querying by recommendations
CREATE INDEX IF NOT EXISTS idx_jd_matches_recommendations ON jd_matches USING gin(recommendations);

