-- Verify and fix RLS policies for usage_tracking
-- This ensures users can only see and insert their own usage records

-- Step 1: Verify RLS is enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'usage_tracking' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE 'RLS enabled on usage_tracking';
  ELSE
    RAISE NOTICE 'RLS already enabled on usage_tracking';
  END IF;
END $$;

-- Step 2: Drop all existing policies
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'usage_tracking'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON usage_tracking', r.policyname);
    RAISE NOTICE 'Dropped policy: %', r.policyname;
  END LOOP;
END $$;

-- Step 3: Recreate policies with correct syntax
CREATE POLICY "Users can view own usage"
  ON usage_tracking FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own usage"
  ON usage_tracking FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- Step 4: Verify policies were created
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'usage_tracking'
ORDER BY policyname;

-- Step 5: Test query (should only return current user's records)
-- Note: This will only work when run by an authenticated user
SELECT 
  COUNT(*) as my_usage_count,
  tool_type,
  COUNT(*) FILTER (WHERE tool_type = 'ats_analyzer') as ats_count,
  COUNT(*) FILTER (WHERE tool_type = 'jd_matcher') as jd_count,
  COUNT(*) FILTER (WHERE tool_type = 'cv_enhancer') as cv_count
FROM usage_tracking
GROUP BY tool_type;

