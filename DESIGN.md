# Design Document - Harvard Poops

## Overview

Harvard Poops is a social event platform where Harvard students discover campus parties and events at Harvard.

---

## Architecture

### Technology Stack

We chose the following technologies for specific reasons:

**Frontend: React + Vite**
- **React** provides component based architecture, making it easy to build reusable UI elements (EventCard, EventChat, etc.)
- **Vite** offers super fast hot module replacement during development and optimized production builds
- React's virtual DOM ensures efficient rerenders, crucial for real time features like chat and voting

**Backend: Supabase**
- **PostgreSQL database** with full SQL capabilities and JSON support for flexible data like voting options
- **Built-in authentication** eliminates the need to implement our own auth system
- **Real time subscriptions** via WebSockets for live chat and voting updates
- **Row Level Security (RLS)** enforces data access rules at the database level, not just the application
- **Storage** for event cover images with automatic CDN delivery

**Styling: Custom CSS with Design Tokens**
- CSS custom properties (variables) in `tokens.css` ensure consistent theming
- No heavy CSS framework dependencies - lightweight and fully customizable
- Mobile-first approach with responsive breakpoints

---

## Database Design

### Schema Overview

The database consists of 6 main tables:

```
profiles     ← Extended user data (year, house, referral tracking)
events       ← All event data with feature flags
rsvps        ← User-event relationships
votes        ← Live voting entries
chat_messages ← Real-time chat messages
referral_codes ← Invite system tracking
```

### Key Design Decisions

**1. Profiles separate from auth.users**

Supabase provides `auth.users` for authentication, but we needed additional fields (year, house, phone). Rather than fighting Supabase's auth system, we created a `profiles` table that references `auth.users(id)` as a foreign key. This separation keeps auth concerns isolated from application data.

**2. Feature flags on events**

Events have boolean flags: `has_rsvp`, `has_voting`, `has_chat`, `has_qr_code`, `has_playlist`. This allows hosts to enable/disable features per event without creating separate event types. The UI conditionally renders features based on these flags.

**3. JSONB for voting options**

Initially, we stored voting option labels only when someone voted (in the `votes` table). This caused a bug where options with zero votes disappeared. We added `voting_options JSONB` to the events table, allowing hosts to define options that persist regardless of vote counts.

**4. Row Level Security (RLS)**

Every table has RLS policies ensuring:
- Users can only modify their own data
- Published events are visible to everyone
- Hosts can edit/delete only their own events
- Users can only cancel their own RSVPs

This provides security at the database level - even if frontend code has bugs, the database won't allow unauthorized actions.

---

## Frontend Architecture

### Context Providers

We use React Context for global state management:

**AuthContext**
- Manages user authentication state
- Provides `user`, `profile`, `loading` to all components
- Handles login, logout, signup flows
- Listens to Supabase auth state changes

**EventContext**
- Manages events list and user RSVPs
- Provides `events`, `userRSVPs`, `rsvpCount`, `loading`
- Subscribes to real time event updates
- Separate `rsvpLoading` state prevents UI flash issues (explained below)

### Custom Hooks

Hooks encapsulate reusable logic:

**useRSVP(eventId)**
- Returns `isRSVPed`, `rsvpCount`, `toggleRSVP`, `loading`
- Implements optimistic updates for instant UI feedback
- Handles the complexity of checking RSVP status from context

**useEventFeed()**
- Implements the "unlock more events" logic
- Returns `visibleEvents`, `lockedEvents`, `unlockMessage`
- Calculates unlock thresholds (0 RSVPs → 3 events, 1 RSVP → 6 events, 2+ → all)

**useEventCreate()**
- Handles event creation with image upload
- Provides `uploadProgress` for progress indication
- Manages the two step process: upload image, then create event

### Service Layer

Services abstract all Supabase operations:

```
eventService.js   - CRUD operations for events
rsvpService.js    - RSVP creation/cancellation
chatService.js    - Message sending and real time subscriptions
votingService.js  - Vote casting and real time subscriptions
imageService.js   - Image upload to Supabase Storage
```

This separation means components never directly call Supabase, they go through services. If we ever migrated away from Supabase, we'd only need to modify the service files.

---

## Key Features Implementation

### 1. Referral Code System

**Problem:** We wanted an invite only platform where existing users can invite new users.

**Solution:**
- Pre-seeded `referral_codes` table with 10 master codes
- During signup, the code is validated before account creation
- Each user starts with 3 referral codes they can generate (tracked in `profiles`)
- Codes are one time use - marked as `is_used = true` after signup

**Validation flow:**
1. User enters referral code
2. Frontend queries `referral_codes` table for unused code
3. If valid, proceed with signup
4. After successful signup, mark code as used

### 2. Event Unlocking System

**Problem:** We wanted to encourage engagement by requiring RSVPs to see more events.

**Solution:**
- `useEventFeed` hook calculates `unlockedCount` based on `rsvpCount`
- Events are sliced: `visibleEvents = events.slice(0, unlockedCount)`
- Locked events show blurred cards with a lock overlay
- A banner shows progress: "RSVP to 1 more event to unlock all events"

**Thresholds:**
- 0 RSVPs → See 3 events
- 1 RSVP → See 6 events
- 2+ RSVPs → See all events

### 3. Real Time Chat

**Problem:** Attendees should be able to communicate about events in real-time.

**Solution:**
- `chat_messages` table stores messages with `event_id`, `user_id`, `message`
- `chatService.subscribeToMessages()` creates a Supabase real time subscription
- New messages trigger the callback, updating the UI instantly
- **Optimistic updates:** Message appears immediately, then gets confirmed by the server
- **Duplicate prevention:** We filter out messages with matching temporary IDs

**Implementation details:**
```javascript
// Subscribe to new messages
supabase
  .channel(`chat:${eventId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'chat_messages',
    filter: `event_id=eq.${eventId}`
  }, callback)
  .subscribe()
```

### 4. Live Voting

**Problem:** Contest events need real-time voting with instant results.

**Solution:**
- `votes` table tracks individual votes with `event_id`, `option_id`, `voter_id`
- `voting_options` JSONB field on events stores the options (persisted even with 0 votes)
- One vote per user enforced at service level (check before insert)
- Real-time subscription updates vote counts across all viewers

**Preventing vote changes:**
```javascript
async castVote({ event_id, option_id, voter_id }) {
  const existingVote = await this.getUserVote(event_id, voter_id)
  if (existingVote) {
    throw new Error('You already voted')
  }
  // ... insert new vote
}
```

### 5. Preventing UI Flash on Login

**Problem:** When a user logs in, there was a brief flash showing "RSVP Now" before switching to "Cancel RSVP" for events they'd already RSVPed to. Similarly, the "Unlock More Events" banner would flash.

**Root cause:** Events load quickly, but user RSVPs take slightly longer. During that gap, `rsvpCount = 0` and `isRSVPed = false`.

**Solution:**
- Added `rsvpLoading` state to EventContext
- `isRSVPed` returns `null` (not `false`) while RSVPs are loading
- UI shows a spinner during loading state instead of incorrect state
- `hasLockedEvents` is only `true` when `!rsvpLoading && lockedCount > 0`

---

## Styling Approach

### Design Tokens

All colors, spacing, typography, and effects are defined in `tokens.css`:

```css
:root {
  /* Colors */
  --color-crimson: #A51C30;
  --color-black-true: #000000;
  --color-black-elevated: #0a0a0a;
  
  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  
  /* Typography */
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
}
```

This ensures consistency and makes theming changes trivial, update one variable, and it propagates everywhere.

### Mobile First Design

- Base styles target mobile (< 768px)
- The `MobileOnlyGuard` component blocks desktop users with a message
- Touch targets are at least 44x44px for accessibility
- Modals use `position: fixed` to work well on mobile browsers

---

## Challenges and Solutions

### Challenge 1: Dropdown Menus on Mobile

**Problem:** Native `<select>` elements looked inconsistent across devices, and custom dropdowns had z-index issues with React's component tree.

**Solution:** Implemented dropdowns using **React Portals**. The dropdown menu renders directly into `document.body`, escaping the component hierarchy. This ensures proper z-index stacking regardless of parent styles.

### Challenge 2: Event Detail Page Loading Flash

**Problem:** Navigating to event details showed a loading spinner, then the full page. This felt slow.

**Solution:** Pass event data via **React Router's navigation state**:
```javascript
navigate(`/event/${event.id}`, { 
  state: { event, isRSVPed, rsvpCount } 
})
```
The EventDetail page checks for this state first and renders instantly if available. It only fetches from the database if accessed directly (e.g., via URL).

### Challenge 3: Voting Options Disappearing

**Problem:** When hosts edited voting options, options with zero votes would disappear after a page refresh because labels were only stored in the `votes` table.

**Solution:** Added `voting_options JSONB` column to the `events` table. Options are now persisted with the event itself, independent of vote data.

---

## Security Considerations

1. **RLS Policies:** Every table has Row Level Security ensuring users can only access/modify their own data
2. **Harvard Email Validation:** Signup validates email domain against a whitelist
3. **Referral Gate:** Can't create an account without a valid referral code
4. **Auth State:** Components check `user` existence before allowing actions
5. **Service Layer:** All database operations go through services with proper error handling

---

## Future Improvements

If we had more time, we would implement:

1. **Guest List for Hosts** - Let hosts see who's attending their event
2. **Push Notifications** - Alert users about upcoming events or new messages
3. **QR Code Check-in** - Generate QR codes for event entry
4. **Playlist Integration** - Embed Spotify playlists on event pages
5. **Image Optimization** - Resize/compress uploaded images for faster loading

---

## Conclusion

Harvard Poops is a full stack application with real time features, proper authentication, and great UX. The architecture separates concerns (contexts for state, services for API, hooks for logic), making the codebase maintainable and testable. Supabase proved to be an excellent choice for rapid development while still providing powerful features like real time subscriptions and row level security.
