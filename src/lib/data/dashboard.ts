import { getStore } from "./store";
import { DashboardKPIs, Invoice, MonthlyRevenue } from "../domain/types";
import { getInvoices } from "./invoices";

export async function getDashboardKPIs(): Promise<DashboardKPIs> {
  const store = getStore();
  const invoices = await getInvoices();

  const activeInvoices = invoices.filter((i) => i.status !== "draft" && i.status !== "cancelled");
  const totalInvoiced = activeInvoices.reduce((acc, i) => acc + i.total, 0);

  const totalCollected = store.payments.reduce((acc, p) => acc + p.amount, 0);

  const pendingInvoices = invoices.filter(
    (i) => i.status === "sent" || i.status === "partial" || i.status === "overdue"
  );
  const totalPending = pendingInvoices.reduce((acc, i) => acc + i.balanceDue, 0);

  const overdueInvoices = invoices.filter((i) => i.status === "overdue");
  const totalOverdue = overdueInvoices.reduce((acc, i) => acc + i.balanceDue, 0);
  const overdueCount = overdueInvoices.length;

  return {
    totalInvoicesCount: activeInvoices.length,
    totalInvoiced,
    totalCollected,
    totalPending,
    totalOverdue,
    overdueCount,
    growthRates: {
      invoiced: 14.8,
      collected: 11.2,
      pending: -5.4,
      overdue: 2.1,
    },
  };
}

export async function getDashboardMonthlyRevenue(): Promise<MonthlyRevenue[]> {
  const store = getStore();
  const months = ["Mai", "Juin", "Juil", "Août", "Sept", "Oct"];
  const revenueByMonth: Record<string, { invoiced: number; collected: number }> = {
    Mai: { invoiced: 9_200_000, collected: 8_100_000 },
    Juin: { invoiced: 14_500_000, collected: 12_800_000 },
    Juil: { invoiced: 11_300_000, collected: 10_900_000 },
    Août: { invoiced: 15_600_000, collected: 13_400_000 },
    Sept: { invoiced: 16_800_000, collected: 15_200_000 },
    Oct: { invoiced: 0, collected: 0 },
  };

  // Dynamically calculate current month (Oct) based on active store invoices and payments
  const currentInvoiced = store.invoices
    .filter((inv) => inv.status !== "draft" && inv.status !== "cancelled")
    .reduce((acc, inv) => acc + inv.total, 0);

  const currentCollected = store.payments.reduce((acc, p) => acc + p.amount, 0);

  revenueByMonth["Oct"] = {
    invoiced: currentInvoiced,
    collected: currentCollected,
  };

  return months.map((month) => ({
    month,
    invoiced: revenueByMonth[month]?.invoiced ?? 0,
    collected: revenueByMonth[month]?.collected ?? 0,
  }));
}

export async function getRecentInvoices(limit = 5): Promise<Invoice[]> {
  const invoices = await getInvoices();
  return invoices.slice(0, limit);
}

export async function getOverdueInvoices(): Promise<Invoice[]> {
  const invoices = await getInvoices({ status: "overdue" });
  return invoices;
}
