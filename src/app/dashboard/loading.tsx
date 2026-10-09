import React from "react";
import { AppLayoutSkeleton } from "../../components/layout/AppLayoutSkeleton";
import {
  Skeleton,
  SkeletonCircle,
  SkeletonStatCard,
  SkeletonTable,
} from "../../components/shared/Skeleton";

export default function DashboardLoading() {
  return (
    <AppLayoutSkeleton>
      {/* 1. Welcome & Action Banner Skeleton */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-48 rounded-md" />
            <Skeleton className="h-7 w-72 rounded-md" />
            <Skeleton className="h-4 w-60 rounded-md" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-36 rounded-xl" />
            <Skeleton className="h-10 w-32 rounded-xl" />
          </div>
        </div>
      </div>

      {/* 2. 4 Cartes KPI Financières Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
      </div>

      {/* 3. Ligne 1 d'Analyses & Graphiques Skeleton (Côte à côte) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* RevenueChart Skeleton (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-44 rounded-md" />
              <Skeleton className="h-3.5 w-64 rounded-md" />
            </div>
            <Skeleton className="h-8 w-28 rounded-lg" />
          </div>
          {/* Histogram bar placeholders */}
          <div className="flex items-end justify-between gap-4 h-48 pt-6 px-4 border-b border-slate-100 dark:border-slate-800">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <div className="flex items-end gap-1.5 w-full justify-center">
                  <Skeleton className={`w-3.5 rounded-t-sm h-${(i % 3 + 2) * 8}`} />
                  <Skeleton className={`w-3.5 rounded-t-sm h-${(i % 4 + 2) * 6}`} />
                </div>
                <Skeleton className="h-3 w-8 rounded-xs" />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-2">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="h-4 w-28 rounded-md" />
          </div>
        </div>

        {/* StatusDonutChart Skeleton (1 col) */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between space-y-6">
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-36 rounded-md" />
            <Skeleton className="h-3.5 w-48 rounded-md" />
          </div>
          {/* Donut ring placeholder */}
          <div className="flex items-center justify-center py-4">
            <div className="relative flex items-center justify-center">
              <SkeletonCircle size="xl" className="h-36 w-36" />
              <div className="absolute h-20 w-20 rounded-full bg-white dark:bg-slate-900" />
            </div>
          </div>
          {/* Legend placeholder */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-3 w-16 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Ligne 2 Opérationnelle Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Recent Invoices Table (2 cols) */}
        <div className="lg:col-span-2">
          <SkeletonTable rows={5} columns={5} />
        </div>

        {/* Quick Relance WhatsApp Widget (1 col) */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-5 w-36 rounded-md" />
              <Skeleton className="h-3.5 w-44 rounded-md" />
            </div>
            <SkeletonCircle size="sm" />
          </div>
          <div className="space-y-3 pt-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/40 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-28 rounded-md" />
                  <Skeleton className="h-4 w-16 rounded-md" />
                </div>
                <Skeleton className="h-8 w-full rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayoutSkeleton>
  );
}
