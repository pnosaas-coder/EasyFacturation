import React from "react";
import { DashboardKPIs } from "../../lib/domain/types";
import { formatFCFA } from "../../lib/format/money";
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
} from "lucide-react";

interface StatCardsProps {
  kpis: DashboardKPIs;
}

export function StatCards({ kpis }: StatCardsProps) {
  const cards = [
    {
      title: "Montant facturé",
      amount: formatFCFA(kpis.totalInvoiced),
      subtitle: `${kpis.totalInvoicesCount} factures émises`,
      trend: `+${kpis.growthRates.invoiced}%`,
      isPositive: true,
      icon: FileText,
      iconBg: "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400",
      accentBorder: "hover:border-blue-300 dark:hover:border-blue-700",
    },
    {
      title: "Montant encaissé",
      amount: formatFCFA(kpis.totalCollected),
      subtitle: "Trésorerie nette perçue",
      trend: `+${kpis.growthRates.collected}%`,
      isPositive: true,
      icon: CheckCircle2,
      iconBg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
      accentBorder: "hover:border-emerald-300 dark:hover:border-emerald-700",
    },
    {
      title: "En attente de paiement",
      amount: formatFCFA(kpis.totalPending),
      subtitle: "Échéance non échue",
      trend: `${kpis.growthRates.pending}%`,
      isPositive: true, // Lower pending is positive
      icon: Clock,
      iconBg: "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
      accentBorder: "hover:border-amber-300 dark:hover:border-amber-700",
    },
    {
      title: "En retard de paiement",
      amount: formatFCFA(kpis.totalOverdue),
      subtitle: `${kpis.overdueCount} factures à relancer`,
      trend: `Urgent`,
      isPositive: false,
      icon: AlertTriangle,
      iconBg: "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400",
      accentBorder: "hover:border-rose-300 dark:hover:border-rose-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className={`group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 ${card.accentBorder}`}
          >
            {/* Header row: Title and Icon */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {card.title}
              </span>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${card.iconBg}`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>

            {/* Amount */}
            <div className="mt-3">
              <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                {card.amount}
              </h3>
            </div>

            {/* Bottom Row: Context badge & details */}
            <div className="mt-3.5 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                {card.subtitle}
              </span>

              <div
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  card.isPositive
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                    : "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400"
                }`}
              >
                {card.isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>{card.trend}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
