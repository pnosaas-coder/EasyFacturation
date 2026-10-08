"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Sidebar } from "../components/layout/Sidebar";
import { Topbar } from "../components/layout/Topbar";
import { StatCards } from "../components/dashboard/StatCards";
import { RevenueChart } from "../components/dashboard/RevenueChart";
import { RecentInvoicesTable } from "../components/dashboard/RecentInvoicesTable";
import { QuickRelanceWidget } from "../components/dashboard/QuickRelanceWidget";
import { StatusDonutChart } from "../components/dashboard/StatusDonutChart";
import {
  DashboardKPIs,
  Invoice,
  MonthlyRevenue,
} from "../lib/domain/types";
import {
  Plus,
  FileCheck2,
  Sparkles,
} from "lucide-react";
import { formatFCFA } from "../lib/format/money";
import { computeDashboardKPIs, computeMonthlyRevenue } from "../lib/data/dashboard";

interface DashboardClientProps {
  kpis: DashboardKPIs;
  monthlyRevenue: MonthlyRevenue[];
  invoices: Invoice[];
}

export function DashboardClient({
  kpis: initialKpis,
  monthlyRevenue: initialMonthlyRevenue,
  invoices: initialInvoices,
}: DashboardClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);

  useEffect(() => {
    setInvoices(initialInvoices);
  }, [initialInvoices]);

  const handleInvoiceUpdated = (updated: Invoice) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === updated.id ? updated : inv))
    );
  };

  const handleInvoiceDeleted = (deletedId: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== deletedId));
  };

  const kpis = useMemo(() => computeDashboardKPIs(invoices), [invoices]);
  const monthlyRevenue = useMemo(() => computeMonthlyRevenue(invoices), [invoices]);
  const overdueInvoices = useMemo(
    () => invoices.filter((inv) => inv.status === "overdue"),
    [invoices]
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
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Welcome & Action Banner - Philippe NOUGOUE (Cameroun) */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 text-white shadow-lg shadow-blue-500/15">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-blue-200" />
                <span>EasyFacturation • Cameroun (Douala & Yaoundé)</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                Bonjour, Philippe NOUGOUE 👋
              </h1>
              <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
                Voici le bilan de votre facturation Prunus Engineering pour ce mois. Vous avez{" "}
                <span className="font-bold underline decoration-blue-300">
                  {kpis.overdueCount} {kpis.overdueCount > 1 ? "factures à relancer" : "facture à relancer"}
                </span>{" "}
                pour un montant de {formatFCFA(kpis.totalOverdue)}.
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
            <StatCards kpis={kpis} />
          </section>

          {/* Ligne 1 Graphiques & Analyses : Flux de trésorerie (gauche) & Répartition par statut (droite) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
            {/* Flux de facturation & encaissements (7/12) */}
            <section
              aria-labelledby="chart-heading"
              className="xl:col-span-7 flex flex-col"
            >
              <h2 id="chart-heading" className="sr-only">
                Graphique des flux de trésorerie
              </h2>
              <RevenueChart data={monthlyRevenue} />
            </section>

            {/* Répartition par statut avec anneau recentré (5/12) */}
            <section
              aria-labelledby="status-donut-heading"
              className="xl:col-span-5 flex flex-col"
            >
              <h2 id="status-donut-heading" className="sr-only">
                Répartition des factures par statut
              </h2>
              <StatusDonutChart invoices={invoices} />
            </section>
          </div>

          {/* Ligne 2 : Table des factures récentes (8/12) & Relances WhatsApp (4/12) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* Table des factures récentes */}
            <section
              aria-labelledby="invoices-heading"
              className="xl:col-span-8 space-y-4"
            >
              <RecentInvoicesTable
                invoices={invoices}
                isDashboard={true}
                onInvoiceUpdated={handleInvoiceUpdated}
                onInvoiceDeleted={handleInvoiceDeleted}
              />
            </section>

            {/* Relances rapides & alertes */}
            <aside aria-label="Suivi et Alertes" className="xl:col-span-4 space-y-6">
              <QuickRelanceWidget overdueInvoices={overdueInvoices} />
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
