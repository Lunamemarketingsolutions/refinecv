# Feature Usage Tracking Implementation Plan

## Overview
Track how many times each user has uploaded CVs on each tool (ATS Tool, CV Enhancer, JD Match Tool) and maintain accurate counts.

## Current State Analysis

### Existing Infrastructure
1. **`usage_tracking` table** already exists with:
   - `id` (uuid, primary key)
   - `user_id` (uuid, references auth.users)
   - `tool_type` (text) - 'ats_analyzer', 'jd_matcher', 'cv_enhancer'
   - `analysis_id` (uuid, nullable, references cv_analyses) - **ISSUE: Only references cv_analyses**
   - `created_at` (timestamptz)
   - `date_only` (date) - for daily limit tracking

2. **Current Upload Points:**
   - **ATS Tool**: `src/services/ats/resumeService.ts` → `saveResumeAnalysis()` → creates `ats_analyses` record
   - **CV Enhancer**: `src/pages/CVEnhancer.tsx` → `handleAnalyze()` → creates `cv_enhancements` record
   - **JD Match Tool**: `src/services/jd-matcher/jdMatchService.ts` → `saveJDMatchAnalysis()` → creates `jd_matches` record

3. **Current Issues:**
   - `usage_tracking.analysis_id` only references `cv_analyses`, but:
     - ATS Tool creates `ats_analyses` (different table)
     - CV Enhancer creates `cv_enhancements` (different table)
     - JD Match creates `jd_matches` (different table)
   - Usage tracking records are **NOT being inserted** at upload points
   - Dashboard queries `cv_analyses` for counts instead of `usage_tracking`

## Solution Approach

### Option A: Make `analysis_id` nullable and add `cv_upload_id` (RECOMMENDED)
**Pros:**
- Minimal schema changes
- Can track uploads even if analysis fails
- Links to actual CV upload record
- Backward compatible

**Cons:**
- Need to update foreign key constraint

### Option B: Create separate tracking without foreign keys
**Pros:**
- No foreign key constraints
- More flexible

**Cons:**
- Loses referential integrity
- More complex queries

## Recommended Implementation: Option A

### Phase 1: Database Schema Updates

#### 1.1 Modify `usage_tracking` table
```sql
-- Add cv_upload_id column (more reliable than analysis_id)
ALTER TABLE usage_tracking 
ADD COLUMN IF NOT EXISTS cv_upload_id uuid REFERENCES cv_uploads(id) ON DELETE SET NULL;

-- Make analysis_id nullable (it's already nullable, but ensure it)
-- Keep analysis_id for backward compatibility but make it optional

-- Add index for cv_upload_id lookups
CREATE INDEX IF NOT EXISTS idx_usage_tracking_cv_upload_id 
ON usage_tracking(cv_upload_id);

-- Add composite index for user + tool_type queries
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_tool 
ON usage_tracking(user_id, tool_type);
```

#### 1.2 Update RLS Policies (if needed)
- Current policies should work, but verify:
  - Users can insert their own usage records
  - Users can view their own usage records

### Phase 2: Create Usage Tracking Service

#### 2.1 Create `src/services/usageTrackingService.ts`
```typescript
// Centralized service for tracking feature usage
export async function trackFeatureUsage(
  userId: string,
  toolType: 'ats_analyzer' | 'jd_matcher' | 'cv_enhancer',
  cvUploadId: string,
  analysisId?: string
): Promise<void>
```

**Functions:**
- `trackFeatureUsage()` - Insert usage record
- `getUserUsageCount()` - Get total count per tool for a user
- `getUserUsageToday()` - Get today's usage count per tool
- `getUserUsageHistory()` - Get usage history with pagination

### Phase 3: Integrate Tracking at Upload Points

#### 3.1 ATS Tool (`src/services/ats/resumeService.ts`)
- In `saveResumeAnalysis()` function
- After successfully creating `ats_analyses` record
- Call `trackFeatureUsage(userId, 'ats_analyzer', cvUploadId, analysisId)`

#### 3.2 CV Enhancer (`src/pages/CVEnhancer.tsx`)
- In `handleAnalyze()` function
- After successfully creating `cv_enhancements` record
- Call `trackFeatureUsage(userId, 'cv_enhancer', cvUploadId)`

#### 3.3 JD Match Tool (`src/services/jd-matcher/jdMatchService.ts`)
- In `saveJDMatchAnalysis()` function
- After successfully creating `jd_matches` record
- Call `trackFeatureUsage(userId, 'jd_matcher', cvUploadId, matchId)`

### Phase 4: Update Dashboard Queries

#### 4.1 Update `src/hooks/useDashboardData.ts`
- Replace queries from `cv_analyses` with `usage_tracking`
- Get `featureUsage` counts from `usage_tracking` table
- Get `usageToday` counts from `usage_tracking` with `date_only` filter
- Get `recentActivity` by joining `usage_tracking` with `cv_uploads`

### Phase 5: Add Usage Display Components (Optional)

#### 5.1 Create usage statistics component
- Show total uploads per feature
- Show usage over time (charts)
- Show daily limits and remaining usage

## Implementation Details

### Database Migration
**File**: `supabase/migrations/YYYYMMDDHHMMSS_add_cv_upload_id_to_usage_tracking.sql`

```sql
-- Add cv_upload_id column
ALTER TABLE usage_tracking 
ADD COLUMN IF NOT EXISTS cv_upload_id uuid REFERENCES cv_uploads(id) ON DELETE SET NULL;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_usage_tracking_cv_upload_id 
ON usage_tracking(cv_upload_id);

CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_tool 
ON usage_tracking(user_id, tool_type);

-- Add index for total count queries
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_tool_created 
ON usage_tracking(user_id, tool_type, created_at DESC);
```

### Usage Tracking Service Implementation

**Key Functions:**

1. **`trackFeatureUsage()`**
   - Insert record into `usage_tracking`
   - Handle errors gracefully (non-blocking)
   - Log for debugging

2. **`getUserUsageCount()`**
   - Query: `SELECT COUNT(*) FROM usage_tracking WHERE user_id = ? AND tool_type = ?`
   - Return total count per tool

3. **`getUserUsageToday()`**
   - Query: `SELECT COUNT(*) FROM usage_tracking WHERE user_id = ? AND tool_type = ? AND date_only = CURRENT_DATE`
   - Return today's count per tool

4. **`getUserUsageHistory()`**
   - Query with pagination
   - Join with `cv_uploads` to get file names
   - Return formatted history

### Integration Points

#### ATS Tool Integration
```typescript
// In saveResumeAnalysis() after creating ats_analyses
import { trackFeatureUsage } from '../usageTrackingService';

// After line 161 (after analysisData is created)
await trackFeatureUsage(
  userId,
  'ats_analyzer',
  cvUploadId,
  analysisData.id
);
```

#### CV Enhancer Integration
```typescript
// In handleAnalyze() after creating cv_enhancements
import { trackFeatureUsage } from '../services/usageTrackingService';

// After enhancement is saved (around line 200-250)
if (enhancement && savedCvUploadId) {
  await trackFeatureUsage(
    user.id,
    'cv_enhancer',
    savedCvUploadId
  );
}
```

#### JD Match Tool Integration
```typescript
// In saveJDMatchAnalysis() after creating jd_matches
import { trackFeatureUsage } from '../usageTrackingService';

// After line 30 (after data is created)
await trackFeatureUsage(
  userId,
  'jd_matcher',
  cvUploadId || '', // Handle null case
  data.id
);
```

## Testing Plan

### Unit Tests
1. Test `trackFeatureUsage()` with valid inputs
2. Test `getUserUsageCount()` returns correct counts
3. Test `getUserUsageToday()` filters by date correctly

### Integration Tests
1. Upload CV in ATS Tool → verify usage record created
2. Upload CV in CV Enhancer → verify usage record created
3. Upload CV in JD Match Tool → verify usage record created
4. Verify dashboard shows correct counts

### Manual Testing
1. Upload 3 CVs in ATS Tool → check count = 3
2. Upload 2 CVs in CV Enhancer → check count = 2
3. Upload 1 CV in JD Match Tool → check count = 1
4. Verify daily limits work correctly
5. Verify total counts are accurate

## Rollout Strategy

1. **Step 1**: Create database migration
2. **Step 2**: Create usage tracking service
3. **Step 3**: Integrate at one upload point (ATS Tool) - test
4. **Step 4**: Integrate at remaining upload points
5. **Step 5**: Update dashboard queries
6. **Step 6**: Test end-to-end
7. **Step 7**: Deploy

## Benefits

1. **Accurate Tracking**: Every CV upload is tracked
2. **Performance**: Indexed queries for fast counts
3. **Flexibility**: Can track additional metrics in future
4. **Reliability**: Links to `cv_uploads` (source of truth)
5. **Analytics**: Can generate usage reports and insights

## Future Enhancements

1. Add usage analytics dashboard
2. Track feature usage by date range
3. Export usage reports
4. Add usage limits enforcement
5. Track feature usage by plan type (free vs premium)

