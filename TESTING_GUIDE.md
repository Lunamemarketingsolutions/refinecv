# CV Improviser & RAG Testing Guide

## Prerequisites

1. ✅ Environment variables configured in `.env.local`
2. ✅ Dependencies installed (`npm install`)
3. ✅ FAISS index built (see Step 1 below)

## Step 1: Build FAISS Index (One-time Setup)

Before testing the RAG functionality, you need to generate the FAISS index from the elite bullet points:

```bash
npm run build:faiss
```

This will:
- Read `src/data/eliteBulletPoints.json`
- Generate embeddings for all ~5500 bullets
- Create `data/eliteBulletsIndex.faiss` and `data/eliteBulletsMetadata.json`
- Take approximately 10-15 minutes (depends on API rate limits)

**Expected output:**
```
Processing elite bullet points...
Generating embeddings in batches...
Building FAISS index...
Index saved to data/eliteBulletsIndex.faiss
Metadata saved to data/eliteBulletsMetadata.json
✅ FAISS index built successfully!
```

## Step 2: Start Development Servers

You need to run both the frontend and API server:

### Option A: Run Both Together (Recommended)
```bash
npm run dev:all
```

This starts:
- Frontend: `http://localhost:5173` (Vite)
- API Server: `http://localhost:3001` (RAG endpoint)

### Option B: Run Separately

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - API Server:**
```bash
npm run dev:api
```

## Step 3: Test CV Improviser Page

1. **Navigate to CV Improviser:**
   - Open browser: `http://localhost:5173/cv-improviser`

2. **Upload a CV:**
   - Drag and drop a PDF/DOCX file OR click "Browse Files"
   - Supported formats: PDF, DOCX, TXT (max 10MB)
   - File should appear with name and size

3. **Analyze CV:**
   - Click "Analyze & Improvise CV" button
   - Wait for parsing (should take a few seconds)
   - You should see the two-panel workspace appear

4. **Verify Sections:**
   - Left panel should show section tabs (Personal Information, Work Experience, etc.)
   - Each section should have bullet points from your CV
   - Right panel should show formatted CV preview

5. **Test Editing:**
   - Click on any bullet point text box
   - Edit the text
   - Right panel should update in real-time

6. **Test Text Formatting:**
   - Select text in a bullet point
   - Click Bold, Italic, Underline buttons
   - Try alignment buttons (Left, Center, Right)
   - Try bullet list button
   - Formatting should apply visually

7. **Test Drag & Drop:**
   - Grab the drag handle (⋮⋮) on the left of any bullet
   - Drag to reorder bullets within a section
   - Preview should update to reflect new order

8. **Test AI Suggestions:**
   - Click "Generate with AI" on any bullet
   - Drawer should open on the right
   - Click "Generate Suggestions" button
   - Wait for AI to generate 3-5 suggestions
   - Each suggestion should show:
     - Improved text
     - Rating (stars)
     - Improvements list
     - "Insert This Suggestion" button
   - Click "Insert This Suggestion" to apply
   - Bullet should update with new text

9. **Test AI Chat:**
   - In the AI drawer, scroll to "Chat with AI" section
   - Type a prompt like: "Optimize this for a Product Manager role"
   - Press Enter or click Send
   - AI should respond with tailored suggestions
   - Chat history should be maintained

10. **Test PDF Download:**
    - Make some edits to bullets
    - Click "Download Updated CV" button (top right)
    - PDF should download with filename: `Refined_CV_YYYY-MM-DD.pdf`
    - Open PDF and verify all edits are included

11. **Test Score Calculation:**
    - Make edits to improve bullets (add numbers, action verbs)
    - CV Score should update dynamically
    - Score should increase as you add quantification and impact

## Step 4: Test RAG API Directly (Optional)

You can test the RAG endpoint directly using curl:

```bash
curl -X POST http://localhost:3001/api/generate-bullet-suggestions \
  -H "Content-Type: application/json" \
  -d '{
    "bulletText": "Worked on mobile app development",
    "section": "Work Experience"
  }'
```

**Expected response:**
```json
{
  "suggestions": [
    {
      "text": "Led development of mobile application...",
      "rating": 5,
      "improvements": ["Strong action verb", "Quantified impact", ...]
    },
    ...
  ],
  "context": [...]
}
```

## Troubleshooting

### Issue: "FAISS index not found"
**Solution:** Run `npm run build:faiss` first

### Issue: "Missing OPENAI_API_KEY"
**Solution:** Check `.env.local` file exists and has the correct API key

### Issue: API calls fail with CORS error
**Solution:** Make sure API server is running on port 3001 and Vite proxy is configured

### Issue: "Cannot find module 'faiss-node'"
**Solution:** Run `npm install` to ensure all dependencies are installed

### Issue: Rich text editor not working
**Solution:** Check browser console for errors. React Quill requires proper CSS imports (already included)

### Issue: Drag and drop not working
**Solution:** Make sure you're clicking and dragging from the grip handle (⋮⋮ icon), not the text area

## Expected Behavior Summary

✅ **Upload Screen:** Clean, centered, drag-and-drop works
✅ **Two-Panel Layout:** Left (editing) and Right (preview) side-by-side
✅ **Section Tabs:** Clickable tabs, active section highlighted
✅ **Bullet Editors:** Rich text editing with formatting toolbar
✅ **Real-time Preview:** Updates instantly as you type
✅ **AI Suggestions:** Drawer opens, generates 3-5 suggestions with reasoning
✅ **AI Chat:** Interactive chat with context-aware responses
✅ **Drag & Drop:** Smooth reordering with visual feedback
✅ **PDF Download:** Generates formatted PDF with all edits
✅ **Score Display:** Dynamic score calculation and visual indicator

## Next Steps After Testing

1. Build FAISS index: `npm run build:faiss`
2. Test upload and parsing
3. Test editing and formatting
4. Test AI suggestions (requires FAISS index)
5. Test PDF download
6. Verify all features work end-to-end

## Notes

- The FAISS index build is a one-time process (unless you update the JSON file)
- API calls use OpenAI, so ensure you have API credits
- For production deployment, deploy API route to Vercel/Netlify as serverless function
- The CV parser uses fuzzy matching to group similar section headers

