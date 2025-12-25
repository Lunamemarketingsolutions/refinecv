# How to Access User Signup Data

All user signup data is stored in your **Supabase database**. Here are multiple ways to access it:

## 📊 Method 1: Supabase Dashboard (Easiest)

### Access All Users:

1. **Go to your Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Log in with your Supabase account
   - Select your project

2. **View Authentication Users**
   - Navigate to: **Authentication** → **Users**
   - This shows all registered users with:
     - Email address
     - Account creation date
     - Email confirmation status
     - Last sign-in date
     - User ID

3. **View User Profiles**
   - Navigate to: **Table Editor** → **user_profiles**
   - This shows additional user data:
     - Full name
     - Plan type (free/premium)
     - Profile creation date
     - Premium expiration (if applicable)

4. **Export to CSV/Excel**
   - In the Table Editor, click the **Export** button
   - Choose CSV or Excel format
   - Download the file

### Quick SQL Query in Dashboard:

1. Go to **SQL Editor** in Supabase Dashboard
2. Run this query to get all users with their profiles:

```sql
SELECT 
  u.id,
  u.email,
  u.created_at as account_created,
  u.email_confirmed_at,
  u.last_sign_in_at,
  p.full_name,
  p.plan_type,
  p.created_at as profile_created
FROM auth.users u
LEFT JOIN public.user_profiles p ON u.id = p.id
ORDER BY u.created_at DESC;
```

3. Click **Export** to download as CSV

---

## 🔧 Method 2: Export Script (Automated)

I've created a script that exports all user data to CSV automatically.

### Setup:

1. **Get your Service Role Key** (one-time setup):
   - Go to Supabase Dashboard → **Settings** → **API**
   - Copy the **service_role** key (⚠️ Keep this secret!)
   - Add it to `.env.local`:
     ```
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
     ```

2. **Run the export script**:
   ```bash
   npx tsx scripts/export-users.ts
   ```

3. **Find the exported file**:
   - Location: `exports/users-export-YYYY-MM-DD.csv`
   - Opens in Excel, Google Sheets, or any CSV viewer

### What the script exports:

- User ID
- Email address
- Full name
- Plan type (free/premium)
- Account creation date
- Email confirmation status
- Last sign-in date
- Profile creation date

---

## 📋 Method 3: Direct Database Access

If you have direct database access:

1. **Connect to your Supabase database**
   - Use a PostgreSQL client (pgAdmin, DBeaver, etc.)
   - Connection details are in Supabase Dashboard → Settings → Database

2. **Query the tables**:
   ```sql
   -- All users
   SELECT * FROM auth.users;
   
   -- User profiles
   SELECT * FROM public.user_profiles;
   
   -- Combined view
   SELECT 
     u.id,
     u.email,
     u.created_at,
     p.full_name,
     p.plan_type
   FROM auth.users u
   LEFT JOIN public.user_profiles p ON u.id = p.id;
   ```

---

## 📊 Tables That Store User Data

### 1. `auth.users` (Supabase Built-in)
- **Location**: Supabase Authentication system
- **Contains**:
  - `id` (UUID)
  - `email`
  - `created_at` (signup date)
  - `email_confirmed_at`
  - `last_sign_in_at`
  - `encrypted_password`

### 2. `user_profiles` (Custom Table)
- **Location**: `public.user_profiles`
- **Contains**:
  - `id` (references auth.users)
  - `full_name`
  - `plan_type` ('free' or 'premium')
  - `profile_photo_url`
  - `premium_expires_at`
  - `created_at`
  - `updated_at`

### 3. `usage_tracking` (Usage Analytics)
- **Location**: `public.usage_tracking`
- **Contains**: Tool usage data per user

---

## 🔐 Security Note

- **Service Role Key**: Has admin access. Never commit it to git or share it publicly.
- **RLS (Row Level Security)**: Users can only see their own data by default.
- **Service Role Key**: Bypasses RLS, so use it only for admin scripts.

---

## 📈 Quick Stats Query

To get quick statistics about your users:

```sql
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) as confirmed_users,
  COUNT(CASE WHEN last_sign_in_at IS NOT NULL THEN 1 END) as active_users,
  COUNT(CASE WHEN p.plan_type = 'premium' THEN 1 END) as premium_users
FROM auth.users u
LEFT JOIN public.user_profiles p ON u.id = p.id;
```

---

## 💡 Tips

1. **Regular Exports**: Run the export script weekly/monthly to track growth
2. **Backup**: Supabase automatically backs up your database, but you can also export manually
3. **Privacy**: Remember GDPR/privacy laws when handling user data
4. **Analytics**: Use the data to track:
   - Signup trends
   - Email confirmation rates
   - Premium conversion rates
   - User engagement (last sign-in)

---

## 🆘 Troubleshooting

**"Service Role Key not found"**
- Make sure you added `SUPABASE_SERVICE_ROLE_KEY` to `.env.local`
- Get it from Supabase Dashboard → Settings → API

**"No users found"**
- Check if you're connected to the correct Supabase project
- Verify your `VITE_SUPABASE_URL` in `.env.local` matches your project

**"Permission denied"**
- Make sure you're using the service_role key (not anon key)
- Service role key bypasses RLS for admin operations

