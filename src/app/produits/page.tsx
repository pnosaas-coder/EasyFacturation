import { getProducts } from "../../lib/data/products";
import { ProductsListClient } from "./ProductsListClient";
import { connection } from "next/server";

export default async function ProductsPage() {
  await connection();
  const products = await getProducts();

  return <ProductsListClient initialProducts={products} />;
}
