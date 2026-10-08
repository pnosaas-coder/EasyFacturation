"use client";

import React, { useEffect, useState } from "react";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  itemLabel?: string;
  confirmButtonText?: string;
  isDeleting?: boolean;
  onConfirm: () => Promise<void> | void;
  onClose: () => void;
}

export function DeleteConfirmationModal({
  isOpen,
  title,
  description,
  itemLabel,
  confirmButtonText = "Supprimer définitivement",
  isDeleting = false,
  onConfirm,
  onClose,
}: DeleteConfirmationModalProps) {
  const [internalDeleting, setInternalDeleting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting && !internalDeleting) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isDeleting, internalDeleting, onClose]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setInternalDeleting(true);
    try {
      await onConfirm();
    } finally {
      setInternalDeleting(false);
    }
  };

  const loading = isDeleting || internalDeleting;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-delete-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={() => {
        if (!loading) onClose();
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-rose-100 bg-white p-6 shadow-2xl dark:border-rose-950/60 dark:bg-slate-900 animate-in zoom-in-95 duration-150"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3
                id="modal-delete-title"
                className="text-base font-bold text-slate-900 dark:text-white"
              >
                {title}
              </h3>
              <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                Action irréversible
              </span>
            </div>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {itemLabel && (
          <div className="mt-4 rounded-xl border border-slate-200/80 bg-slate-50 p-3 text-xs font-semibold text-slate-800 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200">
            <span className="text-slate-400 text-[10px] uppercase font-bold block mb-0.5">
              Élément sélectionné :
            </span>
            <span className="font-mono text-xs">{itemLabel}</span>
          </div>
        )}

        <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          {description}
        </p>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:text-slate-900 active:scale-95 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
          >
            Annuler
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={handleConfirm}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-rose-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-rose-700 hover:shadow-lg active:scale-95 disabled:opacity-60",
              loading && "cursor-wait"
            )}
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Suppression en cours...</span>
              </>
            ) : (
              <>
                <Trash2 className="h-3.5 w-3.5" />
                <span>{confirmButtonText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
