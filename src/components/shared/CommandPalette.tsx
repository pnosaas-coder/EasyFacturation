"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  FileText,
  FileCheck2,
  Users,
  Sparkles,
  ArrowRight,
  X,
  CornerDownLeft,
} from "lucide-react";
import { searchGlobalAction } from "../../lib/actions/search";
import { SearchResultItem } from "../../lib/data/search";

export function CommandPalette() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "invoice" | "quote" | "client" | "action">("all");
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Keyboard listener for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => {
      setIsOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      loadResults(query);
    } else {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Fetch results on query change
  const loadResults = async (q: string) => {
    setIsLoading(true);
    try {
      const res = await searchGlobalAction(q);
      if (res.success && res.data) {
        setResults(res.data);
        setSelectedIndex(0);
      }
    } catch {
      // Ignore
    } finally {
      setIsLoading(false);
    }
  };

  const handleQueryChange = (val: string) => {
    setQuery(val);
    loadResults(val);
  };

  // Filter items
  const filteredResults = results.filter((item) => {
    if (activeFilter === "all") return true;
    return item.type === activeFilter;
  });

  // Navigate with arrows
  const handleKeyDownInInput = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredResults.length - 1));
    } else if (e.key === "Enter" && filteredResults.length > 0) {
      e.preventDefault();
      const target = filteredResults[selectedIndex];
      if (target) {
        handleSelectItem(target);
      }
    }
  };

  const handleSelectItem = (item: SearchResultItem) => {
    setIsOpen(false);
    router.push(item.href);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={() => setIsOpen(false)} />

      {/* Main Palette Modal */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 z-10 transition-all scale-100 animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-slate-200 px-4 py-3.5 dark:border-slate-800">
          <Search className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={handleKeyDownInInput}
            placeholder="Rechercher une facture, un devis, un client ou une action rapide..."
            className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-hidden dark:text-slate-100 dark:placeholder-slate-500"
          />
          {query && (
            <button
              onClick={() => handleQueryChange("")}
              className="mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <span className="rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
            Échap
          </span>
        </div>

        {/* Filters Tabs */}
        <div className="flex items-center gap-1.5 border-b border-slate-100 px-4 py-2 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/60 text-xs">
          {[
            { id: "all", label: "Tous" },
            { id: "invoice", label: "Factures" },
            { id: "quote", label: "Devis" },
            { id: "client", label: "Clients" },
            { id: "action", label: "Actions" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveFilter(tab.id as typeof activeFilter);
                setSelectedIndex(0);
              }}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                activeFilter === tab.id
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "text-slate-500 hover:bg-slate-200/60 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {isLoading && (
            <div className="py-8 text-center text-xs text-slate-400">
              Recherche dans le système EasyFacturation...
            </div>
          )}

          {!isLoading && filteredResults.length === 0 && (
            <div className="py-12 text-center text-xs text-slate-400">
              Aucun résultat trouvé pour « <span className="font-semibold">{query}</span> ».
            </div>
          )}

          {!isLoading &&
            filteredResults.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon =
                item.type === "invoice"
                  ? FileText
                  : item.type === "quote"
                  ? FileCheck2
                  : item.type === "client"
                  ? Users
                  : Sparkles;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs transition-all cursor-pointer ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg transition-transform ${
                        isSelected
                          ? "bg-white/20 text-white scale-105"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="font-bold truncate text-[13px]">{item.title}</div>
                      <div
                        className={`truncate text-[11px] ${
                          isSelected
                            ? "text-blue-100"
                            : "text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {item.badge && (
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : item.badgeColor === "emerald"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : item.badgeColor === "amber"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            : item.badgeColor === "rose"
                            ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    <CornerDownLeft
                      className={`h-3.5 w-3.5 transition-transform ${
                        isSelected
                          ? "text-white translate-x-0.5"
                          : "text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
        </div>

        {/* Footer Shortcut Instructions */}
        <div className="flex items-center justify-between border-t border-slate-200 px-4 py-2.5 text-[11px] text-slate-400 dark:border-slate-800 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-slate-200 bg-white px-1 py-0.5 font-mono text-[9px] dark:border-slate-700 dark:bg-slate-800">
                ↑
              </kbd>
              <kbd className="rounded border border-slate-200 bg-white px-1 py-0.5 font-mono text-[9px] dark:border-slate-700 dark:bg-slate-800">
                ↓
              </kbd>{" "}
              naviguer
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-slate-200 bg-white px-1 py-0.5 font-mono text-[9px] dark:border-slate-700 dark:bg-slate-800">
                ↵
              </kbd>{" "}
              ouvrir
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-slate-200 bg-white px-1 py-0.5 font-mono text-[9px] dark:border-slate-700 dark:bg-slate-800">
                Échap
              </kbd>{" "}
              fermer
            </span>
          </div>

          <div className="font-semibold text-slate-500 dark:text-slate-400 hidden sm:block">
            EasyFacturation • Zone FCFA
          </div>
        </div>
      </div>
    </div>
  );
}
