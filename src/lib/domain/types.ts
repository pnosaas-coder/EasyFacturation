export type InvoiceStatus = "draft" | "sent" | "partial" | "paid" | "overdue" | "cancelled";

export type QuoteStatus = "draft" | "sent" | "accepted" | "declined" | "converted" | "expired";

export type PaymentMethod =
  | "cash"
  | "bank_transfer"
  | "check"
  | "orange_money"
  | "wave"
  | "mtn_momo"
  | "moov_money"
  | "card"
  | "other";

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number; // in FCFA
  taxRate: number; // e.g. 19.25 for 19.25%
  lineSubtotal: number;
  lineTax: number;
  productId?: string;
}

export interface Client {
  id: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country: string;
  taxId?: string; // NIU (Cameroun)
  rccm?: string;
  notes?: string;
  totalBilled: number;
  totalPaid: number;
  balanceDue: number;
  createdAt: string;
  archivedAt?: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number; // FCFA
  method: PaymentMethod;
  paidOn: string; // YYYY-MM-DD
  reference?: string; // ex: ID transaction MTN MoMo / Orange Money
  note?: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  clientCity?: string;
  clientAddress?: string;
  issueDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  status: InvoiceStatus;
  subtotal: number;
  discountType?: "percent" | "amount";
  discountValue?: number;
  discountAmount: number;
  taxTotal: number;
  total: number; // TTC in FCFA
  amountPaid: number;
  balanceDue: number;
  notes?: string;
  terms?: string;
  items: InvoiceItem[];
  payments?: Payment[];
  quoteId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Quote {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  clientCity?: string;
  clientAddress?: string;
  issueDate: string; // YYYY-MM-DD
  validUntil: string; // YYYY-MM-DD
  status: QuoteStatus;
  subtotal: number;
  discountType?: "percent" | "amount";
  discountValue?: number;
  discountAmount: number;
  taxTotal: number;
  total: number; // TTC in FCFA
  notes?: string;
  terms?: string;
  items: InvoiceItem[];
  convertedInvoiceId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  unit?: string;
  unitPrice: number; // FCFA
  taxRate: number; // default 19.25
  createdAt: string;
}

export interface OrganizationSettings {
  name: string;
  managerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  taxId: string; // NIU
  rccm: string;
  currency: string;
  defaultTaxRate: number; // 19.25
  paymentTermsDays: number; // 30
  invoicePrefix: string; // FAC
  quotePrefix: string; // DEV
  mtnMoMoPhone: string;
  orangeMoneyPhone: string;
  bankRib: string;
  defaultNotes?: string;
  defaultTerms?: string;
}

export interface DashboardKPIs {
  totalInvoicesCount: number;
  totalInvoiced: number; // Montant facturé
  totalCollected: number; // Montant encaissé
  totalPending: number; // Montant en attente
  totalOverdue: number; // En retard
  overdueCount: number;
  growthRates: {
    invoiced: number; // e.g. +14.8%
    collected: number; // e.g. +11.2%
    pending: number; // e.g. -5.4%
    overdue: number; // e.g. +2.1%
  };
}

export interface MonthlyRevenue {
  month: string;
  invoiced: number;
  collected: number;
}

export interface RecurringInvoice {
  id: string;
  clientName: string;
  clientEmail?: string;
  frequency: "monthly" | "quarterly" | "yearly";
  amount: number;
  startDate: string;
  nextRunDate: string;
  status: "active" | "paused" | "ended";
  description: string;
}

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}
