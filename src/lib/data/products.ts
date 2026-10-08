import { getStore } from "./store";
import { Product } from "../domain/types";
import { createServerClient } from "../supabase/client";
import { mapProductFromRow, mapProductToRow } from "../supabase/adapters";

export async function getProducts(): Promise<Product[]> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (!error && data && data.length > 0) {
      const mapped = data.map(mapProductFromRow);
      const store = getStore();
      store.products = mapped;
      return mapped;
    }
  } catch {
    // Fallback to store
  }

  const store = getStore();
  return [...store.products];
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
    if (!error && data) {
      return mapProductFromRow(data);
    }
  } catch {
    // Fallback
  }

  const store = getStore();
  const prod = store.products.find((p) => p.id === id);
  return prod ? { ...prod } : null;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  unitPrice: number;
  taxRate: number;
  unit?: string;
}

export async function createProduct(input: CreateProductInput): Promise<Product> {
  const newProduct: Product = {
    id: `prod_${Date.now()}`,
    name: input.name,
    description: input.description,
    unitPrice: input.unitPrice,
    taxRate: input.taxRate,
    unit: input.unit || "prestation",
    createdAt: new Date().toISOString(),
  };

  try {
    const supabase = createServerClient();
    await supabase.from("products").insert(mapProductToRow(newProduct));
  } catch {
    // Fallback
  }

  const store = getStore();
  store.products.unshift(newProduct);
  return { ...newProduct };
}

export async function updateProduct(
  id: string,
  input: Partial<CreateProductInput>
): Promise<Product | null> {
  const store = getStore();
  const index = store.products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const updated: Product = {
    ...store.products[index],
    ...input,
  };

  try {
    const supabase = createServerClient();
    await supabase.from("products").update(mapProductToRow(updated)).eq("id", id);
  } catch {
    // Fallback
  }

  store.products[index] = updated;
  return { ...updated };
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const supabase = createServerClient();
    await supabase.from("products").delete().eq("id", id);
  } catch {
    // Fallback
  }

  const store = getStore();
  const initialLength = store.products.length;
  store.products = store.products.filter((p) => p.id !== id);
  return store.products.length < initialLength;
}
