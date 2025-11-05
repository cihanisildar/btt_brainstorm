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
      // Get the correct site URL
      // In production, always use environment variable or current origin (should be production)
      let siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
      
      // Remove trailing slash if present
      if (siteUrl) {
        siteUrl = siteUrl.replace(/\/+$/, '');
      }
      
      // If no env var, use current origin but check if it's localhost
      if (!siteUrl) {
        const currentOrigin = window.location.origin;
        // If we're on localhost in production (shouldn't happen), log error
        if (currentOrigin.includes('localhost') && process.env.NODE_ENV === 'production') {
          console.error('ERROR: Running in production but detected localhost. Set NEXT_PUBLIC_SITE_URL environment variable.');
        }
        siteUrl = currentOrigin;
      }
      
      // Debug: Log the URL being used
      const redirectUrl = `${siteUrl}/auth/callback`;
      console.log('[useLogin] Current origin:', window.location.origin);
      console.log('[useLogin] NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL);
      console.log('[useLogin] Using redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (data?.url) {
        console.log('[useLogin] Supabase redirect URL:', data.url);
      }

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

