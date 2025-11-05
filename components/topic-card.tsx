"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Topic } from "@/types/entities";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { motion } from "framer-motion";
import { Sparkles, MoreVertical, Edit, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useDeleteTopic } from "@/hooks/use-topics";
import { useState } from "react";
import { EditTopicDialog } from "@/components/edit-topic-dialog";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopicCardProps {
  topic: Topic;
  index: number;
}

export function TopicCard({ topic, index }: TopicCardProps) {
  const { data: user } = useAuth();
  const deleteTopic = useDeleteTopic();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const isOwner = user?.id === topic.created_by;

  const initials = topic.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || topic.user?.email?.[0]?.toUpperCase() || "?";

  const timeAgo = formatDistanceToNow(new Date(topic.created_at), {
    addSuffix: true,
    locale: tr,
  });

  const handleDelete = async () => {
    try {
      await deleteTopic.mutateAsync(topic.id);
      setDeleteOpen(false);
    } catch {
      // Error handling is done in the hook
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -8,
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
      }}
    >
      <Link href={`/topics/${topic.id}`}>
        <Card className="group relative overflow-hidden border-border/40 bg-card/50 backdrop-blur-sm hover:border-border/60 transition-all duration-500 h-full">
          {/* Subtle gradient overlay on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            initial={false}
          />
          
          {/* Decorative line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          
          <CardHeader className="relative z-10">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl font-semibold tracking-tight group-hover:text-primary transition-colors duration-300">
                  {topic.title}
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                >
                  <Badge 
                    variant="secondary" 
                    className="border-border/40 bg-secondary/50 backdrop-blur-sm font-normal"
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    {topic.ideas_count || 0}
                  </Badge>
                </motion.div>
                {isOwner && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 border-border/40 hover:bg-muted/50"
                        title="Konu seçenekleri"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="border-border/40">
                      <DropdownMenuItem
                        onClick={handleEditClick}
                        className="gap-2 cursor-pointer"
                      >
                        <Edit className="h-4 w-4" />
                        Düzenle
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleDeleteClick}
                        className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                        Sil
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
            {topic.description && (
              <CardDescription className="text-sm leading-relaxed line-clamp-2 text-muted-foreground/80">
                {topic.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Avatar className="h-7 w-7 border border-border/40">
                  <AvatarImage src={topic.user?.avatar_url} />
                  <AvatarFallback className="text-[10px] bg-muted">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              <span className="font-medium">
                {topic.user?.name || topic.user?.email || "Bilinmeyen"}
              </span>
              <span className="text-muted-foreground/50">•</span>
              <span className="text-muted-foreground/70">{timeAgo}</span>
            </div>
          </CardContent>
        </Card>
      </Link>

      <EditTopicDialog
        topicId={topic.id}
        currentTitle={topic.title}
        currentDescription={topic.description}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        title="Konuyu Sil"
        description="Bu konuyu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve tüm fikirler de silinecektir."
        isLoading={deleteTopic.isPending}
      />
    </motion.div>
  );
}
