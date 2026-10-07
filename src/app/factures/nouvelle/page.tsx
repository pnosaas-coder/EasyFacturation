"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sidebar } from "../../../components/layout/Sidebar";
import { Topbar } from "../../../components/layout/Topbar";
import { InvoicePreview } from "../../../components/invoices/InvoicePreview";
import { calculateInvoiceTotals } from "../../../lib/calc/invoice-totals";
import {
  User,
  Building2,
  Calendar,
  Hash,
  Coins,
  Puzzle,
  Boxes,
  Percent,
  Trash2,
  Plus,
  Send,
  Save,
  Mail,
  Download,
  Eye,
  EyeOff,
  ArrowLeft,
  Check,
  Sparkles,
} from "lucide-react";

interface FormLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
}

export default function CreateInvoicePage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [invoiceType, setInvoiceType] = useState<"standard" | "split" | "recurring">("standard");

  // Form states
  const [sellerName, setSellerName] = useState("PNO Solutions S.A.R.L");
  const [clientName, setClientName] = useState("Sonatel Orange B2B");
  const [clientEmail, setClientEmail] = useState("pro@orange-sonatel.sn");
  const [clientPhone, setClientPhone] = useState("+221 33 839 20 00");
  const [clientCity, setClientCity] = useState("Dakar, Sénégal");
  const [issueDate, setIssueDate] = useState("2026-10-07");
  const [dueDate, setDueDate] = useState("2026-11-07");
  const [invoiceNumber, setInvoiceNumber] = useState("FAC-2026-0049");

  const [hasDiscount, setHasDiscount] = useState(false);
  const [discountType, setDiscountType] = useState<"percent" | "amount">("percent");
  const [discountValue, setDiscountValue] = useState<number>(5);

  const [items, setItems] = useState<FormLineItem[]>([
    {
      id: "1",
      description: "Conseil & Stratégie Digitale SaaS",
      quantity: 1,
      unitPrice: 1_500_000,
      taxRate: 18,
    },
    {
      id: "2",
      description: "Développement Application Web & API Mobile",
      quantity: 2,
      unitPrice: 850_000,
      taxRate: 18,
    },
  ]);

  // Recalculate totals in real time using our pure calculation engine
  const totals = calculateInvoiceTotals(
    items.map((it) => ({
      quantity: it.quantity,
      unitPrice: it.unitPrice,
      taxRate: it.taxRate,
    })),
    hasDiscount ? { type: discountType, value: discountValue } : null
  );

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: String(Date.now()),
        description: "",
        quantity: 1,
        unitPrice: 250_000,
        taxRate: 18,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter((it) => it.id !== id));
  };

  const handleItemChange = (
    id: string,
    field: keyof FormLineItem,
    value: string | number
  ) => {
    setItems(
      items.map((it) => {
        if (it.id !== id) return it;
        return { ...it, [field]: value };
      })
    );
  };

  const handleSaveDraft = () => {
    alert("Facture enregistrée avec succès en brouillon !");
    router.push("/factures");
  };

  const handleSendInvoice = () => {
    alert("Facture validée et envoyée avec succès au client !");
    router.push("/factures");
  };

  return (
    <div className="flex min-h-screen bg-slate-50/70 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-x-hidden">
        <Topbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1700px] mx-auto w-full">
          {/* Top Breadcrumb & Title */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                <Link href="/factures" className="hover:text-blue-600 transition-colors">
                  Factures
                </Link>
                <span>&gt;</span>
                <span className="text-slate-900 dark:text-white">Créer une facture</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                Créer une facture
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Édition en direct avec calculs automatiques en FCFA et aperçu instantané.
              </p>
            </div>

            {/* Toggle show preview */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Afficher l'aperçu
              </span>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  showPreview ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                    showPreview ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Segmented Control: Standard | Échelonnée | Récurrente */}
          <div className="mb-8 inline-flex rounded-2xl bg-slate-200/70 p-1 dark:bg-slate-800">
            {[
              { id: "standard", label: "Standard" },
              { id: "split", label: "Paiement échelonné" },
              { id: "recurring", label: "Récurrente" },
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setInvoiceType(type.id as any)}
                className={`rounded-xl px-5 py-2 text-xs font-bold transition-all ${
                  invoiceType === type.id
                    ? "bg-white text-slate-950 shadow-sm dark:bg-slate-700 dark:text-white"
                    : "text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Main 2-Panel Layout matching the inspiration */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Form Pane */}
            <div
              className={`space-y-8 ${
                showPreview ? "lg:col-span-6 xl:col-span-6" : "lg:col-span-12 max-w-4xl mx-auto"
              }`}
            >
              {/* Card 1: Invoice Information */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] text-slate-400">
                  Informations de facturation
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name / Seller */}
                  <div className="relative">
                    <label className="absolute -top-2 left-3 bg-white dark:bg-slate-900 px-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-400 z-10 rounded">
                      Émetteur (Vendeur) *
                    </label>
                    <div className="relative flex items-center">
                      <User className="absolute left-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        value={sellerName}
                        onChange={(e) => setSellerName(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-xs font-semibold text-slate-900 transition-colors focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Billed To / Client */}
                  <div className="relative">
                    <label className="absolute -top-2 left-3 bg-white dark:bg-slate-900 px-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-400 z-10 rounded">
                      Facturé à (Client) *
                    </label>
                    <div className="relative flex items-center">
                      <Building2 className="absolute left-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-xs font-semibold text-slate-900 transition-colors focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Issue Date */}
                  <div className="relative">
                    <label className="absolute -top-2 left-3 bg-white dark:bg-slate-900 px-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-400 z-10 rounded">
                      Date d'émission *
                    </label>
                    <div className="relative flex items-center">
                      <Calendar className="absolute left-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type="date"
                        value={issueDate}
                        onChange={(e) => setIssueDate(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-xs font-semibold text-slate-900 transition-colors focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Due Date */}
                  <div className="relative">
                    <label className="absolute -top-2 left-3 bg-white dark:bg-slate-900 px-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-400 z-10 rounded">
                      Date d'échéance *
                    </label>
                    <div className="relative flex items-center">
                      <Calendar className="absolute left-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-xs font-semibold text-slate-900 transition-colors focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Invoice Number */}
                <div className="relative">
                  <label className="absolute -top-2 left-3 bg-white dark:bg-slate-900 px-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-400 z-10 rounded">
                    Numéro de facture
                  </label>
                  <div className="relative flex items-center">
                    <Hash className="absolute left-3.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3 pl-10 pr-3 text-xs font-mono font-bold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Items / Services */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] text-slate-400">
                    Lignes de prestations / Services
                  </h3>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    Devise : FCFA (XOF)
                  </span>
                </div>

                {/* Items loop */}
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4.5 dark:border-slate-800 dark:bg-slate-800/40 space-y-4 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500">
                          Prestation {index + 1}
                        </span>
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors"
                            title="Supprimer la ligne"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      {/* Description input */}
                      <div className="relative">
                        <label className="absolute -top-2 left-3 bg-slate-50 dark:bg-slate-800 px-1.5 text-[10px] font-bold text-slate-500 z-10 rounded">
                          Désignation de la prestation *
                        </label>
                        <div className="relative flex items-center">
                          <Puzzle className="absolute left-3.5 h-4 w-4 text-slate-400" />
                          <input
                            type="text"
                            placeholder="ex: Développement frontend Next.js..."
                            value={item.description}
                            onChange={(e) =>
                              handleItemChange(item.id, "description", e.target.value)
                            }
                            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-xs font-medium text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                          />
                        </div>
                      </div>

                      {/* 3-column row: Qty, Tax %, Unit Price */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Quantity */}
                        <div className="relative">
                          <label className="absolute -top-2 left-3 bg-slate-50 dark:bg-slate-800 px-1.5 text-[10px] font-bold text-slate-500 z-10 rounded">
                            Quantité *
                          </label>
                          <div className="relative flex items-center">
                            <Boxes className="absolute left-3 h-4 w-4 text-slate-400" />
                            <input
                              type="number"
                              min="1"
                              step="1"
                              value={item.quantity}
                              onChange={(e) =>
                                handleItemChange(
                                  item.id,
                                  "quantity",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs font-semibold text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                            />
                          </div>
                        </div>

                        {/* Tax Rate % */}
                        <div className="relative">
                          <label className="absolute -top-2 left-3 bg-slate-50 dark:bg-slate-800 px-1.5 text-[10px] font-bold text-slate-500 z-10 rounded">
                            TVA (%)
                          </label>
                          <div className="relative flex items-center">
                            <Percent className="absolute left-3 h-3.5 w-3.5 text-slate-400" />
                            <select
                              value={item.taxRate}
                              onChange={(e) =>
                                handleItemChange(
                                  item.id,
                                  "taxRate",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs font-semibold text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                            >
                              <option value="18">18% (Taux normal)</option>
                              <option value="0">0% (Exonéré)</option>
                              <option value="10">10% (Taux réduit)</option>
                            </select>
                          </div>
                        </div>

                        {/* Unit Price in FCFA */}
                        <div className="relative">
                          <label className="absolute -top-2 left-3 bg-slate-50 dark:bg-slate-800 px-1.5 text-[10px] font-bold text-slate-500 z-10 rounded">
                            Prix unitaire (FCFA) *
                          </label>
                          <div className="relative flex items-center">
                            <Coins className="absolute left-3 h-4 w-4 text-slate-400" />
                            <input
                              type="number"
                              min="0"
                              step="5000"
                              value={item.unitPrice}
                              onChange={(e) =>
                                handleItemChange(
                                  item.id,
                                  "unitPrice",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Item Button */}
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-blue-300 bg-blue-50/50 py-3 text-xs font-bold text-blue-700 hover:bg-blue-50 hover:border-blue-400 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-300 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>+ Ajouter une ligne de service</span>
                </button>

                {/* Discount Section */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="addDiscount"
                      checked={hasDiscount}
                      onChange={(e) => setHasDiscount(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <label
                      htmlFor="addDiscount"
                      className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      Appliquer une remise commerciale
                    </label>
                  </div>

                  {hasDiscount && (
                    <div className="mt-3 flex items-center gap-3">
                      <select
                        value={discountType}
                        onChange={(e) => setDiscountType(e.target.value as any)}
                        className="rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-medium dark:border-slate-700 dark:bg-slate-900"
                      >
                        <option value="percent">Pourcentage (%)</option>
                        <option value="amount">Montant fixe (FCFA)</option>
                      </select>

                      <input
                        type="number"
                        value={discountValue}
                        onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                        className="w-36 rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-bold dark:border-slate-700 dark:bg-slate-900"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Live Preview Pane matching the screenshot */}
            {showPreview && (
              <div className="lg:col-span-6 xl:col-span-6 space-y-4 sticky top-24">
                {/* Action Toolbar on top of preview */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 ml-2">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    Aperçu en direct
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Save Draft */}
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      <Save className="h-3.5 w-3.5 text-slate-500" />
                      <span>Enregistrer brouillon</span>
                    </button>

                    {/* Send Invoice */}
                    <button
                      type="button"
                      onClick={handleSendInvoice}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/25 hover:bg-blue-700 transition-all active:scale-98"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Envoyer la facture</span>
                    </button>
                  </div>
                </div>

                {/* The Invoice Document Sheet */}
                <InvoicePreview
                  invoiceNumber={invoiceNumber}
                  sellerName={sellerName}
                  clientName={clientName}
                  clientEmail={clientEmail}
                  clientPhone={clientPhone}
                  clientAddress={clientCity}
                  issueDate={issueDate}
                  dueDate={dueDate}
                  items={items}
                  subtotal={totals.subtotal}
                  discountAmount={totals.discountAmount}
                  taxTotal={totals.taxTotal}
                  total={totals.total}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
