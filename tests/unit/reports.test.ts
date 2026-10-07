import { describe, it, expect, beforeEach } from "vitest";
import { getVatReport } from "../../src/lib/data/reports";
import { resetStore } from "../../src/lib/data/store";

describe("VAT & Financial Reports (Cameroun - 19,25%)", () => {
  beforeEach(() => {
    resetStore();
  });

  it("calculates positive subtotal HT and VAT 19.25% for 2026", async () => {
    const report = await getVatReport(2026);
    expect(report.year).toBe(2026);
    expect(report.totalSubtotalHT).toBeGreaterThan(0);
    expect(report.totalVatCollected).toBeGreaterThan(0);
    expect(report.totalTTC).toBeGreaterThan(report.totalSubtotalHT);
  });

  it("aggregates receipts by payment methods including MoMo and OM", async () => {
    const report = await getVatReport(2026);
    expect(report.byPaymentMethod).toBeDefined();
    // Sum of channels matches total payments received
    const sumChannels =
      report.byPaymentMethod.mtnMoMo +
      report.byPaymentMethod.orangeMoney +
      report.byPaymentMethod.bankTransfer +
      report.byPaymentMethod.cashOrOther;

    expect(sumChannels).toBe(report.totalPaymentsReceived);
  });

  it("produces 12 calendar months in the monthly breakdown", async () => {
    const report = await getVatReport(2026);
    expect(report.monthly).toHaveLength(12);
    expect(report.monthly[0].monthName).toBe("Janvier");
    expect(report.monthly[11].monthName).toBe("Décembre");
  });
});
