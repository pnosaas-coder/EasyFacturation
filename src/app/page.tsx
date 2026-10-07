import { connection } from "next/server";
import { getDashboardKPIs, getDashboardMonthlyRevenue } from "../lib/data/dashboard";
import { getInvoices } from "../lib/data/invoices";
import { DashboardClient } from "./DashboardClient";

export default async function DashboardPage() {
  await connection();
  const [kpis, monthlyRevenue, invoices] = await Promise.all([
    getDashboardKPIs(),
    getDashboardMonthlyRevenue(),
    getInvoices(),
  ]);

  return (
    <DashboardClient
      kpis={kpis}
      monthlyRevenue={monthlyRevenue}
      invoices={invoices}
    />
  );
}
