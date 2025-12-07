# Harvard Poops - Architecture Documentation

## Tech Stack

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **Backend/Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **Domain**: harvardpoops.com
- **State Management**: React Context (for auth/theme) + Supabase real-time subscriptions

---

## Architecture Overview

React application that communicates directly with Supabase. No separate backend server needed, Supabase provides the database, authentication, real-time capabilities, and storage.

**Mobile-First Design Philosophy**
- **Primary device**: Students access the site on mobile phones (iPhone/Android)
- **Design approach**: Build for mobile screens first, then enhance for desktop
- **Performance goal**: Fast loading on 4G/5G cellular connections
- **UI decisions prioritize mobile UX** (touch targets, readability, navigation)

**Data Flow:**
1. User visits harvardpoops.com (typically on mobile)
2. React app loads in browser
3. App fetches event data from Supabase API using Supabase JS client
4. User interactions (RSVP, voting, chat) update Supabase directly
5. Changes reflect in real-time across all connected clients via Supabase Realtime subscriptions

**Why This Architecture?**
- **Speed**: 12-hour CS50 timeline requires rapid development
- **Simplicity**: Single repo, no separate backend server to manage
- **Real-time**: Supabase provides live voting/chat out of the box
- **Scalability**: PostgreSQL handles growth, Vercel auto-scales deployment globally
- **Collaboration**: One codebase makes it easier for two people to work together
- **Mobile-optimized**: React + Tailwind CSS work well for responsive mobile-first design
- **Developer Experience**: Vite's HMR + Tailwind's utility classes = fast iteration

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

### Why Vercel?
- **Auto-deployment**: Pushes to GitHub main branch automatically deploy
- **Zero-config**: Detects Vite projects automatically, no build config needed
- **Edge Network**: Global CDN for fast load times on mobile (critical for our use case)
- **Custom domains**: Easy to connect harvardpoops.com with SSL included
- **Free tier**: Generous limits for CS50 project scope
- **Preview deployments**: Every PR gets a unique URL for testing
- **Optimized for React**: Built by the team that created Next.js, excellent React support

### Why Tailwind CSS?
- **Mobile-first by default**: Utility classes work perfectly with mobile-first responsive design
- **Fast development**: No need to write custom CSS for every component
- **Consistent design**: Built-in design system (spacing, colors, typography)
- **Small bundle size**: Purges unused CSS in production (only ships what you use)
- **Responsive utilities**: `sm:`, `md:`, `lg:` prefixes make breakpoints easy
- **Touch-friendly**: Easy to implement 44px tap targets with utilities like `min-h-[44px]`
- **No naming conflicts**: Utility classes prevent CSS specificity issues

### Why one monorepo?
- **Simplicity**: Everything in one place, easier to reason about
- **Fast iteration**: No need to coordinate frontend/backend repos
- **Easier collaboration**: Both developers work in same codebase
- **Deployment**: One repo to deploy, one Vercel project

---

## Project Structure

```
cs50final/
├── public/              # Static assets (images, favicon, etc.)
├── src/
│   ├── components/      # Reusable React components
│   │   ├── EventCard.jsx           # Individual event card (unlocked/locked)
│   │   ├── EventFeed.jsx           # Feed container with exclusivity
│   │   ├── CreateEventButton.jsx  # Floating + button
│   │   ├── CreateEventForm.jsx    # Event creation modal
│   │   └── ...
│   ├── contexts/        # React Context providers
│   │   ├── AuthContext.jsx        # Authentication state
│   │   └── EventContext.jsx       # Event feed state + realtime
│   ├── hooks/           # Custom React hooks
│   │   ├── useEventFeed.js        # Exclusivity logic
│   │   ├── useRSVP.js             # RSVP toggle
│   │   ├── useEventCreate.js      # Event creation
│   │   └── ...
│   ├── services/        # Data access layer
│   │   ├── eventService.js        # Event CRUD operations
│   │   ├── rsvpService.js         # RSVP operations
│   │   └── imageService.js        # Image upload to Supabase Storage
│   ├── pages/           # Page-level components
│   │   ├── Home.jsx               # Main feed page
│   │   ├── Login.jsx              # Login page
│   │   ├── Signup.jsx             # Signup with referral code
│   │   ├── Profile.jsx            # User profile
│   │   └── ...
│   ├── lib/             # Utilities and helpers
│   │   ├── supabase.js            # Supabase client setup
│   │   └── utils.js               # Helper functions
│   ├── styles/          # CSS files
│   │   ├── tokens.css             # Design system variables
│   │   ├── event-feed.css         # Event feed styles
│   │   └── ...
│   ├── App.jsx          # Root component with routing
│   └── main.jsx         # Entry point
├── sql/                 # Database migrations and seeds
│   ├── migration_exclusivity.sql  # Adds exclusivity fields
│   └── seed_events.sql            # Sample event data
├── .env.local           # Environment variables (not committed)
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
├── ARCHITECTURE.md      # This file - technical documentation
├── SPECIFICATIONS.md    # Product specifications
├── IMPLEMENTATION.md    # Event feed implementation guide
└── CLAUDE.md            # Workflow rules for development
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

  -- Exclusivity Features (added in migration_exclusivity.sql)
  max_attendees INTEGER DEFAULT NULL,      -- Limit spots (e.g., "Only 15 spots left")
  is_invite_only BOOLEAN DEFAULT false,    -- Require approval to RSVP

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
CREATE INDEX idx_rsvps_user_event ON rsvps(user_id, event_id);  -- Added for exclusivity
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

## Event Feed Architecture

### Overview
The event feed system implements an Instagram-style vertical scrolling feed with RSVP-based exclusivity mechanics. Users start with limited visibility and unlock more events by RSVPing.

### Service Layer Pattern
We use a **three-layer architecture** for clean separation of concerns:

```
Components (UI)
    ↓ (uses hooks)
Custom Hooks (business logic)
    ↓ (calls services)
Services (data access)
    ↓ (queries Supabase)
Supabase Database
```

**Benefits:**
- **Maintainable**: Each layer has a single responsibility
- **Testable**: Services can be mocked, hooks tested in isolation
- **Reusable**: Services can be used across multiple features
- **Type-safe**: Clear contracts between layers

### Services (`src/services/`)

**eventService.js** - Event CRUD operations
```javascript
export const eventService = {
  getPublishedEvents(),      // Fetch all published events
  getEventById(id),          // Get single event details
  createEvent(eventData),    // Create new event
  updateEvent(id, updates),  // Update existing event
  deleteEvent(id),           // Delete event
  subscribeToEvents(callback) // Real-time event updates
}
```

**rsvpService.js** - RSVP operations
```javascript
export const rsvpService = {
  getUserRSVPCount(userId),         // Get user's total RSVPs
  hasRSVPed(userId, eventId),       // Check if user RSVPed to event
  getUserRSVPs(userId),             // Get all user's RSVPs
  getEventRSVPCount(eventId),       // Get RSVP count for event
  createRSVP(rsvpData),             // Create new RSVP
  cancelRSVP(userId, eventId),      // Cancel RSVP
  subscribeToEventRSVPs(eventId, callback) // Real-time RSVP updates
}
```

**imageService.js** - Image upload to Supabase Storage
```javascript
export const imageService = {
  uploadImage(file, bucket, folder),  // Upload image, returns URL
  deleteImage(path, bucket),          // Delete image
  getPlaceholderImage(type)           // Get placeholder for event type
}
```

### Global State (`src/contexts/EventContext.jsx`)

**EventContext** manages global event state with real-time subscriptions:

```javascript
const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([])
  const [userRSVPs, setUserRSVPs] = useState([])
  const [rsvpCount, setRSVPCount] = useState(0)

  // Subscribe to realtime event changes
  useEffect(() => {
    const unsubscribe = eventService.subscribeToEvents((payload) => {
      handleRealtimeEventUpdate(payload)
    })
    return unsubscribe
  }, [])

  return (
    <EventContext.Provider value={{
      events,
      userRSVPs,
      rsvpCount,
      refreshEvents,
      refreshUserRSVPs
    }}>
      {children}
    </EventContext.Provider>
  )
}
```

**Why React Context?**
- Matches existing `AuthContext` pattern (consistency)
- Simpler than Zustand for MVP scope
- Sufficient for current feature set
- Easy to migrate to Zustand later if needed

### Custom Hooks

**useEventFeed.js** - Exclusivity logic
```javascript
export const useEventFeed = () => {
  const { events, rsvpCount } = useEvents()

  // Calculate unlocked count based on RSVPs
  const unlockedCount = useMemo(() => {
    if (rsvpCount === 0) return 3
    if (rsvpCount === 1) return 6
    return 999 // All events
  }, [rsvpCount])

  const visibleEvents = events.slice(0, unlockedCount)
  const lockedEvents = events.slice(unlockedCount)

  return { visibleEvents, lockedEvents, unlockMessage }
}
```

**useRSVP.js** - RSVP toggle with optimistic updates
```javascript
export const useRSVP = (eventId) => {
  const { userRSVPs, refreshUserRSVPs } = useEvents()

  const isRSVPed = useMemo(() => {
    return userRSVPs.some(rsvp => rsvp.event_id === eventId)
  }, [userRSVPs, eventId])

  const toggleRSVP = async () => {
    if (isRSVPed) {
      await rsvpService.cancelRSVP(user.id, eventId)
    } else {
      await rsvpService.createRSVP({ event_id: eventId, user_id: user.id })
    }
    await refreshUserRSVPs()
  }

  return { isRSVPed, toggleRSVP, loading }
}
```

**useEventCreate.js** - Event creation with image upload
```javascript
export const useEventCreate = () => {
  const [uploadProgress, setUploadProgress] = useState(0)

  const createEvent = async (eventData, coverImage) => {
    let coverImageUrl = null

    if (coverImage) {
      setUploadProgress(25)
      coverImageUrl = await imageService.uploadImage(coverImage)
      setUploadProgress(50)
    }

    const newEvent = await eventService.createEvent({
      ...eventData,
      cover_image_url: coverImageUrl
    })

    await refreshEvents()
    return newEvent
  }

  return { createEvent, uploadProgress, loading, error }
}
```

### Components

**EventFeed.jsx** - Feed container
- Displays event grid (single column, mobile-first)
- Shows unlock progress banner
- Renders visible events + locked event teasers
- Handles loading/error/empty states

**EventCard.jsx** - Individual event card
- Supports locked/unlocked states
- Locked cards: blurred with lock icon overlay
- Unlocked cards: full event details + RSVP button
- Uses `useRSVP()` for RSVP toggle

**CreateEventButton.jsx** - Floating + button
- Fixed position (bottom-right, Instagram-style)
- Opens CreateEventForm modal on click
- Crimson gradient background

**CreateEventForm.jsx** - Event creation modal
- Form fields: title, description, date, time, location, type
- Optional: max attendees, invite-only toggle
- Image upload with preview
- Upload progress indicator
- Uses `useEventCreate()` hook

### Exclusivity System

**Tier Progression:**
- **0 RSVPs**: See 3 events, rest locked
- **1 RSVP**: See 6 events, rest locked
- **2+ RSVPs**: See all events

**Why client-side calculation?**
- Faster (no backend round-trip)
- Simpler implementation
- Not a security concern (just UX feature)
- Easy to adjust tiers without database changes

**Locked Event Display:**
- Blurred event card with `filter: blur(8px)`
- Lock icon (🔒) overlay with "RSVP to unlock" text
- Shows teaser of what's hidden (creates FOMO)
- More engaging than simple count banner

### Real-time Updates

EventContext subscribes to Supabase Realtime channels:

```javascript
// Events channel - new events appear instantly
supabase
  .channel('events')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'events'
  }, handleEventChange)
  .subscribe()

// RSVP channel - counts update live
supabase
  .channel(`rsvps-${eventId}`)
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'rsvps',
    filter: `event_id=eq.${eventId}`
  }, handleRSVPChange)
  .subscribe()
```

### Performance Optimizations

- **Memoization**: `useEventFeed` uses `useMemo` for expensive calculations
- **Optimistic Updates**: RSVP feels instant, reverts on error
- **Lazy Loading**: Images use `loading="lazy"` attribute
- **Efficient Queries**: Database indexes on frequently queried columns
- **Client-side filtering**: Exclusivity logic runs in browser (no extra queries)

### Styling Approach

**Custom CSS with Design System** (NOT Tailwind)
- CSS custom properties (variables) in `tokens.css`
- Component-specific styles in `event-feed.css`
- Mobile-first responsive breakpoints
- Harvard Crimson color palette
- Premium dark mode theme

**Why custom CSS instead of Tailwind?**
- Finer control over design system
- Easier to maintain consistent spacing/colors
- Better for complex animations (modal, transitions)
- Cleaner JSX (no long className strings)

---

## Deployment

### Vercel Configuration

**Framework Preset:** Vite (auto-detected)

**Build Command:** (auto-detected from package.json)
```bash
npm run build
# or: vite build
```

**Output Directory:** `dist/` (auto-detected)

**Environment Variables (Set in Vercel Dashboard):**
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon/public key
- `VITE_ADMIN_REFERRAL_CODE` - Admin access code (optional)

### Deployment Flow
1. Push code to GitHub `main` branch
2. Vercel detects changes via webhook
3. Vercel runs `npm install` and `npm run build` automatically
4. Vercel deploys to global edge network
5. Changes live at harvardpoops.com within ~30 seconds
6. Preview URLs created for every PR/branch

### Custom Domain Setup
1. In Vercel dashboard: Settings → Domains → Add Domain
2. Add `harvardpoops.com` and `www.harvardpoops.com`
3. Update DNS records at domain registrar:
   - **Option A (Recommended):** Point nameservers to Vercel
   - **Option B:** Add CNAME record: `www` → `cname.vercel-dns.com`
   - Add A records for apex domain (Vercel provides IPs)
4. SSL certificates generated automatically

---

## Mobile-First Implementation Guidelines

### Design Approach
**Build UI components with mobile as the primary device, then enhance for larger screens.**

**Screen Size Targets:**
- **Mobile (Primary)**: 375px - 428px width (iPhone SE to iPhone Pro Max)
- **Tablet (Secondary)**: 768px - 1024px width
- **Desktop (Tertiary)**: 1280px+ width

**Mobile-First with Tailwind CSS:**
```jsx
// Mobile-first: base classes apply to mobile, then enhance with breakpoints
<div className="p-4 text-base md:p-6 xl:max-w-screen-xl xl:mx-auto">
  {/*
    p-4 = padding: 16px (mobile base)
    text-base = font-size: 16px
    md:p-6 = padding: 24px on tablet (768px+)
    xl:max-w-screen-xl = max-width: 1280px on desktop
    xl:mx-auto = center on desktop
  */}
  Event Card Content
</div>
```

**Tailwind Breakpoints:**
- `sm:` - 640px and up
- `md:` - 768px and up
- `lg:` - 1024px and up
- `xl:` - 1280px and up
- `2xl:` - 1536px and up

### Touch-Friendly Interactions
**Minimum tap target size: 44x44px** (iOS Human Interface Guidelines)

**Tailwind Examples:**
```jsx
// Buttons - min 44px height
<button className="min-h-[44px] px-6 py-3 text-base bg-blue-600 text-white rounded-lg">
  RSVP to Event
</button>

// Form inputs - 16px text prevents iOS auto-zoom
<input
  type="text"
  className="min-h-[44px] px-3 text-base border border-gray-300 rounded-lg w-full"
  placeholder="Event title"
/>

// Textarea
<textarea
  className="min-h-[44px] px-3 py-3 text-base border border-gray-300 rounded-lg w-full"
  placeholder="Event description"
/>

// Event cards - tappable area
<div className="min-h-[80px] p-4 bg-white rounded-lg shadow-sm active:bg-gray-50">
  Event Card Content
</div>
```

**Key Tailwind Utilities for Touch:**
- `min-h-[44px]` - Minimum height of 44px
- `text-base` - 16px font (prevents iOS zoom)
- `active:bg-gray-50` - Visual feedback on tap
- `px-6 py-3` - Generous padding for larger tap area

### Typography for Mobile
**Keep text readable without zooming:**
- **Body text**: 16px or larger (prevents iOS auto-zoom)
- **Small text**: 14px or larger (timestamps, metadata)
- **Headings**: 20px - 32px
- **Line height**: 1.5 - 1.6 for comfortable reading

**Tailwind Typography Classes:**
```jsx
// Body text
<p className="text-base leading-relaxed">Event description goes here...</p>

// Small text (timestamps, metadata)
<span className="text-sm text-gray-600">Dec 10, 2025 • 9:00 PM</span>

// Headings
<h1 className="text-3xl font-bold">Event Title</h1>  {/* 30px */}
<h2 className="text-2xl font-semibold">Section</h2>  {/* 24px */}
<h3 className="text-xl font-medium">Subsection</h3>  {/* 20px */}
```

**Tailwind Text Size Reference:**
- `text-sm` - 14px (minimum for readable text)
- `text-base` - 16px (body text, form inputs)
- `text-lg` - 18px
- `text-xl` - 20px
- `text-2xl` - 24px
- `text-3xl` - 30px

### Mobile Performance Optimization
**Target: < 3 second load on 4G (Fast 3G in DevTools)**

**Strategies:**
1. **Image Optimization**:
   - Use WebP format for cover images
   - Compress to < 200KB per image
   - Lazy load images below the fold

2. **Code Splitting**:
   ```javascript
   // Lazy load admin/host dashboards
   const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
   const HostDashboard = lazy(() => import('./pages/HostDashboard'));
   ```

3. **Bundle Size**:
   - Keep main bundle < 200KB gzipped
   - Use tree-shaking (Vite does this automatically)
   - Avoid heavy libraries

4. **Critical CSS**:
   - Inline above-the-fold CSS
   - Defer non-critical styles

### Mobile Navigation Patterns
**Recommended: Bottom tab bar for primary navigation** (thumb-friendly)

**Tailwind Example:**
```jsx
import { NavLink } from 'react-router-dom';

function BottomNav() {
  return (
    <nav className="fixed bottom-0 w-full h-16 flex justify-around items-center bg-white border-t border-gray-200">
      <NavLink
        to="/"
        className="min-w-[44px] min-h-[44px] flex items-center justify-center"
      >
        Events
      </NavLink>
      <NavLink
        to="/create"
        className="min-w-[44px] min-h-[44px] flex items-center justify-center"
      >
        Create
      </NavLink>
      <NavLink
        to="/profile"
        className="min-w-[44px] min-h-[44px] flex items-center justify-center"
      >
        Profile
      </NavLink>
    </nav>
  );
}
```

**Key Tailwind Classes:**
- `fixed bottom-0` - Stick to bottom of screen
- `w-full h-16` - Full width, 64px height
- `flex justify-around items-center` - Space navigation items evenly
- `border-t border-gray-200` - Top border for visual separation

### Responsive Images
**Use responsive images for different screen densities:**

```jsx
<img
  src="event-cover-1x.jpg"
  srcSet="event-cover-1x.jpg 1x, event-cover-2x.jpg 2x"
  alt="Event cover"
  loading="lazy"
/>
```

### Testing Checklist
**Before deploying any UI changes, test on:**
- [ ] iPhone SE (375px - smallest modern iPhone)
- [ ] iPhone 14 Pro (393px)
- [ ] Android (360px - 412px)
- [ ] iPad (768px)
- [ ] Desktop (1280px+)

**Use Chrome DevTools Device Mode:**
- Test with "Fast 3G" throttling
- Enable touch emulation
- Test both portrait and landscape

### Mobile-Specific Features to Consider
- **Pull-to-refresh**: For event feed updates
- **Swipe gestures**: For navigating between events or voting options
- **Native share**: Use Web Share API for sharing events
  ```javascript
  if (navigator.share) {
    navigator.share({
      title: event.title,
      url: `https://harvardpoops.com/event/${event.id}`
    });
  }
  ```
- **Add to Home Screen**: PWA capabilities (future enhancement)

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

*Last Updated*: 2025-12-06 (Updated tech stack: Vercel deployment + Tailwind CSS)
*Status*: Architecture documentation for React + Tailwind + Supabase + Vercel stack
