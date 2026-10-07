"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sidebar } from "../../../components/layout/Sidebar";
import { Topbar } from "../../../components/layout/Topbar";
import { InvoicePreview } from "../../../components/invoices/InvoicePreview";
import { StatusBadge } from "../../../components/shared/StatusBadge";
import { mockRecentInvoices } from "../../../mocks/fixtures";
import { formatFCFA } from "../../../lib/format/money";
import { formatDate } from "../../../lib/format/dates";
import {
  ArrowLeft,
  Download,
  Coins,
  MessageSquare,
  Clock,
  Mail,
  ExternalLink,
  X,
} from "lucide-react";

export default function InvoiceDetailClient({
  invoiceId,
}: {
  invoiceId: string;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  // Find invoice from fixtures or fallback to first
  const invoice =
    mockRecentInvoices.find((inv) => inv.id === invoiceId) ||
    mockRecentInvoices[0];

  // Payment recording form state
  const [paymentAmount, setPaymentAmount] = useState<number>(
    invoice.balanceDue || invoice.total
  );
  const [paymentMethod, setPaymentMethod] = useState("wave");
  const [paymentRef, setPaymentRef] = useState("TXN-WAVE-892193");
  const [paymentDate, setPaymentDate] = useState("2026-10-07");

  const [recordedPayments, setRecordedPayments] = useState([
    ...(invoice.amountPaid > 0
      ? [
          {
            id: "pay_1",
            amount: invoice.amountPaid,
            date: "2026-09-15",
            method: "Wave",
            ref: "WV-SN-29384729",
          },
        ]
      : []),
  ]);

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentAmount <= 0) return;

    setRecordedPayments([
      ...recordedPayments,
      {
        id: String(Date.now()),
        amount: paymentAmount,
        date: paymentDate,
        method: paymentMethod.toUpperCase(),
        ref: paymentRef,
      },
    ]);

    setPaymentModalOpen(false);
    alert(`Paiement de ${formatFCFA(paymentAmount)} enregistré avec succès !`);
  };

  const getWhatsAppLink = () => {
    const text = encodeURIComponent(
      `Bonjour ${invoice.clientName},\nVoici votre facture ${invoice.number} d'un montant de ${formatFCFA(
        invoice.total
      )}.\nÉchéance : ${formatDate(invoice.dueDate)}.\nMerci de procéder au règlement.`
    );
    return `https://wa.me/?text=${text}`;
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
                className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
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
                  • Émise le {formatDate(invoice.issueDate)}
                </p>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setPaymentModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-all active:scale-98"
              >
                <Coins className="h-4 w-4" />
                <span>Enregistrer un paiement</span>
              </button>

              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300"
              >
                <MessageSquare className="h-4 w-4" />
                <span>WhatsApp</span>
              </a>

              <button
                onClick={() =>
                  alert(`Téléchargement de la facture ${invoice.number} en PDF.`)
                }
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
              >
                <Download className="h-4 w-4 text-slate-500" />
                <span>PDF</span>
              </button>
            </div>
          </div>

          {/* Two Columns: Invoice Sheet (Left) & Payment / Timeline (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: The rendered invoice document sheet */}
            <div className="lg:col-span-8">
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
                status={invoice.status}
              />
            </div>

            {/* Right: Payment history & Activity Timeline */}
            <div className="lg:col-span-4 space-y-6">
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
                      {formatFCFA(
                        recordedPayments.reduce((acc, p) => acc + p.amount, 0)
                      )}
                    </strong>
                  </div>

                  <div className="flex justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Solde restant dû :
                    </span>
                    <strong className="text-amber-600 dark:text-amber-400 font-bold">
                      {formatFCFA(
                        Math.max(
                          0,
                          invoice.total -
                            recordedPayments.reduce(
                              (acc, p) => acc + p.amount,
                              0
                            )
                        )
                      )}
                    </strong>
                  </div>
                </div>

                {/* List of payments */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">
                    Historique des encaissements
                  </span>

                  {recordedPayments.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">
                      Aucun versement enregistré pour le moment.
                    </p>
                  ) : (
                    recordedPayments.map((p) => (
                      <div
                        key={p.id}
                        className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60 text-xs flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-slate-800 dark:text-slate-200">
                            {formatFCFA(p.amount)}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {p.method} • {p.ref}
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-500">
                          {formatDate(p.date)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Timeline / Activity Log */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Journal d'activité & Traçabilité
                </h3>

                <div className="space-y-4 text-xs">
                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                      <Clock className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        Facture émise
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {formatDate(invoice.issueDate)} par Ousmane Diallo
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                      <Mail className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        Transmise par email avec PDF
                      </p>
                      <p className="text-[11px] text-slate-400">
                        À {invoice.clientEmail || "client@entreprise.com"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        Lien public consulté par le client
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Dernière consultation : hier à 16:42
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Modal */}
          {paymentModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
              <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Enregistrer un paiement
                  </h3>
                  <button
                    onClick={() => setPaymentModalOpen(false)}
                    className="rounded-lg p-1 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleRecordPayment} className="mt-4 space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Montant reçu (FCFA) *
                    </label>
                    <input
                      type="number"
                      required
                      min="100"
                      value={paymentAmount}
                      onChange={(e) =>
                        setPaymentAmount(parseFloat(e.target.value) || 0)
                      }
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Moyen de paiement *
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-xs font-semibold text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      <option value="wave">Wave Mobile Money</option>
                      <option value="orange_money">Orange Money</option>
                      <option value="mtn_momo">MTN Mobile Money</option>
                      <option value="bank_transfer">
                        Virement Bancaire (RIB)
                      </option>
                      <option value="cash">Espèces</option>
                      <option value="check">Chèque</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Référence de transaction (ID Wave / OM / Chèque)
                    </label>
                    <input
                      type="text"
                      value={paymentRef}
                      onChange={(e) => setPaymentRef(e.target.value)}
                      placeholder="ex: WV-SN-098273"
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Date de versement *
                    </label>
                    <input
                      type="date"
                      required
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div className="mt-6 flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setPaymentModalOpen(false)}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-md transition-all"
                    >
                      Confirmer le paiement
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
