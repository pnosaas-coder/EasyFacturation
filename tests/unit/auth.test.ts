import { describe, it, expect, vi } from "vitest";
import { loginAction, registerAction, logoutAction } from "../../src/lib/actions/auth";

describe("Authentification Supabase", () => {
  it("rejette la connexion avec des identifiants manquants", async () => {
    const formData = new FormData();
    const res = await loginAction(formData);
    expect(res.success).toBe(false);
    expect(res.error).toContain("obligatoires");
  });

  it("rejette l'inscription avec un mot de passe trop court (< 6 caractères)", async () => {
    const formData = new FormData();
    formData.append("email", "test@prunus-engineering.cm");
    formData.append("password", "123");
    formData.append("fullName", "Test User");

    const res = await registerAction(formData);
    expect(res.success).toBe(false);
    expect(res.error).toContain("au moins 6 caractères");
  });

  it("rejette la connexion avec un mot de passe incorrect", async () => {
    const formData = new FormData();
    formData.append("email", "contact@prunus-engineering.cm");
    formData.append("password", "MauvaisMotDePasse123!");

    const res = await loginAction(formData);
    expect(res.success).toBe(false);
  });

  it("authentifie avec succès le compte fondateur de Philippe NOUGOUE", async () => {
    const formData = new FormData();
    formData.append("email", "contact@prunus-engineering.cm");
    formData.append("password", "Prunus2026!*");

    const res = await loginAction(formData);
    expect(res.success).toBe(true);
    expect(res.user?.email).toBe("contact@prunus-engineering.cm");
    expect(res.user?.fullName).toBe("Philippe NOUGOUE");
  });

  it("exécute la déconnexion avec succès", async () => {
    const res = await logoutAction();
    expect(res.success).toBe(true);
  });
});
