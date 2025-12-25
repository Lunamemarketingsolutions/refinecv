-- Fix RLS policies for usage_tracking to ensure inserts work

-- Step 1: Drop existing policies
DROP POLICY IF EXISTS "Users can view own usage" ON usage_tracking;
DROP POLICY IF EXISTS "Users can insert own usage" ON usage_tracking;

-- Step 2: Recreate with explicit auth.uid() check
CREATE POLICY "Users can view own usage"
  ON usage_tracking FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own usage"
  ON usage_tracking FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- Step 3: Verify policies
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'usage_tracking';

