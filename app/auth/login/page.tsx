"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const supabase = createClient();
    
    // Get the correct site URL
    // In production, always use environment variable or current origin (should be production)
    // Never use localhost in production
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
    console.log('Using redirect URL:', `${siteUrl}/auth/callback`);
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${siteUrl}/auth/callback`,
      },
    });

    if (error) {
      console.error("Error logging in:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Beyin Fırtınası</CardTitle>
          <CardDescription>
            Yeni fikirler üretmek ve paylaşmak için giriş yapın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? "Yükleniyor..." : "Google ile Giriş Yap"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

