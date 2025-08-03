# Database Setup Guide - Pulse UTD News

This guide will help you set up the Supabase database for the Pulse UTD News project.

## Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Project Access**: You'll need to create a new Supabase project

## Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in the project details:
   - **Name**: `pulse-utd-news`
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users (e.g., US East for North America)
4. Click "Create new project"
5. Wait for the project to be ready (usually 2-3 minutes)

## Step 2: Get Project Credentials

Once your project is ready, you'll need these credentials:

1. **Project URL**: Found in Settings > API
   - Format: `https://your-project-id.supabase.co`
2. **Anon Key**: Found in Settings > API
   - This is your public API key
3. **Service Role Key**: Found in Settings > API
   - This is your private API key (keep secret!)

## Step 3: Execute Database Schema

1. In your Supabase dashboard, go to the **SQL Editor**
2. Copy the entire contents of `database/schema.sql`
3. Paste it into the SQL Editor
4. Click **Run** to execute the schema

This will create:
- ✅ Articles and Categories tables
- ✅ Indexes for performance
- ✅ Row Level Security policies
- ✅ Full-text search functionality
- ✅ Default categories
- ✅ Triggers for automatic timestamps

## Step 4: Verify Setup

After running the schema, verify everything is working:

1. Go to **Table Editor** in Supabase
2. You should see:
   - `articles` table (empty)
   - `categories` table (with 5 default categories)

## Step 5: Configure Environment Variables

Update your `.env.local` file with your Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Step 6: Test Database Connection

Run the database test script to verify everything is working:

```bash
npm run test:db
```

This will:
- ✅ Test connection to Supabase
- ✅ Verify tables exist
- ✅ Test basic CRUD operations
- ✅ Verify RLS policies

## Security Notes

🔒 **Important Security Considerations:**

1. **Service Role Key**: Never expose this in client-side code
2. **RLS Policies**: Ensure Row Level Security is enabled
3. **API Keys**: Rotate keys regularly in production
4. **Database Password**: Use a strong, unique password

## Troubleshooting

### Common Issues:

**1. "relation does not exist" error**
- Make sure you ran the complete schema.sql file
- Check that all tables were created in the Table Editor

**2. "permission denied" error**
- Verify RLS policies are correctly set up
- Check that you're using the correct API keys

**3. Connection timeout**
- Verify your project URL is correct
- Check your internet connection
- Ensure the Supabase project is active

**4. UUID extension error**
- The schema includes `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`
- This should work automatically in Supabase

### Getting Help

If you encounter issues:
1. Check the Supabase logs in the Dashboard
2. Verify your environment variables
3. Test with the Supabase API directly
4. Check the [Supabase documentation](https://supabase.com/docs)

## Next Steps

After completing the database setup:

1. ✅ Database is ready
2. 🔄 Configure Cloudflare Worker
3. 🔄 Set up API keys for OpenRouter and ScraperAPI
4. 🔄 Deploy the application
5. 🔄 Test the automation workflow

---

**Status**: Database setup complete ✅
**Next**: Configure Cloudflare Worker for automation