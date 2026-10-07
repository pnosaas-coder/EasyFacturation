import {
  Invoice,
  Quote,
  Client,
  Payment,
  Product,
  OrganizationSettings,
  InvoiceStatus,
  QuoteStatus,
} from "../domain/types";
import { mockRecentInvoices } from "../../mocks/fixtures";

export interface DataStore {
  invoices: Invoice[];
  quotes: Quote[];
  clients: Client[];
  payments: Payment[];
  products: Product[];
  settings: OrganizationSettings;
  sequences: {
    invoiceYear: number;
    invoiceCount: number;
    quoteYear: number;
    quoteCount: number;
  };
}

// Initial seed clients - Cameroun
const initialClients: Client[] = [
  {
    id: "cli_1",
    name: "MTN Cameroon B2B",
    contactName: "Jean-Paul Mbida",
    email: "business@mtn.cm",
    phone: "+237 6 77 12 34 56",
    address: "360 Rue Drouot, Akwa",
    city: "Douala",
    country: "CM",
    taxId: "M059800012345Z",
    rccm: "RC/DLA/2000/B/4521",
    notes: "Grand compte télécom, délai de paiement 30 jours fin de mois.",
    totalBilled: 4_531_500,
    totalPaid: 0,
    balanceDue: 4_531_500,
    createdAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "cli_2",
    name: "Boissons du Cameroun (SABC)",
    contactName: "Béatrice Etoa",
    email: "finances@sabc-cm.com",
    phone: "+237 2 33 42 15 20",
    address: "77 Rue Koumassi, Zone Industrielle",
    city: "Douala",
    country: "CM",
    taxId: "M016500000892B",
    rccm: "RC/DLA/1965/B/0012",
    notes: "Règlements ponctuels par virement bancaire Afriland.",
    totalBilled: 5_664_375,
    totalPaid: 5_664_375,
    balanceDue: 0,
    createdAt: "2026-02-10T08:30:00Z",
  },
  {
    id: "cli_3",
    name: "Eneo Cameroon S.A.",
    contactName: "Alain Ngando",
    email: "facturation@eneo.cm",
    phone: "+237 2 22 23 45 67",
    address: "Avenue Charles de Gaulle",
    city: "Yaoundé",
    country: "CM",
    taxId: "M057400034567X",
    rccm: "RC/YAO/1974/B/0411",
    notes: "Facture en retard, relances WhatsApp et email programmées.",
    totalBilled: 1_431_000,
    totalPaid: 0,
    balanceDue: 1_431_000,
    createdAt: "2026-03-01T14:15:00Z",
  },
  {
    id: "cli_4",
    name: "Orange Cameroun S.A.",
    contactName: "Clarisse Kamdem",
    email: "entreprises@orange.cm",
    phone: "+237 6 99 87 65 43",
    address: "Boulevard de la Liberté, Bonanjo",
    city: "Douala",
    country: "CM",
    taxId: "M099900054321A",
    rccm: "RC/DLA/1999/B/1890",
    notes: "Paiement partiel effectué via Orange Money entreprise.",
    totalBilled: 2_385_000,
    totalPaid: 1_500_000,
    balanceDue: 885_000,
    createdAt: "2026-04-12T11:00:00Z",
  },
  {
    id: "cli_5",
    name: "Cabinet Juridique & Fiscal Bastos",
    contactName: "Maître Paul Fouda",
    email: "contact@fiscal-bastos.cm",
    phone: "+237 2 22 20 10 30",
    address: "Quartier Bastos, Rue 1782",
    city: "Yaoundé",
    country: "CM",
    taxId: "M102100098765C",
    rccm: "RC/YAO/2021/B/0987",
    notes: "Nouveau client pour portail web Next.js.",
    totalBilled: 775_125,
    totalPaid: 0,
    balanceDue: 775_125,
    createdAt: "2026-05-20T09:00:00Z",
  },
];

// Initial seed products / services catalog
const initialProducts: Product[] = [
  {
    id: "prod_1",
    name: "Audit d'infrastructure Cloud & Sécurité SI",
    description: "Audit complet de l'infrastructure serveurs, réseau et sécurité",
    unit: "prestation",
    unitPrice: 2_500_000,
    taxRate: 19.25,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "prod_2",
    name: "Accompagnement DevOps & Haute Disponibilité",
    description: "CI/CD, conteneurisation Docker/Kubernetes et monitoring",
    unit: "mois",
    unitPrice: 1_300_000,
    taxRate: 19.25,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "prod_3",
    name: "Développement Plateforme & API Mobiles",
    description: "Conception web/mobile sur mesure avec stack moderne",
    unit: "projet",
    unitPrice: 5_000_000,
    taxRate: 19.25,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "prod_4",
    name: "Maintenance applicative mensuelle",
    description: "Support technique, mises à jour de sécurité et sauvegardes",
    unit: "mois",
    unitPrice: 400_000,
    taxRate: 19.25,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "prod_5",
    name: "Intégration Passerelle Mobile Money (MTN MoMo & OM)",
    description: "Passerelle de paiement API directe MTN & Orange Cameroun",
    unit: "intégration",
    unitPrice: 2_000_000,
    taxRate: 19.25,
    createdAt: "2026-01-01T00:00:00Z",
  },
];

// Initial seed quotes
const initialQuotes: Quote[] = [
  {
    id: "dev_1",
    number: "DEV-2026-0012",
    clientId: "cli_1",
    clientName: "MTN Cameroon B2B",
    clientEmail: "business@mtn.cm",
    clientPhone: "+237 6 77 12 34 56",
    clientCity: "Douala",
    clientAddress: "360 Rue Drouot, Akwa",
    issueDate: "2026-10-01",
    validUntil: "2026-10-31",
    status: "sent",
    subtotal: 4_500_000,
    discountAmount: 0,
    taxTotal: 866_250,
    total: 5_366_250,
    items: [
      {
        id: "dvi_1",
        description: "Déploiement Plateforme Kubernetes & Observabilité Datadog",
        quantity: 1,
        unitPrice: 4_500_000,
        taxRate: 19.25,
        lineSubtotal: 4_500_000,
        lineTax: 866_250,
      },
    ],
    notes: "Offre valable 30 jours à compter de la date d'émission.",
    terms: "Acompte de 40% au démarrage, 60% à la recette finale.",
    createdAt: "2026-10-01T10:00:00Z",
    updatedAt: "2026-10-01T10:00:00Z",
  },
  {
    id: "dev_2",
    number: "DEV-2026-0011",
    clientId: "cli_5",
    clientName: "Cabinet Juridique & Fiscal Bastos",
    clientEmail: "contact@fiscal-bastos.cm",
    clientPhone: "+237 2 22 20 10 30",
    clientCity: "Yaoundé",
    clientAddress: "Quartier Bastos, Rue 1782",
    issueDate: "2026-09-20",
    validUntil: "2026-10-20",
    status: "accepted",
    subtotal: 1_200_000,
    discountAmount: 0,
    taxTotal: 231_000,
    total: 1_431_000,
    items: [
      {
        id: "dvi_2",
        description: "Refonte Ergonomie et Sécurisation Espace Avocats",
        quantity: 1,
        unitPrice: 1_200_000,
        taxRate: 19.25,
        lineSubtotal: 1_200_000,
        lineTax: 231_000,
      },
    ],
    createdAt: "2026-09-20T08:00:00Z",
    updatedAt: "2026-09-25T14:00:00Z",
  },
];

// Initial payments seed
const initialPayments: Payment[] = [
  {
    id: "pay_1",
    invoiceId: "inv_2",
    amount: 5_664_375,
    method: "bank_transfer",
    paidOn: "2026-10-02",
    reference: "VIR-AFRILAND-889102",
    note: "Règlement intégral facture SABC",
    createdAt: "2026-10-02T15:30:00Z",
  },
  {
    id: "pay_2",
    invoiceId: "inv_4",
    amount: 1_500_000,
    method: "orange_money",
    paidOn: "2026-09-18",
    reference: "OM-CM-99481230",
    note: "Acompte Orange Money 1 500 000 FCFA",
    createdAt: "2026-09-18T11:45:00Z",
  },
];

// Initial settings seed - Cameroun
const initialSettings: OrganizationSettings = {
  name: "PNO Solutions Cameroun S.A.R.L",
  managerName: "Philippe NOUGOUE",
  email: "contact@pno-cameroun.cm",
  phone: "+237 677481161 / +237 691114908",
  address: "Boulevard de la Liberté, Akwa",
  city: "Douala",
  country: "CM",
  taxId: "NIU M052112345678A",
  rccm: "RC/DLA/2024/B/1234",
  currency: "FCFA",
  defaultTaxRate: 19.25,
  paymentTermsDays: 30,
  invoicePrefix: "FAC",
  quotePrefix: "DEV",
  mtnMoMoPhone: "+237 677481161",
  orangeMoneyPhone: "+237 691114908",
  bankRib: "CM21 10005 00012 01234567890 45 (Afriland First Bank)",
  defaultNotes: "Règlements acceptés par MTN MoMo (*126#), Orange Money (*150#) ou virement bancaire.",
  defaultTerms: "En cas de retard de paiement, une pénalité légale de 1% par mois sera appliquée conformément aux dispositions OHADA.",
};

function createInitialStore(): DataStore {
  const seedInvoices: Invoice[] = mockRecentInvoices.map((inv) => ({
    ...inv,
    createdAt: inv.issueDate + "T09:00:00Z",
    updatedAt: inv.issueDate + "T09:00:00Z",
    payments: initialPayments.filter((p) => p.invoiceId === inv.id),
  }));

  return {
    invoices: seedInvoices,
    quotes: initialQuotes,
    clients: initialClients,
    payments: initialPayments,
    products: initialProducts,
    settings: initialSettings,
    sequences: {
      invoiceYear: 2026,
      invoiceCount: 48,
      quoteYear: 2026,
      quoteCount: 12,
    },
  };
}

// Singleton attached to globalThis to survive Next.js Fast Refresh
declare global {
  // eslint-disable-next-line no-var
  var __pnoStore: DataStore | undefined;
}

export function getStore(): DataStore {
  if (!globalThis.__pnoStore) {
    globalThis.__pnoStore = createInitialStore();
  }
  return globalThis.__pnoStore;
}

export function resetStore(): void {
  globalThis.__pnoStore = createInitialStore();
}
