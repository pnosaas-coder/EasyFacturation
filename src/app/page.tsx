"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sidebar } from "../components/layout/Sidebar";
import { Topbar } from "../components/layout/Topbar";
import { StatCards } from "../components/dashboard/StatCards";
import { RevenueChart } from "../components/dashboard/RevenueChart";
import { RecentInvoicesTable } from "../components/dashboard/RecentInvoicesTable";
import { QuickRelanceWidget } from "../components/dashboard/QuickRelanceWidget";
import {
  mockDashboardKPIs,
  mockMonthlyRevenue,
  mockRecentInvoices,
} from "../mocks/fixtures";
import {
  Plus,
  FileCheck2,
  Sparkles,
} from "lucide-react";

export default function DashboardPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const overdueInvoices = mockRecentInvoices.filter(
    (inv) => inv.status === "overdue"
  );

  return (
    <div className="flex min-h-screen bg-slate-50/60 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      {/* Sidebar (Desktop fixed & Mobile drawer) */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        {/* Top Navigation Bar */}
        <Topbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        {/* Dashboard Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-7 max-w-7xl mx-auto w-full">
          {/* Welcome & Action Banner - Philippe Noukoué (Cameroun) */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 text-white shadow-lg shadow-blue-500/15">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-blue-200" />
                <span>PNO Facture Pro • Cameroun (Douala & Yaoundé)</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                Bonjour, Philippe 👋
              </h1>
              <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
                Voici le bilan de votre facturation PNO Solutions pour ce mois d'octobre 2026. Vous avez{" "}
                <span className="font-bold underline decoration-blue-300">
                  3 factures à relancer
                </span>{" "}
                pour un montant de 1 200 000 FCFA.
              </p>
            </div>

            {/* Quick action buttons in banner with hover interactions */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2 md:pt-0">
              <Link
                href="/factures/nouvelle"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4.5 py-2.5 text-xs font-bold text-blue-700 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-xl hover:shadow-black/10 active:translate-y-0 active:scale-95"
              >
                <Plus className="h-4 w-4" />
                <span>Nouvelle facture</span>
              </Link>

              <Link
                href="/devis/nouveau"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-800/60 border border-white/20 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-800 hover:border-white/40 active:translate-y-0 active:scale-95"
              >
                <FileCheck2 className="h-4 w-4" />
                <span>Créer un devis</span>
              </Link>
            </div>
          </div>

          {/* 4 Financial Stat Cards (Montants FCFA, pourcentages, icônes) */}
          <section aria-labelledby="kpis-heading">
            <h2 id="kpis-heading" className="sr-only">
              Indicateurs clés de performance financière
            </h2>
            <StatCards kpis={mockDashboardKPIs} />
          </section>

          {/* Flux de facturation & Trésorerie (Graphique comparatif 6 mois) */}
          <section aria-labelledby="chart-heading">
            <h2 id="chart-heading" className="sr-only">
              Graphique des flux de trésorerie
            </h2>
            <RevenueChart data={mockMonthlyRevenue} />
          </section>

          {/* Two-column layout: Recent Invoices Table (70%) + Quick Relance & Top Clients (30%) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Invoices Table */}
            <section
              aria-labelledby="invoices-heading"
              className="lg:col-span-2 space-y-4"
            >
              <RecentInvoicesTable invoices={mockRecentInvoices} />
            </section>

            {/* Right 1 Col: Quick Relance & Top Clients widgets */}
            <aside aria-label="Alertes et Top Clients" className="space-y-6">
              <QuickRelanceWidget overdueInvoices={overdueInvoices} />
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
