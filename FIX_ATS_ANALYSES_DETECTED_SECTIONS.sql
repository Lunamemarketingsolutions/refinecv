-- Fix: Add detected_sections column to ats_analyses table
-- This column is required for saving ATS analyses

-- Add detected_sections column if it doesn't exist
ALTER TABLE ats_analyses 
ADD COLUMN IF NOT EXISTS detected_sections jsonb DEFAULT '[]'::jsonb;

-- Add index for querying detected sections (if it doesn't exist)
CREATE INDEX IF NOT EXISTS idx_ats_analyses_detected_sections 
ON ats_analyses USING gin(detected_sections);

-- Verify the column was added
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'ats_analyses' 
  AND column_name = 'detected_sections';

