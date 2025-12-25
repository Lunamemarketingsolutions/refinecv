-- Fix: Add missing columns to jd_matches table
-- These columns are required for saving JD match analyses

-- Add resume_data column if it doesn't exist
ALTER TABLE jd_matches 
ADD COLUMN IF NOT EXISTS resume_data jsonb DEFAULT '{}'::jsonb;

-- Add recommendations column if it doesn't exist
ALTER TABLE jd_matches 
ADD COLUMN IF NOT EXISTS recommendations jsonb DEFAULT '[]'::jsonb;

-- Add applied_recommendations column if it doesn't exist
ALTER TABLE jd_matches 
ADD COLUMN IF NOT EXISTS applied_recommendations jsonb DEFAULT '[]'::jsonb;

-- Add indexes for querying these columns (if needed)
CREATE INDEX IF NOT EXISTS idx_jd_matches_resume_data 
ON jd_matches USING gin(resume_data);

CREATE INDEX IF NOT EXISTS idx_jd_matches_recommendations 
ON jd_matches USING gin(recommendations);

-- Verify the columns were added
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'jd_matches' 
  AND column_name IN ('resume_data', 'recommendations', 'applied_recommendations')
ORDER BY column_name;

