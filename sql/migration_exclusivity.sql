-- ============================================
-- HARVARD POOPS - EXCLUSIVITY SYSTEM MIGRATION
-- ============================================
-- Run this in Supabase SQL Editor to add exclusivity features
-- Go to: Dashboard → SQL Editor → New query → Paste and Run

-- Add exclusivity fields to events table
ALTER TABLE events
ADD COLUMN IF NOT EXISTS max_attendees INTEGER DEFAULT NULL,
ADD COLUMN IF NOT EXISTS is_invite_only BOOLEAN DEFAULT false;

-- Add performance index for RSVP counting
CREATE INDEX IF NOT EXISTS idx_rsvps_user_event ON rsvps(user_id, event_id);

-- Add RSVP deletion policy (allow users to cancel their RSVPs)
-- Drop first if exists, then create (PostgreSQL doesn't support IF NOT EXISTS for policies)
DROP POLICY IF EXISTS "Users can delete their own RSVPs" ON rsvps;
CREATE POLICY "Users can delete their own RSVPs"
  ON rsvps FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- MIGRATION COMPLETE ✅
-- ============================================
-- New features added:
-- - max_attendees: Limit spots for exclusive events
-- - is_invite_only: Require approval to RSVP
-- - Index for faster RSVP lookups
-- - Policy to allow RSVP cancellation
