"use server";

import { revalidatePath } from "next/cache";
import { clientInputSchema } from "../validation/client";
import { createClient, updateClient } from "../data/clients";
import { ActionResult, Client } from "../domain/types";

export async function createClientAction(input: unknown): Promise<ActionResult<Client>> {
  try {
    const parsed = clientInputSchema.safeParse(input);
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path.join(".");
        if (!fieldErrors[path]) fieldErrors[path] = [];
        fieldErrors[path].push(issue.message);
      }
      return {
        success: false,
        error: "Veuillez vérifier les informations du client.",
        fieldErrors,
      };
    }

    const client = await createClient(parsed.data);
    revalidatePath("/clients");
    return { success: true, data: client };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Erreur lors de l'ajout du client.";
    return { success: false, error: errorMsg };
  }
}

export async function updateClientAction(
  id: string,
  input: unknown
): Promise<ActionResult<Client>> {
  try {
    const parsed = clientInputSchema.partial().safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: "Informations invalides.",
      };
    }

    const client = await updateClient(id, parsed.data);
    if (!client) {
      return { success: false, error: "Client introuvable." };
    }
    revalidatePath("/clients");
    return { success: true, data: client };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Erreur lors de la mise à jour.";
    return { success: false, error: errorMsg };
  }
}
