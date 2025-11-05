"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import { revalidatePath } from "next/cache";

export async function toggleLike(
  ideaId: string
): Promise<{ liked: boolean; likes_count: number; error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { liked: false, likes_count: 0, error: "Unauthorized" };
  }

  // Check if like already exists
  const { data: existingLike } = await supabase
    .from("likes")
    .select("id")
    .eq("idea_id", ideaId)
    .eq("user_id", user.id)
    .single();

  if (existingLike) {
    // Unlike
    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("idea_id", ideaId)
      .eq("user_id", user.id);

    if (error) {
      return { liked: false, likes_count: 0, error: error.message };
    }

    // Get updated count
    const { count } = await supabase
      .from("likes")
      .select("*", { count: "exact", head: true })
      .eq("idea_id", ideaId);

    // Get topic_id for revalidation
    const { data: idea } = await supabase
      .from("ideas")
      .select("topic_id")
      .eq("id", ideaId)
      .single();

    if (idea && typeof idea === "object" && idea !== null && "topic_id" in idea) {
      const topicId = (idea as { topic_id: string }).topic_id;
      revalidatePath(`/topics/${topicId}`);
    }

    return {
      liked: false,
      likes_count: count || 0,
      error: null,
    };
  } else {
    // Like
    const insertData: Database["public"]["Tables"]["likes"]["Insert"] = {
      idea_id: ideaId,
      user_id: user.id,
    };

    const { error } = await (supabase
      .from("likes")
      .insert([insertData] as never));

    if (error) {
      return { liked: false, likes_count: 0, error: error.message };
    }

    // Get updated count
    const { count } = await supabase
      .from("likes")
      .select("*", { count: "exact", head: true })
      .eq("idea_id", ideaId);

    // Get topic_id for revalidation
    const { data: idea2 } = await supabase
      .from("ideas")
      .select("topic_id")
      .eq("id", ideaId)
      .single();

    if (idea2 && typeof idea2 === "object" && idea2 !== null && "topic_id" in idea2) {
      const topicId = (idea2 as { topic_id: string }).topic_id;
      revalidatePath(`/topics/${topicId}`);
    }

    return {
      liked: true,
      likes_count: count || 0,
      error: null,
    };
  }
}

export async function getLikesByIdea(ideaId: string): Promise<{
  likes: Array<{ id: string; user_id: string; created_at: string }>;
  error: string | null;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("likes")
    .select("id, user_id, created_at")
    .eq("idea_id", ideaId)
    .order("created_at", { ascending: false });

  if (error) {
    return { likes: [], error: error.message };
  }

  return { likes: data || [], error: null };
}

