# Deployment Notes - Training Data Security

## Important: Training Data Files

The following files contain proprietary training data and are **NOT** committed to Git:

- `src/data/eliteBulletPoints.json` - Source training data
- `data/eliteBulletsMetadata.json` - Metadata with all bullet text
- `data/eliteBulletsIndex.faiss` - FAISS index (binary)

## Deployment Steps

### 1. Upload Training Data to Server

**Option A: Manual Upload (Recommended)**
- Upload `src/data/eliteBulletPoints.json` to server via SFTP/SCP
- Place it in the same location: `src/data/eliteBulletPoints.json`
- Keep it secure (not publicly accessible)

**Option B: Environment Variable**
- Store training data in secure storage (AWS S3, etc.)
- Download during deployment
- Or use environment variable for file path

### 2. Build FAISS Index on Server

After uploading the training data:

```bash
# On your server
npm install
npm run build:faiss
```

This will create:
- `data/eliteBulletsIndex.faiss` (32MB)
- `data/eliteBulletsMetadata.json` (1.2MB)

### 3. Verify Files Exist

```bash
ls -lh src/data/eliteBulletPoints.json
ls -lh data/eliteBulletsIndex.faiss
ls -lh data/eliteBulletsMetadata.json
```

### 4. Start Application

```bash
npm run dev:all
# or for production
npm run build
npm start
```

## Security Checklist

- [ ] Training data files are NOT in Git repository
- [ ] Training data uploaded securely to server
- [ ] Server file permissions are restricted (not world-readable)
- [ ] FAISS index built on server (not committed)
- [ ] Environment variables (.env.local) are secure
- [ ] API endpoint has rate limiting (recommended)

## For Team Members

If you need to set up the project locally:

1. **Get training data** from secure location (not from Git)
2. Place `eliteBulletPoints.json` in `src/data/`
3. Run `npm run build:faiss` to generate index
4. Files will be created in `data/` directory

## Troubleshooting

**Error: "FAISS index not found"**
- Run `npm run build:faiss` first
- Make sure `src/data/eliteBulletPoints.json` exists

**Error: "Missing training data"**
- Check that `src/data/eliteBulletPoints.json` is in the correct location
- Verify file permissions allow reading

