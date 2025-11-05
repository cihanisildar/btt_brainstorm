"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCreateIdea } from "@/hooks/use-ideas";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Send } from "lucide-react";

interface CreateIdeaFormProps {
  topicId: string;
}

export function CreateIdeaForm({ topicId }: CreateIdeaFormProps) {
  const createIdea = useCreateIdea();
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await createIdea.mutateAsync({
        topicId,
        content: content.trim(),
      });
      setContent("");
    } catch {
      // Error handling is done in the hook
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="idea-content" className="text-sm font-medium flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary/60" />
          Fikriniz
        </Label>
        <Textarea
          id="idea-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Fikrinizi yazın..."
          rows={4}
          required
          className="border-border/40 focus:border-primary/50 resize-none"
        />
      </div>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex justify-end"
      >
        <Button
          type="submit"
          disabled={createIdea.isPending || !content.trim()}
          className="gap-2"
        >
          {createIdea.isPending ? (
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
              Ekleniyor...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Fikir Ekle
            </>
          )}
        </Button>
      </motion.div>
    </motion.form>
  );
}
