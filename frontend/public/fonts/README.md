# 📦 Font Files - GDPR Compliance

## Perché i font sono ospitati localmente?

In base alla **sentenza della Corte Regionale di Monaco (20/01/2022)**, caricare Google Fonts direttamente dalla CDN di Google viola il GDPR perché trasferisce l'indirizzo IP dell'utente a Google senza consenso esplicito.

**Soluzione:** Self-hosting dei font per evitare sanzioni (€250+ per violazione).

---

## 📥 Come scaricare i font Geist

### Opzione 1: Repository ufficiale Vercel (CONSIGLIATA)

1. Visita: https://github.com/vercel/geist-font
2. Clicca su "Code" → "Download ZIP"
3. Estrai lo ZIP e copia questi file nella cartella `public/fonts/`:
   - `Geist/dist/fonts/geist-sans/Geist-Regular.woff2`
   - `Geist/dist/fonts/geist-sans/Geist-Medium.woff2`
   - `Geist/dist/fonts/geist-sans/Geist-SemiBold.woff2`
   - `Geist/dist/fonts/geist-sans/Geist-Bold.woff2`
   - `GeistMono/dist/fonts/geist-mono/GeistMono-Regular.woff2`
   - `GeistMono/dist/fonts/geist-mono/GeistMono-Medium.woff2`
   - `GeistMono/dist/fonts/geist-mono/GeistMono-SemiBold.woff2`
   - `GeistMono/dist/fonts/geist-mono/GeistMono-Bold.woff2`

### Opzione 2: Conversione da Google Fonts Helper

1. Visita: https://gwfh.mranftl.com/fonts
2. Cerca "Inter" o "IBM Plex Sans" (alternative simili a Geist)
3. Scarica i file `.woff2`
4. **OPPURE** usa i font dal repository GitHub (consigliato)

---

## 📁 Struttura finale prevista

```
frontend/public/fonts/
├── README.md (questo file)
├── Geist-Regular.woff2
├── Geist-Medium.woff2
├── Geist-SemiBold.woff2
├── Geist-Bold.woff2
├── GeistMono-Regular.woff2
├── GeistMono-Medium.woff2
├── GeistMono-SemiBold.woff2
└── GeistMono-Bold.woff2
```

---

## ⚠️ IMPORTANTE

**NON committare questi file su Git se sono troppo grandi!**
Aggiungi al `.gitignore`:

```
# Font files (too large)
public/fonts/*.woff2
public/fonts/*.woff
public/fonts/*.ttf
```

Oppure usa un CDN self-hosted o un repository Git LFS.

---

## ✅ Verifica dell'installazione

Dopo aver copiato i file:
1. Riavvia il server Next.js: `npm run dev`
2. Apri DevTools → Network
3. Cerca le richieste ai font: dovrebbero essere `/fonts/Geist-*.woff2` (locale)
4. **NON** dovrebbero esserci richieste a `fonts.googleapis.com` o `fonts.gstatic.com`

---

## 📚 Riferimenti legali

- **Sentenza LG München I, 20.01.2022, Az. 3 O 17493/20**: https://rewis.io/urteile/urteil/lhm-20-01-2022-3-o-1749320/
- **Art. 6 GDPR**: Consenso esplicito per trasferimento dati personali
- **Linee guida Garante Privacy italiano**: https://www.garanteprivacy.it



