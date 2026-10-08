"use server";

import { revalidatePath } from "next/cache";
import { settingsInputSchema } from "../validation/settings";
import { updateSettings } from "../data/settings";
import { ActionResult, OrganizationSettings } from "../domain/types";

export async function updateSettingsAction(input: unknown): Promise<ActionResult<OrganizationSettings>> {
  try {
    const parsed = settingsInputSchema.safeParse(input);
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path.join(".");
        if (!fieldErrors[path]) fieldErrors[path] = [];
        fieldErrors[path].push(issue.message);
      }
      return {
        success: false,
        error: "Veuillez vérifier les informations de configuration.",
        fieldErrors,
      };
    }

    const settings = await updateSettings(parsed.data);
    revalidatePath("/parametres");
    revalidatePath("/factures/nouvelle");
    revalidatePath("/devis");
    revalidatePath("/");
    return { success: true, data: settings };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Erreur lors de la mise à jour des paramètres.";
    return { success: false, error: errorMsg };
  }
}
