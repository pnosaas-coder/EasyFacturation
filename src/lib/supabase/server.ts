import { createServerClient as createSupabaseServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "./database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wpiacsyiluhmjswdoshb.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwaWFjc3lpbHVobWpzd2Rvc2hiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0NTkxNzcsImV4cCI6MjEwNzAzNTE3N30.dzskRIq4N_PtxyWKdtgW4fCmuoLu8uXmB5gWrCsWo1I";

/**
 * Client Supabase pour les Server Components et Server Actions
 * avec gestion des cookies de session et résilience hors-requête (tests)
 */
export async function createSSRClient() {
  let cookieStore: {
    getAll: () => { name: string; value: string }[];
    set: (name: string, value: string, options?: unknown) => void;
  };

  try {
    const nextCookies = await cookies();
    cookieStore = {
      getAll() {
        return nextCookies.getAll();
      },
      set(name, value, options) {
        nextCookies.set(name, value, options as never);
      },
    };
  } catch {
    // Environnement de test unitaire ou hors-requête Next.js
    const memoryCookies = new Map<string, string>();
    cookieStore = {
      getAll() {
        return Array.from(memoryCookies.entries()).map(([name, value]) => ({ name, value }));
      },
      set(name, value) {
        memoryCookies.set(name, value);
      },
    };
  }

  return createSupabaseServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Ignoré si appelé depuis un composant sans droits de mutation de cookie
        }
      },
    },
  });
}
