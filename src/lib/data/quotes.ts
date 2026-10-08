import { getStore } from "./store";
import { Quote, InvoiceItem, QuoteStatus, Invoice } from "../domain/types";
import { QuoteInput } from "../validation/quote";
import { calculateInvoiceTotals } from "../calc/invoice-totals";
import { createInvoice } from "./invoices";

export interface QuoteFilters {
  status?: string;
  search?: string;
}

export async function getQuotes(filters?: QuoteFilters): Promise<Quote[]> {
  const store = getStore();
  let list = [...store.quotes];

  if (filters?.status && filters.status !== "all") {
    list = list.filter((q) => q.status === filters.status);
  }

  if (filters?.search && filters.search.trim().length > 0) {
    const term = filters.search.toLowerCase().trim();
    list = list.filter(
      (q) =>
        q.number.toLowerCase().includes(term) ||
        q.clientName.toLowerCase().includes(term) ||
        (q.clientEmail && q.clientEmail.toLowerCase().includes(term))
    );
  }

  return list.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
}

export async function getQuoteById(id: string): Promise<Quote | null> {
  const store = getStore();
  const quote = store.quotes.find((q) => q.id === id);
  return quote || null;
}

export async function createQuote(input: QuoteInput): Promise<Quote> {
  const store = getStore();

  const currentYear = new Date().getFullYear();
  if (store.sequences.quoteYear !== currentYear) {
    store.sequences.quoteYear = currentYear;
    store.sequences.quoteCount = 0;
  }
  store.sequences.quoteCount += 1;
  const numPad = String(store.sequences.quoteCount).padStart(4, "0");
  const quoteNumber = `${store.settings.quotePrefix}-${currentYear}-${numPad}`;

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
    id: it.id || `dvi_${Date.now()}_${idx}`,
    description: it.description,
    quantity: it.quantity,
    unitPrice: it.unitPrice,
    taxRate: it.taxRate ?? store.settings.defaultTaxRate,
    lineSubtotal: totals.lineItems[idx]?.lineSubtotal ?? 0,
    lineTax: totals.lineItems[idx]?.lineTax ?? 0,
    productId: it.productId,
  }));

  const now = new Date().toISOString();
  const newQuote: Quote = {
    id: `dev_${Date.now()}`,
    number: quoteNumber,
    clientId: input.clientId,
    clientName: input.clientName,
    clientEmail: input.clientEmail || undefined,
    clientPhone: input.clientPhone || undefined,
    clientCity: input.clientCity || undefined,
    clientAddress: input.clientAddress || undefined,
    issueDate: input.issueDate,
    validUntil: input.validUntil,
    status: input.status,
    subtotal: totals.subtotal,
    discountType: input.discountType,
    discountValue: input.discountValue,
    discountAmount: totals.discountAmount,
    taxTotal: totals.taxTotal,
    total: totals.total,
    notes: input.notes,
    terms: input.terms,
    items,
    createdAt: now,
    updatedAt: now,
  };

  store.quotes.unshift(newQuote);
  return newQuote;
}

export async function updateQuoteStatus(id: string, status: QuoteStatus): Promise<Quote | null> {
  const store = getStore();
  const quote = store.quotes.find((q) => q.id === id);
  if (!quote) return null;

  quote.status = status;
  quote.updatedAt = new Date().toISOString();
  return quote;
}

export async function convertQuoteToInvoice(quoteId: string): Promise<Invoice> {
  const store = getStore();
  const quote = store.quotes.find((q) => q.id === quoteId);
  if (!quote) {
    throw new Error(`Devis introuvable avec l'identifiant ${quoteId}`);
  }

  const today = new Date().toISOString().split("T")[0];
  const due = new Date();
  due.setDate(due.getDate() + 30);
  const dueDateStr = due.toISOString().split("T")[0];

  const invoice = await createInvoice({
    clientId: quote.clientId,
    clientName: quote.clientName,
    clientEmail: quote.clientEmail,
    clientPhone: quote.clientPhone,
    clientCity: quote.clientCity,
    clientAddress: quote.clientAddress,
    issueDate: today,
    dueDate: dueDateStr,
    status: "sent",
    discountType: quote.discountType,
    discountValue: quote.discountValue,
    notes: `Facture issue de la conversion du devis ${quote.number}. ${quote.notes || ""}`.trim(),
    terms: quote.terms,
    items: quote.items.map((it) => ({
      description: it.description,
      quantity: it.quantity,
      unitPrice: it.unitPrice,
      taxRate: it.taxRate,
      productId: it.productId,
    })),
  });

  // Link invoice back to quote and update status
  quote.status = "converted";
  quote.convertedInvoiceId = invoice.id;
  quote.updatedAt = new Date().toISOString();

  invoice.quoteId = quote.id;

  return invoice;
}

export async function deleteQuote(id: string): Promise<boolean> {
  const store = getStore();
  const index = store.quotes.findIndex((q) => q.id === id);
  if (index === -1) return false;

  store.quotes.splice(index, 1);
  return true;
}
