import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PNO Facture Pro | Facturation & Gestion commerciale (zone FCFA)",
  description:
    "Application SaaS de facturation pour entrepreneurs africains. Suivi des factures, devis, paiements partiels et trésorerie en FCFA.",
};

import { Toaster } from "sonner";
import { CommandPalette } from "../components/shared/CommandPalette";
import { ThemeProvider } from "../components/shared/ThemeProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('pno_theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="font-['Plus_Jakarta_Sans',sans-serif] antialiased min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <ThemeProvider>
          {children}
          <CommandPalette />
          <Toaster position="top-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
