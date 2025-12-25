-- Complete RLS Fix for cv_uploads
-- This removes ALL policies and recreates them correctly

-- Step 1: Disable RLS temporarily to clear all policies
ALTER TABLE cv_uploads DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies
DROP POLICY IF EXISTS "Users can view own CV uploads" ON cv_uploads;
DROP POLICY IF EXISTS "Users can insert own CV uploads" ON cv_uploads;
DROP POLICY IF EXISTS "Users can update own CV uploads" ON cv_uploads;
DROP POLICY IF EXISTS "Users can delete own CV uploads" ON cv_uploads;
DROP POLICY IF EXISTS "Users can read their own uploads" ON cv_uploads;
DROP POLICY IF EXISTS "Users can insert their own uploads" ON cv_uploads;
DROP POLICY IF EXISTS "Authenticated users can upload to own folder" ON cv_uploads;
DROP POLICY IF EXISTS "Allow anonymous uploads" ON cv_uploads;

-- Step 3: Re-enable RLS
ALTER TABLE cv_uploads ENABLE ROW LEVEL SECURITY;

-- Step 4: Create new policies with correct syntax
-- Using a simpler approach that definitely works

CREATE POLICY "cv_uploads_select_policy"
  ON cv_uploads FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "cv_uploads_insert_policy"
  ON cv_uploads FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "cv_uploads_update_policy"
  ON cv_uploads FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "cv_uploads_delete_policy"
  ON cv_uploads FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Step 5: Verify policies were created
SELECT 
  policyname,
  cmd,
  with_check
FROM pg_policies
WHERE tablename = 'cv_uploads'
ORDER BY cmd;

-- Step 6: Also fix cv_enhancements
ALTER TABLE cv_enhancements DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own enhancements" ON cv_enhancements;
DROP POLICY IF EXISTS "Users can create own enhancements" ON cv_enhancements;
DROP POLICY IF EXISTS "Users can update own enhancements" ON cv_enhancements;
DROP POLICY IF EXISTS "Users can delete own enhancements" ON cv_enhancements;

ALTER TABLE cv_enhancements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cv_enhancements_select_policy"
  ON cv_enhancements FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "cv_enhancements_insert_policy"
  ON cv_enhancements FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "cv_enhancements_update_policy"
  ON cv_enhancements FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "cv_enhancements_delete_policy"
  ON cv_enhancements FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Step 7: Verify cv_enhancements policies
SELECT 
  policyname,
  cmd,
  with_check
FROM pg_policies
WHERE tablename = 'cv_enhancements'
ORDER BY cmd;

