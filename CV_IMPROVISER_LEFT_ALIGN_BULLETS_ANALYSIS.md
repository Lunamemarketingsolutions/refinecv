# Root Cause Analysis: Left Align & Bullets Not Working in CV-Improviser

## Issue Description
- Left align button: No visible effect in editor or preview
- Bullets/list button: No visible effect in editor or preview

## Root Causes Identified

### Issue 1: Left Align - Quill Default Behavior
**Problem**: 
- Quill doesn't add a class for left alignment since it's the default
- When `align: 'left'` is set, Quill might not add `class="ql-align-left"` to the HTML
- The preview relies on finding `ql-align-left` class to apply left alignment
- Without the class, preview defaults to left but editor might not show it

**Evidence**:
- Line 109-127: Code tries to explicitly set left align, but Quill might ignore it
- Line 40-42 in CVPreview: CSS looks for `.ql-align-left` class
- If Quill doesn't add the class, CSS won't apply

### Issue 2: List Format - Incorrect Quill API Usage
**Problem**:
- Using `quill.formatText()` with `'list'` format might not work correctly
- List format in Quill needs to be applied to block-level content
- When there's no selection or content is empty, list format might not apply
- The format might need to be applied differently for Quill to recognize it

**Evidence**:
- Line 128-147: Uses `quill.formatText()` for list format
- Quill's list format is a block format, not an inline format
- Might need to use `quill.format('list', 'bullet')` instead

### Issue 3: No Selection Handling
**Problem**:
- When user clicks format button without selecting text, `range` might be null
- Code tries to format entire content with `quill.formatText(0, length - 1, ...)`
- But Quill's length includes the newline character, so `length - 1` might not work correctly
- Alignment and list formats might not apply to the entire content properly

**Evidence**:
- Line 89-105: Handles null range by formatting entire content
- Line 130-147: Same issue for list format
- Quill's `getLength()` returns length including trailing newline

### Issue 4: Content Structure
**Problem**:
- Quill wraps content in `<p>` tags by default
- List format needs to convert `<p>` to `<li>` inside `<ul>`
- If content structure isn't right, list format won't apply
- Alignment needs to be on the block element (`<p>`), not inline

## Solutions Needed

1. **Left Align**: Force Quill to add alignment class or use inline style
2. **List Format**: Use correct Quill API for list formatting
3. **Selection Handling**: Properly handle no-selection case
4. **Content Structure**: Ensure content is in correct format before applying formats

