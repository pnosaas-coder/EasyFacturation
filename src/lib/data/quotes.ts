import { getStore } from "./store";
import { Quote, InvoiceItem, QuoteStatus, Invoice } from "../domain/types";
import { QuoteInput } from "../validation/quote";
import { calculateInvoiceTotals } from "../calc/invoice-totals";
import { createInvoice } from "./invoices";
import { createServerClient } from "../supabase/client";
import { mapQuoteFromRow } from "../supabase/adapters";

export interface QuoteFilters {
  status?: string;
  search?: string;
}

export async function getQuotes(filters?: QuoteFilters): Promise<Quote[]> {
  try {
    const supabase = createServerClient();
    let query = supabase
      .from("quotes")
      .select("*, quote_items(*)")
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
      const mapped = data.map((row) =>
        mapQuoteFromRow(row, (row as unknown as { quote_items: unknown[] }).quote_items as never)
      );
      const store = getStore();
      store.quotes = mapped;
      return mapped;
    }
  } catch {
    // Fallback
  }

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
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("quotes")
      .select("*, quote_items(*)")
      .eq("id", id)
      .maybeSingle();

    if (!error && data) {
      return mapQuoteFromRow(data, (data as unknown as { quote_items: unknown[] }).quote_items as never);
    }
  } catch {
    // Fallback
  }

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

  const quoteId = `dev_${Date.now()}`;
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
    id: quoteId,
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

  try {
    const supabase = createServerClient();
    await supabase.from("quotes").insert({
      id: newQuote.id,
      number: newQuote.number,
      client_id: newQuote.clientId,
      client_name: newQuote.clientName,
      client_email: newQuote.clientEmail || null,
      client_phone: newQuote.clientPhone || null,
      client_city: newQuote.clientCity || null,
      client_address: newQuote.clientAddress || null,
      issue_date: newQuote.issueDate,
      valid_until: newQuote.validUntil,
      status: newQuote.status,
      subtotal: newQuote.subtotal,
      discount_type: newQuote.discountType || null,
      discount_value: newQuote.discountValue || null,
      discount_amount: newQuote.discountAmount,
      tax_total: newQuote.taxTotal,
      total: newQuote.total,
      notes: newQuote.notes || null,
      terms: newQuote.terms || null,
      created_at: newQuote.createdAt,
      updated_at: newQuote.updatedAt,
    });

    if (items.length > 0) {
      await supabase.from("quote_items").insert(
        items.map((it, idx) => ({
          id: it.id,
          quote_id: newQuote.id,
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
  } catch {
    // Fallback
  }

  store.quotes.unshift(newQuote);
  return newQuote;
}

export async function updateQuoteStatus(id: string, status: QuoteStatus): Promise<Quote | null> {
  const store = getStore();
  const quote = store.quotes.find((q) => q.id === id);
  if (!quote) return null;

  quote.status = status;
  quote.updatedAt = new Date().toISOString();

  try {
    const supabase = createServerClient();
    await supabase.from("quotes").update({ status, updated_at: quote.updatedAt }).eq("id", id);
  } catch {
    // Fallback
  }

  return quote;
}

export async function deleteQuote(id: string): Promise<boolean> {
  try {
    const supabase = createServerClient();
    await supabase.from("quotes").delete().eq("id", id);
  } catch {
    // Fallback
  }

  const store = getStore();
  const index = store.quotes.findIndex((q) => q.id === id);
  if (index === -1) return false;

  store.quotes.splice(index, 1);
  return true;
}

export async function convertQuoteToInvoice(quoteId: string): Promise<Invoice | null> {
  const quote = await getQuoteById(quoteId);
  if (!quote) return null;

  const today = new Date().toISOString().split("T")[0];
  const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const invoice = await createInvoice({
    clientId: quote.clientId,
    clientName: quote.clientName,
    clientEmail: quote.clientEmail,
    clientPhone: quote.clientPhone,
    clientCity: quote.clientCity,
    clientAddress: quote.clientAddress,
    issueDate: today,
    dueDate,
    status: "draft",
    discountType: quote.discountType,
    discountValue: quote.discountValue,
    notes: quote.notes ? `${quote.notes}\n(Converti depuis le devis ${quote.number})` : `Converti depuis le devis ${quote.number}`,
    terms: quote.terms,
    items: quote.items.map((it) => ({
      description: it.description,
      quantity: it.quantity,
      unitPrice: it.unitPrice,
      taxRate: it.taxRate,
      productId: it.productId,
    })),
    quoteId: quote.id,
  });

  quote.status = "converted";
  quote.convertedInvoiceId = invoice.id;
  quote.updatedAt = new Date().toISOString();

  try {
    const supabase = createServerClient();
    await supabase.from("quotes").update({
      status: "converted",
      converted_invoice_id: invoice.id,
      updated_at: quote.updatedAt,
    }).eq("id", quoteId);
  } catch {
    // Fallback
  }

  return invoice;
}
