import { describe, it, expect, beforeEach } from "vitest";
import { resetStore, getStore } from "../../src/lib/data/store";
import {
  createInvoice,
  updateInvoiceStatus,
  deleteInvoice,
  getInvoiceById,
} from "../../src/lib/data/invoices";
import { getClientById } from "../../src/lib/data/clients";
import {
  getDashboardKPIs,
  computeDashboardKPIs,
  computeMonthlyRevenue,
} from "../../src/lib/data/dashboard";
import { getVatReport } from "../../src/lib/data/reports";

describe("Réactivité Financière & Dynamisme Global (Cross-Tabs)", () => {
  beforeEach(() => {
    resetStore();
  });

  it("répercute le changement de statut Envoyée -> Payée sur l'ensemble du système (Dashboard, Client, Devis, Rapports)", async () => {
    // 1. État initial
    const initialKpis = await getDashboardKPIs();
    const initialVatReport = await getVatReport(2026);
    const initialClient = await getClientById("cli_1");

    const initialCollected = initialKpis.totalCollected;
    const initialPending = initialKpis.totalPending;
    const initialClientPaid = initialClient?.totalPaid || 0;
    const initialClientDue = initialClient?.balanceDue || 0;
    const initialVatPayments = initialVatReport.totalPaymentsReceived;

    // 2. Création de la facture FAC-2026-0049 avec statut 'sent' (exercice utilisateur)
    const newInvoice = await createInvoice({
      clientId: "cli_1",
      clientName: "MTN Cameroon B2B",
      issueDate: "2026-10-08",
      dueDate: "2026-11-08",
      status: "sent",
      items: [
        {
          description: "Prestation Audit de Performance",
          quantity: 1,
          unitPrice: 1_000_000,
          taxRate: 19.25,
        },
      ],
    });

    expect(newInvoice.number).toBe("FAC-2026-0049");
    expect(newInvoice.status).toBe("sent");
    expect(newInvoice.total).toBe(1_192_500);
    expect(newInvoice.amountPaid).toBe(0);
    expect(newInvoice.balanceDue).toBe(1_192_500);

    // 3. Changement de statut vers 'paid' (action testée par l'utilisateur)
    const updatedInvoice = await updateInvoiceStatus(newInvoice.id, "paid");
    expect(updatedInvoice).not.toBeNull();
    expect(updatedInvoice?.status).toBe("paid");
    expect(updatedInvoice?.amountPaid).toBe(1_192_500);
    expect(updatedInvoice?.balanceDue).toBe(0);

    // 4. Vérification du paiement enregistré
    const store = getStore();
    const payment = store.payments.find((p) => p.invoiceId === newInvoice.id);
    expect(payment).toBeDefined();
    expect(payment?.amount).toBe(1_192_500);

    // 5. Vérification dynamique du client MTN (cli_1)
    const clientAfter = await getClientById("cli_1");
    expect(clientAfter?.totalPaid).toBe(initialClientPaid + 1_192_500);
    expect(clientAfter?.balanceDue).toBe(initialClientDue); // Car totalBilled a augmenté de 1_192_500 et paid de 1_192_500

    // 6. Vérification dynamique des KPIs du tableau de bord
    const kpisAfter = await getDashboardKPIs();
    expect(kpisAfter.totalCollected).toBe(initialCollected + 1_192_500);
    expect(kpisAfter.totalPending).toBe(initialPending);

    // 7. Vérification des fonctions pures de calcul Dashboard (utilisées côté client pour la réactivité sans lag)
    const clientSideKpis = computeDashboardKPIs(store.invoices);
    expect(clientSideKpis.totalCollected).toBe(kpisAfter.totalCollected);

    const clientSideRevenue = computeMonthlyRevenue(store.invoices);
    const octRevenue = clientSideRevenue.find((m) => m.month === "Oct");
    expect(octRevenue?.collected).toBeGreaterThanOrEqual(1_192_500);

    // 8. Vérification dynamique du rapport de TVA et Encaissements
    const vatReportAfter = await getVatReport(2026);
    expect(vatReportAfter.totalPaymentsReceived).toBe(initialVatPayments + 1_192_500);
    const octVatMonth = vatReportAfter.monthly[9]; // Octobre (index 9)
    expect(octVatMonth.paymentsReceived).toBeGreaterThanOrEqual(1_192_500);
  });

  it("gère l'annulation d'une facture et synchronise les soldes", async () => {
    // Facture créée au statut 'sent'
    const inv = await createInvoice({
      clientId: "cli_2",
      clientName: "Boissons du Cameroun (SABC)",
      issueDate: "2026-10-08",
      dueDate: "2026-11-08",
      status: "sent",
      items: [
        {
          description: "Campagne Annulée",
          quantity: 1,
          unitPrice: 500_000,
          taxRate: 0,
        },
      ],
    });

    const clientBefore = await getClientById("cli_2");
    const dueBefore = clientBefore?.balanceDue || 0;

    // Annulation
    const cancelled = await updateInvoiceStatus(inv.id, "cancelled");
    expect(cancelled?.status).toBe("cancelled");
    expect(cancelled?.amountPaid).toBe(0);
    expect(cancelled?.balanceDue).toBe(0);

    // Solde client rétabli sans la créance
    const clientAfter = await getClientById("cli_2");
    expect(clientAfter?.balanceDue).toBe(dueBefore - 500_000);
  });
});
