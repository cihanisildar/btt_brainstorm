"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTopic, getTopics, getTopicById, updateTopic, deleteTopic } from "@/app/actions/topics";
import { toast } from "sonner";

export function useTopics() {
  return useQuery({
    queryKey: ["topics"],
    queryFn: async () => {
      const { topics, error } = await getTopics();
      if (error) {
        throw new Error(error);
      }
      return topics;
    },
  });
}

export function useTopic(id: string) {
  return useQuery({
    queryKey: ["topic", id],
    queryFn: async () => {
      const { topic, error } = await getTopicById(id);
      if (error) {
        throw new Error(error);
      }
      if (!topic) {
        throw new Error("Topic not found");
      }
      return topic;
    },
    enabled: !!id,
  });
}

export function useCreateTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { title: string; description?: string }) => {
      const { topic, error } = await createTopic(data.title, data.description);
      if (error) {
        throw new Error(error);
      }
      if (!topic) {
        throw new Error("Failed to create topic");
      }
      return topic;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topics"] });
      toast.success("Konu başarıyla oluşturuldu");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Konu oluşturulurken bir hata oluştu");
    },
  });
}

export function useUpdateTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { topicId: string; title: string; description?: string }) => {
      const { topic, error } = await updateTopic(data.topicId, data.title, data.description);
      if (error) {
        throw new Error(error);
      }
      if (!topic) {
        throw new Error("Failed to update topic");
      }
      return topic;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topics"] });
      toast.success("Konu başarıyla güncellendi");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Konu güncellenirken bir hata oluştu");
    },
  });
}

export function useDeleteTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (topicId: string) => {
      const { success, error } = await deleteTopic(topicId);
      if (error) {
        throw new Error(error);
      }
      if (!success) {
        throw new Error("Failed to delete topic");
      }
      return success;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topics"] });
      toast.success("Konu başarıyla silindi");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Konu silinirken bir hata oluştu");
    },
  });
}

