# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Harvard Poops is a Flask-based event platform with referral-code gated access. The architecture uses SQLite for data persistence, vanilla JavaScript for the frontend, and a simple token-based authentication system.

## Development Commands

```bash
# Run the development server
python app.py  # Runs on port 5000 by default

# Run on custom port
PORT=5001 python app.py

# Database initializes automatically on first run
# Creates harvardpoops.db with seed data
```

**Testing Credentials:**
- Referral codes: `HARVARD2024`, `VERITAS24`, `POOPMASTER`, or any from schema.sql
- Admin password: `harvardpoops2024`

## Architecture

### Authentication Flow

**Two-tier authentication system:**

1. **User Authentication (Referral Codes):**
   - User enters one-time-use referral code on [landing.html](static/landing.html)
   - POST to `/api/auth/verify-code` (app.py:115-155)
   - Backend marks code as used (`used_by` field), returns SHA256 token
   - Token stored in `localStorage.userToken`
   - All protected pages check for token on DOMContentLoaded

2. **Admin Authentication:**
   - Password: `harvardpoops2024` (hardcoded in app.py:110)
   - Token stored in `localStorage.adminToken`
   - Admin endpoints require `Authorization: Bearer admin-token` header

**Important:** Tokens never expire. Referral codes are one-time use, but the token persists indefinitely in localStorage.

### Database Structure

Four tables in `harvardpoops.db`:
- `events` - Event listings with type/track categorization
- `voting_sessions` - Polls tied to events
- `voting_options` - Individual poll options with vote counts
- `referral_codes` - One-time access codes with usage tracking

### File Organization

**Backend:**
- [app.py](app.py) - All Flask routes and API endpoints
- [schema.sql](schema.sql) - Database schema with seed data

**Frontend Pages:**
- [static/landing.html](static/landing.html) - Referral code gate (entry point)
- [static/index.html](static/index.html) - Events feed
- [static/event.html](static/event.html) - Event details with voting
- [static/admin.html](static/admin.html) - Admin panel

**Frontend JavaScript:**
- [static/landing.js](static/landing.js) - Referral code submission
- [static/app.js](static/app.js) - Events feed with auth guard
- [static/event.js](static/event.js) - Event details with live voting
- [static/admin.js](static/admin.js) - Admin operations

**Styling:**
- [static/landing.css](static/landing.css) - Minimal gate page styling
- [static/styles.css](static/styles.css) - Dark mode design system

## Critical Implementation Details

### Referral Code System

```python
# app.py:115-155
# Flow:
1. Code normalized: .strip().upper()
2. Validation: exists, is_active=1, used_by IS NULL
3. Mark as used: used_by = "user_YYYYMMDDHHMMSS"
4. Return SHA256 token
```

### Live Voting System

- Poll-based updates every 3 seconds (event.js:157)
- No user tracking - anonymous voting allowed
- **Hardcoded:** Only event ID 3 (Halloween) has voting enabled (event.js:132)
- Vote submission: POST `/api/votes` with session_id and option_id
- Results fetched: GET `/api/voting/<session_id>`

### Event Types & Configuration

```javascript
// app.js:91-97
EVENT_TYPE_CONFIG = {
  party: { emoji: '🎉', color: '#A51C30' },
  contest: { emoji: '🏆', color: '#EC4899' },
  tailgate: { emoji: '🏈', color: '#06B6D4' },
  mixer: { emoji: '🍹', color: '#10B981' },
  other: { emoji: '⭐', color: '#6B7280' }
}

// Tracks: 'official' (Harvard Poops) or 'partner'
```

## Non-Obvious Patterns

### Event ID Extraction
```javascript
// event.js:6
const eventId = window.location.pathname.split('/')[2];
// Extracts ID from /event/1
```

### Date Format Conversion
```javascript
// admin.js:404
event_datetime.replace(' ', 'T').substring(0, 16)
// Converts "2024-11-23 11:00:00" → "2024-11-23T11:00"
// Required for HTML5 datetime-local input
```

### Stagger Animation
```javascript
// app.js:62-66
setTimeout(() => {
  card.style.opacity = '1';
}, index * 100);
// Animates event cards with 100ms delay between each
```

### Known Bug: Filter System
- HTML uses `class="filter-pill"` (index.html:39)
- JavaScript looks for `class="filter-btn"` (app.js:146)
- **Result:** Filter buttons currently non-functional
- **Fix:** Change either HTML class or JS selector to match

## API Endpoints

### Public Endpoints
- `GET /api/events` - All published events
- `GET /api/events/<id>` - Single event details
- `GET /api/events/upcoming` - Future events only
- `GET /api/voting/<session_id>` - Voting results
- `POST /api/votes` - Submit vote (anonymous)

### Auth Endpoints
- `POST /api/auth/verify-code` - Verify referral code, get token
- `POST /api/admin/login` - Admin login

### Admin Endpoints (require Bearer token)
- `GET /api/admin/events` - All events including unpublished
- `POST /api/admin/events` - Create event
- `PUT /api/admin/events/<id>` - Update event
- `DELETE /api/admin/events/<id>` - Delete event

## Security Notes

- Admin password is hardcoded (app.py:110)
- CORS enabled for all origins (app.py:8)
- No CSRF protection on voting
- Client-side auth only for user routes (no backend enforcement)
- Tokens never expire

## Common Development Tasks

### Adding a New Referral Code
```sql
INSERT INTO referral_codes (code, is_active) VALUES ('NEWCODE', 1);
```

### Resetting a Used Referral Code
```sql
UPDATE referral_codes SET used_by = NULL WHERE code = 'HARVARD2024';
```

### Creating a Voting Session
```sql
INSERT INTO voting_sessions (event_id, question, is_active) VALUES (1, 'Your question?', 1);

INSERT INTO voting_options (session_id, option_text, option_order) VALUES
(1, 'Option A', 0),
(1, 'Option B', 1);
```

Note: Update event.js:132 to enable voting for the new event ID.

## Port Configuration

Default port: 5000 (configurable via `PORT` environment variable)
- Debug mode: Always enabled
- Host: `0.0.0.0` (accessible from network)
- See app.py:248-249
