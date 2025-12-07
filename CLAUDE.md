# Claude Code Workflow & Technical Documentation

---

## Documentation Philosophy

This project uses three documentation files to maintain context and prevent errors:
- **SPECIFICATIONS.md** - Product vision, user goals, feature roadmap
- **ARCHITECTURE.md** - Technical implementation, database schema, design decisions
- **CLAUDE.md** (this file) - Workflow guidance and best practices

---

## Pre-Implementation Guidance

When working on features that touch core systems, it's helpful to check the documentation first to ensure consistency with existing patterns.

### Quick Reference: When to Check Docs

**Consider reading ARCHITECTURE.md if the task involves:**
- Database schema (tables, columns, relationships)
- Authentication or authorization logic
- Real-time features (Supabase subscriptions)
- External API integrations
- Major architectural decisions

**Consider reading SPECIFICATIONS.md if the task involves:**
- New features or changes to existing features
- User roles and permissions (Students, Hosts, Admins)
- Interactive capabilities (voting, RSVP, chat, QR codes)
- Event types or categorization

### Helpful Workflow Pattern

For significant features, this pattern helps prevent misalignment:

1. **Understand the request** - Clarify what the user wants
2. **Check existing architecture** - Read relevant doc sections if needed
3. **Propose approach** - Share your understanding and planned changes
4. **Get feedback** - Confirm the approach aligns before implementation
5. **Implement** - Build the feature
6. **Update docs** - Reflect changes in SPECIFICATIONS.md or ARCHITECTURE.md

**Example:**
```
User: "Add live voting to events"

Claude: "I see we have a `votes` table in ARCHITECTURE.md with columns for
event_id, option_id, voter_identifier. I'll create a VotingWidget component
that uses Supabase Realtime for live updates. Sound good?"

User: "Yes, go ahead"

Claude: *implements feature, then updates SPECIFICATIONS.md to mark voting as completed*
```

This conversational approach prevents building the wrong thing while staying flexible.

---

## Documentation Updates

### When to Update SPECIFICATIONS.md

If you've completed work that affects these areas, please update SPECIFICATIONS.md:
- **Feature status changes** - Move items from Planned → In Progress → Completed
- **New features** - Add to Current Status if not in original roadmap
- **User capabilities** - Changes to what Students/Hosts/Admins can do
- **Interactive features** - Adding/modifying voting, RSVP, chat, QR codes, playlists
- **Event types** - New tags or categorization options

**Don't forget to update the "Last Updated" timestamp at the bottom!**

### When to Update ARCHITECTURE.md

If you've made changes in these areas, please update ARCHITECTURE.md:
- **Database schema** - New tables, columns, or schema modifications
- **Tech stack** - New dependencies or libraries added
- **Authentication** - Changes to auth strategy or RLS policies
- **API integrations** - New external APIs (Spotify, etc.)
- **Deployment** - Changes to build/deploy process
- **State management** - Switching or adding state management approach

---

## Avoiding Common Pitfalls

### Database Schema
The `votes`, `events`, `rsvps`, and `chat_messages` tables are already defined in ARCHITECTURE.md. When implementing features that need data storage, check if the table already exists before creating a new one.

If you're unsure whether something exists in Supabase, it's fine to ask: "Should I create this table, or does it already exist?"

### Authentication Strategy
ARCHITECTURE.md documents two auth options: referral codes (simpler) or Supabase Auth (more robust). When implementing auth features, check which approach is currently in use.

### Real-Time Features
ARCHITECTURE.md includes code examples for Supabase Realtime subscriptions. Following these patterns ensures consistency across voting, chat, and other real-time features.

### Project Structure
ARCHITECTURE.md shows the recommended folder structure (components/, pages/, hooks/, lib/). When creating new files, following this structure keeps things organized.

---

## Context Efficiency

**To minimize token usage while staying accurate:**
- Read specific sections of docs (not entire files) when you need clarification
- Cache architectural decisions mentally within a conversation
- Ask the user if you're unsure whether docs are up-to-date
- Skip re-reading docs for small CSS changes or minor bug fixes

**Good times to reference docs:**
- Starting a new conversation (quick skim to refresh context)
- Implementing features that touch database or auth
- Making architectural decisions
- When user mentions something unfamiliar

---

## Project Structure

### Current Tech Stack
- **Frontend**: React + Vite
- **Backend/Database**: Supabase (PostgreSQL)
- **Deployment**: Railway
- **Domain**: harvardpoops.com

### Folder Organization
```
cs50final/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable React components
│   ├── pages/           # Page-level components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities (supabase.js, utils.js)
│   ├── styles/          # CSS files
│   ├── App.jsx          # Root component with routing
│   └── main.jsx         # Entry point
├── ARCHITECTURE.md      # Technical documentation
├── SPECIFICATIONS.md    # Product specifications
└── CLAUDE.md            # This file
```

---

## Helpful Reminders

- **Read before you code**: Checking ARCHITECTURE.md prevents creating duplicate tables or misaligned patterns
- **Communicate your plan**: Sharing your approach before implementation catches misunderstandings early
- **Ask when uncertain**: Better to ask 3 quick questions than build the wrong thing
- **Update docs after changes**: Keeps documentation aligned with actual implementation

---

*Last Updated*: 2025-12-06
