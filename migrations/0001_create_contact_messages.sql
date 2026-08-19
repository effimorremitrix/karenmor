-- Migration number: 0001 	 2026-08-19T00:00:00.000Z
-- Mirrors shared/schema.ts. Keep the two in sync by hand — there is no
-- drizzle-kit in this project.

CREATE TABLE contact_messages (
  id                TEXT PRIMARY KEY NOT NULL,
  name              TEXT NOT NULL,
  email             TEXT NOT NULL,
  phone             TEXT NOT NULL,
  message           TEXT NOT NULL,
  preferred_contact TEXT NOT NULL,
  created_at        TEXT NOT NULL,
  email_status      TEXT NOT NULL DEFAULT 'pending'
);

CREATE INDEX idx_contact_messages_created_at ON contact_messages (created_at);
