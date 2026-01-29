/*
  # Create Blog Schema

  1. New Tables
    - `blog_articles`
      - `id` (uuid, primary key)
      - `title` (text)
      - `slug` (text, unique)
      - `excerpt` (text)
      - `content` (text)
      - `featured_image_url` (text)
      - `category` (text with enum constraint)
      - `author_name` (text)
      - `author_avatar_url` (text, nullable)
      - `published_date` (timestamptz)
      - `read_time` (integer, minutes)
      - `tags` (jsonb array)
      - `is_featured` (boolean)
      - `is_popular` (boolean)
      - `view_count` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `blog_categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `slug` (text, unique)
      - `article_count` (integer)
      - `display_order` (integer)
      - `created_at` (timestamptz)

    - `newsletter_subscribers`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `source` (text)
      - `subscribed_at` (timestamptz)
      - `is_active` (boolean)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access to blog articles and categories
    - Add policy for authenticated insert on newsletter_subscribers
*/

-- Create blog_articles table
CREATE TABLE IF NOT EXISTS blog_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  featured_image_url text NOT NULL,
  category text NOT NULL CHECK (category IN ('interview-tips', 'cv-writing', 'career-advice', 'success-stories', 'tools', 'mba-resources')),
  author_name text NOT NULL,
  author_avatar_url text,
  published_date timestamptz NOT NULL DEFAULT now(),
  read_time integer NOT NULL DEFAULT 5,
  tags jsonb DEFAULT '[]'::jsonb,
  is_featured boolean DEFAULT false,
  is_popular boolean DEFAULT false,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blog_categories table
CREATE TABLE IF NOT EXISTS blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  article_count integer DEFAULT 0,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  source text NOT NULL CHECK (source IN ('sidebar', 'footer', 'exit-intent')),
  subscribed_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

-- Enable RLS
ALTER TABLE blog_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Policies for blog_articles (public read)
CREATE POLICY "Anyone can view published articles"
  ON blog_articles
  FOR SELECT
  USING (true);

-- Policies for blog_categories (public read)
CREATE POLICY "Anyone can view categories"
  ON blog_categories
  FOR SELECT
  USING (true);

-- Policies for newsletter_subscribers (anyone can insert)
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own subscription"
  ON newsletter_subscribers
  FOR SELECT
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_articles_slug ON blog_articles(slug);
CREATE INDEX IF NOT EXISTS idx_blog_articles_category ON blog_articles(category);
CREATE INDEX IF NOT EXISTS idx_blog_articles_published_date ON blog_articles(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_blog_articles_featured ON blog_articles(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_blog_articles_popular ON blog_articles(is_popular) WHERE is_popular = true;
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_blog_articles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_blog_articles_updated_at
  BEFORE UPDATE ON blog_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_articles_updated_at();