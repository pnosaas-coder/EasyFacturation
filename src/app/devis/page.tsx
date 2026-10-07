"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sidebar } from "../../components/layout/Sidebar";
import { Topbar } from "../../components/layout/Topbar";
import { formatFCFA } from "../../lib/format/money";
import { formatDate } from "../../lib/format/dates";
import {
  FileCheck2,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  Download,
  MessageSquare,
  Sparkles,
} from "lucide-react";

interface QuoteItem {
  id: string;
  number: string;
  clientName: string;
  clientCity: string;
  issueDate: string;
  validUntil: string;
  total: number;
  status: "draft" | "sent" | "accepted" | "converted";
}

const mockQuotes: QuoteItem[] = [
  {
    id: "dev_1",
    number: "DEV-2026-0012",
    clientName: "TotalEnergies Marketing Sénégal",
    clientCity: "Dakar, Sénégal",
    issueDate: "2026-10-01",
    validUntil: "2026-10-31",
    total: 8_750_000,
    status: "sent",
  },
  {
    id: "dev_2",
    number: "DEV-2026-0011",
    clientName: "Groupe SIFCA Côte d'Ivoire",
    clientCity: "Abidjan, CI",
    issueDate: "2026-09-20",
    validUntil: "2026-10-20",
    total: 5_605_000,
    status: "converted",
  },
  {
    id: "dev_3",
    number: "DEV-2026-0010",
    clientName: "Ecobank Transnational Togo",
    clientCity: "Lomé, Togo",
    issueDate: "2026-09-15",
    validUntil: "2026-10-15",
    total: 3_200_000,
    status: "accepted",
  },
];

export default function QuotesListPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quotes, setQuotes] = useState<QuoteItem[]>(mockQuotes);

  const handleConvert = (quote: QuoteItem) => {
    alert(`Devis ${quote.number} converti avec succès en Facture ! Numéro attribué : FAC-2026-0050`);
    setQuotes(
      quotes.map((q) => (q.id === quote.id ? { ...q, status: "converted" } : q))
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-50/70 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-x-hidden">
        <Topbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                <span>Commercial</span>
                <span>/</span>
                <span className="text-slate-900 dark:text-white">Devis & Propositions</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white flex items-center gap-2">
                <FileCheck2 className="h-6 w-6 text-blue-600" />
                Devis & Propositions commerciales
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Créez vos devis et convertissez-les en factures en un seul clic.
              </p>
            </div>

            <Link
              href="/factures/nouvelle"
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/25 hover:bg-blue-700 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Nouveau devis</span>
            </Link>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Liste des devis émis
              </span>
              <span className="text-xs text-slate-500">
                Total devis en cours :{" "}
                <strong className="text-blue-600">
                  {formatFCFA(quotes.reduce((acc, q) => acc + q.total, 0))}
                </strong>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-semibold dark:bg-slate-800/60">
                  <tr>
                    <th className="py-3 px-4">N° Devis</th>
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Émis le</th>
                    <th className="py-3 px-4">Validité</th>
                    <th className="py-3 px-4">Montant TTC</th>
                    <th className="py-3 px-4">Statut</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {quotes.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        {q.number}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold">{q.clientName}</div>
                        <div className="text-[10px] text-slate-400">{q.clientCity}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">{formatDate(q.issueDate)}</td>
                      <td className="py-3.5 px-4 text-slate-500">{formatDate(q.validUntil)}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        {formatFCFA(q.total)}
                      </td>
                      <td className="py-3.5 px-4">
                        {q.status === "converted" && (
                          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                            Converti en facture
                          </span>
                        )}
                        {q.status === "accepted" && (
                          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 border border-blue-200">
                            Accepté par client
                          </span>
                        )}
                        {q.status === "sent" && (
                          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200">
                            En attente de réponse
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {q.status === "accepted" || q.status === "sent" ? (
                          <button
                            onClick={() => handleConvert(q)}
                            className="inline-flex items-center gap-1 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 text-xs font-bold border border-blue-200 transition-colors"
                          >
                            <span>Convertir en facture</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">Facturé</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
