"use client";

import React from "react";
import Link from "next/link";
import { Check, X, ArrowRight, Sparkles } from "lucide-react";

export function LandingPricing() {
  return (
    <section className="py-20 sm:py-28 bg-[#FAFAFC]" id="tarifs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16 sm:mb-20">
          <span className="text-xs uppercase font-extrabold tracking-widest text-blue-600 bg-blue-50 border border-blue-200/70 px-3.5 py-1 rounded-full">
            Tarifs Transparents
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight landing-text-balance">
            Un investissement rentabilisé dès votre première facture.
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Tarifs affichés en Francs CFA (XAF / XOF). Sans carte bancaire et sans engagement.
          </p>
        </div>

        {/* 3 Plans Grid (Responsive Mobile First) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Plan Gratuit */}
          <div className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/90 flex flex-col justify-between landing-card-soft">
            <div>
              <div className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">
                Gratuit
              </div>
              <p className="text-xs text-slate-500 mb-6">
                Pour les freelances qui démarrent leur activité.
              </p>

              <div className="flex items-baseline gap-1.5 mb-8">
                <span className="text-4xl sm:text-5xl font-extrabold text-slate-900">0</span>
                <span className="text-sm font-bold text-slate-500">FCFA / mois</span>
              </div>

              <ul className="space-y-3.5 text-sm text-slate-600 mb-8">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
                  <span>Jusqu'à 5 factures / mois</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
                  <span>1 utilisateur actif</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
                  <span>Calcul de TVA de base</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
                  <span>Export PDF standard</span>
                </li>
                <li className="flex items-center gap-2.5 text-slate-400">
                  <X className="w-4 h-4 text-slate-300 stroke-[2]" />
                  <span>Pas de relances automatiques</span>
                </li>
              </ul>
            </div>

            <Link
              href="/login?mode=register"
              className="w-full text-center py-3.5 rounded-xl border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all text-sm block"
            >
              Créer un compte gratuit
            </Link>
          </div>

          {/* Plan Pro (Featured Card) */}
          <div className="bg-white rounded-3xl p-7 sm:p-9 border-2 border-blue-600 relative flex flex-col justify-between landing-card-featured lg:-translate-y-3">
            {/* Featured Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-extrabold uppercase tracking-wider px-4 py-1 rounded-full shadow-md shadow-blue-600/30 flex items-center gap-1.5 whitespace-nowrap">
              <Sparkles className="w-3 h-3 fill-white" />
              <span>Recommandé • Le plus populaire</span>
            </div>

            <div>
              <div className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">
                Plan Pro
              </div>
              <p className="text-xs text-slate-500 mb-6">
                Idéal pour les PME, agences et entrepreneurs actifs.
              </p>

              <div className="flex items-baseline gap-1.5 mb-8">
                <span className="text-4xl sm:text-5xl font-extrabold text-slate-900">5 000</span>
                <span className="text-sm font-bold text-slate-500">FCFA / mois</span>
              </div>

              <ul className="space-y-3.5 text-sm text-slate-700 mb-8">
                <li className="flex items-center gap-2.5 font-medium">
                  <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                  <span>Factures &amp; Devis illimités</span>
                </li>
                <li className="flex items-center gap-2.5 font-medium">
                  <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                  <span>Personnalisation complète (Logo + NIU/RCCM)</span>
                </li>
                <li className="flex items-center gap-2.5 font-medium">
                  <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                  <span>Calcul TVA auto 19,25% &amp; 18%</span>
                </li>
                <li className="flex items-center gap-2.5 font-medium">
                  <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                  <span>Relances automatiques WhatsApp</span>
                </li>
                <li className="flex items-center gap-2.5 font-medium">
                  <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                  <span>Export comptable Excel / DGI</span>
                </li>
                <li className="flex items-center gap-2.5 font-medium">
                  <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                  <span>Support prioritaire 7j/7</span>
                </li>
              </ul>
            </div>

            <Link
              href="/login?mode=register"
              className="landing-btn-cta-primary w-full text-center py-4 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2"
            >
              <span>Essayer gratuitement (14 jours)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Plan Business */}
          <div className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/90 flex flex-col justify-between landing-card-soft">
            <div>
              <div className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">
                Business
              </div>
              <p className="text-xs text-slate-500 mb-6">
                Pour les structures établies et cabinets d'expertise.
              </p>

              <div className="flex items-baseline gap-1.5 mb-8">
                <span className="text-4xl sm:text-5xl font-extrabold text-slate-900">15 000</span>
                <span className="text-sm font-bold text-slate-500">FCFA / mois</span>
              </div>

              <ul className="space-y-3.5 text-sm text-slate-600 mb-8">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
                  <span>Tout ce qui est inclus dans le Plan Pro</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
                  <span>Jusqu'à 10 collaborateurs &amp; rôles</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
                  <span>Multi-devises (FCFA, EUR, USD)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
                  <span>Gestion avancée catalogue &amp; stocks</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
                  <span>Accès dédié pour votre expert-comptable</span>
                </li>
              </ul>
            </div>

            <Link
              href="https://wa.me/237677481161?text=Bonjour,%20je%20souhaite%20en%20savoir%20plus%20sur%20le%20Plan%20Business%20d%27EasyFacturation%20PRO"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-3.5 rounded-xl border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all text-sm block"
            >
              Contacter l'équipe
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
