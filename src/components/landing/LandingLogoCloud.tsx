"use client";

import React from "react";

export function LandingLogoCloud() {
  const partnerLogos = [
    {
      name: "KEMET STUDIO",
      location: "Douala",
      icon: (
        <span className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-black shadow-xs">
          K
        </span>
      ),
    },
    {
      name: "BAOBAB TECH",
      location: "Dakar",
      icon: (
        <svg className="w-5 h-5 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 22h20L12 2zm0 5l5.5 11h-11L12 7z" />
        </svg>
      ),
    },
    {
      name: "SAHEL CONSULTING",
      location: "Yaoundé",
      icon: (
        <span className="w-5 h-5 rounded-full border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold">
          ●
        </span>
      ),
    },
    {
      name: "TERANGA MEDIA",
      location: "Abidjan",
      icon: (
        <svg
          className="w-5 h-5 text-slate-900"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M13 10V3L4 14h7v7l9-11h-7z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
          />
        </svg>
      ),
    },
    {
      name: "PALM CAPITAL",
      location: "Libreville",
      icon: (
        <span className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-900 flex items-center justify-center text-xs font-bold">
          🌴
        </span>
      ),
    },
    {
      name: "AKWA VENTURES",
      location: "Douala",
      icon: (
        <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-black shadow-xs">
          AV
        </span>
      ),
    },
    {
      name: "BASTOS SOLUTIONS",
      location: "Yaoundé",
      icon: (
        <span className="w-5 h-5 rounded-full border-2 border-indigo-600 text-indigo-700 flex items-center justify-center text-[10px] font-black">
          BS
        </span>
      ),
    },
    {
      name: "EQUATORIAL CORP",
      location: "CEMAC",
      icon: (
        <span className="w-6 h-6 rounded-lg bg-emerald-700 text-white flex items-center justify-center text-xs font-bold shadow-xs">
          EQ
        </span>
      ),
    },
  ];

  // Duplication pour un défilement infini fluide et continu sans saut
  const duplicatedLogos = [...partnerLogos, ...partnerLogos];

  return (
    <section className="py-10 sm:py-12 border-y border-slate-200/80 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-6">
        <p className="text-[11px] sm:text-xs uppercase tracking-widest font-bold text-slate-500">
          Ils font confiance à EasyFacturation PRO à Douala, Yaoundé, Abidjan et Dakar
        </p>
      </div>

      {/* Bandeau de défilement permanent (Marquee infini avec masques estompés aux bords) */}
      <div
        className="landing-marquee-wrapper"
        aria-label="Entreprises partenaires qui nous font confiance"
      >
        <div className="landing-marquee-track">
          {duplicatedLogos.map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="landing-marquee-item"
            >
              {logo.icon}
              <span className="tracking-tight">{logo.name}</span>
              <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">
                {logo.location}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
