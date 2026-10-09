"use client";

import React from "react";
import { Star } from "lucide-react";

export function LandingTestimonials() {
  const reviews = [
    {
      stars: 5,
      quote:
        "« J'ai divisé mon temps de gestion administrative par 4. Avant, j'oubliais régulièrement d'émettre des factures de solde. Avec les statuts en couleur et le montant clair en FCFA, tout est limpide. »",
      author: "Amadou Diallo",
      role: "Fondateur, Teranga Digital",
      location: "Dakar 🇸🇳",
      initials: "AD",
      avatarBg: "bg-blue-100 text-blue-700",
    },
    {
      stars: 5,
      quote:
        "« Nos clients institutionnels et pétroliers à Douala nous prennent enfin au sérieux. Les factures respectent scrupuleusement la TVA à 19,25% et les exigences CEMAC. Un gain de crédibilité inestimable. »",
      author: "Patricia Eboa",
      role: "Architecte d'intérieur, Prunus Design",
      location: "Douala 🇨🇲",
      initials: "PE",
      avatarBg: "bg-teal-100 text-teal-700",
    },
    {
      stars: 5,
      quote:
        "« Le calcul automatique de TVA et le suivi en FCFA ont tout simplement sauvé ma trésorerie. Les relances douces par WhatsApp ont permis de récupérer plus de 2 millions d'arriérés en 3 semaines. »",
      author: "Kouamé Yao",
      role: "Consultant IT Cloud",
      location: "Abidjan 🇨🇮",
      initials: "KY",
      avatarBg: "bg-indigo-100 text-indigo-700",
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-white" id="temoignages">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16 sm:mb-20">
          <span className="text-xs uppercase font-extrabold tracking-widest text-blue-600 bg-blue-50 border border-blue-200/70 px-3.5 py-1 rounded-full">
            Témoignages Réels
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight landing-text-balance">
            Approuvé par les bâtisseurs du continent
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Découvrez pourquoi les chefs d'entreprise à Dakar, Douala et Abidjan ont abandonné Excel.
          </p>
        </div>

        {/* 3 Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((r) => (
            <div
              key={r.author}
              className="bg-[#FAFAFC] border border-slate-200/90 rounded-2xl p-6 sm:p-8 flex flex-col justify-between landing-card-soft"
            >
              <div className="space-y-4">
                {/* 5 Golden Stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: r.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-slate-700 text-sm leading-relaxed italic">{r.quote}</p>
              </div>

              {/* Author Info */}
              <div className="pt-6 mt-6 border-t border-slate-200/80 flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full ${r.avatarBg} font-bold flex items-center justify-center text-sm shrink-0`}
                >
                  {r.initials}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{r.author}</h4>
                  <p className="text-xs text-slate-500">
                    {r.role} • {r.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
