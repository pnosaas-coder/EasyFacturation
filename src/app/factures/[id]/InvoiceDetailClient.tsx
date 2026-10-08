"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sidebar } from "../../../components/layout/Sidebar";
import { Topbar } from "../../../components/layout/Topbar";
import { InvoicePreview } from "../../../components/invoices/InvoicePreview";
import { StatusBadge } from "../../../components/shared/StatusBadge";
import { DeleteConfirmationModal } from "../../../components/shared/DeleteConfirmationModal";
import { Invoice, OrganizationSettings, PaymentMethod, InvoiceStatus } from "../../../lib/domain/types";
import { formatFCFA } from "../../../lib/format/money";
import { formatDate } from "../../../lib/format/dates";
import {
  updateInvoiceStatusAction,
  deleteDraftInvoiceAction,
  duplicateInvoiceAction,
} from "../../../lib/actions/invoices";
import { recordPaymentAction } from "../../../lib/actions/payments";
import {
  ArrowLeft,
  Download,
  Coins,
  MessageSquare,
  Clock,
  Mail,
  Copy,
  Trash2,
  CheckCircle2,
  X,
  Printer,
} from "lucide-react";

interface InvoiceDetailClientProps {
  initialInvoice: Invoice;
  settings: OrganizationSettings;
}

export default function InvoiceDetailClient({
  initialInvoice,
  settings,
}: InvoiceDetailClientProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [invoice, setInvoice] = useState<Invoice>(initialInvoice);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Payment recording form state (MTN MoMo & Orange Money Cameroun)
  const [paymentAmount, setPaymentAmount] = useState<number>(
    invoice.balanceDue || invoice.total
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mtn_momo");
  const [paymentRef, setPaymentRef] = useState(`MOMO-CM-${Date.now().toString().slice(-6)}`);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentAmount <= 0) {
      toast.error("Le montant du règlement doit être supérieur à 0.");
      return;
    }

    if (paymentAmount > invoice.balanceDue) {
      toast.error(
        `Le montant (${formatFCFA(paymentAmount)}) dépasse le solde restant dû (${formatFCFA(
          invoice.balanceDue
        )}).`
      );
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Enregistrement du règlement...");

    try {
      const res = await recordPaymentAction({
        invoiceId: invoice.id,
        amount: paymentAmount,
        method: paymentMethod,
        paidOn: paymentDate,
        reference: paymentRef,
      });

      if (res.success && res.data) {
        const paymentResult = res.data;
        toast.success(`Règlement de ${formatFCFA(paymentAmount)} enregistré avec succès !`, {
          id: toastId,
        });

        const newRemaining = paymentResult.invoiceRemaining;
        const newPaid = invoice.amountPaid + paymentAmount;
        const newStatus: InvoiceStatus = newRemaining === 0 ? "paid" : "partial";

        setInvoice((prev) => ({
          ...prev,
          amountPaid: newPaid,
          balanceDue: newRemaining,
          status: newStatus,
          payments: [paymentResult.payment, ...(prev.payments || [])],
        }));

        setPaymentAmount(newRemaining);
        setPaymentModalOpen(false);
      } else {
        toast.error(res.error || "Erreur lors de l'enregistrement.", { id: toastId });
      }
    } catch {
      toast.error("Une erreur inattendue est survenue.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeletingDraft, setIsDeletingDraft] = useState(false);

  const handleStatusChange = async (newStatus: InvoiceStatus) => {
    const toastId = toast.loading(`Mise à jour du statut en « ${newStatus} »...`);
    try {
      const res = await updateInvoiceStatusAction(invoice.id, newStatus);
      if (res.success && res.data) {
        toast.success("Statut de la facture mis à jour avec succès !", { id: toastId });
        setInvoice(res.data);
        router.refresh();
      } else {
        toast.error(res.error || "Erreur lors du changement de statut.", { id: toastId });
      }
    } catch {
      toast.error("Erreur inattendue.", { id: toastId });
    }
  };

  const handleDuplicate = async () => {
    const toastId = toast.loading("Duplication de la facture...");
    try {
      const res = await duplicateInvoiceAction(invoice.id);
      if (res.success && res.data) {
        toast.success(`Brouillon ${res.data.number} créé avec succès !`, { id: toastId });
        router.push(`/factures/${res.data.id}`);
      } else {
        toast.error(res.error || "Erreur lors de la duplication.", { id: toastId });
      }
    } catch {
      toast.error("Erreur inattendue.", { id: toastId });
    }
  };

  const handleConfirmDeleteDraft = async () => {
    setIsDeletingDraft(true);
    const toastId = toast.loading("Suppression du brouillon...");
    try {
      const res = await deleteDraftInvoiceAction(invoice.id);
      if (res.success) {
        toast.success("Brouillon supprimé avec succès.", { id: toastId });
        router.push("/factures");
      } else {
        toast.error(res.error || "Erreur lors de la suppression.", { id: toastId });
      }
    } catch {
      toast.error("Erreur inattendue.", { id: toastId });
    } finally {
      setIsDeletingDraft(false);
    }
  };

  const getWhatsAppLink = () => {
    const text = encodeURIComponent(
      `Bonjour ${invoice.clientName},\nVoici votre facture ${invoice.number} d'un montant de ${formatFCFA(
        invoice.total
      )}.\nSolde restant dû : ${formatFCFA(invoice.balanceDue)}.\nÉchéance : ${formatDate(
        invoice.dueDate
      )}.\nInstructions de règlement :\n- MTN Mobile Money : ${settings.mtnMoMoPhone} (*126#)\n- Orange Money : ${settings.orangeMoneyPhone} (*150#)\n- Virement bancaire : ${settings.bankRib}\n\nMerci de votre confiance,\n${settings.managerName} (${settings.name})`
    );
    const phoneParam = invoice.clientPhone ? invoice.clientPhone.replace(/\D/g, "") : "";
    return `https://wa.me/${phoneParam}?text=${text}`;
  };

  return (
    <div className="flex min-h-screen bg-slate-50/70 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-x-hidden">
        <Topbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Top Return and Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                href="/factures"
                className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-400 hover:text-blue-600 hover:shadow-md hover:shadow-blue-500/10 active:translate-y-0 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                    Facture {invoice.number}
                  </h1>
                  <StatusBadge status={invoice.status} />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Client :{" "}
                  <strong className="text-slate-700 dark:text-slate-300">
                    {invoice.clientName}
                  </strong>{" "}
                  • Émise le {formatDate(invoice.issueDate)} par {settings.managerName}
                </p>
              </div>
            </div>

            {/* Actions Bar with rich hover states */}
            <div className="flex flex-wrap items-center gap-2">
              {invoice.balanceDue > 0 && invoice.status !== "draft" && invoice.status !== "cancelled" && (
                <button
                  onClick={() => setPaymentModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/30 active:translate-y-0 active:scale-95"
                >
                  <Coins className="h-4 w-4" />
                  <span>Enregistrer un règlement</span>
                </button>
              )}

              {invoice.status === "draft" && (
                <button
                  onClick={() => handleStatusChange("sent")}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 active:scale-95"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Valider & Émettre</span>
                </button>
              )}

              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-800 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-100 hover:shadow-md hover:shadow-emerald-600/15 active:translate-y-0 active:scale-95 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300"
              >
                <MessageSquare className="h-4 w-4" />
                <span>WhatsApp</span>
              </a>

              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md active:translate-y-0 active:scale-95 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
              >
                <Printer className="h-4 w-4 text-slate-500" />
                <span>Imprimer / PDF</span>
              </button>

              <button
                onClick={handleDuplicate}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-all hover:-translate-y-0.5 active:scale-95 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
                title="Dupliquer la facture"
              >
                <Copy className="h-4 w-4" />
                <span className="hidden sm:inline">Dupliquer</span>
              </button>

              {invoice.status === "draft" && (
                <button
                  onClick={() => setDeleteModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-all hover:-translate-y-0.5 active:scale-95 dark:bg-rose-950/30 dark:border-rose-900 dark:text-rose-400"
                  title="Supprimer ce brouillon"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Supprimer</span>
                </button>
              )}
            </div>
          </div>

          {/* Two Columns: Invoice Sheet (Left) & Payment / Timeline (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: The rendered invoice document sheet */}
            <div className="lg:col-span-8 print:w-full">
              <InvoicePreview
                invoiceNumber={invoice.number}
                clientName={invoice.clientName}
                clientEmail={invoice.clientEmail}
                clientPhone={invoice.clientPhone}
                clientAddress={invoice.clientCity}
                issueDate={invoice.issueDate}
                dueDate={invoice.dueDate}
                items={invoice.items}
                subtotal={invoice.subtotal}
                discountAmount={invoice.discountAmount}
                taxTotal={invoice.taxTotal}
                total={invoice.total}
                sellerName={settings.name}
                sellerPhone={settings.phone}
                sellerAddress={`${settings.address}, ${settings.city}, Cameroun`}
                sellerTaxId={settings.taxId}
                sellerRccm={settings.rccm}
                status={invoice.status}
                paymentInstructions={{
                  mtnMoMoPhone: `${settings.mtnMoMoPhone} (MTN MoMo)`,
                  orangeMoneyPhone: `${settings.orangeMoneyPhone} (Orange Money)`,
                  bankRib: settings.bankRib,
                }}
              />
            </div>

            {/* Right: Payment history & Activity Timeline */}
            <div className="lg:col-span-4 space-y-6 print:hidden">
              {/* Payment Summary Box */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Règlements & Trésorerie
                </h3>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Montant total TTC :</span>
                    <strong className="text-slate-900 dark:text-white">
                      {formatFCFA(invoice.total)}
                    </strong>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Total encaissé :</span>
                    <strong className="text-emerald-600 dark:text-emerald-400">
                      {formatFCFA(invoice.amountPaid)}
                    </strong>
                  </div>

                  <div className="flex justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Solde restant dû :
                    </span>
                    <strong className="text-amber-600 dark:text-amber-400 font-bold">
                      {formatFCFA(invoice.balanceDue)}
                    </strong>
                  </div>
                </div>

                {/* List of payments */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
                  <h4 className="text-[11px] font-semibold text-slate-400 mb-2">
                    Historique des encaissements ({invoice.payments?.length || 0})
                  </h4>

                  {!invoice.payments || invoice.payments.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">
                      Aucun règlement enregistré pour le moment.
                    </p>
                  ) : (
                    <div className="space-y-2.5">
                      {invoice.payments.map((p) => (
                        <div
                          key={p.id}
                          className="rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 text-xs dark:border-slate-800 dark:bg-slate-800/40"
                        >
                          <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                            <span>{formatFCFA(p.amount)}</span>
                            <span className="text-[10px] rounded-md bg-emerald-100 px-1.5 py-0.5 text-emerald-800 uppercase font-bold">
                              {p.method === "mtn_momo"
                                ? "MTN MoMo"
                                : p.method === "orange_money"
                                ? "Orange Money"
                                : p.method === "bank_transfer"
                                ? "Virement"
                                : p.method}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                            <span>{formatDate(p.paidOn)}</span>
                            {p.reference && <span className="font-mono">{p.reference}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Activity Timeline Card */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-blue-600" />
                  Journal d'activité
                </h3>

                <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
                  {invoice.payments?.map((p) => (
                    <div key={p.id} className="flex items-start gap-3 relative pl-6">
                      <span className="absolute left-1 top-1.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-slate-900" />
                      <div>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          Règlement de {formatFCFA(p.amount)} reçu
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {formatDate(p.paidOn)} via {p.method}
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="flex items-start gap-3 relative pl-6">
                    <span className="absolute left-1 top-1.5 h-2.5 w-2.5 rounded-full bg-blue-500 ring-4 ring-white dark:ring-slate-900" />
                    <div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        Facture émise
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {formatDate(invoice.issueDate)} par {settings.managerName}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* RECORD PAYMENT MODAL (MTN MoMo & Orange Money Cameroun) */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Enregistrer un règlement (Cameroun)
                </h3>
              </div>
              <button
                onClick={() => setPaymentModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Montant encaissé (FCFA) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max={invoice.balanceDue}
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(parseInt(e.target.value) || 0)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-slate-400">
                    FCFA
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Solde dû : <strong>{formatFCFA(invoice.balanceDue)}</strong>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Moyen de paiement local *
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                >
                  <option value="mtn_momo">MTN Mobile Money (*126# - 677481161)</option>
                  <option value="orange_money">Orange Money Cameroun (*150# - 691114908)</option>
                  <option value="bank_transfer">Virement bancaire (Afriland First Bank)</option>
                  <option value="cash">Espèces</option>
                  <option value="check">Chèque certifié</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Date du paiement
                  </label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Réf. Transaction MoMo / ID
                  </label>
                  <input
                    type="text"
                    value={paymentRef}
                    onChange={(e) => setPaymentRef(e.target.value)}
                    placeholder="Ex: 9281734"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
                >
                  Confirmer le paiement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Accessible Deletion Modal for Drafts */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDeleteDraft}
        title="Supprimer ce brouillon"
        description="Êtes-vous certain de vouloir supprimer définitivement ce brouillon de facture ? Cette action est irréversible."
        itemLabel={invoice.number}
        isDeleting={isDeletingDraft}
      />
    </div>
  );
}
