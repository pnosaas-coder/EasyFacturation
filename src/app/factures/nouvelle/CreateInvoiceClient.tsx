"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sidebar } from "../../../components/layout/Sidebar";
import { Topbar } from "../../../components/layout/Topbar";
import { InvoicePreview } from "../../../components/invoices/InvoicePreview";
import { calculateInvoiceTotals } from "../../../lib/calc/invoice-totals";
import { createInvoiceAction } from "../../../lib/actions/invoices";
import { Client, Product, OrganizationSettings } from "../../../lib/domain/types";
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
  Sparkles,
} from "lucide-react";

interface FormLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  productId?: string;
}

interface CreateInvoiceClientProps {
  clients: Client[];
  products: Product[];
  settings: OrganizationSettings;
}

export function CreateInvoiceClient({
  clients,
  products,
  settings,
}: CreateInvoiceClientProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invoiceType, setInvoiceType] = useState<"standard" | "split" | "recurring">("standard");

  // Client Selection
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || "cli_1");
  const [clientName, setClientName] = useState(clients[0]?.name || "MTN Cameroon B2B");
  const [clientEmail, setClientEmail] = useState(clients[0]?.email || "business@mtn.cm");
  const [clientPhone, setClientPhone] = useState(clients[0]?.phone || "+237 6 77 12 34 56");
  const [clientCity, setClientCity] = useState(clients[0]?.city || "Douala, Cameroun");
  const [clientAddress, setClientAddress] = useState(clients[0]?.address || "Akwa");

  // Dates
  const todayStr = new Date().toISOString().split("T")[0];
  const defaultDue = new Date();
  defaultDue.setDate(defaultDue.getDate() + (settings.paymentTermsDays || 30));
  const defaultDueStr = defaultDue.toISOString().split("T")[0];

  const [issueDate, setIssueDate] = useState(todayStr);
  const [dueDate, setDueDate] = useState(defaultDueStr);

  const [hasDiscount, setHasDiscount] = useState(false);
  const [discountType, setDiscountType] = useState<"percent" | "amount">("percent");
  const [discountValue, setDiscountValue] = useState<number>(5);

  const [notes, setNotes] = useState(settings.defaultNotes || "");
  const [terms, setTerms] = useState(settings.defaultTerms || "");

  const [items, setItems] = useState<FormLineItem[]>([
    {
      id: "1",
      description: products[0]?.name || "Audit d'infrastructure Cloud & Sécurité SI",
      quantity: 1,
      unitPrice: products[0]?.unitPrice || 2_500_000,
      taxRate: 19.25,
      productId: products[0]?.id,
    },
    {
      id: "2",
      description: products[1]?.name || "Accompagnement DevOps & Haute Disponibilité",
      quantity: 1,
      unitPrice: products[1]?.unitPrice || 1_300_000,
      taxRate: 19.25,
      productId: products[1]?.id,
    },
  ]);

  const handleSelectClient = (clientId: string) => {
    setSelectedClientId(clientId);
    const found = clients.find((c) => c.id === clientId);
    if (found) {
      setClientName(found.name);
      setClientEmail(found.email || "");
      setClientPhone(found.phone || "");
      setClientCity(found.city || "Douala, Cameroun");
      setClientAddress(found.address || "");
    }
  };

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
        taxRate: 19.25,
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
        if (it.id === id) {
          return { ...it, [field]: value };
        }
        return it;
      })
    );
  };

  const handleSelectProduct = (itemId: string, productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;
    setItems(
      items.map((it) => {
        if (it.id === itemId) {
          return {
            ...it,
            description: prod.name,
            unitPrice: prod.unitPrice,
            taxRate: prod.taxRate,
            productId: prod.id,
          };
        }
        return it;
      })
    );
  };

  const handleSubmit = async (targetStatus: "draft" | "sent") => {
    if (!clientName.trim()) {
      toast.error("Veuillez renseigner le nom du client.");
      return;
    }

    if (items.some((it) => !it.description.trim() || it.quantity <= 0)) {
      toast.error("Veuillez vérifier les lignes d'articles (description requise, quantité > 0).");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading(
      targetStatus === "draft"
        ? "Enregistrement du brouillon..."
        : "Validation et émission de la facture..."
    );

    try {
      const res = await createInvoiceAction({
        clientId: selectedClientId || "cli_1",
        clientName,
        clientEmail: clientEmail || undefined,
        clientPhone: clientPhone || undefined,
        clientCity: clientCity || undefined,
        clientAddress: clientAddress || undefined,
        issueDate,
        dueDate,
        status: targetStatus,
        discountType: hasDiscount ? discountType : undefined,
        discountValue: hasDiscount ? discountValue : undefined,
        notes: notes || undefined,
        terms: terms || undefined,
        items: items.map((it) => ({
          description: it.description,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
          taxRate: it.taxRate,
          productId: it.productId,
        })),
      });

      if (res.success && res.data) {
        toast.success(
          targetStatus === "draft"
            ? `Brouillon ${res.data.number} créé avec succès !`
            : `Facture ${res.data.number} émise avec succès !`,
          { id: toastId }
        );
        router.push(`/factures/${res.data.id}`);
      } else {
        toast.error(res.error || "Une erreur est survenue lors de l'enregistrement.", {
          id: toastId,
        });
      }
    } catch {
      toast.error("Erreur inattendue lors de l'enregistrement.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
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
                <Link
                  href="/factures"
                  className="hover:text-blue-600 transition-colors"
                >
                  Factures
                </Link>
                <span>&gt;</span>
                <span className="text-slate-900 dark:text-white">Créer une facture</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                Créer une facture
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {settings.name} • Émission en FCFA (XAF) avec TVA de {settings.defaultTaxRate}%
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
                  showPreview ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    showPreview ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Type Segmented Control (Standard | Échéances | Récurrente) */}
          <div className="mb-6 flex max-w-md rounded-xl bg-slate-200/70 p-1 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setInvoiceType("standard")}
              className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all duration-200 ${
                invoiceType === "standard"
                  ? "bg-white text-blue-700 shadow-2xs dark:bg-slate-900 dark:text-blue-400"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
              }`}
            >
              Facture Standard
            </button>
            <button
              type="button"
              onClick={() => setInvoiceType("split")}
              className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all duration-200 ${
                invoiceType === "split"
                  ? "bg-white text-blue-700 shadow-2xs dark:bg-slate-900 dark:text-blue-400"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
              }`}
            >
              Échéances multiples
            </button>
            <button
              type="button"
              onClick={() => setInvoiceType("recurring")}
              className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all duration-200 ${
                invoiceType === "recurring"
                  ? "bg-white text-blue-700 shadow-2xs dark:bg-slate-900 dark:text-blue-400"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
              }`}
            >
              Récurrente (Abonnement)
            </button>
          </div>

          {/* TWO-PANEL LAYOUT (FORM LEFT + LIVE PREVIEW RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT PANEL: Form Fields (7 cols if preview is open, 12 if not) */}
            <div
              className={`space-y-6 transition-all duration-300 ${
                showPreview ? "lg:col-span-7" : "lg:col-span-12 max-w-4xl mx-auto"
              }`}
            >
              {/* Card 1: Client Selection & Billing Details */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Destinataire (Client Camerounais)
                    </h2>
                  </div>

                  {/* Pre-fill Quick Client Dropdown */}
                  <select
                    value={selectedClientId}
                    onChange={(e) => handleSelectClient(e.target.value)}
                    className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 focus:outline-blue-500"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.city || "Cameroun"})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Nom de l'entreprise ou Client *
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                      placeholder="Ex: MTN Cameroon B2B"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Email de facturation
                    </label>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                      placeholder="business@mtn.cm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Téléphone (MTN / Orange)
                    </label>
                    <input
                      type="text"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                      placeholder="+237 6 77 12 34 56"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Ville & Quartier
                    </label>
                    <input
                      type="text"
                      value={clientCity}
                      onChange={(e) => setClientCity(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                      placeholder="Douala (Akwa), Cameroun"
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Dates & Invoice Numbers */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Dates & Échéance
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Date d'émission
                    </label>
                    <input
                      type="date"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Date d'échéance ({settings.paymentTermsDays} jours)
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Card 3: Line Items (Dynamiques & Autocomplétion catalogue) */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Boxes className="h-4 w-4 text-blue-600" />
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Prestations & Articles
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 transition-all duration-200 hover:bg-blue-100 hover:-translate-y-0.5 active:scale-95 dark:bg-blue-950/50 dark:text-blue-400"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Ajouter une ligne
                  </button>
                </div>

                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all dark:border-slate-800 dark:bg-slate-800/40"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-500">
                            #{index + 1}
                          </span>
                          {/* Catalog Autocomplete Selector */}
                          <select
                            onChange={(e) => handleSelectProduct(item.id, e.target.value)}
                            className="text-[11px] font-medium bg-white border border-slate-200 rounded-md px-2 py-0.5 text-slate-600 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300"
                          >
                            <option value="">Insérer depuis le catalogue...</option>
                            {products.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name} ({p.unitPrice.toLocaleString("fr-FR")} FCFA)
                              </option>
                            ))}
                          </select>
                        </div>

                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                        <div className="md:col-span-6">
                          <label className="block text-[11px] font-medium text-slate-500 mb-1">
                            Description du service / produit
                          </label>
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) =>
                              handleItemChange(item.id, "description", e.target.value)
                            }
                            placeholder="Ex: Audit d'infrastructure SI"
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-[11px] font-medium text-slate-500 mb-1">
                            Quantité
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "quantity",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 text-right dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-[11px] font-medium text-slate-500 mb-1">
                            Prix Unit. (FCFA)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="1000"
                            value={item.unitPrice}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "unitPrice",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 text-right dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-[11px] font-medium text-slate-500 mb-1">
                            TVA Cameroun
                          </label>
                          <select
                            value={item.taxRate}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "taxRate",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                          >
                            <option value="19.25">19,25% (Standard)</option>
                            <option value="10">10,00% (Réduit)</option>
                            <option value="0">0% (Exonéré)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Remise Toggle */}
                <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={hasDiscount}
                        onChange={(e) => setHasDiscount(e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>Appliquer une remise commerciale</span>
                    </label>

                    {hasDiscount && (
                      <div className="flex items-center gap-2">
                        <select
                          value={discountType}
                          onChange={(e) =>
                            setDiscountType(e.target.value as "percent" | "amount")
                          }
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        >
                          <option value="percent">Pourcentage (%)</option>
                          <option value="amount">Montant fixe (FCFA)</option>
                        </select>
                        <input
                          type="number"
                          value={discountValue}
                          onChange={(e) =>
                            setDiscountValue(parseFloat(e.target.value) || 0)
                          }
                          className="w-24 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-right text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSubmit("draft")}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md active:scale-95 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                  <Save className="h-4 w-4" />
                  <span>Enregistrer en brouillon</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSubmit("sent")}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/35 active:scale-95 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  <span>Valider & Émettre la facture</span>
                </button>
              </div>
            </div>

            {/* RIGHT PANEL: Live PDF-style Preview (5 cols) */}
            {showPreview && (
              <div className="lg:col-span-5 sticky top-20 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
                  <span>Aperçu en direct (Temps réel)</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Synchronisé
                  </span>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                  <InvoicePreview
                    invoiceNumber="Prochaine séquence"
                    issueDate={issueDate}
                    dueDate={dueDate}
                    sellerName={settings.name}
                    sellerPhone={settings.phone}
                    sellerAddress={settings.address + ", " + settings.city}
                    sellerTaxId={settings.taxId}
                    sellerRccm={settings.rccm}
                    clientName={clientName}
                    clientEmail={clientEmail}
                    clientPhone={clientPhone}
                    clientAddress={clientCity}
                    items={items.map((it, idx) => ({
                      id: it.id,
                      description: it.description || "Article non décrit",
                      quantity: it.quantity,
                      unitPrice: it.unitPrice,
                      taxRate: it.taxRate,
                      lineSubtotal: totals.lineItems[idx]?.lineSubtotal ?? 0,
                      lineTax: totals.lineItems[idx]?.lineTax ?? 0,
                    }))}
                    subtotal={totals.subtotal}
                    discountAmount={totals.discountAmount}
                    taxTotal={totals.taxTotal}
                    total={totals.total}
                    paymentInstructions={{
                      mtnMoMoPhone: `${settings.mtnMoMoPhone} (MTN MoMo)`,
                      orangeMoneyPhone: `${settings.orangeMoneyPhone} (Orange Money)`,
                      bankRib: settings.bankRib,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
