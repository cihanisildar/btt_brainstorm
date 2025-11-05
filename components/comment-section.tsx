"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { Comment } from "@/types/entities";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { useComments, useCreateComment, useDeleteComment } from "@/hooks/use-comments";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, MoreVertical, Edit, Trash2 } from "lucide-react";
import { EditCommentDialog } from "@/components/edit-comment-dialog";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CommentSectionProps {
  ideaId: string;
}

export function CommentSection({ ideaId }: CommentSectionProps) {
  const { data: comments, isLoading } = useComments(ideaId);
  const createComment = useCreateComment();
  const { data: user } = useAuth();
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    try {
      await createComment.mutateAsync({
        ideaId,
        content: content.trim(),
      });
      setContent("");
    } catch {
      // Error handling is done in the hook
    }
  };

  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary/60" />
          <CardTitle className="text-lg">Yorumlar</CardTitle>
        </div>
        <CardDescription className="text-sm">
          {comments?.length || 0} yorum
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {user && (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="space-y-3"
          >
            <Textarea
              placeholder="Yorumunuzu yazın..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              className="border-border/40 focus:border-primary/50 resize-none"
            />
            <div className="flex justify-end">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  disabled={!content.trim() || createComment.isPending}
                  size="sm"
                  className="gap-2"
                >
                  <Send className="h-3.5 w-3.5" />
                  Yorum Yap
                </Button>
              </motion.div>
            </div>
          </motion.form>
        )}

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center text-muted-foreground py-8 text-sm">
              Yükleniyor...
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {comments && comments.length > 0 ? (
                comments.map((comment, index) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    index={index}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-muted-foreground py-8 text-sm"
                >
                  Henüz yorum yok. İlk yorumu siz yapın!
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function CommentItem({
  comment,
  index,
}: {
  comment: Comment;
  index: number;
}) {
  const { data: user } = useAuth();
  const deleteComment = useDeleteComment();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const isOwner = user?.id === comment.user_id;

  const initials = comment.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || comment.user?.email?.[0]?.toUpperCase() || "?";

  const timeAgo = formatDistanceToNow(new Date(comment.created_at), {
    addSuffix: true,
    locale: tr,
  });

  const handleDelete = async () => {
    try {
      await deleteComment.mutateAsync(comment.id);
      setDeleteOpen(false);
    } catch {
      // Error handling is done in the hook
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        transition={{
          duration: 0.3,
          delay: index * 0.05,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="flex gap-3 pb-4 border-b border-border/20 last:border-0 last:pb-0"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Avatar className="h-8 w-8 border border-border/40">
            <AvatarImage src={comment.user?.avatar_url} />
            <AvatarFallback className="text-[10px] bg-muted">
              {initials}
            </AvatarFallback>
          </Avatar>
        </motion.div>
        <div className="flex-1 space-y-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">
                {comment.user?.name || comment.user?.email || "Bilinmeyen"}
              </span>
              <span className="text-xs text-muted-foreground/60">•</span>
              <span className="text-xs text-muted-foreground/70">{timeAgo}</span>
            </div>
            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 border-border/40 hover:bg-muted/50"
                    title="Yorum seçenekleri"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-border/40">
                  <DropdownMenuItem
                    onClick={() => setEditOpen(true)}
                    className="gap-2 cursor-pointer"
                  >
                    <Edit className="h-4 w-4" />
                    Düzenle
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setDeleteOpen(true)}
                    className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                    Sil
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
            {comment.content}
          </p>
        </div>
      </motion.div>

      <EditCommentDialog
        commentId={comment.id}
        currentContent={comment.content}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        title="Yorumu Sil"
        description="Bu yorumu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        isLoading={deleteComment.isPending}
      />
    </>
  );
}
