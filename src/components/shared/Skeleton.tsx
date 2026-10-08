import React from "react";
import { cn } from "../../lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: "default" | "shimmer" | "pulse";
}

/**
 * Composant de base Skeleton avec effet shimmer haut de gamme
 */
export function Skeleton({ className, variant = "shimmer", ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-slate-200/70 dark:bg-slate-800/70",
        variant === "shimmer" && "animate-shimmer",
        variant === "pulse" && "animate-pulse",
        className
      )}
      {...props}
    />
  );
}

/**
 * Placeholder pour les lignes de texte
 */
export function SkeletonText({
  className,
  lines = 1,
}: {
  className?: string;
  lines?: number;
}) {
  if (lines === 1) {
    return <Skeleton className={cn("h-4 w-3/4 rounded-md", className)} />;
  }

  return (
    <div className="space-y-2 w-full">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4 rounded-md",
            i === lines - 1 ? "w-1/2" : i % 2 === 0 ? "w-full" : "w-4/5",
            className
          )}
        />
      ))}
    </div>
  );
}

/**
 * Placeholder pour avatars et icônes circulaires
 */
export function SkeletonCircle({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const sizeMap = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-14 w-14",
  };

  return <Skeleton className={cn("rounded-full shrink-0", sizeMap[size], className)} />;
}

/**
 * Placeholder pour les badges de statut
 */
export function SkeletonBadge({ className }: { className?: string }) {
  return <Skeleton className={cn("h-6 w-20 rounded-full", className)} />;
}

/**
 * Placeholder pour les cartes KPI de statistiques
 */
export function SkeletonStatCard() {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28 rounded-md" />
        <SkeletonCircle size="md" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-7 w-36 rounded-md" />
        <Skeleton className="h-3.5 w-24 rounded-md" />
      </div>
    </div>
  );
}

/**
 * Placeholder pour les tableaux de données (factures, devis, clients)
 */
export function SkeletonTable({
  rows = 5,
  columns = 5,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
      {/* Table header */}
      <div className="border-b border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800/80 dark:bg-slate-800/40">
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-4 w-32 rounded-md" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-8 w-28 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/60 p-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4 py-3.5 px-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-28 rounded-md" />
                <Skeleton className="h-3 w-36 rounded-md" />
              </div>
            </div>
            <div className="hidden sm:block">
              <Skeleton className="h-4 w-24 rounded-md" />
            </div>
            <div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="text-right">
              <Skeleton className="h-4 w-24 rounded-md ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
