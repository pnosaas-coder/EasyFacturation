# GEMINI.md — Documentation Maîtresse & Guide Projet EasyFacturation PRO

Ce document constitue la **référence absolue et exhaustive** pour le projet SaaS **EasyFacturation PRO**. Tout modèle d'IA intervenant sur ce dépôt doit impérativement lire et respecter l'intégralité des directives, architectures et conventions documentées ci-dessous.

---

## 1. Présentation & Contexte Métier

### 1.1 Mission du SaaS
**EasyFacturation PRO** est une application SaaS de facturation, de devis, de suivi de trésorerie et de gestion commerciale conçue sur mesure pour les entrepreneurs, consultants et PME du **Cameroun** et de la zone **CEMAC** (Afrique Centrale).

L'application répond aux réalités locales :
* Gestion financière stricte en **Francs CFA (XAF / FCFA)** sans centimes superflus.
* Conformité fiscale camerounaise : TVA légale par défaut de **19,25%** (Direction Générale des Impôts - DGI Cameroun).
* Règlements par paiements mobiles locaux prioritaires : **MTN Mobile Money** (`*126#`) et **Orange Money Cameroun** (`*150#`).
* Mentions légales conformes aux exigences OHADA : **NIU** (Numéro d'Identifiant Unique) et **RCCM** (Registre du Commerce et du Crédit Mobilier).
* Arrêté des factures en toutes lettres en français légal (*ex : "Arrêtée la présente facture à la somme de..."*).
* Relances de paiement et partage direct de factures via **WhatsApp**.

### 1.2 Entité Émettrice & Contacts Officiels (Immuables)
* **Nom de marque SaaS :** `EasyFacturation PRO`
* **Raison sociale émettrice :** `Prunus Engineering SARL` (ne jamais utiliser d'autre nom)
* **Gérant & Fondateur :** `Philippe NOUGOUE`
* **Contacts officiels :**
  * **Téléphone MTN (Mobile Money) :** `+237 677481161` (*126#)
  * **Téléphone Orange (Orange Money) :** `+237 691114908` (*150#)
  * **Email officiel :** `contact@prunus-engineering.cm`
  * **Adresses :** Siège à Douala (Akwa), permanence institutionnelle à Yaoundé (Bastos).
  * **Identifiants fiscaux par défaut :** NIU `M052112345678A` | RCCM `RC/DLA/2024/B/1234`.

---

## 2. Fonctionnalités Implémentées

### 2.1 Tableau de Bord Financier (`/`)
* **Bannière d'accueil interactive :** Message personnalisé pour Philippe NOUGOUE, alerte dynamique sur les factures en retard et boutons d'action rapide.
* **4 Cartes KPI Financières :**
  * *Chiffre d'affaires facturé* (cumul FCFA + taux de croissance).
  * *Total encaissé* (montant réel collecté sur le compte).
  * *Reste à recouvrer / En attente* (créances clients saines).
  * *Factures en retard* (nombre et montant total avec badge d'alerte rouge clignotant).
* **Ligne 1 d'Analyses & Graphiques (Côte à côte, Même Hauteur Calibrée) :**
  * **Alignement & Hauteur de Référence :** Les deux cartes (`RevenueChart` et `StatusDonutChart`) partagent la même hauteur uniforme (`h-full` avec `items-stretch`), calibrée directement sur la hauteur compacte de la répartition par statut. Le rythme vertical resserré fait remonter la table des factures récentes et le widget de relances plus haut dans l'écran (*above the fold*).
  * **Flux de facturation & encaissements (`RevenueChart`)** : Histogramme comparatif sur 6 mois (Mai à Octobre) avec barres compactes, sélecteur de focus mensuel, calcul du taux d'encaissement et estimation nette de la TVA légale à 19,25%.
  * **Répartition par statut (`StatusDonutChart`)** :
    * Graphique en anneau SVG pur React, **parfaitement recentré horizontalement et verticalement** dans sa carte.
    * Cœur interactif affichant le total émis en FCFA, le nombre de factures ou les détails du statut survolé.
    * Légende détaillée en grille sur 2 colonnes (*Payées*, *Partielles*, *Envoyées*, *En retard*, *Brouillons*) avec montants en FCFA, pourcentages et filtrage réactif au survol.
* **Ligne 2 Opérationnelle :**
  * **Table des Factures Récentes (`RecentInvoicesTable`)** : Tableau filtrable par statut, recherche textuelle instantanée, sélecteur de statut interactif (`StatusDropdown`), modal de suppression et pagination.
  * **Widget de Relance Rapide WhatsApp (`QuickRelanceWidget`)** : Détection des factures impayées échues, décompte des jours de retard et génération automatique de messages de relance personnalisés avec lien direct `https://wa.me/?text=...`.

### 2.2 Gestion des Factures (`/factures`)
* **Cycle de vie complet :** `draft` (Brouillon) $\rightarrow$ `sent` (Envoyée) $\rightarrow$ `partial` (Partielle) $\rightarrow$ `paid` (Payée) $\rightarrow$ `overdue` (En retard) $\rightarrow$ `cancelled` (Annulée).
* **Menu Déroulant de Statut Interactif (`StatusDropdown`) :** Changement direct de statut depuis les lignes du tableau sans rechargement de page.
* **Création & Édition de factures (`/factures/nouvelle`) :**
  * Lignes d'articles dynamiques avec prix unitaires en FCFA, quantités, taux de TVA (0%, 10%, 19.25%).
  * Remise commerciale globale (en % ou en montant fixe FCFA).
  * Calculs rigoureux via `big.js` (arrondi déterministe `roundHalfUp`).
  * Modal d'enregistrement des règlements partiels avec sélection du mode (MTN MoMo, Orange Money, Virement, Cash) et calcul du reste dû.
* **Aperçu & Impression PDF (`InvoicePreview`) :**
  * Mise en page A4 élégante optimisée pour l'impression physique et le téléchargement PDF.
  * Arrêté automatique du montant en toutes lettres en français (`numberToWordsFr`).
  * Bloc signature officielle : *« Pour Prunus Engineering SARL : Philippe NOUGOUE »*.
* **Duplication en 1 clic :** Duplique n'importe quelle facture en nouveau brouillon avec incrémentation séquentielle du numéro (`FAC-2026-XXXX`).
* **Suppression sécurisée :** Confirmation obligatoire via `DeleteConfirmationModal` avec réajustement automatique des balances clients.

### 2.3 Devis & Conversion en Facture (`/devis`)
* Création de propositions commerciales avec date de validité.
* Suivi des statuts : `draft`, `sent`, `accepted`, `declined`, `converted`, `expired`.
* **Conversion en 1 clic :** Un devis accepté se transforme instantanément en facture officielle numérotée avec traçabilité complète (`quoteId` $\leftrightarrow$ `convertedInvoiceId`).
* Sélecteur de statut interactif et suppression sécurisée.

### 2.4 Fichier Clients (`/clients`)
* Portefeuille de clients camerounais (Douala, Yaoundé, Bafoussam, Garoua...).
* Suivi pour chaque client : coordonnées, ville, téléphone, NIU/RCCM, CA cumulé facturé, total réglé et encours dû.
* Actions rapides : contact direct WhatsApp pré-rempli, consultation et suppression.
* Pagination dynamique (6, 12, 24 cartes par page).

### 2.5 Catalogue Produits & Services (`/produits`)
* Gestion des prestations et articles (Développement logiciel, audit cloud, maintenance, etc.).
* Définition des tarifs unitaires en FCFA et du taux de TVA par défaut.
* Ajout, modification et suppression sécurisée avec dialogue modal.

### 2.6 Factures Récurrentes (`/recurrentes`)
* Gestion des abonnements et contrats d'infogérance (fréquence mensuelle, trimestrielle, annuelle).
* Génération programmée des factures périodiques.

### 2.7 Rapports Financiers & Déclaration TVA (`/rapports`)
* Synthèse périodique : CA Total HT, TVA collectée à 19,25% (assiette fiscale camerounaise), et CA TTC.
* Historique des encaissements par méthode (MTN MoMo, Orange Money, Virement bancaire, Espèces).

### 2.8 Navigation, Recherche Rapide & Palette de Commande
* **Barre de recherche interactive :** Effet glow, raccourci clavier `⌘K` / `Ctrl+K`.
* **Palette de Commande (`CommandPalette`) :** Recherche floue instantanée dans les factures, devis, clients et navigation en 1 frappe.
* **Fil d'ariane (Breadcrumb) & Topbar :** Accès direct aux actions de création.

### 2.9 Mode Sombre & Clair Hybride (`ThemeProvider`)
* Sélecteur segmenté moderne dans la barre latérale :
  * Bouton **`[ ☀️ Mode clair ]`** (active instantanément le thème clair).
  * Bouton **`[ 🌙 Mode sombre ]`** (active instantanément le thème sombre).
* Bouton d'appoint dans la Topbar.
* Synchronisation totale sur `document.documentElement`, `document.body`, l'attribut `data-theme` et `localStorage` (`pno_theme`).

### 2.10 Dynamisme Temps Réel & Interconnexion Totale des Modules
* **Propagation Immédiate des Changements de Statut :**
  * Dès qu'une facture passe au statut `paid` (ex: `FAC-2026-0049` de `sent` à `paid`), le solde restant dû est soldé (`balanceDue = 0`, `amountPaid = total`), un enregistrement de règlement est créé dans `store.payments`, et les métriques du client sont instantanément recalculées via `recalculateClientCounters(clientId)`.
  * Réciproquement, le retour à `sent` ou `overdue` annule le règlement automatique et rétablit les créances.
* **Réactivité Instantanée du Tableau de Bord sans Rechargement :**
  * Calculs mémorisés réactifs (`computeDashboardKPIs`, `computeMonthlyRevenue`) : les 4 cartes KPI (*CA Facturé*, *Total Encaissé*, *Solde Restant Dû*, *Factures en Retard*), le graphique `RevenueChart`, l'anneau `StatusDonutChart` et le widget WhatsApp `QuickRelanceWidget` se mettent à jour instantanément dès qu'une action est effectuée dans le tableau.
* **Synchronisation Multi-Onglets (`/factures`, `/clients`, `/rapports`) :**
  * Revalidation automatique Next.js (`revalidatePath` pour `/`, `/factures`, `/clients`, `/rapports`, `/devis`) combinée à `router.refresh()` et synchronisation des `props` via `useEffect` pour assurer des données fraîches et vivantes sur l'ensemble de l'application.

### 2.11 Architecture Full-Stack Supabase (Cloud & Persistance Réelle)
* **Intégration MCP Supabase Opérationnelle :**
  * Connexion native via protocole stdio `@supabase/mcp-server-supabase` et Token d'Accès Personnel (PAT).
  * Outils d'infrastructure actifs : migrations déclaratives (`apply_migration`), génération de types TypeScript synchronisée (`generate_typescript_types`), et inspections SQL en direct (`execute_sql`, `list_tables`).
* **Schéma Relationnel Cloud (9 Tables PostgreSQL) :**
  * `organization_settings` : Identité légale unique (Prunus Engineering SARL, gérant Philippe NOUGOUE, NIU, RCCM, téléphones MoMo/OM, RIB bancaire).
  * `clients` : Répertoire d'entreprises camerounaises avec balances financières calculées en temps réel (`total_billed`, `total_paid`, `balance_due`).
  * `products` : Prestations & services avec prix unitaire HT en FCFA et taux de TVA par défaut (19,25%).
  * `quotes` & `quote_items` : Devis et articles rattachés avec statut d'acceptation et liaison vers facture convertie (`converted_invoice_id`).
  * `invoices` & `invoice_items` : Factures officielles séquentielles (`FAC-2026-XXXX`) avec lignes d'articles, TVA DGI 19.25%, remises et calcul des soldes.
  * `payments` : Règlements d'acomptes ou soldes (MTN MoMo, Orange Money, Virement, Espèces) avec traçabilité de date et référence.
  * `recurring_invoices` : Modèles de facturation périodique (abonnements & infogérance).
* **Sécurité & Intégrité des Données :**
  * Row Level Security (**RLS**) activé sur l'intégralité des 9 tables.
  * Contraintes d'intégrité référentielle avec suppression en cascade (`ON DELETE CASCADE`) pour les lignes de devis et factures.
* **DAL Hybride Haute Disponibilité (Priorité Cloud + Résilience Mémoire) :**
  * Toute requête du DAL interroge en priorité Supabase Cloud.
  * En cas d'indisponibilité réseau ou dans l'environnement de test runner unitaire (Vitest ultra-rapide 400ms), le DAL bascule gracieusement sur le store singleton en mémoire avec synchronisation bidirectionnelle.
* **Script de Seeding Automatisé :**
  * `scripts/seed-supabase.mjs` permet de peupler ou réinitialiser instantanément la base Supabase avec les données canoniques de Prunus Engineering SARL.

### 2.12 Authentification Sécurisée Supabase & Protection des Pages (`/login`)
* **Page de Connexion / Inscription Dédiée (`/login`) :**
  * Design SaaS moderne : conteneur glassmorphism, dégradés d'arrière-plan, mode clair et sombre avec sélecteur de thème dédié.
  * Commutateur d'onglets instantané entre *« Se connecter »* et *« Créer un compte »*.
  * Raccourci 1-clic *« Connexion Fondateur »* pré-remplissant automatiquement le compte de Philippe NOUGOUE (`contact@prunus-engineering.cm`).
  * Champ mot de passe interactif avec icônes de masquage/affichage (œil), alertes d'erreurs en bandeau et notifications riches Sonner.
* **Protection par Middleware Universel (`src/middleware.ts`) :**
  * Interception globale de toutes les routes de l'application (`/`, `/factures/*`, `/devis/*`, `/clients/*`, `/produits/*`, `/recurrentes/*`, `/rapports/*`, `/parametres/*`).
  * Redirection automatique des requêtes non authentifiées vers `/login?redirectTo=...`.
  * Redirection automatique des utilisateurs déjà connectés accédant à `/login` vers la page d'accueil (`/`).
* **Gestion des Sessions, Déconnexion & Middleware (`@supabase/ssr`) :**
  * Gestion déclarative des cookies de session chiffrés pour les Server Components et Server Actions.
  * Bouton de déconnexion ergonomique avec icône `LogOut` intégré directement à la carte profil du gérant dans la barre latérale (`Sidebar`).
* **Règle vitale Middleware / Server Actions :** Dans Next.js App Router (Turbopack), le middleware ne doit JAMAIS intercepter ou rediriger les requêtes de Server Actions (`request.headers.has("next-action")` ou méthode `POST`). Une redirection HTTP (307) sur une action renvoie un code inattendu au client RSC causant l'erreur `An unexpected response was received from the server`. Les redirections HTTP GET préservent et transfèrent tous les cookies rafraîchis par Supabase sur `redirectResponse.cookies`.

### 2.13 Skeletons Loaders & Expérience Utilisateur Zéro-Attente
* **Animation Shimmer Haute Précision :**
  * Implémentation d'une animation `@keyframes shimmer` et classe `.animate-shimmer` dans `globals.css` avec balayage lumineux fluide clair/sombre.
  * Composants modulaires dans `src/components/shared/Skeleton.tsx` : `Skeleton`, `SkeletonText`, `SkeletonCircle`, `SkeletonBadge`, `SkeletonStatCard`, `SkeletonTable`.
* **Streaming Suspense Next.js App Router (`loading.tsx`) :**
  * `src/app/loading.tsx` : Skeleton miroir du Tableau de bord (bannière, 4 cartes KPI, histogramme, donut, table et widget relance).
  * `src/app/factures/loading.tsx` : Skeleton de la liste des factures (résumé financier, barre de filtres, table 8 lignes).
  * `src/app/clients/loading.tsx` : Grille skeleton de 6 fiches clients complètes avec avatars et métriques.
  * `src/app/devis/loading.tsx` : Skeleton des propositions commerciales et conversion.
  * `src/app/produits/loading.tsx` : Skeleton du catalogue prestations et tarifs FCFA.
  * `src/app/recurrentes/loading.tsx` : Skeleton des abonnements périodiques.
  * `src/app/rapports/loading.tsx` : Skeleton des déclarations de TVA et encaissements.
  * `src/app/parametres/loading.tsx` : Skeleton des coordonnées légales NIU/RCCM et banques.
* **Mise à Jour Instantanée Zéro-F5 (Zéro Actualisation Forcée) :**
  * Tous les composants clients (`ClientsListClient`, `QuotesListClient`, `ProductsListClient`, `InvoicesListClient`, `DashboardClient`) mettent à jour leur état local immédiatement dès confirmation de l'action serveur, combiné à un rafraîchissement d'arrière-plan `router.refresh()`. L'utilisateur voit instantanément le changement sans jamais avoir à forcer l'actualisation de la page.

### 2.14 Landing Page Haute Performance, Mobile-First & Point d'Entrée SaaS (`/`)
* **Nouvelle Architecture de Routage :**
  * La route racine **`/`** devient la **Landing Page publique** de présentation et de conversion, ouverte à tous les visiteurs et indexable par les moteurs de recherche (SEO).
  * L'espace applicatif du Tableau de bord bascule sur **`/dashboard`** (Server Component avec streaming Suspense et skeleton complet dans `/dashboard/loading.tsx`).
  * Les utilisateurs non connectés naviguent librement sur `/`, et sont redirigés vers `/login` uniquement lorsqu'ils tentent d'accéder à `/dashboard` ou à un module métier (`/factures`, `/devis`, `/clients`, etc.).
  * La connexion (`LoginClient`) redirige automatiquement et proprement vers `/dashboard`.
* **Composants Modulaires & Réutilisables (`src/components/landing/`) :**
  * `LandingHeader` : Barre de navigation sticky en verre dépoli (`landing-glass-nav`) avec détection de défilement, logo animé, liens d'ancrage, bouton connexion et menu tiroir mobile responsive (*hamburger drawer*) avec fermeture tactile.
  * `LandingHero` : En-tête percutant avec pilule d'annonce animée, titre typographique avec accent SVG courbé, double bouton CTA et aperçu complet.
  * `HeroDashboardPreview` : Maquette interactive du tableau de bord sombre de Prunus Engineering SARL avec les 4 KPI FCFA réels, histogramme comparatif 6 mois, calcul de TVA 19,25% DGI et **badges micro-animés flottants** (`@keyframes landingFloatSlow` et `landingFloatReverse`) pour les paiements MoMo (+250 000 FCFA) et relances WhatsApp en 1 clic.
  * `LandingLogoCloud` : Bandeau de réassurance à défilement permanent continu (*infinite marquee ticker* avec masque estompé aux bords et pause au survol) affichant les entreprises partenaires africaines de confiance (Kemet Studio, Baobab Tech, Sahel Consulting, Teranga Media, Palm Capital, Akwa Ventures, Bastos Solutions, Equatorial Corp).
  * `LandingProblems` : 3 cartes de constats et points de douleur (Factures artisanales décrédibilisantes, casse-tête fiscal TVA, et stagnation des impayés).
  * `LandingFeatures` : 4 cartes fonctionnalités majeures avec badges de réassurance (Factures PDF OHADA, TVA 19,25% / 18%, Relances WhatsApp, Répertoire clients & Devis convertibles en 1 clic).
  * `LandingHowItWorks` : 3 étapes simples sur fond sombre (#0B111E) avec lueur d'ambiance bleue et teal (Inscription 30s, Création en FCFA, Envoi & Encaissement).
  * `LandingTestimonials` : 3 avis authentiques de dirigeants de Douala (🇨🇲), Dakar (🇸🇳) et Abidjan (🇨🇮) avec notation 5 étoiles dorées.
  * `LandingPricing` : Grille tarifaire claire en **Francs CFA** (Gratuit 0 FCFA, Plan Pro vedette 5 000 FCFA/mois avec mise en avant lumineuse et badge Recommandé, Business 15 000 FCFA/mois).
  * `LandingCtaBanner` : Bannière de conversion finale en dégradé bleu royal et nuit avec déclencheur direct d'inscription.
  * `LandingFooter` : Pied de page structuré avec mentions OHADA, coordonnées officielles Prunus Engineering SARL (`contact@prunus-engineering.cm`), support WhatsApp et couverture régionale CEMAC & UEMOA.
* **Feuille de Style Dédiée & Micro-Animations (`src/components/landing/landing.css`) :**
  * Zéro style inline : tous les effets, transitions et animations sont centralisés dans `landing.css`.
  * Animation interactive du bouton CTA principal (`.landing-btn-cta-primary`) : balayage lumineux continu (*shimmer beam*), élévation et halo de lueur au survol (*hover*), et compression élastique dynamique au clic (*active/click spring squeeze*).
  * Conception Mobile-First : typographie fluide, adaptation automatique sur smartphone, tablette et écran large.

---

## 3. Structure des Fichiers & Architecture

```
PNO-Facture-Pro/
├── .agents/
│   ├── mcp_config.json                      # Configuration MCP Supabase stdio
│   └── rules/
│       └── pno-facture-pro-standards.md     # Règles métier et UI obligatoires
├── docs/
│   └── PLAN.md                              # Plan d'implémentation global
├── scripts/
│   └── seed-supabase.mjs                    # Script de peuplement canonique de la base Supabase
├── tests/
│   └── unit/
│       ├── calc.test.ts                     # Tests calculs financiers FCFA & TVA
│       ├── number-to-words.test.ts          # Tests conversion montant en lettres
│       ├── products.test.ts                 # Tests gestion catalogue produits
│       ├── reports.test.ts                  # Tests génération rapports financiers
│       ├── search.test.ts                   # Tests recherche palette de commande
│       ├── reactivity.test.ts               # Tests dynamisme temps réel inter-modules
│       ├── store-dal.test.ts                # Tests DAL en mémoire (CRUD, suppression, conversion)
│       └── supabase-dal.test.ts             # Tests DAL Supabase et adapters bidirectionnels
├── src/
│   ├── app/                                 # Next.js App Router (Pages & Routes)
│   │   ├── layout.tsx                       # Layout racine (HTML, polices, ThemeProvider, Toaster)
│   │   ├── globals.css                      # Tailwind v4, variables CSS clair/sombre, styles d'impression
│   │   ├── page.tsx                         # Landing Page publique d'entrée du SaaS
│   │   ├── dashboard/
│   │   │   ├── page.tsx                     # Tableau de bord SaaS (Server Component protégé)
│   │   │   └── loading.tsx                  # Skeleton streaming du tableau de bord
│   │   ├── DashboardClient.tsx              # Composant Client Dashboard (KPIs, Charts, Table)
│   │   ├── factures/
│   │   │   ├── page.tsx                     # Liste des factures (Server Component)
│   │   │   ├── InvoicesListClient.tsx       # Listing client des factures avec filtres & pagination
│   │   │   ├── nouvelle/page.tsx            # Formulaire de création de facture
│   │   │   └── [id]/page.tsx                # Consultation, aperçu A4, impression, paiement
│   │   ├── devis/
│   │   │   ├── page.tsx                     # Liste des devis
│   │   │   ├── QuotesListClient.tsx         # Listing client des devis
│   │   │   ├── nouveau/page.tsx             # Création de devis
│   │   │   └── [id]/page.tsx                # Consultation de devis & conversion 1-clic
│   │   ├── clients/
│   │   │   ├── page.tsx                     # Répertoire clients
│   │   │   └── ClientsListClient.tsx        # Grille clients avec recherche, pagination, suppression
│   │   ├── produits/
│   │   │   ├── page.tsx                     # Catalogue des prestations
│   │   │   └── ProductsListClient.tsx       # Gestion catalogue produits/services
│   │   ├── recurrentes/
│   │   │   ├── page.tsx                     # Factures récurrentes
│   │   │   └── RecurringClient.tsx          # Gestion des abonnements récurrents
│   │   ├── rapports/
│   │   │   ├── page.tsx                     # Rapports fiscaux & TVA
│   │   │   └── ReportsClient.tsx            # Tableaux récapitulatifs TVA 19.25%
│   │   ├── aide/
│   │   │   └── HelpClient.tsx               # Centre d'aide et support Prunus Engineering
│   │   └── parametres/
│   │       └── page.tsx                     # Configuration entreprise et coordonnées bancaires
│   ├── components/                          # Composants UI React
│   │   ├── dashboard/
│   │   │   ├── StatCards.tsx                # 4 cartes KPI du tableau de bord
│   │   │   ├── RevenueChart.tsx             # Histogramme 6 mois flux facturé/encaissé
│   │   │   ├── StatusDonutChart.tsx         # Anneau SVG centré de répartition par statut
│   │   │   ├── RecentInvoicesTable.tsx      # Table des factures récentes avec actions
│   │   │   └── QuickRelanceWidget.tsx       # Panneau de relances rapides WhatsApp
│   │   ├── invoices/
│   │   │   ├── InvoiceForm.tsx              # Formulaire de saisie dynamique des lignes
│   │   │   ├── InvoicePreview.tsx           # Modèle A4 imprimable avec signature officielle
│   │   │   └── PaymentModal.tsx             # Modal d'enregistrement d'acompte/solde
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx                  # Barre latérale (navigation, sélecteur de thème, profil)
│   │   │   └── Topbar.tsx                   # Barre supérieure (breadcrumb, ⌘K, bascule thème)
│   │   └── shared/
│   │       ├── StatusDropdown.tsx           # Sélecteur de statut interactif sur table
│   │       ├── DeleteConfirmationModal.tsx  # Boîte de dialogue accessible de confirmation
│   │       ├── Pagination.tsx               # Composant universel de pagination avec sélecteur de taille
│   │       ├── ThemeProvider.tsx            # Contexte React de gestion de thème clair/sombre
│   │       ├── CommandPalette.tsx           # Fenêtre modale de recherche globale ⌘K
│   │       └── StatusBadge.tsx              # Badge de statut coloré avec icône
│   ├── lib/                                 # Logique métier, données et utilitaires
│   │   ├── actions/                         # Next.js Server Actions (invoices, quotes, clients, settings)
│   │   ├── calc/                            # Calculs financiers déterministes (TVA, remises, soldes)
│   │   ├── supabase/                        # Architecture Supabase Full-Stack
│   │   │   ├── database.types.ts            # Types TypeScript synchronisés avec PostgreSQL Supabase
│   │   │   ├── client.ts                    # Clients Supabase (Server, Browser, Service Role)
│   │   │   └── adapters.ts                  # Mappings bidirectionnels Tables Relationnelles <-> Entités
│   │   ├── data/                            # DAL Hybride (Supabase Cloud + Fallback Mémoire)
│   │   │   ├── store.ts                     # Store singleton en mémoire et seed complet
│   │   │   ├── invoices.ts                  # Opérations CRUD et requêtes factures
│   │   │   ├── quotes.ts                    # Opérations CRUD devis et conversion
│   │   │   ├── clients.ts                   # Opérations CRUD clients
│   │   │   ├── products.ts                  # Opérations CRUD catalogue
│   │   │   ├── payments.ts                  # Enregistrement des paiements partiels/totaux
│   │   │   ├── reports.ts                   # Rapports de TVA et d'encaissements
│   │   │   ├── settings.ts                  # Configuration société Prunus Engineering
│   │   │   └── dashboard.ts                 # Calcul des KPIs et statistiques mensuelles
│   │   ├── domain/                          # Types TypeScript stricts
│   │   ├── format/                          # Formatage monétaire (formatFCFA) et dates
│   │   ├── validation/                      # Schémas de validation Zod
│   │   └── utils.ts                         # Helper clsx/tailwind-merge (`cn`)
│   ├── content/
│   │   └── fr.ts                            # Dictionnaire textuel français & terminologie
│   └── mocks/
│       └── fixtures.ts                      # Jeux de données initiaux de démonstration
├── GEMINI.md                                # CE DOCUMENT : Instructions Maîtresses IA
├── package.json                             # Dépendances et scripts de build
├── tsconfig.json                            # Configuration TypeScript strict
├── next.config.ts                           # Configuration Next.js et Turbopack
└── vitest.config.ts                         # Configuration des tests unitaires
```

---

## 4. Stack Technique & Dépendances

| Outil / Bibliothèque | Version | Rôle & Justification |
| :--- | :--- | :--- |
| **Next.js** | `16.4.0` | Framework React avec App Router, Server Actions et Turbopack. |
| **React** | `19.3.0` | Bibliothèque UI native avec Server Components et Hooks modernes. |
| **Supabase Database** | `PostgreSQL Cloud` | Base de données relationnelle cloud managée avec 9 tables et RLS. |
| **@supabase/supabase-js** | `^2.49.1` | Client SDK officiel pour requêtes SQL typées et persistance cloud. |
| **@supabase/mcp-server-supabase** | `stdio` | Serveur MCP officiel pour introspection, migrations et exécution SQL. |
| **Tailwind CSS** | `4.3.3` | Moteur CSS moderne avec `@import "tailwindcss";` et `@custom-variant dark`. |
| **TypeScript** | `^5.0` | Typage statique strict (zéro `any` dans le domaine métier). |
| **Big.js** | `^7.0.1` | Arithmétique décimale sans perte pour les montants financiers FCFA et taux TVA. |
| **Lucide React** | `^1.52.0` | Pack d'icônes vectorielles cohérentes et légères. |
| **Sonner** | `^2.0.8` | Système de notifications toast riches et accessibles. |
| **Zod** | `^4.6.5` | Validation déclarative des formulaires et schémas de données. |
| **Vitest** | `^5.0.3` | Runner de tests unitaires ultra-rapide (45/45 tests automatisés). |

---

## 5. Décisions de Design & Standards Visuels (Aesthetics)

1. **Esthétique SaaS Haute Qualité (Inspirée de Dribbble / Stripe / Linear) :**
   * Fond général clair : `bg-slate-50` avec cartes en blanc pur `bg-white` bordées de `border-slate-200/80` et ombres subtiles `shadow-xs`.
   * Fond sombre : `dark:bg-slate-950` avec cartes en `dark:bg-slate-900` bordées de `dark:border-slate-800`.
   * Couleur primaire : Dégradés bleu roi (`from-blue-600 to-blue-700` et `from-blue-700 to-indigo-700`).
2. **Micro-interactions Dynamiques Obligatoires :**
   * Tout bouton primaire ou secondaire doit posséder un effet de survol réactif :  
     `transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-95`.
   * Toute barre de recherche doit réagir au survol avec changement de bordure et grossissement de l'icône loupe :  
     `group/search transition-all duration-300 hover:border-blue-400 group-hover/search:scale-110`.
3. **Graphique Donut en SVG Pur React (Sans Dépendance Externe) :**
   * Réalisé sans librairies lourdes (Chart.js ou Recharts) pour garantir une compatibilité parfaite avec React 19 et Next.js 16.
   * Utilise `stroke-dasharray` et `stroke-dashoffset` avec transitions CSS fluides.
   * **Doit toujours rester centré horizontalement et verticalement** dans sa carte.
4. **Zéro `window.confirm` :**
   * Toute suppression requiert l'ouverture du composant accessible `DeleteConfirmationModal` avec touche `Échap`, backdrop flouté et libellé explicite de l'élément visé.
5. **Impression & PDF Dédiés (`@media print`) :**
   * Masquage automatique des sidebars, boutons d'action et toasters.
   * Affichage plein format A4 portrait en noir/gris haute lisibilité.

---

## 6. Instructions Impératives pour Tout Futur Modèle d'IA

Lorsque vous travaillez sur ce projet, vous devez **TOUJOURS** appliquer sans déroger les règles suivantes :

### Règle 1 : Préservation de l'Identité d'Entreprise
* La société émettrice est **uniquement et toujours** : **`Prunus Engineering SARL`**.
* Le gérant fondateur est **`Philippe NOUGOUE`**.
* Le nom public de la solution est **`EasyFacturation PRO`**.
* Ne jamais réintroduire d'anciennes appellations comme *PNO Solutions* ou *PNO Solutions Cameroun*.

### Règle 2 : Intégrité Monétaire & TVA
* Toutes les valeurs monétaires sont en **FCFA (XAF)** sous forme d'entiers déterministes.
* Utiliser systématiquement `formatFCFA(montant)` qui produit un formatage standard : `X XXX XXX FCFA` avec espace insécable.
* Le taux de TVA par défaut pour le Cameroun est de **`19,25%`** (ou `0%` si exonéré).
* Tout calcul de sous-total, taxe, remise ou reste dû doit passer par les fonctions de `src/lib/calc/money.ts` ou la librairie `big.js`.

### Règle 3 : Cohérence des Statuts & Réactivité Multi-Modules
* Tout changement de statut vers `paid` génère automatiquement le règlement, solde la facture et actualise la balance client.
* Lors de la suppression d'une facture active (`deleteInvoice`), les compteurs du client (`totalBilled`, `totalPaid`, `balanceDue`) doivent être automatiquement recalculés de manière déterministe (`recalculateClientCounters`).
* Les devis convertis conservent leur statut `converted` avec traçabilité vers `convertedInvoiceId`.

### Règle 4 : Persistance Full-Stack Supabase & RLS
* Toute nouvelle entité ou mutation doit passer par le DAL qui synchronise Supabase Cloud en priorité.
* Préserver l'adaptabilité bidirectionnelle des adaptateurs (`src/lib/supabase/adapters.ts`) reliant les colonnes PostgreSQL en `snake_case` aux types de domaine TypeScript en `camelCase`.
* Respecter la politique RLS et ne jamais exposer la `SUPABASE_SERVICE_ROLE_KEY` côté client ou dans les composants navigateur.

### Règle 5 : Qualité du Code & Validation Avant Livraison
* Toujours exécuter `npx tsc --noEmit` après vos modifications pour vérifier qu'aucune erreur de typage TypeScript n'a été introduite.
* Toujours exécuter `npm test` pour s'assurer que l'intégralité de la suite de tests unitaires (50 tests) continue de passer au vert.
* Respecter la convention Tailwind v4 : ne pas créer de `tailwind.config.js` obsolète.

---
*Dernière mise à jour : Authentification Supabase, protection middleware & persistance Full-Stack validées (50 tests au vert).*
