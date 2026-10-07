import { describe, it, expect, beforeEach } from "vitest";
import { globalSearch } from "../../src/lib/data/search";
import { resetStore } from "../../src/lib/data/store";

describe("Global Search (⌘K Command Palette)", () => {
  beforeEach(() => {
    resetStore();
  });

  it("returns quick actions when query is empty", async () => {
    const results = await globalSearch("");
    expect(results.length).toBeGreaterThan(0);
    const actionTypes = results.filter((r) => r.type === "action");
    expect(actionTypes.length).toBeGreaterThanOrEqual(3);
  });

  it("finds invoice by invoice number", async () => {
    const results = await globalSearch("FAC-2026-0048");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].type).toBe("invoice");
    expect(results[0].title).toContain("FAC-2026-0048");
  });

  it("finds client by company name", async () => {
    const results = await globalSearch("MTN");
    expect(results.length).toBeGreaterThan(0);
    const clientMatch = results.find((r) => r.type === "client");
    expect(clientMatch).toBeDefined();
    expect(clientMatch?.title).toContain("MTN Cameroon");
  });

  it("finds quote by quote number or client", async () => {
    const results = await globalSearch("DEV-2026-0012");
    expect(results.length).toBeGreaterThan(0);
    const quoteMatch = results.find((r) => r.type === "quote");
    expect(quoteMatch).toBeDefined();
    expect(quoteMatch?.title).toContain("DEV-2026-0012");
  });

  it("finds quick action when typing action name", async () => {
    const results = await globalSearch("TVA");
    expect(results.length).toBeGreaterThan(0);
    const vatAction = results.find((r) => r.id === "act-reports" || r.id === "act-vat");
    expect(vatAction).toBeDefined();
  });
});
