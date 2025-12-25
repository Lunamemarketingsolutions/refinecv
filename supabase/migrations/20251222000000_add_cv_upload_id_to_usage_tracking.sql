/*
  # Add cv_upload_id to usage_tracking table

  1. New Column
    - `cv_upload_id` (uuid, nullable, references cv_uploads)
    - Links usage records to actual CV uploads (source of truth)
  
  2. Indexes
    - Index on cv_upload_id for fast lookups
    - Composite index on (user_id, tool_type) for count queries
    - Composite index on (user_id, tool_type, created_at) for history queries
  
  3. Purpose
    - Track which CV upload triggered each usage
    - Enable accurate counting of uploads per feature
    - Support usage history with file names
*/

-- Add cv_upload_id column
ALTER TABLE usage_tracking 
ADD COLUMN IF NOT EXISTS cv_upload_id uuid REFERENCES cv_uploads(id) ON DELETE SET NULL;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_usage_tracking_cv_upload_id 
ON usage_tracking(cv_upload_id);

CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_tool 
ON usage_tracking(user_id, tool_type);

CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_tool_created 
ON usage_tracking(user_id, tool_type, created_at DESC);

-- Add comment for documentation
COMMENT ON COLUMN usage_tracking.cv_upload_id IS 'References the cv_uploads record that triggered this usage. More reliable than analysis_id for tracking uploads.';

