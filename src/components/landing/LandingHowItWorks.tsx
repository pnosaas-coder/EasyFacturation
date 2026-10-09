"use client";

import React from "react";
import { Zap, Target, DollarSign } from "lucide-react";

export function LandingHowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Inscris-toi en 30 secondes",
      description:
        "Indique simplement ton nom, ton pays et le nom de ton entreprise. Aucune carte bancaire requise pour démarrer.",
      tag: "⚡ Accès immédiat",
      tagColor: "text-teal-400 bg-teal-950/70 border-teal-800/60",
    },
    {
      num: "02",
      title: "Crée ta première facture",
      description:
        "Renseigne ton client, ajoute tes prestations en FCFA. La TVA légale (19,25% ou 18%) et les remises s'appliquent toutes seules.",
      tag: "🎯 Zéro erreur de calcul",
      tagColor: "text-blue-400 bg-blue-950/70 border-blue-800/60",
    },
    {
      num: "03",
      title: "Envoie & Encaisse",
      description:
        "Partage le PDF professionnel par WhatsApp ou par e-mail. Dès que le virement ou Mobile Money arrive, marque « Payé » en 1 clic.",
      tag: "💰 Trésorerie sécurisée",
      tagColor: "text-emerald-400 bg-emerald-950/70 border-emerald-800/60",
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#0B111E] text-white relative overflow-hidden" id="comment-ca-marche">
      {/* Decorative Blue & Teal Ambient Glows */}
      <div className="absolute -top-40 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 left-0 w-96 h-96 bg-teal-500/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16 sm:mb-20">
          <span className="text-xs uppercase font-extrabold tracking-widest text-teal-400 bg-teal-950/80 border border-teal-800/60 px-3.5 py-1 rounded-full">
            Simplicité Radicale
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight landing-text-balance">
            Comment ça marche ?
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Aucun manuel requis. Vous commencez à facturer en 3 étapes évidentes.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((s) => (
            <div
              key={s.num}
              className="relative bg-[#111A2E] border border-slate-800 rounded-3xl p-7 sm:p-8 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="text-4xl sm:text-5xl font-extrabold text-blue-500/30 mb-4 select-none">
                  {s.num}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">{s.description}</p>
              </div>

              <div className="pt-2">
                <span
                  className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg border ${s.tagColor}`}
                >
                  {s.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
