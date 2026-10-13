# Revisione del progetto esistente

Passaggio di realismo, chiarezza e presentazione del 13 ottobre 2026. Il progetto resta quello esistente: React, Three.js, le due parti, la navigazione e l'identità Mars Direct. Nessuna nuova dipendenza.

## Cosa era già presente

- Dieci capitoli Mars Direct e undici capitoli Beyond Mars.
- Rapporti dimensionali Terra/Marte e raggi orbitali proporzionati; Sole e distanze compressi e dichiarati.
- Pianeti in movimento, trasferimenti verso una posizione futura, scie e indicazioni di direzione.
- Habitat condiviso fra lancio, viaggio e superficie; ERV distinti; concetto del tether.
- Terreno marziano, reattore, impianto ISRU, serbatoi, rover e astronauti.
- Note scientifiche, fonti, tastiera, pausa, replay, autoplay e test Playwright.

## Problemi trovati e interventi

| Area                    | Risultato del passaggio                                                                                                                                                                                                                                      |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Design                  | Titoli in maiuscolo più decisi, navigazione compatta, pulsanti a contorno, gerarchia più netta. Restano logo, arancio, scena e timeline. Riferimento visivo: sito SpaceX; nessun suo asset copiato.                                                          |
| Terra                   | Mappa diurna senza nuvole incorporate, nuvole separate, rilievo leggero, riflessi oceanici controllati e atmosfera illuminata. Eliminato l'effetto della sovrapposizione di due strati di nuvole.                                                            |
| Trasferimenti           | Separazione di ERV 2 dal Sole e dall'habitat, etichette più concise; conservati il rendez-vous futuro e il modello orbitale qualitativo.                                                                                                                     |
| Camera e mobile         | Inquadrature più ampie per l'industria, diagrammi riposizionati rispetto ai pannelli, più spazio alla scena ISRU su telefono, etichette trattenute entro i bordi laterali.                                                                                   |
| ISRU                    | Grafico compatto con origine di CO₂/H₂, circa 6 t importate e 100 kW. Indicatore di riempimento e messaggio sul propellente pronto prima della partenza dell'equipaggio. La variante futura è una nota separata e utilizzabile anche su mobile.              |
| Ingresso nella Parte II | Titolo di transizione e introduzione ai sistemi futuri. L'analogia storica resta una scelta consultabile, con la sua qualificazione.                                                                                                                         |
| Interazioni             | Analogia, rete di trasporto e capacità industriale cambiano effettivamente la scena. La crescita industriale mostra sette passaggi coerenti con il testo.                                                                                                    |
| Risorse e cicli         | Flussi con frecce, ingressi di energia e risorse di reintegro, perdite in uscita. Asteroide con unità estrattiva e destinazioni riconoscibili.                                                                                                               |
| Energia                 | Viste diverse per Marte, polo lunare e NEP. Nella NEP: calore → conversione → elettricità → propulsori, più ramo termico ai radiatori. Rete di superficie con solare e accumulo complementari.                                                               |
| Propulsione             | Freighter NEP distinto, radiatori e propulsori elettrici; rotazione prima della frenata per veicoli ad alta spinta. Confronto dichiaratamente qualitativo.                                                                                                   |
| Rete finale             | Crescita in sei fasi, senza ritorno ciclico allo stato iniziale. Filtri chimico/NTP/NEP con tratti diversi, nodi energetici di superficie e freighter in movimento. Triangolo storico separato dalla rete estesa.                                            |
| Testi e fonti           | Pannelli più brevi e approfondimenti nelle note. Corretti riferimenti bibliografici, generalizzazioni su logistica lunare e fissione, numeri di impulso specifico presentati come universali. Verificata la raggiungibilità dei nove riferimenti principali. |

## Limiti dichiarati

Il sito è una visualizzazione educativa. Le orbite circolari accelerate e la curva di trasferimento non sono effemeridi o una soluzione di missione. I veicoli sono ingranditi; impianti e distanze di sicurezza non sono in scala. Le reti industriali, l'autonomia economica e gli scenari sull'automazione sono possibilità, non previsioni. I diagrammi dei motori non confrontano tempi di volo calcolati.

## Verifica riproducibile

Esito: **11 test Playwright superati sulla build di produzione**, con visita dei 21 capitoli, controllo della console e viewport 1440×960, 1024×768, 390×844 e 844×390. `npm run build`, controllo TypeScript, `npm run format:check` e `git diff --check` superati. Resta l'avviso informativo di Vite sulla dimensione del chunk Three.js; il codice 3D viene caricato separatamente dall'interfaccia.

Controllo visivo finale aggiuntivo: apertura a 1920×1080, separazione delle etichette nel riciclo, ISRU e rete finale su telefono, preferenza di movimento ridotto. Nessun errore di console rilevato. Schermate finali: `final-overview-1920.png`, `final-resource-loop.png`, `final-isru-mobile.png` e `final-network-mobile.png`.

Le istruzioni Windows sono nel [README](../README.md). `npm test` percorre entrambe le parti, controlla tutti i selettori, orbite, pausa, camera, ridimensionamento e console. I nuovi test verificano che i selettori cambino le scene, che la rete completa persista e che la nota ISRU futura sia interattiva su telefono.

Schermate rappresentative sono disponibili in `artifacts/`: `01-introduction.png`, `chapter-2.png`, `chapter-4.png`, `chapter-6.png`, `beyond-2.png`, `beyond-7.png`, `beyond-8.png`, `network-complete.png`, `mobile-fuel-final.png` e `new-mobile-10.png`.
