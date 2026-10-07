import { z } from "zod";

export const clientInputSchema = z.object({
  name: z.string().min(2, "Le nom de l'entreprise ou du client est requis (2 car. min)"),
  contactName: z.string().optional(),
  email: z.string().email("Adresse email invalide").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  country: z.string().default("CM"),
  taxId: z.string().optional().or(z.literal("")), // NIU au Cameroun
  rccm: z.string().optional().or(z.literal("")),
  notes: z.string().optional(),
});

export type ClientInput = z.infer<typeof clientInputSchema>;
