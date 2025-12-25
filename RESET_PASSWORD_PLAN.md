# Reset Password Page - Implementation Plan

## Overview
The reset password page allows users to set a new password after clicking the reset link in their email.

## Flow

### 1. User Requests Password Reset
- User goes to `/forgot-password`
- Enters email address
- Receives email with reset link

### 2. User Clicks Reset Link
- Email contains link: `http://localhost:5173/reset-password#access_token=...&type=recovery`
- Supabase includes tokens in URL hash

### 3. Reset Password Page
- Extracts tokens from URL hash
- Sets session using tokens (validates the reset link)
- Shows form to enter new password
- Validates password requirements
- Updates password via `supabase.auth.updateUser()`
- Redirects to login on success

## Implementation Details

### Page Structure
```
/reset-password
├── Extract tokens from URL hash
├── Set session (validate reset link)
├── Show password form (if session valid)
│   ├── New password input
│   ├── Confirm password input
│   ├── Password strength indicator
│   └── Submit button
├── Success state
└── Error handling
```

### Password Requirements
- Minimum 8 characters
- Passwords must match
- Show validation errors in real-time

### Security
- Tokens in URL hash (not query params) - more secure
- Session must be set before allowing password change
- Redirect to login if tokens invalid/expired

### UI/UX
- Match design of other auth pages (Login, Signup)
- Show loading states
- Clear error messages
- Success confirmation before redirect

## Files to Create/Modify

1. **Create:** `src/pages/ResetPassword.tsx`
   - Handle URL hash tokens
   - Password form with validation
   - Update password functionality

2. **Modify:** `src/App.tsx`
   - Add route: `/reset-password`

3. **Modify:** `src/contexts/AuthContext.tsx` (optional)
   - Add `updatePassword` function if needed

## Supabase Configuration

Ensure redirect URL is configured in Supabase:
- Go to Authentication → URL Configuration
- Add: `http://localhost:5173/reset-password`
- For production: `https://yourdomain.com/reset-password`

