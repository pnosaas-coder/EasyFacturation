import { z } from "zod";

export const settingsInputSchema = z.object({
  name: z.string().min(2, "Le nom de l'entreprise est requis"),
  managerName: z.string().min(2, "Le nom du gérant est requis"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().min(8, "Le numéro de téléphone est requis"),
  address: z.string().min(3, "L'adresse est requise"),
  city: z.string().min(2, "La ville est requise"),
  country: z.string().default("CM"),
  taxId: z.string().min(3, "L'identifiant fiscal (NIU) est requis"),
  rccm: z.string().min(3, "Le numéro RCCM est requis"),
  currency: z.string().default("FCFA"),
  defaultTaxRate: z.number().min(0).max(100).default(19.25),
  paymentTermsDays: z.number().int().min(0).default(30),
  invoicePrefix: z.string().default("FAC"),
  quotePrefix: z.string().default("DEV"),
  mtnMoMoPhone: z.string().min(8, "Le numéro MTN MoMo est requis"),
  orangeMoneyPhone: z.string().min(8, "Le numéro Orange Money est requis"),
  bankRib: z.string().min(5, "Le RIB bancaire est requis"),
  defaultNotes: z.string().optional(),
  defaultTerms: z.string().optional(),
});

export type SettingsInput = z.infer<typeof settingsInputSchema>;
