import React, { Suspense } from "react";
import InvoiceDetailClient from "./InvoiceDetailClient";
import { mockRecentInvoices } from "../../../mocks/fixtures";

export function generateStaticParams() {
  return mockRecentInvoices.map((inv) => ({
    id: inv.id,
  }));
}

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50 text-xs font-semibold text-slate-500">
          Chargement de la facture...
        </div>
      }
    >
      <InvoiceDetailClient invoiceId={resolvedParams.id} />
    </Suspense>
  );
}
