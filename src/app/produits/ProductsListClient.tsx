"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Sidebar } from "../../components/layout/Sidebar";
import { Topbar } from "../../components/layout/Topbar";
import { formatFCFA } from "../../lib/format/money";
import { Product } from "../../lib/domain/types";
import { createProductAction, deleteProductAction } from "../../lib/actions/products";
import { DeleteConfirmationModal } from "../../components/shared/DeleteConfirmationModal";
import { Pagination } from "../../components/shared/Pagination";
import {
  Package,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
  Tag,
  CheckCircle2,
} from "lucide-react";

interface ProductsListClientProps {
  initialProducts: Product[];
}

export function ProductsListClient({ initialProducts }: ProductsListClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [unitPrice, setUnitPrice] = useState(250_000);
  const [taxRate, setTaxRate] = useState(19.25);
  const [unit, setUnit] = useState("prestation");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("La désignation de l'article est requise.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Ajout de la référence au catalogue...");

    try {
      const res = await createProductAction({
        name,
        description,
        unitPrice: Number(unitPrice) || 0,
        taxRate: Number(taxRate) || 19.25,
        unit,
      });

      if (res.success && res.data) {
        toast.success(`Référence « ${res.data.name} » ajoutée au catalogue !`, {
          id: toastId,
        });
        setProducts([res.data, ...products]);
        setName("");
        setDescription("");
        setUnitPrice(250_000);
        setModalOpen(false);
      } else {
        toast.error(res.error || "Erreur lors de l'ajout.", { id: toastId });
      }
    } catch {
      toast.error("Erreur inattendue.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete product confirmation state & handler
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);

  const handleConfirmDeleteProduct = async () => {
    if (!productToDelete) return;
    setIsDeletingProduct(true);
    const toastId = toast.loading("Suppression de la référence...");
    try {
      const res = await deleteProductAction(productToDelete.id);
      if (res.success) {
        toast.success(`Référence « ${productToDelete.name} » supprimée avec succès.`, { id: toastId });
        setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
        setProductToDelete(null);
      } else {
        toast.error(res.error || "Erreur lors de la suppression.", { id: toastId });
      }
    } catch {
      toast.error("Erreur inattendue.", { id: toastId });
    } finally {
      setIsDeletingProduct(false);
    }
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="flex min-h-screen bg-slate-50/70 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <div className="flex flex-1 flex-col overflow-x-hidden">
        <Topbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950 dark:text-white flex items-center gap-2">
                <Package className="h-6 w-6 text-blue-600" />
                Catalogue de Prestations & Produits
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Gérez vos tarifs, forfaits et références B2B pour les facturer en 1 clic.
              </p>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Nouvelle prestation</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par libellé ou description..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-xs font-medium text-slate-800 focus:border-blue-600 focus:outline-hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-100 bg-slate-50/70 font-bold uppercase tracking-wider text-[10px] text-slate-400 dark:border-slate-800 dark:bg-slate-900/60">
                  <tr>
                    <th className="py-3 px-4">Désignation</th>
                    <th className="py-3 px-4">Unité</th>
                    <th className="py-3 px-4 text-center">TVA Cameroun</th>
                    <th className="py-3 px-4 text-right">Prix unitaire (HT)</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {paginatedProducts.map((p) => (
                    <tr
                      key={p.id}
                      className="transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {p.name}
                        </div>
                        {p.description && (
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {p.description}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                        <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {p.unit || "prestation"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-700 dark:text-slate-300">
                        {p.taxRate}%
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">
                        {formatFCFA(p.unitPrice)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setProductToDelete(p)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50 dark:hover:text-rose-400 transition-all duration-200 hover:scale-115 active:scale-95 cursor-pointer"
                          title="Supprimer la référence"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {paginatedProducts.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        Aucun article correspondant dans le catalogue.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredProducts.length}
              pageSize={pageSize}
              pageSizeOptions={[5, 8, 15, 20]}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal for Product */}
      <DeleteConfirmationModal
        isOpen={Boolean(productToDelete)}
        title="Supprimer cette référence ?"
        description={`Êtes-vous certain de vouloir supprimer « ${productToDelete?.name} » du catalogue ?`}
        itemLabel={`${productToDelete?.name} • ${productToDelete ? formatFCFA(productToDelete.unitPrice) : ""} HT`}
        confirmButtonText="Oui, supprimer l'article"
        isDeleting={isDeletingProduct}
        onConfirm={handleConfirmDeleteProduct}
        onClose={() => setProductToDelete(null)}
      />

      {/* Modal Add Product */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Tag className="h-5 w-5 text-blue-600" />
                Ajouter une référence au catalogue
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Désignation de la prestation ou du produit *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Audit de sécurité SI / Infogérance mensuelle..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description détaillée
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Détail des livrables inclus..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Prix HT (FCFA) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    required
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(Number(e.target.value) || 0)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold text-slate-900 focus:border-blue-600 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    TVA Cameroun (%)
                  </label>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value) || 0)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Unité
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="prestation">Prestation</option>
                    <option value="jour">Jour / Homme</option>
                    <option value="mois">Mois</option>
                    <option value="forfait">Forfait</option>
                    <option value="licence">Licence</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition-all active:scale-95"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Enregistrer l'article</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
