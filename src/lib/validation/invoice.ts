import { z } from "zod";

export const invoiceItemSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(1, "La description de la ligne est requise"),
  quantity: z.number().min(0.01, "La quantité doit être supérieure à 0"),
  unitPrice: z.number().min(0, "Le prix unitaire doit être positif ou nul"),
  taxRate: z.number().min(0).max(100).default(19.25),
  lineSubtotal: z.number().optional(),
  lineTax: z.number().optional(),
  productId: z.string().optional(),
});

export const invoiceInputSchema = z.object({
  clientId: z.string().min(1, "Le client est requis"),
  clientName: z.string().min(1, "Le nom du client est requis"),
  clientEmail: z.string().email("Email invalide").optional().or(z.literal("")),
  clientPhone: z.string().optional().or(z.literal("")),
  clientCity: z.string().optional().or(z.literal("")),
  clientAddress: z.string().optional().or(z.literal("")),
  issueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date requis: AAAA-MM-JJ"),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date requis: AAAA-MM-JJ"),
  status: z.enum(["draft", "sent", "partial", "paid", "overdue", "cancelled"]).default("draft"),
  discountType: z.enum(["percent", "amount"]).optional(),
  discountValue: z.number().min(0).optional(),
  notes: z.string().optional(),
  terms: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1, "Au moins une ligne d'article est requise"),
});

export type InvoiceInput = z.infer<typeof invoiceInputSchema>;
export type InvoiceItemInput = z.infer<typeof invoiceItemSchema>;
