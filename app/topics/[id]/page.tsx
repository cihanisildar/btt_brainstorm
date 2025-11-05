"use client";

import { useTopic } from "@/hooks/use-topics";
import { useIdeas } from "@/hooks/use-ideas";
import { IdeaCard } from "@/components/idea-card";
import { CommentSection } from "@/components/comment-section";
import { CreateIdeaForm } from "@/components/create-idea-form";
import { SortSelect } from "@/components/sort-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, use } from "react";
import type { SortOption } from "@/types/entities";
import Link from "next/link";
import { ArrowLeft, Sparkles, Brain, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Divider } from "@/components/ui/divider";

interface TopicPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function TopicPage({ params }: TopicPageProps) {
  const { id } = use(params);
  const { data: topic, isLoading: topicLoading } = useTopic(id);
  const [sort, setSort] = useState<SortOption>("newest");
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
  const { data: ideas, isLoading: ideasLoading } = useIdeas(id, sort);

  if (topicLoading) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(0,0,0,0.03)_1px,transparent_0)] bg-[size:24px_24px]" />
        </div>
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
            className="mb-4"
          >
            <Brain className="h-8 w-8 text-primary/40" />
          </motion.div>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-destructive mb-4">Konu bulunamadı</p>
          <Link href="/">
            <Button>Ana Sayfaya Dön</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(0,0,0,0.03)_1px,transparent_0)] bg-[size:24px_24px]" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl"
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <motion.div
              whileHover={{ x: -4 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 border border-border/40"
              >
                <ArrowLeft className="h-4 w-4" />
                Geri
              </Button>
            </motion.div>
          </Link>
        </div>
      </motion.header>

      <main className="container mx-auto px-6 py-12 max-w-5xl">
        {/* Topic Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card className="mb-12 border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <motion.div
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Brain className="h-6 w-6 text-primary/60" />
                    </motion.div>
                    <CardTitle className="text-4xl font-bold tracking-tight">
                      {topic.title}
                    </CardTitle>
                  </div>
                  {topic.description && (
                    <CardDescription className="text-base leading-relaxed text-muted-foreground/80">
                      {topic.description}
                    </CardDescription>
                  )}
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  <Badge
                    variant="secondary"
                    className="border-border/40 bg-secondary/50 backdrop-blur-sm font-normal text-sm px-3 py-1.5"
                  >
                    <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                    {topic.ideas_count || 0} Fikir
                  </Badge>
                </motion.div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        <div className="space-y-8">
          {/* Create Idea Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary/60" />
                  <CardTitle className="text-lg">Yeni Fikir Ekle</CardTitle>
                </div>
                <CardDescription className="text-sm">
                  Bu konuya yeni bir fikir ekleyin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CreateIdeaForm topicId={id} />
              </CardContent>
            </Card>
          </motion.div>

          <Divider delay={0.4} />

          {/* Ideas Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Fikirler</h2>
              <SortSelect value={sort} onValueChange={setSort} />
            </div>

            {ideasLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="mb-4"
                >
                  <Lightbulb className="h-8 w-8 text-primary/40" />
                </motion.div>
                <p className="text-muted-foreground text-sm">Yükleniyor...</p>
              </div>
            ) : ideas && ideas.length > 0 ? (
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {ideas.map((idea, index) => (
                    <motion.div
                      key={idea.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.05,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <IdeaCard
                        idea={idea}
                        index={index}
                        onCommentClick={() =>
                          setSelectedIdeaId(
                            selectedIdeaId === idea.id ? null : idea.id
                          )
                        }
                      />
                      <AnimatePresence>
                        {selectedIdeaId === idea.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 ml-8"
                          >
                            <CommentSection ideaId={idea.id} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                <CardContent className="py-16 text-center">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-4"
                  >
                    <Lightbulb className="h-12 w-12 text-muted-foreground/40 mx-auto" />
                  </motion.div>
                  <p className="text-muted-foreground">
                    Henüz fikir eklenmemiş. İlk fikri siz ekleyin!
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
