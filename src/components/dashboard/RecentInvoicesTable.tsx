"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Invoice, InvoiceStatus } from "../../lib/domain/types";
import { formatFCFA } from "../../lib/format/money";
import { formatDate } from "../../lib/format/dates";
import { StatusDropdown } from "../shared/StatusDropdown";
import { DeleteConfirmationModal } from "../shared/DeleteConfirmationModal";
import { Pagination } from "../shared/Pagination";
import { updateInvoiceStatusAction, deleteInvoiceAction } from "../../lib/actions/invoices";
import {
  FileText,
  Search,
  Download,
  ArrowUpRight,
  MessageSquare,
  Trash2,
} from "lucide-react";

interface RecentInvoicesTableProps {
  invoices: Invoice[];
  isDashboard?: boolean;
  onInvoiceUpdated?: (updated: Invoice) => void;
  onInvoiceDeleted?: (deletedId: string) => void;
}

export function RecentInvoicesTable({
  invoices: initialInvoices,
  isDashboard = false,
  onInvoiceUpdated,
  onInvoiceDeleted,
}: RecentInvoicesTableProps) {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(isDashboard ? 5 : 10);

  // Deletion modal state
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setInvoices(initialInvoices);
  }, [initialInvoices]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, pageSize]);

  const handleStatusChange = async (invoiceId: string, newStatus: InvoiceStatus) => {
    const toastId = toast.loading("Mise à jour du statut en cours...");
    try {
      const res = await updateInvoiceStatusAction(invoiceId, newStatus);
      if (res.success && res.data) {
        const updatedInvoice = res.data;
        setInvoices((prev) =>
          prev.map((inv) => (inv.id === invoiceId ? updatedInvoice : inv))
        );
        onInvoiceUpdated?.(updatedInvoice);
        router.refresh();
        toast.success(`Statut mis à jour avec succès : ${newStatus}`, { id: toastId });
      } else {
        toast.error(res.error || "Erreur lors du changement de statut", { id: toastId });
      }
    } catch {
      toast.error("Erreur inattendue", { id: toastId });
    }
  };

  const handleConfirmDelete = async () => {
    if (!invoiceToDelete) return;
    setIsDeleting(true);
    const toastId = toast.loading("Suppression de la facture en cours...");
    try {
      const res = await deleteInvoiceAction(invoiceToDelete.id);
      if (res.success) {
        const deletedId = invoiceToDelete.id;
        setInvoices((prev) => prev.filter((inv) => inv.id !== deletedId));
        onInvoiceDeleted?.(deletedId);
        router.refresh();
        toast.success(`Facture ${invoiceToDelete.number} supprimée avec succès.`, {
          id: toastId,
        });
        setInvoiceToDelete(null);
      } else {
        toast.error(res.error || "Impossible de supprimer la facture.", { id: toastId });
      }
    } catch {
      toast.error("Erreur lors de la suppression.", { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    // Filter by tab
    if (activeTab === "paid" && inv.status !== "paid") return false;
    if (activeTab === "sent" && inv.status !== "sent" && inv.status !== "partial") return false;
    if (activeTab === "overdue" && inv.status !== "overdue") return false;
    if (activeTab === "draft" && inv.status !== "draft") return false;

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = inv.number.toLowerCase().includes(q);
      const matchClient = inv.clientName.toLowerCase().includes(q);
      return matchNum || matchClient;
    }

    return true;
  });

  const totalPages = Math.ceil(filteredInvoices.length / pageSize) || 1;
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getWhatsAppLink = (inv: Invoice) => {
    const text = encodeURIComponent(
      `Bonjour ${inv.clientName},\nVoici votre facture ${inv.number} émise via EasyFacturation (Prunus Engineering SARL) d'un montant de ${formatFCFA(
        inv.total
      )}.\nÉchéance : ${formatDate(inv.dueDate)}.\nMerci de procéder au règlement (MTN MoMo: *126#, Orange Money: *150# ou Virement).`
    );
    return `https://wa.me/?text=${text}`;
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
      {/* Table Header with Tabs & Search */}
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600" />
            {isDashboard ? "Dernières factures émises" : "Registre des factures"}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Suivi des émissions et encaissements au Cameroun (Douala & Yaoundé)
          </p>
        </div>

        {/* Filter Tabs & Search */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Tabs with hover effects */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            {[
              { id: "all", label: "Toutes" },
              { id: "paid", label: "Payées" },
              { id: "sent", label: "En cours" },
              { id: "overdue", label: "En retard" },
              { id: "draft", label: "Brouillons" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input with Hover effect */}
          <div className="group/table-search relative transition-all duration-200">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400 transition-colors group-hover/table-search:text-blue-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="N° ou client..."
              className="h-8 rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs text-slate-800 placeholder-slate-400 transition-all duration-200 group-hover/table-search:border-blue-400 group-hover/table-search:bg-white group-hover/table-search:shadow-xs focus:border-blue-600 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/70 text-slate-500 uppercase tracking-wider text-[11px] font-semibold dark:bg-slate-800/50 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
            <tr>
              <th className="py-3 px-4 w-10">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </th>
              <th className="py-3 px-4">N° Facture</th>
              <th className="py-3 px-4">Client</th>
              <th className="py-3 px-4">Émise le</th>
              <th className="py-3 px-4">Échéance</th>
              <th className="py-3 px-4">Montant TTC</th>
              <th className="py-3 px-4">Statut (Interactif)</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {paginatedInvoices.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-slate-400">
                  Aucune facture trouvée pour ces filtres.
                </td>
              </tr>
            ) : (
              paginatedInvoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </td>

                  {/* Number */}
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                    <Link
                      href={`/factures/${inv.id}`}
                      className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 group-hover:underline transition-colors"
                    >
                      {inv.number}
                    </Link>
                  </td>

                  {/* Client */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {inv.clientName}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {inv.clientCity || "Cameroun"}
                      </span>
                    </div>
                  </td>

                  {/* Issue Date */}
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    {formatDate(inv.issueDate)}
                  </td>

                  {/* Due Date */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`font-medium ${
                        inv.status === "overdue"
                          ? "text-rose-600 font-bold dark:text-rose-400"
                          : "text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {formatDate(inv.dueDate)}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {formatFCFA(inv.total)}
                      </span>
                      {inv.balanceDue > 0 && inv.status === "partial" && (
                        <span className="text-[10px] text-amber-600 font-semibold">
                          Reste: {formatFCFA(inv.balanceDue)}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Interactive Status Dropdown */}
                  <td className="py-3.5 px-4">
                    <StatusDropdown
                      type="invoice"
                      currentStatus={inv.status}
                      onStatusChange={(newStatus) => handleStatusChange(inv.id, newStatus)}
                    />
                  </td>

                  {/* Actions with rich hover states */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 opacity-90 group-hover:opacity-100">
                      {/* WhatsApp share */}
                      <a
                        href={getWhatsAppLink(inv)}
                        target="_blank"
                        rel="noreferrer"
                        title="Partager sur WhatsApp"
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-400 transition-all duration-200 hover:scale-115 active:scale-95"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </a>

                      {/* Download PDF simulation */}
                      <button
                        title="Télécharger le PDF"
                        onClick={() => alert(`Téléchargement de la facture ${inv.number} au format PDF.`)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/50 dark:hover:text-blue-400 transition-all duration-200 hover:scale-115 active:scale-95 cursor-pointer"
                      >
                        <Download className="h-4 w-4" />
                      </button>

                      {/* View details */}
                      <Link
                        href={`/factures/${inv.id}`}
                        title="Consulter"
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-all duration-200 hover:scale-115 active:scale-95"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>

                      {/* Delete action with confirmation modal */}
                      <button
                        type="button"
                        title="Supprimer la facture"
                        onClick={() => setInvoiceToDelete(inv)}
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
      </div>

      {/* Pagination Footer */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredInvoices.length}
        pageSize={pageSize}
        pageSizeOptions={[5, 10, 20]}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* Optional Dashboard link */}
      {isDashboard && (
        <div className="flex items-center justify-end p-3 px-5 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 bg-slate-50/50 dark:bg-slate-800/30 rounded-b-2xl">
          <Link
            href="/factures"
            className="font-bold text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 transition-all hover:translate-x-1 flex items-center gap-1"
          >
            <span>Accéder au registre complet des factures</span>
            <span>→</span>
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={Boolean(invoiceToDelete)}
        title="Supprimer cette facture ?"
        description={`Êtes-vous sûr de vouloir supprimer la facture ${invoiceToDelete?.number} (${invoiceToDelete?.clientName}) ? Cette opération réajustera automatiquement les métriques comptables du client.`}
        itemLabel={`${invoiceToDelete?.number} • ${invoiceToDelete ? formatFCFA(invoiceToDelete.total) : ""}`}
        confirmButtonText="Oui, supprimer la facture"
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setInvoiceToDelete(null)}
      />
    </div>
  );
}
