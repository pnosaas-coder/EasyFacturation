import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PNO Facture Pro | Facturation & Gestion commerciale (zone FCFA)",
  description:
    "Application SaaS de facturation pour entrepreneurs africains. Suivi des factures, devis, paiements partiels et trésorerie en FCFA.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-['Plus_Jakarta_Sans',sans-serif] antialiased min-h-screen bg-slate-50 dark:bg-slate-950">
        {children}
      </body>
    </html>
  );
}
