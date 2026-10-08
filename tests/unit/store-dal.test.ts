import { describe, it, expect, beforeEach } from "vitest";
import { resetStore } from "../../src/lib/data/store";
import {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoiceStatus,
  deleteDraftInvoice,
  deleteInvoice,
  duplicateInvoice,
} from "../../src/lib/data/invoices";
import { recordPayment, getPaymentsByInvoiceId } from "../../src/lib/data/payments";
import { createQuote, convertQuoteToInvoice, getQuoteById, deleteQuote } from "../../src/lib/data/quotes";
import { getClients, createClient, deleteClient, getClientById } from "../../src/lib/data/clients";
import { getDashboardKPIs } from "../../src/lib/data/dashboard";

describe("Store & DAL : In-Memory Data Access Layer", () => {
  beforeEach(() => {
    resetStore();
  });

  it("génère des numéros de facture séquentiels déterministes (ex: FAC-2026-0049)", async () => {
    const inv = await createInvoice({
      clientId: "cli_1",
      clientName: "MTN Cameroon B2B",
      issueDate: "2026-10-08",
      dueDate: "2026-11-08",
      status: "sent",
      items: [
        {
          description: "Prestation Test",
          quantity: 1,
          unitPrice: 1_000_000,
          taxRate: 19.25,
        },
      ],
    });

    expect(inv.number).toBe("FAC-2026-0049");
    expect(inv.subtotal).toBe(1_000_000);
    expect(inv.taxTotal).toBe(192_500);
    expect(inv.total).toBe(1_192_500);
    expect(inv.balanceDue).toBe(1_192_500);
  });

  it("enregistre un règlement partiel puis le solde, en mettant à jour le statut", async () => {
    const inv = await createInvoice({
      clientId: "cli_2",
      clientName: "Boissons du Cameroun",
      issueDate: "2026-10-08",
      dueDate: "2026-11-08",
      status: "sent",
      items: [
        {
          description: "Service Dev",
          quantity: 1,
          unitPrice: 2_000_000,
          taxRate: 0,
        },
      ],
    });

    expect(inv.total).toBe(2_000_000);

    // 1. Acompte de 500 000 FCFA
    const res1 = await recordPayment({
      invoiceId: inv.id,
      amount: 500_000,
      method: "mtn_momo",
      paidOn: "2026-10-09",
      reference: "MOMO-TEST-001",
    });

    expect(res1.invoiceRemaining).toBe(1_500_000);

    const updatedInv1 = await getInvoiceById(inv.id);
    expect(updatedInv1?.status).toBe("partial");
    expect(updatedInv1?.amountPaid).toBe(500_000);
    expect(updatedInv1?.balanceDue).toBe(1_500_000);

    // 2. Solde de 1 500 000 FCFA
    const res2 = await recordPayment({
      invoiceId: inv.id,
      amount: 1_500_000,
      method: "orange_money",
      paidOn: "2026-10-10",
      reference: "OM-TEST-002",
    });

    expect(res2.invoiceRemaining).toBe(0);

    const updatedInv2 = await getInvoiceById(inv.id);
    expect(updatedInv2?.status).toBe("paid");
    expect(updatedInv2?.balanceDue).toBe(0);

    const payments = await getPaymentsByInvoiceId(inv.id);
    expect(payments.length).toBe(2);
  });

  it("rejette tout règlement supérieur au solde restant dû", async () => {
    const inv = await createInvoice({
      clientId: "cli_1",
      clientName: "MTN Cameroon",
      issueDate: "2026-10-08",
      dueDate: "2026-11-08",
      status: "sent",
      items: [
        {
          description: "Conseil",
          quantity: 1,
          unitPrice: 100_000,
          taxRate: 0,
        },
      ],
    });

    await expect(
      recordPayment({
        invoiceId: inv.id,
        amount: 250_000, // Excède 100 000 FCFA
        method: "cash",
        paidOn: "2026-10-08",
      })
    ).rejects.toThrow("ne peut excéder le solde restant dû");
  });

  it("convertit un devis en facture en 1 clic avec traçabilité", async () => {
    const quote = await createQuote({
      clientId: "cli_5",
      clientName: "Cabinet Bastos",
      issueDate: "2026-10-01",
      validUntil: "2026-10-31",
      status: "accepted",
      items: [
        {
          description: "Étude fiscale",
          quantity: 1,
          unitPrice: 800_000,
          taxRate: 19.25,
        },
      ],
    });

    const invoice = await convertQuoteToInvoice(quote.id);
    expect(invoice.id).toBeDefined();
    expect(invoice.quoteId).toBe(quote.id);
    expect(invoice.total).toBe(954_000); // 800k + 19.25% TVA

    const refreshedQuote = await getQuoteById(quote.id);
    expect(refreshedQuote?.status).toBe("converted");
    expect(refreshedQuote?.convertedInvoiceId).toBe(invoice.id);
  });

  it("permet de supprimer un brouillon mais interdit de supprimer une facture émise", async () => {
    const draft = await createInvoice({
      clientId: "cli_1",
      clientName: "MTN Cameroon",
      issueDate: "2026-10-08",
      dueDate: "2026-11-08",
      status: "draft",
      items: [{ description: "Brouillon", quantity: 1, unitPrice: 50_000, taxRate: 0 }],
    });

    const deleted = await deleteDraftInvoice(draft.id);
    expect(deleted).toBe(true);

    const deletedCheck = await getInvoiceById(draft.id);
    expect(deletedCheck).toBeNull();

    // Facture non brouillon (ex: inv_1 du seed)
    await expect(deleteDraftInvoice("inv_1")).rejects.toThrow(
      "Seules les factures au statut Brouillon peuvent être supprimées"
    );
  });

  it("duplique une facture existante en nouveau brouillon", async () => {
    const dup = await duplicateInvoice("inv_1");
    expect(dup).not.toBeNull();
    expect(dup?.status).toBe("draft");
    expect(dup?.number).toBe("FAC-2026-0049");
    expect(dup?.items.length).toBe(2);
  });

  it("supprime une facture et réajuste les totaux du client associé", async () => {
    const inv = await getInvoiceById("inv_1");
    expect(inv).not.toBeNull();
    const clientId = inv!.clientId;
    const clientBefore = await getClientById(clientId);
    const balanceBefore = clientBefore?.balanceDue || 0;

    const res = await deleteInvoice("inv_1");
    expect(res).toBe(true);

    const check = await getInvoiceById("inv_1");
    expect(check).toBeNull();

    const clientAfter = await getClientById(clientId);
    expect((clientAfter?.balanceDue || 0)).toBeLessThanOrEqual(balanceBefore);
  });

  it("supprime un devis avec succès", async () => {
    const quote = await createQuote({
      clientId: "cli_1",
      clientName: "MTN Cameroon",
      issueDate: "2026-10-08",
      validUntil: "2026-11-08",
      status: "sent",
      items: [{ description: "Audit", quantity: 1, unitPrice: 300_000, taxRate: 0 }],
    });

    const res = await deleteQuote(quote.id);
    expect(res).toBe(true);
    expect(await getQuoteById(quote.id)).toBeNull();
  });

  it("supprime un client avec succès", async () => {
    const client = await createClient({
      name: "Client Test Suppression",
      city: "Douala",
      country: "Cameroun",
      phone: "+237 600000000",
      email: "test@client.cm",
    });

    const res = await deleteClient(client.id);
    expect(res).toBe(true);
    expect(await getClientById(client.id)).toBeNull();
  });

  it("calcule les KPIs du tableau de bord avec précision", async () => {
    const kpis = await getDashboardKPIs();
    expect(kpis.totalInvoiced).toBeGreaterThan(0);
    expect(kpis.totalCollected).toBeGreaterThan(0);
    expect(kpis.totalPending).toBeGreaterThan(0);
  });

  it("met à jour dynamiquement une facture de Envoyée à Payée : règlement, solde client et KPIs", async () => {
    // Crée une facture (FAC-2026-0049) pour le client cli_1
    const inv = await createInvoice({
      clientId: "cli_1",
      clientName: "MTN Cameroon B2B",
      issueDate: "2026-10-08",
      dueDate: "2026-11-08",
      status: "sent",
      items: [
        {
          description: "Audit SI",
          quantity: 1,
          unitPrice: 2_000_000,
          taxRate: 0,
        },
      ],
    });

    expect(inv.number).toBe("FAC-2026-0049");
    expect(inv.status).toBe("sent");
    expect(inv.amountPaid).toBe(0);
    expect(inv.balanceDue).toBe(2_000_000);

    const clientBefore = await getClientById("cli_1");
    const clientPaidBefore = clientBefore?.totalPaid || 0;
    const clientDueBefore = clientBefore?.balanceDue || 0;

    const kpisBefore = await getDashboardKPIs();
    const collectedBefore = kpisBefore.totalCollected;
    const pendingBefore = kpisBefore.totalPending;

    // 1. Passage du statut de "sent" à "paid"
    const updated = await updateInvoiceStatus(inv.id, "paid");
    expect(updated).not.toBeNull();
    expect(updated?.status).toBe("paid");
    expect(updated?.amountPaid).toBe(2_000_000);
    expect(updated?.balanceDue).toBe(0);

    // Vérifie qu'un paiement automatique a été créé
    const payments = await getPaymentsByInvoiceId(inv.id);
    expect(payments.length).toBeGreaterThan(0);
    expect(payments[0].amount).toBe(2_000_000);

    // Vérifie le solde client actualisé
    const clientAfter = await getClientById("cli_1");
    expect(clientAfter?.totalPaid).toBe(clientPaidBefore + 2_000_000);
    expect(clientAfter?.balanceDue).toBe(clientDueBefore - 2_000_000);

    // Vérifie les KPIs du tableau de bord
    const kpisAfter = await getDashboardKPIs();
    expect(kpisAfter.totalCollected).toBe(collectedBefore + 2_000_000);
    expect(kpisAfter.totalPending).toBe(pendingBefore - 2_000_000);

    // 2. Passage du statut de "paid" à nouveau vers "sent" (annulation du règlement)
    const reverted = await updateInvoiceStatus(inv.id, "sent");
    expect(reverted?.status).toBe("sent");
    expect(reverted?.amountPaid).toBe(0);
    expect(reverted?.balanceDue).toBe(2_000_000);

    const clientReverted = await getClientById("cli_1");
    expect(clientReverted?.totalPaid).toBe(clientPaidBefore);
    expect(clientReverted?.balanceDue).toBe(clientDueBefore);

    const kpisReverted = await getDashboardKPIs();
    expect(kpisReverted.totalCollected).toBe(collectedBefore);
    expect(kpisReverted.totalPending).toBe(pendingBefore);
  });
});

