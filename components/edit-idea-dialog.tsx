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
import { useUpdateIdea } from "@/hooks/use-ideas";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface EditIdeaDialogProps {
  ideaId: string;
  currentContent: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditIdeaDialog({
  ideaId,
  currentContent,
  open,
  onOpenChange,
}: EditIdeaDialogProps) {
  const updateIdea = useUpdateIdea();
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
      await updateIdea.mutateAsync({
        ideaId,
        content: content.trim(),
      });
      handleOpenChange(false);
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
              <Sparkles className="h-5 w-5 text-primary/60" />
              <DialogTitle className="text-xl">Fikri Düzenle</DialogTitle>
            </div>
            <DialogDescription className="text-muted-foreground/80">
              Fikrinizi güncelleyin
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="edit-idea-content" className="text-sm font-medium">
                Fikir
              </Label>
              <Textarea
                id="edit-idea-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Fikrinizi yazın..."
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
                  disabled={updateIdea.isPending || !content.trim()}
                  className="gap-2"
                >
                  {updateIdea.isPending ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Sparkles className="h-4 w-4" />
                      </motion.div>
                      Güncelleniyor...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
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

