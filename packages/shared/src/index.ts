export type AppRouter = any

export type User = {
  id: number
  supabase_id?: string
  email?: string
  role?: string
  created_at?: string
}

export type Profile = {
  id: number
  user_id: number
  display_name: string
  bio?: string
  avatar_url?: string
}

export type Design = {
  id: number
  slug: string
  title: string
  description?: string
  author_id: number
  storage_path: string
  preview_path?: string
  category_id?: number
  likes_count?: number
  downloads_count?: number
  created_at?: string
}
