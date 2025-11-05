"use server";

import { createClient } from "@/lib/supabase/server";
import type { Topic } from "@/types/entities";
import type { Database } from "@/types/database";
import { revalidatePath } from "next/cache";

export async function createTopic(
  title: string,
  description?: string
): Promise<{ topic: Topic | null; error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { topic: null, error: "Unauthorized" };
  }

  const insertData: Database["public"]["Tables"]["topics"]["Insert"] = {
    title,
    description: description || null,
    created_by: user.id,
  };

  const { data, error } = await (supabase
    .from("topics")
    .insert([insertData] as never)
    .select()
    .single());

  if (error) {
    return { topic: null, error: error.message };
  }

  revalidatePath("/");
  return { topic: data as Topic, error: null };
}

export async function getTopics(): Promise<{
  topics: Topic[];
  error: string | null;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("topics")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return { topics: [], error: error.message };
  }

  // Get ideas count and user profiles for each topic
  const topicsData = (data || []) as Array<{
    id: string;
    title: string;
    description: string | null;
    created_by: string;
    created_at: string;
    updated_at: string;
  }>;
  const topicsWithCounts = await Promise.all(
    topicsData.map(async (topic) => {
      const [countResult, profileResult] = await Promise.all([
        supabase
          .from("ideas")
          .select("*", { count: "exact", head: true })
          .eq("topic_id", topic.id),
        supabase
          .from("profiles")
          .select("id, email, name, avatar_url")
          .eq("id", topic.created_by)
          .single(),
      ]);

      const profileData = profileResult.data as {
        id: string;
        email: string;
        name: string;
        avatar_url: string | null;
      } | null;

      return {
        ...topic,
        created_by: topic.created_by,
        ideas_count: countResult.count || 0,
        user: profileData ? {
          id: profileData.id,
          email: profileData.email || "",
          name: profileData.name || "",
          avatar_url: profileData.avatar_url || undefined,
          created_at: topic.created_at,
        } : undefined,
      };
    })
  );

  return { topics: topicsWithCounts as Topic[], error: null };
}

export async function getTopicById(
  id: string
): Promise<{ topic: Topic | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("topics")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return { topic: null, error: error.message };
  }

  if (!data) {
    return { topic: null, error: "Topic not found" };
  }

  const topicData = data as {
    id: string;
    title: string;
    description: string | null;
    created_by: string;
    created_at: string;
    updated_at: string;
  };

  const [countResult, profileResult] = await Promise.all([
    supabase
      .from("ideas")
      .select("*", { count: "exact", head: true })
      .eq("topic_id", id),
    supabase
      .from("profiles")
      .select("id, email, name, avatar_url")
      .eq("id", topicData.created_by)
      .single(),
  ]);

  const profileData = profileResult.data as {
    id: string;
    email: string;
    name: string;
    avatar_url: string | null;
  } | null;

  const topic: Topic = {
    ...topicData,
    ideas_count: countResult.count || 0,
    user: profileData ? {
      id: profileData.id,
      email: profileData.email || "",
      name: profileData.name || "",
      avatar_url: profileData.avatar_url || undefined,
      created_at: topicData.created_at,
    } : undefined,
  };

  return { topic, error: null };
}

export async function updateTopic(
  topicId: string,
  title: string,
  description?: string
): Promise<{ topic: Topic | null; error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { topic: null, error: "Unauthorized" };
  }

  // Check if user owns the topic
  const { data: topic } = await supabase
    .from("topics")
    .select("created_by")
    .eq("id", topicId)
    .single();

  const topicData = topic as { created_by: string } | null;
  if (!topicData || topicData.created_by !== user.id) {
    return { topic: null, error: "Unauthorized" };
  }

  const updateData: Database["public"]["Tables"]["topics"]["Update"] = {
    title,
    description: description || null,
  };

  const { data, error } = await (supabase
    .from("topics")
    .update(updateData as never)
    .eq("id", topicId)
    .select()
    .single());

  if (error) {
    return { topic: null, error: error.message };
  }

  // Get ideas count
  const { count } = await supabase
    .from("ideas")
    .select("*", { count: "exact", head: true })
    .eq("topic_id", topicId);

  revalidatePath("/");
  revalidatePath(`/topics/${topicId}`);

  const updatedTopic: Topic = {
    ...(data as Topic),
    ideas_count: count || 0,
  };

  return { topic: updatedTopic, error: null };
}

export async function deleteTopic(
  topicId: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Check if user owns the topic
  const { data: topic } = await supabase
    .from("topics")
    .select("created_by")
    .eq("id", topicId)
    .single();

  const topicData = topic as { created_by: string } | null;
  if (!topicData || topicData.created_by !== user.id) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase.from("topics").delete().eq("id", topicId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  return { success: true, error: null };
}

