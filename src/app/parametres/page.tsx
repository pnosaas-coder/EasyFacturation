"use client";

import React, { useState } from "react";
import { Sidebar } from "../../components/layout/Sidebar";
import { Topbar } from "../../components/layout/Topbar";
import {
  Settings,
  Building2,
  Receipt,
  Smartphone,
  Landmark,
  Save,
  Check,
  ShieldCheck,
} from "lucide-react";

export default function SettingsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form states
  const [companyName, setCompanyName] = useState("PNO Solutions S.A.R.L");
  const [email, setEmail] = useState("contact@pno-solutions.sn");
  const [phone, setPhone] = useState("+221 77 123 45 67");
  const [country, setCountry] = useState("SN");
  const [taxId, setTaxId] = useState("NINEA 009876543 2V1");
  const [rccm, setRccm] = useState("SN.DKR.2024.B.12345");
  const [address, setAddress] = useState("Immeuble R+4, Rue 12, Dakar, Sénégal");

  const [invoicePrefix, setInvoicePrefix] = useState("FAC");
  const [quotePrefix, setQuotePrefix] = useState("DEV");
  const [defaultTaxRate, setDefaultTaxRate] = useState("18");
  const [paymentTermsDays, setPaymentTermsDays] = useState("30");

  const [wavePhone, setWavePhone] = useState("+221 77 123 45 67");
  const [omPhone, setOmPhone] = useState("+221 78 987 65 43");
  const [bankRib, setBankRib] = useState("SN08 SN01 2013 4567 8901 2345 67");

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
                Paramètres de facturation
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configurez les mentions légales OHADA, votre TVA et vos moyens d'encaissement.
              </p>
            </div>

            {saved && (
              <div className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                <Check className="h-4 w-4" />
                <span>Modifications enregistrées !</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Card 1: Entreprise & Fiscalité OHADA */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-600" />
                Identité de l'entreprise & Mentions OHADA
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
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
                    <option value="SN">Sénégal (XOF - FCFA)</option>
                    <option value="CI">Côte d'Ivoire (XOF - FCFA)</option>
                    <option value="CM">Cameroun (XAF - FCFA)</option>
                    <option value="TG">Togo (XOF - FCFA)</option>
                    <option value="BJ">Bénin (XOF - FCFA)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    N° d'identification fiscale (NINEA / IFU / NIU) *
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
                    Registre du Commerce (RCCM) *
                  </label>
                  <input
                    type="text"
                    value={rccm}
                    onChange={(e) => setRccm(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Adresse du siège social
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
                Numérotation & Fiscalité par défaut
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
                    TVA par défaut (%)
                  </label>
                  <input
                    type="number"
                    value={defaultTaxRate}
                    onChange={(e) => setDefaultTaxRate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 font-bold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
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

            {/* Card 3: Mobile Money & Banques pour factures */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-emerald-600" />
                Coordonnées de paiement affichées sur les factures & devis
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Numéro Wave Mobile Money
                  </label>
                  <input
                    type="text"
                    value={wavePhone}
                    onChange={(e) => setWavePhone(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Numéro Orange Money / MTN
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
                    Coordonnées bancaires complètes (RIB / IBAN)
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

            {/* Submit button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/25 hover:bg-blue-700 transition-all active:scale-98"
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
