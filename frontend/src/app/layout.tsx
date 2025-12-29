import type { Metadata } from "next";
import "./globals.css";
import { CookieConsentProvider } from "@/contexts/CookieConsentContext";
import CookieBanner from "@/components/CookieBanner";
import CookiePreferencesModal from "@/components/CookiePreferencesModal";

// ✅ GDPR-COMPLIANT: Font caricati localmente da /public/fonts/
// Rimuovendo l'import da next/font/google evitiamo il trasferimento
// dell'indirizzo IP dell'utente a Google senza consenso (violazione GDPR)

export const metadata: Metadata = {
  title: "Course Tracker - Gestisci i tuoi corsi",
  description: "La piattaforma definitiva per tracciare il tuo percorso di apprendimento",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" style={{ fontFamily: 'Geist, system-ui, sans-serif' }}>
      <body
        className="antialiased"
        style={{
          fontFamily: 'Geist, system-ui, sans-serif',
        }}
      >
        {/* 
          GDPR Cookie Consent Management
          - CookieConsentProvider: Context globale per gestione consenso
          - CookieBanner: Banner a 3 livelli (Accetta/Rifiuta/Personalizza)
          - CookiePreferencesModal: Modale per gestione granulare
        */}
        <CookieConsentProvider>
          {children}
          <CookieBanner />
          <CookiePreferencesModal />
        </CookieConsentProvider>
      </body>
    </html>
  );
}
