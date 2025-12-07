# 🚀 Quick Start Guide

## What You Need To Do Right Now

### 1. Set Up Supabase (10 minutes)

#### A. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Settings:
   - **Name**: `harvardpoops`
   - **Password**: Generate strong password (SAVE IT!)
   - **Region**: East US (North Virginia)
   - **Plan**: Free
4. Wait 2-3 minutes for setup

#### B. Run Database Setup
1. In Supabase dashboard → **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Open the file `sql/schema.sql` in this project
4. Copy ALL the SQL code
5. Paste into Supabase SQL Editor
6. Click **"Run"** or press Cmd/Ctrl + Enter
7. Should see: "Success. No rows returned"

#### C. Configure Auth Settings
1. Go to **Authentication** → **Providers**
2. Find **"Email Auth"** section
3. Turn **OFF** these settings:
   - Confirm email
   - Secure email change
4. Click **"Save"**

#### D. Get Your API Keys
1. Go to **Project Settings** (gear icon) → **API**
2. Copy these two values:
   - **Project URL** (like `https://abcd1234.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

### 2. Configure Your Local Environment (2 minutes)

1. Open `.env.local` in this project folder
2. Replace the placeholders:
```env
VITE_SUPABASE_URL=your-project-url-from-step-D
VITE_SUPABASE_ANON_KEY=your-anon-key-from-step-D
```
3. Save the file

### 3. Install & Run (2 minutes)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

App opens at `http://localhost:3000`

### 4. Test It Out (5 minutes)

#### Sign Up
1. Go to `/signup`
2. Enter referral code: `HP-LAUNCH2025`
3. Fill out form:
   - Name: Your Name
   - Year: Sophomore
   - House: Lowell
   - Email: `your.name@harvard.edu` or `your.name@college.harvard.edu`
   - Phone: (123) 456-7890
   - Password: `password123` (at least 8 chars)
4. Click "Create Account"

#### Generate Referral Codes
1. Click "Profile" in header
2. Click "Generate Referral Code"
3. You can create 3 codes
4. Click "Copy" to copy a code

#### Test Sign Out / Sign In
1. Click "Sign Out"
2. Go to `/login`
3. Enter your email and password
4. Should redirect to home page

---

## 🎫 Pre-Made Referral Codes

Use these to sign up your first users:

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

Each code can only be used once!

---

## ❓ Common Issues

**"Missing Supabase environment variables"**
- Make sure `.env.local` has both VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
- Restart dev server: Stop it (Ctrl+C) and run `npm run dev` again

**"Invalid referral code"**
- Make sure you ran the SQL schema (includes 10 seed codes)
- Try a different code from the list above

**"Please use a Harvard email"**
- Email must end with `@harvard.edu` OR `@college.harvard.edu`
- No other domains work

**"You have no referral codes remaining"**
- Each user can only generate 3 codes total
- Check your profile page to see how many you have left

---

## ✅ What's Working

- ✅ Sign up with referral code
- ✅ Harvard email validation
- ✅ Login/logout
- ✅ User profiles
- ✅ Referral code generation (3 per user)
- ✅ Protected routing
- ✅ Mobile-first UI

---

## 📱 Test on Mobile

### Using Your Phone
1. Find your computer's local IP:
   ```bash
   # Mac/Linux
   ifconfig | grep inet

   # Windows
   ipconfig
   ```
2. On your phone's browser, go to `http://YOUR-IP:3000`
3. Works on same WiFi network

### Using Chrome DevTools
1. Open Chrome DevTools (F12)
2. Click device icon (top-left)
3. Select "iPhone 14 Pro" or "Pixel 5"
4. Test touch interactions

---

## 🚢 Deploy to Vercel

1. Push to GitHub:
```bash
git add .
git commit -m "Add authentication system"
git push origin main
```

2. Go to [vercel.com](https://vercel.com) → Import project
3. Add environment variables in Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

---

**Need help? Check README.md for full documentation.**
