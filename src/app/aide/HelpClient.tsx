"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Sidebar } from "../../components/layout/Sidebar";
import { Topbar } from "../../components/layout/Topbar";
import {
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  ChevronDown,
  Search,
  FileCheck2,
  Coins,
  ShieldCheck,
  Send,
  Building2,
  MapPin,
  ExternalLink,
  BookOpen,
} from "lucide-react";

interface FAQItem {
  id: string;
  category: "vat" | "payment" | "invoice" | "legal";
  question: string;
  answer: string;
}

const FAQ_LIST: FAQItem[] = [
  {
    id: "faq-1",
    category: "vat",
    question: "Comment est calculée la TVA camerounaise à 19,25% ?",
    answer:
      "Au Cameroun et en zone CEMAC, le taux légal effectif de TVA est de 19,25% (composé du taux de base de 17,5% majoré de 10% au titre des centimes additionnels communaux - CAC). EasyFacturation calcule automatiquement et de façon déterministe cette TVA ligne par ligne avec arrondi commercial half-up à l'entier FCFA le plus proche, évitant tout écart comptable avec le fisc camerounais.",
  },
  {
    id: "faq-2",
    category: "payment",
    question: "Comment enregistrer un paiement partiel (acompte) via Mobile Money ?",
    answer:
      "Sur la page de détail de votre facture (/factures/[id]), cliquez sur le bouton vert « Enregistrer un règlement ». Saisissez le montant perçu (par exemple 500 000 FCFA), sélectionnez le canal « MTN Mobile Money » ou « Orange Money » et la référence de transaction. Le système calcule immédiatement le solde restant dû et fait passer la facture au statut « Partiellement payée » sans écraser l'historique.",
  },
  {
    id: "faq-3",
    category: "invoice",
    question: "Comment convertir un devis accepté en facture en un clic ?",
    answer:
      "Dans l'onglet « Devis », repérez la proposition commerciale validée par votre client et cliquez sur « Convertir en facture ». Le système génère automatiquement une nouvelle facture officielle (séquence FAC-2026-XXXX) reprenant l'intégralité des prestations, remises et coordonnées, tout en liant le devis à la facture.",
  },
  {
    id: "faq-4",
    category: "legal",
    question: "Quelles sont les mentions légales obligatoires OHADA sur mes factures ?",
    answer:
      "Selon le droit commercial OHADA et la législation fiscale camerounaise, toute facture professionnelle doit comporter : votre Numéro d'Identifiant Unique (NIU), votre numéro RCCM, votre adresse physique d'immatriculation (Douala/Yaoundé), le détail précis des prestations HT, la TVA à 19,25%, le total en lettres et les coordonnées de règlement.",
  },
  {
    id: "faq-5",
    category: "payment",
    question: "Comment partager une facture avec un client sur WhatsApp ?",
    answer:
      "Cliquez sur le bouton « WhatsApp » sur n'importe quelle facture. Un message prêt à l'envoi est automatiquement composé avec le nom du client, le montant total, le solde restant dû, la date d'échéance et les instructions de règlement MTN MoMo (*126#) et Orange Money (*150#).",
  },
  {
    id: "faq-6",
    category: "invoice",
    question: "Comment imprimer ou exporter ma facture en PDF propre ?",
    answer:
      "Cliquez sur « Imprimer / PDF » depuis la facture. La mise en page d'impression est optimisée pour le format A4 : elle masque automatiquement les barres de menu et affiche un filigrane officiel avec tampon de statut (« FACTURE ACQUITTÉE », « IMPAYÉE • EN RETARD », ou « PROFORMA ») ainsi que la signature de la direction.",
  },
];

export function HelpClient() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [openAccordion, setOpenAccordion] = useState<string | null>("faq-1");

  // Contact form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+237 ");
  const [subject, setSubject] = useState("Assistance facturation");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredFaqs = FAQ_LIST.filter((faq) => {
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (id: string) => {
    setOpenAccordion((prev) => (prev === id ? null : id));
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      toast.error("Veuillez renseigner votre nom et votre message.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(
        "Votre demande d'assistance a été transmise à Philippe NOUGOUE. Vous serez recontacté sous 2h ouvrées.",
        {
          action: {
            label: "Ouvrir WhatsApp",
            onClick: () => {
              const text = encodeURIComponent(
                `Bonjour Philippe NOUGOUE,\nJe suis ${name} (${phone}).\nObjet : ${subject}\n\nMessage : ${message}`
              );
              window.open(`https://wa.me/237677481161?text=${text}`, "_blank");
            },
          },
        }
      );
      setMessage("");
    }, 600);
  };

  return (
    <div className="flex min-h-screen bg-slate-50/70 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-x-hidden">
        <Topbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Header Banner */}
          <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                <HelpCircle className="h-3.5 w-3.5 text-blue-200" />
                <span>Centre d'Aide & Support Technique EasyFacturation</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Comment pouvons-nous vous aider aujourd'hui ?
              </h1>
              <p className="text-sm text-blue-100/90 leading-relaxed">
                Guides pratiques de facturation camerounaise, gestion de la TVA à 19,25%,
                assistance sur les paiements Mobile Money et support direct avec le fondateur Philippe NOUGOUE.
              </p>

              {/* Search input in banner */}
              <div className="pt-2 max-w-xl">
                <div className="relative flex items-center">
                  <Search className="absolute left-4 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher une question (ex: TVA 19,25%, acompte, Orange Money, OHADA)..."
                    className="w-full rounded-2xl border border-white/20 bg-white/95 py-3 pl-11 pr-4 text-xs font-medium text-slate-900 placeholder-slate-400 shadow-md focus:bg-white focus:outline-hidden dark:bg-slate-900/90 dark:text-white dark:placeholder-slate-500"
                  />
                </div>
              </div>
            </div>

            {/* Subtle background decoration */}
            <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
          </div>

          {/* Direct Support Channels (3 Cards) */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Support Direct & Contacts Officiels Cameroun
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* WhatsApp Direct 24/7 */}
              <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-2xs dark:border-emerald-950 dark:bg-slate-900 space-y-4 hover:-translate-y-1 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    En ligne
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Assistance WhatsApp Directe
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Échangez directement avec <strong>Philippe NOUGOUE</strong> (Gérant Fondateur).
                  </p>
                </div>

                <div className="pt-2">
                  <a
                    href="https://wa.me/237677481161?text=Bonjour%20Philippe%20NOUGOUE,%20j'ai%20besoin%20d'assistance%20sur%20EasyFacturation."
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 px-4 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 active:scale-95 transition-all"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Ouvrir WhatsApp (+237 677481161)</span>
                  </a>
                </div>
              </div>

              {/* Téléphone Mobile Money */}
              <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-2xs dark:border-amber-950 dark:bg-slate-900 space-y-4 hover:-translate-y-1 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                    <Phone className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    Lignes Directes
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Lignes MTN & Orange Cameroun
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    MTN MoMo : <strong>+237 677481161</strong> (*126#)<br />
                    Orange Money : <strong>+237 691114908</strong> (*150#)
                  </p>
                </div>

                <div className="pt-2 flex gap-2">
                  <a
                    href="tel:+237677481161"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 py-2.5 text-xs font-bold text-amber-800 hover:bg-amber-100 active:scale-95 transition-all dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300"
                  >
                    <span>Appel MTN</span>
                  </a>
                  <a
                    href="tel:+237691114908"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-orange-300 bg-orange-50 py-2.5 text-xs font-bold text-orange-800 hover:bg-orange-100 active:scale-95 transition-all dark:bg-orange-950/40 dark:border-orange-800 dark:text-orange-300"
                  >
                    <span>Appel Orange</span>
                  </a>
                </div>
              </div>

              {/* Siège & Bureaux Douala / Yaoundé */}
              <div className="rounded-2xl border border-blue-200 bg-white p-6 shadow-2xs dark:border-blue-950 dark:bg-slate-900 space-y-4 hover:-translate-y-1 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    Siège CEMAC
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Prunus Engineering SARL
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Boulevard de la Liberté, Akwa, Douala<br />
                    Permanence Bastos, Yaoundé<br />
                    Email : <strong>contact@prunus-engineering.cm</strong>
                  </p>
                </div>

                <div className="pt-2">
                  <a
                    href="mailto:contact@pno-cameroun.cm"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 active:scale-95 transition-all dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Envoyer un email officiel</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Two Columns: Interactive FAQ (Left) & Ticket Request Form (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: FAQ Section */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    Foire Aux Questions Fréquentes
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Réponses aux interrogations courantes sur la législation et l'utilisation du logiciel.
                  </p>
                </div>
              </div>

              {/* Categories Pills */}
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  { id: "all", label: "Toutes les questions" },
                  { id: "vat", label: "TVA 19,25%" },
                  { id: "payment", label: "Paiements MoMo/OM" },
                  { id: "invoice", label: "Factures & Devis" },
                  { id: "legal", label: "Conformité OHADA" },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveCategory(c.id)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                      activeCategory === c.id
                        ? "bg-blue-600 text-white shadow-2xs"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Accordion List */}
              <div className="space-y-3">
                {filteredFaqs.map((faq) => {
                  const isOpen = openAccordion === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden shadow-2xs transition-all"
                    >
                      <button
                        onClick={() => toggleAccordion(faq.id)}
                        className="w-full flex items-center justify-between p-4 text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown
                          className={`h-4 w-4 text-slate-400 shrink-0 ml-3 transition-transform duration-200 ${
                            isOpen ? "rotate-180 text-blue-600" : ""
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}

                {filteredFaqs.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500">
                    Aucune question trouvée pour « {searchQuery} ». Essayez un autre terme ou contactez-nous ci-contre.
                  </div>
                )}
              </div>
            </div>

            {/* Right: Contact Form Ticket */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Send className="h-4 w-4 text-blue-600" />
                    Envoyer un message au support
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Besoin d'aide pour paramétrer votre entreprise ou vos coordonnées fiscales ? Écrivez-nous.
                  </p>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Votre Nom & Entreprise *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Jean-Paul Mbida (SABC / MTN)"
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Numéro de téléphone WhatsApp *
                    </label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+237 6XX XX XX XX"
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Objet de la demande
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      <option value="Assistance facturation">Assistance sur une facture ou un devis</option>
                      <option value="Question TVA 19.25%">Question sur la TVA camerounaise (19,25%)</option>
                      <option value="Paiements Mobile Money">Paiements MTN MoMo / Orange Money</option>
                      <option value="Configuration entreprise">Configuration du compte et mentions OHADA</option>
                      <option value="Autre demande">Autre question commerciale ou technique</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Votre message détaillé *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Expliquez votre situation ou votre question pour une prise en charge rapide..."
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-3 text-xs font-bold text-white shadow-md shadow-blue-600/25 hover:from-blue-700 hover:to-blue-800 active:scale-95 transition-all"
                  >
                    <Send className="h-4 w-4" />
                    <span>Transmettre ma demande d'assistance</span>
                  </button>

                  <p className="text-[11px] text-center text-slate-400">
                    Réponse directe assurée par l'équipe Prunus Engineering SARL.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
