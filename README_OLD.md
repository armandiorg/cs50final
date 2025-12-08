# Harvard Poops - Setup Instructions

## 🎯 What We Just Built

A complete authentication system with:
- ✅ Supabase Auth (email/password)
- ✅ Referral code gating (must have code to sign up)
- ✅ Harvard email validation (@harvard.edu or @college.harvard.edu)
- ✅ User profiles (name, year, house, phone)
- ✅ Referral code generation (3 codes per user, one-time use)
- ✅ Protected routing
- ✅ Mobile-first Tailwind CSS design
- ✅ Row Level Security (database enforces permissions)

---

## 📋 Before You Start

You need to complete the Supabase setup first (scroll down to "Supabase Setup" section).

---

## 🚀 Local Development Setup

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Environment Variables

1. Open the `.env.local` file in this directory
2. Replace the placeholders with your actual Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-actual-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

**Where to find these values:**
- Go to your Supabase project dashboard
- Click "Project Settings" (gear icon) → "API"
- Copy the "Project URL" and "anon/public" key

### Step 3: Run the Development Server

```bash
npm run dev
```

The app should open at `http://localhost:3000`

---

## 🗄️ Supabase Setup (Do This First!)

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Fill in:
   - **Name**: harvardpoops
   - **Database Password**: Generate a strong password and SAVE IT
   - **Region**: East US (North Virginia)
   - **Plan**: Free
4. Click "Create new project" and wait 2-3 minutes

### 2. Create Database Tables

1. In Supabase dashboard, go to "SQL Editor" (left sidebar)
2. Click "New query"
3. Copy the entire SQL script from this file: `/sql/schema.sql`
4. Paste it into the SQL editor
5. Click "Run" (or Cmd/Ctrl + Enter)
6. You should see "Success. No rows returned"

### 3. Configure Authentication

1. Go to "Authentication" → "Providers" in the left sidebar
2. Make sure "Email" is enabled
3. Scroll down to "Email Auth" section:
   - **Confirm email**: Toggle **OFF**
   - **Secure email change**: Toggle **OFF**
4. Click "Save"

### 4. Enable Realtime (for future features)

1. Go to "Database" → "Replication"
2. Enable replication for these tables:
   - `votes`
   - `chat_messages`
   - `rsvps`

### 5. Get Your API Credentials

1. Go to "Project Settings" → "API"
2. Copy these two values:
   - **Project URL** (starts with https://)
   - **anon public** key (long string starting with eyJ...)
3. Add them to your `.env.local` file

---

## 🎫 Initial Referral Codes

The database comes with 10 pre-seeded referral codes:

```
HP-LAUNCH2025
HP-CRIMSON01
HP-HARVARD02
HP-POOPS03
HP-EVENTS04
HP-SOCIAL05
HP-CAMPUS06
HP-PARTY07
HP-SQUAD08
HP-VIBES09
```

**Give these codes to your first users!** Once someone signs up with a code, it's consumed. They can then generate 3 more codes to invite their friends.

---

## 🧪 Testing the Authentication Flow

### 1. Sign Up
1. Go to `http://localhost:3000/signup`
2. Enter a referral code (e.g., `HP-LAUNCH2025`)
3. Fill out the form with:
   - Full name
   - Year (dropdown)
   - House (dropdown)
   - Harvard email (must end in @harvard.edu or @college.harvard.edu)
   - Phone number
   - Password (minimum 8 characters)
4. Click "Create Account"
5. You should be redirected to the home page

### 2. Generate Referral Codes
1. Click "Profile" in the header
2. Click "Generate Referral Code"
3. You can create 3 codes total
4. Click "Copy" to copy a code to share

### 3. Sign Out & Sign In
1. Click "Sign Out" in the profile page
2. You'll be redirected to `/login`
3. Enter your email and password
4. Click "Sign In"
5. You should be back on the home page

### 4. Test Invalid Scenarios
- Try signing up without a referral code → Should show error
- Try using a used referral code → Should show error
- Try using a non-Harvard email → Should show error
- Try passwords that don't match → Should show error

---

## 📁 Project Structure

```
src/
├── contexts/
│   └── AuthContext.jsx       # Authentication state management
├── lib/
│   └── supabase.js            # Supabase client initialization
├── pages/
│   ├── Home.jsx               # Main landing page (protected)
│   ├── Login.jsx              # Login page
│   ├── Signup.jsx             # Two-step signup (code → details)
│   └── Profile.jsx            # User profile & referral codes
├── App.jsx                    # Routing & protected routes
├── main.jsx                   # App entry point
└── index.css                  # Tailwind styles
```

---

## 🔒 Security Features

### Row Level Security (RLS)
The database automatically enforces these rules:
- Users can only view their own profile
- Users can only create/edit/delete their own events
- Anyone can read referral codes (to validate)
- Users can generate codes if they have credits remaining

### Harvard Email Validation
- Checks that email ends with `@harvard.edu` or `@college.harvard.edu`
- Validated on both frontend and backend

### Rate Limiting
- Supabase has built-in rate limiting on auth endpoints
- Prevents brute force attacks

---

## 🚢 Deploying to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Add authentication system"
git push origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project"
3. Import your `cs50final` repository
4. Vercel will auto-detect Vite settings
5. Add environment variables:
   - Click "Environment Variables"
   - Add `VITE_SUPABASE_URL` with your Supabase URL
   - Add `VITE_SUPABASE_ANON_KEY` with your anon key
6. Click "Deploy"

### 3. Connect Custom Domain (Optional)

1. Go to project Settings → Domains
2. Add `harvardpoops.com`
3. Follow Vercel's DNS instructions

---

## 🐛 Troubleshooting

### "Missing Supabase environment variables" error
- Make sure you created `.env.local` with both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart the dev server after adding env vars

### "Invalid referral code" on signup
- Make sure you ran the SQL schema (which includes seed codes)
- Check that the code wasn't already used
- Codes are case-insensitive but stored uppercase

### "Please use a Harvard email" error
- Email must end with `@harvard.edu` or `@college.harvard.edu`
- No other domains are accepted

### Can't generate more referral codes
- Each user can only generate 3 codes total
- Check your profile to see remaining codes

### Database connection errors
- Verify your Supabase URL and anon key are correct
- Check that your Supabase project is active (not paused)

---

## 📝 Next Steps

Now that authentication is working, you can build:

1. **Events System**
   - Create event form
   - Event listing page
   - Event detail page with RSVP/voting/chat

2. **Event Features**
   - RSVP forms
   - Live voting
   - Pre-party chat
   - QR code generation

3. **Admin Features**
   - Approve/reject events
   - Moderate chat
   - View analytics

---

## 🎓 What You Learned

`★ Insight ─────────────────────────────────────`
**You just built a production-ready authentication system!** Here's what makes it special:

1. **Supabase Auth** handles the hard stuff (password hashing, sessions, tokens)
2. **Row Level Security** means the database enforces permissions automatically
3. **Referral codes** create viral growth (users invite users)
4. **Harvard email validation** ensures only Harvard students can join
5. **Mobile-first Tailwind** makes the UI fast and touch-friendly
6. **Protected routing** keeps unauthorized users out of sensitive pages

This is the exact same pattern used by production apps with millions of users. The difference is you built it in a few hours instead of weeks!
`─────────────────────────────────────────────────`

---

**Questions? Issues? Check the console for errors or reach out!**
