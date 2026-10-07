# Règles Métier & Design Standards : PNO Facture Pro

Ce document fixe les conventions strictes et obligatoires à appliquer sur toutes les pages et composants du SaaS PNO Facture Pro.

---

## 1. Contexte Territorial & Entreprise (Cameroun - CEMAC)

- **Pays d'ancrage :** Cameroun (zone CEMAC).
- **Raison sociale :** PNO Solutions Cameroun S.A.R.L.
- **Gérant & Fondateur :** Philippe NOUGOUE (initiales `PN`).
- **Contacts officiels :**
  - **Tel MTN (Mobile Money) :** `+237 677481161`
  - **Tel Orange (Orange Money) :** `+237 691114908`
- **Devise monétaire :** Franc CFA (XAF), toujours affiché avec le sigle `FCFA` et séparateur d'espace insécable (ex: `250 000 FCFA`, `1 450 000 FCFA`).
- **Taux de TVA légal par défaut :** `19,25%` (taux en vigueur en République du Cameroun). Taux réduit : `10%`, Exonéré : `0%`.
- **Mentions légales & Registres :**
  - **NIU :** Numéro d'Identifiant Unique (ex: `NIU M052112345678A`).
  - **RCCM :** Registre du Commerce et du Crédit Mobilier (ex: `RC/DLA/2024/B/1234`).
  - **Villes principales :** Douala (siège économique, Akwa, Bonanjo), Yaoundé (siège institutionnel, Bastos).
- **Moyens de paiement locaux prioritaires :**
  - **MTN Mobile Money Cameroun** (`*126#` - `+237 677481161`)
  - **Orange Money Cameroun** (`*150#` - `+237 691114908`)
  - **Virement bancaire / RIB** (Afriland First Bank, UBA, BICEC, Société Générale Cameroun).

---

## 2. Standards d'Interactivité & Micro-animations UI

Sur **toutes les pages** créées :

### 2.1 Barres de recherche
Toutes les barres de recherche (Sidebar, En-têtes, Tableaux) doivent posséder des effets interactifs au survol :
```tsx
className="group/search relative flex items-center cursor-pointer transition-all duration-300"
// Conteneur / Input :
hover:border-blue-400 hover:bg-white hover:shadow-md hover:shadow-blue-500/10
// Icône Loupe :
transition-all duration-300 group-hover/search:text-blue-600 group-hover/search:scale-110
// Badge ⌘ K :
group-hover/search:border-blue-300 group-hover/search:text-blue-600
```

### 2.2 Boutons d'action (Boutons primaires, secondaires, icônes)
**Chaque bouton** doit avoir une micro-interaction réactive au survol et au clic :
- **Boutons primaires (Bleu) :**
  ```tsx
  className="rounded-xl bg-blue-600 px-4 py-2 font-bold text-white shadow-md shadow-blue-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/35 active:translate-y-0 active:scale-95"
  ```
- **Boutons secondaires / blancs bordés :**
  ```tsx
  className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 font-semibold text-slate-700 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md active:translate-y-0 active:scale-95"
  ```
- **Boutons d'action sur ligne (WhatsApp, PDF, Voir) :**
  ```tsx
  className="rounded-lg p-1.5 text-slate-400 transition-all duration-200 hover:scale-115 active:scale-95"
  ```

---

## 3. Règles de Formatage des Données

1. **Montants :**
   - Toujours des entiers déterministes calculés via `big.js` (arrondi `roundHalfUp`).
   - Format d'affichage : `formatFCFA(amount)` -> `X XXX XXX FCFA`.
2. **Dates :**
   - Format obligatoire : `jour/mois/année` (`DD/MM/YYYY`, ex: `07/10/2026`).
3. **Statuts des documents :**
   - **Payée :** Vert (`bg-emerald-50 text-emerald-700 border-emerald-200`)
   - **Envoyée :** Bleu (`bg-blue-50 text-blue-700 border-blue-200`)
   - **Partiellement payée :** Ambre (`bg-amber-50 text-amber-700 border-amber-200`)
   - **En retard :** Rouge / Rose vif (`bg-rose-50 text-rose-700 border-rose-200`)
   - **Brouillon :** Gris neutre (`bg-slate-100 text-slate-700 border-slate-200`)
4. **Montant en lettres légal :**
   - Obligatoire sur tous les aperçus et documents PDF : `numberToWordsFr(total)`  
     Exemple : *"Arrêtée la présente facture à la somme de quatre millions cinq cent trente et un mille cinq cents francs CFA"*.
