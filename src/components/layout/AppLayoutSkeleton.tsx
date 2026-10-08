import React from "react";
import { Skeleton, SkeletonCircle } from "../shared/Skeleton";
import { Sparkles } from "lucide-react";

export function AppLayoutSkeleton({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50/60 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      {/* Sidebar Placeholder */}
      <aside className="hidden lg:flex w-72 flex-col justify-between border-r border-slate-200 bg-white px-4 py-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="space-y-6">
          {/* Logo brand */}
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 text-white shadow-md shadow-blue-500/25">
              <Sparkles className="h-5 w-5 fill-white/20 text-white" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-4 w-32 rounded-md" />
              <Skeleton className="h-3 w-20 rounded-md" />
            </div>
          </div>

          {/* Search bar placeholder */}
          <div className="px-1">
            <Skeleton className="h-9 w-full rounded-xl" />
          </div>

          {/* Menu links placeholder */}
          <div className="space-y-2 px-1">
            <div className="px-2 pb-1">
              <Skeleton className="h-3 w-16 rounded-md" />
            </div>
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-3.5 py-2.5">
                <Skeleton className="h-4 w-4 rounded-md" />
                <Skeleton className="h-4 w-28 rounded-md" />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom profile placeholder */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Skeleton className="h-8 w-full rounded-xl" />
          <div className="flex items-center gap-2.5 p-2 rounded-2xl border border-slate-200/80 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-800/50">
            <SkeletonCircle size="sm" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-3.5 w-24 rounded-md" />
              <Skeleton className="h-2.5 w-28 rounded-md" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        {/* Topbar Placeholder */}
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-4 sm:px-6 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-36 rounded-md" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-24 rounded-lg hidden sm:block" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
