"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sidebar } from "../../components/layout/Sidebar";
import { Topbar } from "../../components/layout/Topbar";
import { formatFCFA } from "../../lib/format/money";
import {
  Users,
  Plus,
  Search,
  MessageSquare,
  Phone,
  Mail,
  Building2,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

interface ClientRecord {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
  taxId: string;
  totalBilled: number;
  balanceDue: number;
}

const mockClientsList: ClientRecord[] = [
  {
    id: "cli_1",
    name: "Sonatel Orange B2B",
    contactName: "Mme Aïda Diop",
    email: "pro@orange-sonatel.sn",
    phone: "+221 33 839 20 00",
    city: "Dakar, Sénégal",
    taxId: "NINEA 00123982",
    totalBilled: 6_984_000,
    balanceDue: 4_484_000,
  },
  {
    id: "cli_2",
    name: "Groupe SIFCA",
    contactName: "M. Kouamé Jean",
    email: "finances@sifca.ci",
    phone: "+225 27 20 25 50 00",
    city: "Abidjan, Côte d'Ivoire",
    taxId: "IFU CI-098273",
    totalBilled: 10_605_000,
    balanceDue: 0,
  },
  {
    id: "cli_3",
    name: "Baobab Banque Sénégal",
    contactName: "M. Mamadou Ndiaye",
    email: "compta@baobab.com",
    phone: "+221 77 654 32 10",
    city: "Dakar, Sénégal",
    taxId: "NINEA 00928374",
    totalBilled: 1_416_000,
    balanceDue: 1_416_000,
  },
  {
    id: "cli_4",
    name: "Wave Digital Finance CI",
    contactName: "Mme Salimata Touré",
    email: "ops@wave.ci",
    phone: "+225 07 08 09 10 11",
    city: "Abidjan, Côte d'Ivoire",
    taxId: "IFU CI-847291",
    totalBilled: 4_360_000,
    balanceDue: 860_000,
  },
];

export default function ClientsListPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = mockClientsList.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase())
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
                <span>Gestion</span>
                <span>/</span>
                <span className="text-slate-900 dark:text-white">Clients</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white flex items-center gap-2">
                <Users className="h-6 w-6 text-blue-600" />
                Répertoire clients & Entreprises
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Suivi du volume d'affaires et de l'état des créances par compte client.
              </p>
            </div>

            <button
              onClick={() => alert("Formulaire d'ajout client disponible")}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/25 hover:bg-blue-700 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Nouveau client</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom d'entreprise ou ville..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 focus:border-blue-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((cli) => (
              <div
                key={cli.id}
                className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 font-bold text-xs">
                      {cli.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        {cli.name}
                      </h3>
                      <p className="text-[11px] text-slate-400">{cli.city}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    <span>Contact : {cli.contactName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    <span className="truncate">{cli.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    <span>{cli.phone}</span>
                  </div>
                </div>

                {/* Financial stats for this client */}
                <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60 text-xs flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      CA Facturé
                    </span>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {formatFCFA(cli.totalBilled)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      Solde dû
                    </span>
                    <p
                      className={`font-bold ${
                        cli.balanceDue > 0
                          ? "text-rose-600 dark:text-rose-400"
                          : "text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {formatFCFA(cli.balanceDue)}
                    </p>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `Bonjour ${cli.contactName}, nous vous contactons concernant vos factures PNO.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-emerald-600 font-bold hover:underline"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  <Link
                    href={`/factures`}
                    className="inline-flex items-center gap-1 text-blue-600 font-bold hover:underline"
                  >
                    <span>Voir les factures</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
