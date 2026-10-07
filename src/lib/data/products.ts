import { getStore } from "./store";
import { Product } from "../domain/types";

export async function getProducts(): Promise<Product[]> {
  const store = getStore();
  return [...store.products];
}

export async function getProductById(id: string): Promise<Product | null> {
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
  const store = getStore();
  const newProduct: Product = {
    id: `prod_${Date.now()}`,
    name: input.name,
    description: input.description,
    unitPrice: input.unitPrice,
    taxRate: input.taxRate,
    unit: input.unit || "prestation",
    createdAt: new Date().toISOString(),
  };

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

  store.products[index] = updated;
  return { ...updated };
}

export async function deleteProduct(id: string): Promise<boolean> {
  const store = getStore();
  const initialLength = store.products.length;
  store.products = store.products.filter((p) => p.id !== id);
  return store.products.length < initialLength;
}
