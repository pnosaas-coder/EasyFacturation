import React from "react";
import { AppLayoutSkeleton } from "../../components/layout/AppLayoutSkeleton";
import {
  Skeleton,
  SkeletonCircle,
} from "../../components/shared/Skeleton";

export default function ClientsLoading() {
  return (
    <AppLayoutSkeleton>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <Skeleton className="h-7 w-32 rounded-md" />
          <Skeleton className="h-4 w-60 rounded-md" />
        </div>
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>

      {/* Search & Counter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900">
        <Skeleton className="h-9 w-full sm:w-80 rounded-xl" />
        <Skeleton className="h-5 w-40 rounded-md" />
      </div>

      {/* Grid of Client Cards (6 cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4"
          >
            {/* Top card: Avatar + Name + City */}
            <div className="flex items-start gap-3">
              <SkeletonCircle size="lg" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-5 w-40 rounded-md" />
                <Skeleton className="h-3.5 w-28 rounded-md" />
                <Skeleton className="h-3 w-32 rounded-md" />
              </div>
            </div>

            {/* Financial metrics block */}
            <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50 space-y-2">
              <div className="flex justify-between items-center">
                <Skeleton className="h-3 w-20 rounded-md" />
                <Skeleton className="h-3.5 w-24 rounded-md" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-3 w-16 rounded-md" />
                <Skeleton className="h-3.5 w-24 rounded-md" />
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                <Skeleton className="h-3.5 w-20 rounded-md" />
                <Skeleton className="h-4 w-28 rounded-md" />
              </div>
            </div>

            {/* Actions button */}
            <div className="flex items-center justify-between pt-1">
              <Skeleton className="h-8 w-24 rounded-lg" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppLayoutSkeleton>
  );
}
