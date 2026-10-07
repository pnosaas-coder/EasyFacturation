"use server";

import { globalSearch, SearchResultItem } from "../data/search";
import { ActionResult } from "../domain/types";

export async function searchGlobalAction(query: string): Promise<ActionResult<SearchResultItem[]>> {
  try {
    const results = await globalSearch(query);
    return { success: true, data: results };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur lors de la recherche.";
    return { success: false, error: msg };
  }
}
