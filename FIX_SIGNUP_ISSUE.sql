-- Fix signup issues: Ensure trigger works and user_profiles are created
-- This script verifies and fixes the user profile creation trigger

-- Step 1: Verify trigger exists
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Step 2: Verify function exists
SELECT 
  routine_name,
  routine_type,
  security_type
FROM information_schema.routines
WHERE routine_name = 'handle_new_user';

-- Step 3: Recreate the function with proper security settings
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insert into user_profiles, ignoring conflicts (in case it already exists)
  INSERT INTO public.user_profiles (id, full_name, plan_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email, 'User'),
    'free'
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Step 4: Ensure trigger exists and is active
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- Step 5: Verify RLS policies allow the trigger to insert
-- The trigger uses SECURITY DEFINER, so it should bypass RLS
-- But let's verify the policy exists
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'user_profiles'
ORDER BY policyname;

-- Step 6: Test query - check for users without profiles
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  u.created_at,
  up.id as profile_id,
  up.plan_type
FROM auth.users u
LEFT JOIN user_profiles up ON u.id = up.id
WHERE up.id IS NULL
ORDER BY u.created_at DESC
LIMIT 10;

-- Step 7: Create profiles for any users missing them (backfill)
INSERT INTO user_profiles (id, full_name, plan_type)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data->>'full_name', u.email, 'User'),
  'free'
FROM auth.users u
LEFT JOIN user_profiles up ON u.id = up.id
WHERE up.id IS NULL
ON CONFLICT (id) DO NOTHING;

