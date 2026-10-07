"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Sidebar } from "../../components/layout/Sidebar";
import { Topbar } from "../../components/layout/Topbar";
import { OrganizationSettings } from "../../lib/domain/types";
import { updateSettingsAction } from "../../lib/actions/settings";
import {
  Settings,
  Building2,
  Receipt,
  Smartphone,
  Save,
  Check,
  User,
} from "lucide-react";

interface SettingsClientProps {
  initialSettings: OrganizationSettings;
}

export function SettingsClient({ initialSettings }: SettingsClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form states - Philippe NOUGOUE & Cameroun
  const [managerName, setManagerName] = useState(initialSettings.managerName);
  const [companyName, setCompanyName] = useState(initialSettings.name);
  const [email, setEmail] = useState(initialSettings.email);
  const [phone, setPhone] = useState(initialSettings.phone);
  const [country, setCountry] = useState(initialSettings.country || "CM");
  const [taxId, setTaxId] = useState(initialSettings.taxId);
  const [rccm, setRccm] = useState(initialSettings.rccm);
  const [address, setAddress] = useState(initialSettings.address);
  const [city, setCity] = useState(initialSettings.city || "Douala");

  const [invoicePrefix, setInvoicePrefix] = useState(initialSettings.invoicePrefix);
  const [quotePrefix, setQuotePrefix] = useState(initialSettings.quotePrefix);
  const [defaultTaxRate, setDefaultTaxRate] = useState(String(initialSettings.defaultTaxRate));
  const [paymentTermsDays, setPaymentTermsDays] = useState(String(initialSettings.paymentTermsDays));

  const [mtnPhone, setMtnPhone] = useState(initialSettings.mtnMoMoPhone);
  const [omPhone, setOmPhone] = useState(initialSettings.orangeMoneyPhone);
  const [bankRib, setBankRib] = useState(initialSettings.bankRib);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const toastId = toast.loading("Enregistrement des paramètres...");

    try {
      const res = await updateSettingsAction({
        name: companyName,
        managerName,
        email,
        phone,
        address,
        city,
        country,
        taxId,
        rccm,
        currency: "FCFA",
        defaultTaxRate: parseFloat(defaultTaxRate) || 19.25,
        paymentTermsDays: parseInt(paymentTermsDays) || 30,
        invoicePrefix,
        quotePrefix,
        mtnMoMoPhone: mtnPhone,
        orangeMoneyPhone: omPhone,
        bankRib,
        defaultNotes: initialSettings.defaultNotes,
        defaultTerms: initialSettings.defaultTerms,
      });

      if (res.success) {
        toast.success("Paramètres mis à jour avec succès !", { id: toastId });
      } else {
        toast.error(res.error || "Erreur lors de la mise à jour.", { id: toastId });
      }
    } catch {
      toast.error("Erreur inattendue.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
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
                Gérant : <strong>{managerName}</strong> • Mentions légales Cameroun, TVA {defaultTaxRate}% & Mobile Money.
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Card 1: Identité Entreprise & Gérant */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-600" />
                Identité de l'entreprise & Gérance
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Raison sociale / Nom entreprise *
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
                    Gérant & Fondateur *
                  </label>
                  <input
                    type="text"
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Numéro d'Identifiant Unique (NIU) *
                  </label>
                  <input
                    type="text"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 font-mono font-bold text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-blue-400"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Numéro RCCM *
                  </label>
                  <input
                    type="text"
                    value={rccm}
                    onChange={(e) => setRccm(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 font-mono font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Email officiel
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Téléphones de contact
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-600/35 active:translate-y-0 active:scale-95 disabled:opacity-50"
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
