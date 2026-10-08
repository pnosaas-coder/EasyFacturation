import {
  Client,
  Product,
  OrganizationSettings,
  Invoice,
  InvoiceItem,
  Quote,
  Payment,
  PaymentMethod,
  InvoiceStatus,
  QuoteStatus,
} from "../domain/types";
import { Database } from "./database.types";

type ClientRow = Database["public"]["Tables"]["clients"]["Row"];
type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type OrgSettingsRow = Database["public"]["Tables"]["organization_settings"]["Row"];
type InvoiceRow = Database["public"]["Tables"]["invoices"]["Row"];
type InvoiceItemRow = Database["public"]["Tables"]["invoice_items"]["Row"];
type QuoteRow = Database["public"]["Tables"]["quotes"]["Row"];
type QuoteItemRow = Database["public"]["Tables"]["quote_items"]["Row"];
type PaymentRow = Database["public"]["Tables"]["payments"]["Row"];

export function mapClientFromRow(row: ClientRow): Client {
  return {
    id: row.id,
    name: row.name,
    contactName: row.contact_name || undefined,
    email: row.email || undefined,
    phone: row.phone || undefined,
    address: row.address || undefined,
    city: row.city || undefined,
    country: row.country || "CM",
    taxId: row.tax_id || undefined,
    rccm: row.rccm || undefined,
    notes: row.notes || undefined,
    totalBilled: Number(row.total_billed || 0),
    totalPaid: Number(row.total_paid || 0),
    balanceDue: Number(row.balance_due || 0),
    createdAt: row.created_at,
    archivedAt: row.archived_at || undefined,
  };
}

export function mapClientToRow(client: Client): Database["public"]["Tables"]["clients"]["Insert"] {
  return {
    id: client.id,
    name: client.name,
    contact_name: client.contactName || null,
    email: client.email || null,
    phone: client.phone || null,
    address: client.address || null,
    city: client.city || null,
    country: client.country || "Cameroun",
    tax_id: client.taxId || null,
    rccm: client.rccm || null,
    notes: client.notes || null,
    total_billed: client.totalBilled,
    total_paid: client.totalPaid,
    balance_due: client.balanceDue,
    created_at: client.createdAt,
    archived_at: client.archivedAt || null,
  };
}

export function mapProductFromRow(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description || undefined,
    unit: row.unit || undefined,
    unitPrice: Number(row.unit_price || 0),
    taxRate: Number(row.tax_rate || 19.25),
    createdAt: row.created_at,
  };
}

export function mapProductToRow(prod: Product): Database["public"]["Tables"]["products"]["Insert"] {
  return {
    id: prod.id,
    name: prod.name,
    description: prod.description || null,
    unit: prod.unit || null,
    unit_price: prod.unitPrice,
    tax_rate: prod.taxRate,
    created_at: prod.createdAt,
  };
}

export function mapSettingsFromRow(row: OrgSettingsRow): OrganizationSettings {
  return {
    name: row.name,
    managerName: row.manager_name,
    email: row.email,
    phone: row.phone,
    address: row.address,
    city: row.city,
    country: row.country,
    taxId: row.tax_id,
    rccm: row.rccm,
    currency: row.currency,
    defaultTaxRate: Number(row.default_tax_rate),
    paymentTermsDays: Number(row.payment_terms_days),
    invoicePrefix: row.invoice_prefix,
    quotePrefix: row.quote_prefix,
    mtnMoMoPhone: row.mtn_momo_phone,
    orangeMoneyPhone: row.orange_money_phone,
    bankRib: row.bank_rib,
    defaultNotes: row.default_notes || undefined,
    defaultTerms: row.default_terms || undefined,
  };
}

export function mapSettingsToRow(settings: OrganizationSettings): Database["public"]["Tables"]["organization_settings"]["Insert"] {
  return {
    name: settings.name,
    manager_name: settings.managerName,
    email: settings.email,
    phone: settings.phone,
    address: settings.address,
    city: settings.city,
    country: settings.country,
    tax_id: settings.taxId,
    rccm: settings.rccm,
    currency: settings.currency,
    default_tax_rate: settings.defaultTaxRate,
    payment_terms_days: settings.paymentTermsDays,
    invoice_prefix: settings.invoicePrefix,
    quote_prefix: settings.quotePrefix,
    mtn_momo_phone: settings.mtnMoMoPhone,
    orange_money_phone: settings.orangeMoneyPhone,
    bank_rib: settings.bankRib,
    default_notes: settings.defaultNotes || null,
    default_terms: settings.defaultTerms || null,
  };
}

export function mapInvoiceItemFromRow(row: InvoiceItemRow): InvoiceItem {
  return {
    id: row.id,
    description: row.description,
    quantity: Number(row.quantity),
    unitPrice: Number(row.unit_price),
    taxRate: Number(row.tax_rate),
    lineSubtotal: Number(row.line_subtotal),
    lineTax: Number(row.line_tax),
    productId: row.product_id || undefined,
  };
}

export function mapPaymentFromRow(row: PaymentRow): Payment {
  return {
    id: row.id,
    invoiceId: row.invoice_id,
    amount: Number(row.amount),
    method: row.method as PaymentMethod,
    paidOn: row.paid_on,
    reference: row.reference || undefined,
    note: row.note || undefined,
    createdAt: row.created_at,
  };
}

export function mapInvoiceFromRow(
  row: InvoiceRow,
  items: InvoiceItemRow[] = [],
  payments: PaymentRow[] = []
): Invoice {
  return {
    id: row.id,
    number: row.number,
    clientId: row.client_id,
    clientName: row.client_name,
    clientEmail: row.client_email || undefined,
    clientPhone: row.client_phone || undefined,
    clientCity: row.client_city || undefined,
    clientAddress: row.client_address || undefined,
    issueDate: row.issue_date,
    dueDate: row.due_date,
    status: row.status as InvoiceStatus,
    subtotal: Number(row.subtotal),
    discountType: (row.discount_type as "percent" | "amount") || undefined,
    discountValue: row.discount_value !== null ? Number(row.discount_value) : undefined,
    discountAmount: Number(row.discount_amount),
    taxTotal: Number(row.tax_total),
    total: Number(row.total),
    amountPaid: Number(row.amount_paid),
    balanceDue: Number(row.balance_due),
    notes: row.notes || undefined,
    terms: row.terms || undefined,
    quoteId: row.quote_id || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    items: items.map(mapInvoiceItemFromRow),
    payments: payments.map(mapPaymentFromRow),
  };
}

export function mapQuoteFromRow(
  row: QuoteRow,
  items: QuoteItemRow[] = []
): Quote {
  return {
    id: row.id,
    number: row.number,
    clientId: row.client_id,
    clientName: row.client_name,
    clientEmail: row.client_email || undefined,
    clientPhone: row.client_phone || undefined,
    clientCity: row.client_city || undefined,
    clientAddress: row.client_address || undefined,
    issueDate: row.issue_date,
    validUntil: row.valid_until,
    status: row.status as QuoteStatus,
    subtotal: Number(row.subtotal),
    discountType: (row.discount_type as "percent" | "amount") || undefined,
    discountValue: row.discount_value !== null ? Number(row.discount_value) : undefined,
    discountAmount: Number(row.discount_amount),
    taxTotal: Number(row.tax_total),
    total: Number(row.total),
    notes: row.notes || undefined,
    terms: row.terms || undefined,
    convertedInvoiceId: row.converted_invoice_id || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    items: items.map((it) => ({
      id: it.id,
      description: it.description,
      quantity: Number(it.quantity),
      unitPrice: Number(it.unit_price),
      taxRate: Number(it.tax_rate),
      lineSubtotal: Number(it.line_subtotal),
      lineTax: Number(it.line_tax),
      productId: it.product_id || undefined,
    })),
  };
}

export function mapInvoiceToRow(invoice: Invoice): {
  invoiceRow: Database["public"]["Tables"]["invoices"]["Insert"];
  itemRows: Database["public"]["Tables"]["invoice_items"]["Insert"][];
} {
  return {
    invoiceRow: {
      id: invoice.id,
      number: invoice.number,
      client_id: invoice.clientId,
      client_name: invoice.clientName,
      client_email: invoice.clientEmail || null,
      client_phone: invoice.clientPhone || null,
      client_city: invoice.clientCity || null,
      client_address: invoice.clientAddress || null,
      issue_date: invoice.issueDate,
      due_date: invoice.dueDate,
      status: invoice.status,
      subtotal: invoice.subtotal,
      discount_type: invoice.discountType || null,
      discount_value: invoice.discountValue !== undefined ? invoice.discountValue : null,
      discount_amount: invoice.discountAmount || 0,
      tax_total: invoice.taxTotal,
      total: invoice.total,
      amount_paid: invoice.amountPaid,
      balance_due: invoice.balanceDue,
      notes: invoice.notes || null,
      terms: invoice.terms || null,
      quote_id: invoice.quoteId || null,
      created_at: invoice.createdAt,
      updated_at: invoice.updatedAt || invoice.createdAt,
    },
    itemRows: invoice.items.map((it) => ({
      id: it.id,
      invoice_id: invoice.id,
      description: it.description,
      quantity: it.quantity,
      unit_price: it.unitPrice,
      tax_rate: it.taxRate,
      line_subtotal: it.lineSubtotal ?? Math.round(it.quantity * it.unitPrice),
      line_tax: it.lineTax ?? Math.round(it.quantity * it.unitPrice * (it.taxRate / 100)),
      product_id: it.productId || null,
    })),
  };
}

export function mapQuoteToRow(quote: Quote): {
  quoteRow: Database["public"]["Tables"]["quotes"]["Insert"];
  itemRows: Database["public"]["Tables"]["quote_items"]["Insert"][];
} {
  return {
    quoteRow: {
      id: quote.id,
      number: quote.number,
      client_id: quote.clientId,
      client_name: quote.clientName,
      client_email: quote.clientEmail || null,
      client_phone: quote.clientPhone || null,
      client_city: quote.clientCity || null,
      client_address: quote.clientAddress || null,
      issue_date: quote.issueDate,
      valid_until: quote.validUntil,
      status: quote.status,
      subtotal: quote.subtotal,
      discount_type: quote.discountType || null,
      discount_value: quote.discountValue !== undefined ? quote.discountValue : null,
      discount_amount: quote.discountAmount || 0,
      tax_total: quote.taxTotal,
      total: quote.total,
      notes: quote.notes || null,
      terms: quote.terms || null,
      converted_invoice_id: quote.convertedInvoiceId || null,
      created_at: quote.createdAt,
      updated_at: quote.updatedAt || quote.createdAt,
    },
    itemRows: quote.items.map((it) => ({
      id: it.id,
      quote_id: quote.id,
      description: it.description,
      quantity: it.quantity,
      unit_price: it.unitPrice,
      tax_rate: it.taxRate,
      line_subtotal: it.lineSubtotal ?? Math.round(it.quantity * it.unitPrice),
      line_tax: it.lineTax ?? Math.round(it.quantity * it.unitPrice * (it.taxRate / 100)),
      product_id: it.productId || null,
    })),
  };
}

