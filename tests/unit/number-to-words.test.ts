import { describe, it, expect } from "vitest";
import { numberToWordsFr } from "../../src/lib/calc/number-to-words-fr";

describe("Conversion légale : numberToWordsFr (francs CFA)", () => {
  it("retourne 'zéro franc CFA' pour un montant de 0", () => {
    expect(numberToWordsFr(0)).toBe("zéro franc CFA");
  });

  it("gère les montants courants de factures", () => {
    // 2 500 000 FCFA
    const res = numberToWordsFr(2_500_000);
    expect(res).toContain("deux millions cinq cent mille francs CFA");
  });

  it("gère l'accord de 'cent' et 'cents'", () => {
    // 200 -> deux cents
    expect(numberToWordsFr(200)).toContain("deux cents francs CFA");
    // 250 -> deux cent cinquante
    expect(numberToWordsFr(250)).toContain("deux cent cinquante francs CFA");
  });

  it("gère l'invariabilité de 'mille'", () => {
    // 1000 -> mille (jamais un mille, jamais milles)
    expect(numberToWordsFr(1000)).toContain("mille francs CFA");
    // 2000 -> deux mille
    expect(numberToWordsFr(2000)).toContain("deux mille francs CFA");
  });

  it("gère les cas particuliers 80 (quatre-vingts) et 85 (quatre-vingt-cinq)", () => {
    expect(numberToWordsFr(80)).toContain("quatre-vingts francs CFA");
    expect(numberToWordsFr(85)).toContain("quatre-vingt-cinq francs CFA");
  });

  it("gère les montants très élevés (milliards)", () => {
    const res = numberToWordsFr(1_000_000_000);
    expect(res).toContain("un milliard");
  });

  it("inclut la formule légale standard", () => {
    const res = numberToWordsFr(4_531_500);
    expect(res.startsWith("Arrêtée la présente facture à la somme de")).toBe(true);
    expect(res.endsWith("francs CFA")).toBe(true);
  });
});
