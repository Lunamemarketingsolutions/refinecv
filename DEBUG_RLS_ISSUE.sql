-- Debug RLS Issue for cv_uploads
-- Run this in Supabase SQL Editor to diagnose the problem

-- Step 1: Check ALL policies on cv_uploads
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
  rowsecurity
FROM pg_tables
WHERE tablename = 'cv_uploads';

-- Step 3: Check table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'cv_uploads'
ORDER BY ordinal_position;

-- Step 4: Test current auth context (run this while logged in)
SELECT 
  auth.uid() as current_user_id,
  auth.role() as current_role;

-- Step 5: Check if there are any conflicting policies
-- Look for policies that might be blocking
SELECT 
  policyname,
  cmd,
  CASE 
    WHEN cmd = 'INSERT' THEN with_check
    ELSE qual
  END as policy_condition
FROM pg_policies
WHERE tablename = 'cv_uploads';

-- Step 6: Try to see what auth.uid() returns in policy context
-- This helps debug if the policy condition is working
SELECT 
  'Testing auth.uid() in policy context' as test,
  auth.uid() as uid_result;

