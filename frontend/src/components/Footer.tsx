"use client";

/**
 * Footer Legale - GDPR Compliant
 * 
 * Contiene:
 * - Link alle pagine legali obbligatorie (Privacy, Cookie, Termini)
 * - Dati del Titolare del Trattamento (P.IVA, Sede)
 * - Pulsante per gestire preferenze cookie
 * - Copyright e informazioni società
 * 
 * Requisiti: Art. 12 GDPR - Informazioni facilmente accessibili
 */

import React from 'react';
import Link from 'next/link';
import { useCookieConsent } from '@/contexts/CookieConsentContext';

export default function Footer() {
  const { openPreferences } = useCookieConsent();

  return (
    <footer className="relative border-t border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Colonna 1: Brand + Descrizione */}
          <div className="md:col-span-4">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-white">
                Course <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Tracker</span>
              </h3>
              <p className="mt-2 text-sm text-white/60 leading-relaxed">
                La piattaforma definitiva per tracciare il tuo percorso di apprendimento in modo semplice ed efficace.
              </p>
            </div>

            {/* Dati societari - GDPR Art. 13.1 */}
            <div className="mt-6 space-y-1 text-xs text-white/50">
              <p>
                <strong className="text-white/70">Titolare del Trattamento:</strong>
                <br />
                [Inserisci Nome/Ragione Sociale]
              </p>
              <p>
                <strong className="text-white/70">P.IVA:</strong> [Inserisci P.IVA]
              </p>
              <p>
                <strong className="text-white/70">Sede Legale:</strong> [Inserisci Indirizzo Completo]
              </p>
              <p>
                <strong className="text-white/70">Email Privacy:</strong>{" "}
                <a 
                  href="mailto:[Inserisci Email Privacy]" 
                  className="text-violet-400 hover:text-violet-300 underline"
                >
                  [Inserisci Email Privacy]
                </a>
              </p>
            </div>
          </div>

          {/* Colonna 2: Link Legali */}
          <div className="md:col-span-3">
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/80">
              Informazioni Legali
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-white/60 hover:text-white/90 transition-colors inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/cookie-policy"
                  className="text-sm text-white/60 hover:text-white/90 transition-colors inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"/>
                  </svg>
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-white/60 hover:text-white/90 transition-colors inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v2H7V5zm6 4H7v2h6V9zm-6 4h6v2H7v-2z" clipRule="evenodd" />
                  </svg>
                  Termini di Servizio
                </Link>
              </li>
              <li>
                {/* Pulsante per riaprire preferenze cookie */}
                <button
                  onClick={openPreferences}
                  className="text-sm text-white/60 hover:text-white/90 transition-colors inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  🍪 Gestisci Cookie
                </button>
              </li>
            </ul>
          </div>

          {/* Colonna 3: Supporto */}
          <div className="md:col-span-2">
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/80">
              Supporto
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/help"
                  className="text-sm text-white/60 hover:text-white/90 transition-colors"
                >
                  Centro Assistenza
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-white/60 hover:text-white/90 transition-colors"
                >
                  Contattaci
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-white/60 hover:text-white/90 transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonna 4: Social */}
          <div className="md:col-span-3">
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/80">
              Seguici
            </h4>
            <div className="flex gap-3">
              {/* Link social - aggiungi rel="noopener noreferrer" per sicurezza */}
              <a
                href="https://twitter.com/yourhandle"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white/90 hover:border-white/20 transition-all duration-200"
                aria-label="Twitter"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="https://github.com/yourhandle"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white/90 hover:border-white/20 transition-all duration-200"
                aria-label="GitHub"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/yourcompany"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white/90 hover:border-white/20 transition-all duration-200"
                aria-label="LinkedIn"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>

            {/* Badges compliance (opzionale) */}
            <div className="mt-6">
              <p className="text-xs text-white/40 mb-2">🔒 Protetto da HTTPS</p>
              <p className="text-xs text-white/40">✅ GDPR Compliant</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-white/10" />

        {/* Copyright + Note legali */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} Course Tracker. Tutti i diritti riservati.
          </p>
          
          <p className="text-xs text-white/30 max-w-md">
            I dati personali sono trattati in conformità al Regolamento UE 2016/679 (GDPR) 
            e al D.Lgs. 196/2003 (Codice Privacy).
          </p>
        </div>
      </div>
    </footer>
  );
}



