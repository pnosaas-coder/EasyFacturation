import React from "react";
import { AppLayoutSkeleton } from "../../components/layout/AppLayoutSkeleton";
import {
  Skeleton,
  SkeletonStatCard,
  SkeletonTable,
} from "../../components/shared/Skeleton";

export default function QuotesLoading() {
  return (
    <AppLayoutSkeleton>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <Skeleton className="h-7 w-48 rounded-md" />
          <Skeleton className="h-4 w-64 rounded-md" />
        </div>
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
      </div>

      {/* Main Quotes Table */}
      <SkeletonTable rows={6} columns={5} />
    </AppLayoutSkeleton>
  );
}
