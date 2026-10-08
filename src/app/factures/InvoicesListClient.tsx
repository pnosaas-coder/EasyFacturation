"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Sidebar } from "../../components/layout/Sidebar";
import { Topbar } from "../../components/layout/Topbar";
import { RecentInvoicesTable } from "../../components/dashboard/RecentInvoicesTable";
import { Invoice } from "../../lib/domain/types";
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

interface InvoicesListClientProps {
  initialInvoices: Invoice[];
}

export function InvoicesListClient({ initialInvoices }: InvoicesListClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const totalInvoiced = initialInvoices
    .filter((inv) => inv.status !== "draft" && inv.status !== "cancelled")
    .reduce((acc, inv) => acc + inv.total, 0);

  const totalPaid = initialInvoices.reduce((acc, inv) => acc + inv.amountPaid, 0);
  const totalDue = initialInvoices.reduce((acc, inv) => acc + inv.balanceDue, 0);

  // Filter invoices locally based on search and status
  const filteredInvoices = initialInvoices.filter((inv) => {
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
    const matchesSearch =
      searchQuery.trim() === "" ||
      inv.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.clientEmail && inv.clientEmail.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const handleExportCSV = () => {
    try {
      const headers = [
        "Numéro",
        "Client",
        "Date émission",
        "Échéance",
        "Statut",
        "Sous-total HT (FCFA)",
        "Remise (FCFA)",
        "TVA (FCFA)",
        "Total TTC (FCFA)",
        "Encaissé (FCFA)",
        "Solde dû (FCFA)",
      ];

      const rows = filteredInvoices.map((inv) => [
        inv.number,
        `"${inv.clientName.replace(/"/g, '""')}"`,
        inv.issueDate,
        inv.dueDate,
        inv.status,
        inv.subtotal,
        inv.discountAmount,
        inv.taxTotal,
        inv.total,
        inv.amountPaid,
        inv.balanceDue,
      ]);

      const csvContent =
        "\uFEFF" +
        [headers.join(";"), ...rows.map((row) => row.join(";"))].join("\r\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `factures-pno-cameroun-${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Fichier CSV exporté avec succès (compatible Excel FR) !");
    } catch {
      toast.error("Erreur lors de l'exportation CSV.");
    }
  };

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
                Gérez, émettez et suivez le règlement de vos factures en zone FCFA (Cameroun).
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md active:scale-95 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
              >
                <Download className="h-4 w-4 text-slate-500" />
                <span>Exporter CSV</span>
              </button>

              <Link
                href="/factures/nouvelle"
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg active:scale-95"
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

          {/* Full Interactive Table with Status Dropdown, Delete Modal & Pagination */}
          <RecentInvoicesTable invoices={initialInvoices} isDashboard={false} />
        </main>
      </div>
    </div>
  );
}
