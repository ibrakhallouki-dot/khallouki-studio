-- 0002_resources_downloads.sql
-- Add downloads table for resources

CREATE TABLE IF NOT EXISTS resources_downloads (
  id serial PRIMARY KEY,
  resource_id integer NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);
