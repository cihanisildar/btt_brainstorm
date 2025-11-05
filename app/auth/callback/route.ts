import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  // Get the correct redirect URL - prioritize environment variable
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
  
  // Always use environment variable if available, otherwise use request headers
  let siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  
  if (!siteUrl && forwardedHost) {
    siteUrl = `${forwardedProto}://${forwardedHost}`;
  }
  
  if (!siteUrl) {
    // Fallback: construct from request URL
    const requestUrl = new URL(request.url);
    siteUrl = `${requestUrl.protocol}//${requestUrl.host}`;
  }
  
  // Remove trailing slash if present
  siteUrl = siteUrl.replace(/\/+$/, '');
  
  // Debug logging (remove in production if needed)
  console.log('[Callback] Site URL:', siteUrl);
  console.log('[Callback] Code:', code ? 'present' : 'missing');
  console.log('[Callback] Next:', next);

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Ensure next starts with /
      const redirectPath = next.startsWith('/') ? next : `/${next}`;
      
      console.log('[Callback] Redirecting to:', `${siteUrl}${redirectPath}`);
      return NextResponse.redirect(`${siteUrl}${redirectPath}`);
    } else {
      console.error('[Callback] Exchange error:', error);
    }
  }

  // return the user to an error page with instructions
  console.log('[Callback] Redirecting to error page');
  return NextResponse.redirect(`${siteUrl}/auth/auth-code-error`);
}

