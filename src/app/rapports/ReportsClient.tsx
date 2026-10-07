"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Sidebar } from "../../components/layout/Sidebar";
import { Topbar } from "../../components/layout/Topbar";
import { formatFCFA } from "../../lib/format/money";
import { VatReportData } from "../../lib/data/reports";
import {
  BarChart3,
  Download,
  Calendar,
  Smartphone,
  Landmark,
  Coins,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

interface ReportsClientProps {
  report: VatReportData;
}

export function ReportsClient({ report }: ReportsClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(report.year);

  const handleExportCSV = () => {
    // Generate French/Cameroonian Excel CSV with semicolon delimiter and UTF-8 BOM
    const headers = ["Mois", "Nombre de factures", "Sous-total HT (FCFA)", "TVA 19.25% (FCFA)", "Total TTC (FCFA)", "Encaissements percus (FCFA)"];
    const rows = report.monthly.map((m) => [
      m.monthName,
      m.invoicesCount,
      m.subtotalHT,
      m.vatCollected,
      m.totalTTC,
      m.paymentsReceived,
    ]);

    const csvContent =
      "\uFEFF" +
      [
        headers.join(";"),
        ...rows.map((row) => row.join(";")),
        `TOTAL EXERCICE ${report.year};;${report.totalSubtotalHT};${report.totalVatCollected};${report.totalTTC};${report.totalPaymentsReceived}`,
      ].join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `PNO_Declaration_TVA_Cameroun_${report.year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Rapport TVA exporté au format CSV (Excel) avec succès !");
  };

  return (
    <div className="flex min-h-screen bg-slate-50/70 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <div className="flex flex-1 flex-col overflow-x-hidden">
        <Topbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950 dark:text-white flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-blue-600" />
                Rapports Fiscaux & Déclaration TVA Cameroun
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Exercice fiscal {selectedYear} • TVA camerounaise légale à 19,25% • Zone CEMAC (FCFA)
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                <Download className="h-4 w-4 text-slate-500" />
                <span>Exporter le rapport TVA (CSV)</span>
              </button>
            </div>
          </div>

          {/* 4 Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Chiffre d'Affaires HT
                </span>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
              <div className="mt-2 text-xl font-bold text-slate-950 dark:text-white">
                {formatFCFA(report.totalSubtotalHT)}
              </div>
              <p className="mt-1 text-[11px] text-slate-500">Factures émises hors taxes</p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  TVA Collectée (19,25%)
                </span>
                <ShieldCheck className="h-4 w-4 text-amber-600" />
              </div>
              <div className="mt-2 text-xl font-bold text-amber-600 dark:text-amber-400">
                {formatFCFA(report.totalVatCollected)}
              </div>
              <p className="mt-1 text-[11px] text-slate-500">À reverser à l'administration fiscale</p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Facturé TTC</span>
                <Coins className="h-4 w-4 text-slate-600" />
              </div>
              <div className="mt-2 text-xl font-bold text-slate-950 dark:text-white">
                {formatFCFA(report.totalTTC)}
              </div>
              <p className="mt-1 text-[11px] text-slate-500">Montant brut facturé aux clients</p>
            </div>

            <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-5 shadow-2xs dark:border-emerald-950 dark:bg-emerald-950/20">
              <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Trésorerie Encaissée
                </span>
                <Coins className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="mt-2 text-xl font-bold text-emerald-800 dark:text-emerald-300">
                {formatFCFA(report.totalPaymentsReceived)}
              </div>
              <p className="mt-1 text-[11px] text-emerald-700/80 dark:text-emerald-400/80">
                Règlements effectifs reçus
              </p>
            </div>
          </div>

          {/* Breakdown by Payment Channels (MTN MoMo, Orange Money, Bank) */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Répartition des encaissements par canal (Cameroun)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {/* MTN Mobile Money */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-900/60 dark:bg-amber-950/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200">
                    <Smartphone className="h-4 w-4 text-amber-600" />
                    <span>MTN Mobile Money (*126#)</span>
                  </div>
                </div>
                <div className="text-base font-extrabold text-amber-800 dark:text-amber-300">
                  {formatFCFA(report.byPaymentMethod.mtnMoMo)}
                </div>
                <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80">
                  Compte professionnel (+237 677481161)
                </p>
              </div>

              {/* Orange Money */}
              <div className="rounded-xl border border-orange-200 bg-orange-50/60 p-4 dark:border-orange-900/60 dark:bg-orange-950/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-orange-900 dark:text-orange-200">
                    <Smartphone className="h-4 w-4 text-orange-600" />
                    <span>Orange Money (*150#)</span>
                  </div>
                </div>
                <div className="text-base font-extrabold text-orange-800 dark:text-orange-300">
                  {formatFCFA(report.byPaymentMethod.orangeMoney)}
                </div>
                <p className="text-[11px] text-orange-700/80 dark:text-orange-400/80">
                  Compte marchand (+237 691114908)
                </p>
              </div>

              {/* Bank Transfer */}
              <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 dark:border-blue-900/60 dark:bg-blue-950/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-blue-900 dark:text-blue-200">
                    <Landmark className="h-4 w-4 text-blue-600" />
                    <span>Virements Bancaires</span>
                  </div>
                </div>
                <div className="text-base font-extrabold text-blue-800 dark:text-blue-300">
                  {formatFCFA(report.byPaymentMethod.bankTransfer)}
                </div>
                <p className="text-[11px] text-blue-700/80 dark:text-blue-400/80">
                  Afriland First Bank / BICEC / UBA
                </p>
              </div>
            </div>
          </div>

          {/* Monthly Detailed Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-100 p-4 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Déclaration mensuelle de TVA (Exercice {report.year})
              </h3>
              <span className="text-[11px] text-slate-500">
                12 mois comptables • Devise FCFA
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-100 bg-slate-50/70 font-bold uppercase tracking-wider text-[10px] text-slate-400 dark:border-slate-800 dark:bg-slate-900/60">
                  <tr>
                    <th className="py-3 px-4">Mois</th>
                    <th className="py-3 px-4 text-center">Factures</th>
                    <th className="py-3 px-4 text-right">Sous-total HT</th>
                    <th className="py-3 px-4 text-right">TVA Collectée (19,25%)</th>
                    <th className="py-3 px-4 text-right">Total TTC</th>
                    <th className="py-3 px-4 text-right">Encaissé</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {report.monthly.map((m) => (
                    <tr
                      key={m.monthName}
                      className="transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                    >
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {m.monthName}
                      </td>
                      <td className="py-3 px-4 text-center text-slate-600 dark:text-slate-400">
                        {m.invoicesCount}
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-slate-700 dark:text-slate-300">
                        {formatFCFA(m.subtotalHT)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-amber-600 dark:text-amber-400">
                        {formatFCFA(m.vatCollected)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white">
                        {formatFCFA(m.totalTTC)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                        {formatFCFA(m.paymentsReceived)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2 border-slate-200 bg-slate-50 font-bold dark:border-slate-700 dark:bg-slate-800/60">
                  <tr>
                    <td className="py-3.5 px-4 text-slate-900 dark:text-white">TOTAL {report.year}</td>
                    <td className="py-3.5 px-4 text-center text-slate-900 dark:text-white">
                      {report.monthly.reduce((acc, m) => acc + m.invoicesCount, 0)}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-900 dark:text-white">
                      {formatFCFA(report.totalSubtotalHT)}
                    </td>
                    <td className="py-3.5 px-4 text-right text-amber-600 dark:text-amber-400">
                      {formatFCFA(report.totalVatCollected)}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-900 dark:text-white">
                      {formatFCFA(report.totalTTC)}
                    </td>
                    <td className="py-3.5 px-4 text-right text-emerald-600 dark:text-emerald-400">
                      {formatFCFA(report.totalPaymentsReceived)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
