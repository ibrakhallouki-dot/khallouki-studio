import { pgTable, text, serial, integer, timestamp, varchar, boolean, json, primaryKey } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: text('id').primaryKey(), // Supabase auth UUID
  email: text('email').notNull(),
  display_name: text('display_name'),
  avatar_url: text('avatar_url'),
  role: varchar('role', { length: 32 }).default('user'),
  created_at: timestamp('created_at').defaultNow().notNull()
})

export const designs = pgTable('designs', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull(),
  description: text('description'),
  image_url: text('image_url'),
  price_cents: integer('price_cents').default(0),
  is_premium: boolean('is_premium').default(false),
  creator_id: text('creator_id').notNull(),
  views_count: integer('views_count').default(0).notNull(),
  downloads_count: integer('downloads_count').default(0).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
})

export const design_likes = pgTable('design_likes', {
  user_id: text('user_id').notNull(),
  design_id: integer('design_id').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
}, (table) => ({
  pk: primaryKey(table.user_id, table.design_id)
}))

export const design_favorites = pgTable('design_favorites', {
  user_id: text('user_id').notNull(),
  design_id: integer('design_id').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
}, (table) => ({
  pk: primaryKey(table.user_id, table.design_id)
}))

export const design_comments = pgTable('design_comments', {
  id: serial('id').primaryKey(),
  design_id: integer('design_id').notNull(),
  user_id: text('user_id').notNull(),
  rating: integer('rating').default(5).notNull(),
  comment: text('comment'),
  created_at: timestamp('created_at').defaultNow().notNull()
})

export const design_downloads = pgTable('design_downloads', {
  id: serial('id').primaryKey(),
  design_id: integer('design_id').notNull(),
  user_id: text('user_id'),
  created_at: timestamp('created_at').defaultNow().notNull()
})

export const design_views = pgTable('design_views', {
  id: serial('id').primaryKey(),
  design_id: integer('design_id').notNull(),
  user_id: text('user_id'),
  ip_address: text('ip_address'),
  created_at: timestamp('created_at').defaultNow().notNull()
})

export const resources = pgTable('resources', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  file_url: text('file_url'),
  is_premium: boolean('is_premium').default(false),
  price_cents: integer('price_cents').default(0),
  creator_id: text('creator_id').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
})

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull(),
  type: varchar('type', { length: 64 }).notNull(),
  data: json('data'),
  is_read: boolean('is_read').default(false).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
})

export const contact_requests = pgTable('contact_requests', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  message: text('message').notNull(),
  handled: boolean('handled').default(false).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
})

export const admin_logs = pgTable('admin_logs', {
  id: serial('id').primaryKey(),
  admin_id: text('admin_id').notNull(),
  action: text('action').notNull(),
  details: json('details'),
  created_at: timestamp('created_at').defaultNow().notNull()
})
