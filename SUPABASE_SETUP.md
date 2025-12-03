# Supabase Authentication Setup Guide

## Quick Setup Steps

### 1. Create a Supabase Project (if you don't have one)

1. Go to https://supabase.com
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - Project name
   - Database password (save this!)
   - Region (choose closest to you)
5. Wait for project to be created (~2 minutes)

### 2. Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** (gear icon) → **API**
2. Find these two values:
   - **Project URL**: Copy the "Project URL" (looks like `https://xxxxx.supabase.co`)
   - **anon public key**: Copy the "anon public" key (long string starting with `eyJ...`)

### 3. Add Credentials to .env.local

Open `.env.local` and replace the placeholder values:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Restart Development Servers

After adding credentials, restart your servers:

```bash
# Stop current servers (Ctrl+C)
# Then restart:
npm run dev:all
```

### 5. Test Sign Up

1. Go to http://localhost:5173/signup
2. Fill in email and password
3. Click "Create Account"
4. You should see a success message

## Email Verification (Optional)

By default, Supabase may require email verification. You can:

1. **Disable email verification** (for development):
   - Go to Supabase Dashboard → Authentication → Settings
   - Under "Email Auth", toggle "Enable email confirmations" OFF

2. **Or keep it enabled**:
   - Users will receive a confirmation email
   - They need to click the link to verify before logging in

## Google Sign In (Optional)

To enable Google sign in:

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable "Google"
3. Add your Google OAuth credentials:
   - Client ID
   - Client Secret
4. Add redirect URL: `http://localhost:5173/dashboard`

## Troubleshooting

### "Supabase not configured" error
- Check that `.env.local` has both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Make sure you restarted the dev server after adding credentials
- Check browser console for any errors

### Sign up fails
- Check Supabase dashboard → Authentication → Users to see if user was created
- Check browser console for error messages
- Verify email confirmation settings

### Can't log in after sign up
- If email verification is enabled, check your email for confirmation link
- Or disable email verification in Supabase settings for development

## Security Notes

- The `anon` key is safe to use in frontend code (it's public)
- Never commit `.env.local` to git (it's already in `.gitignore`)
- For production, use environment variables in your hosting platform

