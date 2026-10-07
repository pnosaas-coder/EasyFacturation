import { connection } from "next/server";
import { getInvoices } from "../../lib/data/invoices";
import { InvoicesListClient } from "./InvoicesListClient";

export default async function InvoicesListPage() {
  await connection();
  const invoices = await getInvoices();
  return <InvoicesListClient initialInvoices={invoices} />;
}
