"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function useAuth() {
  const supabase = createClient();

  return useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    },
  });
}

export function useLogin() {
  const supabase = createClient();

  return useMutation({
    mutationFn: async () => {
      // Use environment variable for production URL, fallback to current origin
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${siteUrl}/auth/callback`,
        },
      });

      if (error) {
        throw new Error(error.message);
      }
    },
  });
}

export function useLogout() {
  const supabase = createClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      router.push("/auth/login");
    },
  });
}

