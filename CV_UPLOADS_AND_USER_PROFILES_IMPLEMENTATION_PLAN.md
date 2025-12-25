# CV Uploads & User Profiles - Implementation Plan

## 🎯 Goal
Make `cv_uploads` and `user_profiles` tables fully functional and ensure data is consistently saved across all features.

---

## 📊 Current State Analysis

### ❌ Problems Identified:

1. **user_profiles**:
   - Trigger exists but may not be firing correctly
   - Dashboard tries to fetch but might fail silently
   - No explicit profile creation in signup flow
   - Profile updates not happening

2. **cv_uploads**:
   - ATS Tool: ✅ Saves to cv_uploads (working)
   - JD Matcher: ✅ Saves to cv_uploads (working)
   - CV Improviser: ❌ NOT saving to cv_uploads (missing)
   - Inconsistent use of `user_id` vs `session_id`
   - Some uploads missing file storage path

---

## 🏗️ Ideal Architecture

### 1. **user_profiles Table - How It Should Work**

#### **On User Signup:**
```
1. User signs up via Signup.tsx
2. Supabase auth.users record created
3. Database trigger fires → creates user_profiles record automatically
4. Profile initialized with:
   - id = user.id
   - full_name = email (or from metadata if provided)
   - plan_type = 'free'
   - created_at = now()
```

#### **On User Login:**
```
1. User logs in
2. Dashboard loads → useDashboardData hook fetches user_profiles
3. If profile doesn't exist (edge case), create it on-the-fly
4. Display user info in sidebar/dashboard
```

#### **Profile Updates:**
```
1. User updates name in settings → update user_profiles.full_name
2. User upgrades to premium → update user_profiles.plan_type and premium_expires_at
3. User uploads profile photo → update user_profiles.profile_photo_url
4. All updates set updated_at automatically via trigger
```

#### **Usage Across Features:**
- **Dashboard**: Display user name, plan type, usage stats
- **Sidebar**: Show user name and profile photo
- **Settings**: Allow editing full_name, profile_photo_url
- **Billing**: Manage plan_type and premium_expires_at
- **Usage Limits**: Check plan_type to determine daily limits

---

### 2. **cv_uploads Table - How It Should Work**

#### **On CV File Upload (Any Feature):**

**Step 1: File Validation**
```
- Check file size (< 10MB)
- Check file type (PDF or DOCX)
- Validate user is authenticated
```

**Step 2: Extract Text**
```
- Use extractTextFromFile() service
- Extract text from PDF/DOCX
- Store extracted text for analysis
```

**Step 3: Upload to Storage**
```
- Generate storage path: {user_id}/{timestamp}_{filename}
- Upload to Supabase Storage bucket: 'cv-uploads'
- Get public URL for file access
```

**Step 4: Save to cv_uploads Table**
```
INSERT INTO cv_uploads (
  user_id,           -- Current authenticated user
  file_name,         -- Original filename
  file_path,         -- Storage path (e.g., "user-id/1234567890_resume.pdf")
  file_size,         -- File size in bytes
  extracted_text,    -- Extracted text content
  session_id         -- Legacy field, set to user_id for compatibility
)
```

**Step 5: Return cv_upload_id**
```
- Return the created cv_upload.id
- Use this ID to link to analysis tables:
  - ats_analyses.cv_upload_id
  - jd_matches.cv_upload_id
  - cv_enhancements.cv_upload_id
```

#### **Usage Across Features:**

**ATS Analyzer:**
```
1. User uploads CV → Save to cv_uploads
2. Analyze CV → Save to ats_analyses (with cv_upload_id)
3. Generate suggestions → Save to resume_suggestions (with cv_upload_id)
4. User can view history → Query cv_uploads by user_id
```

**JD CV Matcher:**
```
1. User uploads CV → Save to cv_uploads
2. User pastes/uploads JD → Analyze
3. Save analysis → Save to jd_matches (with cv_upload_id)
4. User can view past matches → Query jd_matches joined with cv_uploads
```

**CV Improviser:**
```
1. User uploads CV → Save to cv_uploads
2. Parse CV sections → Extract text
3. Save enhancement session → Save to cv_enhancements (with cv_upload_id)
4. User can resume editing → Load from cv_enhancements
5. User can view history → Query cv_uploads by user_id
```

#### **Data Relationships:**
```
cv_uploads (1) ──→ (many) ats_analyses
cv_uploads (1) ──→ (many) jd_matches
cv_uploads (1) ──→ (many) cv_enhancements
cv_uploads (1) ──→ (many) resume_suggestions
```

---

## 🔧 Implementation Details

### Feature 1: ATS Analyzer

**Current State**: ✅ Mostly working
- Saves to cv_uploads ✅
- Links to ats_analyses ✅
- Saves file to storage ✅

**Needs**:
- Ensure user_id is always set (not session_id)
- Verify extracted_text is saved
- Add error handling for failed saves

---

### Feature 2: JD CV Matcher

**Current State**: ✅ Mostly working
- Saves to cv_uploads ✅
- Links to jd_matches ✅
- Handles text paste (no file) ✅

**Needs**:
- When user pastes text (no file upload), still create cv_uploads record with:
  - file_name = 'pasted_text.txt'
  - file_path = '' (empty, no file)
  - extracted_text = pasted text
- Ensure user_id is always set

---

### Feature 3: CV Improviser

**Current State**: ❌ NOT saving to cv_uploads

**Needs**:
1. Add cv_uploads save on file upload
2. Add cv_enhancements save when analysis starts
3. Link cv_enhancements to cv_uploads
4. Save updated CV content back to cv_uploads.extracted_text on save

**Implementation Steps**:
```typescript
// In CVImproviser.tsx handleAnalyze():
1. Upload file to storage
2. Extract text from file
3. Save to cv_uploads table
4. Parse CV sections
5. Create cv_enhancements record (linked to cv_upload_id)
6. Save sections to cv_enhancement_sections
7. Save bullets to cv_bullets
```

---

## 📋 Detailed Flow Diagrams

### User Signup Flow:
```
User fills signup form
    ↓
supabase.auth.signUp()
    ↓
auth.users record created
    ↓
Database trigger: handle_new_user()
    ↓
user_profiles record created automatically
    ↓
User redirected to login/email confirmation
```

### CV Upload Flow (All Features):
```
User selects file
    ↓
Validate file (size, type)
    ↓
Extract text (PDF/DOCX parser)
    ↓
Upload to Supabase Storage
    ↓
Save to cv_uploads table
    ↓
Return cv_upload_id
    ↓
Use cv_upload_id in analysis tables
```

### Profile Loading Flow:
```
User logs in
    ↓
Dashboard loads
    ↓
useDashboardData hook runs
    ↓
Fetch user_profiles WHERE id = user.id
    ↓
If not found → Create profile (edge case)
    ↓
Display user info in UI
```

---

## ✅ Implementation Checklist

### Phase 1: Fix user_profiles
- [ ] Verify database trigger is working
- [ ] Add explicit profile creation in signup flow (backup)
- [ ] Add profile creation check in useDashboardData (fallback)
- [ ] Test profile creation on new signup
- [ ] Test profile loading on login

### Phase 2: Fix cv_uploads in CV Improviser
- [ ] Add file upload to storage in CVImproviser
- [ ] Add cv_uploads save after file upload
- [ ] Add cv_enhancements save when analysis starts
- [ ] Link cv_enhancements to cv_uploads
- [ ] Add save functionality to persist edits
- [ ] Test end-to-end flow

### Phase 3: Standardize cv_uploads across all features
- [ ] Ensure all features use user_id (not session_id)
- [ ] Ensure all features save extracted_text
- [ ] Ensure all features save file_path correctly
- [ ] Add error handling for failed saves
- [ ] Add retry logic for network failures

### Phase 4: Add History/Resume Functionality
- [ ] Add "Recent CVs" list in dashboard
- [ ] Add "Resume Editing" for CV Improviser
- [ ] Add "View Past Analyses" for ATS/JD Matcher
- [ ] Add delete functionality for old uploads

---

## 🧪 Testing Scenarios

### Test 1: New User Signup
1. Create new account
2. Verify user_profiles record exists
3. Verify profile has correct default values
4. Login and verify profile loads in dashboard

### Test 2: CV Upload in ATS Tool
1. Upload CV file
2. Verify cv_uploads record created
3. Verify file saved to storage
4. Verify ats_analyses linked to cv_upload_id
5. Check extracted_text is saved

### Test 3: CV Upload in JD Matcher
1. Upload CV file
2. Verify cv_uploads record created
3. Paste JD text
4. Verify jd_matches linked to cv_upload_id
5. Test text-only mode (no file upload)

### Test 4: CV Upload in CV Improviser
1. Upload CV file
2. Verify cv_uploads record created
3. Verify cv_enhancements created
4. Make edits to bullets
5. Save and verify updates persist
6. Reload page and verify data loads

### Test 5: Profile Updates
1. Update full_name in settings
2. Verify user_profiles.full_name updated
3. Verify updated_at timestamp changed
4. Reload and verify changes persist

---

## 🔒 Security Considerations

1. **RLS Policies**: Already in place, verify they're working
2. **File Access**: Users can only access their own files
3. **Storage Paths**: Use user_id in path to prevent collisions
4. **Data Validation**: Validate file types and sizes before upload
5. **Error Messages**: Don't expose sensitive info in errors

---

## 📊 Data Consistency Rules

1. **user_id**: Always required, must match authenticated user
2. **file_path**: Must match actual storage path
3. **extracted_text**: Should always be populated (even if empty string)
4. **created_at**: Auto-set by database
5. **updated_at**: Auto-updated by trigger on changes

---

## 🚀 Next Steps

1. Implement fixes for user_profiles
2. Implement cv_uploads in CV Improviser
3. Standardize cv_uploads across all features
4. Add history/resume functionality
5. Test all scenarios
6. Deploy and monitor

