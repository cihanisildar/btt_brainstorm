"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createIdea,
  getIdeasByTopic,
  updateIdea,
  deleteIdea,
} from "@/app/actions/ideas";
import type { SortOption } from "@/types/entities";
import { toast } from "sonner";

export function useIdeas(topicId: string, sort: SortOption = "newest") {
  return useQuery({
    queryKey: ["ideas", topicId, sort],
    queryFn: async () => {
      const { ideas, error } = await getIdeasByTopic(topicId, sort);
      if (error) {
        throw new Error(error);
      }
      return ideas;
    },
    enabled: !!topicId,
  });
}

export function useCreateIdea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { topicId: string; content: string }) => {
      const { idea, error } = await createIdea(data.topicId, data.content);
      if (error) {
        throw new Error(error);
      }
      if (!idea) {
        throw new Error("Failed to create idea");
      }
      return idea;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ideas", variables.topicId] });
      queryClient.invalidateQueries({ queryKey: ["topic", variables.topicId] });
      toast.success("Fikir başarıyla eklendi");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Fikir eklenirken bir hata oluştu");
    },
  });
}

export function useUpdateIdea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { ideaId: string; content: string }) => {
      const { idea, error } = await updateIdea(data.ideaId, data.content);
      if (error) {
        throw new Error(error);
      }
      if (!idea) {
        throw new Error("Failed to update idea");
      }
      return idea;
    },
    onSuccess: (idea) => {
      queryClient.invalidateQueries({ queryKey: ["ideas", idea.topic_id] });
      toast.success("Fikir başarıyla güncellendi");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Fikir güncellenirken bir hata oluştu");
    },
  });
}

export function useDeleteIdea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ideaId: string) => {
      const { success, error } = await deleteIdea(ideaId);
      if (error) {
        throw new Error(error);
      }
      if (!success) {
        throw new Error("Failed to delete idea");
      }
      return success;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
      toast.success("Fikir başarıyla silindi");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Fikir silinirken bir hata oluştu");
    },
  });
}
