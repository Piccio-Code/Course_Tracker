"use client";

/**
 * Cookie Consent Management Context - GDPR Compliant
 * 
 * Questo context gestisce:
 * - Stato delle preferenze cookie (localStorage persistente)
 * - Preventive blocking di script terzi
 * - Validazione temporale del consenso (6 mesi)
 * 
 * Base legale: Art. 7 GDPR + Direttiva ePrivacy 2002/58/CE
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  CookieConsentContextValue,
  CookieConsentState,
  CookiePreferences,
} from '@/types/cookie-consent';
import {
  CONSENT_STORAGE_KEY,
  CONSENT_EXPIRY_DAYS,
} from '@/types/cookie-consent';

/**
 * Preferenze di default: solo cookie tecnici (necessary)
 * Principio di "privacy by default" - Art. 25 GDPR
 */
const DEFAULT_PREFERENCES: CookiePreferences = {
  necessary: true,   // Sempre attivi (cookie di sessione, CSRF, autenticazione)
  analytics: false,  // Google Analytics - richiede consenso
  marketing: false,  // Facebook Pixel, Google Ads - richiede consenso
  functional: false, // YouTube, Maps - richiede consenso
};

/**
 * Stato iniziale del consent management
 */
const INITIAL_STATE: CookieConsentState = {
  hasConsented: false,
  consentDate: null,
  preferences: DEFAULT_PREFERENCES,
  showBanner: false,  // Verrà impostato a true dopo il mount lato client
  showPreferences: false,
};

// Context con valore di default
const CookieConsentContext = createContext<CookieConsentContextValue | undefined>(undefined);

/**
 * Provider per il Cookie Consent
 */
export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CookieConsentState>(INITIAL_STATE);

  /**
   * Verifica se il consenso è ancora valido (6 mesi)
   * EDPB Guidelines 05/2020 on consent
   */
  const isConsentValid = useCallback((consentDate: string | null): boolean => {
    if (!consentDate) return false;
    
    const consentTime = new Date(consentDate).getTime();
    const now = Date.now();
    const expiryTime = CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000; // 6 mesi in ms
    
    return (now - consentTime) < expiryTime;
  }, []);

  /**
   * Carica le preferenze da localStorage (solo lato client)
   */
  const loadPreferences = useCallback((): CookieConsentState => {
    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      
      if (!stored) {
        return { ...INITIAL_STATE, showBanner: true };
      }
      
      const parsed = JSON.parse(stored) as CookieConsentState;
      
      // Verifica validità temporale del consenso
      if (!isConsentValid(parsed.consentDate)) {
        console.log('[GDPR] Consenso scaduto, richiedendo nuovo consenso');
        localStorage.removeItem(CONSENT_STORAGE_KEY);
        return { ...INITIAL_STATE, showBanner: true };
      }
      
      return {
        ...parsed,
        showBanner: false, // Consenso già dato e valido
        showPreferences: false,
      };
    } catch (error) {
      console.error('[GDPR] Errore nel caricamento preferenze:', error);
      return { ...INITIAL_STATE, showBanner: true };
    }
  }, [isConsentValid]);

  /**
   * Salva le preferenze in localStorage
   */
  const saveToStorage = useCallback((newState: CookieConsentState) => {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(newState));
      console.log('[GDPR] Preferenze salvate:', newState.preferences);
    } catch (error) {
      console.error('[GDPR] Errore nel salvataggio preferenze:', error);
    }
  }, []);

  /**
   * Inizializza lo stato al mount (solo lato client)
   */
  useEffect(() => {
    const loaded = loadPreferences();
    setState(loaded);
  }, [loadPreferences]);

  /**
   * AZIONE: Accetta tutti i cookie
   * Base legale: Consenso esplicito (Art. 7 GDPR)
   */
  const acceptAll = useCallback(() => {
    const newState: CookieConsentState = {
      hasConsented: true,
      consentDate: new Date().toISOString(),
      preferences: {
        necessary: true,
        analytics: true,
        marketing: true,
        functional: true,
      },
      showBanner: false,
      showPreferences: false,
    };
    
    setState(newState);
    saveToStorage(newState);
    
    // Attiva i servizi terzi (Google Analytics, Stripe, etc.)
    activateThirdPartyServices(newState.preferences);
  }, [saveToStorage]);

  /**
   * AZIONE: Rifiuta tutti i cookie non necessari
   * Solo cookie tecnici (non richiedono consenso - Art. 122 Codice Privacy)
   */
  const rejectAll = useCallback(() => {
    const newState: CookieConsentState = {
      hasConsented: true,
      consentDate: new Date().toISOString(),
      preferences: DEFAULT_PREFERENCES, // Solo necessary = true
      showBanner: false,
      showPreferences: false,
    };
    
    setState(newState);
    saveToStorage(newState);
    
    console.log('[GDPR] Utente ha rifiutato cookie non necessari');
  }, [saveToStorage]);

  /**
   * AZIONE: Salva preferenze personalizzate
   */
  const savePreferences = useCallback((preferences: Partial<CookiePreferences>) => {
    const newState: CookieConsentState = {
      hasConsented: true,
      consentDate: new Date().toISOString(),
      preferences: {
        necessary: true, // Sempre attivo
        analytics: preferences.analytics ?? state.preferences.analytics,
        marketing: preferences.marketing ?? state.preferences.marketing,
        functional: preferences.functional ?? state.preferences.functional,
      },
      showBanner: false,
      showPreferences: false,
    };
    
    setState(newState);
    saveToStorage(newState);
    
    // Attiva/disattiva servizi in base alle preferenze
    activateThirdPartyServices(newState.preferences);
  }, [state.preferences, saveToStorage]);

  /**
   * AZIONE: Apri modale preferenze
   */
  const openPreferences = useCallback(() => {
    setState(prev => ({ ...prev, showPreferences: true }));
  }, []);

  /**
   * AZIONE: Chiudi modale preferenze
   */
  const closePreferences = useCallback(() => {
    setState(prev => ({ ...prev, showPreferences: false }));
  }, []);

  /**
   * AZIONE: Reset consenso (per testing/gestione utente)
   */
  const resetConsent = useCallback(() => {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
    setState({ ...INITIAL_STATE, showBanner: true });
    console.log('[GDPR] Consenso resettato');
  }, []);

  /**
   * Attiva i servizi terzi in base alle preferenze
   * Implementazione del "Preventive Blocking"
   */
  const activateThirdPartyServices = (preferences: CookiePreferences) => {
    // Google Analytics 4
    if (preferences.analytics) {
      console.log('[GDPR] Attivazione Google Analytics 4');
      // TODO: Iniettare script GA4 dinamicamente
      // window.gtag('consent', 'update', { analytics_storage: 'granted' });
    }
    
    // Stripe (payment processing - functional/necessary)
    // Stripe è considerato "necessario" per il funzionamento del checkout
    console.log('[GDPR] Stripe è sempre attivo (necessario per pagamenti)');
    
    // Marketing cookies (futuri)
    if (preferences.marketing) {
      console.log('[GDPR] Attivazione cookie marketing');
      // TODO: Facebook Pixel, Google Ads
    }
    
    // Functional cookies (futuri)
    if (preferences.functional) {
      console.log('[GDPR] Attivazione cookie funzionali');
      // TODO: YouTube embed, Google Maps
    }
  };

  const contextValue: CookieConsentContextValue = {
    ...state,
    acceptAll,
    rejectAll,
    savePreferences,
    openPreferences,
    closePreferences,
    resetConsent,
  };

  return (
    <CookieConsentContext.Provider value={contextValue}>
      {children}
    </CookieConsentContext.Provider>
  );
}

/**
 * Hook per accedere al Cookie Consent Context
 * 
 * @example
 * const { preferences, acceptAll } = useCookieConsent();
 */
export function useCookieConsent(): CookieConsentContextValue {
  const context = useContext(CookieConsentContext);
  
  if (!context) {
    throw new Error('useCookieConsent deve essere usato all\'interno di CookieConsentProvider');
  }
  
  return context;
}



