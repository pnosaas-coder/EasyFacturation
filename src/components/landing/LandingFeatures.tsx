"use client";

import React from "react";
import { FileCheck, Percent, MessageSquare, RefreshCw, CheckCircle2 } from "lucide-react";

export function LandingFeatures() {
  const features = [
    {
      icon: <FileCheck className="w-6 h-6 text-white" />,
      bgIcon: "bg-blue-600 shadow-blue-600/25",
      title: "Factures professionnelles en 2 clics",
      description:
        "Générez des factures PDF irréprochables avec votre logo d'entreprise, vos coordonnées bancaires (UBA, Ecobank, Société Générale, etc.) et les mentions légales obligatoires OHADA (NIU & RCCM).",
      pillLabel: "Export PDF vectoriel ultra-léger",
      pillBadge: "Prêt à envoyer",
      pillBadgeColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    },
    {
      icon: <Percent className="w-6 h-6 text-white" />,
      bgIcon: "bg-teal-500 shadow-teal-500/25",
      title: "TVA 19,25% & 18% calculée automatiquement",
      description:
        "Zéro erreur de calcul fiscal. Choisissez votre taux selon votre juridiction (CEMAC 19,25% ou UEMOA 18%), l'application calcule instantanément le Hors Taxes, la TVA légale et le Net à Payer en FCFA.",
      pillLabel: "Sélection automatique CEMAC / UEMOA",
      pillBadge: "Zéro pénalité DGI",
      pillBadgeColor: "text-blue-700 bg-blue-50 border-blue-200",
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-white" />,
      bgIcon: "bg-amber-500 shadow-amber-500/25",
      title: "Suivi en temps réel & relances WhatsApp",
      description:
        "Visualisez en un clin d'œil ce qui est payé, en attente ou en retard. Activez des rappels personnalisés pré-rédigés courtois par WhatsApp pour vous faire payer 2 fois plus vite.",
      pillLabel: "Relance par WhatsApp & Email",
      pillBadge: "Gain de trésorerie",
      pillBadgeColor: "text-amber-700 bg-amber-50 border-amber-200",
    },
    {
      icon: <RefreshCw className="w-6 h-6 text-white" />,
      bgIcon: "bg-indigo-600 shadow-indigo-600/25",
      title: "Répertoire clients & devis convertibles",
      description:
        "Conservez les coordonnées de vos clients et votre catalogue de services ou produits en FCFA. Transformez un devis accepté en facture officielle en un clic sans aucune ressaisie.",
      pillLabel: "Conversion Devis ➔ Facture",
      pillBadge: "1 clic chrono",
      pillBadgeColor: "text-indigo-700 bg-indigo-50 border-indigo-200",
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-white" id="fonctionnalites">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16 sm:mb-20">
          <span className="text-xs uppercase font-extrabold tracking-widest text-blue-600 bg-blue-50 border border-blue-200/70 px-3.5 py-1 rounded-full">
            Fonctionnalités Clés
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight landing-text-balance">
            Tout ce dont vous avez besoin pour facturer comme un pro.
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Conçu pour être d'une clarté absolue, sans jargon comptable complexe.
          </p>
        </div>

        {/* 2x2 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-[#F8FAFC] border border-slate-200/90 rounded-3xl p-7 sm:p-9 lg:p-10 hover:border-blue-500/40 hover:bg-white landing-card-soft transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div
                  className={`w-12 h-12 rounded-2xl ${f.bgIcon} flex items-center justify-center mb-6 shadow-md`}
                >
                  {f.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">{f.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm mb-6">{f.description}</p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 flex items-center justify-between">
                <span className="font-semibold text-slate-900 dark:text-slate-100 truncate pr-2">
                  {f.pillLabel}
                </span>
                <span
                  className={`font-bold px-2 py-0.5 rounded border text-[11px] shrink-0 ${f.pillBadgeColor}`}
                >
                  {f.pillBadge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
