import React from "react";
import { AppLayoutSkeleton } from "../../components/layout/AppLayoutSkeleton";
import {
  Skeleton,
  SkeletonStatCard,
  SkeletonTable,
} from "../../components/shared/Skeleton";

export default function ReportsLoading() {
  return (
    <AppLayoutSkeleton>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <Skeleton className="h-7 w-60 rounded-md" />
          <Skeleton className="h-4 w-80 rounded-md" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-10 w-44 rounded-xl" />
        </div>
      </div>

      {/* 4 Tax & Revenue KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
      </div>

      {/* Monthly VAT breakdown table skeleton */}
      <SkeletonTable rows={8} columns={6} />
    </AppLayoutSkeleton>
  );
}
