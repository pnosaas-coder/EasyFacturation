import type { Metadata } from "next";
import { LandingHeader } from "../components/landing/LandingHeader";
import { LandingHero } from "../components/landing/LandingHero";
import { LandingLogoCloud } from "../components/landing/LandingLogoCloud";
import { LandingProblems } from "../components/landing/LandingProblems";
import { LandingFeatures } from "../components/landing/LandingFeatures";
import { LandingHowItWorks } from "../components/landing/LandingHowItWorks";
import { LandingTestimonials } from "../components/landing/LandingTestimonials";
import { LandingPricing } from "../components/landing/LandingPricing";
import { LandingCtaBanner } from "../components/landing/LandingCtaBanner";
import { LandingFooter } from "../components/landing/LandingFooter";
import "../components/landing/landing.css";

export const metadata: Metadata = {
  title: "EasyFacturation PRO | La facturation simple et conforme pour les entrepreneurs africains",
  description:
    "Fini les factures sur Word et Excel. Facturez en quelques clics. Logiciel de facturation avec calcul automatique de la TVA (19,25% & 18%), relances WhatsApp, règlements MoMo en FCFA et conformité OHADA / CEMAC & UEMOA.",
  keywords: [
    "facturation cameroun",
    "facture fcfa",
    "logiciel facturation afrique",
    "devis cemac",
    "tva 19.25 cameroun",
    "mtn mobile money facture",
    "orange money facture",
    "easyfacturation pro",
    "prunus engineering",
  ],
};

export default function HomePage() {
  return (
    <div className="landing-page min-h-screen">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingLogoCloud />
        <LandingProblems />
        <LandingFeatures />
        <LandingHowItWorks />
        <LandingTestimonials />
        <LandingPricing />
        <LandingCtaBanner />
      </main>
      <LandingFooter />
    </div>
  );
}
