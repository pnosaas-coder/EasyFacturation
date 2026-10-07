# Plan d'implémentation : PNO Facture Pro

> SaaS de facturation pour entrepreneurs africains (zone FCFA). Next.js (dernière stable), Supabase, Tailwind CSS, Vercel.

---

## 0. Contexte

Le dossier `PNO-Facture-Pro/` est vide, à l'exception de deux images d'inspiration (`Dashboard inspiration.png` : app « creatinf », bleu et blanc ; `Invoice landing page inspiration.webp` : landing « Invoicer », violet). On part de zéro.

Le but est un produit réel où de vrais entrepreneurs suivent leur argent. Trois exigences passent donc avant le reste :

1. **Montants justes** : entiers en FCFA, arrondis déterministes, une seule formule de calcul, testée.
2. **Isolation stricte entre comptes** : RLS Postgres plus contrôles applicatifs, et des tests qui le prouvent.
3. **Usage mobile et réseau lent** : la majorité des utilisateurs cibles est sur smartphone Android en 3G/4G.

Le flux imposé est conservé : UI d'après captures → interactivité en données locales → Supabase et tests → auth → landing → passage final et déploiement. On ajoute une **Phase 0 (fondations)** pour poser l'outillage et le modèle de données avant d'écrire les écrans.

### Décisions validées

| Sujet | Choix |
|---|---|
| Framework | **Next.js dernière stable (16.x)**, React 19, App Router, Server Actions, `proxy.ts` (ex-middleware) |
| Supabase | **2 projets cloud** : `pno-dev` (dev, preview, tests) et `pno-prod`. Pas de Docker. |
| Périmètre v1 | Cahier des charges **+ envoi email avec PDF + paiements partiels + devis → facture + factures récurrentes** |
| Langue | **Français uniquement** (libellés métier, erreurs et emails centralisés dans `src/content/fr.ts`) |

---

## 1. Stack technique

| Couche | Choix | Pourquoi |
|---|---|---|
| Framework | Next.js 16.x (version exacte fixée au scaffold), TypeScript `strict` | RSC et Server Actions : peu de JS envoyé au mobile |
| UI | Tailwind CSS v4 (tokens dans `@theme`), shadcn/ui (Radix), lucide-react, next-themes (mode sombre, présent sur la capture) | Composants accessibles, restylables selon les captures |
| Formulaires | react-hook-form, zod (schémas partagés client et serveur), `useFieldArray` pour les lignes | Validation identique des deux côtés |
| Calculs | `big.js` (arrondi half-up), fonctions pures | Pas d'erreur de flottant sur l'argent |
| Dates | date-fns et locale `fr` | |
| Graphiques | Recharts (chargé en dynamique) | |
| PDF | `@react-pdf/renderer` côté serveur (Route Handler, runtime Node) | Léger, sans Chromium |
| Email | Resend et React Email | Délivrabilité, pièces jointes, clé d'idempotence |
| BDD et auth | Supabase (Postgres 15+, Auth, Storage), `@supabase/supabase-js` et `@supabase/ssr` | |
| Tâches planifiées | Vercel Cron (déclaré dans `vercel.ts`) | Factures récurrentes |
| Tests | Vitest et Testing Library (unitaires et composants), Vitest en environnement node contre `pno-dev` (intégration RLS et RPC), Playwright et axe-core (E2E et accessibilité) | |
| Qualité | ESLint (flat config, `next lint` n'existe plus en v16), Prettier avec plugin Tailwind, `tsc --noEmit`, GitHub Actions | |
| Hébergement | Vercel, région des fonctions **`cdg1` (Paris)**, Supabase en région **eu-west-3 (Paris)** | Latence minimale vers Dakar et Abidjan ; BDD et fonctions dans la même région |

> Règle de travail : avant d'écrire du code Next.js, lire la doc embarquée `node_modules/next/dist/docs/`. Les API ont changé en v15 et v16 : `params`, `cookies()` et `headers()` sont asynchrones, `proxy.ts` remplace `middleware.ts`, Turbopack est l'outil par défaut. On vérifie aussi les compatibilités au moment du scaffold : zod v4 avec `@hookform/resolvers`, react-pdf avec React 19, shadcn avec Tailwind v4.

---

## 2. Périmètre fonctionnel v1

**Tableau de bord** : KPI (nombre de factures, montant facturé, encaissé, en attente, en retard), sélecteur de période, graphique facturé/encaissé sur 12 mois, répartition par statut, factures récentes, liste « À relancer » (en retard), top clients.

**Factures** :
- Liste avec onglets par statut et compteurs (comme la capture de la landing), recherche (numéro ou client), filtres de dates, tri et pagination. Les filtres vivent dans l'URL.
- Création et édition en deux panneaux avec **aperçu en direct** (comme la capture « Create Invoice »), toggle « Afficher l'aperçu », lignes dynamiques, TVA camerounaise 19,25 % par défaut (taux modifiable par ligne), remise globale (% ou montant), totaux calculés en direct.
- Le sélecteur « Standard | Récurrente » de la capture bascule vers la création d'un modèle récurrent.
- Page détail avec aperçu, paiements, historique (timeline) et actions : envoyer par email, télécharger le PDF, copier le lien public, partager sur WhatsApp, enregistrer un paiement, marquer payée, relancer, dupliquer, annuler, supprimer (brouillon uniquement), régénérer le lien public.

**Paiements partiels** : historique par facture (montant, date, moyen, référence de transaction), solde restant, statut « Partiellement payée ».

**Devis** : mêmes écrans que les factures, statuts propres, page publique avec boutons « Accepter » et « Refuser », **conversion en facture en un clic**.

**Factures récurrentes** : modèles (hebdomadaire, mensuelle, trimestrielle, annuelle), pause et reprise, date de fin ou nombre maximum d'occurrences, envoi automatique en option, historique des factures générées.

**Clients** : liste (recherche, solde dû par client), création et édition (nom, contact, email, téléphone, adresse, ville, pays, identifiant fiscal), fiche détail (facturé, payé, solde, factures et devis), archivage.

**Catalogue produits et services** : CRUD avec prix et TVA par défaut, autocomplétion dans les lignes de facture.

**Rapports** : TVA collectée par mois et par taux, CA par client, export CSV des factures et des paiements (séparateur `;` et BOM UTF-8, pour qu'Excel FR l'ouvre correctement).

**Paramètres** :
- Entreprise : nom, logo, adresse, téléphone, email, pays, RCCM, n° fiscal (NINEA, IFU, NCC, NIU…).
- Facturation : préfixes, TVA par défaut, délai de paiement, mentions et notes par défaut, **instructions de paiement** (banque, Orange Money, Wave, MTN MoMo), signature.
- Compte : nom, email, mot de passe.

**Transverse** : pages publiques `/f/[token]` (facture) et `/d/[token]` (devis), recherche globale ⌘K, mode sombre, responsive mobile-first, états vides, squelettes de chargement, pages d'erreur.

**Hors v1 (backlog)** : équipes et invitations (le schéma est déjà prêt), paiement en ligne (CinetPay, PayDunya, FedaPay, Wave API, avec webhook « payée »), relances automatiques programmées, avoirs, acomptes, multi-devises, dépenses, abonnement payant du SaaS (la page tarifs reste statique), SMS et WhatsApp Business API, PWA hors-ligne, anglais.

---

## 3. Règles métier (le cœur « argent »)

### 3.1 Montants et calculs : une seule spécification

- Tous les montants sont des **entiers en FCFA** (`bigint`, pas de centimes).
- Les quantités sont décimales (`numeric(12,3)`, par exemple 1,5 heure).
- Les taux sont `numeric(5,2)`.

```
line_subtotal  = round(quantity × unit_price)
subtotal       = Σ line_subtotal
discount_amount= percent ? round(subtotal × value / 100) : min(value, subtotal)
line_tax       = round(line_subtotal × (subtotal − discount_amount) × tax_rate / (subtotal × 100))
tax_total      = Σ line_tax                       (ventilé par taux pour l'affichage « TVA 18 % »)
total (TTC)    = subtotal − discount_amount + tax_total
balance_due    = total − amount_paid
round = arrondi half-up à l'unité ; si subtotal = 0, tout vaut 0
```

- Le calcul est implémenté **deux fois, volontairement** :
  - en TypeScript (`src/lib/calc/invoice-totals.ts`, avec big.js) pour l'aperçu en direct ;
  - en SQL (`numeric`, exact) dans les RPC d'écriture, qui sont **la source de vérité stockée**.
- Un **test de parité** fait passer les mêmes jeux d'essai dans les deux implémentations.
- Le serveur ne fait jamais confiance aux totaux envoyés par le client.

### 3.2 Numérotation

- Format `{PREFIXE}-{AAAA}-{NNNN}`, par exemple `FAC-2026-0001` et `DEV-2026-0001`.
- Séquence par organisation, par type et par année, dans la table `document_sequences`. Elle est incrémentée par `UPDATE … RETURNING` dans la même transaction que l'insertion (pas de doublon sous concurrence) et protégée par `unique(org_id, number)`.
- Le numéro est attribué à la création, ce qui correspond à la capture.
- Seuls les brouillons sont supprimables. Un document émis s'annule, il ne se supprime jamais.

### 3.3 Statuts et transitions

**Factures**. Valeurs stockées : `draft | sent | partial | paid | cancelled`. **« En retard » est calculé** et n'est jamais stocké, donc il n'y a pas de cron à faire tourner pour le mettre à jour :

```
effective_status = status IN (sent, partial) AND due_date < current_date ? 'overdue' : status
```

| De → Vers | Déclencheur | Condition |
|---|---|---|
| draft → sent | Envoi par email ou « Marquer comme envoyée » | Au moins une ligne |
| sent → partial ou paid | Paiement enregistré (trigger) | Somme des paiements ≤ total (sinon erreur) |
| paid ou partial → partial ou sent | Paiement supprimé (trigger) | |
| draft ou sent → cancelled | « Annuler » | Aucun paiement |
| Édition | | Autorisée si `draft`, ou `sent` sans paiement (journalisée). Verrouillée ensuite. |

- Au passage `draft → sent`, on fige des **instantanés** `client_snapshot` et `seller_snapshot` (jsonb). Modifier un client plus tard ne réécrit donc pas l'historique.
- Les éditions concurrentes sont détectées par verrou optimiste (`expected_updated_at`).

**Devis** : `draft | sent | accepted | declined | converted`. « Expiré » est calculé à partir de `valid_until`.

**Modèles récurrents** : `active | paused | ended`.

**Libellés et couleurs** : Brouillon (gris), Envoyée (bleu), Partiellement payée (ambre), Payée (vert), En retard (rouge), Annulée (gris barré). Le statut est toujours écrit en texte, jamais signalé par la seule couleur.

### 3.4 Définitions des KPI

Ces définitions sont documentées dans le code et rappelées en infobulle dans l'UI :

- **Nombre de factures** : factures émises sur la période, hors brouillons et annulées. Le détail par statut est affiché à côté.
- **Montant facturé** : somme des `total` des factures émises sur la période (date d'émission), hors brouillons et annulées.
- **Montant encaissé** : somme des `payments.amount` dont la date de paiement est dans la période (vision trésorerie).
- **Montant en attente** : somme des `balance_due` des factures `sent` et `partial` à date, en retard inclus. Ce KPI ne dépend pas de la période.
- **En retard** : la part du montant en attente dont l'échéance est dépassée, avec le nombre de factures concernées.

### 3.5 Spécificités du marché africain (Cameroun & CEMAC)

- **Fondateur & Gérant :** **Philippe NOUGOUE** (PNO Solutions Cameroun S.A.R.L - Douala & Yaoundé).
- **Contacts officiels :** Tel MTN (MoMo) : `+237 677481161` | Tel Orange (Orange Money) : `+237 691114908`.
- **Affichage monétaire :** `1 250 000 FCFA` (`Intl.NumberFormat('fr-FR')`). Dans le PDF, l'espace fine U+202F est remplacée par une espace insécable si la police ne la gère pas.
- **Devise et pays :** Franc CFA d'Afrique centrale XAF (CEMAC), toujours affiché « FCFA ». TVA légale camerounaise par défaut à **19,25 %** (calcul déterministe `big.js` half-up).
- **Montant en lettres** sur le PDF : « Arrêtée la présente facture à la somme de un million deux cent cinquante mille francs CFA ». Implémenté dans `number-to-words-fr.ts` et testé sur tous les cas piégeux (et un, quatre-vingts, cents, mille, millions, milliards).
- **Mentions légales OHADA :** RCCM (`RC/DLA/2024/B/1234`) et Numéro d'Identifiant Unique (`NIU M052112345678A`).
- **Moyens de paiement locaux :** MTN Mobile Money (`*126#` - `+237 677481161`), Orange Money (`*150#` - `+237 691114908`), Virement bancaire (Afriland First Bank, BICEC, UBA, SGC).
- **WhatsApp :** lien direct `wa.me/237677481161` avec un message prérempli (client, numéro, montant, lien public).
- **Téléphone :** format camerounais international (+237).
- **Fuseau horaire :** Afrique Centrale (WAT, GMT+1, Douala/Yaoundé).

---

## 4. Architecture

### 4.1 Arborescence (`src/`)

```
src/
  app/
    (marketing)/            page.tsx (landing /), tarifs/, mentions-legales/, confidentialite/, cgu/
    (auth)/                 connexion/, inscription/, mot-de-passe-oublie/, reinitialiser-mot-de-passe/
    auth/confirm/route.ts   (verifyOtp token_hash)   auth/callback/route.ts (échange PKCE)
    onboarding/             création de l'entreprise au premier login
    (app)/                  layout = Sidebar + Topbar (shell protégé)
      tableau-de-bord/
      factures/  [nouvelle | [id] | [id]/modifier]
      devis/     [nouveau  | [id] | [id]/modifier]
      recurrentes/ [nouvelle | [id]]
      clients/   [nouveau  | [id] | [id]/modifier]
      produits/  rapports/
      parametres/ [entreprise | facturation | compte]
    f/[token]/  d/[token]/  pages publiques (noindex)
    api/
      invoices/[id]/pdf/  quotes/[id]/pdf/            (authentifiés)
      public/invoices/[token]/pdf/  public/quotes/[token]/pdf/
      cron/recurring/                                   (protégé par CRON_SECRET)
    sitemap.ts robots.ts not-found.tsx error.tsx global-error.tsx
  proxy.ts                  rafraîchissement de session et redirections (Next 16)
  components/ ui/ (shadcn restylé) layout/ shared/ dashboard/ invoices/ quotes/ clients/ settings/ marketing/
  lib/
    calc/        invoice-totals.ts, number-to-words-fr.ts, recurrence.ts
    format/      money.ts, dates.ts, phone.ts
    domain/      types.ts, status.ts (statut effectif, transitions, libellés)
    validation/  client.ts, invoice.ts, quote.ts, payment.ts, settings.ts, recurring.ts (zod)
    data/        DAL : clients.ts, invoices.ts, quotes.ts, payments.ts, dashboard.ts, reports.ts, org.ts
    actions/     Server Actions par domaine
    supabase/    client.ts (navigateur), server.ts, proxy.ts, admin.ts ('server-only'), database.types.ts
    pdf/         document.tsx (facture et devis), fonts
    email/       templates/*.tsx, send.ts
    env.ts       variables d'environnement validées par zod (séparation serveur et public)
  content/fr.ts  libellés, messages, textes des emails
  mocks/         fixtures (Phase 2), réutilisées comme seed Supabase (Phase 3)
supabase/  migrations/*.sql  seed.sql  config.toml
tests/     unit/ (co-localisés possible)  integration/ (RLS, RPC)  e2e/ (Playwright)
scripts/   seed-dev.ts, cleanup-test-data.ts
docs/inspiration/  captures d'écran
```

### 4.2 Le pattern qui rend les phases interchangeables

Composants serveur → **DAL** (`lib/data/*`), qui renvoie des types du domaine. Formulaires → **Server Actions** (`lib/actions/*`) → DAL.

- **Phase 2** : le DAL lit et écrit un **store en mémoire côté serveur**, un singleton attaché à `globalThis` pour survivre au rechargement à chaud, initialisé depuis `src/mocks/fixtures.ts`.
- **Phase 3** : on remplace **uniquement l'intérieur** des fonctions du DAL par des appels Supabase. Les signatures, les pages et les composants restent identiques. C'est ce qui évite de réécrire l'app entre la Phase 2 et la Phase 3.

Toutes les actions suivent le même modèle :

```ts
'use server'
export async function saveInvoiceAction(input: unknown): Promise<ActionResult<{ id: string }>> {
  const ctx = await requireOrgContext()             // authentification et organisation (défense en profondeur)
  const parsed = invoiceInputSchema.safeParse(input) // zod
  if (!parsed.success) return fail(parsed.error)    // erreurs par champ, en français
  const res = await invoicesDal.save(ctx, parsed.data)
  revalidatePath('/factures'); return res
}
```

`requireOrgContext()` est mémoïsé par requête avec `React.cache()`. Il lit l'utilisateur via `supabase.auth.getClaims()` (JWT vérifié) et jamais via `getSession()` côté serveur, puis résout l'organisation active.

### 4.3 Sécurité en couches

1. **`proxy.ts`** : rafraîchit la session et redirige les visiteurs non connectés vers `/connexion?next=…`. C'est du confort, **pas la sécurité** (leçon de la CVE-2025-29927).
2. **DAL et actions** : `requireOrgContext()` dans chaque page, action et Route Handler, plus une validation zod de chaque entrée.
3. **RLS Postgres** sur toutes les tables. C'est la garantie finale, même si le code applicatif a un bug.
4. **Documents financiers** : lecture via RLS, mais **écriture uniquement via des RPC transactionnelles** qui portent les règles métier. Il n'y a aucune policy INSERT, UPDATE ou DELETE directe sur `invoices`, `invoice_items`, `quotes`, `quote_items` et `payments`, donc impossible de contourner les règles via l'API REST avec la clé publique.

---

## 5. Modèle de données Supabase

### 5.1 Tables

Toutes les tables ont `id uuid`, `created_at` et `updated_at` (mis à jour par trigger), ainsi qu'un `org_id` indexé.

| Table | Colonnes clés |
|---|---|
| `profiles` | `id` (= auth.users), `full_name`, `avatar_url`. Créée par trigger `on_auth_user_created`. |
| `organizations` | `name`, `email`, `phone`, `address`, `city`, `country` (ISO2), `currency` (XOF/XAF), `tax_id`, `rccm`, `logo_path`, `signature_path`, `default_tax_rate` (18), `invoice_prefix` (FAC), `quote_prefix` (DEV), `payment_terms_days` (30), `default_notes`, `default_terms`, `payment_instructions` (jsonb : banque, Orange Money, Wave…) |
| `organization_members` | PK(`org_id`, `user_id`), `role` (owner, admin, member). Une seule organisation par utilisateur en v1. |
| `clients` | `name`, `contact_name`, `email`, `phone`, `address`, `city`, `country`, `tax_id`, `notes`, `archived_at` |
| `products` | `name`, `description`, `unit`, `unit_price bigint`, `tax_rate`, `archived_at` |
| `document_sequences` | PK(`org_id`, `doc_type`, `year`), `last_value` |
| `invoices` | `client_id` (FK restrict), `number`, `status`, `issue_date`, `due_date` (≥ issue), `currency`, `subtotal`, `discount_type`, `discount_value`, `discount_amount`, `tax_total`, `total`, `amount_paid` (≤ total), `notes`, `terms`, `client_snapshot`, `seller_snapshot`, `public_token` (unique, 32 octets aléatoires), `sent_at`, `paid_at`, `cancelled_at`, `quote_id`, `recurring_id`, `recurring_period` (unique avec `recurring_id`, sert d'idempotence au cron) |
| `invoice_items` | `invoice_id`, `org_id`, `position`, `description`, `quantity` (> 0), `unit_price` (≥ 0), `tax_rate` (0 à 100), `line_subtotal`, `line_tax`, `product_id`. **FK composite (`invoice_id`, `org_id`) → `invoices(id, org_id)`** pour empêcher une ligne de pointer vers la facture d'une autre organisation. |
| `payments` | `invoice_id`, `amount` (> 0), `method` (enum), `paid_on`, `reference`, `note`, `created_by` |
| `quotes`, `quote_items` | Même structure que les factures, avec `valid_until` et `converted_invoice_id` |
| `recurring_invoices` | `client_id`, `frequency`, `interval_count`, `start_date`, `next_run_date`, `end_date`, `max_occurrences`, `occurrences_count`, `payment_terms_days`, `auto_send`, `status`, `items jsonb` (validé par zod et par CHECK), `discount_*`, `notes`, `terms` |
| `activity_log` | `entity_type`, `entity_id`, `action` (created, updated, sent, emailed, viewed, payment_recorded, status_changed, reminded, cancelled), `actor_id` (null pour le système ou un visiteur public), `metadata jsonb`. Ajout seulement : ni modification ni suppression. |

**Vues** (`with (security_invoker = true)` obligatoire, sinon la vue contourne la RLS) : `invoices_view` et `quotes_view` ajoutent `effective_status`, `balance_due` et le nom du client.

**Index** :
- `invoices` : (`org_id`, `issue_date desc`), (`org_id`, `status`), (`org_id`, `client_id`), et un index partiel (`org_id`, `due_date`) `where status in ('sent','partial')`.
- `payments` : (`org_id`, `paid_on`) et (`invoice_id`).
- `clients` : `pg_trgm` sur `name` et `email` pour la recherche.

### 5.2 RLS

La fonction d'aide `private.is_org_member(org uuid)` est `security definer`, `stable`, avec `search_path = ''`, et utilise `(select auth.uid())` pour les performances. Elle vit dans le schéma `private`, qui n'est pas exposé par l'API.

| Table | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| organizations | membre | RPC `create_organization` | owner ou admin | ✗ |
| organization_members | membre de la même organisation | RPC | ✗ | ✗ |
| profiles | soi et membres de la même organisation | trigger | soi | ✗ |
| clients, products, recurring_invoices | membre | membre | membre | membre (la FK restrict protège l'historique) |
| invoices, quotes, *_items, payments | membre | **RPC uniquement** | **RPC uniquement** | **RPC uniquement** |
| document_sequences | ✗ | ✗ | ✗ | ✗ (fonctions definer seulement) |
| activity_log | membre | membre (`actor_id = auth.uid()`) ou RPC | ✗ | ✗ |
| Rôle `anon` | Aucun accès aux tables. Seulement `get_public_invoice` et `get_public_quote`. | | | |

**Storage** : buckets `logos` et `signatures`, en lecture publique. Seuls les membres de l'organisation peuvent écrire, sous le chemin `{org_id}/…`. Fichiers **PNG ou JPEG uniquement** (react-pdf ne gère pas le WebP, et le SVG est refusé pour éviter le XSS), 1 Mo maximum. L'upload se fait directement depuis le navigateur vers Storage, ce qui contourne la limite de 1 Mo des Server Actions.

**Grants** : `revoke execute … from public, anon` sur toutes les fonctions (Postgres accorde EXECUTE à PUBLIC par défaut), puis un `grant` explicite à `authenticated`, ou à `service_role` pour le cron.

### 5.3 Fonctions RPC et triggers

Ce sont des fonctions plpgsql transactionnelles. Celles en écriture sont `security definer` et vérifient explicitement `is_org_member` ; leur `search_path` est vide.

- `create_organization(name, country)` : crée l'organisation et l'appartenance `owner`.
- `save_invoice(org, id?, payload jsonb, expected_updated_at?)` : crée ou met à jour la facture et remplace ses lignes. Elle attribue le numéro, recalcule les totaux en SQL, rafraîchit les instantanés tant que la facture est en brouillon et journalise l'opération.
- `set_invoice_status(id, 'sent' | 'cancelled')` : valide la transition et fige les instantanés.
- `duplicate_invoice(id)`.
- `record_payment(invoice, amount, method, paid_on, reference, note)` et `delete_payment(id)`. Le trigger `sync_invoice_payment_state` recalcule `amount_paid` et le statut, et refuse les trop-perçus.
- `save_quote`, `set_quote_status`, `convert_quote_to_invoice(quote_id)`.
- `get_public_invoice(token)` et `get_public_quote(token)` : définies pour `anon`, elles renvoient un JSON minimal. Elles renvoient null pour les brouillons et journalisent « consultée » au plus une fois par heure. `respond_public_quote(token, accept)` gère la réponse du client à un devis.
- `regenerate_public_token(type, id)`.
- `get_dashboard_stats(org, from, to)`, `get_monthly_revenue(org, months)` et `get_vat_report(org, from, to)` : `security invoker`, donc soumises à la RLS.
- `generate_recurring_invoice(template_id, run_date)` : réservée à `service_role`. Elle verrouille le modèle (`FOR UPDATE SKIP LOCKED`) et calcule la date suivante **depuis `start_date + n × intervalle`**, pour éviter la dérive 31 jan → 28 fév → 28 mar. Elle est idempotente grâce à `unique(recurring_id, recurring_period)`.

**Pourquoi des RPC ?** supabase-js n'offre pas de transactions. Une facture et ses lignes doivent être écrites atomiquement, et les règles qui touchent à l'argent doivent vivre au plus près des données.

---

## 6. Les phases

Chaque phase se termine par une **démo et une validation de ta part** avant la suivante.

### Phase 0 : Fondations (environ 0,5 jour)

1. Déplacer les 2 captures dans `docs/inspiration/`. create-next-app accepte un dossier `docs/` existant, mais refuse les autres fichiers présents.
2. Scaffolder avec `npx create-next-app@latest` dans un sous-dossier temporaire `pno-facture-pro`, puis remonter les fichiers à la racine. Le nom du dossier actuel contient des majuscules, ce que npm refuse comme nom de paquet.
3. Lancer `git init`, ajouter `.gitattributes` (`* text=auto eol=lf`, car on est sur Windows), `.gitignore`, `.env.example` et `.nvmrc` (Node 24, qui correspond au poste local et au défaut Vercel). Créer le dépôt GitHub.
4. Installer les dépendances. Exécuter `shadcn init`. Configurer Prettier, ESLint, Vitest et Playwright. Ajouter les scripts `dev`, `build`, `lint`, `typecheck`, `test`, `test:integration`, `test:e2e`, `db:types`, `db:push`, `seed:dev`.
5. Ajouter `src/lib/env.ts` (zod), `src/content/fr.ts` et les types du domaine (`lib/domain/types.ts`), alignés sur le schéma de la section 5.
6. Écrire le CI GitHub Actions : lint, typecheck, tests unitaires et build à chaque PR.

**Validé quand** : `npm run dev` affiche une page, et `lint`, `typecheck`, `test` et `build` passent en local comme en CI.

### Phase 1 : UI d'après les captures (environ 3 jours)

1. **Design system** extrait des captures : couleurs, rayons (12 à 16 px), ombres légères, typographie (Inter ou Geist via `next/font`), champs à label posé sur la bordure (comme sur la capture), segmented control, toggle, badges de statut, cartes, tableaux. Les tokens sont placés dans `@theme`, en clair et en sombre.
2. **Shell de l'app** :
   - Sidebar comme sur la capture : logo, recherche ⌘K, menu Tableau de bord, Factures, Devis, Récurrentes, Clients, Produits, Rapports ; en bas Aide, Paramètres, mode sombre et carte utilisateur.
   - Topbar avec fil d'Ariane.
   - Sur mobile, la sidebar devient un tiroir et une barre de navigation basse apparaît.
3. **Toutes les pages connectées** en version statique, alimentées par les fixtures : dashboard, listes, formulaires, détails, paramètres, pages publiques, ainsi qu'un composant `InvoicePreview` (HTML) qui imite le futur PDF.
4. États vides, `loading.tsx` (squelettes), `error.tsx` et `not-found.tsx`.

**Validé quand** : toutes les routes du §4.1 s'affichent, sont fidèles au style des captures, sont lisibles à 360 px de large et passent le contrôle de contraste AA.

### Phase 2 : Interactivité en données locales (environ 4 jours)

1. Store en mémoire, DAL et Server Actions (§4.2). Les fixtures sont réalistes : PME sénégalaises et ivoiriennes, montants en FCFA, tous les statuts représentés.
2. **Formulaire de facture** : `useFieldArray` (ajouter, supprimer et réordonner les lignes), autocomplétion depuis le catalogue, champ montant en entier avec séparateurs (`inputMode="numeric"` pour le clavier mobile), totaux et aperçu en direct, validation zod. Mêmes fonctionnalités pour les devis et les modèles récurrents.
3. **Actions** : changements de statut selon la machine à états du §3.3, dialogue de paiement, conversion d'un devis en facture, duplication, annulation, suppression de brouillon avec confirmation, toasts (Sonner).
4. Listes avec filtres, recherche et pagination dans l'URL (`searchParams` validés par zod). Recherche ⌘K (cmdk).
5. **PDF** fonctionnel dès cette phase sur les données locales : `@react-pdf/renderer`, `serverExternalPackages`, polices TTF locales, filigrane PAYÉE, BROUILLON ou ANNULÉE, montant en lettres.
6. Lien WhatsApp, CSV de la page Rapports, paramètres (aperçu du logo en local).
7. **Tests unitaires** : calculs (plus de 30 cas : arrondis, remises en % et en montant, taux mixtes, quantités décimales, très grands montants, sous-total nul), montant en lettres, formatage, statut effectif, récurrence (fin de mois, années bissextiles), schémas zod, constructeur de lien WhatsApp. **Tests de composants** : `LineItemsEditor` et `InvoiceForm`.

**Validé quand** : on peut faire le parcours complet sans base de données (créer un client, créer une facture, l'envoyer, enregistrer un paiement partiel puis le solde, voir le dashboard bouger), aucun lien n'est cassé, et les tests unitaires couvrent `lib/calc` à au moins 95 %.

### Phase 3 : Supabase, tests et intégrations serveur (environ 4 jours)

- **3.0 Projets** : tu crées `pno-dev` et `pno-prod` en région eu-west-3, avec les clés asymétriques JWT (« publishable » et « secret »). Ensuite : `npx supabase init`, `npx supabase link`.
- **3.1 Migrations** versionnées dans `supabase/migrations/`, appliquées à `pno-dev` avec `npx supabase db push` :
  1. extensions (pgcrypto, pg_trgm) et enums ;
  2. tables, contraintes et index ;
  3. schéma `private`, helpers et RLS ;
  4. RPC et triggers ;
  5. vues ;
  6. Storage et policies ;
  7. grants et revokes.
- **3.2** `npm run db:types` génère `database.types.ts`.
- **3.3 Auth technique minimale** (adaptation volontaire de l'ordre des phases : la RLS repose sur `auth.uid()`, donc il faut une session dès maintenant) :
  - clients Supabase SSR et `proxy.ts` de rafraîchissement de session ;
  - page `/connexion` basique ;
  - `npm run seed:dev`, qui crée un utilisateur de dev confirmé via l'API admin, son organisation, puis injecte **les fixtures de la Phase 2**.
  - L'expérience d'authentification complète arrive en Phase 4.
- **3.4** Remplacer l'intérieur du DAL : lectures via les vues et la RLS, écritures via les RPC. Messages d'erreur Postgres traduits en français par `mapDbError`.
- **3.5 Intégrations serveur** :
  - **Email** via Resend : facture ou devis avec PDF joint, bouton vers le lien public, `Reply-To` = email de l'entreprise, clé d'idempotence, statut `sent` et journalisation. Même mécanique pour les emails de relance.
  - **Anti-abus** : 50 emails par jour et par organisation, et compte avec email confirmé obligatoire.
  - **Cron** des factures récurrentes : `/api/cron/recurring`, contrôle `Authorization: Bearer CRON_SECRET`, client admin, rattrapage borné des échéances manquées, envoi automatique si activé.
  - **Pages publiques** `/f/[token]` et `/d/[token]` via les RPC `anon`.
  - **Upload du logo** vers Storage.
- **3.6 Tests d'intégration** (Vitest en environnement node contre `pno-dev`, utilisateurs éphémères créés puis supprimés) :
  - **Matrice d'isolation** : l'utilisateur A ne peut ni lire, ni modifier, ni supprimer les clients, factures, lignes, paiements, devis ou logos de l'utilisateur B. `anon` ne lit aucune table.
  - **Écritures directes** sur `invoices`, `items` et `payments` via REST : refusées.
  - **Lien public** : renvoie la facture du jeton et rien d'autre ; renvoie null pour un brouillon.
  - **Trop-perçu** refusé ; transitions de statut interdites refusées.
  - **20 créations simultanées** : numéros uniques et contigus.
  - **Parité des totaux** TS ↔ SQL sur les jeux d'essai.
  - **KPI** du dashboard justes sur un jeu de données connu.
  - **Cron** idempotent (deux exécutions produisent une seule facture).
- **3.7** Supabase Security Advisor et Performance Advisor sans alerte.

**Validé quand** : l'app tourne entièrement sur `pno-dev`, tous les tests d'intégration sont verts, et un vrai email avec PDF arrive (pendant le dev, avec l'adresse de test Resend ou ton propre email).

### Phase 4 : Authentification complète (environ 2 jours)

1. **Pages stylées** : inscription (nom, email, mot de passe d'au moins 8 caractères, acceptation des CGU), connexion, mot de passe oublié, réinitialisation, `/auth/confirm` (`verifyOtp` avec `token_hash`), `/auth/callback`, déconnexion.
2. **Emails Supabase en français** : confirmation et réinitialisation. Envoi via SMTP Resend, car le SMTP par défaut de Supabase est très limité. Configuration de la Site URL et des URLs de redirection (localhost, previews Vercel, prod).
3. **Onboarding** obligatoire si l'utilisateur n'a pas d'organisation : nom de l'entreprise, pays (qui détermine la devise XOF ou XAF et l'indicatif), identifiant fiscal, TVA par défaut. Appelle la RPC `create_organization`.
4. **`proxy.ts` final** :
   - routes publiques : `/`, `/tarifs`, pages légales, `/f/*`, `/d/*`, `/api/public/*`, `/api/cron/*`, pages d'auth ;
   - redirection des visiteurs non connectés vers `/connexion?next=` ;
   - redirection des utilisateurs connectés hors des pages d'auth ;
   - `next` validé, **chemins relatifs uniquement**, pour empêcher les redirections ouvertes.
5. **Compte** : changer de nom, d'email et de mot de passe.
6. **Tests** : E2E d'inscription et d'onboarding (utilisateur confirmé via l'API admin dans le setup Playwright), routes protégées, URL d'une facture d'un autre compte qui renvoie 404.

**Validé quand** : un nouvel utilisateur peut s'inscrire, confirmer son email, créer son entreprise et sa première facture, et rien n'est accessible sans session.

### Phase 5 : Landing page (environ 1,5 jour)

1. **Sections** d'après la capture « Invoicer » : header, hero avec capture produit, bénéfices (création automatique, statut en temps réel, relances, rapports TVA), « Comment ça marche » en 3 étapes, aperçu produit annoté, tarifs en FCFA, FAQ, CTA, footer.
2. **Tarifs** : affichage statique. Pas de facturation de l'abonnement en v1 ; les boutons mènent à l'inscription.
3. **Pas de faux témoignages ni de faux logos clients en production.** Ces sections restent masquées tant qu'on n'a pas de vrais contenus.
4. Pages CGU, confidentialité et mentions légales, avec des modèles **à faire valider** au regard du droit applicable (par exemple CDP au Sénégal, ARTCI en Côte d'Ivoire).
5. **SEO** : `metadata`, image OpenGraph, `sitemap.ts`, `robots.ts`, `lang="fr"`. Rendu statique, `next/image`, objectif Lighthouse mobile ≥ 90.

### Phase 6 : Passage de bout en bout, sécurité, déploiement (environ 2 jours)

1. **Sécurité** :
   - la clé `secret` Supabase n'apparaît que dans `admin.ts` (`import 'server-only'`) et n'est jamais préfixée `NEXT_PUBLIC_` ;
   - en-têtes HTTP : CSP, `frame-ancestors 'none'`, `Referrer-Policy`, `X-Content-Type-Options`, `Permissions-Policy` ;
   - protection CSRF native des Server Actions (vérification de l'origine) ;
   - Vercel Firewall : limitation de débit sur `/f/*`, `/d/*` et `/api/public/*` ;
   - `npm audit` et Dependabot ;
   - relecture de toutes les fonctions `security definer` ;
   - aucun `dangerouslySetInnerHTML` sur des contenus saisis par les utilisateurs ;
   - erreurs génériques côté client et détaillées dans les logs serveur.
2. **E2E Playwright** sur les parcours critiques, en desktop et en mobile (Pixel 7), avec contrôles d'accessibilité axe sur les pages principales.
3. **Déploiement Vercel** :
   - projet relié à GitHub ; région `cdg1` ; `vercel.ts` avec le cron quotidien à 06:00 UTC ;
   - variables d'environnement : Preview → `pno-dev`, Production → `pno-prod` (l'intégration Supabase du Vercel Marketplace peut synchroniser les variables) ;
   - `npx supabase db push` vers `pno-prod` ;
   - DNS du domaine pour Resend (SPF, DKIM, DMARC) ;
   - URLs d'auth de production ; Vercel Analytics et Speed Insights.
4. **Re-test en production** : smoke tests Playwright sur l'URL de prod avec un compte de test dédié, plus une vérification manuelle (email reçu, PDF, lien WhatsApp ouvert sur un vrai téléphone, cron déclenché manuellement).
5. **Sauvegardes** : vérifier la politique de backup Supabase (PITR sur le plan Pro) et documenter une procédure d'export.

---

## 7. Stratégie de tests

| Niveau | Outil | Ce qui est couvert | Quand |
|---|---|---|---|
| Unitaire | Vitest | Calculs, montant en lettres, formatage, statuts, récurrence, zod | Chaque commit et CI |
| Composant | Vitest et Testing Library | Éditeur de lignes, formulaire facture, dialogue de paiement | Chaque commit et CI |
| Intégration BDD | Vitest (node) contre `pno-dev` | RLS, RPC, triggers, concurrence, parité TS↔SQL, KPI, cron | Avant merge et nightly |
| E2E | Playwright et axe | Inscription → facture → envoi → paiement → dashboard ; devis → facture ; récurrence ; garde d'auth ; mobile | Sur preview Vercel et en prod (smoke) |

## 8. Variables d'environnement

```
NEXT_PUBLIC_SUPABASE_URL=            NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=                 # serveur uniquement : cron, scripts, tests
NEXT_PUBLIC_APP_URL=                 # liens publics, emails
RESEND_API_KEY=   EMAIL_FROM="PNO Facture Pro <factures@ton-domaine>"
CRON_SECRET=
SUPABASE_ACCESS_TOKEN=  SUPABASE_PROJECT_REF=   # CLI et CI
E2E_USER_EMAIL=  E2E_USER_PASSWORD=
```

## 9. Ce qu'il te faudra (comptes)

- GitHub.
- Supabase : 2 projets gratuits.
- Vercel.
- Resend.
- **Un nom de domaine**, indispensable pour envoyer des emails depuis ton domaine en production.

Tout est gratuit pour démarrer. Le plan Supabase Pro (sauvegardes PITR, pas de mise en pause du projet) est recommandé avant d'avoir de vrais clients.

## 10. Risques et pièges anticipés

| Risque | Parade |
|---|---|
| Vue qui contourne la RLS | `security_invoker = true` sur toutes les vues, et des tests |
| `EXECUTE` accordé à PUBLIC par défaut | Migration dédiée aux revokes et grants |
| Projet Supabase gratuit mis en pause après 7 jours sans activité | Activité du CI ou plan Pro pour la prod |
| Logo en WebP ou SVG que le PDF ne sait pas afficher | Upload limité au PNG et au JPEG |
| Espace fine U+202F absente de la police PDF | Normalisation dans le formateur PDF |
| Dérive des dates mensuelles (31 jan → 28 fév → 28 mar) | Date suivante calculée depuis `start_date + n × intervalle` |
| Double génération par le cron | Clé unique `(recurring_id, recurring_period)` et verrou `SKIP LOCKED` |
| Spam envoyé depuis notre domaine | Quota par organisation, email confirmé obligatoire, `Reply-To` = l'entrepreneur |
| Latence Vercel ↔ Supabase | Les deux à Paris (`cdg1` et eu-west-3) |
| Chemin Windows avec espaces | Chemins toujours entre guillemets dans les scripts ; vérifier Playwright et la CLI Supabase dès la Phase 0 |
| API Next 16 différentes de celles mémorisées | Lecture de `node_modules/next/dist/docs/` avant de coder |

## 11. Vérification finale de bout en bout

1. `npm run lint && npm run typecheck && npm test && npm run test:integration && npm run build` : tout passe.
2. `npm run test:e2e` sur la preview Vercel : tout passe, en desktop et en mobile.
3. **Manuel en production**, avec un nouveau compte :
   - inscription, confirmation de l'email, onboarding avec logo ;
   - client, facture de 3 lignes, totaux vérifiés à la main ;
   - envoi par email : email et PDF reçus, montant en lettres correct ;
   - lien public ouvert : « consultée » apparaît dans la timeline ;
   - paiement Wave partiel puis solde : statuts partielle puis payée ;
   - le dashboard reflète exactement les montants ;
   - devis accepté depuis la page publique puis converti en facture ;
   - modèle récurrent avec cron déclenché à la main : une seule facture générée ;
   - URL d'une facture d'un autre compte : 404 ;
   - session déconnectée : redirection vers la connexion.
4. Supabase Advisors sans alerte ; Lighthouse mobile ≥ 90 sur la landing.

---

## 12. Prochaine étape : les captures d'écran

J'ai déjà vu les deux images du dossier :
- l'**app** est bleu `#2563EB` sur blanc, avec des labels posés sur la bordure, un formulaire avec aperçu côte à côte et une sidebar claire ;
- la **landing** est violette, avec des titres en serif.

**Il faudra choisir une seule couleur de marque**, bleu ou violet. Les tokens rendent ce changement trivial.

Captures utiles à m'envoyer, si tu les as :
- dashboard (KPI et graphique) ;
- liste des factures ;
- détail d'une facture ;
- liste et fiche client ;
- paramètres ;
- pages connexion et inscription ;
- vues mobiles.

Tout écran sans capture sera dérivé du même langage visuel.
