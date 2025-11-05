"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useUpdateTopic } from "@/hooks/use-topics";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface EditTopicDialogProps {
  topicId: string;
  currentTitle: string;
  currentDescription?: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTopicDialog({
  topicId,
  currentTitle,
  currentDescription,
  open,
  onOpenChange,
}: EditTopicDialogProps) {
  const updateTopic = useUpdateTopic();
  const [title, setTitle] = useState(currentTitle);
  const [description, setDescription] = useState(currentDescription || "");

  // Reset content when dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setTitle(currentTitle);
      setDescription(currentDescription ?? "");
    }
    onOpenChange(newOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await updateTopic.mutateAsync({
        topicId,
        title: title.trim(),
        description: description.trim() || undefined,
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
              <DialogTitle className="text-xl">Konuyu Düzenle</DialogTitle>
            </div>
            <DialogDescription className="text-muted-foreground/80">
              Konu başlığını ve açıklamasını güncelleyin
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="edit-topic-title" className="text-sm font-medium">
                Başlık
              </Label>
              <Input
                id="edit-topic-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Konu başlığı..."
                required
                className="border-border/40 focus:border-primary/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-topic-description" className="text-sm font-medium">
                Açıklama (İsteğe bağlı)
              </Label>
              <Textarea
                id="edit-topic-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Konu açıklaması..."
                rows={3}
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
                  disabled={updateTopic.isPending || !title.trim()}
                  className="gap-2"
                >
                  {updateTopic.isPending ? (
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

