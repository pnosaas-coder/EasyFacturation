"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

export function LandingCtaBanner() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-[#0B132B] p-8 sm:p-14 lg:p-16 text-center text-white relative overflow-hidden shadow-2xl">
          {/* Subtle Decorative Ambient Circles */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -left-20 -top-20 w-60 h-60 rounded-full bg-teal-400/10 pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Prêt pour booster votre trésorerie</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight landing-text-balance">
              Rejoignez les entrepreneurs qui facturent comme des pros.
            </h2>

            <p className="text-blue-100 text-base sm:text-lg max-w-xl mx-auto">
              Démarrez gratuitement en moins d'une minute. Aucune carte bancaire requise pour tester.
            </p>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login?mode=register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-base font-bold text-blue-700 bg-white hover:bg-blue-50 px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-97 transition-all duration-200"
              >
                <span>Commencer gratuitement</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <p className="text-xs text-blue-200 pt-1 flex items-center justify-center gap-2 flex-wrap">
              <span>✓ Configuration express</span>
              <span>•</span>
              <span>100% en ligne</span>
              <span>•</span>
              <span>Support WhatsApp disponible 7j/7</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
