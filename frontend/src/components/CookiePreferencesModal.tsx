"use client";

/**
 * Cookie Preferences Modal - GDPR Compliant
 * 
 * Modale per la gestione granulare delle preferenze cookie:
 * - 🔒 Tecnici (sempre attivi)
 * - 📊 Statistici (Google Analytics 4)
 * - 📢 Marketing (Facebook Pixel - futuro)
 * - ⚙️ Funzionali (YouTube, Maps - futuri)
 * 
 * Conforme a: Linee guida Garante Privacy + EDPB Guidelines 05/2020
 */

import React, { useState, useEffect } from 'react';
import { useCookieConsent } from '@/contexts/CookieConsentContext';
import type { CookiePreferences } from '@/types/cookie-consent';

interface CookieCategoryInfo {
  id: keyof CookiePreferences;
  name: string;
  icon: string;
  description: string;
  examples: string;
  isRequired: boolean;
  legalBasis: string;
}

const COOKIE_CATEGORIES: CookieCategoryInfo[] = [
  {
    id: 'necessary',
    name: 'Cookie Tecnici',
    icon: '🔒',
    description: 'Essenziali per il funzionamento del sito. Permettono la navigazione e l\'utilizzo delle funzionalità di base.',
    examples: 'Cookie di sessione, autenticazione, preferenze lingua, CSRF protection',
    isRequired: true,
    legalBasis: 'Art. 122 Codice Privacy - Non richiedono consenso',
  },
  {
    id: 'analytics',
    name: 'Cookie Statistici',
    icon: '📊',
    description: 'Ci aiutano a capire come gli utenti interagiscono con il sito, fornendo informazioni aggregate.',
    examples: 'Google Analytics 4 (anonimizzato)',
    isRequired: false,
    legalBasis: 'Art. 6.1.a GDPR - Consenso esplicito',
  },
  {
    id: 'marketing',
    name: 'Cookie Marketing',
    icon: '📢',
    description: 'Utilizzati per mostrare pubblicità personalizzata e misurare l\'efficacia delle campagne.',
    examples: 'Facebook Pixel, Google Ads (attualmente non utilizzati)',
    isRequired: false,
    legalBasis: 'Art. 6.1.a GDPR - Consenso esplicito',
  },
  {
    id: 'functional',
    name: 'Cookie Funzionali',
    icon: '⚙️',
    description: 'Migliorano l\'esperienza utente con funzionalità avanzate (video, mappe, chat).',
    examples: 'YouTube embed, Google Maps, Stripe Checkout (attualmente non utilizzati)',
    isRequired: false,
    legalBasis: 'Art. 6.1.a GDPR - Consenso esplicito',
  },
];

export default function CookiePreferencesModal() {
  const { 
    showPreferences, 
    preferences, 
    closePreferences, 
    savePreferences,
    acceptAll,
    rejectAll,
  } = useCookieConsent();

  // Stato locale per le preferenze (prima del salvataggio)
  const [localPreferences, setLocalPreferences] = useState<CookiePreferences>(preferences);

  // Sincronizza stato locale con context
  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  // Non renderizzare se la modale è chiusa
  if (!showPreferences) return null;

  // Toggle singola categoria
  const toggleCategory = (category: keyof CookiePreferences) => {
    if (category === 'necessary') return; // Non modificabile
    
    setLocalPreferences(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Salva e chiudi
  const handleSave = () => {
    savePreferences(localPreferences);
  };

  // Chiudi senza salvare
  const handleClose = () => {
    setLocalPreferences(preferences); // Reset allo stato precedente
    closePreferences();
  };

  return (
    <>
      {/* Overlay backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-300"
        onClick={handleClose}
        aria-hidden="true"
      />
      
      {/* Modal container */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="preferences-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div 
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl pointer-events-auto animate-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-violet-500 to-fuchsia-500 p-6 md:p-8 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="preferences-modal-title" className="text-2xl md:text-3xl font-bold mb-2">
                  🍪 Preferenze Cookie
                </h2>
                <p className="text-white/90 text-sm md:text-base">
                  Personalizza le tue preferenze di consenso. Puoi modificarle in qualsiasi momento.
                </p>
              </div>
              
              {/* Pulsante chiudi */}
              <button
                onClick={handleClose}
                className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-white/50"
                aria-label="Chiudi modale"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Body - Categorie cookie */}
          <div className="p-6 md:p-8 space-y-6">
            {COOKIE_CATEGORIES.map((category) => (
              <div
                key={category.id}
                className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
                  localPreferences[category.id]
                    ? 'border-violet-300 bg-violet-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icona */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl shadow-md">
                    {category.icon}
                  </div>

                  {/* Contenuto */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {category.name}
                      </h3>
                      
                      {/* Toggle switch */}
                      <button
                        onClick={() => toggleCategory(category.id)}
                        disabled={category.isRequired}
                        className={`relative inline-flex h-8 w-14 flex-shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-violet-500/50 ${
                          localPreferences[category.id]
                            ? 'bg-violet-500'
                            : 'bg-gray-300'
                        } ${category.isRequired ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        role="switch"
                        aria-checked={localPreferences[category.id]}
                        aria-label={`Toggle ${category.name}`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
                            localPreferences[category.id] ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                      {category.description}
                    </p>

                    <div className="text-xs text-gray-500 space-y-1">
                      <p>
                        <strong className="text-gray-700">Esempi:</strong> {category.examples}
                      </p>
                      <p>
                        <strong className="text-gray-700">Base legale:</strong> {category.legalBasis}
                      </p>
                    </div>

                    {category.isRequired && (
                      <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-xs font-medium">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        Sempre attivi
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Info aggiuntive */}
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>📌 Nota:</strong> Puoi modificare le tue preferenze in qualsiasi momento 
                dal footer del sito o dalle impostazioni. Il consenso è valido per 6 mesi (EDPB Guidelines).
              </p>
            </div>
          </div>

          {/* Footer - Pulsanti azione */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 md:p-8">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Salva personalizzate */}
              <button
                onClick={handleSave}
                className="flex-1 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-violet-500/50"
              >
                💾 Salva preferenze
              </button>

              {/* Accetta tutti */}
              <button
                onClick={() => {
                  acceptAll();
                  closePreferences();
                }}
                className="flex-1 px-6 py-3.5 rounded-xl bg-white border-2 border-violet-300 text-violet-700 font-semibold hover:bg-violet-50 hover:border-violet-400 hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-violet-300/50"
              >
                ✅ Accetta tutti
              </button>

              {/* Rifiuta tutti */}
              <button
                onClick={() => {
                  rejectAll();
                  closePreferences();
                }}
                className="flex-1 px-6 py-3.5 rounded-xl bg-white border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-300/50"
              >
                ❌ Rifiuta tutti
              </button>
            </div>

            {/* Link documenti legali */}
            <div className="mt-4 text-center text-xs text-gray-500">
              <a href="/privacy" className="hover:text-violet-600 underline" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
              {" • "}
              <a href="/cookie-policy" className="hover:text-violet-600 underline" target="_blank" rel="noopener noreferrer">
                Cookie Policy
              </a>
              {" • "}
              <a href="/terms" className="hover:text-violet-600 underline" target="_blank" rel="noopener noreferrer">
                Termini di Servizio
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

