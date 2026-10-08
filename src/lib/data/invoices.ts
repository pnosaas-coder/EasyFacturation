import { getStore } from "./store";
import { Invoice, InvoiceItem, InvoiceStatus } from "../domain/types";
import { InvoiceInput } from "../validation/invoice";
import { calculateInvoiceTotals } from "../calc/invoice-totals";

export interface InvoiceFilters {
  status?: string;
  search?: string;
}

export async function getInvoices(filters?: InvoiceFilters): Promise<Invoice[]> {
  const store = getStore();
  let list = [...store.invoices];

  // Refresh dynamic statuses based on due date
  const today = new Date().toISOString().split("T")[0];
  list = list.map((inv) => {
    if (inv.status === "sent" && inv.dueDate < today && inv.balanceDue > 0) {
      return { ...inv, status: "overdue" as InvoiceStatus };
    }
    return inv;
  });

  if (filters?.status && filters.status !== "all") {
    list = list.filter((inv) => inv.status === filters.status);
  }

  if (filters?.search && filters.search.trim().length > 0) {
    const q = filters.search.toLowerCase().trim();
    list = list.filter(
      (inv) =>
        inv.number.toLowerCase().includes(q) ||
        inv.clientName.toLowerCase().includes(q) ||
        (inv.clientEmail && inv.clientEmail.toLowerCase().includes(q))
    );
  }

  // Sort descending by issue date and creation
  return list.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  const store = getStore();
  const invoice = store.invoices.find((inv) => inv.id === id);
  if (!invoice) return null;

  // Check dynamic overdue
  const today = new Date().toISOString().split("T")[0];
  let currentStatus = invoice.status;
  if (currentStatus === "sent" && invoice.dueDate < today && invoice.balanceDue > 0) {
    currentStatus = "overdue";
  }

  const invoicePayments = store.payments.filter((p) => p.invoiceId === invoice.id);
  return {
    ...invoice,
    status: currentStatus,
    payments: invoicePayments,
  };
}

export async function createInvoice(input: InvoiceInput): Promise<Invoice> {
  const store = getStore();

  // 1. Generate sequence number (ex: FAC-2026-0049)
  const currentYear = new Date().getFullYear();
  if (store.sequences.invoiceYear !== currentYear) {
    store.sequences.invoiceYear = currentYear;
    store.sequences.invoiceCount = 0;
  }
  store.sequences.invoiceCount += 1;
  const numPad = String(store.sequences.invoiceCount).padStart(4, "0");
  const invoiceNumber = `${store.settings.invoicePrefix}-${currentYear}-${numPad}`;

  // 2. Pure deterministic calculation
  const totals = calculateInvoiceTotals(
    input.items.map((it) => ({
      quantity: it.quantity,
      unitPrice: it.unitPrice,
      taxRate: it.taxRate ?? store.settings.defaultTaxRate,
    })),
    input.discountType && input.discountValue
      ? { type: input.discountType, value: input.discountValue }
      : null,
    0
  );

  const items: InvoiceItem[] = input.items.map((it, idx) => ({
    id: it.id || `it_${Date.now()}_${idx}`,
    description: it.description,
    quantity: it.quantity,
    unitPrice: it.unitPrice,
    taxRate: it.taxRate ?? store.settings.defaultTaxRate,
    lineSubtotal: totals.lineItems[idx]?.lineSubtotal ?? 0,
    lineTax: totals.lineItems[idx]?.lineTax ?? 0,
    productId: it.productId,
  }));

  const now = new Date().toISOString();
  const newInvoice: Invoice = {
    id: `inv_${Date.now()}`,
    number: invoiceNumber,
    clientId: input.clientId,
    clientName: input.clientName,
    clientEmail: input.clientEmail || undefined,
    clientPhone: input.clientPhone || undefined,
    clientCity: input.clientCity || undefined,
    clientAddress: input.clientAddress || undefined,
    issueDate: input.issueDate,
    dueDate: input.dueDate,
    status: input.status,
    subtotal: totals.subtotal,
    discountType: input.discountType,
    discountValue: input.discountValue,
    discountAmount: totals.discountAmount,
    taxTotal: totals.taxTotal,
    total: totals.total,
    amountPaid: 0,
    balanceDue: totals.balanceDue,
    notes: input.notes,
    terms: input.terms,
    items,
    payments: [],
    createdAt: now,
    updatedAt: now,
  };

  store.invoices.unshift(newInvoice);

  // Update client totals if not draft
  if (input.status !== "draft") {
    const client = store.clients.find((c) => c.id === input.clientId);
    if (client) {
      client.totalBilled += newInvoice.total;
      client.balanceDue += newInvoice.total;
    }
  }

  return newInvoice;
}

export async function updateInvoiceStatus(
  id: string,
  newStatus: InvoiceStatus
): Promise<Invoice | null> {
  const store = getStore();
  const invoice = store.invoices.find((inv) => inv.id === id);
  if (!invoice) return null;

  const prevStatus = invoice.status;
  invoice.status = newStatus;
  invoice.updatedAt = new Date().toISOString();

  // If transitioning from draft to sent, update client metrics
  if (prevStatus === "draft" && newStatus !== "draft" && newStatus !== "cancelled") {
    const client = store.clients.find((c) => c.id === invoice.clientId);
    if (client) {
      client.totalBilled += invoice.total;
      client.balanceDue += invoice.balanceDue;
    }
  }

  return invoice;
}

export async function deleteDraftInvoice(id: string): Promise<boolean> {
  const store = getStore();
  const index = store.invoices.findIndex((inv) => inv.id === id);
  if (index === -1) return false;

  const invoice = store.invoices[index];
  if (invoice.status !== "draft") {
    throw new Error("Seules les factures au statut Brouillon peuvent être supprimées.");
  }

  store.invoices.splice(index, 1);
  return true;
}

export async function deleteInvoice(id: string): Promise<boolean> {
  const store = getStore();
  const index = store.invoices.findIndex((inv) => inv.id === id);
  if (index === -1) return false;

  const invoice = store.invoices[index];

  // Adjust client counters if invoice had impact
  if (invoice.status !== "draft" && invoice.status !== "cancelled") {
    const client = store.clients.find((c) => c.id === invoice.clientId);
    if (client) {
      client.totalBilled = Math.max(0, client.totalBilled - invoice.total);
      client.balanceDue = Math.max(0, client.balanceDue - invoice.balanceDue);
      client.totalPaid = Math.max(0, client.totalPaid - invoice.amountPaid);
    }
  }

  store.invoices.splice(index, 1);
  return true;
}

export async function duplicateInvoice(id: string): Promise<Invoice | null> {
  const source = await getInvoiceById(id);
  if (!source) return null;

  const today = new Date().toISOString().split("T")[0];
  const due = new Date();
  due.setDate(due.getDate() + 30);
  const dueDateStr = due.toISOString().split("T")[0];

  return createInvoice({
    clientId: source.clientId,
    clientName: source.clientName,
    clientEmail: source.clientEmail,
    clientPhone: source.clientPhone,
    clientCity: source.clientCity,
    clientAddress: source.clientAddress,
    issueDate: today,
    dueDate: dueDateStr,
    status: "draft",
    discountType: source.discountType,
    discountValue: source.discountValue,
    notes: source.notes,
    terms: source.terms,
    items: source.items.map((it) => ({
      description: it.description,
      quantity: it.quantity,
      unitPrice: it.unitPrice,
      taxRate: it.taxRate,
      productId: it.productId,
    })),
  });
}
