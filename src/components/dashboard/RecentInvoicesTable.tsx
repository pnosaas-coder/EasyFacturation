"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Invoice, InvoiceStatus } from "../../lib/domain/types";
import { formatFCFA } from "../../lib/format/money";
import { formatDate } from "../../lib/format/dates";
import { StatusBadge } from "../shared/StatusBadge";
import {
  FileText,
  Search,
  Filter,
  Eye,
  Download,
  Share2,
  MoreVertical,
  ArrowUpRight,
  MessageSquare,
  Check,
} from "lucide-react";

interface RecentInvoicesTableProps {
  invoices: Invoice[];
}

export function RecentInvoicesTable({ invoices }: RecentInvoicesTableProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const filteredInvoices = invoices.filter((inv) => {
    // Filter by tab
    if (activeTab === "paid" && inv.status !== "paid") return false;
    if (activeTab === "sent" && inv.status !== "sent" && inv.status !== "partial") return false;
    if (activeTab === "overdue" && inv.status !== "overdue") return false;
    if (activeTab === "draft" && inv.status !== "draft") return false;

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = inv.number.toLowerCase().includes(q);
      const matchClient = inv.clientName.toLowerCase().includes(q);
      return matchNum || matchClient;
    }

    return true;
  });

  const getWhatsAppLink = (inv: Invoice) => {
    const text = encodeURIComponent(
      `Bonjour ${inv.clientName},\nVoici votre facture ${inv.number} d'un montant de ${formatFCFA(
        inv.total
      )}.\nÉchéance : ${formatDate(inv.dueDate)}.\nMerci de procéder au règlement.`
    );
    return `https://wa.me/?text=${text}`;
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
      {/* Table Header with Tabs & Search */}
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600" />
            Dernières factures émises
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Suivi des émissions, encaissements et relances en temps réel
          </p>
        </div>

        {/* Filter Tabs & Search */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Tabs */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            {[
              { id: "all", label: "Toutes" },
              { id: "paid", label: "Payées" },
              { id: "sent", label: "En cours" },
              { id: "overdue", label: "En retard" },
              { id: "draft", label: "Brouillons" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="N° ou client..."
              className="h-8 rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/70 text-slate-500 uppercase tracking-wider text-[11px] font-semibold dark:bg-slate-800/50 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
            <tr>
              <th className="py-3 px-4 w-10">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="py-3 px-4">N° Facture</th>
              <th className="py-3 px-4">Client</th>
              <th className="py-3 px-4">Émise le</th>
              <th className="py-3 px-4">Échéance</th>
              <th className="py-3 px-4">Montant TTC</th>
              <th className="py-3 px-4">Statut</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-slate-400">
                  Aucune facture trouvée pour ces filtres.
                </td>
              </tr>
            ) : (
              filteredInvoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>

                  {/* Number */}
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                    <Link
                      href={`/factures/${inv.id}`}
                      className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 group-hover:underline"
                    >
                      {inv.number}
                    </Link>
                  </td>

                  {/* Client */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {inv.clientName}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {inv.clientCity || "Sénégal"}
                      </span>
                    </div>
                  </td>

                  {/* Issue Date */}
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    {formatDate(inv.issueDate)}
                  </td>

                  {/* Due Date */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`font-medium ${
                        inv.status === "overdue"
                          ? "text-rose-600 font-bold dark:text-rose-400"
                          : "text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {formatDate(inv.dueDate)}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {formatFCFA(inv.total)}
                      </span>
                      {inv.balanceDue > 0 && inv.status === "partial" && (
                        <span className="text-[10px] text-amber-600 font-semibold">
                          Reste: {formatFCFA(inv.balanceDue)}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <StatusBadge status={inv.status} />
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 opacity-90 group-hover:opacity-100">
                      {/* WhatsApp share */}
                      <a
                        href={getWhatsAppLink(inv)}
                        target="_blank"
                        rel="noreferrer"
                        title="Partager sur WhatsApp"
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-400 transition-colors"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </a>

                      {/* Download PDF simulation */}
                      <button
                        title="Télécharger le PDF"
                        onClick={() => alert(`Téléchargement de la facture ${inv.number} au format PDF.`)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/50 dark:hover:text-blue-400 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                      </button>

                      {/* View details */}
                      <Link
                        href={`/factures/${inv.id}`}
                        title="Consulter"
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="flex items-center justify-between p-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
        <span>Affichage de {filteredInvoices.length} sur {invoices.length} factures</span>
        <Link
          href="/factures"
          className="font-bold text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400"
        >
          Voir toutes les factures →
        </Link>
      </div>
    </div>
  );
}
