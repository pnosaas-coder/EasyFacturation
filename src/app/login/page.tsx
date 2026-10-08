import React, { Suspense } from "react";
import { LoginClient } from "./LoginClient";

export const metadata = {
  title: "Connexion | EasyFacturation PRO",
  description: "Authentification et accès sécurisé à l'application EasyFacturation PRO.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900" />}>
      <LoginClient />
    </Suspense>
  );
}
