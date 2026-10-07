import React from "react";
import { formatFCFA } from "../../lib/format/money";
import { formatDate } from "../../lib/format/dates";
import { numberToWordsFr } from "../../lib/calc/number-to-words-fr";
import { Sparkles, Building2, Smartphone, Landmark } from "lucide-react";

export interface InvoicePreviewProps {
  invoiceNumber: string;
  sellerName?: string;
  sellerEmail?: string;
  sellerPhone?: string;
  sellerAddress?: string;
  sellerTaxId?: string;
  sellerRccm?: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddress?: string;
  clientTaxId?: string;
  issueDate: string;
  dueDate: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate: number;
    lineSubtotal?: number;
  }>;
  subtotal: number;
  discountAmount?: number;
  taxTotal: number;
  total: number;
  notes?: string;
  paymentInstructions?: {
    bankRib?: string;
    wavePhone?: string;
    orangeMoneyPhone?: string;
  };
  status?: string;
}

export function InvoicePreview({
  invoiceNumber,
  sellerName = "PNO Solutions S.A.R.L",
  sellerEmail = "contact@pno-solutions.sn",
  sellerPhone = "+221 77 123 45 67",
  sellerAddress = "Immeuble R+4, Rue 12, Dakar, Sénégal",
  sellerTaxId = "NINEA 009876543 2V1",
  sellerRccm = "SN.DKR.2024.B.12345",
  clientName,
  clientEmail,
  clientPhone,
  clientAddress,
  clientTaxId,
  issueDate,
  dueDate,
  items,
  subtotal,
  discountAmount = 0,
  taxTotal,
  total,
  notes,
  paymentInstructions = {
    wavePhone: "+221 77 123 45 67",
    orangeMoneyPhone: "+221 78 987 65 43",
    bankRib: "SN08 SN01 2013 4567 8901 2345 67",
  },
  status,
}: InvoicePreviewProps) {
  return (
    <div className="relative mx-auto w-full max-w-[800px] rounded-2xl border border-slate-200 bg-white p-8 text-slate-800 shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 print:shadow-none print:border-none">
      {/* Top Header */}
      <div className="flex items-start justify-between border-b border-slate-200 pb-6 dark:border-slate-800">
        <div>
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
            FACTURE
          </span>
          <p className="mt-1 font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
            #{invoiceNumber || "FAC-2026-0001"}
          </p>
        </div>

        {/* Company Emblem Logo */}
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-700 to-blue-500 text-white shadow-md shadow-blue-500/20">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
      </div>

      {/* Two-column Seller / Buyer Info */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
        {/* Seller */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Émetteur (Vendeur) :
          </span>
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            {sellerName}
          </p>
          <p className="text-slate-600 dark:text-slate-400">{sellerAddress}</p>
          <p className="text-slate-600 dark:text-slate-400">
            {sellerEmail} • {sellerPhone}
          </p>
          <p className="text-[11px] text-slate-500 font-medium">
            {sellerTaxId} • {sellerRccm}
          </p>
        </div>

        {/* Buyer */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Facturé à (Client) :
          </span>
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            {clientName || "Nom du client"}
          </p>
          <p className="text-slate-600 dark:text-slate-400">
            {clientAddress || "Adresse du client"}
          </p>
          <p className="text-slate-600 dark:text-slate-400">
            {clientEmail || "email@client.com"} • {clientPhone || "+221..."}
          </p>
          {clientTaxId && (
            <p className="text-[11px] text-slate-500 font-medium">
              ID Fiscal: {clientTaxId}
            </p>
          )}
        </div>
      </div>

      {/* Dates Row */}
      <div className="mt-6 flex flex-wrap gap-8 rounded-xl bg-slate-50 p-4 text-xs dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-slate-400 font-medium">Date d'émission :</span>{" "}
          <strong className="text-slate-900 dark:text-white">
            {formatDate(issueDate) || "Aujourd'hui"}
          </strong>
        </div>
        <div>
          <span className="text-slate-400 font-medium">Date d'échéance :</span>{" "}
          <strong className="text-rose-600 dark:text-rose-400">
            {formatDate(dueDate) || "Dans 30 jours"}
          </strong>
        </div>
        <div>
          <span className="text-slate-400 font-medium">Devise :</span>{" "}
          <strong className="text-slate-900 dark:text-white">FCFA (XOF)</strong>
        </div>
      </div>

      {/* Items Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[10px] dark:border-slate-700">
            <tr>
              <th className="py-2.5 px-2">Désignation</th>
              <th className="py-2.5 px-2 text-center w-16">Qté</th>
              <th className="py-2.5 px-2 text-center w-16">TVA</th>
              <th className="py-2.5 px-2 text-right w-28">Prix unitaire</th>
              <th className="py-2.5 px-2 text-right w-32">Total HT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((it, idx) => (
              <tr key={idx}>
                <td className="py-3 px-2 font-medium text-slate-900 dark:text-slate-100">
                  {it.description || "Prestation de service"}
                </td>
                <td className="py-3 px-2 text-center text-slate-600 dark:text-slate-300">
                  {it.quantity}
                </td>
                <td className="py-3 px-2 text-center text-slate-600 dark:text-slate-300">
                  {it.taxRate}%
                </td>
                <td className="py-3 px-2 text-right text-slate-600 dark:text-slate-300">
                  {formatFCFA(it.unitPrice)}
                </td>
                <td className="py-3 px-2 text-right font-bold text-slate-900 dark:text-white">
                  {formatFCFA(it.quantity * it.unitPrice)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Financial Summary */}
      <div className="mt-6 flex flex-col items-end border-t border-slate-200 pt-4 dark:border-slate-700 text-xs">
        <div className="w-full max-w-xs space-y-2">
          <div className="flex justify-between text-slate-600 dark:text-slate-300">
            <span>Sous-total HT :</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {formatFCFA(subtotal)}
            </span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
              <span>Remise commerciale :</span>
              <span>- {formatFCFA(discountAmount)}</span>
            </div>
          )}

          <div className="flex justify-between text-slate-600 dark:text-slate-300">
            <span>TVA collectée (18%) :</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {formatFCFA(taxTotal)}
            </span>
          </div>

          <div className="flex justify-between rounded-xl bg-blue-50 p-3 text-sm font-bold text-blue-900 dark:bg-blue-950/60 dark:text-blue-200 border border-blue-100 dark:border-blue-900">
            <span>NET À PAYER (TTC) :</span>
            <span className="text-base text-blue-700 dark:text-blue-300">
              {formatFCFA(total)}
            </span>
          </div>
        </div>
      </div>

      {/* Montant en lettres légal */}
      <div className="mt-4 rounded-xl bg-slate-50/80 p-3 text-[11px] italic text-slate-600 dark:bg-slate-800/40 dark:text-slate-400 border border-slate-100 dark:border-slate-800">
        {numberToWordsFr(total)}
      </div>

      {/* Notes & Instructions de paiement Mobile Money & Banque */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-200 pt-4 dark:border-slate-800 text-[11px]">
        {/* Instructions de paiement */}
        <div className="space-y-1.5">
          <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
            Moyens de paiement acceptés :
          </span>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <Smartphone className="h-3.5 w-3.5 text-blue-500" />
            <span>Wave & Orange Money : {paymentInstructions.wavePhone}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <Landmark className="h-3.5 w-3.5 text-emerald-600" />
            <span>Virement Bancaire (RIB) : {paymentInstructions.bankRib}</span>
          </div>
        </div>

        {/* Signature & Cachet */}
        <div className="flex flex-col items-end justify-between">
          <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
            Pour PNO Solutions (Signature) :
          </span>
          <div className="mt-3 font-serif italic text-base text-slate-800 dark:text-slate-200">
            Ousmane Diallo
          </div>
          <span className="text-[9px] text-slate-400">Gérant & Fondateur</span>
        </div>
      </div>
    </div>
  );
}
