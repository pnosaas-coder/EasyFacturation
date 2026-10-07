"use client";

import React, { useState } from "react";
import { Sidebar } from "../../components/layout/Sidebar";
import { Topbar } from "../../components/layout/Topbar";
import {
  Settings,
  Building2,
  Receipt,
  Smartphone,
  Save,
  Check,
  User,
} from "lucide-react";

export default function SettingsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form states - Philippe Noukoué & Cameroun
  const [managerName, setManagerName] = useState("Philippe Noukoué");
  const [companyName, setCompanyName] = useState("PNO Solutions Cameroun S.A.R.L");
  const [email, setEmail] = useState("contact@pno-cameroun.cm");
  const [phone, setPhone] = useState("+237 6 77 12 34 56");
  const [country, setCountry] = useState("CM");
  const [taxId, setTaxId] = useState("NIU M052112345678A");
  const [rccm, setRccm] = useState("RC/DLA/2024/B/1234");
  const [address, setAddress] = useState("Boulevard de la Liberté, Akwa, Douala, Cameroun");

  const [invoicePrefix, setInvoicePrefix] = useState("FAC");
  const [quotePrefix, setQuotePrefix] = useState("DEV");
  const [defaultTaxRate, setDefaultTaxRate] = useState("19.25");
  const [paymentTermsDays, setPaymentTermsDays] = useState("30");

  const [mtnPhone, setMtnPhone] = useState("+237 6 77 12 34 56");
  const [omPhone, setOmPhone] = useState("+237 6 99 87 65 43");
  const [bankRib, setBankRib] = useState("CM21 10005 00012 01234567890 45 (Afriland First Bank)");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex min-h-screen bg-slate-50/70 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-x-hidden">
        <Topbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto w-full">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white flex items-center gap-2">
                <Settings className="h-6 w-6 text-blue-600" />
                Paramètres de facturation (Cameroun)
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Gérant : <strong>Philippe Noukoué</strong> • Mentions légales Cameroun, TVA 19,25% & Mobile Money.
              </p>
            </div>

            {saved && (
              <div className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-700 border border-emerald-200 animate-in fade-in duration-200">
                <Check className="h-4 w-4" />
                <span>Modifications enregistrées !</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Card 1: Gérant & Entreprise OHADA Cameroun */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-600" />
                Identité de l'entreprise & Gérance
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Gérant Fondateur *
                  </label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={managerName}
                      onChange={(e) => setManagerName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Raison sociale *
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Pays & Devise *
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="CM">Cameroun (XAF - FCFA)</option>
                    <option value="SN">Sénégal (XOF - FCFA)</option>
                    <option value="CI">Côte d'Ivoire (XOF - FCFA)</option>
                    <option value="GA">Gabon (XAF - FCFA)</option>
                    <option value="TD">Tchad (XAF - FCFA)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Numéro d'Identifiant Unique (NIU Cameroun) *
                  </label>
                  <input
                    type="text"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Registre du Commerce (RCCM Cameroun) *
                  </label>
                  <input
                    type="text"
                    value={rccm}
                    onChange={(e) => setRccm(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Email officiel & Téléphone
                  </label>
                  <input
                    type="text"
                    value={`${email} / ${phone}`}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Adresse du siège social (Douala / Yaoundé)
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Modalités de facturation */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Receipt className="h-4 w-4 text-blue-600" />
                Numérotation & Fiscalité Camerounaise
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Préfixe Facture
                  </label>
                  <input
                    type="text"
                    value={invoicePrefix}
                    onChange={(e) => setInvoicePrefix(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 font-bold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Préfixe Devis
                  </label>
                  <input
                    type="text"
                    value={quotePrefix}
                    onChange={(e) => setQuotePrefix(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 font-bold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    TVA Cameroun (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={defaultTaxRate}
                    onChange={(e) => setDefaultTaxRate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 font-bold text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-blue-400"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Délai de règlement (jours)
                  </label>
                  <input
                    type="number"
                    value={paymentTermsDays}
                    onChange={(e) => setPaymentTermsDays(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 font-bold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Card 3: Mobile Money Cameroun & Banques */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-emerald-600" />
                Coordonnées de paiement (MTN MoMo, Orange Money & Banque)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Numéro MTN Mobile Money Cameroun (*126#)
                  </label>
                  <input
                    type="text"
                    value={mtnPhone}
                    onChange={(e) => setMtnPhone(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Numéro Orange Money Cameroun (*150#)
                  </label>
                  <input
                    type="text"
                    value={omPhone}
                    onChange={(e) => setOmPhone(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Coordonnées bancaires complètes (RIB Afriland / UBA / BICEC)
                  </label>
                  <input
                    type="text"
                    value={bankRib}
                    onChange={(e) => setBankRib(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 font-mono font-bold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Submit button with hover interaction */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-600/35 active:translate-y-0 active:scale-95"
              >
                <Save className="h-4 w-4" />
                <span>Enregistrer les paramètres</span>
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
