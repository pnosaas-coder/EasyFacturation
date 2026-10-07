import React from "react";
import { InvoiceStatus } from "../../lib/domain/types";
import { cn } from "../../lib/utils";
import { contentFr } from "../../content/fr";
import { CheckCircle2, Clock, AlertCircle, FileEdit, Send, Ban } from "lucide-react";

interface StatusBadgeProps {
  status: InvoiceStatus;
  className?: string;
  showIcon?: boolean;
}

export function StatusBadge({ status, className, showIcon = true }: StatusBadgeProps) {
  const config = {
    paid: {
      label: contentFr.status.paid,
      bg: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60",
      dot: "bg-emerald-500",
      icon: CheckCircle2,
    },
    sent: {
      label: contentFr.status.sent,
      bg: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/60",
      dot: "bg-blue-500",
      icon: Send,
    },
    partial: {
      label: contentFr.status.partial,
      bg: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/60",
      dot: "bg-amber-500",
      icon: Clock,
    },
    overdue: {
      label: contentFr.status.overdue,
      bg: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/60",
      dot: "bg-rose-500",
      icon: AlertCircle,
    },
    draft: {
      label: contentFr.status.draft,
      bg: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700",
      dot: "bg-slate-400",
      icon: FileEdit,
    },
    cancelled: {
      label: contentFr.status.cancelled,
      bg: "bg-neutral-100 text-neutral-500 border-neutral-200 line-through dark:bg-neutral-900 dark:text-neutral-500 dark:border-neutral-800",
      dot: "bg-neutral-400",
      icon: Ban,
    },
  }[status] || {
    label: status,
    bg: "bg-slate-100 text-slate-700 border-slate-200",
    dot: "bg-slate-400",
    icon: Clock,
  };

  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors",
        config.bg,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", config.dot)} />
      {showIcon && <Icon className="w-3.5 h-3.5 shrink-0 opacity-80" />}
      <span>{config.label}</span>
    </span>
  );
}
