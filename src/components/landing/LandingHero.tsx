"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Play, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { HeroDashboardPreview } from "./HeroDashboardPreview";

export function LandingHero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-white via-slate-50/60 to-slate-100/50">
      {/* Decorative Ambient Background Glows */}
      <div className="landing-glow-ambient absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] md:w-[850px] h-[350px] bg-blue-100/70 blur-[130px] pointer-events-none rounded-full -z-10" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-teal-100/40 blur-[110px] pointer-events-none rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Hero Content */}
        <div className="max-w-4xl mx-auto text-center space-y-5 sm:space-y-6">
          {/* Announcement Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs sm:text-sm font-semibold landing-badge-glow">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="truncate max-w-[280px] sm:max-w-none">
              Nouveau : Calcul automatique de la TVA (19,25% &amp; 18%) &amp; paiements mobiles FCFA
            </span>
          </div>

          {/* Punchy Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.08] landing-text-balance">
            Fini les factures sur Word et Excel.
            <br className="hidden sm:inline" />
            <span className="relative inline-block mt-2">
              <span className="text-blue-600">Facturez en quelques clics.</span>
              {/* Curved Hand-Drawn Underline SVG Accent */}
              <svg
                className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-3 sm:h-4 text-blue-600/35"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 250 12"
              >
                <path
                  d="M2 9.5C65 2.5 185 2 248 8.5"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="4"
                />
              </svg>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed landing-text-balance pt-1">
            Le logiciel de facturation simple, rapide et conforme conçu spécialement pour les
            entrepreneurs, PME et consultants d'Afrique Centrale et de l'Ouest.
          </p>

          {/* Dual CTAs (Responsive Mobile First) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3">
            <Link
              href="/login?mode=register"
              className="landing-btn-cta-primary w-full sm:w-auto inline-flex items-center justify-center gap-2.5 text-base font-bold text-white px-7 py-4 rounded-xl"
            >
              <span>Commencer gratuitement</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            <a
              href="#comment-ca-marche"
              className="landing-btn-cta-secondary w-full sm:w-auto inline-flex items-center justify-center gap-2 text-base font-semibold px-6 py-4 rounded-xl"
            >
              <Play className="w-4 h-4 text-blue-600 fill-blue-600" />
              <span>Voir comment ça marche</span>
            </a>
          </div>

          {/* Micro Trust Proof */}
          <p className="text-xs sm:text-sm text-slate-500 font-medium pt-1 flex items-center justify-center gap-2">
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Sans carte bancaire
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              100% conforme zone CEMAC &amp; UEMOA
            </span>
          </p>
        </div>

        {/* Hero Dashboard Preview Card */}
        <HeroDashboardPreview />
      </div>
    </section>
  );
}
