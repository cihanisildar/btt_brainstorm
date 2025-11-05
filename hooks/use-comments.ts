"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createComment,
  getCommentsByIdea,
  updateComment,
  deleteComment,
} from "@/app/actions/comments";
import { toast } from "sonner";

export function useComments(ideaId: string) {
  return useQuery({
    queryKey: ["comments", ideaId],
    queryFn: async () => {
      const { comments, error } = await getCommentsByIdea(ideaId);
      if (error) {
        throw new Error(error);
      }
      return comments;
    },
    enabled: !!ideaId,
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { ideaId: string; content: string }) => {
      const { comment, error } = await createComment(data.ideaId, data.content);
      if (error) {
        throw new Error(error);
      }
      if (!comment) {
        throw new Error("Failed to create comment");
      }
      return comment;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.ideaId] });
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
      toast.success("Yorum başarıyla eklendi");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Yorum eklenirken bir hata oluştu");
    },
  });
}

export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { commentId: string; content: string }) => {
      const { comment, error } = await updateComment(data.commentId, data.content);
      if (error) {
        throw new Error(error);
      }
      if (!comment) {
        throw new Error("Failed to update comment");
      }
      return comment;
    },
    onSuccess: (comment) => {
      queryClient.invalidateQueries({ queryKey: ["comments", comment.idea_id] });
      toast.success("Yorum başarıyla güncellendi");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Yorum güncellenirken bir hata oluştu");
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: string) => {
      const { success, error } = await deleteComment(commentId);
      if (error) {
        throw new Error(error);
      }
      if (!success) {
        throw new Error("Failed to delete comment");
      }
      return success;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      toast.success("Yorum başarıyla silindi");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Yorum silinirken bir hata oluştu");
    },
  });
}

