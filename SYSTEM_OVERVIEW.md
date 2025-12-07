# Harvard Poops - System Architecture Overview

## 🏗️ Complete Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     USER JOURNEY                             │
└─────────────────────────────────────────────────────────────┘

1. SIGNUP FLOW
   ┌──────────┐      ┌──────────┐      ┌──────────┐
   │  Enter   │ ───> │  Create  │ ───> │  Auto    │
   │ Referral │      │ Account  │      │  Login   │
   │   Code   │      │ Details  │      │          │
   └──────────┘      └──────────┘      └──────────┘

2. LOGIN FLOW
   ┌──────────┐      ┌──────────┐
   │  Enter   │ ───> │  Logged  │
   │ Email +  │      │  Into    │
   │ Password │      │   App    │
   └──────────┘      └──────────┘

3. REFERRAL CODE GENERATION
   ┌──────────┐      ┌──────────┐      ┌──────────┐
   │  Profile │ ───> │ Generate │ ───> │  Share   │
   │   Page   │      │   Code   │      │  with    │
   │          │      │ (max 3)  │      │ Friends  │
   └──────────┘      └──────────┘      └──────────┘
```

---

## 📊 Database Schema

```
┌───────────────────────────────────────────────────────────┐
│                  SUPABASE DATABASE                         │
├───────────────────────────────────────────────────────────┤
│                                                            │
│  ┌─────────────────┐                                      │
│  │  auth.users     │  (Managed by Supabase Auth)          │
│  │  ─────────────  │                                      │
│  │  id (UUID)      │                                      │
│  │  email          │                                      │
│  │  password_hash  │                                      │
│  └────────┬────────┘                                      │
│           │                                                │
│           │ references                                     │
│           ↓                                                │
│  ┌─────────────────┐         ┌─────────────────┐          │
│  │  profiles       │         │ referral_codes  │          │
│  │  ─────────────  │         │  ─────────────  │          │
│  │  id (FK)        │    ┌──> │  code           │          │
│  │  full_name      │    │    │  created_by     │          │
│  │  year           │    │    │  used_by        │          │
│  │  house          │    │    │  is_used        │          │
│  │  email          │    │    └─────────────────┘          │
│  │  phone_number   │    │                                  │
│  │  referred_by ───┘────┘                                 │
│  │  codes_remaining│                                       │
│  └────────┬────────┘                                      │
│           │                                                │
│           │ references                                     │
│           ↓                                                │
│  ┌─────────────────┐         ┌─────────────────┐          │
│  │  events         │         │  rsvps          │          │
│  │  ─────────────  │    ┌──> │  ─────────────  │          │
│  │  id             │ ───┘    │  event_id (FK)  │          │
│  │  title          │         │  user_id (FK)   │          │
│  │  date           │         └─────────────────┘          │
│  │  location       │                                       │
│  │  host_id (FK) ──┘         ┌─────────────────┐          │
│  │  status         │    ┌──> │  votes          │          │
│  │  has_rsvp       │    │    │  ─────────────  │          │
│  │  has_voting     │ ───┘    │  event_id (FK)  │          │
│  │  has_chat       │         │  voter_id (FK)  │          │
│  └─────────────────┘         └─────────────────┘          │
│                                                            │
│                              ┌─────────────────┐          │
│                         ┌──> │ chat_messages   │          │
│                         │    │  ─────────────  │          │
│                         └─── │  event_id (FK)  │          │
│                              │  user_id (FK)   │          │
│                              │  message        │          │
│                              └─────────────────┘          │
└───────────────────────────────────────────────────────────┘
```

---

## 🔐 Row Level Security (RLS) Policies

```
PROFILES TABLE
├─ SELECT: Users can view ONLY their own profile
├─ INSERT: Users can create their profile on signup
└─ UPDATE: Users can update ONLY their own profile

REFERRAL_CODES TABLE
├─ SELECT: Anyone can read (to validate codes)
├─ INSERT: Authenticated users can create codes
└─ UPDATE: System updates when code is used

EVENTS TABLE
├─ SELECT: Anyone can view published events
│          Users can view their own drafts
├─ INSERT: Authenticated users can create (auto-sets host_id)
├─ UPDATE: Users can ONLY update their own events
└─ DELETE: Users can ONLY delete their own events

RSVPS, VOTES, CHAT_MESSAGES
├─ SELECT: Anyone can view
└─ INSERT: Authenticated users only
```

---

## 🎯 Tech Stack

```
┌─────────────────────────────────────────────────┐
│              FRONTEND (React)                    │
├─────────────────────────────────────────────────┤
│  • React 18 + Vite                              │
│  • React Router (routing)                       │
│  • Tailwind CSS (styling)                       │
│  • Mobile-first design                          │
└───────────────┬─────────────────────────────────┘
                │
                │ HTTPS API calls
                ↓
┌─────────────────────────────────────────────────┐
│           BACKEND (Supabase)                     │
├─────────────────────────────────────────────────┤
│  • PostgreSQL database                          │
│  • Supabase Auth (built-in)                     │
│  • Row Level Security (RLS)                     │
│  • Realtime subscriptions                       │
│  • Auto-generated REST API                      │
└─────────────────────────────────────────────────┘
                │
                │ Deploy
                ↓
┌─────────────────────────────────────────────────┐
│           HOSTING (Vercel)                       │
├─────────────────────────────────────────────────┤
│  • Global CDN                                   │
│  • Automatic HTTPS                              │
│  • GitHub integration                           │
│  • Custom domain: harvardpoops.com              │
└─────────────────────────────────────────────────┘
```

---

## 📱 Component Hierarchy

```
App (Router)
├─ AuthProvider (Context)
│  ├─ PublicRoute
│  │  ├─ Login
│  │  └─ Signup
│  │     ├─ Step 1: Referral Code Validation
│  │     └─ Step 2: Account Details Form
│  │
│  └─ ProtectedRoute
│     ├─ Home
│     │  └─ Event Feed (coming soon)
│     │
│     └─ Profile
│        ├─ User Info Display
│        └─ Referral Code Generator
```

---

## 🔄 Authentication State Flow

```
┌─────────────────────────────────────────────────┐
│          AuthContext (Global State)              │
├─────────────────────────────────────────────────┤
│                                                  │
│  STATE:                                          │
│  ├─ user (Supabase auth user)                   │
│  ├─ profile (extended user data)                │
│  └─ loading (auth status check)                 │
│                                                  │
│  METHODS:                                        │
│  ├─ signUp(email, password, details)            │
│  ├─ signIn(email, password)                     │
│  ├─ signOut()                                   │
│  └─ generateReferralCode()                      │
│                                                  │
│  AUTO-SYNCS:                                     │
│  └─ Listens to Supabase auth state changes      │
│     (login/logout/token refresh)                │
└─────────────────────────────────────────────────┘
```

---

## 🛡️ Security Layers

```
Layer 1: CLIENT-SIDE VALIDATION
├─ Harvard email format check (@harvard.edu | @college.harvard.edu)
├─ Password minimum length (8 chars)
├─ Referral code format validation
└─ Form input sanitization

Layer 2: SUPABASE AUTH
├─ Password hashing (bcrypt)
├─ JWT token generation
├─ Automatic token refresh
├─ Rate limiting on auth endpoints
└─ Session management

Layer 3: ROW LEVEL SECURITY
├─ Database-level permission enforcement
├─ Users can't access other users' data
├─ Events tied to host_id
└─ SQL-level protection (can't bypass with API)

Layer 4: ENVIRONMENT VARIABLES
├─ API keys never in code
├─ .env.local gitignored
└─ Vercel env vars for production
```

---

## 📊 Data Flow: Sign Up Example

```
USER ACTION: Fill out signup form
      ↓
STEP 1: Validate referral code
      ├─ Query Supabase: Is code valid & unused?
      ├─ If NO → Show error, stop
      └─ If YES → Continue to Step 2
      ↓
STEP 2: Create Supabase Auth user
      ├─ Supabase hashes password
      ├─ Creates entry in auth.users table
      └─ Returns user ID
      ↓
STEP 3: Create profile record
      ├─ Insert into profiles table
      ├─ Links to auth.users.id
      └─ Stores name, year, house, etc.
      ↓
STEP 4: Mark referral code as used
      ├─ Update referral_codes table
      ├─ Set is_used = true
      └─ Set used_by = new user's ID
      ↓
STEP 5: Auto-login
      ├─ Supabase sets session token
      ├─ AuthContext updates state
      └─ Redirect to home page
```

---

## 🎨 Mobile-First Design Strategy

```
BREAKPOINTS (Tailwind)
├─ Base (mobile): 375px - 640px
│  └─ Classes: text-base, p-4, min-h-[44px]
│
├─ sm: 640px+
│  └─ Not used much (mobile-first)
│
├─ md: 768px+ (tablet)
│  └─ Classes: md:p-6, md:grid-cols-2
│
└─ xl: 1280px+ (desktop)
   └─ Classes: xl:max-w-7xl, xl:mx-auto

TOUCH TARGETS
├─ Buttons: min-h-[44px] (iOS guideline)
├─ Inputs: min-h-[44px] + text-base (prevents zoom)
└─ Links: min-w-[44px] min-h-[44px]

TYPOGRAPHY
├─ Body: text-base (16px) - prevents iOS auto-zoom
├─ Small: text-sm (14px) - minimum readable
└─ Headings: text-2xl to text-4xl
```

---

## 🚀 Deployment Pipeline

```
LOCAL DEVELOPMENT
      │
      │ git push origin main
      ↓
GITHUB REPOSITORY
      │
      │ Webhook triggers Vercel
      ↓
VERCEL BUILD
      ├─ npm install
      ├─ npm run build (vite build)
      └─ Optimizes assets
      ↓
VERCEL DEPLOY
      ├─ Deploy to global CDN
      ├─ HTTPS auto-enabled
      └─ harvardpoops.com live in ~30 seconds
```

---

## 📈 What's Next

```
PHASE 1: Auth System ✅ (DONE)
├─ User signup/login
├─ Referral codes
├─ Profile management
└─ Protected routes

PHASE 2: Events System (Next)
├─ Create event form
├─ Event listing page
├─ Event detail page
└─ Image upload

PHASE 3: Interactive Features
├─ RSVP system
├─ Live voting
├─ Pre-party chat
└─ QR code generation

PHASE 4: Polish & Launch
├─ Event filtering
├─ About/Rules pages
├─ Performance optimization
└─ Production deployment
```

---

**This is a production-ready authentication system!** All the core infrastructure is in place. Now you can focus on building the event features that make Harvard Poops unique.
