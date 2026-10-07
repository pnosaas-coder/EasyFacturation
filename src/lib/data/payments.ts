import { getStore } from "./store";
import { Payment } from "../domain/types";
import { PaymentInput } from "../validation/payment";

export async function getPaymentsByInvoiceId(invoiceId: string): Promise<Payment[]> {
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

  // Update client aggregates
  const client = store.clients.find((c) => c.id === invoice.clientId);
  if (client) {
    client.totalPaid += input.amount;
    client.balanceDue = Math.max(0, client.balanceDue - input.amount);
  }

  return { payment: newPayment, invoiceRemaining: invoice.balanceDue };
}
