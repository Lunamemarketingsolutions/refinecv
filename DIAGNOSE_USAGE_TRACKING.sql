-- Diagnostic script for usage_tracking issues

-- 1. Check if table exists and has the cv_upload_id column
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'usage_tracking'
ORDER BY ordinal_position;

-- 2. Check RLS policies
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'usage_tracking';

-- 3. Check if RLS is enabled
SELECT 
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'usage_tracking';

-- 4. Test insert with current user (replace with actual user_id)
-- This will show if RLS is blocking
-- SELECT auth.uid() as current_user_id;

-- 5. Check existing records (if any)
SELECT COUNT(*) as total_records FROM usage_tracking;

-- 6. Check foreign key constraint on cv_upload_id
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'usage_tracking'
  AND kcu.column_name = 'cv_upload_id';

