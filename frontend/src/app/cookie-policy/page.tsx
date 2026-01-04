"use client";

import PageBackground from "@/components/PageBackground";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useCookieConsent } from "@/contexts/CookieConsentContext";

export default function CookiePolicy() {
  const { openPreferences } = useCookieConsent();

  return (
    <div className="relative min-h-screen bg-black">
      <PageBackground />
      
      <main className="relative z-10 px-6 py-24">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors mb-6"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Torna alla Home
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              🍪 Cookie Policy
            </h1>
            <p className="text-white/60 text-lg">
              Informativa estesa sull'uso dei cookie ai sensi della Direttiva 2002/58/CE (ePrivacy) e del GDPR
            </p>
            <p className="text-white/40 text-sm mt-2">
              Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}
            </p>
          </div>

          {/* Contenuto */}
          <div className="prose prose-invert prose-violet max-w-none space-y-8">
            
            {/* Sezione 1: Cosa sono i cookie */}
            <div className="rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-white mb-4">1. Cosa sono i Cookie?</h2>
              <p className="text-white/70 mb-4">
                I cookie sono piccoli file di testo che i siti web visitati dall'utente inviano al suo terminale 
                (solitamente al browser), dove vengono memorizzati per essere poi ritrasmessi agli stessi siti 
                alla successiva visita del medesimo utente.
              </p>
              <p className="text-white/70">
                I cookie servono a diverse funzionalità: eseguire autenticazioni informatiche, monitoraggio 
                di sessioni, memorizzazione di informazioni su specifiche configurazioni riguardanti gli utenti 
                che accedono al server, facilitare la navigazione, analisi e statistiche.
              </p>
            </div>

            {/* Sezione 2: Tipologie di cookie */}
            <div className="rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-white mb-4">2. Tipologie di Cookie Utilizzati</h2>
              
              {/* Cookie Tecnici */}
              <div className="mb-6 p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-3xl">🔒</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">Cookie Tecnici (Sempre Attivi)</h3>
                    <p className="text-white/70 text-sm mb-3">
                      Non richiedono consenso (Art. 122 Codice Privacy). Sono essenziali per il funzionamento del sito.
                    </p>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left p-2 text-white">Nome</th>
                        <th className="text-left p-2 text-white">Finalità</th>
                        <th className="text-left p-2 text-white">Durata</th>
                      </tr>
                    </thead>
                    <tbody className="text-white/70">
                      <tr className="border-b border-white/5">
                        <td className="p-2 font-mono text-xs">session_id</td>
                        <td className="p-2">Autenticazione utente</td>
                        <td className="p-2">Sessione</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="p-2 font-mono text-xs">csrf_token</td>
                        <td className="p-2">Protezione CSRF</td>
                        <td className="p-2">Sessione</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-mono text-xs">coursetracker_cookie_consent</td>
                        <td className="p-2">Memorizza preferenze cookie</td>
                        <td className="p-2">6 mesi</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Cookie Statistici */}
              <div className="mb-6 p-6 rounded-2xl bg-violet-500/10 border border-violet-500/20">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-3xl">📊</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">Cookie Statistici (Richiedono Consenso)</h3>
                    <p className="text-white/70 text-sm mb-3">
                      Utilizzati per raccogliere informazioni aggregate sull'uso del sito. 
                      Base giuridica: Consenso esplicito (Art. 6.1.a GDPR).
                    </p>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left p-2 text-white">Servizio</th>
                        <th className="text-left p-2 text-white">Cookie</th>
                        <th className="text-left p-2 text-white">Finalità</th>
                        <th className="text-left p-2 text-white">Durata</th>
                      </tr>
                    </thead>
                    <tbody className="text-white/70">
                      <tr className="border-b border-white/5">
                        <td className="p-2">Google Analytics 4</td>
                        <td className="p-2 font-mono text-xs">_ga, _ga_*</td>
                        <td className="p-2">Statistiche anonimizzate visite</td>
                        <td className="p-2">2 anni</td>
                      </tr>
                      <tr>
                        <td className="p-2">Google Analytics 4</td>
                        <td className="p-2 font-mono text-xs">_gid</td>
                        <td className="p-2">Distinguere utenti</td>
                        <td className="p-2">24 ore</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 p-3 bg-white/5 rounded-lg">
                  <p className="text-xs text-white/60">
                    <strong className="text-white/80">Nota:</strong> Google Analytics è configurato con anonimizzazione IP 
                    e non raccoglie dati personali identificativi. 
                    Privacy Policy Google: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/80">
                      policies.google.com/privacy
                    </a>
                  </p>
                </div>
              </div>

              {/* Cookie Marketing */}
              <div className="mb-6 p-6 rounded-2xl bg-pink-500/10 border border-pink-500/20">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-3xl">📢</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">Cookie Marketing (Richiedono Consenso)</h3>
                    <p className="text-white/70 text-sm mb-3">
                      Attualmente non utilizziamo cookie di profilazione o marketing. 
                      Se in futuro dovessimo introdurli, chiederemo il tuo consenso esplicito.
                    </p>
                  </div>
                </div>
                
                <div className="p-3 bg-white/5 rounded-lg">
                  <p className="text-xs text-white/60">
                    ℹ️ <strong>Futuri servizi previsti:</strong> Facebook Pixel, Google Ads Remarketing 
                    (solo se attiverai esplicitamente questa categoria nelle preferenze cookie).
                  </p>
                </div>
              </div>

              {/* Cookie Funzionali */}
              <div className="p-6 rounded-2xl bg-green-500/10 border border-green-500/20">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-3xl">⚙️</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">Cookie Funzionali (Richiedono Consenso)</h3>
                    <p className="text-white/70 text-sm mb-3">
                      Cookie di terze parti per funzionalità avanzate (video, mappe, pagamenti).
                    </p>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left p-2 text-white">Servizio</th>
                        <th className="text-left p-2 text-white">Finalità</th>
                        <th className="text-left p-2 text-white">Privacy Policy</th>
                      </tr>
                    </thead>
                    <tbody className="text-white/70">
                      <tr className="border-b border-white/5">
                        <td className="p-2">Stripe</td>
                        <td className="p-2">Elaborazione pagamenti sicuri</td>
                        <td className="p-2">
                          <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300 underline text-xs">
                            stripe.com/privacy
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2">YouTube (futuro)</td>
                        <td className="p-2">Embed video corsi</td>
                        <td className="p-2">
                          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300 underline text-xs">
                            policies.google.com/privacy
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 p-3 bg-white/5 rounded-lg">
                  <p className="text-xs text-white/60">
                    <strong className="text-white/80">⚠️ Nota su Stripe:</strong> Stripe è considerato essenziale per il processo 
                    di checkout e non richiede consenso preventivo (necessario per l'esecuzione del contratto - Art. 6.1.b GDPR).
                  </p>
                </div>
              </div>
            </div>

            {/* Sezione 3: Gestione preferenze */}
            <div className="rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-white mb-4">3. Come Gestire le Preferenze Cookie</h2>
              
              <p className="text-white/70 mb-6">
                Puoi modificare le tue preferenze in qualsiasi momento utilizzando uno dei seguenti metodi:
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <button
                  onClick={openPreferences}
                  className="p-6 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
                >
                  <div className="text-3xl mb-3">⚙️</div>
                  <h3 className="font-bold mb-2">Gestisci Preferenze</h3>
                  <p className="text-sm text-white/90">
                    Apri il pannello di gestione cookie granulare
                  </p>
                </button>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-3xl mb-3">🌐</div>
                  <h3 className="text-white font-bold mb-2">Browser Settings</h3>
                  <p className="text-white/70 text-sm">
                    Puoi anche gestire i cookie dalle impostazioni del tuo browser
                  </p>
                </div>
              </div>

              {/* Istruzioni browser */}
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-sm text-white/70 mb-3">
                  <strong className="text-white">📖 Guide per browser:</strong>
                </p>
                <ul className="space-y-2 text-sm text-white/60">
                  <li>
                    • <strong>Chrome:</strong>{" "}
                    <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300 underline">
                      support.google.com/chrome/answer/95647
                    </a>
                  </li>
                  <li>
                    • <strong>Firefox:</strong>{" "}
                    <a href="https://support.mozilla.org/it/kb/Gestione%20dei%20cookie" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300 underline">
                      support.mozilla.org (Cookie)
                    </a>
                  </li>
                  <li>
                    • <strong>Safari:</strong>{" "}
                    <a href="https://support.apple.com/it-it/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300 underline">
                      support.apple.com (Safari)
                    </a>
                  </li>
                  <li>
                    • <strong>Edge:</strong>{" "}
                    <a href="https://support.microsoft.com/it-it/microsoft-edge/eliminare-i-cookie-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300 underline">
                      support.microsoft.com (Edge Cookie)
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Sezione 4: Durata consenso */}
            <div className="rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-white mb-4">4. Durata del Consenso</h2>
              <p className="text-white/70 mb-4">
                Il tuo consenso all'utilizzo dei cookie è valido per <strong className="text-white">6 mesi</strong> dalla 
                prima accettazione (in conformità alle linee guida EDPB 05/2020 sul consenso).
              </p>
              <p className="text-white/70">
                Allo scadere di questo periodo, ti verrà nuovamente richiesto il consenso attraverso il nostro banner cookie.
              </p>
            </div>

            {/* Sezione 5: Preventive Blocking */}
            <div className="rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-white mb-4">5. Preventive Blocking</h2>
              <p className="text-white/70 mb-4">
                In conformità alla normativa GDPR e alle linee guida del Garante Privacy, abbiamo implementato 
                il <strong className="text-white">"preventive blocking"</strong>:
              </p>
              <ul className="space-y-2 text-white/70">
                <li>✅ I cookie non necessari <strong className="text-white">non vengono installati</strong> fino all'espressione del consenso</li>
                <li>✅ Gli script di terze parti vengono bloccati preventivamente</li>
                <li>✅ Solo dopo il consenso esplicito i cookie vengono attivati</li>
              </ul>
            </div>

            {/* Sezione 6: Aggiornamenti */}
            <div className="rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-white mb-4">6. Modifiche alla Cookie Policy</h2>
              <p className="text-white/70">
                Ci riserviamo il diritto di modificare questa Cookie Policy in qualsiasi momento. 
                Le modifiche saranno pubblicate su questa pagina con la data di aggiornamento. 
                Se le modifiche sono sostanziali, ti chiederemo nuovamente il consenso.
              </p>
            </div>

            {/* Sezione 7: Contatti */}
            <div className="rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-white mb-4">7. Contatti</h2>
              <p className="text-white/70 mb-4">
                Per domande sulla nostra Cookie Policy o per esercitare i tuoi diritti:
              </p>
              <div className="p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl">
                <p className="text-white/80">
                  <strong>Email Privacy:</strong>{" "}
                  <a href="mailto:privacy@example.com" className="text-violet-400 hover:text-violet-300 underline">
                    privacy@[tuodominio.com]
                  </a>
                </p>
              </div>
            </div>

          </div>

          {/* CTA Links correlati */}
          <div className="mt-12 grid md:grid-cols-2 gap-4">
            <Link
              href="/privacy"
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 text-center"
            >
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="text-white font-semibold mb-2">Privacy Policy</h3>
              <p className="text-white/60 text-sm">Informativa completa sul trattamento dati</p>
            </Link>

            <Link
              href="/terms"
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 text-center"
            >
              <div className="text-3xl mb-3">📄</div>
              <h3 className="text-white font-semibold mb-2">Termini di Servizio</h3>
              <p className="text-white/60 text-sm">Condizioni d'uso del servizio</p>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}



