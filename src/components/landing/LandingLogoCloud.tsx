"use client";

import React from "react";

export function LandingLogoCloud() {
  const logos = [
    {
      name: "KEMET STUDIO",
      icon: (
        <span className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center text-xs font-black">
          K
        </span>
      ),
    },
    {
      name: "BAOBAB TECH",
      icon: (
        <svg className="w-6 h-6 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 22h20L12 2zm0 5l5.5 11h-11L12 7z" />
        </svg>
      ),
    },
    {
      name: "SAHEL CONSULTING",
      icon: (
        <span className="w-5 h-5 rounded-full border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold">
          ●
        </span>
      ),
    },
    {
      name: "TERANGA MEDIA",
      icon: (
        <svg
          className="w-6 h-6 text-slate-900"
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
      icon: <span className="font-black text-lg">🌴</span>,
    },
  ];

  return (
    <section className="py-12 sm:py-14 border-y border-slate-200/80 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs uppercase tracking-widest font-bold text-slate-600 mb-8">
          Ils font confiance à EasyFacturation à Douala, Abidjan, Dakar et Yaoundé
        </p>

        {/* Logos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8 items-center justify-center opacity-75 grayscale hover:grayscale-0 transition-all duration-300">
          {logos.map((logo, index) => (
            <div
              key={logo.name}
              className={`flex items-center justify-center gap-2 font-bold text-slate-800 text-sm sm:text-base tracking-tight hover:opacity-100 transition-opacity ${
                index === 4 ? "col-span-2 sm:col-span-1" : ""
              }`}
            >
              {logo.icon}
              <span>{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
