/*
  # Create Storage Bucket for CV Files

  1. New Storage Bucket
    - `cv-uploads` bucket for storing PDF files
    - Public read access for anonymous users
    - File size limit: 10MB
    - Allowed MIME types: application/pdf

  2. Security
    - Enable RLS on storage.objects
    - Allow anonymous users to upload PDFs
    - Allow anonymous users to read their uploaded files
*/

-- Create storage bucket for CV uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cv-uploads',
  'cv-uploads',
  false,
  10485760,
  ARRAY['application/pdf']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous deletes" ON storage.objects;

-- Create policy for uploading files
CREATE POLICY "Allow anonymous uploads"
  ON storage.objects FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'cv-uploads');

-- Create policy for reading files
CREATE POLICY "Allow anonymous reads"
  ON storage.objects FOR SELECT
  TO anon
  USING (bucket_id = 'cv-uploads');

-- Create policy for deleting files
CREATE POLICY "Allow anonymous deletes"
  ON storage.objects FOR DELETE
  TO anon
  USING (bucket_id = 'cv-uploads');