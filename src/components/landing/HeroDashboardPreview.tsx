"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Download,
  Calendar,
  Plus,
  Zap,
  MessageCircle,
  Smartphone,
} from "lucide-react";

export function HeroDashboardPreview() {
  const chartMonths = [
    { name: "Mai", fact: 48, enc: 36 },
    { name: "Juin", fact: 56, enc: 48 },
    { name: "Juil", fact: 40, enc: 44 },
    { name: "Août", fact: 64, enc: 52 },
    { name: "Sept", fact: 72, enc: 60 },
    { name: "Oct", fact: 80, enc: 64, current: true },
  ];

  return (
    <div className="relative mt-12 sm:mt-16 max-w-5xl mx-auto px-2 sm:px-0">
      {/* Micro-Animation : Floating Badge 1 (Top Right - MTN MoMo / Orange Money Payment) */}
      <div className="hidden lg:flex landing-float-badge-top absolute -top-6 -right-6 z-20 items-center gap-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 rounded-2xl p-3.5 shadow-xl">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg shadow-xs">
          <Smartphone className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
              Règlement MoMo reçu
            </span>
          </div>
          <div className="text-sm font-extrabold text-slate-900 dark:text-white">
            + 250 000 <span className="text-xs font-semibold text-slate-500">FCFA</span>
          </div>
          <div className="text-[10px] text-slate-400">Orange Money • Réf. OM-94821</div>
        </div>
      </div>

      {/* Micro-Animation : Floating Badge 2 (Bottom Left - WhatsApp 1-Click Reminder) */}
      <div className="hidden lg:flex landing-float-badge-bottom absolute -bottom-6 -left-6 z-20 items-center gap-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 rounded-2xl p-3.5 shadow-xl">
        <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-500/20">
          <MessageCircle className="w-5 h-5 fill-white" />
        </div>
        <div>
          <div className="text-[11px] font-bold text-slate-900 dark:text-white">
            Relance WhatsApp en 1-clic
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <span>✓ Message pré-rempli envoyé</span>
          </div>
          <div className="text-[10px] text-slate-400">Client : TotalEnergies Congo</div>
        </div>
      </div>

      {/* Dashboard Outer Glass Bezel */}
      <div className="relative rounded-2xl sm:rounded-3xl p-2 sm:p-3 bg-gradient-to-b from-slate-200/60 via-slate-100 to-slate-200 dark:from-slate-800/60 dark:via-slate-900 dark:to-slate-800 border border-slate-300/80 dark:border-slate-700/80 landing-dashboard-shadow">
        {/* Dark Dashboard Surface */}
        <div className="bg-[#0B111E] rounded-xl sm:rounded-2xl border border-slate-800 text-slate-100 overflow-hidden shadow-2xl">
          {/* Header Bar */}
          <div className="px-4 sm:px-6 py-3.5 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 bg-[#0B111E]">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Zap className="w-4 h-4 fill-white/20" />
              </div>
              <div className="flex items-center">
                <span className="text-xs font-bold text-white tracking-wide">
                  EasyFacturation
                </span>
                <span className="text-[9px] bg-blue-900/60 text-blue-400 font-semibold px-1.5 py-0.5 rounded ml-1 border border-blue-800/50">
                  PRO
                </span>
                <span className="hidden sm:inline-block text-[11px] text-slate-400 ml-2">
                  Cameroun • CEMAC FCFA
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-[11px] font-medium text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-md border border-slate-700/50 hidden md:inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <span>Ce mois-ci (Octobre 2026)</span>
              </span>
              <div className="px-2.5 py-1 bg-blue-600 text-white rounded-md text-[11px] font-semibold flex items-center gap-1 shadow-xs">
                <Plus className="w-3.5 h-3.5" />
                <span>Nouvelle facture</span>
              </div>
            </div>
          </div>

          {/* Welcome Banner */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 text-white m-3 sm:m-4 rounded-xl shadow-lg relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded text-white inline-block mb-1">
                  Douala &amp; Yaoundé • CEMAC
                </span>
                <h3 className="text-base sm:text-lg font-bold tracking-tight">
                  Bonjour, Ma Personne 👋
                </h3>
                <p className="text-xs text-blue-100 font-normal mt-0.5">
                  Voici le bilan de votre facturation Prunus Engineering SARL. Vous avez{" "}
                  <span className="font-bold underline decoration-amber-300">
                    1 facture à relancer
                  </span>{" "}
                  pour un montant de 1 431 000 FCFA.
                </p>
              </div>
              <div className="flex items-center">
                <span className="px-3 py-1.5 rounded-lg bg-white text-blue-700 font-bold text-xs shadow-sm hover:bg-blue-50 transition cursor-pointer select-none">
                  Relancer en 1-clic
                </span>
              </div>
            </div>
          </div>

          {/* 4 Financial KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 p-3 sm:p-4 pt-0">
            {/* Montant facturé */}
            <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-3 sm:p-4">
              <div className="flex items-center justify-between text-slate-400 mb-1.5">
                <span className="text-[11px] font-medium truncate">Montant facturé</span>
                <div className="w-6 h-6 rounded bg-blue-950 text-blue-400 flex items-center justify-center text-xs">
                  <FileText className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-sm sm:text-lg font-extrabold text-white tracking-tight">
                10 672 875{" "}
                <span className="text-[10px] sm:text-xs font-semibold text-slate-400">
                  FCFA
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] mt-1.5 text-slate-400">
                <span>4 factures émises</span>
                <span className="text-emerald-400 font-semibold flex items-center">
                  <TrendingUp className="w-3 h-3 mr-0.5" /> +14.8%
                </span>
              </div>
            </div>

            {/* Montant encaissé */}
            <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-3 sm:p-4">
              <div className="flex items-center justify-between text-slate-400 mb-1.5">
                <span className="text-[11px] font-medium truncate">Montant encaissé</span>
                <div className="w-6 h-6 rounded bg-emerald-950 text-emerald-400 flex items-center justify-center text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-sm sm:text-lg font-extrabold text-white tracking-tight">
                7 164 375{" "}
                <span className="text-[10px] sm:text-xs font-semibold text-slate-400">
                  FCFA
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] mt-1.5 text-slate-400">
                <span>Trésorerie nette</span>
                <span className="text-emerald-400 font-semibold flex items-center">
                  <TrendingUp className="w-3 h-3 mr-0.5" /> +11.2%
                </span>
              </div>
            </div>

            {/* En attente */}
            <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-3 sm:p-4">
              <div className="flex items-center justify-between text-slate-400 mb-1.5">
                <span className="text-[11px] font-medium truncate">En attente</span>
                <div className="w-6 h-6 rounded bg-amber-950 text-amber-400 flex items-center justify-center text-xs">
                  <Clock className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-sm sm:text-lg font-extrabold text-white tracking-tight">
                3 508 500{" "}
                <span className="text-[10px] sm:text-xs font-semibold text-slate-400">
                  FCFA
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] mt-1.5 text-slate-400">
                <span>Échéance saine</span>
                <span className="text-amber-400 font-semibold">2 factures</span>
              </div>
            </div>

            {/* En retard */}
            <div className="bg-[#111A2E] border border-red-950/60 rounded-xl p-3 sm:p-4">
              <div className="flex items-center justify-between text-slate-400 mb-1.5">
                <span className="text-[11px] font-medium text-red-300 truncate">En retard</span>
                <div className="w-6 h-6 rounded bg-red-950 text-red-400 flex items-center justify-center text-xs">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-sm sm:text-lg font-extrabold text-red-400 tracking-tight">
                1 431 000{" "}
                <span className="text-[10px] sm:text-xs font-semibold text-slate-400">
                  FCFA
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] mt-1.5">
                <span className="text-slate-400">1 à relancer</span>
                <span className="text-red-400 bg-red-950/80 px-1.5 py-0.5 rounded font-bold">
                  Urgent
                </span>
              </div>
            </div>
          </div>

          {/* Lower Insights: Chart & Fiscal summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 p-3 sm:p-4 pt-0">
            {/* Flux de facturation & encaissements */}
            <div className="md:col-span-2 bg-[#111A2E] border border-slate-800 rounded-xl p-3.5 sm:p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-xs font-bold text-white">
                    Flux de facturation &amp; encaissements
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Comparatif sur les 6 derniers mois (en FCFA)
                  </p>
                </div>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="flex items-center gap-1.5 text-blue-400">
                    <span className="w-2 h-2 rounded-full bg-blue-500" /> Facturé
                  </span>
                  <span className="flex items-center gap-1.5 text-teal-400">
                    <span className="w-2 h-2 rounded-full bg-teal-400" /> Encaissé
                  </span>
                </div>
              </div>

              {/* Bar Chart Bars */}
              <div className="flex items-end justify-between h-24 sm:h-28 pt-3 px-2 gap-2 text-[10px] text-slate-400 border-b border-slate-800 pb-2">
                {chartMonths.map((m) => (
                  <div key={m.name} className="flex flex-col items-center gap-1 flex-1">
                    <div className="flex items-end gap-1 h-20">
                      <div
                        className={`w-2.5 sm:w-3 bg-blue-600 rounded-t landing-bar-element ${
                          m.current ? "bg-blue-500" : ""
                        }`}
                        style={{ height: `${m.fact}%` }}
                      />
                      <div
                        className="w-2.5 sm:w-3 bg-teal-400 rounded-t landing-bar-element"
                        style={{ height: `${m.enc}%` }}
                      />
                    </div>
                    <span className={m.current ? "text-white font-bold" : ""}>{m.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fiscal summary box */}
            <div className="bg-[#111A2E] border border-slate-800 rounded-xl p-3.5 sm:p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-white mb-1.5">
                  <span>Régime Fiscal CEMAC</span>
                  <span className="text-[9px] text-teal-400 bg-teal-950 px-1.5 py-0.5 rounded border border-teal-800/60 font-semibold">
                    TVA 19,25%
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mb-2.5 leading-snug">
                  Calcul automatique conforme DGI Cameroun &amp; Afrique Centrale.
                </p>

                <div className="space-y-1.5 border-t border-slate-800 pt-2.5 text-[11px]">
                  <div className="flex justify-between text-slate-300">
                    <span>Total Hors Taxes :</span>
                    <span className="font-semibold text-white">8 950 000 FCFA</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>TVA collectée (19,25%) :</span>
                    <span className="font-semibold text-teal-400">1 722 875 FCFA</span>
                  </div>
                  <div className="flex justify-between text-white font-bold pt-1 border-t border-slate-800/60">
                    <span>Total TTC :</span>
                    <span className="text-blue-400">10 672 875 FCFA</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                <span>Export comptable DGI</span>
                <span className="text-blue-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer">
                  <span>Export .XLSX</span>
                  <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
