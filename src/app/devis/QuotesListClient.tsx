"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sidebar } from "../../components/layout/Sidebar";
import { Topbar } from "../../components/layout/Topbar";
import { formatFCFA } from "../../lib/format/money";
import { formatDate } from "../../lib/format/dates";
import { Quote, Client, Product, QuoteStatus } from "../../lib/domain/types";
import {
  convertQuoteToInvoiceAction,
  createQuoteAction,
  updateQuoteStatusAction,
  deleteQuoteAction,
} from "../../lib/actions/quotes";
import { StatusDropdown } from "../../components/shared/StatusDropdown";
import { DeleteConfirmationModal } from "../../components/shared/DeleteConfirmationModal";
import { Pagination } from "../../components/shared/Pagination";
import {
  FileCheck2,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  Download,
  MessageSquare,
  Sparkles,
  X,
  Trash2,
} from "lucide-react";

interface QuotesListClientProps {
  initialQuotes: Quote[];
  clients: Client[];
  products: Product[];
}

export function QuotesListClient({
  initialQuotes,
  clients,
  products,
}: QuotesListClientProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [convertingId, setConvertingId] = useState<string | null>(null);

  // New Quote Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || "");
  const [itemDescription, setItemDescription] = useState(products[0]?.name || "Prestation de service");
  const [itemPrice, setItemPrice] = useState(products[0]?.unitPrice || 1_000_000);
  const [itemQty, setItemQty] = useState(1);
  const [isCreating, setIsCreating] = useState(false);

  const handleConvert = async (quote: Quote) => {
    setConvertingId(quote.id);
    const toastId = toast.loading(`Conversion du devis ${quote.number} en facture...`);

    try {
      const res = await convertQuoteToInvoiceAction(quote.id);
      if (res.success && res.data) {
        toast.success(
          `Devis ${quote.number} converti avec succès en Facture ${res.data.number} !`,
          {
            id: toastId,
            action: {
              label: "Voir la facture",
              onClick: () => router.push(`/factures/${res.data!.id}`),
            },
          }
        );
        setQuotes((prev) =>
          prev.map((q) =>
            q.id === quote.id
              ? { ...q, status: "converted", convertedInvoiceId: res.data!.id }
              : q
          )
        );
        router.refresh();
      } else {
        toast.error(res.error || "Erreur lors de la conversion.", { id: toastId });
      }
    } catch {
      toast.error("Erreur inattendue.", { id: toastId });
    } finally {
      setConvertingId(null);
    }
  };

  const handleCreateQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === selectedClientId) || clients[0];
    if (!client) {
      toast.error("Veuillez sélectionner un client.");
      return;
    }

    setIsCreating(true);
    const toastId = toast.loading("Création du devis...");

    const todayStr = new Date().toISOString().split("T")[0];
    const valid = new Date();
    valid.setDate(valid.getDate() + 30);
    const validStr = valid.toISOString().split("T")[0];

    try {
      const res = await createQuoteAction({
        clientId: client.id,
        clientName: client.name,
        clientEmail: client.email,
        clientPhone: client.phone,
        clientCity: client.city,
        clientAddress: client.address,
        issueDate: todayStr,
        validUntil: validStr,
        status: "sent",
        items: [
          {
            description: itemDescription,
            quantity: itemQty,
            unitPrice: itemPrice,
            taxRate: 19.25,
          },
        ],
      });

      if (res.success && res.data) {
        toast.success(`Devis ${res.data.number} créé avec succès !`, { id: toastId });
        setQuotes([res.data, ...quotes]);
        router.refresh();
        setModalOpen(false);
      } else {
        toast.error(res.error || "Erreur lors de la création.", { id: toastId });
      }
    } catch {
      toast.error("Erreur inattendue.", { id: toastId });
    } finally {
      setIsCreating(false);
    }
  };

  // Status Dropdown change handler
  const handleStatusChange = async (quoteId: string, newStatus: QuoteStatus) => {
    const toastId = toast.loading("Mise à jour du statut du devis...");
    try {
      const res = await updateQuoteStatusAction(quoteId, newStatus);
      if (res.success && res.data) {
        setQuotes((prev) =>
          prev.map((q) => (q.id === quoteId ? { ...q, status: newStatus } : q))
        );
        router.refresh();
        toast.success(`Statut du devis mis à jour : ${newStatus}`, { id: toastId });
      } else {
        toast.error(res.error || "Erreur lors de la mise à jour", { id: toastId });
      }
    } catch {
      toast.error("Erreur inattendue.", { id: toastId });
    }
  };

  // Delete quote confirmation handler
  const [quoteToDelete, setQuoteToDelete] = useState<Quote | null>(null);
  const [isDeletingQuote, setIsDeletingQuote] = useState(false);

  const handleConfirmDeleteQuote = async () => {
    if (!quoteToDelete) return;
    setIsDeletingQuote(true);
    const toastId = toast.loading("Suppression du devis en cours...");
    try {
      const res = await deleteQuoteAction(quoteToDelete.id);
      if (res.success) {
        setQuotes((prev) => prev.filter((q) => q.id !== quoteToDelete.id));
        router.refresh();
        toast.success(`Devis ${quoteToDelete.number} supprimé avec succès.`, { id: toastId });
        setQuoteToDelete(null);
      } else {
        toast.error(res.error || "Impossible de supprimer le devis.", { id: toastId });
      }
    } catch {
      toast.error("Erreur lors de la suppression.", { id: toastId });
    } finally {
      setIsDeletingQuote(false);
    }
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredQuotes = quotes.filter((q) => {
    const matchesStatus = statusFilter === "all" || q.status === statusFilter;
    const matchesSearch =
      searchQuery.trim() === "" ||
      q.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredQuotes.length / pageSize) || 1;
  const paginatedQuotes = filteredQuotes.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="flex min-h-screen bg-slate-50/70 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-x-hidden">
        <Topbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                <span>Commercial</span>
                <span>/</span>
                <span className="text-slate-900 dark:text-white">Devis & Propositions</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white flex items-center gap-2">
                <FileCheck2 className="h-6 w-6 text-blue-600" />
                Devis & Propositions commerciales
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Créez vos devis et convertissez-les en factures en un seul clic (Cameroun, FCFA).
              </p>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Nouveau devis</span>
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par numéro ou client..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {[
                { id: "all", label: "Tous" },
                { id: "sent", label: "Envoyés" },
                { id: "accepted", label: "Acceptés" },
                { id: "converted", label: "Convertis" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    statusFilter === tab.id
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quotes Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:bg-slate-800/50">
                  <th className="py-3.5 pl-6 pr-3">Numéro</th>
                  <th className="px-3 py-3.5">Client & Ville</th>
                  <th className="px-3 py-3.5">Date d'émission</th>
                  <th className="px-3 py-3.5">Validité</th>
                  <th className="px-3 py-3.5 text-right">Montant TTC</th>
                  <th className="px-3 py-3.5 text-center">Statut</th>
                  <th className="py-3.5 pl-3 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs dark:divide-slate-800">
                {paginatedQuotes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      Aucun devis trouvé pour ces critères de recherche.
                    </td>
                  </tr>
                ) : (
                  paginatedQuotes.map((quote) => (
                    <tr
                      key={quote.id}
                      className="hover:bg-slate-50/80 transition-colors dark:hover:bg-slate-800/50 group"
                    >
                      <td className="py-4 pl-6 pr-3 font-mono font-bold text-blue-600">
                        {quote.number}
                      </td>
                      <td className="px-3 py-4">
                        <div className="font-bold text-slate-900 dark:text-slate-100">
                          {quote.clientName}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {quote.clientCity || "Cameroun"}
                        </div>
                      </td>
                      <td className="px-3 py-4 text-slate-600 dark:text-slate-300">
                        {formatDate(quote.issueDate)}
                      </td>
                      <td className="px-3 py-4 text-slate-500">
                        {formatDate(quote.validUntil)}
                      </td>
                      <td className="px-3 py-4 text-right font-bold text-slate-900 dark:text-white">
                        {formatFCFA(quote.total)}
                      </td>
                      {/* Interactive Status Dropdown */}
                      <td className="px-3 py-4 text-center">
                        <StatusDropdown
                          type="quote"
                          currentStatus={quote.status}
                          onStatusChange={(newStatus) => handleStatusChange(quote.id, newStatus)}
                        />
                      </td>
                      {/* Actions: Convert + Delete */}
                      <td className="py-4 pl-3 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {quote.status !== "converted" ? (
                            <button
                              disabled={convertingId === quote.id}
                              onClick={() => handleConvert(quote)}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-600 hover:text-white hover:shadow-md active:scale-95 disabled:opacity-50 dark:bg-blue-950/60 dark:text-blue-300 cursor-pointer"
                            >
                              <Sparkles className="h-3.5 w-3.5" />
                              <span>Convertir en facture</span>
                            </button>
                          ) : (
                            <Link
                              href={`/factures/${quote.convertedInvoiceId || ""}`}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:underline dark:text-purple-400"
                            >
                              <span>Facture liée</span>
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          )}

                          {/* Delete quote action */}
                          <button
                            type="button"
                            title="Supprimer ce devis"
                            onClick={() => setQuoteToDelete(quote)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50 dark:hover:text-rose-400 transition-all duration-200 hover:scale-115 active:scale-95 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredQuotes.length}
              pageSize={pageSize}
              pageSizeOptions={[5, 10, 20]}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal for Quote */}
      <DeleteConfirmationModal
        isOpen={Boolean(quoteToDelete)}
        title="Supprimer ce devis ?"
        description={`Êtes-vous certain de vouloir supprimer le devis ${quoteToDelete?.number} (${quoteToDelete?.clientName}) ? Cette action est irréversible.`}
        itemLabel={`${quoteToDelete?.number} • ${quoteToDelete ? formatFCFA(quoteToDelete.total) : ""}`}
        confirmButtonText="Oui, supprimer le devis"
        isDeleting={isDeletingQuote}
        onConfirm={handleConfirmDeleteQuote}
        onClose={() => setQuoteToDelete(null)}
      />

      {/* CREATE QUOTE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileCheck2 className="h-5 w-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Créer une proposition commerciale / devis
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateQuote} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Client destinataire *
                </label>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.city || "Cameroun"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Description de la prestation *
                </label>
                <input
                  type="text"
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  placeholder="Ex: Audit de sécurité SI & Cloud"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Quantité
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={itemQty}
                    onChange={(e) => setItemQty(parseInt(e.target.value) || 1)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white text-right"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Prix Unit. HT (FCFA)
                  </label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(parseInt(e.target.value) || 0)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white text-right"
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                TVA de 19,25% appliquée automatiquement. Durée de validité : 30 jours.
              </p>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/25 hover:bg-blue-700 active:scale-95 disabled:opacity-50"
                >
                  Créer le devis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
