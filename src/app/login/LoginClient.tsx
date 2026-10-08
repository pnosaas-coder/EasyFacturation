"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Building2,
  ArrowRight,
  Sparkles,
  Loader2,
  Sun,
  Moon,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { loginAction, registerAction } from "../../lib/actions/auth";
import { useTheme } from "../../components/shared/ThemeProvider";

export function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";

  const { theme, toggleTheme } = useTheme();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("Prunus Engineering SARL");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    if (tab === "register") {
      formData.append("fullName", fullName);
      formData.append("companyName", companyName);
      const res = await registerAction(formData);
      setLoading(false);

      if (!res.success) {
        setErrorMsg(res.error || "Échec de l'inscription.");
        toast.error(res.error || "Erreur lors de la création de compte.");
      } else {
        toast.success("Compte créé avec succès ! Bienvenue sur EasyFacturation PRO.");
        const targetUrl = redirectTo && !redirectTo.startsWith("/login") ? redirectTo : "/";
        window.location.href = targetUrl;
      }
    } else {
      const res = await loginAction(formData);
      setLoading(false);

      if (!res.success) {
        setErrorMsg(res.error || "Échec de la connexion.");
        toast.error(res.error || "Erreur de connexion.");
      } else {
        toast.success(`Bienvenue, ${res.user?.fullName || "sur EasyFacturation PRO"} !`);
        const targetUrl = redirectTo && !redirectTo.startsWith("/login") ? redirectTo : "/";
        window.location.href = targetUrl;
      }
    }
  };

  const handleQuickLoginFounder = async () => {
    setEmail("contact@prunus-engineering.cm");
    setPassword("Prunus2026!*");
    setErrorMsg(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("email", "contact@prunus-engineering.cm");
    formData.append("password", "Prunus2026!*");

    const res = await loginAction(formData);
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || "Erreur de connexion rapide.");
      toast.error(res.error || "Échec de la connexion rapide.");
    } else {
      toast.success("Connexion réussie : Bienvenue Philippe NOUGOUE !");
      const targetUrl = redirectTo && !redirectTo.startsWith("/login") ? redirectTo : "/";
      window.location.href = targetUrl;
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-200">
      {/* Decorative gradient background glows */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

      {/* Top right theme toggle */}
      <div className="absolute top-6 right-6 z-20">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Mode clair" : "Mode sombre"}
          className="flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white/90 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-md transition-all duration-200 hover:border-blue-400 hover:bg-white hover:text-blue-600 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-amber-400"
        >
          {theme === "dark" ? (
            <>
              <Sun className="h-4 w-4 text-amber-400" />
              <span>Clair</span>
            </>
          ) : (
            <>
              <Moon className="h-4 w-4 text-slate-600" />
              <span>Sombre</span>
            </>
          )}
        </button>
      </div>

      {/* Main card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-3xl border border-slate-200/90 bg-white/90 p-8 shadow-2xl backdrop-blur-2xl transition-all duration-300 dark:border-slate-800/80 dark:bg-slate-900/90 sm:p-10">
          {/* Header & Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 mb-4 transition-transform duration-200 hover:scale-105">
              <ShieldCheck className="h-8 w-8" />
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              EasyFacturation <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">PRO</span>
            </h1>

            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
              Plateforme SaaS pour entrepreneurs • Cameroun & CEMAC
            </p>

            <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-blue-200/60 bg-blue-50/70 px-3 py-0.5 text-[11px] font-semibold text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-300">
              <Building2 className="h-3 w-3" />
              <span>Prunus Engineering SARL</span>
            </div>
          </div>

          {/* Quick Login Button (Founder shortcut) */}
          <button
            type="button"
            onClick={handleQuickLoginFounder}
            disabled={loading}
            className="w-full mb-6 flex items-center justify-between gap-2 rounded-2xl border border-amber-300/80 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3 text-left transition-all duration-200 hover:border-amber-400 hover:shadow-md hover:shadow-amber-500/10 active:scale-[0.99] dark:border-amber-500/30 dark:from-amber-950/20 dark:to-orange-950/20 cursor-pointer disabled:opacity-60"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-sm font-bold text-xs">
                PN
              </div>
              <div>
                <p className="text-xs font-bold text-amber-950 dark:text-amber-200 flex items-center gap-1">
                  Connexion Fondateur <Sparkles className="h-3 w-3 text-amber-500 inline" />
                </p>
                <p className="text-[11px] text-amber-800/80 dark:text-amber-300/70">
                  Philippe NOUGOUE • 1 clic
                </p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
          </button>

          {/* Tab Switcher */}
          <div className="grid grid-cols-2 gap-1 rounded-2xl bg-slate-100 p-1 mb-6 dark:bg-slate-800/80">
            <button
              type="button"
              onClick={() => {
                setTab("login");
                setErrorMsg(null);
              }}
              className={`rounded-xl py-2 text-xs font-bold transition-all duration-200 cursor-pointer ${
                tab === "login"
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Se connecter
            </button>
            <button
              type="button"
              onClick={() => {
                setTab("register");
                setErrorMsg(null);
              }}
              className={`rounded-xl py-2 text-xs font-bold transition-all duration-200 cursor-pointer ${
                tab === "register"
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Créer un compte
            </button>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-5 flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50/90 p-3 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
              <div className="flex-1 font-medium">{errorMsg}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === "register" && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Nom complet
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ex: Philippe NOUGOUE"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 dark:border-slate-800 dark:bg-slate-800/50 dark:text-white dark:focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Raison sociale / Entreprise
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Prunus Engineering SARL"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 dark:border-slate-800 dark:bg-slate-800/50 dark:text-white dark:focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@prunus-engineering.cm"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 dark:border-slate-800 dark:bg-slate-800/50 dark:text-white dark:focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-10 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 dark:border-slate-800 dark:bg-slate-800/50 dark:text-white dark:focus:border-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-600/40 active:translate-y-0 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Traitement en cours...</span>
                </>
              ) : tab === "login" ? (
                <>
                  <span>Se connecter</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  <span>Créer mon compte</span>
                  <CheckCircle2 className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Security & mentions */}
          <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Sécurisé par Supabase Cloud & RLS • OHADA / DGI Cameroun
            </p>
            <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
              MTN MoMo (*126#) • Orange Money (*150#) • TVA 19,25%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
