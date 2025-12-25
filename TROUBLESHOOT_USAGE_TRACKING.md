# Troubleshooting Usage Tracking

## Issue
No records are being inserted into `usage_tracking` table when CVs are uploaded.

## Diagnostic Steps

### Step 1: Run Diagnostic SQL
Execute `DIAGNOSE_USAGE_TRACKING.sql` in Supabase SQL Editor to check:
- Table structure (especially `cv_upload_id` column)
- RLS policies
- Existing records
- Foreign key constraints

### Step 2: Check Browser Console
After uploading a CV, check the browser console for:
- `📊 Attempting to track usage:` - Confirms function is called
- `✅ Usage tracked successfully:` - Confirms insert worked
- `❌ Failed to track usage:` - Shows error details

### Step 3: Common Issues & Fixes

#### Issue 1: RLS Policy Blocking Inserts
**Symptom:** Error message: "new row violates row-level security policy"

**Fix:** Run `FIX_USAGE_TRACKING_RLS.sql` in Supabase SQL Editor

#### Issue 2: Foreign Key Constraint
**Symptom:** Error message: "insert or update on table violates foreign key constraint"

**Fix:** Ensure `cv_upload_id` exists in `cv_uploads` table before tracking

#### Issue 3: Missing Column
**Symptom:** Error message: "column cv_upload_id does not exist"

**Fix:** Run the migration again:
```sql
ALTER TABLE usage_tracking 
ADD COLUMN IF NOT EXISTS cv_upload_id uuid REFERENCES cv_uploads(id) ON DELETE SET NULL;
```

#### Issue 4: Session/Auth Issues
**Symptom:** Console shows "No active session" or "User ID mismatch"

**Fix:** 
- Ensure user is logged in
- Check that `auth.uid()` returns the correct user ID
- Verify session is valid

### Step 4: Manual Test
Test the insert directly in Supabase SQL Editor:
```sql
-- Replace with actual user_id and cv_upload_id
INSERT INTO usage_tracking (user_id, tool_type, cv_upload_id, date_only)
VALUES (
  'your-user-id-here',
  'ats_analyzer',
  'your-cv-upload-id-here',
  CURRENT_DATE
);
```

If this works, the issue is in the application code.
If this fails, the issue is with RLS or database structure.

## Enhanced Logging

The `trackFeatureUsage()` function now logs:
- Session verification
- User ID validation
- Detailed error messages with codes
- Success confirmation with record ID

Check browser console for these logs when testing.

