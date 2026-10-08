import React from "react";
import { AppLayoutSkeleton } from "../../components/layout/AppLayoutSkeleton";
import {
  Skeleton,
  SkeletonTable,
} from "../../components/shared/Skeleton";

export default function ProductsLoading() {
  return (
    <AppLayoutSkeleton>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <Skeleton className="h-7 w-52 rounded-md" />
          <Skeleton className="h-4 w-72 rounded-md" />
        </div>
        <Skeleton className="h-10 w-40 rounded-xl" />
      </div>

      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900">
        <Skeleton className="h-9 w-full sm:w-80 rounded-xl" />
        <Skeleton className="h-5 w-32 rounded-md" />
      </div>

      {/* Catalog Table */}
      <SkeletonTable rows={7} columns={5} />
    </AppLayoutSkeleton>
  );
}
