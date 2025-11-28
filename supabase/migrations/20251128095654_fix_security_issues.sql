/*
  # Fix Security and Performance Issues

  1. Add Missing Index
    - Add index for usage_tracking.analysis_id foreign key
  
  2. Optimize RLS Policies
    - Replace auth.uid() with (select auth.uid()) in all policies
    - This prevents re-evaluation for each row, improving performance
  
  3. Fix Function Search Path
    - Add SET search_path = public to functions
  
  4. Remove Unused Indexes
    - Drop indexes that are not being used
*/

-- Add missing index for foreign key
CREATE INDEX IF NOT EXISTS idx_usage_tracking_analysis_id ON usage_tracking(analysis_id);

-- Drop unused indexes
DROP INDEX IF EXISTS idx_cv_uploads_session_id;
DROP INDEX IF EXISTS idx_cv_uploads_created_at;
DROP INDEX IF EXISTS idx_cv_analyses_session_id;
DROP INDEX IF EXISTS idx_cv_analyses_created_at;
DROP INDEX IF EXISTS idx_cv_analyses_cv_upload_id;
DROP INDEX IF EXISTS idx_cv_uploads_user_id;
DROP INDEX IF EXISTS idx_cv_analyses_user_id;
DROP INDEX IF EXISTS idx_usage_tracking_date;
DROP INDEX IF EXISTS idx_usage_tracking_tool_type;
DROP INDEX IF EXISTS idx_user_profiles_plan_type;
DROP INDEX IF EXISTS idx_usage_tracking_user_id;

-- Recreate only the indexes we actually need
CREATE INDEX IF NOT EXISTS idx_cv_uploads_user_id_created ON cv_uploads(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cv_analyses_user_id_created ON cv_analyses(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_date ON usage_tracking(user_id, date_only);

-- Drop and recreate user_profiles policies with optimized auth.uid()
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- Drop and recreate usage_tracking policies with optimized auth.uid()
DROP POLICY IF EXISTS "Users can view own usage" ON usage_tracking;
DROP POLICY IF EXISTS "Users can insert own usage" ON usage_tracking;

CREATE POLICY "Users can view own usage"
  ON usage_tracking FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own usage"
  ON usage_tracking FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

-- Drop and recreate cv_uploads policies with optimized auth.uid()
DROP POLICY IF EXISTS "Users can view own CV uploads" ON cv_uploads;
DROP POLICY IF EXISTS "Users can insert own CV uploads" ON cv_uploads;
DROP POLICY IF EXISTS "Users can update own CV uploads" ON cv_uploads;
DROP POLICY IF EXISTS "Users can delete own CV uploads" ON cv_uploads;

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

-- Drop and recreate cv_analyses policies with optimized auth.uid()
DROP POLICY IF EXISTS "Users can view own CV analyses" ON cv_analyses;
DROP POLICY IF EXISTS "Users can insert own CV analyses" ON cv_analyses;
DROP POLICY IF EXISTS "Users can update own CV analyses" ON cv_analyses;
DROP POLICY IF EXISTS "Users can delete own CV analyses" ON cv_analyses;

CREATE POLICY "Users can view own CV analyses"
  ON cv_analyses FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own CV analyses"
  ON cv_analyses FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own CV analyses"
  ON cv_analyses FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own CV analyses"
  ON cv_analyses FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Fix function search path issues
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
