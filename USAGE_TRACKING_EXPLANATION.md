# Usage Tracking: How Records Are Identified Per Account

## Overview
Usage tracking uses the `user_id` field in the `usage_tracking` table to associate each usage record with a specific user account. This document explains the complete flow.

## Database Schema

### `usage_tracking` Table Structure
```sql
CREATE TABLE usage_tracking (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id),  -- ⭐ KEY FIELD: Links to user account
  tool_type text NOT NULL,                          -- 'ats_analyzer', 'jd_matcher', 'cv_enhancer'
  cv_upload_id uuid REFERENCES cv_uploads(id),
  analysis_id uuid REFERENCES cv_analyses(id),
  created_at timestamptz DEFAULT now(),
  date_only date DEFAULT CURRENT_DATE
);
```

**Key Point:** The `user_id` field is the primary identifier that links each usage record to a specific user account.

## Flow: How Usage Is Tracked

### Step 1: User Action Triggers Tracking
When a user uploads a CV in any tool (ATS, JD Match, or CV Enhancer), the code calls `trackFeatureUsage()`:

**Example from ATS Tool:**
```typescript
// src/services/ats/resumeService.ts
trackFeatureUsage(userId, 'ats_analyzer', cvUploadId)
```

**Example from JD Match Tool:**
```typescript
// src/services/jd-matcher/jdMatchService.ts
trackFeatureUsage(userId, 'jd_matcher', cvUploadId)
```

**Example from CV Enhancer:**
```typescript
// src/pages/CVEnhancer.tsx
trackFeatureUsage(user.id, 'cv_enhancer', savedCvUploadId)
```

### Step 2: Session Verification
The `trackFeatureUsage()` function verifies the user's session to ensure security:

```typescript
// src/services/usageTrackingService.ts
export async function trackFeatureUsage(
  userId: string,        // User ID passed from calling code
  toolType: ToolType,
  cvUploadId: string
) {
  // 1. Get current session
  const { data: { session } } = await supabase.auth.getSession();
  
  // 2. Verify user_id matches session
  if (session.user.id !== userId) {
    console.error('User ID mismatch');
    return; // Security: Don't track if mismatch
  }
  
  // 3. Insert usage record with user_id
  await supabase.from('usage_tracking').insert({
    user_id: userId,        // ⭐ This links the record to the user
    tool_type: toolType,
    cv_upload_id: cvUploadId,
    date_only: today
  });
}
```

**Security Check:** The function verifies that the `userId` parameter matches the authenticated session's user ID. This prevents users from tracking usage for other accounts.

### Step 3: Database Insert
The record is inserted into `usage_tracking` with the `user_id` field:

```sql
INSERT INTO usage_tracking (user_id, tool_type, cv_upload_id, date_only)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',  -- User's UUID from auth.users
  'ats_analyzer',
  'cv_upload_uuid',
  '2024-01-15'
);
```

### Step 4: Row Level Security (RLS)
Supabase RLS policies ensure users can only see their own records:

```sql
-- RLS Policy
CREATE POLICY "Users can view own usage"
  ON usage_tracking FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));
```

This means:
- User A can only query records where `user_id = User A's ID`
- User B can only query records where `user_id = User B's ID`
- Even if a query doesn't explicitly filter by `user_id`, RLS automatically filters it

## Flow: How Usage Is Retrieved

### Step 1: Query with User ID Filter
When checking usage limits or displaying usage counts, the code queries with `user_id`:

```typescript
// src/services/usageTrackingService.ts
export async function getToolUsageCount(
  userId: string,
  toolType: ToolType
): Promise<number> {
  // 1. Verify session
  const { data: { session } } = await supabase.auth.getSession();
  const actualUserId = session.user.id;  // Use session user ID for security
  
  // 2. Query with user_id filter
  const { count } = await supabase
    .from('usage_tracking')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', actualUserId)  // ⭐ Filter by user_id
    .eq('tool_type', toolType);
  
  return count || 0;
}
```

### Step 2: RLS Enforcement
Even if the code didn't filter by `user_id`, RLS would automatically filter:

```sql
-- This query:
SELECT COUNT(*) FROM usage_tracking WHERE tool_type = 'ats_analyzer';

-- Is automatically transformed by RLS to:
SELECT COUNT(*) FROM usage_tracking 
WHERE tool_type = 'ats_analyzer' 
AND user_id = auth.uid();  -- RLS adds this automatically
```

## Complete Example Flow

### Scenario: User "john@example.com" uses ATS Analyzer

1. **User logs in:**
   - Supabase creates session with `user.id = "abc-123-user-id"`
   - This ID is stored in `auth.users` table

2. **User uploads CV in ATS Tool:**
   ```typescript
   // User's session has: user.id = "abc-123-user-id"
   trackFeatureUsage("abc-123-user-id", 'ats_analyzer', 'cv-upload-456')
   ```

3. **Record is inserted:**
   ```sql
   INSERT INTO usage_tracking VALUES (
     'record-789',
     'abc-123-user-id',  -- ⭐ Links to john@example.com's account
     'ats_analyzer',
     'cv-upload-456',
     '2024-01-15'
   );
   ```

4. **When checking usage:**
   ```typescript
   // Query for this user
   getToolUsageCount("abc-123-user-id", 'ats_analyzer')
   
   // SQL executed (with RLS):
   SELECT COUNT(*) FROM usage_tracking
   WHERE user_id = 'abc-123-user-id'  -- Only john's records
   AND tool_type = 'ats_analyzer';
   ```

5. **Result:**
   - Returns count of records where `user_id = 'abc-123-user-id'`
   - Other users' records are automatically excluded by RLS

## Key Security Features

### 1. Session Verification
- Every tracking function verifies the session before inserting
- Prevents tracking usage for other users

### 2. RLS Policies
- Database-level security
- Users can only see their own records
- Even if code has a bug, RLS protects data

### 3. User ID Validation
- Functions check that provided `userId` matches session
- Uses session `user_id` if there's a mismatch

## Visual Representation

```
┌─────────────────────────────────────────────────────────┐
│                    User Account                         │
│  Email: john@example.com                                │
│  User ID: abc-123-user-id (from auth.users)            │
└─────────────────────────────────────────────────────────┘
                          │
                          │ user_id reference
                          ▼
┌─────────────────────────────────────────────────────────┐
│              usage_tracking Table                        │
│                                                          │
│  ┌──────────┬──────────────────┬─────────────┐        │
│  │ id       │ user_id          │ tool_type   │        │
│  ├──────────┼──────────────────┼─────────────┤        │
│  │ rec-001  │ abc-123-user-id  │ ats_analyzer│  ← John│
│  │ rec-002  │ abc-123-user-id  │ jd_matcher  │  ← John│
│  │ rec-003  │ abc-123-user-id  │ cv_enhancer │  ← John│
│  │ rec-004  │ xyz-789-user-id  │ ats_analyzer│  ← Jane│
│  │ rec-005  │ xyz-789-user-id  │ jd_matcher │  ← Jane│
│  └──────────┴──────────────────┴─────────────┘        │
│                                                          │
│  When John queries:                                     │
│  → RLS filters to: user_id = 'abc-123-user-id'          │
│  → Returns: rec-001, rec-002, rec-003                   │
│                                                          │
│  When Jane queries:                                      │
│  → RLS filters to: user_id = 'xyz-789-user-id'          │
│  → Returns: rec-004, rec-005                            │
└─────────────────────────────────────────────────────────┘
```

## Summary

**How records are identified:**
1. Each `usage_tracking` record has a `user_id` field
2. This `user_id` is the UUID from `auth.users` table
3. When inserting, the code uses `user.id` from the authenticated session
4. When querying, the code filters by `user_id` AND RLS enforces it
5. Each user can only see records where `user_id` matches their account

**Security:**
- Session verification prevents tracking for other users
- RLS policies enforce database-level isolation
- User ID validation ensures correct association

**Result:**
- Each account's usage is completely isolated
- No user can see or modify another user's usage records
- Usage limits are enforced per account, not globally

