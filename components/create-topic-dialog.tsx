"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCreateTopic } from "@/hooks/use-topics";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";

export function CreateTopicDialog() {
  const createTopic = useCreateTopic();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await createTopic.mutateAsync({
        title: title.trim(),
        description: description.trim() || undefined,
      });
      setTitle("");
      setDescription("");
      setOpen(false);
    } catch {
      // Error handling is done in the hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button className="gap-2 border-border/40">
            <Plus className="h-4 w-4" />
            Yeni Konu
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] border-border/40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-primary/60" />
              <DialogTitle className="text-2xl">Yeni Beyin Fırtınası</DialogTitle>
            </div>
            <DialogDescription className="text-muted-foreground/80">
              Yeni bir konu oluşturun ve fikirleri toplayın
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5 mt-6">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-2"
            >
              <Label htmlFor="title" className="text-sm font-medium">
                Başlık *
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Konu başlığı"
                required
                className="border-border/40 focus:border-primary/50"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <Label htmlFor="description" className="text-sm font-medium">
                Açıklama
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Konu hakkında açıklama (opsiyonel)"
                rows={4}
                className="border-border/40 focus:border-primary/50 resize-none"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex justify-end gap-3 pt-2"
            >
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
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
                  disabled={createTopic.isPending}
                  className="gap-2"
                >
                  {createTopic.isPending ? (
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
                      Oluşturuluyor...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Oluştur
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
