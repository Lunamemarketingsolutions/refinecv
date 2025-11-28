/*
  # Add Sample Flag to Tool Tables

  1. Changes
    - Add is_sample boolean column to cv_uploads, ats_analyses, jd_matches, cv_enhancements tables
    - Default value is false (for real user data)
    - Add indexes for performance when querying sample data
    - Allows distinguishing between real user data and demo/sample results

  2. Purpose
    - Enable "Show Sample Result" feature on dashboard
    - Users can preview tool results without uploading files
    - Sample data clearly separated from real user data
    - Fast queries with indexed is_sample column
*/

-- Add is_sample column to cv_uploads
ALTER TABLE cv_uploads 
ADD COLUMN IF NOT EXISTS is_sample BOOLEAN DEFAULT false;

-- Add is_sample column to ats_analyses
ALTER TABLE ats_analyses 
ADD COLUMN IF NOT EXISTS is_sample BOOLEAN DEFAULT false;

-- Add is_sample column to jd_matches
ALTER TABLE jd_matches 
ADD COLUMN IF NOT EXISTS is_sample BOOLEAN DEFAULT false;

-- Add is_sample column to cv_enhancements
ALTER TABLE cv_enhancements 
ADD COLUMN IF NOT EXISTS is_sample BOOLEAN DEFAULT false;

-- Add is_sample column to cv_enhancement_sections
ALTER TABLE cv_enhancement_sections 
ADD COLUMN IF NOT EXISTS is_sample BOOLEAN DEFAULT false;

-- Add is_sample column to cv_bullets
ALTER TABLE cv_bullets 
ADD COLUMN IF NOT EXISTS is_sample BOOLEAN DEFAULT false;

-- Create indexes for faster querying of sample data
CREATE INDEX IF NOT EXISTS idx_cv_uploads_is_sample 
ON cv_uploads(is_sample) 
WHERE is_sample = true;

CREATE INDEX IF NOT EXISTS idx_ats_analyses_is_sample 
ON ats_analyses(is_sample) 
WHERE is_sample = true;

CREATE INDEX IF NOT EXISTS idx_jd_matches_is_sample 
ON jd_matches(is_sample) 
WHERE is_sample = true;

CREATE INDEX IF NOT EXISTS idx_cv_enhancements_is_sample 
ON cv_enhancements(is_sample) 
WHERE is_sample = true;

-- Create composite index for user + sample queries
CREATE INDEX IF NOT EXISTS idx_cv_uploads_user_sample 
ON cv_uploads(user_id, is_sample);

CREATE INDEX IF NOT EXISTS idx_ats_analyses_user_sample 
ON ats_analyses(user_id, is_sample);

CREATE INDEX IF NOT EXISTS idx_jd_matches_user_sample 
ON jd_matches(user_id, is_sample);

CREATE INDEX IF NOT EXISTS idx_cv_enhancements_user_sample 
ON cv_enhancements(user_id, is_sample);