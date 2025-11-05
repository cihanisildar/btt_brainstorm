"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useUpdateComment } from "@/hooks/use-comments";
import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

interface EditCommentDialogProps {
  commentId: string;
  currentContent: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditCommentDialog({
  commentId,
  currentContent,
  open,
  onOpenChange,
}: EditCommentDialogProps) {
  const updateComment = useUpdateComment();
  const [content, setContent] = useState(currentContent);

  // Reset content when dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setContent(currentContent);
    }
    onOpenChange(newOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await updateComment.mutateAsync({
        commentId,
        content: content.trim(),
      });
      onOpenChange(false);
    } catch {
      // Error handling is done in the hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] border-border/40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-5 w-5 text-primary/60" />
              <DialogTitle className="text-xl">Yorumu Düzenle</DialogTitle>
            </div>
            <DialogDescription className="text-muted-foreground/80">
              Yorumunuzu güncelleyin
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="edit-comment-content" className="text-sm font-medium">
                Yorum
              </Label>
              <Textarea
                id="edit-comment-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Yorumunuzu yazın..."
                rows={4}
                required
                className="border-border/40 focus:border-primary/50 resize-none"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                className="border-border/40"
              >
                İptal
              </Button>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  disabled={updateComment.isPending || !content.trim()}
                  className="gap-2"
                >
                  {updateComment.isPending ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </motion.div>
                      Güncelleniyor...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="h-4 w-4" />
                      Güncelle
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

