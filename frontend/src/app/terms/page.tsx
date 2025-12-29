"use client";

import PageBackground from "@/components/PageBackground";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function TermsOfService() {
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
              📄 Termini di Servizio
            </h1>
            <p className="text-white/60 text-lg">
              Condizioni Generali di Utilizzo del Servizio Course Tracker
            </p>
            <p className="text-white/40 text-sm mt-2">
              Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}
            </p>
          </div>

          {/* Contenuto */}
          <div className="prose prose-invert prose-violet max-w-none space-y-8">
            
            {/* Sezione 1: Accettazione */}
            <div className="rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-white mb-4">1. Accettazione dei Termini</h2>
              <p className="text-white/70 mb-4">
                Utilizzando il servizio <strong className="text-white">Course Tracker</strong>, accetti di essere vincolato 
                da questi Termini di Servizio. Se non accetti questi termini, non utilizzare il servizio.
              </p>
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <p className="text-white/80 text-sm">
                  ⚠️ <strong>Importante:</strong> Registrandoti e utilizzando il servizio, dichiari di aver letto, 
                  compreso e accettato integralmente questi Termini di Servizio e l'Informativa Privacy.
                </p>
              </div>
            </div>

            {/* Sezione 2: Descrizione servizio */}
            <div className="rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-white mb-4">2. Descrizione del Servizio</h2>
              <p className="text-white/70 mb-4">
                Course Tracker è una piattaforma web che permette agli utenti di:
              </p>
              <ul className="space-y-2 text-white/70 list-disc list-inside">
                <li>Tracciare i progressi dei propri corsi di apprendimento</li>
                <li>Organizzare risorse didattiche e note</li>
                <li>Visualizzare statistiche e report sui propri obiettivi</li>
                <li>Gestire il proprio percorso formativo in modo centralizzato</li>
              </ul>
              
              <div className="mt-4 p-4 bg-white/5 rounded-xl">
                <p className="text-white/60 text-sm">
                  <strong className="text-white/80">Fornitore del servizio:</strong><br />
                  [Inserisci Nome/Ragione Sociale]<br />
                  [Inserisci Indirizzo]<br />
                  P.IVA: [Inserisci P.IVA]<br />
                  Email: [Inserisci Email]
                </p>
              </div>
            </div>

            {/* Sezione 3: Registrazione account */}
            <div className="rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-white mb-4">3. Registrazione e Account</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">3.1 Requisiti di registrazione</h3>
                  <p className="text-white/70 mb-2">Per registrarti devi:</p>
                  <ul className="space-y-1 text-white/70 list-disc list-inside text-sm">
                    <li>Avere almeno 16 anni di età (o età minima richiesta nel tuo paese)</li>
                    <li>Fornire informazioni accurate e veritiere</li>
                    <li>Creare una password sicura (minimo 8 caratteri)</li>
                    <li>Accettare l'Informativa Privacy e questi Termini</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">3.2 Responsabilità dell'account</h3>
                  <p className="text-white/70 mb-2">Sei responsabile per:</p>
                  <ul className="space-y-1 text-white/70 list-disc list-inside text-sm">
                    <li>Mantenere la sicurezza della tua password</li>
                    <li>Tutte le attività che avvengono sotto il tuo account</li>
                    <li>Notificarci immediatamente in caso di accesso non autorizzato</li>
                  </ul>
                </div>

                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="text-white/80 text-sm">
                    🚫 <strong>Divieto:</strong> È vietato cedere, vendere o trasferire il proprio account a terzi. 
                    Ci riserviamo il diritto di sospendere o terminare account che violano questa policy.
                  </p>
                </div>
              </div>
            </div>

            {/* Sezione 4: Uso accettabile */}
            <div className="rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-white mb-4">4. Uso Accettabile del Servizio</h2>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">✅ Uso Consentito</h3>
                <ul className="space-y-2 text-white/70 list-disc list-inside text-sm">
                  <li>Utilizzo personale per scopi educativi e di auto-apprendimento</li>
                  <li>Condivisione di contenuti propri o per i quali hai i diritti</li>
                  <li>Interazione rispettosa con altri utenti (se presente funzionalità social)</li>
                </ul>
              </div>

              <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-3">🚫 Uso Vietato</h3>
                <p className="text-white/70 mb-3">È espressamente vietato:</p>
                <ul className="space-y-2 text-white/70 list-disc list-inside text-sm">
                  <li>Violare leggi applicabili o diritti di terzi</li>
                  <li>Caricare contenuti illegali, diffamatori, osceni o offensivi</li>
                  <li>Tentare di accedere a dati di altri utenti senza autorizzazione</li>
                  <li>Utilizzare bot, scraper o strumenti automatizzati senza autorizzazione</li>
                  <li>Sovraccaricare o danneggiare l'infrastruttura del servizio</li>
                  <li>Violare diritti di proprietà intellettuale</li>
                  <li>Impersonare altre persone o entità</li>
                  <li>Distribuire virus, malware o codice dannoso</li>
                </ul>
                
                <div className="mt-4 p-3 bg-red-500/20 rounded-lg">
                  <p className="text-white/90 text-sm font-semibold">
                    ⚖️ Violazioni gravi possono comportare la sospensione immediata dell'account e azioni legali.
                  </p>
                </div>
              </div>
            </div>

            {/* Sezione 5: Proprietà Intellettuale */}
            <div className="rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-white mb-4">5. Proprietà Intellettuale</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">5.1 Contenuti del Servizio</h3>
                  <p className="text-white/70 text-sm">
                    Tutti i diritti sul servizio Course Tracker (inclusi design, codice, loghi, interfaccia) 
                    sono di proprietà esclusiva di <strong className="text-white">[Inserisci Nome/Ragione Sociale]</strong>.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">5.2 I Tuoi Contenuti</h3>
                  <p className="text-white/70 text-sm mb-2">
                    Mantieni tutti i diritti sui contenuti che carichi (note, titoli corsi, descrizioni). 
                    Ci concedi una licenza limitata per:
                  </p>
                  <ul className="space-y-1 text-white/70 list-disc list-inside text-sm">
                    <li>Memorizzare e visualizzare i tuoi contenuti</li>
                    <li>Effettuare backup per sicurezza dei dati</li>
                    <li>Elaborare statistiche aggregate e anonimizzate</li>
                  </ul>
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <p className="text-white/80 text-sm">
                    ℹ️ <strong>Nota:</strong> Non utilizzeremo mai i tuoi contenuti privati per scopi pubblicitari 
                    o li condivideremo con terzi senza il tuo consenso esplicito.
                  </p>
                </div>
              </div>
            </div>

            {/* Sezione 6: Pagamenti (se applicabile) */}
            <div className="rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-white mb-4">6. Pagamenti e Abbonamenti</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl">
                  <p className="text-white/80 text-sm">
                    💰 <strong>Piano Freemium:</strong> Attualmente Course Tracker offre un piano gratuito con 
                    funzionalità di base. Piani premium potrebbero essere introdotti in futuro.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">6.1 Elaborazione Pagamenti</h3>
                  <p className="text-white/70 text-sm mb-2">
                    Se introdurremo piani a pagamento:
                  </p>
                  <ul className="space-y-1 text-white/70 list-disc list-inside text-sm">
                    <li>I pagamenti saranno elaborati tramite <strong className="text-white">Stripe</strong> (processore certificato PCI-DSS)</li>
                    <li>Non memorizziamo i dati della tua carta di credito nei nostri server</li>
                    <li>Riceverai ricevuta via email per ogni transazione</li>
                    <li>Diritto di recesso di 14 giorni (D.Lgs. 206/2005 - Codice del Consumo)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">6.2 Rimborsi</h3>
                  <p className="text-white/70 text-sm">
                    Politica rimborsi: [Inserisci policy specifica, es: rimborso completo entro 14 giorni, 
                    rimborso proporzionale dopo 14 giorni, ecc.]
                  </p>
                </div>
              </div>
            </div>

            {/* Sezione 7: Limitazione Responsabilità */}
            <div className="rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-white mb-4">7. Limitazione di Responsabilità</h2>
              
              <div className="space-y-4 text-white/70 text-sm">
                <p>
                  <strong className="text-white">7.1 "AS IS":</strong> Il servizio è fornito "così com'è" senza garanzie 
                  di alcun tipo, esplicite o implicite. Non garantiamo che il servizio sia privo di errori, 
                  interruzioni o perdite di dati.
                </p>
                
                <p>
                  <strong className="text-white">7.2 Backup:</strong> Pur effettuando backup regolari, ti consigliamo 
                  di mantenere copie locali dei tuoi dati importanti.
                </p>
                
                <p>
                  <strong className="text-white">7.3 Danni indiretti:</strong> Nei limiti consentiti dalla legge, 
                  non saremo responsabili per danni indiretti, incidentali, consequenziali o punitivi derivanti 
                  dall'uso o dall'impossibilità di uso del servizio.
                </p>

                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                  <p className="text-white/80">
                    ⚖️ <strong>Nota legale:</strong> Nulla di quanto contenuto in questi Termini limita la responsabilità 
                    in caso di dolo o colpa grave, o per violazioni che non possono essere escluse per legge 
                    (es: diritti del consumatore secondo il D.Lgs. 206/2005).
                  </p>
                </div>
              </div>
            </div>

            {/* Sezione 8: Modifiche e Sospensione */}
            <div className="rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-white mb-4">8. Modifiche al Servizio</h2>
              
              <p className="text-white/70 mb-4">
                Ci riserviamo il diritto di:
              </p>
              <ul className="space-y-2 text-white/70 list-disc list-inside text-sm">
                <li>Modificare, sospendere o interrompere il servizio (temporaneamente o permanentemente)</li>
                <li>Modificare questi Termini di Servizio con preavviso di 30 giorni</li>
                <li>Aggiornare funzionalità e caratteristiche del servizio</li>
              </ul>
              
              <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <p className="text-white/80 text-sm">
                  📧 <strong>Notifiche:</strong> Ti informeremo via email di modifiche sostanziali ai Termini o al servizio. 
                  L'uso continuato del servizio dopo le modifiche costituisce accettazione.
                </p>
              </div>
            </div>

            {/* Sezione 9: Terminazione */}
            <div className="rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-white mb-4">9. Terminazione dell'Account</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">9.1 Terminazione da parte tua</h3>
                  <p className="text-white/70 text-sm">
                    Puoi cancellare il tuo account in qualsiasi momento dalle impostazioni. 
                    I tuoi dati verranno eliminati entro 30 giorni (fatta salva la conservazione per obblighi legali).
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">9.2 Terminazione da parte nostra</h3>
                  <p className="text-white/70 text-sm mb-2">
                    Possiamo sospendere o terminare il tuo account se:
                  </p>
                  <ul className="space-y-1 text-white/70 list-disc list-inside text-sm">
                    <li>Violi questi Termini di Servizio</li>
                    <li>Usi il servizio in modo fraudolento o illegale</li>
                    <li>Non paghi eventuali somme dovute (piani premium futuri)</li>
                    <li>Su richiesta delle autorità competenti</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Sezione 10: Legge applicabile */}
            <div className="rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-white mb-4">10. Legge Applicabile e Foro Competente</h2>
              
              <p className="text-white/70 mb-4">
                Questi Termini sono regolati dalla legge italiana. 
                Per qualsiasi controversia derivante da questi Termini, sarà competente il Foro di{" "}
                <strong className="text-white">[Inserisci città/tribunale competente]</strong>.
              </p>
              
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <p className="text-white/80 text-sm">
                  🇪🇺 <strong>Consumatori UE:</strong> Se sei un consumatore secondo il D.Lgs. 206/2005, 
                  hai diritto alla protezione prevista dalle norme imperative del tuo paese di residenza.
                </p>
              </div>
            </div>

            {/* Sezione 11: Contatti */}
            <div className="rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-white mb-4">11. Contatti</h2>
              
              <p className="text-white/70 mb-4">
                Per domande su questi Termini di Servizio:
              </p>
              
              <div className="p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl">
                <p className="text-white/80 text-sm">
                  <strong>Titolare del Servizio:</strong><br />
                  [Inserisci Nome/Ragione Sociale]<br />
                  [Inserisci Indirizzo Completo]<br />
                  P.IVA: [Inserisci P.IVA]<br />
                  Email: <a href="mailto:info@example.com" className="text-violet-400 hover:text-violet-300 underline">info@[tuodominio.com]</a><br />
                  Email Legale: <a href="mailto:legal@example.com" className="text-violet-400 hover:text-violet-300 underline">legal@[tuodominio.com]</a>
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
              <p className="text-white/60 text-sm">Come trattiamo i tuoi dati personali</p>
            </Link>

            <Link
              href="/cookie-policy"
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 text-center"
            >
              <div className="text-3xl mb-3">🍪</div>
              <h3 className="text-white font-semibold mb-2">Cookie Policy</h3>
              <p className="text-white/60 text-sm">Informativa sui cookie utilizzati</p>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

