"use client";

import React from "react";
import { AlertCircle, Calculator, Clock, FileWarning } from "lucide-react";

export function LandingProblems() {
  const problems = [
    {
      icon: <FileWarning className="w-6 h-6 text-red-500" />,
      bgIcon: "bg-red-50",
      title: "Factures artisanales non professionnelles",
      description:
        "Des templates Word cassés, des polices disparates et des mises en page floues qui décrédibilisent votre entreprise face aux grands comptes, ministères et multinationales.",
    },
    {
      icon: <Calculator className="w-6 h-6 text-amber-500" />,
      bgIcon: "bg-amber-50",
      title: "Calculs manuels et casse-tête fiscal",
      description:
        "Erreurs fréquentes d'arrondi sur la TVA à 19,25% (Cameroun/CEMAC) ou 18% (UEMOA/Côte d'Ivoire), entraînant des pénalités financières lourdes lors des contrôles fiscaux.",
    },
    {
      icon: <Clock className="w-6 h-6 text-blue-600" />,
      bgIcon: "bg-blue-50",
      title: "Suivi des impayés quasi impossible",
      description:
        "Oubli des échéances, relances manuelles gênantes par WhatsApp ou appels désordonnés. Votre trésorerie stagne dans les comptes de vos clients au lieu du vôtre.",
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#FAFAFC]" id="constat">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-14 sm:mb-16">
          <span className="text-xs uppercase font-extrabold tracking-widest text-blue-600 bg-blue-50 border border-blue-200/70 px-3.5 py-1 rounded-full">
            Le constat
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight landing-text-balance">
            La facturation traditionnelle vous fait perdre du temps et de l'argent.
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            90% des entrepreneurs en Afrique francophone utilisent encore Word ou Excel. Voici
            pourquoi cela freine votre croissance :
          </p>
        </div>

        {/* 3 Pain Point Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {problems.map((p) => (
            <div
              key={p.title}
              className="bg-white rounded-2xl p-7 sm:p-8 border border-slate-200/90 landing-card-soft group"
            >
              <div
                className={`w-12 h-12 rounded-xl ${p.bgIcon} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200 shadow-xs`}
              >
                {p.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{p.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
