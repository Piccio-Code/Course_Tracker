"use client";

import Footer from "@/components/Footer";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-violet-950">
      
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
              🔒 Informativa Privacy
            </h1>
            <p className="text-white/60 text-lg">
              Ai sensi del Regolamento UE 2016/679 (GDPR) e del D.Lgs. 196/2003 (Codice Privacy)
            </p>
            <p className="text-white/40 text-sm mt-2">
              Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}
            </p>
          </div>

          {/* Contenuto */}
          <div className="prose prose-invert prose-violet max-w-none">
            <div className="rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-xl space-y-8">
              
              {/* Sezione 1: Titolare del Trattamento */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">1. Titolare del Trattamento</h2>
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-white/80">
                  <p className="font-semibold mb-2">⚠️ PLACEHOLDER - PERSONALIZZA QUESTI DATI:</p>
                  <ul className="space-y-1 text-sm">
                    <li><strong>Ragione Sociale:</strong> [Inserisci Nome/Ragione Sociale]</li>
                    <li><strong>Sede Legale:</strong> [Inserisci Indirizzo Completo]</li>
                    <li><strong>P.IVA/CF:</strong> [Inserisci Partita IVA]</li>
                    <li><strong>Email:</strong> [Inserisci Email]</li>
                    <li><strong>Email Privacy:</strong> privacy@[tuodominio.com]</li>
                    <li><strong>PEC:</strong> [Inserisci PEC se applicabile]</li>
                  </ul>
                </div>
              </section>

              {/* Sezione 2: Tipologie di dati raccolti */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">2. Dati Personali Raccolti</h2>
                <p className="text-white/70 mb-4">Raccogliamo e trattiamo le seguenti categorie di dati personali:</p>
                
                <div className="space-y-4">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">📝 Dati forniti dall'utente</h3>
                    <ul className="list-disc list-inside text-white/70 space-y-1 text-sm">
                      <li>Nome utente (username)</li>
                      <li>Indirizzo email</li>
                      <li>Password (criptata con algoritmo bcrypt)</li>
                      <li>Dati relativi ai corsi tracciati (titoli, progressi, note)</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">🔍 Dati raccolti automaticamente</h3>
                    <ul className="list-disc list-inside text-white/70 space-y-1 text-sm">
                      <li>Indirizzo IP (anonimizzato nei log dopo 7 giorni)</li>
                      <li>Browser e sistema operativo (User-Agent)</li>
                      <li>Cookie tecnici (sessione, autenticazione)</li>
                      <li>Cookie statistici (Google Analytics 4) - solo con consenso</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Sezione 3: Finalità e base giuridica */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">3. Finalità e Base Giuridica del Trattamento</h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-violet-500/20 border-b border-white/10">
                        <th className="text-left p-3 text-white font-semibold">Finalità</th>
                        <th className="text-left p-3 text-white font-semibold">Base Giuridica (GDPR)</th>
                        <th className="text-left p-3 text-white font-semibold">Dati Trattati</th>
                      </tr>
                    </thead>
                    <tbody className="text-white/70">
                      <tr className="border-b border-white/5">
                        <td className="p-3">Registrazione e gestione account</td>
                        <td className="p-3">Art. 6.1.b - Esecuzione contratto</td>
                        <td className="p-3">Username, email, password</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="p-3">Erogazione del servizio (tracciamento corsi)</td>
                        <td className="p-3">Art. 6.1.b - Esecuzione contratto</td>
                        <td className="p-3">Dati corsi, progressi, note</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="p-3">Analisi statistiche (Google Analytics)</td>
                        <td className="p-3">Art. 6.1.a - Consenso esplicito</td>
                        <td className="p-3">IP anonimizzato, comportamento navigazione</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="p-3">Elaborazione pagamenti (Stripe)</td>
                        <td className="p-3">Art. 6.1.b - Esecuzione contratto</td>
                        <td className="p-3">Dati pagamento (gestiti da Stripe)</td>
                      </tr>
                      <tr>
                        <td className="p-3">Sicurezza e prevenzione frodi</td>
                        <td className="p-3">Art. 6.1.f - Legittimo interesse</td>
                        <td className="p-3">IP, log accessi</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Sezione 4: Conservazione dati */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">4. Tempi di Conservazione</h2>
                <ul className="space-y-2 text-white/70">
                  <li>🗄️ <strong>Dati account:</strong> Fino alla cancellazione dell'account da parte dell'utente</li>
                  <li>📊 <strong>Dati statistici:</strong> 26 mesi (Google Analytics 4)</li>
                  <li>🔐 <strong>Log di sicurezza:</strong> 7 giorni (IP completi), poi anonimizzati</li>
                  <li>💳 <strong>Dati pagamenti:</strong> 10 anni (obbligo fiscale - Art. 2220 C.C.)</li>
                </ul>
              </section>

              {/* Sezione 5: Destinatari dei dati */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">5. Destinatari dei Dati</h2>
                <p className="text-white/70 mb-4">I tuoi dati possono essere comunicati a:</p>
                <ul className="space-y-2 text-white/70">
                  <li>🌐 <strong>Hosting provider:</strong> [Inserisci nome provider, es: AWS, Vercel]</li>
                  <li>📊 <strong>Google Analytics:</strong> Per statistiche anonimizzate (solo con consenso)</li>
                  <li>💳 <strong>Stripe:</strong> Per elaborazione pagamenti (Data Processor certificato)</li>
                  <li>⚖️ <strong>Autorità competenti:</strong> Solo su richiesta legale (Art. 6.1.c GDPR)</li>
                </ul>
              </section>

              {/* Sezione 6: Trasferimenti extra-UE */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">6. Trasferimenti Extra-UE</h2>
                <p className="text-white/70 mb-2">
                  Alcuni fornitori di servizi potrebbero trasferire dati al di fuori dello Spazio Economico Europeo (SEE):
                </p>
                <ul className="space-y-2 text-white/70">
                  <li>🇺🇸 <strong>Google Analytics:</strong> USA (Clausole Contrattuali Standard - SCC)</li>
                  <li>🇺🇸 <strong>Stripe:</strong> USA (Privacy Shield Certified + SCC)</li>
                </ul>
                <p className="text-white/60 text-sm mt-4">
                  Tutti i trasferimenti sono effettuati in conformità agli artt. 44-50 GDPR con garanzie adeguate.
                </p>
              </section>

              {/* Sezione 7: Diritti dell'interessato */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">7. I Tuoi Diritti (Artt. 15-22 GDPR)</h2>
                <p className="text-white/70 mb-4">Hai il diritto di:</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <h3 className="text-white font-semibold mb-2">✅ Diritto di accesso (Art. 15)</h3>
                    <p className="text-white/60 text-sm">Ottenere conferma del trattamento e copia dei dati</p>
                  </div>
                  
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <h3 className="text-white font-semibold mb-2">✏️ Diritto di rettifica (Art. 16)</h3>
                    <p className="text-white/60 text-sm">Correggere dati inesatti o incompleti</p>
                  </div>
                  
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <h3 className="text-white font-semibold mb-2">🗑️ Diritto alla cancellazione (Art. 17)</h3>
                    <p className="text-white/60 text-sm">Richiedere la cancellazione dei dati (diritto all'oblio)</p>
                  </div>
                  
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <h3 className="text-white font-semibold mb-2">🚫 Diritto di opposizione (Art. 21)</h3>
                    <p className="text-white/60 text-sm">Opporsi al trattamento per motivi legittimi</p>
                  </div>
                  
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <h3 className="text-white font-semibold mb-2">📦 Diritto alla portabilità (Art. 20)</h3>
                    <p className="text-white/60 text-sm">Ricevere i dati in formato strutturato</p>
                  </div>
                  
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <h3 className="text-white font-semibold mb-2">⏸️ Diritto di limitazione (Art. 18)</h3>
                    <p className="text-white/60 text-sm">Limitare il trattamento in determinati casi</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl">
                  <p className="text-white/80 font-semibold mb-2">📧 Come esercitare i tuoi diritti:</p>
                  <p className="text-white/70 text-sm">
                    Invia una richiesta via email a:{" "}
                    <a href="mailto:privacy@example.com" className="text-violet-400 hover:text-violet-300 underline">
                      privacy@[tuodominio.com]
                    </a>
                  </p>
                  <p className="text-white/60 text-xs mt-2">
                    Ti risponderemo entro 30 giorni (Art. 12.3 GDPR). 
                    Se non sei soddisfatto, puoi presentare reclamo al Garante Privacy: 
                    <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/80">
                      www.garanteprivacy.it
                    </a>
                  </p>
                </div>
              </section>

              {/* Sezione 8: Cookie */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">8. Cookie</h2>
                <p className="text-white/70 mb-4">
                  Utilizziamo cookie tecnici (necessari) e, con il tuo consenso, cookie statistici. 
                  Per maggiori informazioni consulta la nostra{" "}
                  <Link href="/cookie-policy" className="text-violet-400 hover:text-violet-300 underline">
                    Cookie Policy
                  </Link>.
                </p>
              </section>

              {/* Sezione 9: Modifiche */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">9. Modifiche all'Informativa</h2>
                <p className="text-white/70">
                  Ci riserviamo il diritto di modificare questa informativa. 
                  Le modifiche saranno pubblicate su questa pagina con la data di aggiornamento. 
                  Ti consigliamo di consultarla periodicamente.
                </p>
              </section>

              {/* Sezione 10: Contatti */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">10. Contatti</h2>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-white/70">
                    <strong>Titolare del Trattamento:</strong><br />
                    [Inserisci Nome/Ragione Sociale]<br />
                    [Inserisci Indirizzo]<br />
                    Email: <a href="mailto:privacy@example.com" className="text-violet-400 hover:text-violet-300 underline">privacy@[tuodominio.com]</a><br />
                    PEC: [Inserisci PEC]
                  </p>
                </div>
              </section>

            </div>
          </div>

          {/* CTA Gestione Privacy */}
          <div className="mt-12 grid md:grid-cols-3 gap-4">
            <Link
              href="/cookie-policy"
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 text-center"
            >
              <div className="text-3xl mb-3">🍪</div>
              <h3 className="text-white font-semibold mb-2">Cookie Policy</h3>
              <p className="text-white/60 text-sm">Dettagli sui cookie utilizzati</p>
            </Link>

            <Link
              href="/terms"
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 text-center"
            >
              <div className="text-3xl mb-3">📄</div>
              <h3 className="text-white font-semibold mb-2">Termini di Servizio</h3>
              <p className="text-white/60 text-sm">Condizioni d'uso del servizio</p>
            </Link>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="p-6 rounded-2xl bg-violet-500/20 border border-violet-500/30 hover:bg-violet-500/30 hover:border-violet-500/50 transition-all duration-200 text-center"
            >
              <div className="text-3xl mb-3">⬆️</div>
              <h3 className="text-white font-semibold mb-2">Torna su</h3>
              <p className="text-white/60 text-sm">Ritorna all'inizio della pagina</p>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

