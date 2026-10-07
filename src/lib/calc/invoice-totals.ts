import Big from "big.js";

// Set rounding mode to half-up (standard commercial rounding)
Big.RM = Big.roundHalfUp;

export interface CalcLineItemInput {
  quantity: number | string;
  unitPrice: number | string;
  taxRate: number | string;
}

export interface CalcDiscountInput {
  type: "percent" | "amount";
  value: number | string;
}

export interface CalculatedLineItem {
  lineSubtotal: number;
  lineTax: number;
}

export interface CalculatedInvoiceTotals {
  subtotal: number;
  discountAmount: number;
  taxTotal: number;
  total: number;
  balanceDue: number;
  lineItems: CalculatedLineItem[];
  taxesByRate: Record<number, number>;
}

export function calculateInvoiceTotals(
  items: CalcLineItemInput[],
  discount?: CalcDiscountInput | null,
  amountPaid: number = 0
): CalculatedInvoiceTotals {
  if (!items || items.length === 0) {
    return {
      subtotal: 0,
      discountAmount: 0,
      taxTotal: 0,
      total: 0,
      balanceDue: 0,
      lineItems: [],
      taxesByRate: {},
    };
  }

  // 1. Calculate line subtotals
  const calculatedLines = items.map((item) => {
    const qty = new Big(item.quantity || 0);
    const price = new Big(item.unitPrice || 0);
    const lineSubtotal = qty.times(price).round(0);
    return {
      lineSubtotal,
      taxRate: new Big(item.taxRate || 0),
    };
  });

  // 2. Subtotal = sum(line_subtotal)
  const subtotal = calculatedLines.reduce(
    (acc, line) => acc.plus(line.lineSubtotal),
    new Big(0)
  );

  // If subtotal is 0, everything is 0
  if (subtotal.eq(0)) {
    return {
      subtotal: 0,
      discountAmount: 0,
      taxTotal: 0,
      total: 0,
      balanceDue: 0,
      lineItems: items.map(() => ({ lineSubtotal: 0, lineTax: 0 })),
      taxesByRate: {},
    };
  }

  // 3. Discount amount
  let discountAmount = new Big(0);
  if (discount && Number(discount.value) > 0) {
    const discVal = new Big(discount.value);
    if (discount.type === "percent") {
      discountAmount = subtotal.times(discVal).div(100).round(0);
    } else {
      discountAmount = discVal.gt(subtotal) ? subtotal : discVal.round(0);
    }
  }

  // 4. Line tax and total tax
  // formula: line_tax = round(line_subtotal * (subtotal - discount_amount) * tax_rate / (subtotal * 100))
  const taxableBaseRatio = subtotal.minus(discountAmount).div(subtotal);

  let taxTotal = new Big(0);
  const taxesByRate: Record<number, number> = {};

  const linesWithTax = calculatedLines.map((line) => {
    let lineTax = new Big(0);
    if (line.taxRate.gt(0)) {
      lineTax = line.lineSubtotal
        .times(taxableBaseRatio)
        .times(line.taxRate)
        .div(100)
        .round(0);
    }

    taxTotal = taxTotal.plus(lineTax);

    const rateNum = Number(line.taxRate.toFixed(2));
    taxesByRate[rateNum] = (taxesByRate[rateNum] || 0) + Number(lineTax.toFixed(0));

    return {
      lineSubtotal: Number(line.lineSubtotal.toFixed(0)),
      lineTax: Number(lineTax.toFixed(0)),
    };
  });

  // 5. Total TTC = subtotal - discount_amount + tax_total
  const total = subtotal.minus(discountAmount).plus(taxTotal).round(0);

  // 6. Balance due = total - amount_paid
  const paid = new Big(amountPaid || 0);
  const balanceDue = total.minus(paid).round(0);

  return {
    subtotal: Number(subtotal.toFixed(0)),
    discountAmount: Number(discountAmount.toFixed(0)),
    taxTotal: Number(taxTotal.toFixed(0)),
    total: Number(total.toFixed(0)),
    balanceDue: Math.max(0, Number(balanceDue.toFixed(0))),
    lineItems: linesWithTax,
    taxesByRate,
  };
}
