/**
 * Script to export all user signup data to CSV
 * 
 * Usage:
 *   npx tsx scripts/export-users.ts
 * 
 * This will create a CSV file with all registered users
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error('❌ VITE_SUPABASE_URL not found in .env.local');
  process.exit(1);
}

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in .env.local');
  console.error('');
  console.error('To get your service role key:');
  console.error('1. Go to your Supabase Dashboard');
  console.error('2. Settings → API');
  console.error('3. Copy the "service_role" key (NOT the anon key)');
  console.error('4. Add it to .env.local as: SUPABASE_SERVICE_ROLE_KEY=your_key_here');
  console.error('');
  console.error('⚠️  WARNING: Service role key has admin access. Keep it secret!');
  process.exit(1);
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

interface UserData {
  id: string;
  email: string;
  created_at: string;
  email_confirmed_at: string | null;
  last_sign_in_at: string | null;
  full_name: string;
  plan_type: string;
  profile_created_at: string;
}

async function exportUsers() {
  console.log('📊 Fetching user data from Supabase...\n');

  try {
    // Fetch users from auth.users and join with user_profiles
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      console.error('❌ Error fetching auth users:', authError);
      process.exit(1);
    }

    if (!authUsers || authUsers.users.length === 0) {
      console.log('ℹ️  No users found in the database.');
      return;
    }

    // Fetch user profiles
    const { data: profiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('*');

    if (profileError) {
      console.error('❌ Error fetching user profiles:', profileError);
      // Continue anyway, we can still export auth data
    }

    // Create a map of profiles by user ID
    const profileMap = new Map();
    if (profiles) {
      profiles.forEach(profile => {
        profileMap.set(profile.id, profile);
      });
    }

    // Combine data
    const userData: UserData[] = authUsers.users.map(user => {
      const profile = profileMap.get(user.id);
      return {
        id: user.id,
        email: user.email || 'N/A',
        created_at: user.created_at || 'N/A',
        email_confirmed_at: user.email_confirmed_at || 'Not Confirmed',
        last_sign_in_at: user.last_sign_in_at || 'Never',
        full_name: profile?.full_name || 'N/A',
        plan_type: profile?.plan_type || 'free',
        profile_created_at: profile?.created_at || 'N/A',
      };
    });

    // Sort by creation date (newest first)
    userData.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Generate CSV
    const csvHeaders = [
      'User ID',
      'Email',
      'Full Name',
      'Plan Type',
      'Account Created',
      'Email Confirmed',
      'Last Sign In',
      'Profile Created'
    ];

    const csvRows = userData.map(user => [
      user.id,
      user.email,
      user.full_name,
      user.plan_type,
      new Date(user.created_at).toLocaleString(),
      user.email_confirmed_at === 'Not Confirmed' ? 'Not Confirmed' : new Date(user.email_confirmed_at).toLocaleString(),
      user.last_sign_in_at === 'Never' ? 'Never' : new Date(user.last_sign_in_at).toLocaleString(),
      user.profile_created_at === 'N/A' ? 'N/A' : new Date(user.profile_created_at).toLocaleString(),
    ]);

    // Escape CSV values
    const escapeCsv = (value: string) => {
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    const csvContent = [
      csvHeaders.map(escapeCsv).join(','),
      ...csvRows.map(row => row.map(escapeCsv).join(','))
    ].join('\n');

    // Write to file
    const outputDir = path.join(process.cwd(), 'exports');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const filename = `users-export-${timestamp}.csv`;
    const filepath = path.join(outputDir, filename);

    fs.writeFileSync(filepath, csvContent, 'utf-8');

    // Print summary
    console.log('✅ User export completed!\n');
    console.log(`📁 File saved to: ${filepath}\n`);
    console.log('📊 Summary:');
    console.log(`   Total Users: ${userData.length}`);
    console.log(`   Confirmed Emails: ${userData.filter(u => u.email_confirmed_at !== 'Not Confirmed').length}`);
    console.log(`   Free Plan: ${userData.filter(u => u.plan_type === 'free').length}`);
    console.log(`   Premium Plan: ${userData.filter(u => u.plan_type === 'premium').length}`);
    console.log(`   Never Signed In: ${userData.filter(u => u.last_sign_in_at === 'Never').length}`);
    console.log('\n📋 Columns in CSV:');
    csvHeaders.forEach((header, index) => {
      console.log(`   ${index + 1}. ${header}`);
    });

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

// Run the export
exportUsers();

