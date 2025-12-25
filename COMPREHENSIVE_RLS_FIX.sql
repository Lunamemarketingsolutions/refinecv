-- Comprehensive RLS Fix for cv_uploads
-- This will remove ALL policies and recreate them correctly

-- Step 1: Drop ALL existing policies on cv_uploads
DROP POLICY IF EXISTS "Users can view own CV uploads" ON cv_uploads;
DROP POLICY IF EXISTS "Users can insert own CV uploads" ON cv_uploads;
DROP POLICY IF EXISTS "Users can update own CV uploads" ON cv_uploads;
DROP POLICY IF EXISTS "Users can delete own CV uploads" ON cv_uploads;
DROP POLICY IF EXISTS "Users can read their own uploads" ON cv_uploads;
DROP POLICY IF EXISTS "Users can insert their own uploads" ON cv_uploads;
DROP POLICY IF EXISTS "Authenticated users can upload to own folder" ON cv_uploads;

-- Step 2: Temporarily disable RLS to check if that's the issue
-- ALTER TABLE cv_uploads DISABLE ROW LEVEL SECURITY;

-- Step 3: Recreate policies with correct syntax
-- First, let's use a simpler approach that definitely works

-- SELECT policy
CREATE POLICY "Users can view own CV uploads"
  ON cv_uploads FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- INSERT policy - This is the critical one
CREATE POLICY "Users can insert own CV uploads"
  ON cv_uploads FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- UPDATE policy
CREATE POLICY "Users can update own CV uploads"
  ON cv_uploads FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- DELETE policy
CREATE POLICY "Users can delete own CV uploads"
  ON cv_uploads FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Step 4: Verify policies were created
SELECT 
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'cv_uploads'
ORDER BY policyname;

-- Step 5: Test if auth.uid() works
SELECT 
  auth.uid() as current_user_id,
  auth.role() as current_role;

-- Step 6: Check if user_id column exists and is correct type
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'cv_uploads'
AND column_name = 'user_id';

