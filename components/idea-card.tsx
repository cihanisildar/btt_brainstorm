"use client";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Idea } from "@/types/entities";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Heart, MessageCircle, MoreVertical, Edit, Trash2 } from "lucide-react";
import { useToggleLike } from "@/hooks/use-likes";
import { useDeleteIdea } from "@/hooks/use-ideas";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { motion } from "framer-motion";
import { EditIdeaDialog } from "@/components/edit-idea-dialog";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface IdeaCardProps {
  idea: Idea;
  onCommentClick?: () => void;
  index?: number;
}

export function IdeaCard({ idea, onCommentClick, index = 0 }: IdeaCardProps) {
  const toggleLike = useToggleLike();
  const deleteIdea = useDeleteIdea();
  const { data: user } = useAuth();
  const [isLiking, setIsLiking] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const isOwner = user?.id === idea.created_by;

  const initials = idea.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || idea.user?.email?.[0]?.toUpperCase() || "?";

  const timeAgo = formatDistanceToNow(new Date(idea.created_at), {
    addSuffix: true,
    locale: tr,
  });

  const handleLike = async () => {
    setIsLiking(true);
    try {
      await toggleLike.mutateAsync(idea.id);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteIdea.mutateAsync(idea.id);
      setDeleteOpen(false);
    } catch {
      // Error handling is done in the hook
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: index * 0.05,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <Card className="group relative overflow-hidden border-border/40 bg-card/50 backdrop-blur-sm hover:border-border/60 transition-all duration-500">
          {/* Decorative line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90 flex-1">
                {idea.content}
              </p>
              {isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 border-border/40 hover:bg-muted/50"
                      title="Fikir seçenekleri"
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
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Avatar className="h-7 w-7 border border-border/40">
                    <AvatarImage src={idea.user?.avatar_url} />
                    <AvatarFallback className="text-[10px] bg-muted">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {idea.user?.name || idea.user?.email || "Bilinmeyen"}
                  </span>
                  <span className="text-muted-foreground/50">•</span>
                  <span className="text-muted-foreground/70">{timeAgo}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant={idea.is_liked ? "default" : "outline"}
                    size="sm"
                    onClick={handleLike}
                    disabled={isLiking}
                    className="gap-2 border-border/40 h-8 px-3 text-xs"
                  >
                    <motion.div
                      animate={idea.is_liked ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      <Heart
                        className={`h-3.5 w-3.5 ${idea.is_liked ? "fill-current" : ""}`}
                      />
                    </motion.div>
                    <span>{idea.likes_count || 0}</span>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onCommentClick}
                    className="gap-2 border-border/40 h-8 px-3 text-xs"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>{idea.comments_count || 0}</span>
                  </Button>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <EditIdeaDialog
        ideaId={idea.id}
        currentContent={idea.content}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        title="Fikri Sil"
        description="Bu fikri silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        isLoading={deleteIdea.isPending}
      />
    </>
  );
}
