# How to Run and Test Your Project

## Prerequisites

1. **Node.js** (v18 or higher)
2. **npm** or **yarn**
3. **Environment Variables** configured in `.env.local`

## Quick Start

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Set Up Environment Variables

Make sure your `.env.local` file has the following variables:

```env
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
OPENAI_SUGGESTION_MODEL=gpt-4o-mini
EMBEDDING_BATCH_SIZE=50

# Supabase Configuration (Optional - for full auth features)
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# API Server Port (Optional - defaults to 3001)
PORT=3001
```

### Step 3: Build FAISS Index (First Time Only)

If you haven't built the FAISS index yet, run:

```bash
npm run build:faiss
```

This will:
- Read `src/data/eliteBulletPoints.json`
- Generate embeddings using OpenAI
- Create FAISS index files in `data/` directory
- Take approximately 5-10 minutes (depends on API rate limits)

**Note:** The FAISS index files are large (~32MB) and are gitignored. You need to build them locally.

### Step 4: Run the Project

You have two options:

#### Option A: Run Everything Together (Recommended)

```bash
npm run dev:all
```

This starts both:
- **Frontend** (Vite dev server) on `http://localhost:5173`
- **Backend API** (RAG service) on `http://localhost:3001`

#### Option B: Run Separately

**Terminal 1 - Frontend:**
```bash
npm run dev
```
Opens at: `http://localhost:5173`

**Terminal 2 - Backend API:**
```bash
npm run dev:api
```
Runs on: `http://localhost:3001`

## Testing Different Features

### 1. Test ATS Analyzer

1. Navigate to: `http://localhost:5173/ats-tool`
2. Upload a PDF or DOCX CV file
3. Wait for analysis (simulated ~45 seconds)
4. View results with:
   - Overall ATS score
   - Critical issues
   - Warnings
   - ATS text extraction view
   - Section breakdown

### 2. Test CV Improviser (RAG Feature)

1. Navigate to: `http://localhost:5173/cv-improviser`
2. Upload a CV file
3. Edit bullet points in any section
4. Click "Generate with AI" to get suggestions
5. Test features:
   - Real-time CV preview
   - Drag-and-drop reordering
   - Rich text editing
   - AI chat for customizations
   - PDF download

**Note:** Make sure the backend API (`npm run dev:api`) is running for AI suggestions to work.

### 3. Test JD Matcher

1. Navigate to: `http://localhost:5173/jd-match-tool`
2. Upload CV and Job Description
3. View keyword matching analysis

### 4. Test CV Enhancer

1. Navigate to: `http://localhost:5173/cv-enhancer`
2. Upload CV
3. Get bullet point enhancements

## Troubleshooting

### Issue: "Missing Supabase environment variables"

**Solution:** This is expected if you haven't configured Supabase. The app will use a mock client and work for non-auth features. To enable full auth:
1. Create a Supabase project
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env.local`

### Issue: "FAISS index not found"

**Solution:** Run `npm run build:faiss` to create the index files.

### Issue: "OpenAI API error"

**Solution:** 
- Check your `OPENAI_API_KEY` in `.env.local`
- Ensure you have API credits
- Check rate limits

### Issue: "Port already in use"

**Solution:**
- Frontend (5173): Change port in `vite.config.ts` or kill the process
- Backend (3001): Change `PORT` in `.env.local` or kill the process

### Issue: "Cannot connect to API"

**Solution:**
- Ensure `npm run dev:api` is running
- Check the API server is on the correct port (default: 3001)
- Verify CORS is enabled (already configured in `server.ts`)

## Production Build

To build for production:

```bash
npm run build
```

This creates optimized files in `dist/` directory.

Preview production build:

```bash
npm run preview
```

## Testing Checklist

- [ ] Frontend loads at `http://localhost:5173`
- [ ] Backend API runs at `http://localhost:3001`
- [ ] ATS Analyzer uploads and analyzes CVs
- [ ] CV Improviser generates AI suggestions
- [ ] FAISS index is built and loaded
- [ ] All routes are accessible
- [ ] No console errors
- [ ] Environment variables are loaded correctly

## Development Tips

1. **Hot Reload:** Both frontend and backend support hot reload during development
2. **API Logs:** Check terminal running `dev:api` for API request logs
3. **Browser Console:** Check for frontend errors
4. **Network Tab:** Monitor API requests in browser DevTools

## Common Commands

```bash
# Install dependencies
npm install

# Run frontend only
npm run dev

# Run backend API only
npm run dev:api

# Run both (recommended)
npm run dev:all

# Build FAISS index
npm run build:faiss

# Type checking
npm run typecheck

# Linting
npm run lint

# Production build
npm run build

# Preview production build
npm run preview
```

## Next Steps

1. Test all features systematically
2. Check browser console for errors
3. Verify API responses in Network tab
4. Test with different CV formats (PDF, DOCX)
5. Test authentication flow (if Supabase is configured)





