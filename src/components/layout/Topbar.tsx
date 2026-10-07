"use client";

import React from "react";
import Link from "next/link";
import { Menu, Plus, Bell, Calendar, ChevronDown, FileCheck2 } from "lucide-react";

interface TopbarProps {
  onOpenMobileMenu?: () => void;
}

export function Topbar({ onOpenMobileMenu }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 sm:px-6">
      {/* Left: Mobile Menu Trigger + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Ouvrir le menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Breadcrumb path */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-800 dark:text-slate-200">Tableau de bord</span>
          <span>/</span>
          <span className="text-slate-500">Vue d'ensemble</span>
        </div>
      </div>

      {/* Right: Period selector, Notifications, New Invoice CTA */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Period Selector Pill */}
        <div className="hidden sm:flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300">
          <Calendar className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          <span>Ce mois-ci (Octobre 2026)</span>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </div>

        {/* Notification Icon */}
        <button
          className="relative rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
        </button>

        {/* Quick action: Devis (visible on desktop) */}
        <Link
          href="/devis/nouveau"
          className="hidden md:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <FileCheck2 className="h-3.5 w-3.5 text-slate-500" />
          <span>Nouveau devis</span>
        </Link>

        {/* Primary CTA: Nouvelle facture */}
        <Link
          href="/factures/nouvelle"
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 active:scale-98"
        >
          <Plus className="h-4 w-4" />
          <span>Nouvelle facture</span>
        </Link>
      </div>
    </header>
  );
}
