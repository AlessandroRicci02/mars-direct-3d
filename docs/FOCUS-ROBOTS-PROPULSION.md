# Grafica, robot e leggibilità delle scene

Aggiornamento del 13 ottobre 2026 sul progetto esistente. Restano identità Mars Direct, accenti arancioni, due parti e 21 capitoli. Nessuna dipendenza aggiunta.

- **Presentazione:** pulsanti con riempimento animato, navigazione con sottolineatura discreta, nuovi indicatori di avanzamento, titoli e inquadrature corretti. Il confronto fra motori ha un titolo più breve che evita la sovrapposizione con la timeline. Stile coerente con la direzione SpaceX già adottata, senza marchi o immagini SpaceX.
- **Confronto propulsivo:** un'unica partenza, NTP davanti al chimico e chimico davanti al NEP; arrivi separati, frenata, scia percorsa e stato di arrivo. I veicoli restano alla destinazione fino al replay. I 9/14/21 secondi sono esclusivamente durate interne dell'animazione, non stime di viaggio. La modalità con movimento ridotto mostra un confronto statico.
- **AI e robot umanoidi:** modelli articolati, carichi, banco di lavoro e pannello da manutenere. Tre viste: movimentazione carichi, manutenzione e possibilità umane. Un robot compare anche presso la manifattura marziana. Le note distinguono il futuro scenario marziano dalla ricerca reale su Valkyrie e spiegano autonomia locale, supervisione umana e robot specializzati complementari.
- **Focus 3D:** pulsante visibile e scorciatoia H per nascondere testi, pannelli, header e timeline; H/Esc ripristinano la lettura. La camera centra la scena senza azzerare l'animazione. Pausa, replay, etichette e navigazione rimangono disponibili. Le etichette hanno una preferenza distinta; gli elementi nascosti sono `inert`. Su telefono la vista occupa lo schermo, senza ereditare l'altezza dei capitoli di lettura.
- **Correzioni:** pausa e replay aggiornano gli indicatori prima del fotogramma successivo; la timeline mantiene visibile il capitolo attivo dopo un ridimensionamento senza spostare verticalmente la pagina; le corsie del confronto hanno spazio separato dal pannello anche su telefono.

## Verifica

La suite comprende 17 test Playwright: i controlli precedenti sui 21 capitoli e sei verifiche aggiuntive per ordine e persistenza degli arrivi, pausa/replay, Focus 3D, scene dei robot, movimento ridotto e separazione dei pannelli su mobile. Controlli aggiuntivi: percorso dei 21 capitoli in Focus 3D, camera, console, vista 1920×1080 e telefono 390×844.

Esito: **17 test superati sulla build di produzione**, `npm run build`, TypeScript, formattazione e `git diff --check` superati. Nessun errore di console nel percorso aggiuntivo dei 21 capitoli in Focus 3D. Verificato anche un telefono 320×568, con ripristino dell'interfaccia e navigazione raggiungibili.

Schermate in `artifacts/`: `final-propulsion-desktop.png`, `final-propulsion-mobile.png`, `final-robots-desktop.png`, `final-robots-focus-mobile.png`, `focus-audit-0.png` e `focus-audit-4.png`.

Il modello 3D è educativo: robot e impianti sono concetti semplificati, senza simulazione fisica delle attività o previsione dei tempi di volo. Il build mantiene l'avviso sulla dimensione del chunk Three.js, caricato separatamente dall'interfaccia.
