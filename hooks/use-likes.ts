"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toggleLike, getLikesByIdea } from "@/app/actions/likes";

export function useLikes(ideaId: string) {
  return useQuery({
    queryKey: ["likes", ideaId],
    queryFn: async () => {
      const { likes, error } = await getLikesByIdea(ideaId);
      if (error) {
        throw new Error(error);
      }
      return likes;
    },
    enabled: !!ideaId,
  });
}

export function useToggleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ideaId: string) => {
      const { liked, likes_count, error } = await toggleLike(ideaId);
      if (error) {
        throw new Error(error);
      }
      return { liked, likes_count };
    },
    onSuccess: (_, ideaId) => {
      queryClient.invalidateQueries({ queryKey: ["likes", ideaId] });
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
    },
    onError: (error: Error) => {
      console.error("Toggle like error:", error);
    },
  });
}

