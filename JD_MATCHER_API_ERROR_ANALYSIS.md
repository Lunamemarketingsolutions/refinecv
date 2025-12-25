# Root Cause Analysis: "API Error: User not found" in JD-Match-Tool

## Error Location
- **File**: `src/services/jd-matcher/aiService.ts`
- **Line**: 111 - Error thrown from OpenRouter API response

## Root Causes

### 1. Invalid or Expired API Key
**Most Likely Cause**: The OpenRouter API key in `.env.local` may be:
- Invalid (wrong key)
- Expired
- Revoked
- From a deleted account

**Evidence**:
- Error message: "User not found" from OpenRouter API
- This is OpenRouter's response when the API key doesn't match a valid user account

### 2. API Key Not Loaded
**Possible Cause**: Environment variable not being read correctly
- Vite requires `VITE_` prefix for environment variables
- Server restart needed after adding/changing .env.local
- Variable name mismatch

**Current Configuration**:
- Variable name: `VITE_OPENROUTER_API_KEY` ✅ (correct)
- File: `.env.local` ✅ (correct location)

### 3. API Key Format Issue
**Possible Cause**: 
- Key might have extra spaces or newlines
- Key might be truncated
- Key format might be incorrect

**Expected Format**: 
- OpenRouter keys typically start with `sk-or-v1-`
- Current key in .env.local: `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`

### 4. Account/Billing Issue
**Possible Cause**:
- OpenRouter account might be suspended
- No credits/balance remaining
- Account might have been deleted

## Solutions

### Solution 1: Verify API Key is Valid
1. Go to https://openrouter.ai/
2. Log in to your account
3. Go to Keys section
4. Verify the key exists and is active
5. If needed, create a new key

### Solution 2: Update API Key in .env.local
1. Get a fresh API key from OpenRouter
2. Update `.env.local`:
   ```
   VITE_OPENROUTER_API_KEY=sk-or-v1-YOUR_NEW_KEY_HERE
   ```
3. Restart the dev server

### Solution 3: Check API Key Permissions
- Ensure the key has access to the model you're using
- Check if there are any rate limits or restrictions

### Solution 4: Improve Error Handling
- Add better error messages
- Log the actual API response for debugging
- Check if API key is being read correctly

