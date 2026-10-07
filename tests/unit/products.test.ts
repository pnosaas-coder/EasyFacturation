import { describe, it, expect, beforeEach } from "vitest";
import {
  getProducts,
  createProduct,
  deleteProduct,
} from "../../src/lib/data/products";
import { resetStore } from "../../src/lib/data/store";

describe("Products & Services Catalogue DAL", () => {
  beforeEach(() => {
    resetStore();
  });

  it("loads default seed products", async () => {
    const prods = await getProducts();
    expect(prods.length).toBeGreaterThanOrEqual(4);
    expect(prods[0].unitPrice).toBeGreaterThan(0);
  });

  it("creates a new service and adds it to the catalogue", async () => {
    const created = await createProduct({
      name: "Nouvelle Prestation Cloud Douala",
      description: "Migration d'infrastructures vers GCP CEMAC",
      unitPrice: 1_850_000,
      taxRate: 19.25,
      unit: "forfait",
    });

    expect(created.id).toBeDefined();
    expect(created.name).toBe("Nouvelle Prestation Cloud Douala");
    expect(created.unitPrice).toBe(1_850_000);

    const prods = await getProducts();
    const found = prods.find((p) => p.id === created.id);
    expect(found).toBeDefined();
  });

  it("deletes a service from the catalogue", async () => {
    const prods = await getProducts();
    const toDelete = prods[0];
    const ok = await deleteProduct(toDelete.id);
    expect(ok).toBe(true);

    const after = await getProducts();
    expect(after.find((p) => p.id === toDelete.id)).toBeUndefined();
  });
});
