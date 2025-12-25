-- SIMPLE RLS FIX - Just run this, it will work
-- Copy and paste into Supabase SQL Editor

-- Remove all policies
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'cv_uploads'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON cv_uploads', r.policyname);
  END LOOP;
END $$;

-- Create insert policy (EXACT same as ats_analyses which works)
CREATE POLICY "Users can insert own CV uploads"
  ON cv_uploads FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

-- Create other policies
CREATE POLICY "Users can view own CV uploads"
  ON cv_uploads FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own CV uploads"
  ON cv_uploads FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own CV uploads"
  ON cv_uploads FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Fix cv_enhancements too
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'cv_enhancements'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON cv_enhancements', r.policyname);
  END LOOP;
END $$;

CREATE POLICY "Users can create own enhancements"
  ON cv_enhancements FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can view own enhancements"
  ON cv_enhancements FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own enhancements"
  ON cv_enhancements FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own enhancements"
  ON cv_enhancements FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Verify
SELECT 'cv_uploads policies:' as info;
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'cv_uploads';
SELECT 'cv_enhancements policies:' as info;
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'cv_enhancements';

