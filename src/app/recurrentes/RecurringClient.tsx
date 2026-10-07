"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Sidebar } from "../../components/layout/Sidebar";
import { Topbar } from "../../components/layout/Topbar";
import { formatFCFA } from "../../lib/format/money";
import { formatDate } from "../../lib/format/dates";
import { RecurringInvoice } from "../../lib/domain/types";
import {
  Repeat,
  Plus,
  Play,
  Pause,
  Clock,
  Sparkles,
  Calendar,
  Building2,
  CheckCircle2,
  X,
} from "lucide-react";

const initialRecurring: RecurringInvoice[] = [
  {
    id: "rec_1",
    clientName: "MTN Cameroon B2B",
    clientEmail: "business@mtn.cm",
    frequency: "monthly",
    amount: 1_490_625,
    startDate: "2026-01-01",
    nextRunDate: "2026-11-01",
    status: "active",
    description: "Infogérance Cloud & Support N3 Infrastructures",
  },
  {
    id: "rec_2",
    clientName: "Boissons du Cameroun (SABC)",
    clientEmail: "finances@sabc-cm.com",
    frequency: "monthly",
    amount: 2_981_250,
    startDate: "2026-02-01",
    nextRunDate: "2026-11-01",
    status: "active",
    description: "Maintenance applicative ERP & Base de données Oracle",
  },
  {
    id: "rec_3",
    clientName: "Eneo Cameroon S.A.",
    clientEmail: "direction.si@eneo.cm",
    frequency: "quarterly",
    amount: 4_500_000,
    startDate: "2026-01-01",
    nextRunDate: "2027-01-01",
    status: "paused",
    description: "Audit trimestriel de cyber-sécurité & Conformité CEMAC",
  },
];

export function RecurringClient() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [items, setItems] = useState<RecurringInvoice[]>(initialRecurring);
  const [modalOpen, setModalOpen] = useState(false);

  // New recurring state
  const [clientName, setClientName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(1_000_000);
  const [frequency, setFrequency] = useState<"monthly" | "quarterly" | "yearly">("monthly");

  const toggleStatus = (id: string) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        const newStatus = it.status === "active" ? "paused" : "active";
        toast.success(
          newStatus === "active"
            ? `Abonnement « ${it.clientName} » réactivé !`
            : `Abonnement « ${it.clientName} » suspendu.`
        );
        return { ...it, status: newStatus };
      })
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !description.trim()) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const newItem: RecurringInvoice = {
      id: `rec_${Date.now()}`,
      clientName,
      description,
      amount: Number(amount) || 0,
      frequency,
      startDate: new Date().toISOString().split("T")[0],
      nextRunDate: "2026-11-01",
      status: "active",
    };

    setItems([newItem, ...items]);
    setModalOpen(false);
    setClientName("");
    setDescription("");
    setAmount(1_000_000);
    toast.success("Modèle de facture récurrente enregistré avec succès !");
  };

  return (
    <div className="flex min-h-screen bg-slate-50/70 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <div className="flex flex-1 flex-col overflow-x-hidden">
        <Topbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950 dark:text-white flex items-center gap-2">
                <Repeat className="h-6 w-6 text-blue-600" />
                Factures Récurrentes & Abonnements
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Génération automatique de vos factures mensuelles et trimestrielles en FCFA.
              </p>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Nouvel abonnement récurrent</span>
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {item.frequency === "monthly"
                        ? "Mensuel"
                        : item.frequency === "quarterly"
                        ? "Trimestriel"
                        : "Annuel"}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                      {item.clientName}
                    </h3>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      item.status === "active"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    }`}
                  >
                    {item.status === "active" ? "Actif" : "En pause"}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 min-h-[32px]">
                  {item.description}
                </p>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Montant par échéance :</span>
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">
                      {formatFCFA(item.amount)}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Prochaine émission :</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {formatDate(item.nextRunDate)}
                    </span>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    onClick={() => toggleStatus(item.id)}
                    className={`w-full inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all active:scale-95 ${
                      item.status === "active"
                        ? "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
                        : "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
                    }`}
                  >
                    {item.status === "active" ? (
                      <>
                        <Pause className="h-3.5 w-3.5" />
                        <span>Mettre en pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5" />
                        <span>Activer la récurrence</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Modal New Recurring */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Repeat className="h-5 w-5 text-blue-600" />
                Programmer une facture récurrente
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nom du client *
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ex: Société Générale Cameroun..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description du contrat de récurrence *
                </label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Maintenance applicative et astreinte 24/7..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Montant par période (FCFA) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="5000"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value) || 0)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold text-slate-900 focus:border-blue-600 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Fréquence
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as typeof frequency)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="monthly">Mensuel</option>
                    <option value="quarterly">Trimestriel</option>
                    <option value="yearly">Annuel</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition-all active:scale-95"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Enregistrer l'échéancier</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
