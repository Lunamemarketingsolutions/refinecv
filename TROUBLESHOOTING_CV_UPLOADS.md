# Troubleshooting CV Uploads & Enhancements

## Issue: No records created in cv_uploads and cv_enhancements tables

## Debugging Steps

### 1. Check Browser Console
Open browser console (F12) and look for:
- ✅ Success messages: "CV upload saved successfully"
- ❌ Error messages: "CV upload save error"
- ⚠️ Warnings: Any non-critical issues

### 2. Common Issues & Solutions

#### Issue A: RLS Policy Error
**Error**: `new row violates row-level security policy`

**Solution**: 
- Verify user is authenticated: Check `auth.users` table
- Verify RLS policies exist: Check Supabase Dashboard → Authentication → Policies
- Run this SQL in Supabase SQL Editor:
```sql
-- Check if policies exist
SELECT * FROM pg_policies WHERE tablename = 'cv_uploads';

-- Check if user can insert
SELECT auth.uid(); -- Should return your user ID
```

#### Issue B: Missing user_id
**Error**: `null value in column "user_id" violates not-null constraint`

**Solution**:
- Verify `user` object exists in component
- Check if `user.id` is populated
- Add console.log to verify: `console.log('User ID:', user.id)`

#### Issue C: Session Expired
**Error**: `JWT expired` or `Invalid JWT`

**Solution**:
- Log out and log back in
- Check if session is valid: `supabase.auth.getSession()`
- Verify Supabase URL and keys in `.env.local`

#### Issue D: Storage Upload Fails
**Error**: `Storage upload error` or `row-level security policy`

**Solution**:
- Check storage bucket policies in Supabase Dashboard
- Verify bucket name is `cv-uploads`
- Check storage policies allow authenticated users

### 3. Manual Test Queries

Run these in Supabase SQL Editor to verify:

```sql
-- Check if user exists
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Check if user_profiles exists
SELECT * FROM user_profiles WHERE id = 'your-user-id';

-- Try manual insert (replace with your user_id)
INSERT INTO cv_uploads (
  user_id,
  session_id,
  file_name,
  file_path,
  file_size,
  extracted_text
) VALUES (
  'your-user-id-here',
  'your-user-id-here',
  'test.pdf',
  'test/path.pdf',
  1024,
  'Test text content'
) RETURNING *;

-- Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename IN ('cv_uploads', 'cv_enhancements');
```

### 4. Verify Database Schema

```sql
-- Check cv_uploads table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'cv_uploads'
ORDER BY ordinal_position;

-- Check cv_enhancements table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'cv_enhancements'
ORDER BY ordinal_position;
```

### 5. Check Network Tab

1. Open browser DevTools → Network tab
2. Upload a CV
3. Look for requests to Supabase:
   - `POST /rest/v1/cv_uploads` - Should return 201 Created
   - `POST /rest/v1/cv_enhancements` - Should return 201 Created
4. Check response for errors

### 6. Common Fixes

#### Fix 1: Re-run Migrations
If tables or policies are missing:
```bash
# In Supabase Dashboard → SQL Editor, run:
# Copy all migration files and run them in order
```

#### Fix 2: Reset RLS Policies
```sql
-- Drop and recreate cv_uploads policies
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
```

#### Fix 3: Verify Storage Bucket
```sql
-- Check storage bucket exists
SELECT * FROM storage.buckets WHERE id = 'cv-uploads';

-- Check storage policies
SELECT * FROM storage.policies WHERE bucket_id = 'cv-uploads';
```

### 7. Debug Checklist

- [ ] User is logged in
- [ ] Browser console shows no errors
- [ ] Network tab shows successful POST requests
- [ ] RLS policies exist in Supabase Dashboard
- [ ] Storage bucket `cv-uploads` exists
- [ ] Storage policies allow authenticated uploads
- [ ] `user.id` is not null/undefined
- [ ] Supabase URL and keys are correct in `.env.local`

### 8. Next Steps

After checking console logs:
1. Share the exact error message from console
2. Share the error code (if any)
3. Share the network request/response (if available)
4. Verify RLS policies in Supabase Dashboard

This will help identify the exact issue!

