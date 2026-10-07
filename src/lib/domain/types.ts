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
  taxRate: number; // e.g. 18 for 18%
  lineSubtotal: number;
  lineTax: number;
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
  taxId?: string; // NINEA / IFU
  totalBilled: number;
  totalPaid: number;
  balanceDue: number;
}

export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  clientCity?: string;
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
  paymentMethodInstructions?: string;
}

export interface DashboardKPIs {
  totalInvoicesCount: number;
  totalInvoiced: number; // Montant facturé
  totalCollected: number; // Montant encaissé
  totalPending: number; // Montant en attente
  totalOverdue: number; // En retard
  overdueCount: number;
  growthRates: {
    invoiced: number; // e.g. +14.2%
    collected: number; // e.g. +8.5%
    pending: number; // e.g. -3.1%
    overdue: number; // e.g. +1.8%
  };
}

export interface MonthlyRevenue {
  month: string;
  invoiced: number;
  collected: number;
}
