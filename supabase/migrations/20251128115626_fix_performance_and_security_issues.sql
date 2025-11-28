/*
  # Fix Performance and Security Issues

  ## Changes

  1. **Add Missing Foreign Key Indexes**
     - Add index on cv_analyses.cv_upload_id
     - Add index on cv_enhancements.cv_upload_id

  2. **Optimize RLS Policies**
     - Wrap auth.uid() calls with SELECT to avoid re-evaluation per row
     - Improves query performance at scale

  3. **Fix Function Search Path**
     - Set immutable search path for update_cv_enhancement_updated_at function
     - Prevents security vulnerabilities from mutable search paths

  ## Notes
  - Unused indexes are intentional for future query optimization
  - RLS optimization is critical for performance at scale
*/

-- ============================================================================
-- PART 1: Add Missing Foreign Key Indexes
-- ============================================================================

-- Add index on cv_analyses.cv_upload_id (missing foreign key index)
CREATE INDEX IF NOT EXISTS idx_cv_analyses_cv_upload_id_fk
  ON cv_analyses(cv_upload_id);

-- Add index on cv_enhancements.cv_upload_id (missing foreign key index)
CREATE INDEX IF NOT EXISTS idx_cv_enhancements_cv_upload_id_fk
  ON cv_enhancements(cv_upload_id);

-- ============================================================================
-- PART 2: Optimize RLS Policies - CV Enhancements
-- ============================================================================

-- Drop existing policies for cv_enhancements
DROP POLICY IF EXISTS "Users can view own enhancements" ON cv_enhancements;
DROP POLICY IF EXISTS "Users can create own enhancements" ON cv_enhancements;
DROP POLICY IF EXISTS "Users can update own enhancements" ON cv_enhancements;
DROP POLICY IF EXISTS "Users can delete own enhancements" ON cv_enhancements;

-- Recreate with optimized auth.uid() calls
CREATE POLICY "Users can view own enhancements"
  ON cv_enhancements FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can create own enhancements"
  ON cv_enhancements FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own enhancements"
  ON cv_enhancements FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own enhancements"
  ON cv_enhancements FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- PART 3: Optimize RLS Policies - CV Enhancement Sections
-- ============================================================================

-- Drop existing policies for cv_enhancement_sections
DROP POLICY IF EXISTS "Users can view own sections" ON cv_enhancement_sections;
DROP POLICY IF EXISTS "Users can create own sections" ON cv_enhancement_sections;
DROP POLICY IF EXISTS "Users can update own sections" ON cv_enhancement_sections;
DROP POLICY IF EXISTS "Users can delete own sections" ON cv_enhancement_sections;

-- Recreate with optimized auth.uid() calls
CREATE POLICY "Users can view own sections"
  ON cv_enhancement_sections FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cv_enhancements
      WHERE cv_enhancements.id = cv_enhancement_sections.enhancement_id
      AND cv_enhancements.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can create own sections"
  ON cv_enhancement_sections FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cv_enhancements
      WHERE cv_enhancements.id = cv_enhancement_sections.enhancement_id
      AND cv_enhancements.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can update own sections"
  ON cv_enhancement_sections FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cv_enhancements
      WHERE cv_enhancements.id = cv_enhancement_sections.enhancement_id
      AND cv_enhancements.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can delete own sections"
  ON cv_enhancement_sections FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cv_enhancements
      WHERE cv_enhancements.id = cv_enhancement_sections.enhancement_id
      AND cv_enhancements.user_id = (select auth.uid())
    )
  );

-- ============================================================================
-- PART 4: Optimize RLS Policies - CV Bullets
-- ============================================================================

-- Drop existing policies for cv_bullets
DROP POLICY IF EXISTS "Users can view own bullets" ON cv_bullets;
DROP POLICY IF EXISTS "Users can create own bullets" ON cv_bullets;
DROP POLICY IF EXISTS "Users can update own bullets" ON cv_bullets;
DROP POLICY IF EXISTS "Users can delete own bullets" ON cv_bullets;

-- Recreate with optimized auth.uid() calls
CREATE POLICY "Users can view own bullets"
  ON cv_bullets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cv_enhancement_sections
      JOIN cv_enhancements ON cv_enhancements.id = cv_enhancement_sections.enhancement_id
      WHERE cv_enhancement_sections.id = cv_bullets.section_id
      AND cv_enhancements.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can create own bullets"
  ON cv_bullets FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cv_enhancement_sections
      JOIN cv_enhancements ON cv_enhancements.id = cv_enhancement_sections.enhancement_id
      WHERE cv_enhancement_sections.id = cv_bullets.section_id
      AND cv_enhancements.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can update own bullets"
  ON cv_bullets FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cv_enhancement_sections
      JOIN cv_enhancements ON cv_enhancements.id = cv_enhancement_sections.enhancement_id
      WHERE cv_enhancement_sections.id = cv_bullets.section_id
      AND cv_enhancements.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can delete own bullets"
  ON cv_bullets FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cv_enhancement_sections
      JOIN cv_enhancements ON cv_enhancements.id = cv_enhancement_sections.enhancement_id
      WHERE cv_enhancement_sections.id = cv_bullets.section_id
      AND cv_enhancements.user_id = (select auth.uid())
    )
  );

-- ============================================================================
-- PART 5: Optimize RLS Policies - CV Enhancement Versions
-- ============================================================================

-- Drop existing policies for cv_enhancement_versions
DROP POLICY IF EXISTS "Users can view own versions" ON cv_enhancement_versions;
DROP POLICY IF EXISTS "Users can create own versions" ON cv_enhancement_versions;

-- Recreate with optimized auth.uid() calls
CREATE POLICY "Users can view own versions"
  ON cv_enhancement_versions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cv_enhancements
      WHERE cv_enhancements.id = cv_enhancement_versions.enhancement_id
      AND cv_enhancements.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can create own versions"
  ON cv_enhancement_versions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cv_enhancements
      WHERE cv_enhancements.id = cv_enhancement_versions.enhancement_id
      AND cv_enhancements.user_id = (select auth.uid())
    )
  );

-- ============================================================================
-- PART 6: Optimize RLS Policies - JD Matches
-- ============================================================================

-- Drop existing policies for jd_matches
DROP POLICY IF EXISTS "Users can view own JD matches" ON jd_matches;
DROP POLICY IF EXISTS "Users can insert own JD matches" ON jd_matches;
DROP POLICY IF EXISTS "Users can update own JD matches" ON jd_matches;
DROP POLICY IF EXISTS "Users can delete own JD matches" ON jd_matches;

-- Recreate with optimized auth.uid() calls
CREATE POLICY "Users can view own JD matches"
  ON jd_matches FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own JD matches"
  ON jd_matches FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own JD matches"
  ON jd_matches FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own JD matches"
  ON jd_matches FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- PART 7: Fix Function Search Path
-- ============================================================================

-- Drop and recreate function with SECURITY DEFINER and immutable search path
DROP FUNCTION IF EXISTS update_cv_enhancement_updated_at() CASCADE;

CREATE OR REPLACE FUNCTION update_cv_enhancement_updated_at()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate triggers that use this function
DROP TRIGGER IF EXISTS update_cv_enhancements_updated_at ON cv_enhancements;
CREATE TRIGGER update_cv_enhancements_updated_at
  BEFORE UPDATE ON cv_enhancements
  FOR EACH ROW
  EXECUTE FUNCTION update_cv_enhancement_updated_at();

DROP TRIGGER IF EXISTS update_cv_enhancement_sections_updated_at ON cv_enhancement_sections;
CREATE TRIGGER update_cv_enhancement_sections_updated_at
  BEFORE UPDATE ON cv_enhancement_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_cv_enhancement_updated_at();

DROP TRIGGER IF EXISTS update_cv_bullets_updated_at ON cv_bullets;
CREATE TRIGGER update_cv_bullets_updated_at
  BEFORE UPDATE ON cv_bullets
  FOR EACH ROW
  EXECUTE FUNCTION update_cv_enhancement_updated_at();