# Harvard Poops 💩

**An exclusive, mobile-first social events platform for Harvard students.**

Harvard Poops is a private events app that brings together Harvard's social scene through an invite-only, referral-based system. Students can discover parties, contests, tailgates, and mixers happening across campus, RSVP to events, chat with other attendees, and even vote in live contests.

---

## 🎬 Video Demo

[Watch the demo video here](https://youtu.be/5tSlNsB_Uu8)

---

## 📱 Getting Started

### Prerequisites

Before running Harvard Poops, ensure you have:

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **npm** (comes with Node.js)
3. **A Supabase account** - [Sign up free](https://supabase.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/armandiorg/cs50final.git
   cd cs50final
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Supabase:**
   - Login to the project or if starting new make a new one at [supabase.com](https://supabase.com/)
   - Go to **SQL Editor** and run the contents of `sql/schema.sql`
   - This creates all necessary tables: profiles, events, rsvps, votes, chat_messages, referral_codes

4. **Configure environment variables:**
   - Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
   - Find these values in your Supabase project: **Settings → API**

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open the app:**
   - Navigate to `http://localhost:5173` in your browser
   - **Important:** Use mobile view (Chrome DevTools → Toggle device toolbar, or resize to <768px width)

---

## 📖 User Guide

### Creating an Account

1. Open the app on a mobile device or mobile browser view
2. Click **"Sign Up"**
3. Enter a valid **referral code** (use one of the starter codes from the database: `HP-LAUNCH2025`, `HP-CRIMSON01`, etc.)
4. Fill in your details:
   - Full Name
   - Harvard Email (@college.harvard.edu, @harvard.edu, etc.)
   - Year (Freshman, Sophomore, Junior, Senior, Graduate)
   - House/Dorm (options change based on your year)
   - Phone Number
   - Password
5. Click **"Create Account"** - you'll be automatically logged in

### Logging In

1. Click **"Log In"**
2. Enter your Harvard email and password
3. Click **"Sign In"**

### Browsing Events

The home feed shows upcoming events. Initially, you'll see **3 events** with more locked behind a blur.

**Unlocking more events:**
- RSVP to 1 event → See 6 events total
- RSVP to 2+ events → See all events

Each event card shows:
- Cover image (or emoji placeholder)
- Event type badge (PARTY, CONTEST, TAILGATE, MIXER, OTHER)
- Title, date, time, and location
- RSVP button

### RSVPing to Events

1. Find an event you want to attend
2. Click **"RSVP Now"** on the event card
3. The button changes to **"Cancel RSVP"** and shows a green "RSVPed ✓" badge
4. To cancel, click **"Cancel RSVP"**

### Viewing Event Details

Click anywhere on an event card (except the RSVP button) to see full details:

- Full description
- Host information
- RSVP count
- **Event Chat** (if enabled) - Real-time messaging with other attendees
- **Live Voting** (for contest events) - Vote on contest options

### Using Event Chat

If the event has chat enabled:

1. Click the **"💬 Event Chat"** button
2. A chat modal opens showing all messages
3. Type your message and click **"Send"**
4. Messages appear in real-time for all attendees

### Using Live Voting (Contest Events)

For contest events with voting enabled:

1. View the voting options on the event page
2. **Note:** You only get 1 vote so choose wisely!
3. Click on your preferred option to cast your vote
4. Watch the live results update in real-time
5. The progress bars show percentages and vote counts

**Hosts can edit voting options** by clicking "Edit Options" to customize the contest choices.

### Creating Events

1. Click the **"+" button** in the bottom-right corner
2. Fill in the event details:
   - **Title** (required)
   - **Cover Image** (optional - upload a photo)
   - **Description** (required)
   - **Date & Time** (required)
   - **Location** (required)
   - **Event Type** (Party, Contest, Tailgate, Mixer, Other)
   - **Max Attendees** (optional)
   - **Enable Event Chat** (checkbox)
   - **Enable Live Voting** (checkbox - only for Contest type)
3. Click **"Create Event"**

### Managing Your Events

Go to **Profile → My Events** tab to see events you've created.

For each event, you can:
- **Edit** - Modify event details
- **Delete** - Remove the event (with confirmation)

### Editing Your Profile

1. Go to the **Profile** page (tap your avatar/icon)
2. Click **"Edit Profile"**
3. Update your information:
   - Full Name
   - Year
   - House/Dorm
   - Phone Number
4. Click **"Save Changes"**

### Viewing Your RSVPs

Go to **Profile → My RSVPs** tab to see all events you've RSVPed to.

---

## 🔧 For Testers/Staff

### Test Accounts

You can create a new account using these referral codes:
- `HP-LAUNCH2025`
- `HP-CRIMSON01`
- `HP-HARVARD02`
- `HP-POOPS03`
- `HP-EVENTS04`

### Testing Features Checklist

1. **Authentication:**
   - [ ] Sign up with referral code
   - [ ] Log in / Log out
   - [ ] Edit profile

2. **Events:**
   - [ ] View event feed
   - [ ] RSVP to an event
   - [ ] Cancel RSVP
   - [ ] View event details
   - [ ] Create a new event
   - [ ] Edit your event
   - [ ] Delete your event

3. **Event Chat:**
   - [ ] Create an event with chat enabled
   - [ ] Send messages in chat
   - [ ] See real-time message updates

4. **Live Voting:**
   - [ ] Create a Contest event with voting enabled
   - [ ] Edit voting options (as host)
   - [ ] Cast a vote
   - [ ] See real-time vote updates
   - [ ] Verify "already voted" prevention works

5. **Unlocking System:**
   - [ ] With 0 RSVPs, see only 3 events
   - [ ] RSVP to 1 event, see 6 events
   - [ ] RSVP to 2+ events, see all events

### Important Notes

- **Mobile Only:** The app is designed for mobile. Use browser DevTools to toggle device toolbar, or access from a phone.
- **Harvard Emails:** Signup requires a Harvard email domain (@college.harvard.edu)
- **Real-time Features:** Chat and voting update in real-time across multiple users/tabs thanks to Supabase.

---

## 🗂️ Project Structure

```
cs50final/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── CreateEventForm.jsx
│   │   ├── EditEventForm.jsx
│   │   ├── EventCard.jsx
│   │   ├── EventChat.jsx
│   │   ├── EventFeed.jsx
│   │   ├── EventVoting.jsx
│   │   └── ...
│   ├── contexts/         # React Context providers
│   │   ├── AuthContext.jsx
│   │   └── EventContext.jsx
│   ├── hooks/            # Custom React hooks
│   │   ├── useEventCreate.js
│   │   ├── useEventFeed.js
│   │   └── useRSVP.js
│   ├── pages/            # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Profile.jsx
│   │   └── EventDetail.jsx
│   ├── services/         # API/database service layers
│   │   ├── eventService.js
│   │   ├── rsvpService.js
│   │   ├── chatService.js
│   │   ├── votingService.js
│   │   └── imageService.js
│   ├── styles/           # CSS files
│   │   ├── tokens.css    # Design tokens
│   │   ├── global.css    # Global styles
│   │   └── components.css
│   └── lib/
│       └── supabase.js   # Supabase client
├── sql/
│   └── schema.sql        # Database schema
├── package.json
├── vite.config.js
└── Multiple Read Mes and Legacy / Unused Files.
```

---

## 🐛 Troubleshooting

### "Invalid referral code" on signup
- Make sure you're using one of the valid codes listed above
- Codes are case-sensitive

### Events not loading
- Check your Supabase URL and anon key in `.env`
- Ensure the database schema has been applied

### Chat messages not appearing in real-time
- This uses Supabase Realtime, ensure your Supabase project has Realtime enabled
- Check browser console for WebSocket errors

### "Mobile only" screen appears
- The app requires a mobile viewport (< 768px width)
- Use browser DevTools to toggle device toolbar
- Or access from an actual mobile device

---

## 👥 Authors

- Achraf Zemzami
- Armand Iorgulescu
