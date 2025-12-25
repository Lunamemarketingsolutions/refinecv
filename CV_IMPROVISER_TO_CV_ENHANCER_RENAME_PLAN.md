# CV Improviser → CV Enhancer Rename Plan

## 📋 Overview
This plan outlines all changes needed to rename "CV Improviser" to "CV Enhancer" throughout the codebase while maintaining full functionality.

---

## 🎯 Scope of Changes

### ✅ What Will Change:
- File names (pages, components, services)
- Directory names (`cv-improviser` → `cv-enhancer`)
- Component names (`CVImproviser` → `CVEnhancer`)
- Route paths (`/cv-improviser` → `/cv-enhancer`)
- Display text/UI labels
- Variable names
- Function names
- Import statements
- Comments/documentation

### ⚠️ What Will NOT Change:
- Database table names (already use `cv_enhancer`/`cv_enhancements`)
- Database column names
- API endpoints (if any)
- Environment variables
- External service names

---

## 📁 Files to Rename

### 1. Main Page File
- **Current**: `src/pages/CVImproviser.tsx`
- **New**: `src/pages/CVEnhancer.tsx`
- **Component Name**: `CVImproviser` → `CVEnhancer`

### 2. Service File
- **Current**: `src/services/cvImproviserService.ts`
- **New**: `src/services/cvEnhancerService.ts`
- **Function Names**: `saveCVEnhancement` (already correct), `validateCVFile` (keep)

### 3. Component Directory
- **Current**: `src/components/cv-improviser/`
- **New**: `src/components/cv-enhancer/`
- **All files inside** (no individual file renames needed, just directory):
  - `AISuggestionDrawer.tsx`
  - `BulletEditorCard.tsx`
  - `CVPreview.tsx`
  - `CVUploadSection.tsx`
  - `HowItWorksSection.tsx`
  - `ScoreDisplay.tsx`
  - `SectionsEnhanced.tsx`
  - `SectionTabs.tsx`

### 4. Documentation Files (Optional - can keep for history)
- `CV_IMPROVISER_LEFT_ALIGN_BULLETS_ANALYSIS.md` → Keep or rename
- `CV_IMPROVISER_FORMATTING_ANALYSIS.md` → Keep or rename
- `IMPLEMENTATION_SUMMARY.md` → Update content
- `TESTING_GUIDE.md` → Update content

---

## 🔄 Code Changes Required

### 1. Route Path Changes
**File**: `src/App.tsx`
- **Line 24**: Import `CVEnhancer` instead of `CVImproviser`
- **Line 58**: Route path `/cv-improviser` → `/cv-enhancer`
- **Element**: `<CVEnhancer />` instead of `<CVImproviser />`

### 2. Import Statements
**Files to update**:
- `src/App.tsx` - Import CVEnhancer
- `src/pages/CVEnhancer.tsx` - Update component imports from `cv-improviser` to `cv-enhancer`
- All components in `cv-enhancer/` directory (if they import each other)

### 3. Component Names
**File**: `src/pages/CVEnhancer.tsx`
- **Line 26**: `export default function CVEnhancer()`
- **Line 512**: Error message text "CV Improviser" → "CV Enhancer"

### 4. Display Text/UI Labels
**Files to update**:
- `src/components/dashboard/Sidebar.tsx`
  - Line 32: Label already says "CV Enhancer" ✅
  - Line 44-45: Path check `/cv-improviser` → `/cv-enhancer`
  
- `src/components/dashboard/FeatureCards.tsx`
  - Line 70: Title already says "Instant CV Enhancer" ✅
  - Line 81: Path `/cv-improviser` → `/cv-enhancer`
  - Line 110-112: Comment and navigate path update

- `src/components/dashboard/RecentActivity.tsx`
  - Line 153-154: Comment and navigate path update

- `src/components/FeatureTools.tsx`
  - Line 7: Title "CV Improviser" → "CV Enhancer"

- `src/components/cv-enhancer/HowItWorksSection.tsx`
  - Line 31: Already says "Instant CV Enhancer" ✅

- `src/pages/AboutUs.tsx`
  - Line 22: Already says "Instant CV Enhancer" ✅

- `src/components/jd/RelatedFeatures.tsx`
  - Line 53: Already says "Instant CV Enhancer" ✅

- `src/components/ats/RelatedFeatures.tsx`
  - Line 42: Already says "Instant CV Enhancer" ✅

- `src/components/Footer.tsx`
  - Line 39: Already says "Instant CV Enhancer" ✅

### 5. Service Function Names
**File**: `src/services/cvEnhancerService.ts`
- Function names are already correct (`saveCVEnhancement`, `validateCVFile`)
- No changes needed ✅

### 6. Database References
**Status**: Already using `cv_enhancer` in database ✅
- `cv_enhancements` table
- `cv_enhancement_sections` table
- `cv_bullets` table
- `tool_type: 'cv_enhancer'` in usage tracking
- No database changes needed ✅

### 7. Hook/Data References
**Files to check** (already using `cvEnhancer`):
- `src/hooks/useDashboardData.ts` - Already uses `cvEnhancer` ✅
- `src/components/dashboard/UsageStatistics.tsx` - Already uses `cvEnhancer` ✅
- All dashboard pages - Already use `cvEnhancer` ✅

---

## 🔀 Route Path Decision

### Option A: Change Route Path (Recommended)
- **Old**: `/cv-improviser`
- **New**: `/cv-enhancer`
- **Pros**: Consistent naming, cleaner URLs
- **Cons**: Breaks existing bookmarks/links

### Option B: Keep Route Path (Alternative)
- **Keep**: `/cv-improviser`
- **Pros**: No broken links
- **Cons**: Inconsistent naming

**Recommendation**: Use Option A (change to `/cv-enhancer`) for consistency. Add redirect if needed.

---

## 📝 Step-by-Step Implementation Plan

### Phase 1: File Renames (Low Risk)
1. Rename `src/pages/CVImproviser.tsx` → `src/pages/CVEnhancer.tsx`
2. Rename `src/services/cvImproviserService.ts` → `src/services/cvEnhancerService.ts`
3. Rename directory `src/components/cv-improviser/` → `src/components/cv-enhancer/`

### Phase 2: Update Imports (Medium Risk)
4. Update import in `src/App.tsx`
5. Update imports in `src/pages/CVEnhancer.tsx` (component imports)
6. Check for any cross-component imports in `cv-enhancer/` directory

### Phase 3: Update Component Names (Low Risk)
7. Update component name in `src/pages/CVEnhancer.tsx`
8. Update error message text

### Phase 4: Update Routes (Medium Risk)
9. Update route path in `src/App.tsx`
10. Update path checks in `src/components/dashboard/Sidebar.tsx`
11. Update navigation paths in:
    - `src/components/dashboard/FeatureCards.tsx`
    - `src/components/dashboard/RecentActivity.tsx`

### Phase 5: Update Display Text (Low Risk)
12. Update title in `src/components/FeatureTools.tsx`
13. Verify all other display text (most already say "CV Enhancer")

### Phase 6: Testing (Critical)
14. Test route navigation
15. Test file upload
16. Test CV parsing
17. Test editing functionality
18. Test AI suggestions
19. Test PDF download
20. Test database operations

---

## ⚠️ Potential Issues & Solutions

### Issue 1: Broken Bookmarks/Links
**Solution**: Add redirect route (optional)
```typescript
<Route path="/cv-improviser" element={<Navigate to="/cv-enhancer" replace />} />
```

### Issue 2: Import Path Errors
**Solution**: Use IDE's "Find and Replace" for bulk updates
- Search: `cv-improviser`
- Replace: `cv-enhancer`
- Search: `CVImproviser`
- Replace: `CVEnhancer`

### Issue 3: Git History
**Solution**: Use `git mv` to preserve history
```bash
git mv src/pages/CVImproviser.tsx src/pages/CVEnhancer.tsx
git mv src/services/cvImproviserService.ts src/services/cvEnhancerService.ts
git mv src/components/cv-improviser src/components/cv-enhancer
```

### Issue 4: Build Cache
**Solution**: Clear build cache after renaming
```bash
rm -rf node_modules/.vite
npm run dev
```

---

## ✅ Verification Checklist

After implementation, verify:

- [ ] Route `/cv-enhancer` works
- [ ] All navigation links work
- [ ] File upload works
- [ ] CV parsing works (PDF & DOCX)
- [ ] Section tabs work
- [ ] Bullet editing works
- [ ] Formatting tools work (bold, italic, underline, alignment, bullets)
- [ ] AI suggestions work
- [ ] Live preview updates correctly
- [ ] PDF download works
- [ ] Database operations work (cv_uploads, cv_enhancements)
- [ ] Dashboard shows correct usage stats
- [ ] Sidebar navigation works
- [ ] Feature cards work
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] No linting errors

---

## 📊 Impact Summary

### Files to Rename: 3
- 1 page file
- 1 service file
- 1 component directory (8 files inside)

### Files to Modify: ~15
- Route files
- Import statements
- Display text
- Navigation paths

### Risk Level: **LOW-MEDIUM**
- Most database references already use `cv_enhancer`
- Most UI text already says "CV Enhancer"
- Main changes are file names and routes
- No database schema changes needed

### Estimated Time: **30-45 minutes**
- File renames: 5 minutes
- Code updates: 15-20 minutes
- Testing: 10-15 minutes
- Verification: 5 minutes

---

## 🚀 Ready to Implement?

This plan ensures:
- ✅ No functionality loss
- ✅ Consistent naming throughout
- ✅ Database compatibility maintained
- ✅ All references updated
- ✅ Testing checklist provided

**Next Step**: Review this plan, then proceed with implementation.

