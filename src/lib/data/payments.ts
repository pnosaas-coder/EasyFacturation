import { getStore } from "./store";
import { Payment } from "../domain/types";
import { PaymentInput } from "../validation/payment";
import { recalculateClientCounters } from "./clients";
import { createServerClient } from "../supabase/client";
import { mapPaymentFromRow } from "../supabase/adapters";

export async function getPaymentsByInvoiceId(invoiceId: string): Promise<Payment[]> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("invoice_id", invoiceId)
      .order("paid_on", { ascending: false });

    if (!error && data) {
      return data.map(mapPaymentFromRow);
    }
  } catch {
    // Fallback
  }

  const store = getStore();
  return store.payments
    .filter((p) => p.invoiceId === invoiceId)
    .sort((a, b) => new Date(b.paidOn).getTime() - new Date(a.paidOn).getTime());
}

export async function recordPayment(input: PaymentInput): Promise<{ payment: Payment; invoiceRemaining: number }> {
  const store = getStore();
  const invoice = store.invoices.find((inv) => inv.id === input.invoiceId);
  if (!invoice) {
    throw new Error(`Facture introuvable avec l'identifiant ${input.invoiceId}`);
  }

  if (invoice.status === "draft") {
    throw new Error("Impossible d'enregistrer un paiement sur une facture au statut Brouillon.");
  }

  if (invoice.status === "cancelled") {
    throw new Error("Impossible d'enregistrer un paiement sur une facture Annulée.");
  }

  if (input.amount > invoice.balanceDue) {
    throw new Error(
      `Le montant du règlement (${input.amount.toLocaleString("fr-FR")} FCFA) ne peut excéder le solde restant dû (${invoice.balanceDue.toLocaleString("fr-FR")} FCFA).`
    );
  }

  const newPayment: Payment = {
    id: `pay_${Date.now()}`,
    invoiceId: input.invoiceId,
    amount: input.amount,
    method: input.method,
    paidOn: input.paidOn,
    reference: input.reference || undefined,
    note: input.note || undefined,
    createdAt: new Date().toISOString(),
  };

  store.payments.unshift(newPayment);

  // Update invoice financial states
  invoice.amountPaid += input.amount;
  invoice.balanceDue = Math.max(0, invoice.total - invoice.amountPaid);
  invoice.updatedAt = new Date().toISOString();

  if (invoice.balanceDue === 0) {
    invoice.status = "paid";
  } else {
    invoice.status = "partial";
  }

  invoice.payments = store.payments.filter((p) => p.invoiceId === invoice.id);

  // Synchronize client aggregates
  recalculateClientCounters(invoice.clientId);

  // Sync to Supabase
  try {
    const supabase = createServerClient();
    await supabase.from("payments").insert({
      id: newPayment.id,
      invoice_id: newPayment.invoiceId,
      amount: newPayment.amount,
      method: newPayment.method,
      paid_on: newPayment.paidOn,
      reference: newPayment.reference || null,
      note: newPayment.note || null,
      created_at: newPayment.createdAt,
    });

    await supabase.from("invoices").update({
      amount_paid: invoice.amountPaid,
      balance_due: invoice.balanceDue,
      status: invoice.status,
      updated_at: invoice.updatedAt,
    }).eq("id", invoice.id);
  } catch {
    // Fallback
  }

  return { payment: newPayment, invoiceRemaining: invoice.balanceDue };
}
