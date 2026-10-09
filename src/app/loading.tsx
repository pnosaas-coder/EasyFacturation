import React from "react";
import { Skeleton, SkeletonCircle } from "../components/shared/Skeleton";

export default function RootLoading() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="flex flex-col items-center gap-4">
        <SkeletonCircle size="lg" className="h-14 w-14" />
        <Skeleton className="h-5 w-40 rounded-md" />
        <Skeleton className="h-3.5 w-60 rounded-md" />
      </div>
    </div>
  );
}
