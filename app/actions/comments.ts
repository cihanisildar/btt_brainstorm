"use server";

import { createClient } from "@/lib/supabase/server";
import type { Comment } from "@/types/entities";
import type { Database } from "@/types/database";
import { revalidatePath } from "next/cache";

export async function createComment(
  ideaId: string,
  content: string
): Promise<{ comment: Comment | null; error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { comment: null, error: "Unauthorized" };
  }

  const insertData: Database["public"]["Tables"]["comments"]["Insert"] = {
    idea_id: ideaId,
    content,
    user_id: user.id,
  };

  // Type assertion needed due to Supabase type inference limitations
  const { data, error } = await (supabase
    .from("comments")
    .insert([insertData] as never)
    .select()
    .single());

  if (error) {
    return { comment: null, error: error.message };
  }

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

  return { comment: data as Comment, error: null };
}

export async function getCommentsByIdea(ideaId: string): Promise<{
  comments: Comment[];
  error: string | null;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("idea_id", ideaId)
    .order("created_at", { ascending: true });

  if (error) {
    return { comments: [], error: error.message };
  }

  // Get user profiles for each comment
  const commentsData = (data || []) as Array<{
    id: string;
    idea_id: string;
    user_id: string;
    content: string;
    created_at: string;
    updated_at: string;
  }>;
  
  const comments = await Promise.all(
    commentsData.map(async (comment) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, email, name, avatar_url")
        .eq("id", comment.user_id)
        .single();

      const profileData = profile as {
        id: string;
        email: string;
        name: string;
        avatar_url: string | null;
      } | null;

      return {
        ...comment,
        user_id: comment.user_id,
        user: profileData ? {
          id: profileData.id,
          email: profileData.email || "",
          name: profileData.name || "",
          avatar_url: profileData.avatar_url || undefined,
          created_at: comment.created_at,
        } : undefined,
      };
    })
  );

  return { comments: comments as Comment[], error: null };
}

export async function updateComment(
  commentId: string,
  content: string
): Promise<{ comment: Comment | null; error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { comment: null, error: "Unauthorized" };
  }

  // Check if user owns the comment
  const { data: comment } = await supabase
    .from("comments")
    .select("idea_id, user_id")
    .eq("id", commentId)
    .single();

  const commentData = comment as { idea_id: string; user_id: string } | null;
  if (!commentData || commentData.user_id !== user.id) {
    return { comment: null, error: "Unauthorized" };
  }

  const updateData: Database["public"]["Tables"]["comments"]["Update"] = {
    content,
  };

  const { data, error } = await (supabase
    .from("comments")
    .update(updateData as never)
    .eq("id", commentId)
    .select()
    .single());

  if (error) {
    return { comment: null, error: error.message };
  }

  // Get topic_id for revalidation
  if (commentData) {
    const { data: idea } = await supabase
      .from("ideas")
      .select("topic_id")
      .eq("id", commentData.idea_id)
      .single();

    if (idea && typeof idea === "object" && idea !== null && "topic_id" in idea) {
      const topicId = (idea as { topic_id: string }).topic_id;
      revalidatePath(`/topics/${topicId}`);
    }
  }

  return { comment: data as Comment, error: null };
}

export async function deleteComment(
  commentId: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Check if user owns the comment
  const { data: comment } = await supabase
    .from("comments")
    .select("idea_id, user_id")
    .eq("id", commentId)
    .single();

  const commentData = comment as { idea_id: string; user_id: string } | null;
  if (!commentData || commentData.user_id !== user.id) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase.from("comments").delete().eq("id", commentId);

  if (error) {
    return { success: false, error: error.message };
  }

  // Get topic_id for revalidation
  const { data: idea } = await supabase
    .from("ideas")
    .select("topic_id")
    .eq("id", commentData.idea_id)
    .single();

  if (idea && typeof idea === "object" && idea !== null && "topic_id" in idea) {
    const topicId = (idea as { topic_id: string }).topic_id;
    revalidatePath(`/topics/${topicId}`);
  }

  return { success: true, error: null };
}

