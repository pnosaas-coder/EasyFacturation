"use client";

import React from "react";
import { Invoice } from "../../lib/domain/types";
import { formatFCFA } from "../../lib/format/money";
import { formatDate } from "../../lib/format/dates";
import {
  AlertTriangle,
  MessageSquare,
  Mail,
  Building2,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

interface QuickRelanceWidgetProps {
  overdueInvoices: Invoice[];
}

export function QuickRelanceWidget({ overdueInvoices }: QuickRelanceWidgetProps) {
  const topClients = [
    { name: "Groupe SIFCA", city: "Abidjan, CI", total: 10_605_000, percentage: 85 },
    { name: "Sonatel Orange B2B", city: "Dakar, SN", total: 6_984_000, percentage: 65 },
    { name: "Wave Digital Finance", city: "Abidjan, CI", total: 4_360_000, percentage: 45 },
  ];

  return (
    <div className="space-y-6">
      {/* Overdue alert card */}
      <div className="rounded-2xl border border-rose-200/80 bg-gradient-to-br from-rose-50/70 via-white to-rose-50/30 p-5 shadow-xs dark:border-rose-900/40 dark:from-rose-950/20 dark:via-slate-900 dark:to-rose-950/10">
        <div className="flex items-center justify-between pb-3 border-b border-rose-100 dark:border-rose-900/40">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-900/60 dark:text-rose-400">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Factures à relancer
              </h4>
              <p className="text-[11px] text-rose-600 font-semibold dark:text-rose-400">
                {overdueInvoices.length} impayés nécessitent votre attention
              </p>
            </div>
          </div>
          <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:bg-rose-900/60 dark:text-rose-300">
            Action urgente
          </span>
        </div>

        <div className="mt-3 space-y-3">
          {overdueInvoices.slice(0, 2).map((inv) => (
            <div
              key={inv.id}
              className="rounded-xl border border-rose-100 bg-white/80 p-3 shadow-2xs dark:border-rose-900/30 dark:bg-slate-800/80"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {inv.clientName}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <span>{inv.number}</span>
                    <span>•</span>
                    <span className="text-rose-600 font-semibold dark:text-rose-400">
                      Échu le {formatDate(inv.dueDate)}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {formatFCFA(inv.balanceDue)}
                </span>
              </div>

              <div className="mt-2.5 flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `Bonjour, relance amicale pour la facture ${inv.number} de ${formatFCFA(
                      inv.balanceDue
                    )} échue le ${formatDate(inv.dueDate)}.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald-700 transition-colors shadow-2xs"
                >
                  <MessageSquare className="h-3 w-3" />
                  <span>WhatsApp</span>
                </a>

                <button
                  onClick={() => alert(`Email de relance préparé pour ${inv.clientName}`)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <Mail className="h-3 w-3 text-slate-500" />
                  <span>Email</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Clients Ranking */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="h-4 w-4 text-blue-600" />
            Top Clients (CA Facturé)
          </h4>
          <span className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer dark:text-blue-400">
            Voir tous
          </span>
        </div>

        <div className="mt-4 space-y-4">
          {topClients.map((cli) => (
            <div key={cli.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {cli.name}
                  </span>
                  <span className="text-[10px] text-slate-400 ml-1.5">{cli.city}</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatFCFA(cli.total)}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  style={{ width: `${cli.percentage}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-700"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Tip Box */}
        <div className="mt-5 rounded-xl bg-blue-50/70 p-3.5 border border-blue-100 dark:bg-blue-950/30 dark:border-blue-900/40 text-xs">
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-blue-600 shrink-0 mt-0.5 dark:text-blue-400" />
            <div className="text-[11px] text-slate-600 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-white">Conseil trésorerie :</strong>{" "}
              Activez le paiement mobile Wave & Orange Money sur vos devis pour réduire le délai moyen d'encaissement de 40%.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
