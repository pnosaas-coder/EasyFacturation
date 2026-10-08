"use client";

import React, { useState } from "react";
import { Invoice, InvoiceStatus } from "../../lib/domain/types";
import { formatFCFA } from "../../lib/format/money";
import { PieChart, CheckCircle2, Clock, Send, AlertCircle, FileEdit, Ban } from "lucide-react";
import { cn } from "../../lib/utils";

interface StatusDonutChartProps {
  invoices: Invoice[];
}

interface StatusSlice {
  status: InvoiceStatus;
  label: string;
  count: number;
  total: number;
  color: string;
  hoverColor: string;
  textColor: string;
  bgColor: string;
  icon: React.ElementType;
}

const STATUS_CONFIG: Record<
  InvoiceStatus,
  {
    label: string;
    color: string;
    hoverColor: string;
    textColor: string;
    bgColor: string;
    icon: React.ElementType;
  }
> = {
  paid: {
    label: "Payées",
    color: "#10b981", // emerald-500
    hoverColor: "#059669",
    textColor: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60",
    icon: CheckCircle2,
  },
  sent: {
    label: "Envoyées",
    color: "#3b82f6", // blue-500
    hoverColor: "#2563eb",
    textColor: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/60",
    icon: Send,
  },
  partial: {
    label: "Partielles",
    color: "#f59e0b", // amber-500
    hoverColor: "#d97706",
    textColor: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60",
    icon: Clock,
  },
  overdue: {
    label: "En retard",
    color: "#f43f5e", // rose-500
    hoverColor: "#e11d48",
    textColor: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60",
    icon: AlertCircle,
  },
  draft: {
    label: "Brouillons",
    color: "#94a3b8", // slate-400
    hoverColor: "#64748b",
    textColor: "text-slate-600 dark:text-slate-400",
    bgColor: "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700",
    icon: FileEdit,
  },
  cancelled: {
    label: "Annulées",
    color: "#71717a", // zinc-500
    hoverColor: "#52525b",
    textColor: "text-zinc-600 dark:text-zinc-400",
    bgColor: "bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700",
    icon: Ban,
  },
};

export function StatusDonutChart({ invoices }: StatusDonutChartProps) {
  const [hoveredStatus, setHoveredStatus] = useState<InvoiceStatus | null>(null);

  // Group invoices by status
  const statusStats = invoices.reduce<Record<InvoiceStatus, { count: number; total: number }>>(
    (acc, inv) => {
      const s = inv.status;
      if (!acc[s]) {
        acc[s] = { count: 0, total: 0 };
      }
      acc[s].count += 1;
      acc[s].total += inv.total;
      return acc;
    },
    {
      draft: { count: 0, total: 0 },
      sent: { count: 0, total: 0 },
      partial: { count: 0, total: 0 },
      paid: { count: 0, total: 0 },
      overdue: { count: 0, total: 0 },
      cancelled: { count: 0, total: 0 },
    }
  );

  const totalInvoicesCount = invoices.length;
  const grandTotalAmount = invoices.reduce((sum, inv) => sum + inv.total, 0);

  // Build slices list in logical order
  const order: InvoiceStatus[] = ["paid", "sent", "partial", "overdue", "draft"];
  const slices: StatusSlice[] = order
    .map((status) => {
      const cfg = STATUS_CONFIG[status];
      const stat = statusStats[status] || { count: 0, total: 0 };
      return {
        status,
        label: cfg.label,
        count: stat.count,
        total: stat.total,
        color: cfg.color,
        hoverColor: cfg.hoverColor,
        textColor: cfg.textColor,
        bgColor: cfg.bgColor,
        icon: cfg.icon,
      };
    })
    .filter((s) => s.count > 0);

  // Donut geometry constants
  const size = 180;
  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Compute stroke-dasharray and stroke-dashoffset based on amount (or count if total is 0)
  const baseValueTotal = grandTotalAmount > 0 ? grandTotalAmount : totalInvoicesCount || 1;

  let accumulatedPercent = 0;
  const sliceArcs = slices.map((slice) => {
    const value = grandTotalAmount > 0 ? slice.total : slice.count;
    const fraction = value / baseValueTotal;
    const strokeDasharray = `${fraction * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedPercent * circumference;
    const percentage = Math.round(fraction * 100);
    accumulatedPercent += fraction;

    return {
      ...slice,
      percentage,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  const activeSlice = hoveredStatus
    ? sliceArcs.find((s) => s.status === hoveredStatus)
    : null;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <PieChart className="h-4 w-4 text-blue-600" />
            Répartition par statut
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Suivi visuel du pipeline de facturation
          </p>
        </div>
        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200/50">
          {totalInvoicesCount} factures
        </span>
      </div>

      {/* Centered Donut graphic + Dynamic Center stats */}
      <div className="py-3 flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center my-1">
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="rotate-[-90deg] transition-transform duration-300"
          >
            {/* Background track circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-slate-100 dark:text-slate-800"
              fill="transparent"
            />

            {/* Segments */}
            {sliceArcs.map((arc) => {
              const isHovered = hoveredStatus === arc.status;
              return (
                <circle
                  key={arc.status}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={isHovered ? arc.hoverColor : arc.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={arc.strokeDasharray}
                  strokeDashoffset={arc.strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredStatus(arc.status)}
                  onMouseLeave={() => setHoveredStatus(null)}
                />
              );
            })}
          </svg>

          {/* Center Info Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
            {activeSlice ? (
              <div className="animate-in fade-in duration-150">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  {activeSlice.label}
                </span>
                <span className="text-base font-black text-slate-900 dark:text-white block mt-0.5">
                  {activeSlice.percentage}%
                </span>
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block truncate max-w-[100px]">
                  {formatFCFA(activeSlice.total)}
                </span>
              </div>
            ) : (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Total Émis
                </span>
                <span className="text-xs font-black text-slate-900 dark:text-white block mt-0.5">
                  {formatFCFA(grandTotalAmount)}
                </span>
                <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 block">
                  {totalInvoicesCount} factures
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Interactive Legend in 2-Column Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3">
          {sliceArcs.map((slice) => {
            const isHovered = hoveredStatus === slice.status;
            const Icon = slice.icon;
            return (
              <div
                key={slice.status}
                onMouseEnter={() => setHoveredStatus(slice.status)}
                onMouseLeave={() => setHoveredStatus(null)}
                className={cn(
                  "group flex items-center justify-between p-2 rounded-xl text-xs transition-all duration-200 cursor-pointer border",
                  isHovered
                    ? slice.bgColor + " shadow-xs -translate-y-0.5"
                    : "border-slate-100 bg-slate-50/60 dark:border-slate-800/80 dark:bg-slate-800/40 hover:bg-slate-100/80 dark:hover:bg-slate-800/80"
                )}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: slice.color }}
                  />
                  <Icon className={cn("w-3.5 h-3.5 shrink-0", slice.textColor)} />
                  <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">
                    {slice.label}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    ({slice.count})
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-1">
                  <span className="font-bold text-slate-900 dark:text-white text-[11px]">
                    {formatFCFA(slice.total)}
                  </span>
                  <span
                    className={cn(
                      "text-[9px] font-bold px-1.5 py-0.2 rounded-md",
                      slice.textColor,
                      "bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60"
                    )}
                  >
                    {slice.percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer tip */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 text-center">
        Survolez un segment ou un statut pour isoler le montant
      </div>
    </div>
  );
}
