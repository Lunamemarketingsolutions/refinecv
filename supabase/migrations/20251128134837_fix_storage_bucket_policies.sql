/*
  # Fix Storage Bucket Policies for Authenticated Users

  1. Changes
    - Update cv-uploads bucket to accept both PDF and DOCX files
    - Add storage policies for authenticated users
    - Ensure users can only access their own files
    - Maintain security with proper RLS policies

  2. Security
    - Authenticated users can upload files to their own folder
    - Authenticated users can read only their own files
    - Authenticated users can delete only their own files
    - File paths are prefixed with user_id for isolation
*/

-- Update bucket to accept both PDF and DOCX
UPDATE storage.buckets
SET allowed_mime_types = ARRAY[
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]::text[]
WHERE id = 'cv-uploads';

-- Drop existing anonymous policies
DROP POLICY IF EXISTS "Allow anonymous uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous deletes" ON storage.objects;

-- Create policies for authenticated users to upload files
CREATE POLICY "Authenticated users can upload to own folder"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'cv-uploads'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Create policies for authenticated users to read their own files
CREATE POLICY "Authenticated users can read own files"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'cv-uploads'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Create policies for authenticated users to delete their own files
CREATE POLICY "Authenticated users can delete own files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'cv-uploads'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Create policies for authenticated users to update their own files
CREATE POLICY "Authenticated users can update own files"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'cv-uploads'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'cv-uploads'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );