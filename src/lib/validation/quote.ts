import { z } from "zod";
import { invoiceItemSchema } from "./invoice";

export const quoteInputSchema = z.object({
  clientId: z.string().min(1, "Le client est requis"),
  clientName: z.string().min(1, "Le nom du client est requis"),
  clientEmail: z.string().email("Email invalide").optional().or(z.literal("")),
  clientPhone: z.string().optional().or(z.literal("")),
  clientCity: z.string().optional().or(z.literal("")),
  clientAddress: z.string().optional().or(z.literal("")),
  issueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date requis: AAAA-MM-JJ"),
  validUntil: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date requis: AAAA-MM-JJ"),
  status: z.enum(["draft", "sent", "accepted", "declined", "converted", "expired"]).default("draft"),
  discountType: z.enum(["percent", "amount"]).optional(),
  discountValue: z.number().min(0).optional(),
  notes: z.string().optional(),
  terms: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1, "Au moins une ligne d'article est requise"),
});

export type QuoteInput = z.infer<typeof quoteInputSchema>;
