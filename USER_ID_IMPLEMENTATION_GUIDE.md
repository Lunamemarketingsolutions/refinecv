# User ID Implementation Guide

## 📋 Overview

All tables in this project use `user_id` to link records to authenticated users. This document explains the implementation pattern across all features.

---

## 🏗️ Database Schema Pattern

### Standard Table Structure

Every table that stores user data follows this pattern:

```sql
CREATE TABLE table_name (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- other columns...
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- Standard RLS Policies
CREATE POLICY "Users can view own records"
  ON table_name FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own records"
  ON table_name FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own records"
  ON table_name FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own records"
  ON table_name FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);
```

---

## 🔑 How user_id is Obtained

### Pattern 1: From React Context (Most Common)

```typescript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user } = useAuth();
  
  // user.id is the authenticated user's UUID
  const userId = user.id;
  
  // Use in database operations
  await supabase
    .from('table_name')
    .insert({
      user_id: user.id,  // ← Direct from context
      // other fields...
    });
}
```

**Used in:**
- `ATSUpload.tsx` - Line 72: `user_id: user.id`
- `JDMatchUpload.tsx` - Line 84: `user_id: user.id`
- `CVImproviser.tsx` - Line 127: `user_id: authUserId`
- `JDMatcherTool.tsx` - Line 49: `user_id: user.id`

### Pattern 2: From Function Parameters

```typescript
// Service functions receive userId as parameter
export async function saveData(userId: string, data: any) {
  await supabase
    .from('table_name')
    .insert({
      user_id: userId,  // ← From parameter
      // other fields...
    });
}

// Called from component
const { user } = useAuth();
await saveData(user.id, myData);
```

**Used in:**
- `resumeService.ts` - Line 86: `user_id: userId` (from params)
- `jdMatchService.ts` - Line 19: `user_id: userId` (from params)
- `cvImproviserService.ts` - Uses `userId` parameter

### Pattern 3: From Supabase Session (For Verification)

```typescript
// Verify session matches context user
const { data: { session } } = await supabase.auth.getSession();
const authUserId = session?.user.id;

// Use auth.uid() value directly
await supabase
  .from('table_name')
  .insert({
    user_id: authUserId,  // ← From session (matches auth.uid())
    // other fields...
  });
```

**Used in:**
- `CVImproviser.tsx` - Line 127: Verifies `user.id === authUserId` before insert

---

## 📊 Table-by-Table Implementation

### 1. `user_profiles`
```typescript
// Pattern: user_profiles.id = auth.users.id (1:1 relationship)
// Created automatically via database trigger on signup

// Manual creation (backup):
await supabase
  .from('user_profiles')
  .upsert({
    id: user.id,  // ← Same as auth.users.id
    full_name: email.split('@')[0],
    plan_type: 'free',
  });
```

### 2. `cv_uploads`
```typescript
// Pattern: Direct from user context
await supabase
  .from('cv_uploads')
  .insert({
    user_id: user.id,  // ← From useAuth() hook
    session_id: user.id,  // Legacy field
    file_name: file.name,
    file_path: uploadData.path,
    file_size: file.size,
    extracted_text: extractedText,
  });
```

**Used in:**
- ATS Tool: `ATSUpload.tsx` line 72
- JD Matcher: `JDMatchUpload.tsx` line 84
- CV Improviser: `CVImproviser.tsx` line 127
- Resume Service: `resumeService.ts` line 86

### 3. `ats_analyses`
```typescript
// Pattern: From function parameter
await supabase
  .from('ats_analyses')
  .insert({
    user_id: userId,  // ← From saveResumeAnalysis(params.userId)
    cv_upload_id: cvUploadId,
    overall_score: analysis.overallScore,
    // other fields...
  });
```

**Used in:**
- `resumeService.ts` - `saveResumeAnalysis()` function

### 4. `jd_matches`
```typescript
// Pattern: From function parameter
await supabase
  .from('jd_matches')
  .insert({
    user_id: userId,  // ← From saveJDMatchAnalysis(params.userId)
    cv_upload_id: cvUploadId,
    jd_text: jdText,
    overall_score: analysis.overallScore,
    // other fields...
  });
```

**Used in:**
- `jdMatchService.ts` - `saveJDMatchAnalysis()` function

### 5. `cv_enhancements`
```typescript
// Pattern: Direct from user context
await supabase
  .from('cv_enhancements')
  .insert({
    user_id: user.id,  // ← From useAuth() hook
    cv_upload_id: savedCvUploadId,
    original_text: extractionResult.text,
    status: 'editing',
    // other fields...
  });
```

**Used in:**
- `CVImproviser.tsx` - Line 213

### 6. `cv_enhancement_sections`
```typescript
// Pattern: Linked via cv_enhancements (indirect user_id)
// RLS policy checks through parent table
await supabase
  .from('cv_enhancement_sections')
  .insert({
    enhancement_id: enhancement.id,  // ← Links to cv_enhancements
    section_name: section,
    // other fields...
  });
```

**RLS Policy:** Checks `cv_enhancements.user_id = auth.uid()` via EXISTS subquery

### 7. `cv_bullets`
```typescript
// Pattern: Linked via cv_enhancement_sections (indirect user_id)
await supabase
  .from('cv_bullets')
  .insert({
    section_id: sectionId,  // ← Links to cv_enhancement_sections
    original_text: plainText,
    // other fields...
  });
```

**RLS Policy:** Checks through `cv_enhancement_sections` → `cv_enhancements` → `user_id`

### 8. `resume_suggestions`
```typescript
// Pattern: Direct from user context
await supabase
  .from('resume_suggestions')
  .insert({
    user_id: user.id,  // ← From useAuth() hook
    cv_upload_id: cvUploadId,
    section_name: sectionName,
    // other fields...
  });
```

**Used in:**
- `aiSuggestionService.ts` - `generateAllSuggestions()` function

### 9. `resume_edits`
```typescript
// Pattern: Direct from user context
await supabase
  .from('resume_edits')
  .insert({
    user_id: userId,  // ← From function parameter
    cv_upload_id: cvUploadId,
    edit_type: 'suggestion_applied',
    // other fields...
  });
```

### 10. `usage_tracking`
```typescript
// Pattern: Direct from user context
await supabase
  .from('usage_tracking')
  .insert({
    user_id: user.id,  // ← From useAuth() hook
    tool_type: 'ats_analyzer',
    analysis_id: analysisId,
    date_only: CURRENT_DATE,
  });
```

---

## 🔒 RLS Policy Pattern

### Standard Pattern (Direct user_id)

```sql
-- For tables with direct user_id column
CREATE POLICY "Users can insert own records"
  ON table_name FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);
```

**Used in:**
- `cv_uploads`
- `ats_analyses`
- `jd_matches`
- `cv_enhancements`
- `resume_suggestions`
- `resume_edits`
- `usage_tracking`

### Indirect Pattern (Via Parent Table)

```sql
-- For tables linked through other tables
CREATE POLICY "Users can insert own records"
  ON child_table FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM parent_table
      WHERE parent_table.id = child_table.parent_id
      AND parent_table.user_id = (select auth.uid())
    )
  );
```

**Used in:**
- `cv_enhancement_sections` (via `cv_enhancements`)
- `cv_bullets` (via `cv_enhancement_sections` → `cv_enhancements`)

---

## 📝 Code Patterns Summary

### Pattern A: Direct Component Insert
```typescript
// Component directly inserts with user.id
const { user } = useAuth();
await supabase.from('table').insert({ user_id: user.id });
```

**Files:**
- `ATSUpload.tsx`
- `JDMatchUpload.tsx`
- `CVImproviser.tsx`
- `JDMatcherTool.tsx`

### Pattern B: Service Function with Parameter
```typescript
// Service receives userId as parameter
export async function saveData(userId: string, data: any) {
  await supabase.from('table').insert({ user_id: userId });
}

// Component calls service
const { user } = useAuth();
await saveData(user.id, data);
```

**Files:**
- `resumeService.ts`
- `jdMatchService.ts`
- `cvImproviserService.ts`
- `aiSuggestionService.ts`

### Pattern C: Session Verification
```typescript
// Verify session before insert
const { data: { session } } = await supabase.auth.getSession();
const authUserId = session.user.id;
await supabase.from('table').insert({ user_id: authUserId });
```

**Files:**
- `CVImproviser.tsx` (with verification)

---

## ✅ Best Practices

### 1. Always Verify User is Authenticated
```typescript
if (!user) {
  setError('Please log in to use this feature');
  return;
}
```

### 2. Use user.id from Context (Preferred)
```typescript
const { user } = useAuth();
// user.id is always the current authenticated user
```

### 3. Verify Session for Critical Operations
```typescript
const { data: { session } } = await supabase.auth.getSession();
if (!session) {
  // Handle expired session
}
```

### 4. Pass userId to Service Functions
```typescript
// Service functions should receive userId as parameter
// This makes them testable and reusable
export async function saveData(userId: string, data: any) {
  // Use userId parameter
}
```

### 5. RLS Policies Must Match
```sql
-- Policy must check: (select auth.uid()) = user_id
-- This ensures user can only insert their own records
WITH CHECK ((select auth.uid()) = user_id);
```

---

## 🔍 Verification Checklist

When implementing user_id:

- [ ] User is authenticated (`user` from `useAuth()`)
- [ ] `user_id` field is set to `user.id`
- [ ] RLS policy exists and uses `(select auth.uid()) = user_id`
- [ ] Session is valid (for critical operations)
- [ ] `user_id` matches `auth.uid()` (for RLS to work)
- [ ] Foreign key constraint exists: `REFERENCES auth.users(id)`
- [ ] `ON DELETE CASCADE` is set (optional, for cleanup)

---

## 🐛 Common Issues

### Issue 1: user_id is NULL
**Cause:** User not authenticated or `user` is null
**Fix:** Check `if (!user) return;` before using `user.id`

### Issue 2: RLS Policy Blocks Insert
**Cause:** `user_id` doesn't match `auth.uid()`
**Fix:** Verify `user.id === session.user.id` before insert

### Issue 3: user_id Type Mismatch
**Cause:** Passing string instead of UUID
**Fix:** Ensure `user.id` is UUID (Supabase handles this automatically)

### Issue 4: Session Expired
**Cause:** JWT token expired
**Fix:** Re-authenticate user or refresh session

---

## 📊 Current Implementation Status

| Table | user_id Source | RLS Policy | Status |
|-------|---------------|------------|--------|
| `user_profiles` | `auth.users.id` (trigger) | ✅ | Working |
| `cv_uploads` | `user.id` (context) | ✅ | Working |
| `ats_analyses` | `userId` (parameter) | ✅ | Working |
| `jd_matches` | `userId` (parameter) | ✅ | Working |
| `cv_enhancements` | `user.id` (context) | ✅ | Working |
| `cv_enhancement_sections` | Indirect (via parent) | ✅ | Working |
| `cv_bullets` | Indirect (via parent) | ✅ | Working |
| `resume_suggestions` | `user.id` (context) | ✅ | Working |
| `resume_edits` | `userId` (parameter) | ✅ | Working |
| `usage_tracking` | `user.id` (context) | ✅ | Working |

---

## 🎯 Summary

**Standard Pattern:**
1. Get `user` from `useAuth()` hook
2. Use `user.id` as `user_id` in database operations
3. RLS policy checks `(select auth.uid()) = user_id`
4. For service functions, pass `userId` as parameter

**Key Points:**
- `user.id` from React context = authenticated user's UUID
- `auth.uid()` in RLS = same UUID from JWT token
- They must match for RLS to allow the operation
- Always verify user is authenticated before database operations

