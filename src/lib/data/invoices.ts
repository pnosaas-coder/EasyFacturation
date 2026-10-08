import { getStore } from "./store";
import { Invoice, InvoiceItem, InvoiceStatus, Payment } from "../domain/types";
import { InvoiceInput } from "../validation/invoice";
import { calculateInvoiceTotals } from "../calc/invoice-totals";
import { recalculateClientCounters } from "./clients";
import { createServerClient } from "../supabase/client";
import { mapInvoiceFromRow } from "../supabase/adapters";

export interface InvoiceFilters {
  status?: string;
  search?: string;
}

export async function getInvoices(filters?: InvoiceFilters): Promise<Invoice[]> {
  try {
    const supabase = createServerClient();
    let query = supabase
      .from("invoices")
      .select("*, invoice_items(*), payments(*)")
      .order("issue_date", { ascending: false });

    if (filters?.status && filters.status !== "all") {
      query = query.eq("status", filters.status);
    }

    if (filters?.search && filters.search.trim().length > 0) {
      const term = `%${filters.search.trim()}%`;
      query = query.or(`number.ilike.${term},client_name.ilike.${term},client_email.ilike.${term}`);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      const today = new Date().toISOString().split("T")[0];
      const mapped: Invoice[] = data.map((row) => {
        const inv = mapInvoiceFromRow(
          row,
          (row as unknown as { invoice_items: unknown[] }).invoice_items as never,
          (row as unknown as { payments: unknown[] }).payments as never
        );
        if (inv.status === "sent" && inv.dueDate < today && inv.balanceDue > 0) {
          inv.status = "overdue";
        }
        return inv;
      });

      const store = getStore();
      store.invoices = mapped;
      return mapped;
    }
  } catch {
    // Fallback
  }

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

  return list.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("invoices")
      .select("*, invoice_items(*), payments(*)")
      .eq("id", id)
      .maybeSingle();

    if (!error && data) {
      const today = new Date().toISOString().split("T")[0];
      const inv = mapInvoiceFromRow(
        data,
        (data as unknown as { invoice_items: unknown[] }).invoice_items as never,
        (data as unknown as { payments: unknown[] }).payments as never
      );
      if (inv.status === "sent" && inv.dueDate < today && inv.balanceDue > 0) {
        inv.status = "overdue";
      }
      return inv;
    }
  } catch {
    // Fallback
  }

  const store = getStore();
  const invoice = store.invoices.find((inv) => inv.id === id);
  if (!invoice) return null;

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

  const currentYear = new Date().getFullYear();
  if (store.sequences.invoiceYear !== currentYear) {
    store.sequences.invoiceYear = currentYear;
    store.sequences.invoiceCount = 0;
  }
  store.sequences.invoiceCount += 1;
  const numPad = String(store.sequences.invoiceCount).padStart(4, "0");
  const invoiceNumber = `${store.settings.invoicePrefix}-${currentYear}-${numPad}`;

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
  let initialAmountPaid = 0;
  let initialBalanceDue = totals.balanceDue;
  const initialPayments: Payment[] = [];
  const invoiceId = `inv_${Date.now()}`;

  if (input.status === "paid") {
    initialAmountPaid = totals.total;
    initialBalanceDue = 0;
    const payment: Payment = {
      id: `pay_${Date.now()}`,
      invoiceId: invoiceId,
      amount: totals.total,
      method: "bank_transfer",
      paidOn: input.issueDate,
      reference: `REG-${invoiceNumber}`,
      note: `Règlement à l'émission (${invoiceNumber})`,
      createdAt: now,
    };
    initialPayments.push(payment);
    store.payments.unshift(payment);
  }

  const newInvoice: Invoice = {
    id: invoiceId,
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
    amountPaid: initialAmountPaid,
    balanceDue: initialBalanceDue,
    notes: input.notes,
    terms: input.terms,
    quoteId: input.quoteId || undefined,
    items,
    payments: initialPayments,
    createdAt: now,
    updatedAt: now,
  };

  try {
    const supabase = createServerClient();
    await supabase.from("invoices").insert({
      id: newInvoice.id,
      number: newInvoice.number,
      client_id: newInvoice.clientId,
      client_name: newInvoice.clientName,
      client_email: newInvoice.clientEmail || null,
      client_phone: newInvoice.clientPhone || null,
      client_city: newInvoice.clientCity || null,
      client_address: newInvoice.clientAddress || null,
      issue_date: newInvoice.issueDate,
      due_date: newInvoice.dueDate,
      status: newInvoice.status,
      subtotal: newInvoice.subtotal,
      discount_type: newInvoice.discountType || null,
      discount_value: newInvoice.discountValue || null,
      discount_amount: newInvoice.discountAmount,
      tax_total: newInvoice.taxTotal,
      total: newInvoice.total,
      amount_paid: newInvoice.amountPaid,
      balance_due: newInvoice.balanceDue,
      notes: newInvoice.notes || null,
      terms: newInvoice.terms || null,
      quote_id: input.quoteId || null,
      created_at: newInvoice.createdAt,
      updated_at: newInvoice.updatedAt,
    });

    if (items.length > 0) {
      await supabase.from("invoice_items").insert(
        items.map((it, idx) => ({
          id: it.id,
          invoice_id: newInvoice.id,
          product_id: it.productId || null,
          description: it.description,
          quantity: it.quantity,
          unit_price: it.unitPrice,
          tax_rate: it.taxRate,
          line_subtotal: it.lineSubtotal,
          line_tax: it.lineTax,
          position: idx,
        }))
      );
    }

    if (initialPayments.length > 0) {
      await supabase.from("payments").insert(
        initialPayments.map((p) => ({
          id: p.id,
          invoice_id: p.invoiceId,
          amount: p.amount,
          method: p.method,
          paid_on: p.paidOn,
          reference: p.reference || null,
          note: p.note || null,
          created_at: p.createdAt,
        }))
      );
    }
  } catch {
    // Fallback
  }

  store.invoices.unshift(newInvoice);
  recalculateClientCounters(input.clientId);

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
  if (prevStatus === newStatus) {
    return invoice;
  }

  const now = new Date().toISOString();
  const today = now.split("T")[0];
  let generatedPayment: Payment | null = null;

  if (newStatus === "paid") {
    const unpaid = invoice.total - invoice.amountPaid;
    if (unpaid > 0) {
      generatedPayment = {
        id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        invoiceId: invoice.id,
        amount: unpaid,
        method: "bank_transfer",
        paidOn: today,
        reference: `REG-${invoice.number}`,
        note: `Règlement intégral (${invoice.number})`,
        createdAt: now,
      };
      store.payments.unshift(generatedPayment);
    }
    invoice.amountPaid = invoice.total;
    invoice.balanceDue = 0;
  } else if (newStatus === "sent" || newStatus === "overdue") {
    if (prevStatus === "paid") {
      store.payments = store.payments.filter((p) => p.invoiceId !== invoice.id);
      invoice.amountPaid = 0;
      invoice.balanceDue = invoice.total;
    }
  } else if (newStatus === "cancelled") {
    store.payments = store.payments.filter((p) => p.invoiceId !== invoice.id);
    invoice.amountPaid = 0;
    invoice.balanceDue = 0;
  } else if (newStatus === "draft") {
    store.payments = store.payments.filter((p) => p.invoiceId !== invoice.id);
    invoice.amountPaid = 0;
    invoice.balanceDue = invoice.total;
  }

  invoice.status = newStatus;
  invoice.updatedAt = now;
  invoice.payments = store.payments.filter((p) => p.invoiceId === invoice.id);

  recalculateClientCounters(invoice.clientId);

  try {
    const supabase = createServerClient();
    await supabase.from("invoices").update({
      status: newStatus,
      amount_paid: invoice.amountPaid,
      balance_due: invoice.balanceDue,
      updated_at: now,
    }).eq("id", id);

    if (generatedPayment) {
      await supabase.from("payments").insert({
        id: generatedPayment.id,
        invoice_id: generatedPayment.invoiceId,
        amount: generatedPayment.amount,
        method: generatedPayment.method,
        paid_on: generatedPayment.paidOn,
        reference: generatedPayment.reference || null,
        note: generatedPayment.note || null,
        created_at: generatedPayment.createdAt,
      });
    } else if (newStatus === "sent" || newStatus === "draft" || newStatus === "cancelled") {
      if (prevStatus === "paid") {
        await supabase.from("payments").delete().eq("invoice_id", id);
      }
    }
  } catch {
    // Fallback
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

  const clientId = invoice.clientId;
  store.payments = store.payments.filter((p) => p.invoiceId !== invoice.id);
  store.invoices.splice(index, 1);
  recalculateClientCounters(clientId);

  try {
    const supabase = createServerClient();
    await supabase.from("invoices").delete().eq("id", id);
  } catch {
    // Fallback
  }

  return true;
}

export async function deleteInvoice(id: string): Promise<boolean> {
  const store = getStore();
  const index = store.invoices.findIndex((inv) => inv.id === id);
  if (index === -1) return false;

  const invoice = store.invoices[index];
  const clientId = invoice.clientId;

  store.payments = store.payments.filter((p) => p.invoiceId !== invoice.id);
  store.invoices.splice(index, 1);
  recalculateClientCounters(clientId);

  try {
    const supabase = createServerClient();
    await supabase.from("invoices").delete().eq("id", id);
  } catch {
    // Fallback
  }

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
