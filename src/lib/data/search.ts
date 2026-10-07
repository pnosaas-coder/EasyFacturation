import { getStore } from "./store";
import { formatFCFA } from "../format/money";

export interface SearchResultItem {
  id: string;
  type: "invoice" | "quote" | "client" | "action";
  title: string;
  subtitle: string;
  href: string;
  badge?: string;
  badgeColor?: "emerald" | "amber" | "rose" | "blue" | "slate";
}

export async function globalSearch(query: string): Promise<SearchResultItem[]> {
  const store = getStore();
  const q = query.trim().toLowerCase();

  // If query is empty, return top recent items and quick actions
  if (!q) {
    const quickActions: SearchResultItem[] = [
      {
        id: "act-new-invoice",
        type: "action",
        title: "Nouvelle facture",
        subtitle: "Créer une nouvelle facture avec calcul automatique de la TVA 19,25%",
        href: "/factures/nouvelle",
        badge: "Action",
        badgeColor: "blue",
      },
      {
        id: "act-new-quote",
        type: "action",
        title: "Nouveau devis",
        subtitle: "Établir une proposition commerciale convertible en facture",
        href: "/devis/nouveau",
        badge: "Action",
        badgeColor: "amber",
      },
      {
        id: "act-new-client",
        type: "action",
        title: "Nouveau client",
        subtitle: "Enregistrer une nouvelle entreprise ou un particulier",
        href: "/clients",
        badge: "Action",
        badgeColor: "emerald",
      },
      {
        id: "act-overdue",
        type: "action",
        title: "Factures en retard / impayées",
        subtitle: "Consulter les créances échues nécessitant une relance WhatsApp",
        href: "/factures?status=overdue",
        badge: "Trésorerie",
        badgeColor: "rose",
      },
      {
        id: "act-vat",
        type: "action",
        title: "Déclaration TVA & Rapports",
        subtitle: "Consulter la TVA camerounaise collectée et les encaissements",
        href: "/rapports",
        badge: "Fiscalité",
        badgeColor: "slate",
      },
    ];

    const recentInvoices: SearchResultItem[] = store.invoices.slice(0, 3).map((inv) => ({
      id: `inv-${inv.id}`,
      type: "invoice",
      title: `${inv.number} • ${inv.clientName}`,
      subtitle: `${formatFCFA(inv.total)} • Solde dû: ${formatFCFA(inv.balanceDue)}`,
      href: `/factures/${inv.id}`,
      badge: inv.status.toUpperCase(),
      badgeColor:
        inv.status === "paid"
          ? "emerald"
          : inv.status === "partial"
          ? "amber"
          : inv.status === "draft"
          ? "slate"
          : "rose",
    }));

    return [...quickActions, ...recentInvoices];
  }

  const results: SearchResultItem[] = [];

  // 1. Search Invoices
  for (const inv of store.invoices) {
    if (
      inv.number.toLowerCase().includes(q) ||
      inv.clientName.toLowerCase().includes(q) ||
      inv.status.toLowerCase().includes(q)
    ) {
      results.push({
        id: `inv-${inv.id}`,
        type: "invoice",
        title: `${inv.number} • ${inv.clientName}`,
        subtitle: `${formatFCFA(inv.total)} • Solde: ${formatFCFA(inv.balanceDue)}`,
        href: `/factures/${inv.id}`,
        badge: inv.status.toUpperCase(),
        badgeColor:
          inv.status === "paid"
            ? "emerald"
            : inv.status === "partial"
            ? "amber"
            : inv.status === "draft"
            ? "slate"
            : "rose",
      });
    }
  }

  // 2. Search Quotes
  for (const quote of store.quotes) {
    if (
      quote.number.toLowerCase().includes(q) ||
      quote.clientName.toLowerCase().includes(q) ||
      quote.status.toLowerCase().includes(q)
    ) {
      results.push({
        id: `quo-${quote.id}`,
        type: "quote",
        title: `${quote.number} • ${quote.clientName}`,
        subtitle: `${formatFCFA(quote.total)} • Valable jusqu'au ${quote.validUntil}`,
        href: `/devis`,
        badge: quote.status.toUpperCase(),
        badgeColor: quote.status === "accepted" ? "emerald" : "amber",
      });
    }
  }

  // 3. Search Clients
  for (const cli of store.clients) {
    if (
      cli.name.toLowerCase().includes(q) ||
      cli.contactName?.toLowerCase().includes(q) ||
      cli.email?.toLowerCase().includes(q) ||
      cli.city?.toLowerCase().includes(q) ||
      cli.phone?.toLowerCase().includes(q)
    ) {
      results.push({
        id: `cli-${cli.id}`,
        type: "client",
        title: cli.name,
        subtitle: `${cli.city || "Cameroun"} • ${cli.phone || cli.email || "Contact"}`,
        href: `/clients`,
        badge: "CLIENT",
        badgeColor: "blue",
      });
    }
  }

  // 4. Quick actions matching query
  const staticActions: SearchResultItem[] = [
    {
      id: "act-new-invoice",
      type: "action",
      title: "Nouvelle facture",
      subtitle: "Créer une nouvelle facture",
      href: "/factures/nouvelle",
      badge: "Action",
      badgeColor: "blue",
    },
    {
      id: "act-new-quote",
      type: "action",
      title: "Nouveau devis",
      subtitle: "Créer un devis pour un client",
      href: "/devis/nouveau",
      badge: "Action",
      badgeColor: "amber",
    },
    {
      id: "act-clients",
      type: "action",
      title: "Gestion des clients",
      subtitle: "Répertoire et fiches clients",
      href: "/clients",
      badge: "CRM",
      badgeColor: "emerald",
    },
    {
      id: "act-products",
      type: "action",
      title: "Catalogue de produits & prestations",
      subtitle: "Tarifs et références",
      href: "/produits",
      badge: "Catalogue",
      badgeColor: "slate",
    },
    {
      id: "act-reports",
      type: "action",
      title: "Rapports & TVA Cameroun",
      subtitle: "Déclaration TVA et récapitulatif fiscal",
      href: "/rapports",
      badge: "Fiscalité",
      badgeColor: "slate",
    },
    {
      id: "act-settings",
      type: "action",
      title: "Paramètres de l'entreprise",
      subtitle: "Coordonnées bancaires, MTN MoMo, Orange Money, gérant",
      href: "/parametres",
      badge: "Config",
      badgeColor: "slate",
    },
  ];

  for (const act of staticActions) {
    if (act.title.toLowerCase().includes(q) || act.subtitle.toLowerCase().includes(q)) {
      results.push(act);
    }
  }

  return results.slice(0, 15);
}
