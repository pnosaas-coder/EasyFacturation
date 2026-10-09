import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wpiacsyiluhmjswdoshb.supabase.co";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwaWFjc3lpbHVobWpzd2Rvc2hiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0NTkxNzcsImV4cCI6MjEwNzAzNTE3N30.dzskRIq4N_PtxyWKdtgW4fCmuoLu8uXmB5gWrCsWo1I";

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: Ne JAMAIS rediriger les requêtes de Server Actions (POST ou header next-action)
  // Une redirection HTTP (307) sur une Server Action empêche le retour RSC et produit l'erreur :
  // "An unexpected response was received from the server"
  const isServerAction = request.headers.has("next-action") || request.method === "POST";
  if (isServerAction) {
    return supabaseResponse;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isPublicPage = pathname === "/" || isAuthPage;

  // Si l'utilisateur n'est pas connecté et tente d'accéder à une page protégée
  if (!user && !isPublicPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", pathname);
    const redirectResponse = NextResponse.redirect(url);
    // Transférer les cookies gérés par Supabase sur la réponse de redirection
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });
    return redirectResponse;
  }

  // Note: On ne redirige plus automatiquement un utilisateur connecté vers /dashboard
  // lorsqu'il visite explicitement /login, afin de lui permettre de voir l'écran de connexion,
  // de changer de compte ou de revenir sur la landing page.

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Protège toutes les routes de l'application sauf :
     * - _next/static, _next/image
     * - favicon.ico, images statiques (.svg, .png, .jpg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
