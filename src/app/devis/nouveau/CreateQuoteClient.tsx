"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sidebar } from "../../../components/layout/Sidebar";
import { Topbar } from "../../../components/layout/Topbar";
import { formatFCFA } from "../../../lib/format/money";
import { calculateInvoiceTotals } from "../../../lib/calc/invoice-totals";
import { Client, Product } from "../../../lib/domain/types";
import { createQuoteAction } from "../../../lib/actions/quotes";
import {
  ArrowLeft,
  Plus,
  Trash2,
  FileCheck2,
  Sparkles,
  Calendar,
  Building2,
  Send,
  Save,
} from "lucide-react";

interface CreateQuoteClientProps {
  clients: Client[];
  products: Product[];
}

interface QuoteFormItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
}

export function CreateQuoteClient({
  clients,
  products,
}: CreateQuoteClientProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Client selection
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || "");
  const selectedClient = clients.find((c) => c.id === selectedClientId) || clients[0];

  // Dates
  const today = new Date().toISOString().split("T")[0];
  const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const [issueDate, setIssueDate] = useState(today);
  const [validUntil, setValidUntil] = useState(nextMonth);
  const [notes, setNotes] = useState(
    "Devis valable 30 jours à compter de la date d'émission. Règlements acceptés : MTN Mobile Money (*126#), Orange Money (*150#) ou virement bancaire."
  );

  // Items
  const [items, setItems] = useState<QuoteFormItem[]>([
    {
      id: "it-1",
      description: products[0]?.name || "Prestation de service informatique",
      quantity: 1,
      unitPrice: products[0]?.unitPrice || 750_000,
      taxRate: 19.25,
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live Totals calculation with deterministic big.js
  const totals = calculateInvoiceTotals(
    items.map((it) => ({
      quantity: it.quantity,
      unitPrice: it.unitPrice,
      taxRate: it.taxRate,
    }))
  );

  const handleAddItem = () => {
    const newItem: QuoteFormItem = {
      id: `it-${Date.now()}`,
      description: "Nouvelle prestation",
      quantity: 1,
      unitPrice: 150_000,
      taxRate: 19.25,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) {
      toast.error("Le devis doit comporter au moins une prestation.");
      return;
    }
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleUpdateItem = (
    id: string,
    field: keyof QuoteFormItem,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        return { ...it, [field]: value };
      })
    );
  };

  const handleSelectProduct = (itemId: string, prodId: string) => {
    const prod = products.find((p) => p.id === prodId);
    if (!prod) return;
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== itemId) return it;
        return {
          ...it,
          description: prod.name,
          unitPrice: prod.unitPrice,
          taxRate: prod.taxRate,
        };
      })
    );
  };

  const handleSubmit = async (status: "draft" | "sent") => {
    if (!selectedClient) {
      toast.error("Veuillez sélectionner un client.");
      return;
    }

    if (items.some((it) => !it.description.trim() || it.unitPrice < 0)) {
      toast.error("Veuillez renseigner correctement toutes les lignes.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading(
      status === "sent" ? "Émission du devis..." : "Enregistrement du brouillon..."
    );

    try {
      const res = await createQuoteAction({
        clientId: selectedClient.id,
        clientName: selectedClient.name,
        clientEmail: selectedClient.email,
        clientPhone: selectedClient.phone,
        clientCity: selectedClient.city,
        clientAddress: selectedClient.address,
        issueDate,
        validUntil,
        status,
        notes,
        items: items.map((it) => ({
          description: it.description,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
          taxRate: it.taxRate,
        })),
      });

      if (res.success && res.data) {
        toast.success(`Devis ${res.data.number} créé avec succès !`, { id: toastId });
        router.push("/devis");
      } else {
        toast.error(res.error || "Erreur lors de la création du devis.", { id: toastId });
      }
    } catch {
      toast.error("Une erreur inattendue est survenue.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50/70 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-x-hidden">
        <Topbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto w-full">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                href="/devis"
                className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-400 hover:text-blue-600 hover:shadow-md hover:shadow-blue-500/10 active:translate-y-0 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950 dark:text-white flex items-center gap-2">
                  <FileCheck2 className="h-6 w-6 text-blue-600" />
                  Nouveau devis commercial
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Établissez une proposition chiffrée en FCFA pour un client camerounais ou CEMAC.
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmit("draft")}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md active:translate-y-0 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                <Save className="h-4 w-4 text-slate-500" />
                <span>Brouillon</span>
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmit("sent")}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-600/35 active:translate-y-0 active:scale-95"
              >
                <Send className="h-4 w-4" />
                <span>Valider & Envoyer le devis</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Form Left Column */}
            <div className="lg:col-span-8 space-y-6">
              {/* Client & Dates Card */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  <Building2 className="h-4 w-4 text-blue-600" />
                  <span>Destinataire & Validité</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Client Select */}
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Client destinataire *
                    </label>
                    <select
                      value={selectedClientId}
                      onChange={(e) => setSelectedClientId(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-xs font-semibold text-slate-800 focus:border-blue-600 focus:bg-white focus:outline-hidden dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                    >
                      {clients.map((cli) => (
                        <option key={cli.id} value={cli.id}>
                          {cli.name} ({cli.city || "Cameroun"})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Issue Date */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Date d'émission
                    </label>
                    <input
                      type="date"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-xs font-medium text-slate-800 focus:border-blue-600 focus:bg-white focus:outline-hidden dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                    />
                  </div>

                  {/* Valid Until */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Date de fin de validité
                    </label>
                    <input
                      type="date"
                      value={validUntil}
                      onChange={(e) => setValidUntil(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-xs font-medium text-slate-800 focus:border-blue-600 focus:bg-white focus:outline-hidden dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                    />
                  </div>

                  {/* Currency (Locked FCFA) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Devise commerciale
                    </label>
                    <div className="rounded-xl border border-slate-200 bg-slate-100/70 p-2.5 text-xs font-bold text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300">
                      FCFA (XAF - CEMAC)
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Card */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    <span>Lignes de prestations & produits</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 transition-all hover:-translate-y-0.5 hover:bg-blue-100 active:scale-95 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Ajouter une ligne</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-slate-200/70 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40 space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-slate-400">
                          Prestation #{index + 1}
                        </span>

                        <div className="flex items-center gap-2">
                          {/* Quick populate from catalogue */}
                          <select
                            onChange={(e) => {
                              if (e.target.value) handleSelectProduct(item.id, e.target.value);
                            }}
                            defaultValue=""
                            className="text-[10px] rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          >
                            <option value="" disabled>
                              Catalogue PNO...
                            </option>
                            {products.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name} ({formatFCFA(p.unitPrice)})
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                            title="Supprimer la ligne"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                        <div className="sm:col-span-6">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => handleUpdateItem(item.id, "description", e.target.value)}
                            placeholder="Désignation de la prestation ou marchandise..."
                            className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-semibold text-slate-900 focus:border-blue-600 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleUpdateItem(item.id, "quantity", Number(e.target.value) || 1)
                            }
                            placeholder="Qté"
                            className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-center font-bold text-slate-900 focus:border-blue-600 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <input
                            type="number"
                            min="0"
                            step="1000"
                            value={item.unitPrice}
                            onChange={(e) =>
                              handleUpdateItem(item.id, "unitPrice", Number(e.target.value) || 0)
                            }
                            placeholder="Prix (FCFA)"
                            className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-right font-bold text-slate-900 focus:border-blue-600 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                          />
                        </div>

                        <div className="sm:col-span-2 flex items-center justify-end text-right">
                          <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                            {formatFCFA(item.quantity * item.unitPrice)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-2">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Modalités & Conditions particulières
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-800 focus:border-blue-600 focus:bg-white focus:outline-hidden dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            {/* Right Summary Column */}
            <div className="lg:col-span-4 space-y-6">
              {/* Financial Box */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Synthèse Financière
                </h3>

                <div className="space-y-2.5 text-xs divide-y divide-slate-100 dark:divide-slate-800">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400 pt-1">
                    <span>Sous-total HT :</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatFCFA(totals.subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-600 dark:text-slate-400 pt-2">
                    <span>TVA Cameroun (19,25%) :</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatFCFA(totals.taxTotal)}
                    </span>
                  </div>

                  <div className="flex justify-between rounded-xl bg-blue-50 p-3 text-sm font-bold text-blue-950 dark:bg-blue-950/60 dark:text-blue-200 border border-blue-100 dark:border-blue-900 pt-3">
                    <span>TOTAL TTC DU DEVIS :</span>
                    <span className="text-base text-blue-700 dark:text-blue-300">
                      {formatFCFA(totals.total)}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleSubmit("sent")}
                    className="w-full inline-flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-3 text-xs font-bold text-white shadow-md shadow-blue-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg active:scale-95"
                  >
                    <Send className="h-4 w-4" />
                    <span>Valider et émettre le devis</span>
                  </button>
                </div>
              </div>

              {/* Client Snapshot Card */}
              {selectedClient && (
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Informations du client
                  </h4>
                  <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
                    <p className="font-bold text-slate-900 dark:text-white text-sm">
                      {selectedClient.name}
                    </p>
                    <p>{selectedClient.address || "Douala / Yaoundé, Cameroun"}</p>
                    <p>{selectedClient.email || "Email non renseigné"}</p>
                    <p>{selectedClient.phone || "Téléphone non renseigné"}</p>
                    {selectedClient.taxId && (
                      <p className="text-[11px] font-mono text-slate-500">
                        NIU : {selectedClient.taxId}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
