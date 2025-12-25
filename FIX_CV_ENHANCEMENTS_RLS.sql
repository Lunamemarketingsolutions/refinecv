-- Fix RLS policies for cv_enhancements table
-- This ensures authenticated users can insert their own enhancement records

-- Step 1: Drop all existing policies on cv_enhancements
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'cv_enhancements'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON cv_enhancements', r.policyname);
  END LOOP;
END $$;

-- Step 2: Recreate policies with correct syntax (same as cv_uploads which works)
CREATE POLICY "Users can view own enhancements"
  ON cv_enhancements FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can create own enhancements"
  ON cv_enhancements FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own enhancements"
  ON cv_enhancements FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own enhancements"
  ON cv_enhancements FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Step 3: Verify policies were created
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'cv_enhancements'
ORDER BY policyname;

