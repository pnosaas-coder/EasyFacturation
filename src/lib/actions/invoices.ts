"use server";

import { revalidatePath } from "next/cache";
import { invoiceInputSchema } from "../validation/invoice";
import {
  createInvoice,
  updateInvoiceStatus,
  deleteDraftInvoice,
  duplicateInvoice,
} from "../data/invoices";
import { ActionResult, Invoice, InvoiceStatus } from "../domain/types";

export async function createInvoiceAction(input: unknown): Promise<ActionResult<Invoice>> {
  try {
    const parsed = invoiceInputSchema.safeParse(input);
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path.join(".");
        if (!fieldErrors[path]) fieldErrors[path] = [];
        fieldErrors[path].push(issue.message);
      }
      return {
        success: false,
        error: "Veuillez vérifier les informations saisies dans le formulaire.",
        fieldErrors,
      };
    }

    const newInvoice = await createInvoice(parsed.data);
    revalidatePath("/");
    revalidatePath("/factures");
    revalidatePath("/clients");
    return { success: true, data: newInvoice };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Une erreur inattendue est survenue.";
    return { success: false, error: errorMsg };
  }
}

export async function updateInvoiceStatusAction(
  id: string,
  status: InvoiceStatus
): Promise<ActionResult<Invoice>> {
  try {
    const updated = await updateInvoiceStatus(id, status);
    if (!updated) {
      return { success: false, error: "Facture introuvable." };
    }
    revalidatePath("/");
    revalidatePath("/factures");
    revalidatePath(`/factures/${id}`);
    revalidatePath("/clients");
    return { success: true, data: updated };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Erreur lors du changement de statut.";
    return { success: false, error: errorMsg };
  }
}

export async function deleteDraftInvoiceAction(id: string): Promise<ActionResult<boolean>> {
  try {
    const deleted = await deleteDraftInvoice(id);
    revalidatePath("/");
    revalidatePath("/factures");
    return { success: true, data: deleted };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Erreur lors de la suppression.";
    return { success: false, error: errorMsg };
  }
}

export async function duplicateInvoiceAction(id: string): Promise<ActionResult<Invoice>> {
  try {
    const duplicated = await duplicateInvoice(id);
    if (!duplicated) {
      return { success: false, error: "Impossible de dupliquer la facture source." };
    }
    revalidatePath("/factures");
    return { success: true, data: duplicated };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Erreur lors de la duplication.";
    return { success: false, error: errorMsg };
  }
}
