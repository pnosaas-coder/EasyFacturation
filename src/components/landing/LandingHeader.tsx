"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Menu, X, ArrowRight, ShieldCheck } from "lucide-react";

export function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fermer le menu mobile lors d'un clic sur un lien
  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3">
        <nav
          className={`landing-glass-nav border border-slate-200/80 rounded-2xl px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-xs transition-all duration-300 ${
            isScrolled ? "landing-glass-nav-scrolled" : ""
          }`}
          aria-label="Navigation principale"
        >
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group select-none">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30 group-hover:scale-105 group-hover:bg-blue-700 transition-all duration-200">
              <Zap className="w-5 h-5 fill-white/20 transition-transform duration-200 group-hover:rotate-12" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold tracking-tight text-slate-900">
                EasyFacturation
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200/60">
                PRO
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a
              href="#fonctionnalites"
              className="hover:text-blue-600 transition-colors duration-150 py-1"
            >
              Fonctionnalités
            </a>
            <a
              href="#comment-ca-marche"
              className="hover:text-blue-600 transition-colors duration-150 py-1"
            >
              Comment ça marche
            </a>
            <a
              href="#tarifs"
              className="hover:text-blue-600 transition-colors duration-150 py-1"
            >
              Tarifs
            </a>
            <a
              href="#temoignages"
              className="hover:text-blue-600 transition-colors duration-150 py-1"
            >
              Témoignages
            </a>
          </div>

          {/* Actions : Connexion & Commencer gratuitement (Desktop) */}
          <div className="hidden sm:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors py-2 px-1"
            >
              Connexion
            </Link>
            <Link
              href="/login?mode=register"
              className="landing-btn-cta-primary inline-flex items-center justify-center gap-1.5 text-sm font-bold text-white px-5 py-2.5 rounded-xl"
            >
              <span>Commencer gratuitement</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 sm:hidden">
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-700 hover:text-blue-600 px-2 py-1.5"
            >
              Connexion
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-all focus:outline-none"
              aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="landing-mobile-drawer sm:hidden mt-2 border border-slate-200/90 bg-white/95 backdrop-blur-xl rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col space-y-3 text-base font-semibold text-slate-800">
              <a
                href="#fonctionnalites"
                onClick={closeMenu}
                className="hover:text-blue-600 py-2 border-b border-slate-100 flex items-center justify-between"
              >
                <span>Fonctionnalités</span>
                <span className="text-xs text-slate-400">→</span>
              </a>
              <a
                href="#comment-ca-marche"
                onClick={closeMenu}
                className="hover:text-blue-600 py-2 border-b border-slate-100 flex items-center justify-between"
              >
                <span>Comment ça marche</span>
                <span className="text-xs text-slate-400">→</span>
              </a>
              <a
                href="#tarifs"
                onClick={closeMenu}
                className="hover:text-blue-600 py-2 border-b border-slate-100 flex items-center justify-between"
              >
                <span>Tarifs FCFA</span>
                <span className="text-xs text-slate-400">→</span>
              </a>
              <a
                href="#temoignages"
                onClick={closeMenu}
                className="hover:text-blue-600 py-2 border-b border-slate-100 flex items-center justify-between"
              >
                <span>Témoignages</span>
                <span className="text-xs text-slate-400">→</span>
              </a>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <Link
                href="/login"
                onClick={closeMenu}
                className="w-full text-center py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-800 hover:bg-slate-50 transition text-sm"
              >
                Connexion Fondateur & Compte
              </Link>
              <Link
                href="/login?mode=register"
                onClick={closeMenu}
                className="landing-btn-cta-primary w-full text-center py-3 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2"
              >
                <span>Créer un compte gratuit</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="pt-2 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% conforme zone CEMAC &amp; UEMOA</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
