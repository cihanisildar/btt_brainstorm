"use client";

import { useTopics } from "@/hooks/use-topics";
import { TopicCard } from "@/components/topic-card";
import { CreateTopicDialog } from "@/components/create-topic-dialog";
import { Button } from "@/components/ui/button";
import { useAuth, useLogout } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Sparkles, Brain } from "lucide-react";
import { motion } from "framer-motion";
import { Divider } from "@/components/ui/divider";

export default function HomePage() {
  const { data: topics, isLoading, error } = useTopics();
  const { data: user } = useAuth();
  const logout = useLogout();

  const userInitials = user?.user_metadata?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || user?.email?.[0]?.toUpperCase() || "?";

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
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="flex items-center gap-3"
          >
            <div className="relative">
              <Brain className="h-6 w-6 text-primary" />
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              >
                <Sparkles className="h-3 w-3 text-primary/60" />
              </motion.div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Beyin Fırtınası
            </h1>
          </motion.div>
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CreateTopicDialog />
            </motion.div>
            {user && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 border border-border/40 hover:border-border/60"
                    >
                      <Avatar className="h-7 w-7 border border-border/40">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback className="text-xs">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline text-sm font-medium">
                        {user.user_metadata?.name || user.email}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem disabled>
                      <User className="mr-2 h-4 w-4" />
                      <span>{user.email}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => logout.mutate()}
                      disabled={logout.isPending}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Çıkış Yap</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            )}
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16 max-w-7xl">
        {/* Hero Section */}
        {(!topics || topics.length === 0) && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6"
            >
              <Brain className="h-16 w-16 text-primary/40 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Fikirlerinizi Keşfedin
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Yeni fikirler üretmek ve paylaşmak için ilk konunuzu oluşturun
            </p>
            <CreateTopicDialog />
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24"
          >
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
            <p className="text-muted-foreground">Yükleniyor...</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <p className="text-destructive mb-4">Bir hata oluştu</p>
            <p className="text-muted-foreground text-sm">{error.message}</p>
          </motion.div>
        )}

        {/* Topics Grid */}
        {topics && topics.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold tracking-tight mb-2">
                Aktif Konular
              </h2>
              <p className="text-muted-foreground">
                {topics.length} konu bulundu
              </p>
            </motion.div>
            <Divider delay={0.3} className="mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topics.map((topic, index) => (
                <TopicCard key={topic.id} topic={topic} index={index} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
