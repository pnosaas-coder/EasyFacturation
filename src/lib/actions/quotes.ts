"use server";

import { revalidatePath } from "next/cache";
import { quoteInputSchema } from "../validation/quote";
import { createQuote, updateQuoteStatus, convertQuoteToInvoice, deleteQuote } from "../data/quotes";
import { ActionResult, Quote, QuoteStatus, Invoice } from "../domain/types";

export async function createQuoteAction(input: unknown): Promise<ActionResult<Quote>> {
  try {
    const parsed = quoteInputSchema.safeParse(input);
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path.join(".");
        if (!fieldErrors[path]) fieldErrors[path] = [];
        fieldErrors[path].push(issue.message);
      }
      return {
        success: false,
        error: "Veuillez vérifier les informations du devis.",
        fieldErrors,
      };
    }

    const quote = await createQuote(parsed.data);
    revalidatePath("/devis");
    return { success: true, data: quote };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Erreur lors de la création du devis.";
    return { success: false, error: errorMsg };
  }
}

export async function updateQuoteStatusAction(
  id: string,
  status: QuoteStatus
): Promise<ActionResult<Quote>> {
  try {
    const quote = await updateQuoteStatus(id, status);
    if (!quote) {
      return { success: false, error: "Devis introuvable." };
    }
    revalidatePath("/devis");
    return { success: true, data: quote };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Erreur lors du changement de statut.";
    return { success: false, error: errorMsg };
  }
}

export async function convertQuoteToInvoiceAction(quoteId: string): Promise<ActionResult<Invoice>> {
  try {
    const invoice = await convertQuoteToInvoice(quoteId);
    if (!invoice) {
      return { success: false, error: "Devis introuvable ou échec de conversion." };
    }
    revalidatePath("/devis");
    revalidatePath("/factures");
    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/clients");
    return { success: true, data: invoice };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Erreur lors de la conversion en facture.";
    return { success: false, error: errorMsg };
  }
}

export async function deleteQuoteAction(id: string): Promise<ActionResult<boolean>> {
  try {
    const success = await deleteQuote(id);
    if (!success) {
      return { success: false, error: "Devis introuvable." };
    }
    revalidatePath("/devis");
    return { success: true, data: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Erreur lors de la suppression du devis.";
    return { success: false, error: errorMsg };
  }
}
