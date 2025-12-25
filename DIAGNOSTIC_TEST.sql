-- Diagnostic Test Script
-- Run this to check what's wrong

-- Test 1: Check if you're authenticated
SELECT 
  auth.uid() as your_user_id,
  auth.role() as your_role,
  CASE 
    WHEN auth.uid() IS NULL THEN '❌ NOT AUTHENTICATED'
    ELSE '✅ AUTHENTICATED'
  END as auth_status;

-- Test 2: Check cv_uploads table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'cv_uploads'
ORDER BY ordinal_position;

-- Test 3: Check all RLS policies
SELECT 
  policyname,
  cmd as operation,
  permissive,
  roles,
  qual as using_clause,
  with_check as with_check_clause
FROM pg_policies
WHERE tablename = 'cv_uploads'
ORDER BY policyname;

-- Test 4: Check if RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'cv_uploads';

-- Test 5: Try a test insert (replace YOUR_USER_ID with actual user ID from Test 1)
-- This will show the exact error
DO $$
DECLARE
  test_user_id uuid;
  test_result text;
BEGIN
  -- Get current user ID
  test_user_id := auth.uid();
  
  IF test_user_id IS NULL THEN
    RAISE EXCEPTION 'You are not authenticated. Please log in first.';
  END IF;
  
  -- Try to insert a test record
  BEGIN
    INSERT INTO cv_uploads (
      user_id,
      session_id,
      file_name,
      file_path,
      file_size,
      extracted_text
    ) VALUES (
      test_user_id,
      test_user_id::text,
      'test_file.pdf',
      'test/path.pdf',
      1024,
      'Test content'
    );
    
    test_result := '✅ INSERT SUCCESSFUL';
    RAISE NOTICE '%', test_result;
    
    -- Clean up test record
    DELETE FROM cv_uploads WHERE file_name = 'test_file.pdf' AND user_id = test_user_id;
    
  EXCEPTION WHEN OTHERS THEN
    test_result := '❌ INSERT FAILED: ' || SQLERRM;
    RAISE NOTICE '%', test_result;
    RAISE;
  END;
END $$;

-- Test 6: Check for conflicting policies
SELECT 
  COUNT(*) as policy_count,
  COUNT(DISTINCT cmd) as operation_count
FROM pg_policies
WHERE tablename = 'cv_uploads'
AND cmd = 'INSERT';

-- If policy_count > 1, you have duplicate policies!

