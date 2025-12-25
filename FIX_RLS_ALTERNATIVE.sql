-- Alternative RLS Fix - Using SECURITY DEFINER function
-- This bypasses RLS by using a function with elevated privileges

-- Step 1: Create a function that inserts cv_uploads with proper security
CREATE OR REPLACE FUNCTION insert_cv_upload(
  p_user_id uuid,
  p_session_id text,
  p_file_name text,
  p_file_path text,
  p_file_size integer,
  p_extracted_text text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_upload_id uuid;
BEGIN
  -- Verify the user_id matches the authenticated user
  IF p_user_id != auth.uid() THEN
    RAISE EXCEPTION 'User ID mismatch: expected %, got %', auth.uid(), p_user_id;
  END IF;

  -- Insert the record
  INSERT INTO cv_uploads (
    user_id,
    session_id,
    file_name,
    file_path,
    file_size,
    extracted_text
  ) VALUES (
    p_user_id,
    p_session_id,
    p_file_name,
    p_file_path,
    p_file_size,
    p_extracted_text
  )
  RETURNING id INTO v_upload_id;

  RETURN v_upload_id;
END;
$$;

-- Step 2: Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION insert_cv_upload TO authenticated;

-- Step 3: Test the function (replace with your user ID)
-- SELECT insert_cv_upload(
--   'your-user-id-here'::uuid,
--   'your-user-id-here',
--   'test.pdf',
--   'test/path.pdf',
--   1024,
--   'Test content'
-- );

