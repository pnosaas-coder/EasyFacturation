"use client";

import React from "react";
import Link from "next/link";
import { Zap, Heart } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-[#0B111E] text-slate-400 text-sm py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Column (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
                <Zap className="w-4 h-4 fill-white/20" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">EasyFacturation</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-400 border border-blue-800/50">
                PRO
              </span>
            </div>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Le logiciel de facturation intuitif et automatisé pensé pour les entreprises du
              Cameroun, Côte d'Ivoire, Sénégal et de toute la zone CEMAC &amp; UEMOA.
            </p>

            <div className="text-xs text-slate-300 font-medium pt-2 flex items-center gap-1.5">
              <span>Fait avec fierté en Afrique pour les bâtisseurs du continent</span>
              <span className="text-red-500">❤️</span>
            </div>
          </div>

          {/* Produit */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Produit</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#fonctionnalites" className="hover:text-white transition">
                  Factures &amp; Devis
                </a>
              </li>
              <li>
                <a href="#fonctionnalites" className="hover:text-white transition">
                  Calcul TVA CEMAC (19,25%)
                </a>
              </li>
              <li>
                <a href="#tarifs" className="hover:text-white transition">
                  Grille Tarifaire
                </a>
              </li>
              <li>
                <a href="#comment-ca-marche" className="hover:text-white transition">
                  Comment ça marche
                </a>
              </li>
            </ul>
          </div>

          {/* Régions Supportées */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Régions</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <span className="text-slate-300">Cameroun (FCFA - 19,25%)</span>
              </li>
              <li>
                <span className="text-slate-300">Côte d'Ivoire (FCFA - 18%)</span>
              </li>
              <li>
                <span className="text-slate-300">Sénégal (FCFA - 18%)</span>
              </li>
              <li>
                <span className="text-slate-300">Gabon &amp; Congo (CEMAC)</span>
              </li>
            </ul>
          </div>

          {/* Légal & Support */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Légal</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/login" className="hover:text-white transition">
                  Espace Utilisateur
                </Link>
              </li>
              <li>
                <span className="text-slate-400">Conforme OHADA &amp; DGI</span>
              </li>
              <li>
                <span className="text-slate-400">NIU &amp; RCCM intégrés</span>
              </li>
              <li>
                <a
                  href="mailto:contact@prunus-engineering.cm"
                  className="hover:text-white transition"
                >
                  contact@prunus-engineering.cm
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>© 2026 EasyFacturation PRO • Prunus Engineering SARL. Tous droits réservés.</div>
          <div className="flex items-center gap-6">
            <a
              href="https://wa.me/237677481161"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition flex items-center gap-1.5"
            >
              <span>WhatsApp Support (+237 677481161)</span>
            </a>
            <a href="#constat" className="hover:text-white transition">
              Haut de page ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
