# Supabase Redirect URLs Setup Guide

## ⚠️ IMPORTANT: Configure Redirect URLs When Deploying

When you purchase a domain and deploy your application, you **MUST** add your production domain to Supabase redirect URLs. This is critical for:
- Email confirmation links
- Password reset links
- OAuth (Google) login redirects
- All authentication flows

---

## Current Development URLs

These are already configured (or should be) for local development:

```
http://localhost:5173/auth/confirm
http://localhost:5173/reset-password
http://localhost:5173/dashboard
http://localhost:5173/login
```

---

## Production Setup Steps

### Step 1: Purchase and Configure Domain

1. Purchase your domain from a registrar (GoDaddy, Namecheap, Google Domains, etc.)
2. Point your domain to your hosting provider (Vercel, Netlify, AWS, etc.)
3. Ensure SSL/HTTPS is enabled (required for Supabase redirects)

### Step 2: Access Supabase Dashboard

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **URL Configuration**

### Step 3: Add Production Redirect URLs

In the **Redirect URLs** section, add ALL of the following URLs (replace `yourdomain.com` with your actual domain):

```
https://yourdomain.com/auth/confirm
https://yourdomain.com/reset-password
https://yourdomain.com/dashboard
https://yourdomain.com/login
```

**Important Notes:**
- Use `https://` (not `http://`) - Supabase requires HTTPS for production
- Include the full path (e.g., `/auth/confirm`, not just the domain)
- Add each URL on a separate line or as separate entries
- Do NOT include trailing slashes (e.g., use `/dashboard` not `/dashboard/`)

### Step 4: Update Environment Variables

Update your production environment variables to use the new domain:

```env
# .env.production or production environment settings
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Update redirect URLs in code if hardcoded (check AuthContext.tsx)
```

### Step 5: Verify Configuration

1. **Test Email Confirmation:**
   - Sign up with a new account
   - Check email for confirmation link
   - Click link - should redirect to `https://yourdomain.com/auth/confirm`
   - Should successfully verify and redirect to dashboard

2. **Test Password Reset:**
   - Go to forgot password page
   - Enter email and request reset
   - Check email for reset link
   - Click link - should redirect to `https://yourdomain.com/reset-password`
   - Should allow password reset

3. **Test OAuth (Google):**
   - Try Google login
   - Should redirect back to `https://yourdomain.com/dashboard` after authentication

### Step 6: Update Code (if needed)

Check these files for hardcoded localhost URLs and update if necessary:

- `src/contexts/AuthContext.tsx` - Check `emailRedirectTo` and `redirectTo` values
- `src/pages/Signup.tsx` - Check redirect URLs
- `src/pages/ForgotPassword.tsx` - Check redirect URLs

**Current code should use:**
```typescript
`${window.location.origin}/auth/confirm`
`${window.location.origin}/reset-password`
`${window.location.origin}/dashboard`
```

This automatically uses the current domain, so it should work in production without changes.

---

## Complete List of Required Redirect URLs

### Development (localhost)
```
http://localhost:5173/auth/confirm
http://localhost:5173/reset-password
http://localhost:5173/dashboard
http://localhost:5173/login
```

### Production (your domain)
```
https://yourdomain.com/auth/confirm
https://yourdomain.com/reset-password
https://yourdomain.com/dashboard
https://yourdomain.com/login
```

### If Using Custom Subdomains
If you use subdomains (e.g., `app.yourdomain.com`), add those too:
```
https://app.yourdomain.com/auth/confirm
https://app.yourdomain.com/reset-password
https://app.yourdomain.com/dashboard
https://app.yourdomain.com/login
```

---

## Common Issues and Solutions

### Issue: "Redirect URL not allowed"
**Solution:** 
- Check that the exact URL is added in Supabase (including `https://` and full path)
- Ensure no trailing slashes
- Wait a few minutes after adding - changes may take time to propagate

### Issue: Email links redirect to localhost
**Solution:**
- Check that production URLs are added to Supabase
- Verify environment variables are set correctly
- Clear browser cache and cookies

### Issue: OAuth redirect fails
**Solution:**
- Ensure `https://yourdomain.com/dashboard` is in redirect URLs
- Check that OAuth provider (Google) has the correct redirect URI configured
- Verify SSL certificate is valid

---

## Checklist Before Going Live

- [ ] Domain purchased and configured
- [ ] SSL/HTTPS enabled on domain
- [ ] All production redirect URLs added to Supabase
- [ ] Environment variables updated for production
- [ ] Email confirmation tested
- [ ] Password reset tested
- [ ] OAuth login tested
- [ ] All authentication flows working

---

## Quick Reference: Where to Add URLs

1. **Supabase Dashboard:**
   - Go to: Authentication → URL Configuration
   - Section: **Redirect URLs**
   - Add each URL (one per line or separate entries)

2. **OAuth Providers (if using):**
   - Google Cloud Console → Credentials → OAuth 2.0 Client
   - Add authorized redirect URIs

---

## Notes

- **Keep development URLs:** Don't remove localhost URLs - you'll need them for local development
- **Multiple environments:** You can have both development and production URLs active simultaneously
- **Testing:** Always test authentication flows after deploying to production
- **Security:** Only add URLs you own - never add third-party domains

---

## Last Updated
Created: 2024-12-22
Purpose: Guide for configuring Supabase redirect URLs when deploying to production domain

