-- Harvard Poops Database Schema (Simplified for Hackathon)

CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    event_datetime TEXT NOT NULL,
    location TEXT,
    event_type TEXT DEFAULT 'party',
    track TEXT DEFAULT 'official',
    status TEXT DEFAULT 'published',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS voting_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL,
    question TEXT NOT NULL,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id)
);

CREATE TABLE IF NOT EXISTS voting_options (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    option_text TEXT NOT NULL,
    option_order INTEGER DEFAULT 0,
    vote_count INTEGER DEFAULT 0,
    FOREIGN KEY (session_id) REFERENCES voting_sessions(id)
);

-- Seed data for demo
INSERT INTO events (title, description, event_datetime, location, event_type, track, status) VALUES
('Harvard-Yale Tailgate 2024', 'The biggest tailgate of the year! Join us before The Game for food, music, and Harvard spirit. Bring your crimson gear!', '2024-11-23 11:00:00', 'Harvard Stadium Parking Lot', 'tailgate', 'official', 'published'),
('Friday Night Party', 'End of week celebration with DJ, drinks, and dancing. 21+ only. Dress code: casual chic.', '2024-11-22 22:00:00', 'The Queens Head Pub', 'party', 'official', 'published'),
('Halloween Costume Contest', 'Show off your creativity! Top 3 costumes win prizes. Live voting at the event.', '2024-10-31 20:00:00', 'Memorial Hall', 'contest', 'official', 'published'),
('CS50 Final Project Fair', 'Showcase of CS50 final projects. Come see what students built this semester!', '2024-12-10 18:00:00', 'Science Center Plaza', 'other', 'partner', 'published'),
('Winter Mixer', 'Pre-finals stress relief! Music, snacks, and good vibes. All students welcome.', '2024-12-05 19:00:00', 'Annenberg Hall', 'mixer', 'official', 'published');

-- Add a voting session for Halloween event
INSERT INTO voting_sessions (event_id, question, is_active) VALUES
(3, 'Vote for the best costume!', 1);

INSERT INTO voting_options (session_id, option_text, option_order, vote_count) VALUES
(1, 'Spooky Ghost', 0, 12),
(1, 'Superhero', 1, 24),
(1, 'Historical Figure', 2, 8),
(1, 'Pop Culture Icon', 3, 31);
