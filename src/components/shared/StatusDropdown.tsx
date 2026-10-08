"use client";

import React, { useState, useRef, useEffect } from "react";
import { InvoiceStatus, QuoteStatus } from "../../lib/domain/types";
import { contentFr } from "../../content/fr";
import { cn } from "../../lib/utils";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  FileEdit,
  Send,
  Ban,
  ChevronDown,
  Check,
  Loader2,
  FileCheck2,
} from "lucide-react";

interface InvoiceStatusDropdownProps {
  type?: "invoice";
  currentStatus: InvoiceStatus;
  onStatusChange: (newStatus: InvoiceStatus) => Promise<void> | void;
  disabled?: boolean;
}

interface QuoteStatusDropdownProps {
  type: "quote";
  currentStatus: QuoteStatus;
  onStatusChange: (newStatus: QuoteStatus) => Promise<void> | void;
  disabled?: boolean;
}

type StatusDropdownProps = InvoiceStatusDropdownProps | QuoteStatusDropdownProps;

const INVOICE_STATUS_OPTIONS: {
  status: InvoiceStatus;
  label: string;
  bg: string;
  dot: string;
  icon: React.ElementType;
}[] = [
  {
    status: "draft",
    label: contentFr.status.draft,
    bg: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700",
    dot: "bg-slate-400",
    icon: FileEdit,
  },
  {
    status: "sent",
    label: contentFr.status.sent,
    bg: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/60",
    dot: "bg-blue-500",
    icon: Send,
  },
  {
    status: "partial",
    label: contentFr.status.partial,
    bg: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/60",
    dot: "bg-amber-500",
    icon: Clock,
  },
  {
    status: "paid",
    label: contentFr.status.paid,
    bg: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60",
    dot: "bg-emerald-500",
    icon: CheckCircle2,
  },
  {
    status: "overdue",
    label: contentFr.status.overdue,
    bg: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/60",
    dot: "bg-rose-500",
    icon: AlertCircle,
  },
  {
    status: "cancelled",
    label: contentFr.status.cancelled,
    bg: "bg-neutral-100 text-neutral-500 border-neutral-200 line-through dark:bg-neutral-900 dark:text-neutral-500 dark:border-neutral-800",
    dot: "bg-neutral-400",
    icon: Ban,
  },
];

const QUOTE_STATUS_OPTIONS: {
  status: QuoteStatus;
  label: string;
  bg: string;
  dot: string;
  icon: React.ElementType;
}[] = [
  {
    status: "draft",
    label: "Brouillon",
    bg: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300",
    dot: "bg-slate-400",
    icon: FileEdit,
  },
  {
    status: "sent",
    label: "Envoyé",
    bg: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300",
    dot: "bg-blue-500",
    icon: Send,
  },
  {
    status: "accepted",
    label: "Accepté",
    bg: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300",
    dot: "bg-emerald-500",
    icon: CheckCircle2,
  },
  {
    status: "declined",
    label: "Refusé",
    bg: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300",
    dot: "bg-rose-500",
    icon: AlertCircle,
  },
  {
    status: "converted",
    label: "Converti en facture",
    bg: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300",
    dot: "bg-purple-500",
    icon: FileCheck2,
  },
  {
    status: "expired",
    label: "Expiré",
    bg: "bg-neutral-100 text-neutral-500 border-neutral-200 dark:bg-neutral-900 dark:text-neutral-400",
    dot: "bg-neutral-400",
    icon: Clock,
  },
];

export function StatusDropdown(props: StatusDropdownProps) {
  const { currentStatus, onStatusChange, disabled = false } = props;
  const isQuote = props.type === "quote";

  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const options = isQuote ? QUOTE_STATUS_OPTIONS : INVOICE_STATUS_OPTIONS;
  const currentConfig =
    options.find((opt) => opt.status === currentStatus) || options[0];

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  const handleSelect = async (newStatus: string) => {
    if (newStatus === currentStatus) {
      setIsOpen(false);
      return;
    }
    setIsUpdating(true);
    try {
      if (isQuote) {
        await (onStatusChange as (s: QuoteStatus) => Promise<void> | void)(
          newStatus as QuoteStatus
        );
      } else {
        await (onStatusChange as (s: InvoiceStatus) => Promise<void> | void)(
          newStatus as InvoiceStatus
        );
      }
    } finally {
      setIsUpdating(false);
      setIsOpen(false);
    }
  };

  const Icon = currentConfig.icon;

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        disabled={disabled || isUpdating}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className={cn(
          "group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs active:scale-95 focus:outline-hidden",
          currentConfig.bg,
          disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
        )}
        title="Cliquer pour changer le statut"
      >
        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", currentConfig.dot)} />
        {isUpdating ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Icon className="w-3.5 h-3.5 shrink-0 opacity-80" />
        )}
        <span>{currentConfig.label}</span>
        <ChevronDown
          className={cn(
            "w-3 h-3 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute left-0 mt-1.5 w-48 origin-top-left rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5 dark:border-slate-800 dark:bg-slate-900 z-50 animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Changer le statut
          </div>
          <div className="space-y-0.5">
            {options.map((opt) => {
              const isSelected = opt.status === currentStatus;
              const OptIcon = opt.icon;
              return (
                <button
                  key={opt.status}
                  type="button"
                  onClick={() => handleSelect(opt.status)}
                  className={cn(
                    "w-full flex items-center justify-between rounded-lg px-2 py-1.5 text-xs font-medium transition-colors text-left",
                    isSelected
                      ? "bg-blue-50 text-blue-700 font-bold dark:bg-blue-950/60 dark:text-blue-300"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className={cn("w-2 h-2 rounded-full", opt.dot)} />
                    <OptIcon className="w-3.5 h-3.5 opacity-70" />
                    <span>{opt.label}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
