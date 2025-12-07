# Harvard Poops - Project Specifications

## Project Overview

**Title**: Harvard Poops

**Vision**: The go-to social app for events and curated campus happenings.

**Purpose**: Harvard Poops centralizes event details, links, and interactive features so students always know what's going on at Harvard—from big social gatherings to parties on campus. Additionally, rooted in HP's functionality is artifiical exclusivity, which creates the perception of exclusive events to increase participation

---

## Core Description

The homepage will show a feed of upcoming and past events as cards with the title, date, time, place, and description (if applicable). Clicking an event will lead to its own page with full details: RSVP forms, playlists, pre-party chat, and, for certain events, a live voting section that updates in real time as people vote from their phones (specifically for the use case of events like performative male contests)

There will also be a simple events view where students can see current/upcoming/past ones, and an about page that explains how events work and rules.

For the HP team or party partners, we'll build a basic admin interface protected by a password where they can create, edit, publish, and unpublish events and toggle on features.

The project will be implemented as a React application built with Vite, with event and voting data stored in Supabase. The React frontend will communicate directly with Supabase's API to fetch and update event information in real-time, so that harvardpoops.com functions as a dynamic, interactive events site.

---

## User Personas & Goals

### Students (Primary Users)
- **Discover** upcoming Harvard Poops events
- **View** event details (date, time, location, description)
- **Access** event-specific features (RSVPs, playlists, live voting)
- **Check** what's happening before going out on a given night

### Hosts (who are also students)
- **Create Events**: Build event pages from scratch with all necessary details
- **Event Details Management**: Set title, date, time, location, description, cover images
- **Interactive Features Toggle**: Choose which features to enable for their event:
  - 🎵 **Playlist Integration**: Link Spotify/Apple Music playlists for the event
  - 🗳️ **Live Voting**: Enable real-time voting (e.g., for contests, song requests, polls)
  - 📝 **RSVP Forms**: Collect attendee sign-ups with custom questions
  - 💬 **Pre-Party Chat**: Enable live chat before the event starts
  - 📱 **QR Code Generation**: Generate QR codes for check-ins or interactive features
- **Event Categorization**: Tag events by type (party, contest, tailgate, mixer, etc.)
- **Publish/Unpublish Control**: Control when events go live or get taken down
- **Edit Existing Events**: Update event details, change features, modify descriptions
- **Event Analytics** (aspirational): View RSVPs, voting participation, engagement metrics

**Host Workflow**:
1. **Access Host Dashboard**: Log in via referral code or host credentials
2. **Create New Event**: Click "Create Event" → Fill out event form
3. **Configure Interactive Features**: Toggle on/off features like playlists, voting, RSVP
4. **Customize Event Page**: Upload images, write descriptions, set event type
5. **Publish Event**: Make event visible to students on the main feed
6. **Manage During Event**: Monitor RSVPs, moderate chat, track voting results
7. **Post-Event**: Archive event or keep it visible in past events section

**Host Permissions**:
- Can only edit/delete their own events (not other hosts' events)
- Cannot access HP Admin features (approving partner events, site-wide settings)
- Events are subject to HP team review/moderation (can be unpublished if violating rules)

**Example Use Cases**:
- Student hosting a dorm party → Creates event with RSVP + playlist
- Club hosting a contest → Creates event with live voting enabled
- Athlete hosting tailgate → Creates event with QR code check-ins
- DJ hosting pre-game → Creates event with playlist + pre-party chat

---

## Feature Roadmap

### Good Outcome (MVP - Must Have)
✅ **Core Event System**
- Reliable harvardpoops.com with chronological event listing
- Event data from structured source (not hardcoded)
- Individual event pages with details
- Consistent, responsive layout (mobile + desktop)
- Clear upcoming/past event organization

---

### Better Outcome (Target Release)
🎯 **Admin System & Organization**
- Password-protected admin interface
- Create/edit/archive events via forms
- Event categorization (party, contest, tailgate tags)
- Filter by tag or date on main feed
- Complete page navigation (home, events, about, rules/guidelines)
- Polished responsive design

**Definition**: Turning harvardpoops.com into a tool that the Harvard Poops team can actively use to run events. There would be an admin area that requires a password where organizers can create, edit, and archive events through forms instead of editing code. Events are automatically sorted into upcoming and past sections (or can be fully archived) and can be labeled with simple tags like party, contest, or tailgate. The main feed supports simple filtering by tag or by date so students can quickly find what they care about. The homepage, events listing, individual event pages, about page, and rules or community guidelines page are all tied together with consistent navigation and a site that is carefully designed to look good on different screen sizes, especially phones.

---

### Best Outcome (Aspirational)
🚀 **Full Interactive Platform**
- Two event tracks: Official HP + Partner Events
- Partner event submission form + admin review queue
- Live interactive voting for select events
- QR code integration for event interactions
- Real-time result updates
- Distinctive brand identity and visual design
- Production-ready deployment (stable harvardpoops.com)

**Definition**: Making harvardpoops.com feel like the go-to social calendar for what we do at Harvard. Events are organized into two tracks: official events that are fully hosted by HP and a separate section for curated campus events from partners, with clear tabs or filters that let visitors switch views. There is a partner form where outside hosts can submit event proposals/ideas, and those submissions appear in an admin review queue where the team can approve, edit, or reject them before they appear on the site. Selected events support live interactive moments, with QR codes that link directly to the event interaction page and results that update in real time on screen. The site has a distinctive visual identity with consistent branding and layout so it feels like a finished product, and the deployment is stable enough that students can reliably visit harvardpoops.com before going out to see what is happening that night.

---

## Event Architecture

### Event Tracks
1. **Official Events**: Fully hosted by Harvard Poops
2. **Partner Events**: Curated campus events from external partners

### Event Types/Tags
- 🎉 Party
- 🏆 Contest
- 🏈 Tailgate
- 🍹 Mixer
- ⭐ Other

### Interactive Features
- **Live voting**: Real-time voting with live result updates
- **QR codes**: Direct links to event interaction pages
- **RSVP forms**: Student sign-ups for events
- **Playlist integration**: Shared event playlists
- **Pre-party live chat**: Real-time chat before events (aspirational)

---

## Brand & Experience Goals

- **Go-to resource**: The first place students check for Harvard Poops events
- **Distinctive visual identity**: Unique branding that stands out
- **Consistent experience**: Cohesive design across all pages
- **Fun and clear UX**: Easy to navigate, enjoyable to use
- **Reliable**: Stable enough for students to trust before heading out
- **Mobile-first priority**: The website should be optimized for mobile phones as the primary device
  - Students primarily access the site on their phones (before/during events)
  - Touch-friendly interactions (large tap targets, swipe gestures)
  - Fast loading on cellular connections
  - Readable text without zooming
  - Desktop is secondary - mobile experience comes first

---

## Technical Scope (High-Level Reference)

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Flask (Python web framework)
- **Database**: SQLite (event storage)
- **Deployment**: harvardpoops.com (publicly accessible)
- **Authentication**: Referral code system for organizers
- **Data Flow**: JSON API endpoints consumed by frontend via fetch

---

## Collaboration & Workflow

**Collaborators**:
- Armand Iorgulescu - Focus on visual design, wording, UX testing
- [Development partner] - Focus on code implementation and integration

**Division of Work**:
- **Armand**: Visual design, content/wording, UX validation with users
- **Dev Partner**: Backend/frontend code, feature integration, GitHub workflow

**Testing Approach**: Test each feature with friends, collect feedback, iterate until it feels fun and clear.

---

## Current Status

**Completed** ✅:
- ✅ **Authentication System**: Referral code-based signup with Harvard email validation
- ✅ **Event Feed**: Instagram-style vertical scrolling feed (mobile-first)
- ✅ **RSVP System**: Users can RSVP to events with instant feedback
- ✅ **Exclusivity Mechanics**:
  - 0 RSVPs → 3 events visible, rest locked
  - 1 RSVP → 6 events visible, rest locked
  - 2+ RSVPs → all events unlocked
- ✅ **Event Creation**:
  - Floating + button (Instagram-style)
  - Full event creation form (title, description, date, time, location, type)
  - Cover image upload to Supabase Storage
  - Optional fields: max attendees, invite-only toggle
- ✅ **Event Cards**:
  - Unlocked cards show full event details + RSVP button
  - Locked cards show blurred teaser with lock icon
- ✅ **Real-time Updates**: Supabase Realtime subscriptions for events and RSVPs
- ✅ **Database**: Supabase PostgreSQL with Row Level Security (RLS)
- ✅ **Service Layer**: Clean architecture (services → hooks → components)
- ✅ **Custom Design System**: CSS variables with Harvard Crimson theme

**In Progress** 🚧:
- 🚧 **Event Detail Page**: Individual event page with full details
- 🚧 **Event Editing**: Edit/delete own events
- 🚧 **Limited Spots Logic**: Enforce max_attendees, show "X spots left"
- 🚧 **Invite-Only Events**: Pending/approved RSVP states

**Planned** 📋:
- 📋 **Search & Filters**: Search by title/location, filter by type/date
- 📋 **Live Voting**: Real-time voting for contests
- 📋 **QR Code Integration**: QR codes for check-ins
- 📋 **Pre-Party Chat**: Live chat before events
- 📋 **Playlist Integration**: Link Spotify/Apple Music playlists
- 📋 **Partner Event Track**: Partner event submission + admin approval
- 📋 **About and Rules Pages**: Site information and guidelines
- 📋 **Event Analytics**: RSVP counts, engagement metrics

---

## Next Steps

1. **Product Definition**: Sit down and write out exactly what the site should do from a student's point of view
2. **UX Design**: Sketch simple screens for home page, event pages, and organizer interface
3. **Technical Learning**:
   - Store event details in one place (structured data)
   - Set up basic login for organizers
   - Implement partner event request form
   - Research hosting for stable harvardpoops.com deployment
   - Learn GitHub workflow for collaborative development
4. **Testing & Iteration**: Test features with friends, collect feedback, refine until reliable

---

*Last Updated*: 2025-12-07 (Event feed + RSVP + exclusivity system complete)
