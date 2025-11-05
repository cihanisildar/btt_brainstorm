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
    
    // Use environment variable for production URL, fallback to current origin
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    
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

