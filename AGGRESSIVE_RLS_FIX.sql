-- AGGRESSIVE RLS FIX - This will completely reset cv_uploads policies
-- Run this in Supabase SQL Editor

-- Step 1: List ALL existing policies (to see what we're dealing with)
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'cv_uploads';

-- Step 2: Drop EVERY policy on cv_uploads (nuclear option)
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN 
    SELECT policyname 
    FROM pg_policies 
    WHERE tablename = 'cv_uploads'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON cv_uploads', r.policyname);
    RAISE NOTICE 'Dropped policy: %', r.policyname;
  END LOOP;
END $$;

-- Step 3: Verify all policies are gone
SELECT COUNT(*) as remaining_policies
FROM pg_policies
WHERE tablename = 'cv_uploads';
-- Should return 0

-- Step 4: TEMPORARILY disable RLS to test if that's the issue
-- Uncomment the next line to disable RLS (for testing only!)
-- ALTER TABLE cv_uploads DISABLE ROW LEVEL SECURITY;

-- Step 5: Recreate policies with SIMPLEST possible syntax
-- Using auth.uid() directly (not in a subquery)

CREATE POLICY "cv_uploads_select"
  ON cv_uploads FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "cv_uploads_insert"
  ON cv_uploads FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "cv_uploads_update"
  ON cv_uploads FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "cv_uploads_delete"
  ON cv_uploads FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Step 6: Verify policies were created
SELECT 
  policyname,
  cmd,
  with_check
FROM pg_policies
WHERE tablename = 'cv_uploads'
ORDER BY policyname;

-- Step 7: Test if auth.uid() works
-- This should return your user ID if you're logged in
SELECT 
  auth.uid() as current_user_id,
  auth.role() as current_role;

-- Step 8: If still not working, try this permissive policy (FOR TESTING ONLY)
-- DROP POLICY IF EXISTS "cv_uploads_insert" ON cv_uploads;
-- CREATE POLICY "cv_uploads_insert"
--   ON cv_uploads FOR INSERT
--   TO authenticated
--   WITH CHECK (true);  -- Allows all authenticated users

-- Step 9: Check table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'cv_uploads'
ORDER BY ordinal_position;

-- Step 10: Check if RLS is enabled
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'cv_uploads';

