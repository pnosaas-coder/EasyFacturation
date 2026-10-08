import React from "react";
import { formatFCFA } from "../../lib/format/money";
import { formatDate } from "../../lib/format/dates";
import { numberToWordsFr } from "../../lib/calc/number-to-words-fr";
import { Sparkles, Smartphone, Landmark } from "lucide-react";

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
    mtnMoMoPhone?: string;
    orangeMoneyPhone?: string;
  };
  status?: string;
}

export function InvoicePreview({
  invoiceNumber,
  sellerName = "Prunus Engineering SARL",
  sellerEmail = "contact@prunus-engineering.cm",
  sellerPhone = "+237 677481161 / +237 691114908",
  sellerAddress = "Boulevard de la Liberté, Akwa, Douala, Cameroun",
  sellerTaxId = "NIU M052112345678A",
  sellerRccm = "RC/DLA/2024/B/1234",
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
  paymentInstructions = {
    mtnMoMoPhone: "+237 677481161 (MTN MoMo)",
    orangeMoneyPhone: "+237 691114908 (Orange Money)",
    bankRib: "CM21 10005 00012 01234567890 45 (Afriland First Bank)",
  },
  status = "draft",
}: InvoicePreviewProps) {
  const getStampConfig = () => {
    switch (status) {
      case "paid":
        return {
          label: "FACTURE ACQUITTÉE / PAYÉE",
          sub: "Règlement intégral perçu",
          color: "border-emerald-600 text-emerald-700 bg-emerald-50/70 dark:border-emerald-500 dark:text-emerald-400 dark:bg-emerald-950/40",
        };
      case "partial":
        return {
          label: "ACOMPTE REÇU / PARTIEL",
          sub: "Solde restant dû en attente",
          color: "border-amber-600 text-amber-700 bg-amber-50/70 dark:border-amber-500 dark:text-amber-400 dark:bg-amber-950/40",
        };
      case "overdue":
        return {
          label: "IMPAYÉE • EN RETARD",
          sub: "Échéance dépassée",
          color: "border-rose-600 text-rose-700 bg-rose-50/70 dark:border-rose-500 dark:text-rose-400 dark:bg-rose-950/40",
        };
      case "cancelled":
        return {
          label: "DOCUMENT ANNULÉ",
          sub: "Sans valeur commerciale",
          color: "border-slate-500 text-slate-600 bg-slate-100/70 dark:border-slate-600 dark:text-slate-400 dark:bg-slate-800/40",
        };
      case "draft":
      default:
        return {
          label: "PROFORMA / BROUILLON",
          sub: "Document provisoire non comptabilisé",
          color: "border-slate-400 text-slate-500 bg-slate-50/60 dark:border-slate-600 dark:text-slate-400 dark:bg-slate-800/30",
        };
    }
  };

  const stamp = getStampConfig();

  return (
    <div className="relative mx-auto w-full max-w-[800px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 text-slate-800 shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 print:shadow-none print:border-none print:p-0 print:max-w-none transition-all duration-300 hover:shadow-2xl hover:shadow-slate-500/10">
      {/* Official Status Stamp (Watermark) */}
      <div className="pointer-events-none absolute right-8 top-28 sm:top-24 z-10 select-none opacity-85 rotate-[-12deg] transition-transform">
        <div className={`rounded-xl border-2 sm:border-3 border-dashed px-4 py-2 sm:px-6 sm:py-3 text-center shadow-xs backdrop-blur-xs ${stamp.color}`}>
          <div className="font-mono text-xs sm:text-sm font-black tracking-widest uppercase">
            {stamp.label}
          </div>
          <div className="text-[9px] sm:text-[10px] font-bold tracking-tight opacity-90">
            {stamp.sub}
          </div>
        </div>
      </div>

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
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-700 to-blue-500 text-white shadow-md shadow-blue-500/20 transition-transform duration-300 hover:scale-105">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
      </div>

      {/* Two-column Seller / Buyer Info */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
        {/* Seller - Cameroun */}
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
            {clientAddress || "Douala / Yaoundé, Cameroun"}
          </p>
          <p className="text-slate-600 dark:text-slate-400">
            {clientEmail || "contact@client.cm"} • {clientPhone || "+237..."}
          </p>
          {clientTaxId && (
            <p className="text-[11px] text-slate-500 font-medium">
              NIU Client : {clientTaxId}
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
          <strong className="text-slate-900 dark:text-white">FCFA (XAF - Cameroun)</strong>
        </div>
      </div>

      {/* Items Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[10px] dark:border-slate-700">
            <tr>
              <th className="py-2.5 px-2">Désignation</th>
              <th className="py-2.5 px-2 text-center w-16">Qté</th>
              <th className="py-2.5 px-2 text-center w-20">TVA</th>
              <th className="py-2.5 px-2 text-right w-28">Prix unitaire</th>
              <th className="py-2.5 px-2 text-right w-32">Total HT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((it, idx) => (
              <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-2 font-medium text-slate-900 dark:text-slate-100">
                  {it.description || "Prestation de service"}
                </td>
                <td className="py-3 px-2 text-center text-slate-600 dark:text-slate-300">
                  {it.quantity}
                </td>
                <td className="py-3 px-2 text-center text-slate-600 dark:text-slate-300 font-semibold">
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
            <span>TVA Cameroun (19,25%) :</span>
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

      {/* Notes & Instructions de paiement Mobile Money Cameroun & Banque */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-200 pt-4 dark:border-slate-800 text-[11px]">
        {/* Instructions de paiement Cameroun */}
        <div className="space-y-1.5">
          <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
            Moyens de paiement acceptés (Cameroun) :
          </span>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <Smartphone className="h-3.5 w-3.5 text-amber-500" />
            <span>{paymentInstructions.mtnMoMoPhone}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <Smartphone className="h-3.5 w-3.5 text-orange-500" />
            <span>{paymentInstructions.orangeMoneyPhone}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <Landmark className="h-3.5 w-3.5 text-emerald-600" />
            <span>{paymentInstructions.bankRib}</span>
          </div>
        </div>

        {/* Signature & Cachet : Philippe NOUGOUE */}
        <div className="flex flex-col items-end justify-between">
          <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
            Pour Prunus Engineering SARL :
          </span>
          <div className="mt-3 font-serif italic text-base font-bold text-slate-900 dark:text-slate-100">
            Philippe NOUGOUE
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Gérant Fondateur</span>
        </div>
      </div>
    </div>
  );
}
