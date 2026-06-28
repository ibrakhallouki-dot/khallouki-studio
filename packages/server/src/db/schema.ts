import { drizzle } from 'drizzle-orm/node-postgres'
import { sql } from 'drizzle-orm'
import { integer, pgTable, serial, text, varchar, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  supabase_id: varchar('supabase_id', { length: 255 }).notNull().unique(),
  email: varchar('email', { length: 320 }).notNull(),
  role: varchar('role', { length: 50 }).default('user'),
  created_at: timestamp('created_at').default(sql`now()`).notNull(),
  updated_at: timestamp('updated_at').default(sql`now()`).notNull()
})

export const profiles = pgTable('profiles', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id).notNull(),
  display_name: varchar('display_name', { length: 255 }).notNull(),
  bio: text('bio'),
  avatar_url: text('avatar_url'),
  created_at: timestamp('created_at').default(sql`now()`).notNull()
})

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique()
})

export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique()
})

export const designs = pgTable('designs', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  author_id: integer('author_id').references(() => users.id).notNull(),
  storage_path: text('storage_path').notNull(),
  preview_path: text('preview_path'),
  category_id: integer('category_id').references(() => categories.id),
  likes_count: integer('likes_count').default(0),
  downloads_count: integer('downloads_count').default(0),
  created_at: timestamp('created_at').default(sql`now()`).notNull(),
  updated_at: timestamp('updated_at').default(sql`now()`).notNull()
})

export const design_tags = pgTable('design_tags', {
  id: serial('id').primaryKey(),
  design_id: integer('design_id').references(() => designs.id).notNull(),
  tag_id: integer('tag_id').references(() => tags.id).notNull()
})

export const resources = pgTable('resources', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  storage_path: text('storage_path').notNull(),
  author_id: integer('author_id').references(() => users.id).notNull(),
  downloads_count: integer('downloads_count').default(0),
  category_id: integer('category_id').references(() => categories.id),
  created_at: timestamp('created_at').default(sql`now()`).notNull()
})

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id).notNull(),
  design_id: integer('design_id').references(() => designs.id),
  custom_request: text('custom_request'),
  status: varchar('status', { length: 50 }).default('pending'),
  created_at: timestamp('created_at').default(sql`now()`).notNull(),
  updated_at: timestamp('updated_at').default(sql`now()`).notNull()
})

export const likes = pgTable('likes', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id).notNull(),
  design_id: integer('design_id').references(() => designs.id).notNull(),
  created_at: timestamp('created_at').default(sql`now()`).notNull()
})

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id).notNull(),
  type: varchar('type', { length: 100 }).notNull(),
  payload: text('payload'),
  read: integer('read').default(0),
  created_at: timestamp('created_at').default(sql`now()`).notNull()
})
