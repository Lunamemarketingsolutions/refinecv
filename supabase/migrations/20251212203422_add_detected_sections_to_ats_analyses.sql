/*
  # Add Detected Sections to ATS Analyses

  Adds a `detected_sections` JSONB field to the `ats_analyses` table
  to store detailed section detection data from PDF analysis.
*/

-- Add detected_sections column to ats_analyses
ALTER TABLE ats_analyses 
ADD COLUMN IF NOT EXISTS detected_sections jsonb DEFAULT '[]'::jsonb;

-- Add index for querying detected sections
CREATE INDEX IF NOT EXISTS idx_ats_analyses_detected_sections 
ON ats_analyses USING gin(detected_sections);

