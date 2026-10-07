"use server";

import { revalidatePath } from "next/cache";
import { createProduct, updateProduct, deleteProduct, CreateProductInput } from "../data/products";
import { ActionResult, Product } from "../domain/types";
import { z } from "zod";

const productInputSchema = z.object({
  name: z.string().min(1, "La désignation du produit ou de la prestation est requise"),
  description: z.string().optional(),
  unitPrice: z.number().min(0, "Le prix unitaire doit être positif"),
  taxRate: z.number().min(0).max(100).default(19.25),
  unit: z.string().default("prestation"),
});

export async function createProductAction(input: unknown): Promise<ActionResult<Product>> {
  try {
    const parsed = productInputSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Données invalides.",
      };
    }

    const prod = await createProduct(parsed.data);
    revalidatePath("/produits");
    revalidatePath("/factures/nouvelle");
    revalidatePath("/devis/nouveau");
    return { success: true, data: prod };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur lors de la création du produit.";
    return { success: false, error: msg };
  }
}

export async function updateProductAction(
  id: string,
  input: Partial<CreateProductInput>
): Promise<ActionResult<Product>> {
  try {
    const updated = await updateProduct(id, input);
    if (!updated) {
      return { success: false, error: "Article introuvable." };
    }
    revalidatePath("/produits");
    return { success: true, data: updated };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur lors de la mise à jour.";
    return { success: false, error: msg };
  }
}

export async function deleteProductAction(id: string): Promise<ActionResult<boolean>> {
  try {
    const success = await deleteProduct(id);
    revalidatePath("/produits");
    return { success };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur lors de la suppression.";
    return { success: false, error: msg };
  }
}
