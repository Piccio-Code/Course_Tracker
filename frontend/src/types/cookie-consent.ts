/**
 * GDPR Cookie Consent Management Types
 * 
 * Questi tipi definiscono la struttura per la gestione del consenso
 * ai sensi dell'Art. 7 GDPR e della Direttiva ePrivacy 2002/58/CE
 */

/**
 * Categorie di cookie secondo le linee guida del Garante Privacy
 */
export type CookieCategory = 'necessary' | 'analytics' | 'marketing' | 'functional';

/**
 * Stato delle preferenze cookie dell'utente
 * 
 * - necessary: Cookie tecnici (sempre attivi, non richiedono consenso - Art. 122 Codice Privacy)
 * - analytics: Cookie statistici (Google Analytics, Plausible, etc.)
 * - marketing: Cookie di profilazione (Facebook Pixel, Google Ads, etc.)
 * - functional: Cookie funzionali (video embed, mappe, chat support)
 */
export interface CookiePreferences {
  necessary: boolean;      // Sempre true (non modificabile)
  analytics: boolean;      // Google Analytics 4
  marketing: boolean;      // Facebook Pixel, Google Ads (futuri)
  functional: boolean;     // YouTube embed, Google Maps (futuri)
}

/**
 * Stato completo del consent management
 */
export interface CookieConsentState {
  /** Indica se l'utente ha già espresso le sue preferenze */
  hasConsented: boolean;
  
  /** Timestamp dell'ultima modifica delle preferenze (ISO 8601) */
  consentDate: string | null;
  
  /** Preferenze cookie correnti */
  preferences: CookiePreferences;
  
  /** Indica se il banner deve essere visibile */
  showBanner: boolean;
  
  /** Indica se la modale delle preferenze è aperta */
  showPreferences: boolean;
}

/**
 * Azioni disponibili per modificare lo stato del consenso
 */
export interface CookieConsentActions {
  /** Accetta tutte le categorie di cookie */
  acceptAll: () => void;
  
  /** Rifiuta tutti i cookie non necessari (solo tecnici) */
  rejectAll: () => void;
  
  /** Salva preferenze personalizzate dall'utente */
  savePreferences: (preferences: Partial<CookiePreferences>) => void;
  
  /** Apre la modale delle preferenze */
  openPreferences: () => void;
  
  /** Chiude la modale delle preferenze */
  closePreferences: () => void;
  
  /** Reset completo delle preferenze (per testing/debug) */
  resetConsent: () => void;
}

/**
 * Context value completo per il Cookie Consent
 */
export interface CookieConsentContextValue extends CookieConsentState, CookieConsentActions {}

/**
 * Configurazione servizi terzi da bloccare/sbloccare
 * Usato per il "preventive blocking" richiesto dal GDPR
 */
export interface ThirdPartyService {
  /** Nome del servizio (es: "Google Analytics") */
  name: string;
  
  /** Categoria di appartenenza */
  category: CookieCategory;
  
  /** Script da iniettare quando il consenso è dato */
  script?: string;
  
  /** ID del servizio (es: "G-XXXXXXXXXX" per GA4) */
  serviceId?: string;
  
  /** Indica se il servizio è attualmente attivo */
  isActive: boolean;
}

/**
 * Storage key per localStorage (GDPR compliance)
 * Prefisso per evitare conflitti con altre applicazioni
 */
export const CONSENT_STORAGE_KEY = 'coursetracker_cookie_consent';

/**
 * Durata validità consenso in giorni (6 mesi secondo EDPB Guidelines)
 */
export const CONSENT_EXPIRY_DAYS = 180;

