-- ============================================
-- RLS DIAGNOSTIC AND FIX FOR cv_uploads
-- ============================================
-- This script will:
-- 1. Show current RLS policies
-- 2. Show what auth.uid() returns for current user
-- 3. Fix the RLS policy to work correctly
-- ============================================

-- Step 1: Check current policies
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
WHERE tablename = 'cv_uploads'
ORDER BY policyname;

-- Step 2: Check if RLS is enabled
SELECT 
  tablename,
  rowsecurity as "RLS Enabled"
FROM pg_tables
WHERE tablename = 'cv_uploads';

-- Step 3: Drop ALL existing policies (clean slate)
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'cv_uploads'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON cv_uploads', r.policyname);
    RAISE NOTICE 'Dropped policy: %', r.policyname;
  END LOOP;
END $$;

-- Step 4: Create a simple, working INSERT policy
-- This policy allows authenticated users to insert records where user_id matches their auth.uid()
CREATE POLICY "Allow authenticated users to insert own CV uploads"
  ON cv_uploads FOR INSERT
  TO authenticated
  WITH CHECK (
    (select auth.uid()) = user_id
  );

-- Step 5: Create SELECT policy (so users can read their own records)
CREATE POLICY "Allow authenticated users to view own CV uploads"
  ON cv_uploads FOR SELECT
  TO authenticated
  USING (
    (select auth.uid()) = user_id
  );

-- Step 6: Create UPDATE policy
CREATE POLICY "Allow authenticated users to update own CV uploads"
  ON cv_uploads FOR UPDATE
  TO authenticated
  USING (
    (select auth.uid()) = user_id
  )
  WITH CHECK (
    (select auth.uid()) = user_id
  );

-- Step 7: Create DELETE policy
CREATE POLICY "Allow authenticated users to delete own CV uploads"
  ON cv_uploads FOR DELETE
  TO authenticated
  USING (
    (select auth.uid()) = user_id
  );

-- Step 8: Verify policies were created
SELECT 
  policyname,
  cmd as "Command",
  CASE 
    WHEN with_check IS NOT NULL THEN with_check::text
    ELSE 'N/A'
  END as "WITH CHECK Clause"
FROM pg_policies
WHERE tablename = 'cv_uploads'
ORDER BY policyname;

-- ============================================
-- TEST QUERY (Run this while logged in as a user)
-- ============================================
-- This will show you what auth.uid() returns for the current session
-- SELECT auth.uid() as "Current User ID";

