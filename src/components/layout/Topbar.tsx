"use client";

import React from "react";
import Link from "next/link";
import { Menu, Plus, Bell, Calendar, ChevronDown, FileCheck2, Search } from "lucide-react";

interface TopbarProps {
  onOpenMobileMenu?: () => void;
}

export function Topbar({ onOpenMobileMenu }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/85 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/85 sm:px-6">
      {/* Left: Mobile Menu Trigger + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 hover:scale-105 active:scale-95 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Ouvrir le menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Breadcrumb path */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-800 dark:text-slate-200">Tableau de bord</span>
          <span>/</span>
          <span className="text-slate-500">Vue d'ensemble Cameroun</span>
        </div>

        {/* Global Quick Search Button (⌘K) */}
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
          className="hidden md:flex items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50/70 px-2.5 py-1 text-xs text-slate-400 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-400 hover:bg-white hover:text-slate-700 hover:shadow-xs active:translate-y-0 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800 dark:hover:text-slate-300 ml-4"
        >
          <Search className="h-3.5 w-3.5 text-slate-400" />
          <span>Recherche rapide...</span>
          <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.2 text-[9px] font-bold text-slate-400 dark:border-slate-700 dark:bg-slate-800">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Period selector, Notifications, New Invoice CTA */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Period Selector Pill with rich hover */}
        <button
          type="button"
          className="hidden sm:flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-400 hover:bg-white hover:text-blue-700 hover:shadow-md hover:shadow-blue-500/10 active:translate-y-0 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400"
        >
          <Calendar className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          <span>Ce mois-ci (Octobre 2026)</span>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </button>

        {/* Notification Icon with rich hover */}
        <button
          className="relative rounded-xl border border-slate-200 p-2 text-slate-500 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md hover:shadow-blue-500/10 active:translate-y-0 active:scale-95 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
        </button>

        {/* Quick action: Devis (visible on desktop) with hover lift */}
        <Link
          href="/devis/nouveau"
          className="hidden md:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-slate-50 hover:text-blue-600 hover:shadow-md hover:shadow-slate-500/10 active:translate-y-0 active:scale-95 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-blue-400"
        >
          <FileCheck2 className="h-3.5 w-3.5 text-slate-500 transition-transform group-hover:scale-110" />
          <span>Nouveau devis</span>
        </Link>

        {/* Primary CTA: Nouvelle facture with glow hover */}
        <Link
          href="/factures/nouvelle"
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-600/40 active:translate-y-0 active:scale-95"
        >
          <Plus className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
          <span>Nouvelle facture</span>
        </Link>
      </div>
    </header>
  );
}
