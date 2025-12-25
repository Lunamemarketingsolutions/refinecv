-- Fix RLS Policy for cv_uploads
-- Run this in Supabase Dashboard → SQL Editor

-- Step 1: Drop the existing insert policy
DROP POLICY IF EXISTS "Users can insert own CV uploads" ON cv_uploads;

-- Step 2: Recreate the policy with correct syntax
CREATE POLICY "Users can insert own CV uploads"
  ON cv_uploads FOR INSERT
  TO authenticated
  WITH CHECK (
    (select auth.uid()) = user_id
  );

-- Step 3: Verify the policy was created
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'cv_uploads'
AND policyname = 'Users can insert own CV uploads';

-- Step 4: Also fix cv_enhancements if needed
DROP POLICY IF EXISTS "Users can create own enhancements" ON cv_enhancements;

CREATE POLICY "Users can create own enhancements"
  ON cv_enhancements FOR INSERT
  TO authenticated
  WITH CHECK (
    (select auth.uid()) = user_id
  );

-- Step 5: Test the policy (replace 'your-user-id' with actual user ID)
-- This should return your user ID if authenticated
SELECT auth.uid() as current_user_id;

