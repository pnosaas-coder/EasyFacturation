import { z } from "zod";

export const paymentInputSchema = z.object({
  invoiceId: z.string().min(1, "La facture est requise"),
  amount: z.number().int("Le montant doit être un entier en FCFA").positive("Le montant doit être supérieur à 0"),
  method: z.enum([
    "cash",
    "bank_transfer",
    "check",
    "orange_money",
    "wave",
    "mtn_momo",
    "moov_money",
    "card",
    "other",
  ]),
  paidOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date requis: AAAA-MM-JJ"),
  reference: z.string().optional(),
  note: z.string().optional(),
});

export type PaymentInput = z.infer<typeof paymentInputSchema>;
