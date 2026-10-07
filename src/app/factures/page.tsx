"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sidebar } from "../../components/layout/Sidebar";
import { Topbar } from "../../components/layout/Topbar";
import { RecentInvoicesTable } from "../../components/dashboard/RecentInvoicesTable";
import { mockRecentInvoices } from "../../mocks/fixtures";
import { formatFCFA } from "../../lib/format/money";
import {
  Plus,
  FileText,
  Download,
  Filter,
  ArrowUpDown,
  Search,
  Sparkles,
} from "lucide-react";

export default function InvoicesListPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalInvoiced = mockRecentInvoices.reduce((acc, inv) => acc + inv.total, 0);
  const totalPaid = mockRecentInvoices.reduce((acc, inv) => acc + inv.amountPaid, 0);
  const totalDue = mockRecentInvoices.reduce((acc, inv) => acc + inv.balanceDue, 0);

  return (
    <div className="flex min-h-screen bg-slate-50/70 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-x-hidden">
        <Topbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                <span>Gestion</span>
                <span>/</span>
                <span className="text-slate-900 dark:text-white">Factures</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white flex items-center gap-2">
                <FileText className="h-6 w-6 text-blue-600" />
                Factures clients
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Gérez, émettez et suivez le règlement de vos factures en zone FCFA.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => alert("Export CSV (format Excel FR avec BOM UTF-8) en cours de téléchargement...")}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
              >
                <Download className="h-4 w-4 text-slate-500" />
                <span>Exporter CSV</span>
              </button>

              <Link
                href="/factures/nouvelle"
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/25 hover:bg-blue-700 transition-all active:scale-98"
              >
                <Plus className="h-4 w-4" />
                <span>Nouvelle facture</span>
              </Link>
            </div>
          </div>

          {/* Quick Summary Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Total Facturé
              </span>
              <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                {formatFCFA(totalInvoiced)}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Total Encaissé
              </span>
              <p className="mt-1 text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {formatFCFA(totalPaid)}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Solde restant dû
              </span>
              <p className="mt-1 text-lg font-bold text-amber-600 dark:text-amber-400">
                {formatFCFA(totalDue)}
              </p>
            </div>
          </div>

          {/* Invoices Table Component */}
          <RecentInvoicesTable invoices={mockRecentInvoices} />
        </main>
      </div>
    </div>
  );
}
