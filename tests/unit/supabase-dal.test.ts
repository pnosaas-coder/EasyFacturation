import { describe, it, expect } from "vitest";
import { getClients } from "../../src/lib/data/clients";
import { getProducts } from "../../src/lib/data/products";
import { getSettings } from "../../src/lib/data/settings";
import { getInvoices } from "../../src/lib/data/invoices";
import { getQuotes } from "../../src/lib/data/quotes";

describe("Supabase Data Access Layer", () => {
  it("récupère les paramètres de l'entreprise (Prunus Engineering SARL)", async () => {
    const settings = await getSettings();
    expect(settings.name).toBe("Prunus Engineering SARL");
    expect(settings.managerName).toBe("Philippe NOUGOUE");
    expect(settings.defaultTaxRate).toBe(19.25);
  });

  it("récupère la liste des clients et permet la recherche", async () => {
    const clients = await getClients();
    expect(clients.length).toBeGreaterThanOrEqual(16);

    const filtered = await getClients({ search: "MTN" });
    expect(filtered.length).toBeGreaterThanOrEqual(1);
    expect(filtered[0].name).toContain("MTN");
  });

  it("récupère le catalogue des produits et services", async () => {
    const products = await getProducts();
    expect(products.length).toBeGreaterThanOrEqual(12);
  });

  it("récupère les factures et devis avec leurs articles", async () => {
    const invoices = await getInvoices();
    expect(invoices.length).toBeGreaterThanOrEqual(4);
    expect(invoices[0].items.length).toBeGreaterThan(0);

    const quotes = await getQuotes();
    expect(quotes.length).toBeGreaterThanOrEqual(2);
    expect(quotes[0].items.length).toBeGreaterThan(0);
  });
});

import {
  mapClientFromRow,
  mapClientToRow,
  mapProductFromRow,
  mapProductToRow,
  mapInvoiceFromRow,
  mapInvoiceToRow,
  mapQuoteFromRow,
  mapQuoteToRow,
} from "../../src/lib/supabase/adapters";

describe("Supabase Adapters Bidirectionnels", () => {
  it("mappe un client vers et depuis une ligne de base de données", () => {
    const client = {
      id: "cli_test",
      name: "Prunus Test Client",
      contactName: "Jean Test",
      email: "jean@test.cm",
      phone: "+237 677000000",
      address: "Bonanjo",
      city: "Douala",
      country: "Cameroun",
      taxId: "M0123456789",
      rccm: "RC/DLA/2026/B/999",
      notes: "Client VIP",
      totalBilled: 5_000_000,
      totalPaid: 2_500_000,
      balanceDue: 2_500_000,
      createdAt: "2026-10-08T10:00:00Z",
    };

    const row = mapClientToRow(client);
    expect(row.name).toBe("Prunus Test Client");
    expect(row.total_billed).toBe(5_000_000);
    expect(row.balance_due).toBe(2_500_000);

    const restored = mapClientFromRow({
      ...row,
      id: client.id,
      created_at: client.createdAt,
      archived_at: null,
    } as never);
    expect(restored.name).toBe(client.name);
    expect(restored.totalBilled).toBe(client.totalBilled);
    expect(restored.balanceDue).toBe(client.balanceDue);
  });

  it("mappe une facture et ses lignes vers et depuis le format relationnel", () => {
    const invoice = {
      id: "inv_test",
      number: "FAC-2026-9999",
      clientId: "cli_test",
      clientName: "Prunus Test Client",
      issueDate: "2026-10-08",
      dueDate: "2026-11-08",
      status: "sent" as const,
      subtotal: 1_000_000,
      discountAmount: 0,
      taxTotal: 192_500,
      total: 1_192_500,
      amountPaid: 0,
      balanceDue: 1_192_500,
      createdAt: "2026-10-08T10:00:00Z",
      updatedAt: "2026-10-08T10:00:00Z",
      items: [
        {
          id: "item_1",
          invoiceId: "inv_test",
          description: "Service Cloud",
          quantity: 2,
          unitPrice: 500_000,
          taxRate: 19.25,
          lineSubtotal: 1_000_000,
          lineTax: 192_500,
          total: 1_192_500,
        },
      ],
      payments: [],
    };

    const { invoiceRow, itemRows } = mapInvoiceToRow(invoice);
    expect(invoiceRow.number).toBe("FAC-2026-9999");
    expect(invoiceRow.total).toBe(1_192_500);
    expect(itemRows.length).toBe(1);
    expect(itemRows[0].unit_price).toBe(500_000);

    const restored = mapInvoiceFromRow(
      {
        ...invoiceRow,
        id: invoice.id,
        created_at: invoice.createdAt,
        updated_at: invoice.updatedAt,
      } as never,
      itemRows.map((r, i) => ({ ...r, id: `item_${i + 1}`, created_at: invoice.createdAt } as never))
    );

    expect(restored.number).toBe(invoice.number);
    expect(restored.total).toBe(invoice.total);
    expect(restored.items.length).toBe(1);
    expect(restored.items[0].description).toBe("Service Cloud");
  });
});

