-- DEFINITIVE RLS FIX - Uses EXACT same pattern as working ATS feature
-- Run this in Supabase Dashboard → SQL Editor

-- Step 1: Check current policies
SELECT policyname, cmd, with_check 
FROM pg_policies 
WHERE tablename = 'cv_uploads' 
AND cmd = 'INSERT';

-- Step 2: Remove ALL existing policies (nuclear option)
DO $$
DECLARE
  policy_record RECORD;
BEGIN
  FOR policy_record IN 
    SELECT policyname 
    FROM pg_policies 
    WHERE tablename = 'cv_uploads'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON cv_uploads', policy_record.policyname);
    RAISE NOTICE 'Dropped policy: %', policy_record.policyname;
  END LOOP;
END $$;

-- Step 3: Create policies using EXACT same syntax as ats_analyses (which works!)
-- This is the EXACT pattern from 20251128101453_create_ats_analysis_schema.sql

CREATE POLICY "Users can view own CV uploads"
  ON cv_uploads FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own CV uploads"
  ON cv_uploads FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own CV uploads"
  ON cv_uploads FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own CV uploads"
  ON cv_uploads FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Step 4: Verify policies
SELECT 
  policyname,
  cmd,
  with_check
FROM pg_policies
WHERE tablename = 'cv_uploads'
ORDER BY policyname;

-- Step 5: Also fix cv_enhancements (same pattern)
DO $$
DECLARE
  policy_record RECORD;
BEGIN
  FOR policy_record IN 
    SELECT policyname 
    FROM pg_policies 
    WHERE tablename = 'cv_enhancements'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON cv_enhancements', policy_record.policyname);
  END LOOP;
END $$;

CREATE POLICY "Users can view own enhancements"
  ON cv_enhancements FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can create own enhancements"
  ON cv_enhancements FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own enhancements"
  ON cv_enhancements FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own enhancements"
  ON cv_enhancements FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Step 6: Verify both tables
SELECT 
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE tablename IN ('cv_uploads', 'cv_enhancements')
ORDER BY tablename, policyname;

-- Step 7: Check if user_id column exists and is NOT NULL
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'cv_uploads'
AND column_name = 'user_id';

-- If user_id is nullable, make it NOT NULL
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cv_uploads'
    AND column_name = 'user_id'
    AND is_nullable = 'YES'
  ) THEN
    -- First, set default for existing NULL values (if any)
    UPDATE cv_uploads 
    SET user_id = (SELECT id FROM auth.users LIMIT 1)
    WHERE user_id IS NULL;
    
    -- Then make it NOT NULL
    ALTER TABLE cv_uploads 
    ALTER COLUMN user_id SET NOT NULL;
    
    RAISE NOTICE 'Made user_id NOT NULL';
  END IF;
END $$;

