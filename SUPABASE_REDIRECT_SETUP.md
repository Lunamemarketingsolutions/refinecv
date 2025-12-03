# Supabase Redirect URL Configuration

## Fix Email Confirmation Links

To make email confirmation links work properly, you need to configure redirect URLs in your Supabase dashboard.

### Steps:

1. **Go to Supabase Dashboard**
   - Navigate to https://supabase.com/dashboard
   - Select your project

2. **Configure Authentication Settings**
   - Go to **Authentication** → **URL Configuration**
   - Under **Redirect URLs**, add:
     ```
     http://localhost:5173/auth/confirm
     http://localhost:5173/dashboard
     http://localhost:5173/login
     ```
   - Click **Save**

3. **For Production** (when you deploy):
   - Add your production domain:
     ```
     https://yourdomain.com/auth/confirm
     https://yourdomain.com/dashboard
     https://yourdomain.com/login
     ```

### Alternative: Disable Email Confirmation (Development Only)

If you want to skip email confirmation during development:

1. Go to **Authentication** → **Settings**
2. Under **Email Auth**, toggle **"Enable email confirmations"** OFF
3. Users will be automatically logged in after sign up

**Note:** Only disable this for development/testing. Always enable it for production!

### How It Works Now

- When users sign up, they receive an email with a confirmation link
- The link points to: `http://localhost:5173/auth/confirm#access_token=...`
- The EmailConfirm page handles the token and verifies the email
- User is then redirected to the dashboard

### Troubleshooting

**Issue:** "This site can't be reached" when clicking email link
- **Solution:** Make sure you've added `http://localhost:5173/auth/confirm` to Supabase redirect URLs
- The link should work when clicked from the same browser where your app is running

**Issue:** Email link doesn't verify
- Check browser console for errors
- Make sure the redirect URL in Supabase matches exactly (including http:// and port)
- Try copying the link and pasting it directly in your browser

