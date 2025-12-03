# RAG Architecture & Security Analysis

## How RAG is Set Up

### 1. Training Data Source
- **Location**: `src/data/eliteBulletPoints.json`
- **Content**: ~5,489 elite CV bullet points organized by sections
- **Format**: JSON file with sections as keys (Work Experience, Education, etc.)
- **Size**: ~550KB (text file)

### 2. FAISS Index Creation
- **Script**: `scripts/buildFaissIndex.ts`
- **Process**:
  1. Reads `eliteBulletPoints.json`
  2. Flattens all bullets into a single array
  3. Generates embeddings using OpenAI `text-embedding-3-small` (1536 dimensions)
  4. Creates FAISS index using Inner Product (IP) similarity
  5. Saves two files:
     - `data/eliteBulletsIndex.faiss` (32MB binary file)
     - `data/eliteBulletsMetadata.json` (1.2MB - contains bullet text and metadata)

### 3. RAG API Endpoint
- **File**: `api/generate-bullet-suggestions.ts`
- **Location**: Server-side only (runs on Node.js server)
- **Process**:
  1. Loads FAISS index and metadata into memory (cached)
  2. Receives user's bullet text from frontend
  3. Generates embedding for user's bullet
  4. Searches FAISS index for top 10 similar elite bullets
  5. Filters by section (if provided)
  6. Sends top matches + user bullet to OpenAI GPT
  7. Returns 3-5 AI-generated suggestions

### 4. Frontend Integration
- **Service**: `src/services/bulletEnhancementService.ts`
- **Component**: `src/components/cv-improviser/AISuggestionDrawer.tsx`
- **Flow**:
  1. User clicks "Generate with AI" button
  2. Frontend calls `/api/generate-bullet-suggestions`
  3. Displays suggestions in drawer
  4. User can apply suggestions or chat for more customization

## Visibility & Security Analysis

### ❌ **IS THE TRAINING DATA VISIBLE?**

#### 1. Source JSON File (`eliteBulletPoints.json`)
- **Location**: `src/data/eliteBulletPoints.json`
- **Git Status**: 
  - ✅ **Currently NOT in `.gitignore`**
  - ⚠️ **This means it WILL be committed to Git if you push**
  - ⚠️ **If your repo is public on GitHub, anyone can see it**
- **Recommendation**: Add to `.gitignore` if you want to keep it private

#### 2. FAISS Index Files
- **Location**: `data/eliteBulletsIndex.faiss` (32MB binary)
- **Git Status**: ✅ **Already in `.gitignore`** (line 27-28)
- **Visibility**: **NOT visible on GitHub** (binary file, ignored)
- **Note**: Even if someone downloads it, it's just vectors (numbers), not readable text

#### 3. Metadata File
- **Location**: `data/eliteBulletsMetadata.json` (1.2MB)
- **Git Status**: ⚠️ **Commented out in `.gitignore`** (line 31)
- **Visibility**: **Currently NOT ignored** - could be committed
- **Content**: Contains all bullet text + IDs + sections
- **Risk**: If committed, this file contains all your training data in readable format

#### 4. API Endpoint
- **Location**: `api/generate-bullet-suggestions.ts`
- **Git Status**: ✅ **Code is visible** (but that's normal for open source)
- **Visibility**: Code is visible, but:
  - Training data is NOT in the code
  - API requires server-side execution
  - FAISS index must be built locally (not in repo)

### 🔒 **SECURITY ASSESSMENT**

#### What IS Visible:
1. ✅ **Source code** (API routes, components) - Normal for open source
2. ⚠️ **`eliteBulletPoints.json`** - Currently NOT ignored, WILL be visible if repo is public
3. ⚠️ **`eliteBulletsMetadata.json`** - Currently NOT ignored, contains all bullet text

#### What is NOT Visible:
1. ✅ **FAISS index** (32MB binary) - Ignored, not readable anyway
2. ✅ **Environment variables** (`.env.local`) - Ignored
3. ✅ **OpenAI API key** - In `.env.local`, never committed
4. ✅ **Server-side execution** - API runs on your server, not exposed to clients

### 🛡️ **RECOMMENDATIONS**

#### Option 1: Keep Training Data Private (Recommended)
```bash
# Add to .gitignore
echo "src/data/eliteBulletPoints.json" >> .gitignore
echo "data/eliteBulletsMetadata.json" >> .gitignore
```

**Pros**:
- Training data stays private
- Only you have access to elite bullets
- Competitive advantage maintained

**Cons**:
- Team members need to add file manually
- Deployment requires building index on server

#### Option 2: Make Training Data Public
- Keep files in repo
- Anyone can see your elite bullet points
- Good for open source / educational purposes

**Pros**:
- Transparent
- Easy for contributors
- Educational value

**Cons**:
- Competitors can copy your training data
- No competitive advantage

### 📊 **HOW DATA FLOWS**

```
User's Bullet Text
    ↓
Frontend (Browser)
    ↓ POST /api/generate-bullet-suggestions
Backend API (Node.js Server)
    ↓
1. Generate embedding (OpenAI API)
    ↓
2. Search FAISS index (local, in-memory)
    ↓
3. Get top 10 similar elite bullets
    ↓
4. Send to OpenAI GPT with context
    ↓
5. Return 3-5 suggestions
    ↓
Frontend displays suggestions
```

**Key Points**:
- ✅ Training data NEVER leaves your server
- ✅ Only embeddings and search results are processed
- ✅ User's bullet text is sent to OpenAI (for embedding + GPT)
- ✅ Elite bullet text is sent to OpenAI GPT (as context examples)
- ⚠️ OpenAI may log API calls (check their privacy policy)

### 🔐 **CURRENT STATE SUMMARY**

| File | Location | Git Status | Visible on GitHub? | Contains Training Data? |
|------|----------|------------|-------------------|------------------------|
| `eliteBulletPoints.json` | `src/data/` | ❌ Not ignored | ✅ YES (if repo public) | ✅ YES (all bullets) |
| `eliteBulletsIndex.faiss` | `data/` | ✅ Ignored | ❌ NO | ⚠️ Encoded (vectors only) |
| `eliteBulletsMetadata.json` | `data/` | ⚠️ Not ignored | ✅ YES (if repo public) | ✅ YES (all bullets) |
| API Code | `api/` | ✅ Committed | ✅ YES | ❌ NO (just code) |

### 🎯 **IMMEDIATE ACTION REQUIRED**

If you want to keep training data private:

1. **Add to `.gitignore`**:
   ```bash
   src/data/eliteBulletPoints.json
   data/eliteBulletsMetadata.json
   ```

2. **If already committed**, remove from Git history:
   ```bash
   git rm --cached src/data/eliteBulletPoints.json
   git rm --cached data/eliteBulletsMetadata.json
   git commit -m "Remove training data from repository"
   ```

3. **For deployment**:
   - Build FAISS index on server: `npm run build:faiss`
   - Or upload pre-built index files to server (not via Git)

### 💡 **BEST PRACTICES**

1. **Keep training data private** if it's your competitive advantage
2. **Use environment variables** for sensitive configs (already done ✅)
3. **Build index on server** during deployment, not commit it
4. **Monitor API usage** to detect abuse
5. **Consider rate limiting** on RAG endpoint

