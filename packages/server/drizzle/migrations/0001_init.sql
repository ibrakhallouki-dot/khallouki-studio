-- 0001_init.sql
-- Initial schema for Khallouki Studio

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY,
  email text NOT NULL,
  display_name text,
  avatar_url text,
  role varchar(32) DEFAULT 'user',
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS designs (
  id serial PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  image_url text,
  price_cents integer DEFAULT 0,
  is_premium boolean DEFAULT false,
  creator_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  views_count integer DEFAULT 0 NOT NULL,
  downloads_count integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS design_likes (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  design_id integer NOT NULL REFERENCES designs(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now() NOT NULL,
  PRIMARY KEY (user_id, design_id)
);

CREATE TABLE IF NOT EXISTS design_favorites (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  design_id integer NOT NULL REFERENCES designs(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now() NOT NULL,
  PRIMARY KEY (user_id, design_id)
);

CREATE TABLE IF NOT EXISTS design_comments (
  id serial PRIMARY KEY,
  design_id integer NOT NULL REFERENCES designs(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  rating integer NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS design_downloads (
  id serial PRIMARY KEY,
  design_id integer NOT NULL REFERENCES designs(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS design_views (
  id serial PRIMARY KEY,
  design_id integer NOT NULL REFERENCES designs(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  ip_address text,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS resources (
  id serial PRIMARY KEY,
  title text NOT NULL,
  description text,
  file_url text,
  is_premium boolean DEFAULT false,
  price_cents integer DEFAULT 0,
  creator_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS notifications (
  id serial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type varchar(64) NOT NULL,
  data jsonb,
  is_read boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS contact_requests (
  id serial PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  handled boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS admin_logs (
  id serial PRIMARY KEY,
  admin_id uuid NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  action text NOT NULL,
  details jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);
