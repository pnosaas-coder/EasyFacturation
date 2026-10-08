import { getStore } from "./store";
import { getInvoices } from "./invoices";
import Big from "big.js";

export interface VatMonthSummary {
  monthName: string;
  invoicesCount: number;
  subtotalHT: number;
  vatCollected: number;
  totalTTC: number;
  paymentsReceived: number;
}

export interface VatReportData {
  year: number;
  totalSubtotalHT: number;
  totalVatCollected: number;
  totalTTC: number;
  totalPaymentsReceived: number;
  byPaymentMethod: {
    mtnMoMo: number;
    orangeMoney: number;
    bankTransfer: number;
    cashOrOther: number;
  };
  monthly: VatMonthSummary[];
}

export async function getVatReport(targetYear: number = 2026): Promise<VatReportData> {
  const invoices = await getInvoices();
  const store = getStore();

  const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const monthlySummaries: VatMonthSummary[] = months.map((m) => ({
    monthName: m,
    invoicesCount: 0,
    subtotalHT: 0,
    vatCollected: 0,
    totalTTC: 0,
    paymentsReceived: 0,
  }));

  let totalHT = Big(0);
  let totalTVA = Big(0);
  let totalTTC = Big(0);

  // Filter invoices for targetYear, excluding draft and cancelled
  for (const inv of invoices) {
    if (inv.status === "draft" || inv.status === "cancelled") continue;

    const date = new Date(inv.issueDate);
    if (date.getFullYear() !== targetYear) continue;

    const monthIndex = date.getMonth();
    const summary = monthlySummaries[monthIndex];

    summary.invoicesCount += 1;
    summary.subtotalHT += inv.subtotal;
    summary.vatCollected += inv.taxTotal;
    summary.totalTTC += inv.total;

    totalHT = totalHT.plus(inv.subtotal);
    totalTVA = totalTVA.plus(inv.taxTotal);
    totalTTC = totalTTC.plus(inv.total);
  }

  // Payments aggregation
  let mtnMoMo = Big(0);
  let orangeMoney = Big(0);
  let bankTransfer = Big(0);
  let cashOrOther = Big(0);
  let totalPayments = Big(0);

  // Collect payments from all loaded invoices or store
  const allPayments = store.payments;

  for (const p of allPayments) {
    const pDate = new Date(p.paidOn);
    if (pDate.getFullYear() === targetYear) {
      const monthIndex = pDate.getMonth();
      monthlySummaries[monthIndex].paymentsReceived += p.amount;
    }

    const amt = Big(p.amount);
    totalPayments = totalPayments.plus(amt);

    if (p.method === "mtn_momo") {
      mtnMoMo = mtnMoMo.plus(amt);
    } else if (p.method === "orange_money") {
      orangeMoney = orangeMoney.plus(amt);
    } else if (p.method === "bank_transfer") {
      bankTransfer = bankTransfer.plus(amt);
    } else {
      cashOrOther = cashOrOther.plus(amt);
    }
  }

  return {
    year: targetYear,
    totalSubtotalHT: totalHT.round(0).toNumber(),
    totalVatCollected: totalTVA.round(0).toNumber(),
    totalTTC: totalTTC.round(0).toNumber(),
    totalPaymentsReceived: totalPayments.round(0).toNumber(),
    byPaymentMethod: {
      mtnMoMo: mtnMoMo.round(0).toNumber(),
      orangeMoney: orangeMoney.round(0).toNumber(),
      bankTransfer: bankTransfer.round(0).toNumber(),
      cashOrOther: cashOrOther.round(0).toNumber(),
    },
    monthly: monthlySummaries,
  };
}
