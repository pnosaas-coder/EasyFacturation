"use client";

import React, { useState } from "react";
import { MonthlyRevenue } from "../../lib/domain/types";
import { formatCompactFCFA, formatFCFA } from "../../lib/format/money";
import { BarChart2, ArrowUpRight, ShieldCheck, DollarSign } from "lucide-react";

interface RevenueChartProps {
  data: MonthlyRevenue[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  const [activeMonth, setActiveMonth] = useState<string | null>(data[data.length - 1]?.month || null);

  const maxVal = Math.max(...data.flatMap((d) => [d.invoiced, d.collected]), 20_000_000);

  const selectedData = data.find((d) => d.month === activeMonth) || data[data.length - 1];

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between h-full">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-blue-600" />
            Flux de facturation & encaissements
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Comparatif sur les 6 derniers mois (montants en FCFA)
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
            <span className="text-slate-600 dark:text-slate-300">Facturé</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-300">Encaissé</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-3.5 flex-1 items-stretch">
        {/* Main Bar Chart Representation (col-span-8) */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          <div className="h-40 flex items-end justify-between gap-2 sm:gap-4 pt-4 px-2">
            {data.map((item) => {
              const invoicedHeight = Math.round((item.invoiced / maxVal) * 100);
              const collectedHeight = Math.round((item.collected / maxVal) * 100);
              const isSelected = item.month === activeMonth;

              return (
                <div
                  key={item.month}
                  onClick={() => setActiveMonth(item.month)}
                  className={`group relative flex-1 flex flex-col items-center cursor-pointer transition-all ${
                    isSelected ? "opacity-100" : "opacity-80 hover:opacity-100"
                  }`}
                >
                  {/* Tooltip on hover/active */}
                  <div
                    className={`absolute -top-11 z-20 hidden group-hover:flex flex-col items-center bg-slate-900 text-white dark:bg-slate-800 text-[10px] py-1 px-2.5 rounded-lg shadow-lg whitespace-nowrap pointer-events-none transition-all ${
                      isSelected ? "flex" : ""
                    }`}
                  >
                    <span className="font-bold">{item.month}</span>
                    <span className="text-blue-300">Facturé: {formatCompactFCFA(item.invoiced)}</span>
                    <span className="text-emerald-300">Encaissé: {formatCompactFCFA(item.collected)}</span>
                  </div>

                  {/* Bars side by side */}
                  <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-30">
                    {/* Invoiced Bar */}
                    <div
                      style={{ height: `${invoicedHeight}%` }}
                      className="w-1/2 max-w-[16px] rounded-t-md bg-blue-600 group-hover:bg-blue-700 transition-all shadow-2xs"
                    />
                    {/* Collected Bar */}
                    <div
                      style={{ height: `${collectedHeight}%` }}
                      className="w-1/2 max-w-[16px] rounded-t-md bg-emerald-500 group-hover:bg-emerald-600 transition-all shadow-2xs"
                    />
                  </div>

                  {/* Month Label */}
                  <span
                    className={`mt-1.5 text-xs font-semibold ${
                      isSelected
                        ? "text-blue-600 dark:text-blue-400 font-bold"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Bottom helper */}
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2">
            <span>0 FCFA</span>
            <span>Échelle max : {formatCompactFCFA(maxVal)}</span>
          </div>
        </div>

        {/* Right Info Box: Collection efficiency & TVA (col-span-4) */}
        <div className="lg:col-span-4 flex flex-col justify-between rounded-xl bg-slate-50/70 p-3.5 border border-slate-200/60 dark:bg-slate-800/40 dark:border-slate-800">
          <div className="space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Focus {selectedData?.month} 2026
            </span>

            <div className="space-y-0.5">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Total facturé</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {formatFCFA(selectedData?.invoiced || 0)}
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Total encaissé</span>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {formatFCFA(selectedData?.collected || 0)}
              </p>
            </div>

            <div className="pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 dark:text-slate-400">Taux d'encaissement</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {selectedData && selectedData.invoiced > 0 ? Math.round((selectedData.collected / selectedData.invoiced) * 100) : 0}%
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  style={{
                    width: `${selectedData && selectedData.invoiced > 0 ? Math.min(100, Math.round((selectedData.collected / selectedData.invoiced) * 100)) : 0}%`,
                  }}
                  className="h-full rounded-full bg-blue-600"
                />
              </div>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> TVA 19.25%
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {formatCompactFCFA(Math.round((selectedData?.invoiced || 0) * 0.1925))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
