-- FINAL RLS FIX - This will work for authenticated frontend users
-- Run this in Supabase SQL Editor (as service role, that's fine)

-- Step 1: Remove ALL existing policies on cv_uploads
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

-- Step 2: Create policies that work for authenticated users
-- Using the EXACT same pattern as working features (ATS, JD Matcher)

-- SELECT policy
CREATE POLICY "cv_uploads_select_policy"
  ON cv_uploads FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- INSERT policy - This is the critical one
CREATE POLICY "cv_uploads_insert_policy"
  ON cv_uploads FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- UPDATE policy
CREATE POLICY "cv_uploads_update_policy"
  ON cv_uploads FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- DELETE policy
CREATE POLICY "cv_uploads_delete_policy"
  ON cv_uploads FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Step 3: Verify policies were created
SELECT 
  policyname,
  cmd,
  with_check
FROM pg_policies
WHERE tablename = 'cv_uploads'
ORDER BY policyname;

-- Step 4: Also fix cv_enhancements policies
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN 
    SELECT policyname 
    FROM pg_policies 
    WHERE tablename = 'cv_enhancements'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON cv_enhancements', r.policyname);
  END LOOP;
END $$;

CREATE POLICY "cv_enhancements_select_policy"
  ON cv_enhancements FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "cv_enhancements_insert_policy"
  ON cv_enhancements FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "cv_enhancements_update_policy"
  ON cv_enhancements FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "cv_enhancements_delete_policy"
  ON cv_enhancements FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Step 5: Verify all policies
SELECT 
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE tablename IN ('cv_uploads', 'cv_enhancements')
ORDER BY tablename, policyname;

