-- ============================================
-- HARVARD POOPS - SEED EVENT DATA
-- ============================================
-- Run this in Supabase SQL Editor to populate test events
-- Make sure to replace 'YOUR_USER_ID_HERE' with an actual user ID from auth.users table

-- To get a user ID, run this first:
-- SELECT id, email FROM auth.users LIMIT 1;
-- Then copy the ID and replace it below

-- Sample Events (10 events for testing exclusivity unlocking)
INSERT INTO events (title, description, date, time, location, type, status, host_id, host_name, cover_image_url, has_rsvp) VALUES
-- Event 1: Tonight's Party
(
  'Crimson Cup Kick-Off Party',
  'Join us for the official kick-off of Crimson Cup season! Free drinks, music by DJ Crimson, and a chance to win exclusive Harvard Poops merch.',
  CURRENT_DATE,
  '21:00:00',
  'The Fly Club',
  'party',
  'published',
  '7885b109-9a2b-493b-9f56-4f6b50c0249f', -- Replace with actual user ID
  'Harvard Poops Team',
  NULL,
  true
),

-- Event 2: This Weekend
(
  'Harvard vs Yale Tailgate',
  'Pre-game tailgate before The Game! Food, drinks, and Crimson spirit. Wear your Harvard gear!',
  CURRENT_DATE + INTERVAL '3 days',
  '12:00:00',
  'Harvard Stadium Parking Lot',
  'tailgate',
  'published',
  '7885b109-9a2b-493b-9f56-4f6b50c0249f',
  'Athletics Department',
  NULL,
  true
),

-- Event 3: Next Week
(
  'Adams House Mixer',
  'Cross-house mixer with music, drinks, and good vibes. Limited spots available - RSVP now!',
  CURRENT_DATE + INTERVAL '7 days',
  '22:00:00',
  'Adams House Dining Hall',
  'mixer',
  'published',
  '7885b109-9a2b-493b-9f56-4f6b50c0249f',
  'Adams HoCo',
  NULL,
  true
),

-- Event 4: Exclusive Contest
(
  'Hottest Harvard Contest Finals',
  'The moment you''ve been waiting for - live voting for Harvard''s Hottest! Vote for your favorites and watch the results update in real-time.',
  CURRENT_DATE + INTERVAL '5 days',
  '20:00:00',
  'Annenberg Hall',
  'contest',
  'published',
  '7885b109-9a2b-493b-9f56-4f6b50c0249f',
  'Harvard Poops Team',
  NULL,
  true
),

-- Event 5
(
  'Leverett 80s Dance Party',
  'Dust off your leg warmers and tease that hair! 80s themed dance party with retro drinks and neon lights.',
  CURRENT_DATE + INTERVAL '10 days',
  '21:30:00',
  'Leverett House',
  'party',
  'published',
  '7885b109-9a2b-493b-9f56-4f6b50c0249f',
  'Leverett HoCo',
  NULL,
  true
),

-- Event 6
(
  'Finals Study Break Social',
  'Take a break from studying! Free pizza, snacks, and games. Hosted by the Student Council.',
  CURRENT_DATE + INTERVAL '12 days',
  '19:00:00',
  'Widener Library Steps',
  'other',
  'published',
  '7885b109-9a2b-493b-9f56-4f6b50c0249f',
  'Student Council',
  NULL,
  true
),

-- Event 7
(
  'Kirkland Secret Garden Party',
  'Exclusive outdoor party in Kirkland''s secret garden. Fairy lights, live acoustic music, and signature cocktails.',
  CURRENT_DATE + INTERVAL '14 days',
  '20:00:00',
  'Kirkland House Courtyard',
  'party',
  'published',
  '7885b109-9a2b-493b-9f56-4f6b50c0249f',
  'Kirkland HoCo',
  NULL,
  true
),

-- Event 8
(
  'Mather Lather Foam Party',
  'Annual Mather Lather is back! Dance in the foam, enjoy DJ sets, and make memories. Bring a change of clothes!',
  CURRENT_DATE + INTERVAL '15 days',
  '22:00:00',
  'Mather Courtyard',
  'party',
  'published',
  '7885b109-9a2b-493b-9f56-4f6b50c0249f',
  'Mather HoCo',
  NULL,
  true
),

-- Event 9
(
  'Eliot Fête: Spring Formal',
  'Eliot House''s annual spring formal. Semi-formal attire required. Dinner, dancing, and photo booth included.',
  CURRENT_DATE + INTERVAL '20 days',
  '19:00:00',
  'Eliot House Dining Hall',
  'mixer',
  'published',
  '7885b109-9a2b-493b-9f56-4f6b50c0249fE',
  'Eliot HoCo',
  NULL,
  true
),

-- Event 10
(
  'Crimson Comedy Night',
  'Student standup comedy showcase featuring Harvard''s funniest students. Open mic after main acts!',
  CURRENT_DATE + INTERVAL '25 days',
  '20:30:00',
  'Lowell Lecture Hall',
  'other',
  'published',
  '7885b109-9a2b-493b-9f56-4f6b50c0249f',
  'Harvard Lampoon',
  NULL,
  true
);

-- ============================================
-- SEED DATA COMPLETE ✅
-- ============================================
-- You now have 10 test events to test the exclusivity system:
-- - New user (0 RSVPs): Will see 3 events
-- - After 1 RSVP: Will see 6 events
-- - After 2 RSVPs: Will see all 10 events
--
-- To test:
-- 1. Sign up with a new account
-- 2. See only 3 events on home page
-- 3. RSVP to 1 event
-- 4. Refresh - you should now see 6 events
-- 5. RSVP to another event
-- 6. Refresh - you should now see all 10 events
