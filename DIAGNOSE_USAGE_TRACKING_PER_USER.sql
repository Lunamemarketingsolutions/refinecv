-- Diagnostic script to verify usage tracking is per-user
-- Run this in Supabase SQL Editor to check if usage is being tracked correctly per user

-- 1. Check all users and their usage counts
SELECT 
  u.id as user_id,
  u.email,
  up.plan_type,
  COUNT(ut.id) FILTER (WHERE ut.tool_type = 'ats_analyzer') as ats_count,
  COUNT(ut.id) FILTER (WHERE ut.tool_type = 'jd_matcher') as jd_count,
  COUNT(ut.id) FILTER (WHERE ut.tool_type = 'cv_enhancer') as cv_count,
  COUNT(ut.id) as total_usage
FROM auth.users u
LEFT JOIN user_profiles up ON u.id = up.id
LEFT JOIN usage_tracking ut ON u.id = ut.user_id
GROUP BY u.id, u.email, up.plan_type
ORDER BY u.created_at DESC;

-- 2. Check RLS policies on usage_tracking
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
WHERE tablename = 'usage_tracking'
ORDER BY policyname;

-- 3. Verify RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'usage_tracking';

-- 4. Check for any records with NULL user_id (should not exist)
SELECT 
  COUNT(*) as null_user_id_count
FROM usage_tracking
WHERE user_id IS NULL;

-- 5. Check for any orphaned records (user_id doesn't exist in auth.users)
SELECT 
  ut.id,
  ut.user_id,
  ut.tool_type,
  ut.created_at
FROM usage_tracking ut
LEFT JOIN auth.users u ON ut.user_id = u.id
WHERE u.id IS NULL;

-- 6. Sample of recent usage records with user emails
SELECT 
  ut.id,
  ut.user_id,
  u.email,
  ut.tool_type,
  ut.created_at,
  ut.cv_upload_id
FROM usage_tracking ut
JOIN auth.users u ON ut.user_id = u.id
ORDER BY ut.created_at DESC
LIMIT 20;

-- 7. Count usage per user per tool (detailed breakdown)
SELECT 
  u.email,
  ut.tool_type,
  COUNT(*) as usage_count,
  MIN(ut.created_at) as first_use,
  MAX(ut.created_at) as last_use
FROM usage_tracking ut
JOIN auth.users u ON ut.user_id = u.id
GROUP BY u.email, ut.tool_type
ORDER BY u.email, ut.tool_type;

