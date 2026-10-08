"use server";

import { createSSRClient } from "../supabase/server";
import { revalidatePath } from "next/cache";

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    email: string;
    fullName?: string;
  };
}

/**
 * Connexion d'un utilisateur existant avec email et mot de passe
 */
export async function loginAction(formData: FormData): Promise<AuthResult> {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "L'adresse email et le mot de passe sont obligatoires." };
  }

  try {
    const supabase = await createSSRClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        return { success: false, error: "Identifiants incorrects. Veuillez vérifier l'email et le mot de passe." };
      }
      return { success: false, error: error.message };
    }

    try {
      revalidatePath("/", "layout");
    } catch {
      // Ignored in test runner
    }
    return {
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email || email,
        fullName: data.user.user_metadata?.full_name || "Utilisateur",
      },
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Erreur inattendue lors de la connexion.",
    };
  }
}

/**
 * Création d'un nouveau compte utilisateur
 */
export async function registerAction(formData: FormData): Promise<AuthResult> {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const fullName = (formData.get("fullName") as string)?.trim() || "";
  const companyName = (formData.get("companyName") as string)?.trim() || "Prunus Engineering SARL";

  if (!email || !password) {
    return { success: false, error: "L'adresse email et le mot de passe sont obligatoires." };
  }

  if (password.length < 6) {
    return { success: false, error: "Le mot de passe doit comporter au moins 6 caractères." };
  }

  try {
    const supabase = await createSSRClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          company: companyName,
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: "Impossible de créer l'utilisateur." };
    }

    try {
      revalidatePath("/", "layout");
    } catch {
      // Ignored in test runner
    }
    return {
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email || email,
        fullName: fullName || "Utilisateur",
      },
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Erreur inattendue lors de l'inscription.",
    };
  }
}

/**
 * Déconnexion de l'utilisateur actif
 */
export async function logoutAction(): Promise<{ success: boolean }> {
  try {
    const supabase = await createSSRClient();
    await supabase.auth.signOut();
    try {
      revalidatePath("/", "layout");
    } catch {
      // Ignored in test runner
    }
    return { success: true };
  } catch {
    return { success: false };
  }
}

/**
 * Récupère l'utilisateur actuellement authentifié
 */
export async function getCurrentUser() {
  try {
    const supabase = await createSSRClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    return {
      id: user.id,
      email: user.email || "",
      fullName: user.user_metadata?.full_name || "Philippe NOUGOUE",
      company: user.user_metadata?.company || "Prunus Engineering SARL",
    };
  } catch {
    return null;
  }
}
