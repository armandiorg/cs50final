# HARVARD POOPS - Project Documentation

**Last Updated:** November 20, 2025
**Team:** Armand Iorgulescu, [Team Member 2]
**CS50 Final Project**

---

## 🎯 PROJECT VISION

**Harvard Poops is the go-to social calendar for what's happening at Harvard.**

We're building a fast, reliable, mobile-first event platform that the Harvard Poops team uses day-to-day to run their social life at Harvard. Students check harvardpoops.com before going out to see what's happening tonight. Organizers manage everything through an admin dashboard without touching code. Partners can propose events. Selected events feature live interactive moments with real-time voting and QR codes.

**Core Philosophy:**
- **Student-first**: Mobile-optimized, fast, easy to use at a glance
- **Data-driven**: No hardcoded pages - everything from structured data
- **Reliable**: Works when students need it (Friday/Saturday nights)
- **Branded**: Feels like a real product, not a class project
- **Interactive**: Live engagement makes events more fun

---

## 📊 SUCCESS CRITERIA

### We'll know we succeeded when:
1. ✅ Harvard Poops team uses the admin dashboard to create/edit events (no code editing)
2. ✅ Students visit harvardpoops.com before going out to see what's happening
3. ✅ Site loads quickly and looks good on phones (mobile-first)
4. ✅ At least one live interactive event runs successfully with QR codes
5. ✅ Partner events appear alongside official HP events with clear distinction
6. ✅ Site stays up during peak usage (Friday/Saturday 8pm-1am)

### We'll know we failed if:
- ❌ Organizers still need to edit code to add events
- ❌ Site crashes when 50+ students access it simultaneously
- ❌ Students can't read event info on their phones
- ❌ Live voting doesn't update in real-time
- ❌ Partner submission process is too complicated to use

---

## 🏗️ FEATURE SPECIFICATION

### GOOD OUTCOME (MVP - Must Ship)

**What:** A reliable harvardpoops.com site focused on events hosted by Harvard Poops.

**Features:**
- ✅ Homepage with chronological feed of upcoming events
- ✅ Event cards showing: title, date, time, location, description
- ✅ Individual event pages (`/events/:id`) with full details
- ✅ About page explaining HP and how events work
- ✅ Rules/Community Guidelines page
- ✅ Consistent navigation across all pages
- ✅ Data-driven: events stored in database/structured data, not hardcoded
- ✅ Responsive layout (readable on phones and laptops)

**Technical Requirements:**
- Events stored in database (SQLite/PostgreSQL/Supabase)
- RESTful API exposing event data
- Basic routing (home, events list, single event, about, rules)
- Mobile-responsive CSS (mobile-first approach)

**Success Metric:** Students can visit the site and see what events are happening.

---

### BETTER OUTCOME (Target for CS50)

**What:** Harvard Poops becomes a tool the team actively uses to run events.

**Additional Features:**
- ✅ **Admin Dashboard** - Password-protected area (`/admin`)
  - Create events via forms (no code editing)
  - Edit existing events
  - Publish/unpublish events
  - Archive old events
  - Manage event tags and categories

- ✅ **Event Organization**
  - Auto-sort into "Upcoming" and "Past" sections
  - Event types: party, contest, tailgate, etc.
  - Simple tagging system

- ✅ **Filtering & Navigation**
  - Filter by tag (party, contest, tailgate)
  - Filter by date range
  - Quick navigation to relevant events

- ✅ **Polished Design**
  - Consistent branding (colors, logo, typography)
  - Visual identity that feels like a real brand
  - Carefully tested on different screen sizes
  - Professional look and feel

**Technical Requirements:**
- Session-based or JWT authentication for admin
- CRUD API endpoints for events
- Form validation (frontend + backend)
- Admin-only route protection middleware
- Date/time handling for auto-sorting
- CSS framework or custom design system

**Success Metric:** HP team creates and manages events through the dashboard without asking for code help.

---

### BEST OUTCOME (Full Vision)

**What:** harvardpoops.com feels like THE social calendar for Harvard - official HP events + partner events + live interactions.

**Additional Features:**
- ✅ **Two-Track Event System**
  - Track 1: "Harvard Poops Official" (fully HP-hosted)
  - Track 2: "Curated Campus Events" (from partners)
  - Tabbed interface or filter to switch views
  - Clear visual distinction between tracks

- ✅ **Partner Submission System**
  - Public form at `/submit-event` for partners to propose events
  - Required fields: contact name, email, event title, description, proposed date
  - Submissions appear in admin review queue
  - Admin can approve (creates event), edit, or reject
  - Email notifications (optional but nice)

- ✅ **Live Interactive Features** 🔥
  - Real-time voting/polling system
  - Examples: "Vote for next song", "Best costume contest", "Where should we go next?"
  - Event pages show if event has live interaction
  - QR code generation for each interactive event
  - Dedicated interaction page (`/events/:id/live`)
  - Results update in real-time as people vote
  - Display-friendly view for showing on screens at parties

- ✅ **Production-Ready Deployment**
  - Custom domain: harvardpoops.com
  - SSL certificate (HTTPS)
  - Can handle concurrent users (50-100+)
  - Basic monitoring/error tracking
  - Stable hosting (not crashing at 11pm on Saturday)

**Technical Requirements:**
- WebSocket server (Socket.io) OR Supabase Realtime for live updates
- QR code generation library
- Two database schemas: events + partner_submissions
- Status workflow for partner submissions (pending → approved/rejected)
- Admin interface for partner queue
- Scalable hosting (Railway, Render, Fly.io, or similar)
- Load testing before launch
- Environment-specific configs (dev vs. production)

**Success Metric:** Students use harvardpoops.com as their primary source for "what's happening tonight", and partners actively submit events for curation.

---

## 🛠️ TECHNICAL ARCHITECTURE

### Recommended Tech Stack

```
Frontend:  React (TypeScript optional) OR Vanilla JS + Vite
Backend:   Python + Flask (familiar from CS50)
Database:  Supabase (PostgreSQL + Realtime built-in) ⭐ RECOMMENDED
           Alternative: PostgreSQL or SQLite
Auth:      Flask-Login OR Supabase Auth
Realtime:  Supabase Realtime OR Socket.io
Hosting:
  - Frontend: Vercel or Netlify (free tier)
  - Backend: Railway or Render (free tier)
  - Database: Supabase (free tier)
Domain:    harvardpoops.com (purchase & configure DNS)
```

**Why Supabase?**
- PostgreSQL database (production-grade)
- Real-time subscriptions built-in (perfect for live voting)
- Auto-generated REST API
- Built-in authentication
- Free tier is generous
- Dashboard for viewing data

**Alternative (Simpler Stack for MVP):**
```
Frontend:  Vanilla JS + HTML + CSS
Backend:   Flask + SQLite
Auth:      Flask-Login with session cookies
Realtime:  Polling (fetch every 2 seconds) for MVP, Socket.io for Better/Best
Hosting:   PythonAnywhere or Heroku (simple deployment)
```

---

### Project Structure

```
harvard-poops/
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── assets/
│   │   │   ├── logo.png
│   │   │   └── qr-codes/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/
│   │   │   ├── EventCard.jsx           # Reusable event card
│   │   │   ├── EventDetail.jsx         # Single event view
│   │   │   ├── LiveVoting.jsx          # Real-time voting UI
│   │   │   ├── Navigation.jsx          # Header/nav bar
│   │   │   ├── Footer.jsx
│   │   │   └── AdminEventForm.jsx      # Create/edit events
│   │   ├── pages/
│   │   │   ├── Home.jsx                # Homepage feed
│   │   │   ├── EventPage.jsx           # Individual event
│   │   │   ├── EventsListing.jsx       # All events view
│   │   │   ├── LiveInteraction.jsx     # /events/:id/live
│   │   │   ├── AdminDashboard.jsx      # Admin home
│   │   │   ├── AdminLogin.jsx          # Login page
│   │   │   ├── PartnerSubmit.jsx       # Partner form
│   │   │   ├── About.jsx
│   │   │   └── Rules.jsx
│   │   ├── utils/
│   │   │   ├── api.js                  # API calls
│   │   │   ├── auth.js                 # Auth helpers
│   │   │   ├── dateUtils.js            # Date formatting
│   │   │   └── realtime.js             # WebSocket/Realtime logic
│   │   ├── styles/
│   │   │   ├── global.css
│   │   │   ├── components/
│   │   │   └── variables.css           # Design tokens
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── .env.local                      # Frontend env vars
│
├── backend/
│   ├── app.py                          # Main Flask app
│   ├── config.py                       # Configuration
│   ├── models.py                       # Database models (if using ORM)
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── events.py                   # Event CRUD endpoints
│   │   ├── admin.py                    # Admin auth & dashboard
│   │   ├── voting.py                   # Live voting endpoints
│   │   └── partners.py                 # Partner submissions
│   ├── middleware/
│   │   ├── auth.py                     # Auth middleware
│   │   └── validators.py               # Input validation
│   ├── utils/
│   │   ├── qr_generator.py             # QR code creation
│   │   └── email.py                    # Email notifications (optional)
│   ├── tests/
│   │   ├── test_events.py
│   │   ├── test_admin.py
│   │   └── test_voting.py
│   ├── requirements.txt
│   └── .env                            # Backend env vars (NEVER COMMIT)
│
├── database/
│   ├── schema.sql                      # Database schema
│   ├── migrations/                     # Migration scripts
│   └── seed_data.sql                   # Sample data for testing
│
├── docs/
│   ├── API.md                          # API documentation
│   ├── SETUP.md                        # Setup instructions
│   ├── DEPLOYMENT.md                   # Deployment guide
│   └── FEATURES.md                     # Feature specifications
│
├── .gitignore
├── README.md
├── CLAUDE.md                           # This file!
└── docker-compose.yml                  # Optional: local dev environment
```

---

### Database Schema

```sql
-- ============================================
-- EVENTS TABLE (Core Data)
-- ============================================
CREATE TABLE events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    -- Basic Info
    title TEXT NOT NULL,
    description TEXT,
    short_description TEXT,              -- For event cards (140 chars)

    -- Date & Location
    event_datetime DATETIME NOT NULL,    -- When the event happens
    location TEXT,

    -- Categorization
    event_type TEXT DEFAULT 'party',     -- 'party', 'contest', 'tailgate', 'mixer', 'other'
    track TEXT DEFAULT 'official',       -- 'official' (HP) or 'partner' (curated)
    tags TEXT,                           -- Comma-separated: 'party,music,18+'

    -- Status & Publishing
    status TEXT DEFAULT 'draft',         -- 'draft', 'published', 'archived'
    is_featured BOOLEAN DEFAULT FALSE,   -- Pin to top of feed

    -- Additional Content
    rsvp_link TEXT,
    playlist_link TEXT,
    chat_link TEXT,                      -- Pre-party chat link
    dress_code TEXT,
    what_to_bring TEXT,

    -- Interactive Features
    has_live_voting BOOLEAN DEFAULT FALSE,
    qr_code_url TEXT,                    -- URL to generated QR code image

    -- Partner Info (if track = 'partner')
    partner_name TEXT,
    partner_contact TEXT,

    -- Metadata
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,                  -- Admin user ID

    -- Image/Media (optional)
    image_url TEXT,
    thumbnail_url TEXT
);

-- Index for fast queries
CREATE INDEX idx_events_datetime ON events(event_datetime);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_track ON events(track);


-- ============================================
-- VOTING SESSIONS (Live Interactive Features)
-- ============================================
CREATE TABLE voting_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL,

    -- Voting Details
    question TEXT NOT NULL,              -- "What song should we play next?"
    voting_type TEXT DEFAULT 'poll',     -- 'poll', 'contest', 'rating'

    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_live BOOLEAN DEFAULT FALSE,       -- Currently happening (show on screen)

    -- Settings
    allow_multiple_votes BOOLEAN DEFAULT FALSE,
    show_results_before_close BOOLEAN DEFAULT TRUE,
    max_votes_per_user INTEGER DEFAULT 1,

    -- Timing
    opens_at DATETIME,
    closes_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE INDEX idx_voting_event ON voting_sessions(event_id);


-- ============================================
-- VOTING OPTIONS (Choices for Each Session)
-- ============================================
CREATE TABLE voting_options (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,

    option_text TEXT NOT NULL,
    option_order INTEGER DEFAULT 0,      -- Display order
    vote_count INTEGER DEFAULT 0,

    -- Optional metadata
    image_url TEXT,
    description TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (session_id) REFERENCES voting_sessions(id) ON DELETE CASCADE
);

CREATE INDEX idx_voting_options_session ON voting_options(session_id);


-- ============================================
-- VOTES (Track Individual Votes)
-- ============================================
-- Optional: track votes for analytics or preventing duplicate votes
CREATE TABLE votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    option_id INTEGER NOT NULL,

    -- Voter identification (anonymous or session-based)
    voter_identifier TEXT,               -- IP hash or session ID

    voted_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (session_id) REFERENCES voting_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (option_id) REFERENCES voting_options(id) ON DELETE CASCADE
);

CREATE INDEX idx_votes_session ON votes(session_id);
CREATE INDEX idx_votes_voter ON votes(voter_identifier);


-- ============================================
-- PARTNER SUBMISSIONS (Event Proposals)
-- ============================================
CREATE TABLE partner_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    -- Contact Info
    contact_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    organization TEXT,                   -- Club/group name

    -- Proposed Event
    event_title TEXT NOT NULL,
    event_description TEXT NOT NULL,
    proposed_datetime DATETIME,
    proposed_location TEXT,
    expected_attendance INTEGER,

    -- Additional Details
    event_type TEXT,                     -- Their suggested type
    notes TEXT,                          -- Any additional info

    -- Review Status
    status TEXT DEFAULT 'pending',       -- 'pending', 'approved', 'rejected', 'needs_revision'
    reviewed_by INTEGER,                 -- Admin user ID
    reviewed_at DATETIME,
    review_notes TEXT,                   -- Admin feedback

    -- If approved, link to created event
    approved_event_id INTEGER,

    -- Metadata
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (approved_event_id) REFERENCES events(id),
    FOREIGN KEY (reviewed_by) REFERENCES admins(id)
);

CREATE INDEX idx_partner_submissions_status ON partner_submissions(status);


-- ============================================
-- ADMIN USERS (Organizers)
-- ============================================
CREATE TABLE admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,         -- NEVER store plain text passwords

    -- Permissions (optional: simple role system)
    role TEXT DEFAULT 'admin',           -- 'admin', 'moderator', 'viewer'
    is_active BOOLEAN DEFAULT TRUE,

    -- Metadata
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
);


-- ============================================
-- ACTIVITY LOG (Optional: Audit Trail)
-- ============================================
CREATE TABLE activity_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    admin_id INTEGER,
    action TEXT NOT NULL,                -- 'created_event', 'edited_event', 'approved_partner'
    resource_type TEXT,                  -- 'event', 'partner_submission', 'voting_session'
    resource_id INTEGER,

    details TEXT,                        -- JSON with additional info
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (admin_id) REFERENCES admins(id)
);

CREATE INDEX idx_activity_log_admin ON activity_log(admin_id);
CREATE INDEX idx_activity_log_timestamp ON activity_log(timestamp);
```

---

### API Endpoints

```
PUBLIC ENDPOINTS (No Auth Required)
====================================

GET  /api/events
     Query params: ?status=published&track=official&limit=20&offset=0
     Returns: List of events (upcoming first)

GET  /api/events/:id
     Returns: Single event details

GET  /api/events/upcoming
     Returns: Only future events

GET  /api/events/past
     Returns: Only past events

POST /api/partners/submit
     Body: { contact_name, contact_email, event_title, ... }
     Returns: Submission confirmation

GET  /api/voting/:sessionId
     Returns: Voting session data + options + current results

POST /api/votes
     Body: { session_id, option_id, voter_identifier }
     Returns: Updated vote counts (real-time)


ADMIN ENDPOINTS (Auth Required)
====================================

POST /api/admin/login
     Body: { username, password }
     Returns: Session token or JWT

POST /api/admin/logout
     Clears session

GET  /api/admin/events
     Returns: All events (including drafts)

POST /api/admin/events
     Body: { title, description, event_datetime, ... }
     Returns: Created event

PUT  /api/admin/events/:id
     Body: { ...updated fields }
     Returns: Updated event

DELETE /api/admin/events/:id
     Soft delete (set status to 'archived')

PATCH /api/admin/events/:id/publish
     Sets status to 'published'

PATCH /api/admin/events/:id/unpublish
     Sets status to 'draft'

GET  /api/admin/partners
     Query: ?status=pending
     Returns: Partner submissions

PATCH /api/admin/partners/:id/approve
     Creates event from submission

PATCH /api/admin/partners/:id/reject
     Body: { review_notes }

POST /api/admin/voting-sessions
     Body: { event_id, question, options: [...] }
     Returns: Created voting session

PATCH /api/admin/voting-sessions/:id/activate
     Starts live voting

PATCH /api/admin/voting-sessions/:id/close
     Ends voting
```

---

## 🎨 DESIGN PRINCIPLES

### Mobile-First Approach

**Rule:** Design for phones FIRST, then enhance for tablets and desktops.

**Why:** Most Harvard students will check the site on their phones while out or deciding where to go.

**Implementation:**
```css
/* Default: Mobile (< 768px) */
.event-card {
    width: 100%;
    padding: 16px;
    font-size: 16px;
}

/* Tablet (768px - 1024px) */
@media (min-width: 768px) {
    .event-card {
        width: 48%;
        display: inline-block;
    }
}

/* Desktop (> 1024px) */
@media (min-width: 1024px) {
    .event-card {
        width: 32%;
    }
    .event-feed {
        max-width: 1200px;
        margin: 0 auto;
    }
}
```

**Key Mobile Considerations:**
- Touch targets at least 44x44px (Apple guidelines)
- Font size minimum 16px (prevents iOS zoom)
- Easy thumb reach for primary actions
- Fast loading (< 3 seconds on 4G)
- Minimal typing required (use selects/buttons over text inputs)

---

### Visual Identity

**Brand Attributes:** Fun, reliable, collegiate, energetic, not too serious

**Color Palette (Suggested):**
```css
:root {
    /* Primary Colors */
    --hp-crimson: #A51C30;        /* Harvard crimson (main brand) */
    --hp-dark: #1A1A1A;            /* Dark text/backgrounds */
    --hp-light: #F8F9FA;           /* Light backgrounds */

    /* Accent Colors */
    --hp-gold: #FFD700;            /* Highlights/featured events */
    --hp-blue: #3B82F6;            /* Links/interactive elements */

    /* Semantic Colors */
    --success: #10B981;            /* Approved, published */
    --warning: #F59E0B;            /* Pending, draft */
    --error: #EF4444;              /* Rejected, errors */

    /* Neutrals */
    --gray-100: #F3F4F6;
    --gray-300: #D1D5DB;
    --gray-600: #4B5563;
    --gray-900: #111827;
}
```

**Typography:**
```css
/* Headings: Bold, impactful */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
font-weight: 700;

/* Body: Clean, readable */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
font-weight: 400;
line-height: 1.6;
```

**Component Design:**
- **Event Cards:** Photo (if available), title, date/time badge, location, short description
- **CTA Buttons:** Large, obvious, high contrast
- **Navigation:** Sticky header with logo + main links
- **Filters:** Pill-style tags (tap to filter)

---

### User Experience Guidelines

**Homepage:**
- Hero section: "What's happening at Harvard" + CTA to see events
- Upcoming events first (next 7 days featured)
- Clear visual distinction between Official and Partner events
- Filter bar: Official/Partner toggle + event type pills

**Event Page:**
- Hero image or solid color block with title
- Date/time/location prominently displayed
- Event type badge
- Full description with formatting
- "Add to Calendar" button (optional but nice)
- If live voting: big "Join Live" button with QR code

**Admin Dashboard:**
- Quick stats: "5 upcoming events, 3 pending partner submissions"
- "Create Event" button (primary action)
- Table of events with inline actions (Edit, Publish, Archive)
- Partner queue separate section

**Live Voting Page:**
- Clean, minimal design
- Question in large text
- Options as large tappable buttons
- Real-time results (bar chart or percentages)
- "X votes so far" counter updating live

---

## 🔒 SECURITY & BEST PRACTICES

### Authentication

**Never store plain text passwords:**
```python
from werkzeug.security import generate_password_hash, check_password_hash

# When creating admin user
password_hash = generate_password_hash(password, method='pbkdf2:sha256')

# When logging in
if check_password_hash(stored_hash, provided_password):
    # Login successful
```

**Session management:**
```python
from flask import session
import secrets

app.secret_key = secrets.token_hex(32)  # Store in .env

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    # ... validate credentials ...
    session['admin_id'] = admin.id
    session['admin_username'] = admin.username
    return jsonify({'success': True})

def require_admin(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'admin_id' not in session:
            return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return decorated_function

@app.route('/api/admin/events', methods=['POST'])
@require_admin
def create_event():
    # Only accessible if logged in
```

---

### Input Validation

**Backend validation (ALWAYS required):**
```python
from datetime import datetime

def validate_event_data(data):
    errors = []

    if not data.get('title') or len(data['title']) < 3:
        errors.append('Title must be at least 3 characters')

    if not data.get('event_datetime'):
        errors.append('Event date/time is required')
    else:
        try:
            datetime.fromisoformat(data['event_datetime'])
        except ValueError:
            errors.append('Invalid date/time format')

    if data.get('event_type') not in ['party', 'contest', 'tailgate', 'mixer', 'other']:
        errors.append('Invalid event type')

    return errors

@app.route('/api/admin/events', methods=['POST'])
@require_admin
def create_event():
    data = request.json
    errors = validate_event_data(data)

    if errors:
        return jsonify({'errors': errors}), 400

    # Proceed with creation
```

**SQL Injection Prevention:**
```python
# BAD (vulnerable to SQL injection):
cursor.execute(f"SELECT * FROM events WHERE id = {event_id}")

# GOOD (parameterized query):
cursor.execute("SELECT * FROM events WHERE id = ?", (event_id,))

# BETTER (using ORM like SQLAlchemy):
event = Event.query.filter_by(id=event_id).first()
```

---

### CORS Configuration

```python
from flask_cors import CORS

# Development (permissive)
CORS(app)

# Production (restrictive)
CORS(app, origins=[
    'https://harvardpoops.com',
    'https://www.harvardpoops.com'
])
```

---

### Environment Variables

**NEVER commit secrets to Git!**

**.env file (backend):**
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/harvardpoops
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key

# Security
SECRET_KEY=your-secret-key-here-use-secrets.token_hex-32
ADMIN_PASSWORD_SALT=another-random-string

# Email (optional)
SENDGRID_API_KEY=your-sendgrid-key

# Environment
FLASK_ENV=development  # or 'production'
```

**.gitignore:**
```
# Environment variables
.env
.env.local
.env.production

# Database
*.db
*.sqlite
*.sqlite3

# Python
__pycache__/
*.pyc
venv/
env/

# Node
node_modules/
dist/
build/

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
```

**Loading env vars:**
```python
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')
SECRET_KEY = os.getenv('SECRET_KEY')
```

---

### Rate Limiting (Optional but Recommended)

Prevent abuse of voting/submission endpoints:

```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

@app.route('/api/votes', methods=['POST'])
@limiter.limit("10 per minute")
def submit_vote():
    # Only allow 10 votes per minute per IP
```

---

## 🤝 TEAM COLLABORATION

### Division of Responsibilities

**Your Focus (Technical Implementation):**
- [ ] Backend API development (Flask routes, database queries)
- [ ] Database design and migrations
- [ ] Authentication system (admin login)
- [ ] Real-time voting logic (WebSockets or Supabase Realtime)
- [ ] API integration (connecting frontend to backend)
- [ ] Deployment and DevOps (hosting, domain, SSL)
- [ ] Performance optimization
- [ ] Security (input validation, SQL injection prevention)

**Armand's Focus (Design & UX):**
- [ ] UI/UX design in Figma (wireframes and mockups)
- [ ] Frontend styling (CSS, responsive design)
- [ ] User flow design (how students navigate the site)
- [ ] Content writing (About page, Rules, event descriptions)
- [ ] User testing coordination (testing with friends, gathering feedback)
- [ ] Visual branding (logo, colors, typography)
- [ ] QR code design and placement

**Shared Responsibilities:**
- [ ] Frontend React/JavaScript components (split by feature)
- [ ] Feature planning and prioritization
- [ ] Bug fixing and testing
- [ ] Documentation (README, setup guides)
- [ ] Weekly check-ins to sync progress

---

### Git Workflow

**Branch Strategy:**
```bash
main              # Production-ready code (protected)
├── develop       # Integration branch (all features merge here first)
    ├── feature/event-listing
    ├── feature/admin-dashboard
    ├── feature/live-voting
    └── feature/partner-submissions
```

**Workflow:**
```bash
# 1. Create feature branch
git checkout develop
git pull origin develop
git checkout -b feature/event-listing

# 2. Work and commit
git add .
git commit -m "Add event listing component with filtering"

# 3. Push to remote
git push origin feature/event-listing

# 4. Create Pull Request on GitHub
# - Request review from partner
# - Discuss changes in PR comments
# - Make revisions if needed

# 5. After approval, merge to develop
# (Do this on GitHub with "Squash and merge")

# 6. Delete feature branch
git branch -d feature/event-listing
git push origin --delete feature/event-listing

# 7. Before deploying, merge develop → main
git checkout main
git merge develop
git push origin main
```

**Commit Message Guidelines:**
```bash
# Good commit messages:
git commit -m "Add event filtering by date and type"
git commit -m "Fix mobile responsive layout on event cards"
git commit -m "Implement real-time vote count updates"

# Bad commit messages:
git commit -m "Update stuff"
git commit -m "Fix bug"
git commit -m "WIP"
```

**Before committing:**
```bash
# Check what's changed
git status
git diff

# Test your changes
pytest  # or your test command
npm run build  # ensure it builds

# Ensure you're not committing secrets
cat .env  # should be in .gitignore
```

---

### Code Review Checklist

**Before requesting review:**
- [ ] Code runs without errors
- [ ] Tested on mobile and desktop
- [ ] No console errors or warnings
- [ ] Follows project style (indentation, naming conventions)
- [ ] Added comments for complex logic
- [ ] Updated documentation if needed

**When reviewing partner's code:**
- [ ] Does it solve the problem?
- [ ] Is it readable and maintainable?
- [ ] Are there potential bugs or edge cases?
- [ ] Does it follow security best practices?
- [ ] Is it mobile-responsive?
- [ ] Provide constructive feedback, not just "looks good"

---

### Communication

**Daily Standup (async or quick call):**
- What did you work on yesterday?
- What are you working on today?
- Any blockers or questions?

**Weekly Planning:**
- Review progress on Good → Better → Best outcomes
- Prioritize features for next week
- Assign tasks based on strengths

**Tools:**
- **GitHub Issues:** Track bugs and feature requests
- **GitHub Projects:** Kanban board for task management
- **Figma:** Design collaboration and feedback
- **Google Docs:** Shared notes, meeting minutes

---

## 🚀 DEVELOPMENT WORKFLOW

### Phase 1: Foundation (Week 1)

**Goals:**
- [ ] Set up development environment
- [ ] Create project structure
- [ ] Design database schema
- [ ] Build basic Flask API
- [ ] Create static mockups in Figma

**Tasks:**
1. **Environment Setup**
   - Install Python, Node.js, VS Code
   - Set up virtual environment
   - Initialize Git repo (already done)
   - Create frontend and backend folders

2. **Database Design**
   - Write schema.sql with all tables
   - Create sample seed data
   - Set up Supabase project (or local PostgreSQL)
   - Test database connections

3. **Backend Skeleton**
   - Create Flask app structure
   - Set up routes (events, admin, partners, voting)
   - Implement basic CRUD for events
   - Test endpoints with Postman

4. **Frontend Structure**
   - Set up React app (or vanilla JS)
   - Create component structure
   - Build static HTML mockups
   - Implement routing

5. **Design**
   - Create Figma wireframes (Armand)
   - Define color palette and typography
   - Design event cards, event page, admin dashboard
   - Get feedback from 2-3 friends

**Success Criteria:** Can create an event via API and display it on frontend (even if ugly).

---

### Phase 2: Core Features (Week 2)

**Goals:**
- [ ] Implement event listing and detail pages
- [ ] Build admin dashboard
- [ ] Add authentication
- [ ] Make site responsive

**Tasks:**
1. **Public Event Pages**
   - Homepage with event feed
   - Filter by upcoming/past
   - Individual event detail pages
   - About and Rules pages

2. **Admin Dashboard**
   - Login page
   - Protected admin routes (backend middleware)
   - Create event form
   - Edit event form
   - Publish/unpublish/archive actions
   - List view of all events

3. **Styling & Responsive Design**
   - Apply color palette and typography
   - Mobile-first CSS
   - Test on iPhone, Android, laptop
   - Fix layout issues

4. **Data Integration**
   - Connect frontend to backend API
   - Handle loading states
   - Display errors gracefully
   - Validate forms (frontend + backend)

**Success Criteria:** HP team can create and manage events through admin dashboard without touching code.

---

### Phase 3: Polish & Enhancement (Week 3)

**Goals:**
- [ ] Add event categorization and filtering
- [ ] Build partner submission system
- [ ] Improve design and user experience
- [ ] Test with real users

**Tasks:**
1. **Event Organization**
   - Add event types and tags
   - Filter by type (party, contest, tailgate)
   - Filter by track (Official vs Partner)
   - Sort by date, featured status

2. **Partner Submissions**
   - Public submission form (`/submit-event`)
   - Form validation
   - Save to partner_submissions table
   - Admin review queue in dashboard
   - Approve/reject workflow

3. **Design Polish**
   - Refine color palette and spacing
   - Add hover states and transitions
   - Improve typography hierarchy
   - Add loading spinners
   - Consistent button styles

4. **User Testing**
   - Test with 5-10 Harvard students
   - Gather feedback on usability
   - Fix confusing UI elements
   - Improve mobile experience

**Success Criteria:** Students and partners can easily navigate the site and understand what's happening.

---

### Phase 4: Live Features & Deployment (Week 4)

**Goals:**
- [ ] Implement real-time voting
- [ ] Generate QR codes
- [ ] Deploy to production
- [ ] Final testing and polish

**Tasks:**
1. **Live Voting System**
   - Create voting_sessions and voting_options tables
   - Build admin interface to create polls
   - Build voting UI for students (`/events/:id/live`)
   - Implement real-time updates (Socket.io or Supabase Realtime)
   - Test with 10+ people voting simultaneously

2. **QR Code Generation**
   - Install QR code library (`qrcode` Python package)
   - Generate QR codes for interactive events
   - Store QR code images
   - Display on event pages
   - Test scanning with phones

3. **Deployment**
   - Set up production database (Supabase)
   - Deploy backend (Railway/Render)
   - Deploy frontend (Vercel/Netlify)
   - Configure custom domain (harvardpoops.com)
   - Set up SSL certificate (HTTPS)
   - Configure environment variables

4. **Final Testing**
   - Load testing (simulate 50-100 concurrent users)
   - Test all features in production
   - Fix any deployment issues
   - Monitor for errors

5. **Launch Prep**
   - Create sample events
   - Write About and Rules content
   - Test with 20+ students
   - Gather final feedback

**Success Criteria:** harvardpoops.com is live, stable, and ready for Friday night traffic.

---

## 📝 CODE STANDARDS

### Python (Backend)

**Formatting:**
```python
# Use Black formatter
black app.py

# Or configure in VS Code:
# settings.json → "python.formatting.provider": "black"
```

**Naming Conventions:**
```python
# Variables and functions: snake_case
event_title = "Harvard Poops Party"
def get_upcoming_events():
    pass

# Classes: PascalCase
class EventManager:
    pass

# Constants: UPPER_SNAKE_CASE
MAX_EVENTS_PER_PAGE = 20
DATABASE_URL = os.getenv('DATABASE_URL')
```

**Imports:**
```python
# Standard library first
import os
from datetime import datetime

# Third-party packages
from flask import Flask, request, jsonify
from flask_cors import CORS

# Local imports
from models import Event
from utils.auth import require_admin
```

**Docstrings:**
```python
def create_event(title, description, event_datetime, location):
    """
    Create a new event in the database.

    Args:
        title (str): Event title (3-100 chars)
        description (str): Full event description
        event_datetime (datetime): When the event happens
        location (str): Event location

    Returns:
        dict: Created event data with id

    Raises:
        ValueError: If required fields are missing
    """
    pass
```

---

### JavaScript (Frontend)

**Formatting:**
```javascript
// Use Prettier (2 spaces, single quotes)
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

**Naming Conventions:**
```javascript
// Variables and functions: camelCase
const eventTitle = 'Harvard Poops Party';
function getUpcomingEvents() {}

// React components: PascalCase
function EventCard() {}
function AdminDashboard() {}

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.harvardpoops.com';
const MAX_EVENTS = 20;
```

**React Component Structure:**
```javascript
// Functional components with hooks
import React, { useState, useEffect } from 'react';
import { fetchEvents } from '../utils/api';

function EventsListing() {
  // State
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Effects
  useEffect(() => {
    loadEvents();
  }, []);

  // Functions
  const loadEvents = async () => {
    try {
      const data = await fetchEvents();
      setEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Render
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="events-listing">
      {events.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

export default EventsListing;
```

---

### CSS

**Organization:**
```css
/* Use CSS custom properties (variables) */
:root {
  --color-primary: #A51C30;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
}

/* Mobile-first media queries */
.event-card {
  width: 100%;
  padding: var(--spacing-md);
}

@media (min-width: 768px) {
  .event-card {
    width: 48%;
  }
}

/* BEM naming (optional but helpful) */
.event-card { }
.event-card__title { }
.event-card__date { }
.event-card--featured { }
```

---

## 🧪 TESTING STRATEGY

### Manual Testing Checklist

**Before each deploy:**
- [ ] Create event via admin dashboard
- [ ] View event on homepage
- [ ] Click into event detail page
- [ ] Filter events by type
- [ ] Submit partner event form
- [ ] Approve partner event (admin)
- [ ] Test live voting (if implemented)
- [ ] Scan QR code on phone
- [ ] Test on Chrome, Safari, Firefox
- [ ] Test on iPhone and Android
- [ ] Test at different screen sizes (responsive)
- [ ] Check all links work
- [ ] Verify images load correctly

### Automated Tests (Optional but Recommended)

**Backend tests (pytest):**
```python
# tests/test_events.py
def test_create_event(client):
    response = client.post('/api/admin/events', json={
        'title': 'Test Party',
        'description': 'Test description',
        'event_datetime': '2025-11-25T20:00:00',
        'location': 'Test Location'
    })
    assert response.status_code == 201
    assert 'id' in response.json

def test_get_events(client):
    response = client.get('/api/events')
    assert response.status_code == 200
    assert isinstance(response.json, list)
```

**Frontend tests (Jest + React Testing Library):**
```javascript
// EventCard.test.js
import { render, screen } from '@testing-library/react';
import EventCard from './EventCard';

test('renders event title', () => {
  const event = {
    id: 1,
    title: 'Test Party',
    event_datetime: '2025-11-25T20:00:00',
    location: 'Test Location'
  };

  render(<EventCard event={event} />);
  expect(screen.getByText('Test Party')).toBeInTheDocument();
});
```

---

## 📊 PERFORMANCE & MONITORING

### Performance Targets

- **Page Load:** < 3 seconds on 4G
- **API Response:** < 500ms for most endpoints
- **Real-time Updates:** < 1 second latency for voting
- **Concurrent Users:** 50-100 without degradation

### Optimization Strategies

**Frontend:**
- Lazy load images (use `loading="lazy"`)
- Code splitting (load admin dashboard separately)
- Minify CSS and JavaScript
- Use CDN for static assets

**Backend:**
- Database indexes on frequently queried columns
- Caching for event listings (Redis optional)
- Pagination (limit 20 events per page)
- Connection pooling

**Database:**
```sql
-- Add indexes for performance
CREATE INDEX idx_events_datetime ON events(event_datetime);
CREATE INDEX idx_events_status ON events(status);
```

### Monitoring (Production)

**Tools:**
- **Sentry:** Error tracking (free tier)
- **Uptime Robot:** Monitor if site is down (free)
- **Google Analytics:** User behavior (optional)

**What to monitor:**
- Server errors (5xx responses)
- Failed API calls
- Average page load time
- Real-time voting lag

---

## 🚢 DEPLOYMENT GUIDE

### Pre-Deployment Checklist

- [ ] All features tested locally
- [ ] Environment variables documented
- [ ] Database schema finalized
- [ ] Seed data prepared (sample events)
- [ ] .gitignore configured (no secrets committed)
- [ ] README.md written
- [ ] Domain purchased (harvardpoops.com)

### Recommended Hosting

**Option 1: Simple Stack (Recommended for CS50)**
```
Frontend:  Netlify (free tier)
Backend:   Railway (free tier)
Database:  Supabase (free tier)
Domain:    Namecheap or Google Domains
```

**Option 2: All-in-One**
```
Full Stack: Vercel (frontend) + Supabase (backend + DB)
```

### Deployment Steps

**1. Deploy Database (Supabase)**
```bash
# Create project at supabase.com
# Run schema.sql in SQL editor
# Copy connection URL and anon key
```

**2. Deploy Backend (Railway)**
```bash
# Create account at railway.app
# Connect GitHub repo
# Set environment variables:
#   DATABASE_URL, SECRET_KEY, etc.
# Railway auto-deploys on git push
```

**3. Deploy Frontend (Netlify)**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build frontend
npm run build

# Deploy
netlify deploy --prod

# Or connect GitHub repo for auto-deploy
```

**4. Configure Domain**
```bash
# In domain registrar (Namecheap):
# Add A record: @ → Railway IP
# Add CNAME: www → Railway domain

# In Netlify:
# Add custom domain: harvardpoops.com
# Enable HTTPS (auto via Let's Encrypt)
```

**5. Post-Deployment**
```bash
# Test production site
# Create sample events
# Monitor for errors
# Share with team for testing
```

---

## 📚 RESOURCES

### Documentation
- **Flask:** https://flask.palletsprojects.com/
- **React:** https://react.dev/
- **Supabase:** https://supabase.com/docs
- **Socket.io:** https://socket.io/docs/

### Tutorials
- **CS50 Web:** https://cs50.harvard.edu/web/
- **Flask Mega-Tutorial:** https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world
- **React Docs:** https://react.dev/learn

### Tools
- **Figma:** https://figma.com (design)
- **Postman:** https://postman.com (API testing)
- **TablePlus:** https://tableplus.com (database GUI)

---

## 🎓 KEY TAKEAWAYS FOR CS50 SUBMISSION

### What Makes This Project Strong

1. **Real User Need:** Solves actual problem for Harvard students
2. **Full Stack:** Frontend + Backend + Database (meets CS50 complexity requirement)
3. **Novel Feature:** Real-time voting with QR codes (distinctive functionality)
4. **Production Deployment:** Actually deployed and usable
5. **Thoughtful Design:** Mobile-first, responsive, user-tested

### CS50 Final Project Requirements

✅ **Satisfies CS50 requirements:**
- More complex than previous problem sets
- Uses Python (Flask backend) + JavaScript (frontend)
- Database-driven (SQLite/PostgreSQL)
- Demonstrates understanding of web development
- Includes admin authentication
- Real-time features (WebSockets or Realtime)

### README.md for Submission

Include in your README:
- **Project title and description**
- **Video demo (required for CS50)**
- **Features list (Good, Better, Best)**
- **Tech stack**
- **Setup instructions**
- **Screenshots**
- **What you learned**
- **Future improvements**

---

## ✅ DEFINITION OF DONE

### For Each Feature

A feature is "done" when:
- [ ] Code is written and tested
- [ ] Works on mobile and desktop
- [ ] Integrated with backend API
- [ ] Error handling implemented
- [ ] Code reviewed by partner
- [ ] Deployed to staging/production
- [ ] Tested by at least 2 users
- [ ] Documentation updated

### For MVP (Good Outcome)

- [ ] harvardpoops.com is live
- [ ] Events display chronologically
- [ ] Individual event pages work
- [ ] About and Rules pages exist
- [ ] Site is responsive (mobile + desktop)
- [ ] Can handle 20+ concurrent users

### For Target (Better Outcome)

- [ ] Admin can create/edit events via dashboard
- [ ] Events auto-sort by date
- [ ] Filtering by type works
- [ ] Design is polished and consistent
- [ ] HP team actually uses it to manage events

### For Best (Full Vision)

- [ ] Official and Partner tracks work
- [ ] Partner submission + approval flow works
- [ ] Live voting updates in real-time
- [ ] QR codes work at events
- [ ] Site handles 100+ concurrent users
- [ ] Students use it as primary event source

---

## 🙋 QUESTIONS TO ASK YOURSELF

Throughout development, regularly check:

1. **Is this feature helping students find events faster?**
2. **Would the HP team actually use this admin interface?**
3. **Does this work well on a phone?**
4. **Is this secure? (Could someone hack the voting or admin?)**
5. **Will this scale to 100+ students at a party?**
6. **Is the code readable if we come back in 3 months?**
7. **Are we building the right thing, or just the thing we know how to build?**

---

## 🎉 FINAL THOUGHTS

**This is an ambitious project, but totally achievable.**

- **Good Outcome** is realistic in 3-4 weeks
- **Better Outcome** is your target for CS50 submission
- **Best Outcome** is stretch but possible with good execution

**Focus on:**
- Mobile-first design
- Reliability over fancy features
- User testing early and often
- Shipping something real students will use

**Remember:**
- Real products are never "done" - ship MVP, then iterate
- Done is better than perfect
- Test with real users early
- Keep it simple until it needs to be complex

**You got this! Build something Harvard students will actually use.** 🚀

---

**Last Updated:** November 20, 2025
**Next Review:** After Week 1 (update with any architecture changes)
