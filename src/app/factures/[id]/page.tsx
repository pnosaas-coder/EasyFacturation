import React from "react";
import { connection } from "next/server";
import InvoiceDetailClient from "./InvoiceDetailClient";
import { getInvoiceById } from "../../../lib/data/invoices";
import { getSettings } from "../../../lib/data/settings";
import { notFound } from "next/navigation";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();
  const { id } = await params;
  const [invoice, settings] = await Promise.all([
    getInvoiceById(id),
    getSettings(),
  ]);

  if (!invoice) {
    notFound();
  }

  return <InvoiceDetailClient initialInvoice={invoice} settings={settings} />;
}
