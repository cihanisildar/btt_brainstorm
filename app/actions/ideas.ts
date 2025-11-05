"use server";

import { createClient } from "@/lib/supabase/server";
import type { Idea, SortOption } from "@/types/entities";
import type { Database } from "@/types/database";
import { revalidatePath } from "next/cache";

export async function createIdea(
  topicId: string,
  content: string
): Promise<{ idea: Idea | null; error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { idea: null, error: "Unauthorized" };
  }

  const insertData: Database["public"]["Tables"]["ideas"]["Insert"] = {
    topic_id: topicId,
    content,
    created_by: user.id,
  };

  const { data, error } = await (supabase
    .from("ideas")
    .insert([insertData] as never)
    .select()
    .single());

  if (error) {
    return { idea: null, error: error.message };
  }

  revalidatePath(`/topics/${topicId}`);
  return { idea: data as Idea, error: null };
}

export async function getIdeasByTopic(
  topicId: string,
  sort: SortOption = "newest"
): Promise<{ ideas: Idea[]; error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let query = supabase
    .from("ideas")
    .select("*")
    .eq("topic_id", topicId);

  // Apply sorting
  switch (sort) {
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    case "most_liked":
      // We'll need to get likes count and sort
      query = query.order("created_at", { ascending: false });
      break;
    case "most_commented":
      // We'll need to get comments count and sort
      query = query.order("created_at", { ascending: false });
      break;
  }

  const { data, error } = await query;

  if (error) {
    return { ideas: [], error: error.message };
  }

  // Get likes and comments count, check if user liked, and get user profiles
  const ideasData = (data || []) as Array<{
    id: string;
    topic_id: string;
    content: string;
    created_by: string;
    created_at: string;
    updated_at: string;
  }>;
  const ideasWithCounts = await Promise.all(
    ideasData.map(async (idea) => {
      const [likesResult, commentsResult, userLikeResult, profileResult] = await Promise.all([
        supabase
          .from("likes")
          .select("*", { count: "exact", head: true })
          .eq("idea_id", idea.id),
        supabase
          .from("comments")
          .select("*", { count: "exact", head: true })
          .eq("idea_id", idea.id),
        user
          ? supabase
              .from("likes")
              .select("id")
              .eq("idea_id", idea.id)
              .eq("user_id", user.id)
              .single()
          : Promise.resolve({ data: null, error: null }),
        supabase
          .from("profiles")
          .select("id, email, name, avatar_url")
          .eq("id", idea.created_by)
          .single(),
      ]);

      const profileData = profileResult.data as {
        id: string;
        email: string;
        name: string;
        avatar_url: string | null;
      } | null;

      return {
        ...idea,
        created_by: idea.created_by,
        likes_count: likesResult.count || 0,
        comments_count: commentsResult.count || 0,
        is_liked: !!userLikeResult.data,
        user: profileData ? {
          id: profileData.id,
          email: profileData.email || "",
          name: profileData.name || "",
          avatar_url: profileData.avatar_url || undefined,
          created_at: idea.created_at,
        } : undefined,
      };
    })
  );

  // Sort by likes or comments if needed
  if (sort === "most_liked") {
    ideasWithCounts.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
  } else if (sort === "most_commented") {
    ideasWithCounts.sort(
      (a, b) => (b.comments_count || 0) - (a.comments_count || 0)
    );
  }

  return { ideas: ideasWithCounts as Idea[], error: null };
}

export async function updateIdea(
  ideaId: string,
  content: string
): Promise<{ idea: Idea | null; error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { idea: null, error: "Unauthorized" };
  }

  // Check if user owns the idea
  const { data: idea } = await supabase
    .from("ideas")
    .select("topic_id, created_by")
    .eq("id", ideaId)
    .single();

  const ideaData = idea as { topic_id: string; created_by: string } | null;
  if (!ideaData || ideaData.created_by !== user.id) {
    return { idea: null, error: "Unauthorized" };
  }

  const updateData: Database["public"]["Tables"]["ideas"]["Update"] = {
    content,
  };

  const { data, error } = await (supabase
    .from("ideas")
    .update(updateData as never)
    .eq("id", ideaId)
    .select()
    .single());

  if (error) {
    return { idea: null, error: error.message };
  }

  revalidatePath(`/topics/${ideaData.topic_id}`);
  return { idea: data as Idea, error: null };
}

export async function deleteIdea(
  ideaId: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Check if user owns the idea
  const { data: idea } = await supabase
    .from("ideas")
    .select("topic_id, created_by")
    .eq("id", ideaId)
    .single();

  const ideaData = idea as { topic_id: string; created_by: string } | null;
  if (!ideaData || ideaData.created_by !== user.id) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase.from("ideas").delete().eq("id", ideaId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath(`/topics/${ideaData.topic_id}`);
  return { success: true, error: null };
}

