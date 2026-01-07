"use client";

/**
 * Cookie Banner - GDPR Compliant
 * 
 * Banner a 3 livelli conforme alle linee guida del Garante Privacy:
 * 1. Accetta tutti i cookie
 * 2. Rifiuta cookie non necessari
 * 3. Personalizza preferenze (apre modale)
 * 
 * Design: Tailwind CSS 4, responsive, accessibile (WCAG 2.1 AA)
 */

import React from 'react';
import { useCookieConsent } from '@/contexts/CookieConsentContext';

export default function CookieBanner() {
  const { showBanner, acceptAll, rejectAll, openPreferences } = useCookieConsent();

  // Non renderizzare se l'utente ha già espresso il consenso
  if (!showBanner) return null;

  return (
    <>
      {/* Overlay sfondo (opzionale) */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        aria-hidden="true"
      />
      
      {/* Banner principale */}
      <div
        role="dialog"
        aria-label="Gestione Cookie"
        aria-describedby="cookie-banner-description"
        className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-in slide-in-from-bottom duration-500"
      >
        <div className="mx-auto max-w-6xl rounded-3xl bg-white/95 backdrop-blur-xl border border-gray-200 shadow-2xl overflow-hidden">
          <div className="p-6 md:p-8">
            {/* Header con icona cookie */}
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-2xl">
                🍪
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Rispettiamo la tua privacy
                </h2>
                <p 
                  id="cookie-banner-description"
                  className="text-gray-600 text-sm md:text-base leading-relaxed"
                >
                  Utilizziamo cookie tecnici per garantire il corretto funzionamento del sito e, 
                  con il tuo consenso, cookie statistici per migliorare la tua esperienza. 
                  Puoi personalizzare le tue preferenze in qualsiasi momento.
                </p>
              </div>
            </div>

            {/* Informativa breve - GDPR Art. 13 */}
            <div className="mb-6 p-4 rounded-xl bg-gray-50 border border-gray-200">
              <p className="text-xs text-gray-600 leading-relaxed">
                <strong className="text-gray-900">Titolare del Trattamento:</strong> [Inserisci Nome/Azienda]
                <br />
                <strong className="text-gray-900">Finalità:</strong> Cookie tecnici (necessari), statistici (Google Analytics 4), funzionali (Stripe per pagamenti).
                <br />
                <strong className="text-gray-900">Base giuridica:</strong> Consenso esplicito (Art. 6.1.a GDPR) per cookie non necessari.
                <br />
                <a 
                  href="/privacy" 
                  className="text-violet-600 hover:text-violet-700 underline font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Leggi l'Informativa Privacy completa
                </a>
                {" • "}
                <a 
                  href="/cookie-policy" 
                  className="text-violet-600 hover:text-violet-700 underline font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Cookie Policy
                </a>
              </p>
            </div>

            {/* Pulsanti azione - Layout responsive */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Accetta tutti (Primary CTA) */}
              <button
                onClick={acceptAll}
                className="flex-1 sm:flex-initial sm:min-w-[180px] px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/40 hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-violet-500/50"
                aria-label="Accetta tutti i cookie"
              >
                Accetta tutti
              </button>

              {/* Rifiuta tutti (Secondary) */}
              <button
                onClick={rejectAll}
                className="flex-1 sm:flex-initial sm:min-w-[180px] px-6 py-3.5 rounded-xl bg-white border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-300/50"
                aria-label="Rifiuta cookie non necessari"
              >
                Rifiuta tutti
              </button>

              {/* Personalizza (Tertiary) */}
              <button
                onClick={openPreferences}
                className="flex-1 sm:flex-initial sm:min-w-[180px] px-6 py-3.5 rounded-xl bg-white border-2 border-violet-300 text-violet-700 font-semibold hover:bg-violet-50 hover:border-violet-400 hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-violet-300/50"
                aria-label="Personalizza preferenze cookie"
              >
                ⚙️ Personalizza
              </button>
            </div>

            {/* Note legali aggiuntive */}
            <p className="mt-4 text-xs text-gray-500 text-center">
              Cliccando "Accetta tutti" acconsenti all'uso di tutti i cookie. 
              I cookie tecnici sono sempre attivi e non richiedono consenso.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}




