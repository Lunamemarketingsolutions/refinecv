/*
  # Create CV Enhancer Schema

  1. New Tables
    - cv_enhancements - Main enhancement sessions
    - cv_enhancement_sections - Individual CV sections with ratings
    - cv_bullets - Bullet points with AI suggestions
    - cv_enhancement_versions - Version history

  2. Security
    - Enable RLS on all tables
    - User can only access their own data

  3. Indexes
    - Performance indexes on foreign keys
*/

-- Create cv_enhancements table
CREATE TABLE IF NOT EXISTS cv_enhancements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cv_upload_id uuid REFERENCES cv_uploads(id) ON DELETE SET NULL,
  original_text text NOT NULL DEFAULT '',
  overall_score_before integer NOT NULL DEFAULT 0 CHECK (overall_score_before >= 0 AND overall_score_before <= 100),
  overall_score_after integer NOT NULL DEFAULT 0 CHECK (overall_score_after >= 0 AND overall_score_after <= 100),
  status text NOT NULL DEFAULT 'analyzing' CHECK (status IN ('analyzing', 'editing', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Create cv_enhancement_sections table
CREATE TABLE IF NOT EXISTS cv_enhancement_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enhancement_id uuid NOT NULL REFERENCES cv_enhancements(id) ON DELETE CASCADE,
  section_name text NOT NULL,
  section_order integer NOT NULL DEFAULT 0,
  rating_before integer NOT NULL DEFAULT 3 CHECK (rating_before >= 1 AND rating_before <= 5),
  rating_after integer NOT NULL DEFAULT 3 CHECK (rating_after >= 1 AND rating_after <= 5),
  total_bullets integer NOT NULL DEFAULT 0,
  enhanced_bullets integer NOT NULL DEFAULT 0,
  is_complete boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create cv_bullets table
CREATE TABLE IF NOT EXISTS cv_bullets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES cv_enhancement_sections(id) ON DELETE CASCADE,
  original_text text NOT NULL DEFAULT '',
  current_text text NOT NULL DEFAULT '',
  enhanced_text text,
  bullet_order integer NOT NULL DEFAULT 0,
  rating_before integer NOT NULL DEFAULT 3 CHECK (rating_before >= 1 AND rating_before <= 5),
  rating_after integer CHECK (rating_after >= 1 AND rating_after <= 5),
  issues jsonb DEFAULT '[]'::jsonb,
  suggestions jsonb DEFAULT '[]'::jsonb,
  is_enhanced boolean DEFAULT false,
  user_context text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create cv_enhancement_versions table
CREATE TABLE IF NOT EXISTS cv_enhancement_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enhancement_id uuid NOT NULL REFERENCES cv_enhancements(id) ON DELETE CASCADE,
  version_number integer NOT NULL DEFAULT 1,
  version_name text,
  snapshot_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_cv_enhancements_user_id ON cv_enhancements(user_id);
CREATE INDEX IF NOT EXISTS idx_cv_enhancements_status ON cv_enhancements(user_id, status);
CREATE INDEX IF NOT EXISTS idx_cv_enhancement_sections_enhancement_id ON cv_enhancement_sections(enhancement_id);
CREATE INDEX IF NOT EXISTS idx_cv_bullets_section_id ON cv_bullets(section_id);
CREATE INDEX IF NOT EXISTS idx_cv_enhancement_versions_enhancement_id ON cv_enhancement_versions(enhancement_id);

-- Enable RLS
ALTER TABLE cv_enhancements ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_enhancement_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_bullets ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_enhancement_versions ENABLE ROW LEVEL SECURITY;

-- Policies for cv_enhancements
CREATE POLICY "Users can view own enhancements"
  ON cv_enhancements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own enhancements"
  ON cv_enhancements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own enhancements"
  ON cv_enhancements FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own enhancements"
  ON cv_enhancements FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for cv_enhancement_sections
CREATE POLICY "Users can view own sections"
  ON cv_enhancement_sections FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cv_enhancements
      WHERE cv_enhancements.id = cv_enhancement_sections.enhancement_id
      AND cv_enhancements.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own sections"
  ON cv_enhancement_sections FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cv_enhancements
      WHERE cv_enhancements.id = cv_enhancement_sections.enhancement_id
      AND cv_enhancements.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own sections"
  ON cv_enhancement_sections FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cv_enhancements
      WHERE cv_enhancements.id = cv_enhancement_sections.enhancement_id
      AND cv_enhancements.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own sections"
  ON cv_enhancement_sections FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cv_enhancements
      WHERE cv_enhancements.id = cv_enhancement_sections.enhancement_id
      AND cv_enhancements.user_id = auth.uid()
    )
  );

-- Policies for cv_bullets
CREATE POLICY "Users can view own bullets"
  ON cv_bullets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cv_enhancement_sections
      JOIN cv_enhancements ON cv_enhancements.id = cv_enhancement_sections.enhancement_id
      WHERE cv_enhancement_sections.id = cv_bullets.section_id
      AND cv_enhancements.user_id = auth.uid()
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
      AND cv_enhancements.user_id = auth.uid()
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
      AND cv_enhancements.user_id = auth.uid()
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
      AND cv_enhancements.user_id = auth.uid()
    )
  );

-- Policies for cv_enhancement_versions
CREATE POLICY "Users can view own versions"
  ON cv_enhancement_versions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cv_enhancements
      WHERE cv_enhancements.id = cv_enhancement_versions.enhancement_id
      AND cv_enhancements.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own versions"
  ON cv_enhancement_versions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cv_enhancements
      WHERE cv_enhancements.id = cv_enhancement_versions.enhancement_id
      AND cv_enhancements.user_id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_cv_enhancement_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
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
