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
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logoutAction } from "../../lib/actions/auth";
import { cn } from "../../lib/utils";
import { useTheme } from "../shared/ThemeProvider";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logoutAction();
      toast.success("Vous avez été déconnecté avec succès.");
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Erreur lors de la déconnexion.");
    } finally {
      setLoggingOut(false);
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
            <Link
              href="/"
              className="flex items-center gap-3 group transition-transform duration-200 hover:scale-102"
            >
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-500/20 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/40 group-hover:ring-blue-500/40">
                <Sparkles className="h-5 w-5 fill-white/20 text-white transition-transform duration-300 group-hover:rotate-12" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  EasyFacturation
                  <span className="rounded-md bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                    PRO
                  </span>
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Cameroun • CEMAC FCFA
                </span>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 lg:hidden"
              aria-label="Fermer le menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Interactive Search Bar with Hover Effects */}
          <div className="relative px-1">
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent("open-command-palette"));
                if (onClose) onClose();
              }}
              className="group/search relative flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-3 text-xs font-medium text-slate-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-400 hover:bg-white hover:text-slate-800 hover:shadow-md hover:shadow-blue-500/10 active:translate-y-0 active:scale-98 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-500 dark:hover:border-blue-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <Search className="absolute left-3.5 h-4 w-4 text-slate-400 transition-all duration-300 group-hover/search:text-blue-600 group-hover/search:scale-110" />
              <span className="text-xs">Rechercher...</span>
              <span className="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 shadow-2xs transition-all duration-300 group-hover/search:border-blue-300 group-hover/search:text-blue-600 group-hover/search:shadow-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:group-hover/search:text-blue-400">
                ⌘ K
              </span>
            </button>
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
                      "group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-98",
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/25 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30"
                        : "text-slate-600 hover:bg-blue-50/70 hover:text-blue-700 hover:shadow-2xs dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-blue-400"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          "h-4 w-4 transition-transform duration-200 group-hover:scale-110",
                          isActive
                            ? "text-white"
                            : "text-slate-400 group-hover:text-blue-600 dark:text-slate-400 dark:group-hover:text-blue-400"
                        )}
                      />
                      <span>{item.title}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-bold transition-transform duration-200 group-hover:scale-105",
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-blue-100 text-blue-700 group-hover:bg-blue-200 dark:bg-blue-950 dark:text-blue-300"
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
              onClick={() => {
                if (onClose) onClose();
              }}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-200 hover:translate-x-1",
                pathname === "/aide"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/25 hover:bg-blue-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              )}
            >
              <HelpCircle className={cn("h-4 w-4", pathname === "/aide" ? "text-white" : "text-slate-400")} />
              <span>Aide & Support</span>
            </Link>

            <Link
              href="/parametres"
              onClick={() => {
                if (onClose) onClose();
              }}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-200 hover:translate-x-1",
                pathname === "/parametres"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/25 hover:bg-blue-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              )}
            >
              <Settings className={cn("h-4 w-4", pathname === "/parametres" ? "text-white" : "text-slate-400")} />
              <span>Paramètres</span>
            </Link>

            {/* Dark / Light Mode Segmented Control */}
            <div className="rounded-xl border border-slate-200/90 bg-slate-100/90 p-1 dark:border-slate-800 dark:bg-slate-800/80">
              <div className="grid grid-cols-2 gap-1 text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={cn(
                    "flex items-center justify-center gap-1.5 rounded-lg py-1.5 transition-all duration-200 cursor-pointer",
                    !isDarkMode
                      ? "bg-white text-slate-900 shadow-xs ring-1 ring-slate-900/5 font-bold"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  )}
                  aria-pressed={!isDarkMode}
                  title="Activer le mode clair"
                >
                  <Sun className={cn("h-3.5 w-3.5", !isDarkMode ? "text-amber-500" : "text-slate-400")} />
                  <span>Mode clair</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={cn(
                    "flex items-center justify-center gap-1.5 rounded-lg py-1.5 transition-all duration-200 cursor-pointer",
                    isDarkMode
                      ? "bg-slate-900 text-white shadow-xs ring-1 ring-white/10 font-bold dark:bg-blue-600"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  )}
                  aria-pressed={isDarkMode}
                  title="Activer le mode sombre"
                >
                  <Moon className={cn("h-3.5 w-3.5", isDarkMode ? "text-blue-300 dark:text-white" : "text-slate-400")} />
                  <span>Mode sombre</span>
                </button>
              </div>
            </div>
          </div>

          {/* User Profile Card: Philippe NOUGOUE - Cameroun */}
          <div className="group/profile flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/80 p-2.5 transition-all duration-200 hover:border-blue-300 hover:bg-white hover:shadow-md hover:shadow-blue-500/10 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-700">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-xs font-bold text-white shadow-xs transition-transform duration-200 group-hover/profile:scale-105">
                PN
              </div>
              <div className="flex flex-col truncate">
                <span className="truncate text-xs font-bold text-slate-800 dark:text-slate-100 group-hover/profile:text-blue-600 transition-colors">
                  Philippe NOUGOUE
                </span>
                <span className="truncate text-[10px] text-slate-500 dark:text-slate-400">
                  Prunus Engineering SARL
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all p-1.5 rounded-lg cursor-pointer"
              title="Se déconnecter"
              aria-label="Se déconnecter"
            >
              <LogOut className={`h-4 w-4 ${loggingOut ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
