"use server";

import { revalidatePath } from "next/cache";
import { paymentInputSchema } from "../validation/payment";
import { recordPayment } from "../data/payments";
import { ActionResult, Payment } from "../domain/types";

export async function recordPaymentAction(
  input: unknown
): Promise<ActionResult<{ payment: Payment; invoiceRemaining: number }>> {
  try {
    const parsed = paymentInputSchema.safeParse(input);
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path.join(".");
        if (!fieldErrors[path]) fieldErrors[path] = [];
        fieldErrors[path].push(issue.message);
      }
      return {
        success: false,
        error: "Veuillez vérifier les informations du règlement.",
        fieldErrors,
      };
    }

    const result = await recordPayment(parsed.data);
    revalidatePath("/");
    revalidatePath("/factures");
    revalidatePath(`/factures/${parsed.data.invoiceId}`);
    revalidatePath("/clients");
    return { success: true, data: result };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Erreur lors de l'enregistrement du règlement.";
    return { success: false, error: errorMsg };
  }
}
