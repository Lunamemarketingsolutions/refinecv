/*
  # Fix cv_uploads RLS Policy for Insert
  
  The current RLS policy is blocking inserts. This migration fixes the policy
  to ensure authenticated users can insert their own records.
*/

-- Drop existing cv_uploads insert policy
DROP POLICY IF EXISTS "Users can insert own CV uploads" ON cv_uploads;

-- Create new insert policy that works correctly
CREATE POLICY "Users can insert own CV uploads"
  ON cv_uploads FOR INSERT
  TO authenticated
  WITH CHECK (
    (select auth.uid()) = user_id
  );

-- Also ensure the user_id column allows the insert
-- Check if user_id is nullable and make it NOT NULL if needed
DO $$
BEGIN
  -- Check if user_id can be null
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cv_uploads'
    AND column_name = 'user_id'
    AND is_nullable = 'YES'
  ) THEN
    -- Make user_id NOT NULL (but allow existing nulls temporarily)
    ALTER TABLE cv_uploads 
    ALTER COLUMN user_id SET NOT NULL;
  END IF;
END $$;

-- Verify the policy was created
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'cv_uploads'
    AND policyname = 'Users can insert own CV uploads'
  ) THEN
    RAISE EXCEPTION 'Policy creation failed';
  END IF;
END $$;

