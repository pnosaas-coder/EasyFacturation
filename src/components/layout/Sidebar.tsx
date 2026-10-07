"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FileCheck2,
  Repeat,
  Users,
  Package,
  BarChart3,
  HelpCircle,
  Settings,
  Moon,
  Sun,
  Search,
  ChevronsUpDown,
  X,
  Sparkles,
} from "lucide-react";
import { cn } from "../../lib/utils";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark");
    }
  };

  const menuItems = [
    {
      title: "Tableau de bord",
      href: "/",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      title: "Factures",
      href: "/factures",
      icon: FileText,
      badge: "5",
    },
    {
      title: "Devis",
      href: "/devis",
      icon: FileCheck2,
      badge: null,
    },
    {
      title: "Récurrentes",
      href: "/recurrentes",
      icon: Repeat,
      badge: null,
    },
    {
      title: "Clients",
      href: "/clients",
      icon: Users,
      badge: null,
    },
    {
      title: "Catalogue",
      href: "/produits",
      icon: Package,
      badge: null,
    },
    {
      title: "Rapports & TVA",
      href: "/rapports",
      icon: BarChart3,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs transition-opacity lg:hidden"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-slate-200 bg-white px-4 py-5 transition-transform duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-900 lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Top Header & Search */}
        <div className="space-y-6">
          {/* Logo Brand */}
          <div className="flex items-center justify-between px-2">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-500/20">
                <Sparkles className="h-5 w-5 fill-white/20 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  PNO Facture
                  <span className="rounded-md bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    PRO
                  </span>
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Zone FCFA • B2B
                </span>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 lg:hidden"
              aria-label="Fermer le menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search Bar matching the 'creatinf' inspiration */}
          <div className="relative px-1">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-10 text-xs font-medium text-slate-800 placeholder-slate-400 transition-all focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:bg-slate-800"
              />
              <span className="absolute right-2.5 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 shadow-2xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                ⌘ K
              </span>
            </div>
          </div>

          {/* Menu Links */}
          <div className="space-y-1">
            <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">
              Menu
            </div>
            <nav className="space-y-1 px-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      if (onClose) onClose();
                    }}
                    className={cn(
                      "group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-150",
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                        : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          "h-4 w-4 transition-transform group-hover:scale-105",
                          isActive
                            ? "text-white"
                            : "text-slate-400 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200"
                        )}
                      />
                      <span>{item.title}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-bold",
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Section: Help, Settings, Dark Mode, Profile */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="space-y-1 px-1">
            <Link
              href="/aide"
              className="flex items-center gap-3 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <HelpCircle className="h-4 w-4 text-slate-400" />
              <span>Aide & Support</span>
            </Link>

            <Link
              href="/parametres"
              className="flex items-center gap-3 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <Settings className="h-4 w-4 text-slate-400" />
              <span>Paramètres</span>
            </Link>

            {/* Dark Mode Switcher */}
            <div className="flex items-center justify-between rounded-xl px-3.5 py-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-3">
                {isDarkMode ? (
                  <Moon className="h-4 w-4 text-blue-400" />
                ) : (
                  <Sun className="h-4 w-4 text-amber-500" />
                )}
                <span>Mode sombre</span>
              </div>
              <button
                type="button"
                onClick={toggleDarkMode}
                aria-label="Basculer le mode sombre"
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden",
                  isDarkMode ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
                    isDarkMode ? "translate-x-4" : "translate-x-0"
                  )}
                />
              </button>
            </div>
          </div>

          {/* User Profile Card matching the inspiration layout */}
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/80 p-2.5 dark:border-slate-800 dark:bg-slate-800/50">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 text-xs font-bold text-white shadow-xs">
                OD
              </div>
              <div className="flex flex-col truncate">
                <span className="truncate text-xs font-bold text-slate-800 dark:text-slate-100">
                  Ousmane Diallo
                </span>
                <span className="truncate text-[10px] text-slate-500 dark:text-slate-400">
                  PNO Solutions S.A.R.L
                </span>
              </div>
            </div>
            <button
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Options du profil"
            >
              <ChevronsUpDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
