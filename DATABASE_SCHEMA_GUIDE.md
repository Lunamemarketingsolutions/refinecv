# Database Schema Guide - All Tables Explained

This document explains all tables in your Supabase database and their purposes.

---

## 📊 Table Overview

Your database contains **12 main tables** organized by feature:

### User Management (2 tables)
1. `user_profiles` - User account information
2. `usage_tracking` - Tool usage analytics

### File Storage (1 table)
3. `cv_uploads` - Uploaded CV files metadata

### ATS Analyzer (3 tables)
4. `ats_analyses` - ATS analysis results
5. `resume_suggestions` - AI suggestions for improving ATS score
6. `resume_edits` - History of edits made to resume

### JD CV Matcher (1 table)
7. `jd_matches` - Job description matching analyses

### CV Enhancer/Improviser (4 tables)
8. `cv_enhancements` - Main enhancement sessions
9. `cv_enhancement_sections` - Individual CV sections
10. `cv_bullets` - Individual bullet points with AI suggestions
11. `cv_enhancement_versions` - Version history

### Legacy (1 table)
12. `cv_analyses` - Legacy CV analysis (from original project)

---

## 📋 Detailed Table Descriptions

### 1. `user_profiles`
**Purpose**: Stores user account information and subscription details

**Key Fields**:
- `id` - User UUID (references `auth.users`)
- `full_name` - User's full name
- `plan_type` - 'free' or 'premium'
- `profile_photo_url` - Profile picture URL
- `premium_expires_at` - Premium subscription expiration
- `created_at` - Account creation date
- `updated_at` - Last profile update

**Used By**: Dashboard, user settings, subscription management

---

### 2. `usage_tracking`
**Purpose**: Tracks how many times each user uses each tool (for daily limits)

**Key Fields**:
- `id` - Unique tracking record ID
- `user_id` - User UUID
- `tool_type` - 'ats_analyzer', 'jd_matcher', or 'cv_enhancer'
- `analysis_id` - Reference to the analysis created
- `created_at` - When the tool was used
- `date_only` - Date (for daily limit calculations)

**Used By**: Dashboard usage limits, free plan restrictions

---

### 3. `cv_uploads`
**Purpose**: Stores metadata about uploaded CV files

**Key Fields**:
- `id` - Upload UUID
- `user_id` - User who uploaded (added later)
- `session_id` - Anonymous session ID (legacy)
- `file_name` - Original filename
- `file_path` - Storage path in Supabase Storage
- `file_size` - File size in bytes
- `extracted_text` - Text extracted from PDF/DOCX
- `created_at` - Upload timestamp

**Used By**: All features that need CV file information

---

### 4. `ats_analyses`
**Purpose**: Stores ATS (Applicant Tracking System) analysis results

**Key Fields**:
- `id` - Analysis UUID
- `user_id` - User who ran the analysis
- `cv_upload_id` - Reference to uploaded CV
- `overall_score` - ATS score (0-100)
- `critical_issues` - JSON array of critical problems
- `warnings` - JSON array of warnings
- `passed_checks` - JSON array of passed checks
- `ats_text_extraction` - Raw text as ATS sees it
- `section_scores` - JSON object with scores per section
- `created_at` - Analysis timestamp
- `updated_at` - Last update

**Used By**: ATS Analyzer tool, dashboard

---

### 5. `resume_suggestions`
**Purpose**: Stores AI-generated suggestions for improving ATS score

**Key Fields**:
- `id` - Suggestion UUID
- `cv_upload_id` - CV this suggestion is for
- `user_id` - User who owns the CV
- `section_name` - Section name (e.g., "Experience")
- `section_key` - Normalized section key
- `original_content` - Original problematic text
- `suggested_content` - AI-suggested improvement
- `suggestion_reason` - Why this helps
- `status` - 'pending', 'accepted', or 'rejected'
- `line_number` - Line number in PDF
- `coordinates` - Bounding box for overlay positioning
- `estimated_score_improvement` - Expected score increase
- `created_at` - Suggestion timestamp
- `updated_at` - Last update

**Used By**: ATS Analyzer viewer, suggestion overlay

---

### 6. `resume_edits`
**Purpose**: Tracks all edits made to resumes (for history/analytics)

**Key Fields**:
- `id` - Edit UUID
- `cv_upload_id` - CV that was edited
- `user_id` - User who made the edit
- `suggestion_id` - If edit came from a suggestion
- `edit_type` - 'suggestion_applied', 'manual_edit', or 'rollback'
- `section_affected` - Which section was edited
- `changes_made` - JSON object with change details
- `created_at` - Edit timestamp

**Used By**: Edit history, analytics

---

### 7. `jd_matches`
**Purpose**: Stores JD (Job Description) CV matching analysis results

**Key Fields**:
- `id` - Match UUID
- `user_id` - User who ran the analysis
- `cv_upload_id` - Reference to uploaded CV
- `jd_text` - Job description content
- `jd_source` - 'paste', 'pdf', 'docx', 'txt', or 'image'
- `jd_metadata` - JSON with file info, detected role, company
- `overall_score` - Match percentage (0-100)
- `matched_keywords` - JSON array of matched keywords
- `partial_matches` - JSON array of partial matches
- `missing_keywords` - JSON array of missing keywords
- `strengths` - JSON array of strength analyses
- `weaknesses` - JSON array of weakness analyses
- `action_items` - JSON array of recommendations
- `created_at` - Analysis timestamp
- `updated_at` - Last update

**Used By**: JD CV Matcher tool

---

### 8. `cv_enhancements`
**Purpose**: Main table for CV enhancement/improviser sessions

**Key Fields**:
- `id` - Enhancement UUID
- `user_id` - User who created the enhancement
- `cv_upload_id` - Reference to uploaded CV
- `original_text` - Original CV text
- `overall_score_before` - Score before enhancement (0-100)
- `overall_score_after` - Score after enhancement (0-100)
- `status` - 'analyzing', 'editing', or 'completed'
- `created_at` - Session start
- `updated_at` - Last update
- `completed_at` - Completion timestamp

**Used By**: CV Improviser tool

---

### 9. `cv_enhancement_sections`
**Purpose**: Individual CV sections within an enhancement session

**Key Fields**:
- `id` - Section UUID
- `enhancement_id` - Parent enhancement
- `section_name` - Section name (e.g., "Experience")
- `section_order` - Display order
- `rating_before` - Rating before (1-5)
- `rating_after` - Rating after (1-5)
- `total_bullets` - Total bullet points in section
- `enhanced_bullets` - Number of enhanced bullets
- `is_complete` - Whether section is done
- `created_at` - Section creation
- `updated_at` - Last update

**Used By**: CV Improviser section management

---

### 10. `cv_bullets`
**Purpose**: Individual bullet points with AI suggestions

**Key Fields**:
- `id` - Bullet UUID
- `section_id` - Parent section
- `original_text` - Original bullet text
- `current_text` - Current edited text
- `enhanced_text` - AI-suggested improvement
- `bullet_order` - Display order
- `rating_before` - Rating before (1-5)
- `rating_after` - Rating after (1-5)
- `issues` - JSON array of identified issues
- `suggestions` - JSON array of AI suggestions
- `is_enhanced` - Whether bullet was enhanced
- `user_context` - User-provided context
- `created_at` - Bullet creation
- `updated_at` - Last update

**Used By**: CV Improviser bullet editor

---

### 11. `cv_enhancement_versions`
**Purpose**: Version history for CV enhancements (snapshots)

**Key Fields**:
- `id` - Version UUID
- `enhancement_id` - Parent enhancement
- `version_number` - Version number
- `version_name` - Optional version name
- `snapshot_data` - JSON snapshot of all data
- `created_at` - Version creation

**Used By**: Version history, rollback functionality

---

### 12. `cv_analyses` (Legacy)
**Purpose**: Legacy table from original project (may not be actively used)

**Key Fields**:
- `id` - Analysis UUID
- `session_id` - Anonymous session ID
- `cv_upload_id` - Reference to CV upload
- `cv_text` - CV text
- `jd_text` - Job description text
- `match_score` - Match percentage
- `matched_keywords` - JSON array
- `missing_keywords` - JSON array
- `partial_matches` - JSON array
- `strengths` - JSON array
- `weaknesses` - JSON array
- `action_items` - JSON array
- `analysis_metadata` - Additional data
- `created_at` - Analysis timestamp
- `updated_at` - Last update

**Used By**: Legacy features (may be deprecated)

---

## 🔗 Table Relationships

```
auth.users (Supabase built-in)
  ├── user_profiles (1:1)
  ├── usage_tracking (1:many)
  ├── cv_uploads (1:many)
  ├── ats_analyses (1:many)
  ├── jd_matches (1:many)
  └── cv_enhancements (1:many)

cv_uploads
  ├── ats_analyses (1:many)
  ├── jd_matches (1:many)
  ├── cv_enhancements (1:many)
  ├── resume_suggestions (1:many)
  └── resume_edits (1:many)

cv_enhancements
  ├── cv_enhancement_sections (1:many)
  └── cv_enhancement_versions (1:many)

cv_enhancement_sections
  └── cv_bullets (1:many)

resume_suggestions
  └── resume_edits (1:many, optional)
```

---

## 🔐 Security (RLS - Row Level Security)

All tables have **Row Level Security (RLS)** enabled, meaning:
- Users can only see their own data
- Users can only modify their own data
- Anonymous users have limited access (legacy tables only)

---

## 📈 Usage Patterns

### Most Active Tables:
1. `cv_uploads` - Every file upload
2. `ats_analyses` - Every ATS analysis
3. `jd_matches` - Every JD match analysis
4. `cv_enhancements` - Every CV enhancement session

### Analytics Tables:
- `usage_tracking` - For tracking daily limits
- `resume_edits` - For tracking user engagement

### Feature-Specific:
- ATS Analyzer: `ats_analyses`, `resume_suggestions`, `resume_edits`
- JD Matcher: `jd_matches`
- CV Improviser: `cv_enhancements`, `cv_enhancement_sections`, `cv_bullets`, `cv_enhancement_versions`

---

## 🗑️ Cleanup Notes

- `cv_analyses` may be legacy and could potentially be removed if not used
- Old `session_id` based records in `cv_uploads` and `cv_analyses` are from before authentication was added

---

## 💡 Tips for Querying

### Get all user's analyses:
```sql
SELECT * FROM ats_analyses WHERE user_id = 'user-uuid';
```

### Get user's usage today:
```sql
SELECT tool_type, COUNT(*) 
FROM usage_tracking 
WHERE user_id = 'user-uuid' 
  AND date_only = CURRENT_DATE
GROUP BY tool_type;
```

### Get enhancement with all sections and bullets:
```sql
SELECT 
  e.*,
  json_agg(DISTINCT s.*) as sections,
  json_agg(DISTINCT b.*) as bullets
FROM cv_enhancements e
LEFT JOIN cv_enhancement_sections s ON s.enhancement_id = e.id
LEFT JOIN cv_bullets b ON b.section_id = s.id
WHERE e.user_id = 'user-uuid'
GROUP BY e.id;
```

