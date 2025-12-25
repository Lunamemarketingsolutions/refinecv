-- Complete Fix: Add missing columns to jd_matches table
-- This ensures all required columns exist and refreshes schema cache

-- Step 1: Add missing columns
ALTER TABLE jd_matches 
ADD COLUMN IF NOT EXISTS resume_data jsonb DEFAULT '{}'::jsonb;

ALTER TABLE jd_matches 
ADD COLUMN IF NOT EXISTS recommendations jsonb DEFAULT '[]'::jsonb;

ALTER TABLE jd_matches 
ADD COLUMN IF NOT EXISTS applied_recommendations jsonb DEFAULT '[]'::jsonb;

-- Step 2: Add indexes for querying these columns
CREATE INDEX IF NOT EXISTS idx_jd_matches_resume_data 
ON jd_matches USING gin(resume_data);

CREATE INDEX IF NOT EXISTS idx_jd_matches_recommendations 
ON jd_matches USING gin(recommendations);

-- Step 3: Verify the columns were added
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'jd_matches' 
  AND column_name IN ('resume_data', 'recommendations', 'applied_recommendations')
ORDER BY column_name;

-- Step 4: Refresh schema cache (if using PostgREST/Supabase)
-- Note: This might require admin access or Supabase dashboard refresh
-- The schema cache should auto-refresh, but if it doesn't, you may need to:
-- 1. Wait a few seconds after running this script
-- 2. Or restart the Supabase project
-- 3. Or manually refresh in Supabase dashboard

-- Step 5: Verify table structure
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'jd_matches'
ORDER BY ordinal_position;

