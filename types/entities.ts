export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  user?: User;
  ideas_count?: number;
}

export interface Idea {
  id: string;
  topic_id: string;
  content: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  user?: User;
  likes_count?: number;
  comments_count?: number;
  is_liked?: boolean;
}

export interface Like {
  id: string;
  idea_id: string;
  user_id: string;
  created_at: string;
  user?: User;
}

export interface Comment {
  id: string;
  idea_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

export type SortOption = "newest" | "most_liked" | "most_commented";

