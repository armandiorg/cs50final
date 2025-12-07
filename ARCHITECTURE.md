# Harvard Poops - Architecture Documentation

## Tech Stack

- **Frontend**: React + Vite
- **Backend/Database**: Supabase (PostgreSQL)
- **Deployment**: Railway
- **Domain**: harvardpoops.com
- **Styling**: [TBD - Tailwind CSS / vanilla CSS / styled-components]
- **State Management**: [TBD - React Context / Zustand / Redux]

---

## Architecture Overview

Single-page React application that communicates directly with Supabase. No separate backend server needed - Supabase provides the database, authentication, real-time capabilities, and storage.

**Data Flow:**
1. User visits harvardpoops.com
2. React app loads in browser
3. App fetches event data from Supabase API using Supabase JS client
4. User interactions (RSVP, voting, chat) update Supabase directly
5. Changes reflect in real-time across all connected clients via Supabase Realtime subscriptions

**Why This Architecture?**
- **Speed**: 12-hour CS50 timeline requires rapid development
- **Simplicity**: Single repo, no separate backend server to manage
- **Real-time**: Supabase provides live voting/chat out of the box
- **Scalability**: PostgreSQL handles growth, Railway auto-scales deployment
- **Collaboration**: One codebase makes it easier for two people to work together

---

## Key Design Decisions

### Why React + Vite?
- **Fast development**: Vite has instant hot module replacement (HMR)
- **Modern tooling**: Better than Create React App for 2025
- **Optimized builds**: Vite produces smaller, faster production bundles
- **Familiarity**: Team knows React already

### Why Supabase over custom Flask backend?
- **Built-in features**: Database + Auth + Real-time + Storage in one service
- **No API to build**: Supabase auto-generates REST and GraphQL APIs from schema
- **Real-time subscriptions**: Essential for live voting and chat features
- **PostgreSQL**: More robust than SQLite for production
- **Row Level Security (RLS)**: Database-level permissions prevent unauthorized access

### Why Railway?
- **Auto-deployment**: Pushes to GitHub main branch automatically deploy
- **Build automation**: Runs `npm run build` and serves static files
- **Custom domains**: Easy to connect harvardpoops.com
- **Free tier**: Good for CS50 project scope
- **No complex config**: Works out of the box for Vite apps

### Why one monorepo?
- **Simplicity**: Everything in one place, easier to reason about
- **Fast iteration**: No need to coordinate frontend/backend repos
- **Easier collaboration**: Both developers work in same codebase
- **Deployment**: One repo to deploy, one Railway service

---

## Project Structure

```
cs50final/
├── public/              # Static assets (images, favicon, etc.)
├── src/
│   ├── components/      # Reusable React components
│   │   ├── EventCard.jsx
│   │   ├── EventForm.jsx
│   │   ├── VotingWidget.jsx
│   │   └── ...
│   ├── pages/           # Page-level components
│   │   ├── Home.jsx
│   │   ├── EventDetail.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── HostDashboard.jsx
│   ├── hooks/           # Custom React hooks
│   │   ├── useEvents.js
│   │   ├── useAuth.js
│   │   └── useVoting.js
│   ├── lib/             # Utilities and helpers
│   │   ├── supabase.js  # Supabase client setup
│   │   └── utils.js     # Helper functions
│   ├── styles/          # CSS files
│   ├── App.jsx          # Root component with routing
│   └── main.jsx         # Entry point
├── .env.local           # Environment variables (not committed)
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
├── ARCHITECTURE.md      # This file
├── SPECIFICATIONS.md    # Product specs
└── CLAUDE.md            # Workflow rules
```

---

## Database Schema (Supabase)

### `events` Table
Stores all event information.

```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  -- Basic Info
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT NOT NULL,
  cover_image_url TEXT,

  -- Event Type & Status
  type TEXT CHECK (type IN ('party', 'contest', 'tailgate', 'mixer', 'other')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  track TEXT DEFAULT 'official' CHECK (track IN ('official', 'partner')),

  -- Features Enabled
  has_rsvp BOOLEAN DEFAULT false,
  has_voting BOOLEAN DEFAULT false,
  has_playlist BOOLEAN DEFAULT false,
  has_chat BOOLEAN DEFAULT false,
  has_qr_code BOOLEAN DEFAULT false,

  -- External Links
  playlist_url TEXT,

  -- Host Info
  host_id UUID REFERENCES auth.users(id),
  host_name TEXT,

  -- Partner Event Fields
  partner_org TEXT,
  approval_status TEXT CHECK (approval_status IN ('pending', 'approved', 'rejected'))
);

-- Indexes for common queries
CREATE INDEX idx_events_date ON events(date DESC);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_type ON events(type);
CREATE INDEX idx_events_host ON events(host_id);
```

### `rsvps` Table
Tracks student RSVPs to events.

```sql
CREATE TABLE rsvps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  user_name TEXT,
  additional_data JSONB, -- For custom RSVP questions

  UNIQUE(event_id, user_email)
);

CREATE INDEX idx_rsvps_event ON rsvps(event_id);
```

### `votes` Table
Stores live voting data for contests/polls.

```sql
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  option_id TEXT NOT NULL,
  option_label TEXT NOT NULL,
  voter_identifier TEXT, -- Anonymous ID or email

  UNIQUE(event_id, option_id, voter_identifier)
);

CREATE INDEX idx_votes_event ON votes(event_id);
```

### `chat_messages` Table
Stores pre-party chat messages.

```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  message TEXT NOT NULL,
  is_moderated BOOLEAN DEFAULT false
);

CREATE INDEX idx_chat_event_time ON chat_messages(event_id, created_at DESC);
```

### `admin_users` Table (Optional)
If using custom admin logic instead of Supabase Auth roles.

```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('admin', 'host')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

---

## Authentication & Authorization

### Authentication Strategy
**Option A: Referral Code System (Simpler)**
- Hosts enter a referral code to access host dashboard
- Code stored in environment variable or Supabase table
- No email/password login needed
- Good for MVP

**Option B: Supabase Auth (More Robust)**
- Email/password or magic link authentication
- Supabase manages sessions and tokens
- Row Level Security (RLS) policies control data access
- Better for production

**Recommended: Start with A, migrate to B later**

### Authorization Levels
1. **Public Users (No Auth)**
   - View published events
   - RSVP to events
   - Vote in live polls
   - Send chat messages

2. **Hosts (Authenticated)**
   - Create their own events
   - Edit/delete their own events
   - View analytics for their events
   - Cannot see other hosts' events
   - Cannot approve partner events

3. **HP Admin (Super User)**
   - Full access to all events
   - Approve/reject partner event submissions
   - Moderate chat messages
   - Manage host permissions
   - Site-wide settings

### Row Level Security (RLS) Policies

```sql
-- Events: Anyone can view published, only host/admin can edit
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published events"
  ON events FOR SELECT
  USING (status = 'published');

CREATE POLICY "Hosts can view their own drafts"
  ON events FOR SELECT
  USING (auth.uid() = host_id);

CREATE POLICY "Hosts can create events"
  ON events FOR INSERT
  WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update their own events"
  ON events FOR UPDATE
  USING (auth.uid() = host_id);

CREATE POLICY "Hosts can delete their own events"
  ON events FOR DELETE
  USING (auth.uid() = host_id);
```

---

## Real-Time Features

### Live Voting
Uses Supabase Realtime subscriptions to update vote counts in real-time.

**Implementation:**
```javascript
// Subscribe to vote changes for an event
const subscription = supabase
  .channel(`event-${eventId}-votes`)
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'votes', filter: `event_id=eq.${eventId}` },
    (payload) => {
      // Update UI with new vote count
      updateVoteCount(payload.new);
    }
  )
  .subscribe();
```

### Pre-Party Chat
Real-time message updates using Supabase Realtime.

**Implementation:**
```javascript
const subscription = supabase
  .channel(`event-${eventId}-chat`)
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `event_id=eq.${eventId}` },
    (payload) => {
      // Add new message to chat
      addMessage(payload.new);
    }
  )
  .subscribe();
```

---

## API Integration

### Supabase Client Setup
```javascript
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Environment Variables (.env.local)
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ADMIN_REFERRAL_CODE=secret123
```

### Common Data Operations

**Fetch Published Events:**
```javascript
const { data, error } = await supabase
  .from('events')
  .select('*')
  .eq('status', 'published')
  .order('date', { ascending: true });
```

**Create New Event:**
```javascript
const { data, error } = await supabase
  .from('events')
  .insert({
    title: 'New Party',
    date: '2025-12-10',
    time: '21:00',
    location: 'Annenberg Hall',
    type: 'party',
    status: 'draft',
    host_id: user.id
  });
```

**Subscribe to RSVP Updates:**
```javascript
supabase
  .channel('rsvps')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'rsvps' }, handleNewRSVP)
  .subscribe();
```

---

## Deployment

### Railway Configuration

**Build Command:**
```bash
npm run build
```

**Start Command:**
```bash
npm run preview
# OR serve dist/ with a static server
```

**Environment Variables (Set in Railway Dashboard):**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_ADMIN_REFERRAL_CODE`

### Deployment Flow
1. Push code to GitHub `main` branch
2. Railway detects changes via webhook
3. Railway runs `npm install` and `npm run build`
4. Railway serves `dist/` folder
5. Changes live at harvardpoops.com within ~2 minutes

### Custom Domain Setup
1. In Railway dashboard: Settings → Domains → Add Custom Domain
2. Add `harvardpoops.com`
3. Update DNS records at domain registrar:
   - CNAME record: `www` → `[railway-subdomain].up.railway.app`
   - A record: `@` → Railway IP address

---

## State Management

**Approach: [TBD - Choose based on complexity]**

**Option A: React Context (Recommended for MVP)**
- Good for small-to-medium apps
- No additional dependencies
- Use for auth state, theme, basic event filtering

**Option B: Zustand (If app grows)**
- Lightweight alternative to Redux
- Better for complex state (multiple filters, cached data, etc.)
- Easy to add later if Context becomes unwieldy

---

## File Upload (Event Cover Images)

### Supabase Storage
Create a storage bucket for event images:

```javascript
// Upload cover image
const { data, error } = await supabase.storage
  .from('event-images')
  .upload(`${eventId}/cover.jpg`, file);

// Get public URL
const { data: publicURL } = supabase.storage
  .from('event-images')
  .getPublicUrl(`${eventId}/cover.jpg`);
```

**Storage Policies:**
- Public read access for all images
- Upload restricted to authenticated hosts
- Max file size: 5MB

---

## Performance Considerations

### Optimization Strategies
- **Code Splitting**: Use React.lazy() for admin/host dashboards (not needed on public pages)
- **Image Optimization**: Compress cover images, use WebP format
- **Caching**: Cache event listings in React Query or SWR
- **Pagination**: Load events in batches if event count grows large
- **Real-time Throttling**: Limit realtime subscriptions to active event pages only

### Monitoring (Future)
- **Supabase Dashboard**: Track database queries, API usage
- **Railway Metrics**: Monitor memory/CPU usage
- **User Analytics**: Plausible or Simple Analytics (privacy-friendly)

---

## Security Considerations

### Current Measures
1. **RLS Policies**: Database-level security prevents unauthorized data access
2. **Anon Key**: Supabase anon key is safe to expose in frontend (RLS enforces permissions)
3. **HTTPS**: Railway provides SSL certificates automatically
4. **Input Sanitization**: Validate/sanitize user input before inserting to database

### Future Enhancements
- **Rate Limiting**: Prevent spam voting/chat messages (Supabase Edge Functions)
- **Content Moderation**: Auto-flag inappropriate chat messages
- **DDoS Protection**: Cloudflare in front of Railway (if needed)

---

## Testing Strategy

**For CS50 Timeline (Minimal but Effective):**
- **Manual Testing**: Test each feature on mobile + desktop
- **Friend Testing**: Have 3-5 friends try the app before launch
- **Console Monitoring**: Check browser console for errors during testing

**Future Enhancements:**
- **Vitest**: Unit tests for utility functions
- **React Testing Library**: Component tests
- **Playwright**: E2E tests for critical flows (event creation, RSVP, voting)

---

## Known Limitations & Trade-offs

1. **No offline support**: App requires internet connection (acceptable for event platform)
2. **Supabase free tier limits**: 500MB database, 1GB file storage, 2GB bandwidth (sufficient for MVP)
3. **No email notifications**: Would require Supabase Edge Functions or third-party service (future feature)
4. **Anonymous voting**: No login required means potential for duplicate votes (mitigated by voter_identifier)
5. **Chat moderation**: Manual moderation required (no auto-flagging in MVP)

---

## Future Architecture Considerations

As the app grows, consider:
- **CDN**: Cloudflare for faster asset delivery
- **Edge Functions**: Supabase Edge Functions for server-side logic (email notifications, webhooks)
- **Search**: Algolia or Meilisearch for advanced event search
- **Analytics**: Event engagement tracking, RSVP conversion rates
- **Mobile App**: React Native app reusing Supabase backend

---

*Last Updated*: 2025-12-06
*Status*: Initial architecture documentation (project not yet built)
