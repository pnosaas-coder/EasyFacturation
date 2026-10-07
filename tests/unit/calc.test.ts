import { describe, it, expect } from "vitest";
import { calculateInvoiceTotals } from "../../src/lib/calc/invoice-totals";

describe("Moteur de calcul : calculateInvoiceTotals (Cameroun FCFA)", () => {
  it("retourne des totaux nuls si la liste d'articles est vide", () => {
    const res = calculateInvoiceTotals([]);
    expect(res.subtotal).toBe(0);
    expect(res.discountAmount).toBe(0);
    expect(res.taxTotal).toBe(0);
    expect(res.total).toBe(0);
    expect(res.balanceDue).toBe(0);
  });

  it("calcule correctement un article unique avec TVA 19.25% au Cameroun", () => {
    // 2 500 000 FCFA HT * 19.25% = 481 250 FCFA TVA
    // Total TTC = 2 981 250 FCFA
    const res = calculateInvoiceTotals([
      { quantity: 1, unitPrice: 2_500_000, taxRate: 19.25 },
    ]);

    expect(res.subtotal).toBe(2_500_000);
    expect(res.discountAmount).toBe(0);
    expect(res.taxTotal).toBe(481_250);
    expect(res.total).toBe(2_981_250);
    expect(res.balanceDue).toBe(2_981_250);
    expect(res.lineItems[0].lineSubtotal).toBe(2_500_000);
    expect(res.lineItems[0].lineTax).toBe(481_250);
  });

  it("calcule correctement plusieurs lignes et arrondit en half-up", () => {
    const res = calculateInvoiceTotals([
      { quantity: 3, unitPrice: 400_000, taxRate: 19.25 }, // 1 200 000 HT -> 231 000 TVA
      { quantity: 2, unitPrice: 750_000, taxRate: 19.25 }, // 1 500 000 HT -> 288 750 TVA
    ]);

    expect(res.subtotal).toBe(2_700_000);
    expect(res.taxTotal).toBe(519_750);
    expect(res.total).toBe(3_219_750);
    expect(res.balanceDue).toBe(3_219_750);
  });

  it("applique correctement une remise en pourcentage", () => {
    // 1 000 000 HT, remise 10% = 100 000 FCFA
    // Base taxable = 900 000 FCFA
    // TVA 19.25% sur 900 000 = 173 250 FCFA
    // Total TTC = 900 000 + 173 250 = 1 073 250 FCFA
    const res = calculateInvoiceTotals(
      [{ quantity: 1, unitPrice: 1_000_000, taxRate: 19.25 }],
      { type: "percent", value: 10 }
    );

    expect(res.subtotal).toBe(1_000_000);
    expect(res.discountAmount).toBe(100_000);
    expect(res.taxTotal).toBe(173_250);
    expect(res.total).toBe(1_073_250);
    expect(res.balanceDue).toBe(1_073_250);
  });

  it("applique correctement une remise en montant fixe", () => {
    // 2 000 000 HT, remise fixe 500 000 FCFA -> Base = 1 500 000 FCFA
    // TVA 19.25% sur 1 500 000 = 288 750 FCFA
    // Total TTC = 1 788 750 FCFA
    const res = calculateInvoiceTotals(
      [{ quantity: 1, unitPrice: 2_000_000, taxRate: 19.25 }],
      { type: "amount", value: 500_000 }
    );

    expect(res.subtotal).toBe(2_000_000);
    expect(res.discountAmount).toBe(500_000);
    expect(res.taxTotal).toBe(288_750);
    expect(res.total).toBe(1_788_750);
  });

  it("plafonne la remise si elle dépasse le sous-total", () => {
    const res = calculateInvoiceTotals(
      [{ quantity: 1, unitPrice: 100_000, taxRate: 19.25 }],
      { type: "amount", value: 250_000 }
    );

    expect(res.subtotal).toBe(100_000);
    expect(res.discountAmount).toBe(100_000);
    expect(res.taxTotal).toBe(0);
    expect(res.total).toBe(0);
    expect(res.balanceDue).toBe(0);
  });

  it("calcule avec exactitude le solde restant dû lors d'un paiement partiel", () => {
    const res = calculateInvoiceTotals(
      [{ quantity: 1, unitPrice: 1_000_000, taxRate: 0 }],
      null,
      400_000
    );

    expect(res.total).toBe(1_000_000);
    expect(res.balanceDue).toBe(600_000);
  });

  it("gère les très grands montants en FCFA sans perte de précision", () => {
    const res = calculateInvoiceTotals([
      { quantity: 10, unitPrice: 50_000_000, taxRate: 19.25 }, // 500 000 000 FCFA HT
    ]);

    expect(res.subtotal).toBe(500_000_000);
    expect(res.taxTotal).toBe(96_250_000);
    expect(res.total).toBe(596_250_000);
    expect(res.balanceDue).toBe(596_250_000);
  });
});
