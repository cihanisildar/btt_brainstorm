import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Get the correct redirect URL
      const forwardedHost = request.headers.get("x-forwarded-host");
      const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
      
      // Use environment variable for production URL if available
      let siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                    (forwardedHost ? `${forwardedProto}://${forwardedHost}` : origin);
      
      // Remove trailing slash if present
      siteUrl = siteUrl.replace(/\/+$/, '');
      
      // Ensure next starts with /
      const redirectPath = next.startsWith('/') ? next : `/${next}`;
      
      return NextResponse.redirect(`${siteUrl}${redirectPath}`);
    }
  }

  // return the user to an error page with instructions
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
  let siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                (forwardedHost ? `${forwardedProto}://${forwardedHost}` : origin);
  
  // Remove trailing slash if present
  siteUrl = siteUrl.replace(/\/+$/, '');
  
  return NextResponse.redirect(`${siteUrl}/auth/auth-code-error`);
}

