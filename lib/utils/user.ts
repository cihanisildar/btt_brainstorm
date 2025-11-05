import { createClient } from "@/lib/supabase/client";
import type { User } from "@/types/entities";

export async function getUserInfo(userId: string): Promise<User | null> {
  const supabase = createClient();
  
  // Get user from auth - we can only get the current user's info
  // For other users, we'd need a profiles table or use admin API
  // For now, we'll try to get from session
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  if (currentUser?.id === userId) {
    const meta = currentUser.user_metadata || {};
    return {
      id: currentUser.id,
      email: currentUser.email || "",
      name: meta.name || meta.full_name,
      avatar_url: meta.avatar_url || meta.picture,
      created_at: currentUser.created_at || new Date().toISOString(),
    };
  }

  // For other users, we can't easily get their info without admin API
  // Return null and handle gracefully in components
  return null;
}

