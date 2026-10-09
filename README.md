# Mars Direct — The Road to Mars

An interactive educational 3D experience with two distinct parts: **Mars Direct — How we get there** (10 chapters) and **Beyond Mars Direct — Why build a spacefaring civilization?** (11 chapters). The original orange/dark visual identity and chapter timeline are preserved.

# How to run the website

Step-by-step for Windows PowerShell:

1. Install Node.js if it is not already installed (from https://nodejs.org). Supported versions include Node 20.19+, 22.12+ and newer; validated with Node 24.
2. Open PowerShell.
3. Navigate to the project:

   ```powershell
   cd C:\Users\aleri\mars-direct-3d
   ```

4. Install dependencies if needed:

   ```powershell
   npm install
   ```

5. Start the development server:

   ```powershell
   npm run dev
   ```

6. Open the Local URL printed by Vite, normally:

   http://localhost:5173

7. To stop the server:

   Ctrl+C

## Production validation

```powershell
npm run build
```

This checks the TypeScript project and creates production files in `dist`. To view that build locally:

```powershell
npm run preview
```

Open the printed URL, normally http://localhost:4173. A Three.js chunk-size advisory may appear during build; 3D code is split from the initial UI and loads lazily.

## Using the experience

Choose **The mission** or **Beyond Mars** in the top navigation. The last Mars Direct chapter continues into Part II. Both parts have their own timeline. Next, Back and arrow keys change chapters; the timeline supports direct selection and horizontal scrolling on small screens.

Drag the scene to orbit, pause with the pause button or Space, toggle labels, replay a chapter, or enable Autoplay. Opening chapter notes pauses playback. Autoplay traverses both parts and stops at the end. Background tabs stop advancing time. Camera transitions use eased paths and are interrupted by another selection. Reduced-motion preferences disable cinematic camera flights and decorative motion.

Part II offers crew/cargo route emphasis, four Mars development stages, water/material loops, chemical/NTP/NEP comparison, Mars/lunar/vehicle power systems, and logistics filters. Longer explanations and sources live in chapter notes and About.

## Where the code lives

| File                             | Purpose                                                                 |
| -------------------------------- | ----------------------------------------------------------------------- |
| `src/data/mission.ts`            | Original ten chapters, copy, timing and scene modes                     |
| `src/data/beyond.ts`             | Eleven future-facing chapters, epistemic labels and sources             |
| `src/data/solarSystem.ts`        | Planet dimensions, orbital radii and collision bounds                   |
| `src/data/orbitalMotion.ts`      | Accelerated circular orbits and illustrative solar transfer ellipse     |
| `src/hooks/useMission.ts`        | Two-part navigation, progress, clock, pause, replay and options         |
| `src/scene/MissionScene.tsx`     | Shared Canvas and scene selection                                       |
| `src/scene/CelestialBodies.tsx`  | Textured planets, atmosphere, Sun, illumination and moving labels       |
| `src/scene/Trajectories.tsx`     | Transfer marker, vehicle motion and future rendezvous                   |
| `src/scene/Spacecraft.tsx`       | ERV, shared crew habitat, rotating tether and astronauts                |
| `src/scene/MarsSurface.tsx`      | Landing, ISRU particles, filling tanks, reactor, rover and base         |
| `src/scene/SurfaceTerrain.tsx`   | Lightweight terrain, horizon and instanced rocks                        |
| `src/scene/BeyondScene.tsx`      | Lunar routes, industry, loops, asteroids, propulsion, power and network |
| `src/scene/CameraController.tsx` | GSAP easing, responsive framing and bounded orbit controls              |
| `src/scene/SceneLabels.tsx`      | DOM labels projected from 3D anchors                                    |
| `src/ui/MissionUI.tsx`           | Existing visual interface, timeline, ISRU callout and modal notes       |
| `src/ui/BeyondControls.tsx`      | Compact chapter interactions and explanations                           |
| `src/styles.css`                 | Responsive styling                                                      |
| `public/textures/`               | Local planet maps, attribution and license                              |

React, TypeScript, Vite, Three.js, React Three Fiber, Drei and GSAP power the experience. Fonts and textures are local; no API keys or backend are required. Internet access at runtime is only needed to open external references. Geometry is generated in code, terrain rocks are instanced, and pixel density is capped at 1.75.

The same `CrewHabitat` component appears in launch, tethered transit and on Mars. ERV #1 is fueled on Mars before crew departure; ERV #2 is separate. Surface equipment is separated, but real-world safety distances are not represented to scale.

## Scientific scope

**Visualization not to scale.** Part I presents a proposed historical architecture, not a scheduled mission. Part II explores concepts and long-term scenarios, not forecasts. Labels distinguish historical proposals, current technology, engineering concepts and speculation.

Earth and Mars share a diameter scale (12,756 km and 6,792 km); mean orbital radii preserve approximately 1:1.524. Bodies and spacecraft are enlarged relative to distances. The Sun is separately size-compressed. Beyond Mars diagrams use their own explanatory scales.

Earth and Mars orbit in the same direction with periods proportional to 365.256 and 686.98 days. A transfer starts at the departure world's position and reaches the destination's **future** position. Chapters are pedagogical vignettes: phases reset between launch opportunities and are not one continuous ephemeris. The focus-centered ellipse is time-remapped for storytelling, not a physical Hohmann transfer, Lambert solution or mission optimization. A small vertical offset keeps enlarged vehicles outside enlarged planets. Launch/arrival maneuvers, inclinations and real ephemerides are omitted.

The first cargo crossing is shown as about eight months, matching Zubrin's 1995 description. Crew travel is represented as roughly six months, with launch opportunities roughly 26 months apart and about 18 months on the surface. Exact durations vary by proposal and trajectory. The original plant uses a **100 kW nuclear reactor** and **approximately 6 metric tonnes of liquid hydrogen delivered from Earth with the uncrewed ERV**. Atmospheric CO₂ is processed through Sabatier reaction and electrolysis, recycling hydrogen and storing methane and oxygen. Additional oxygen production completes the system. The chemistry graphic is a process overview, not a balanced net equation; notes give the individual reactions.

Extracting hydrogen from Martian ice is explicitly a **future/local-water variant**. Return propellant is verified before crew departure. AI-enabled cost reductions, broad Martian industrial independence, helium-3 fusion and a multiworld economy are conditional scenarios, not demonstrated capabilities. Electric thrusters exist; the depicted nuclear-electric logistics infrastructure is an engineering concept. Propulsion animations illustrate thrust patterns, not quantitative performance rankings.

## Sources and assets

- [The Mars Society: Mars Direct](https://www.marssociety.org/concepts/mars-direct/)
- [Robert Zubrin: Mars, America's New Frontier (1995)](https://marspapers.org/paper/Zubrin_1995_3.pdf) — historical hydrogen, power, cargo transfer and surface-stay descriptions.
- [NASA: Sabatier/electrolysis demonstration plant](https://ntrs.nasa.gov/citations/19970026756)
- [NASA planetary fact sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/)
- [NASA: lunar water and ices](https://science.nasa.gov/moon/moon-water-and-ices/)
- [NASA: in-situ resource utilization](https://www.nasa.gov/overview-in-situ-resource-utilization/)
- [NASA: space nuclear propulsion](https://www.nasa.gov/space-technology-mission-directorate/tdm/space-nuclear-propulsion/)
- [NASA: fission surface power](https://www.nasa.gov/directorates/stmd/fission-surface-power/)
- [NASA/JPL: near-Earth asteroid resources](https://cneos.jpl.nasa.gov/about/nea_resource.html)

Asset credits are in `public/textures/ATTRIBUTION.md`. Solar System Scope maps are CC BY 4.0; Earth and Moon maps come from Three.js examples. These are visualization assets, not precision measurements. This independent project is not affiliated with NASA or The Mars Society.

## Tests and screenshots

```powershell
npm run typecheck
npm test
npm run format:check
```

Playwright visits all 21 chapters, exercises interactions, verifies intercept math and orbital speed ratios, checks visible motion and pause, tests resize/mobile navigation, checks console errors and captures screenshots into `artifacts/`. Representative files: `01-introduction.png`, `chapter-2.png`, `chapter-4.png`, `chapter-6.png`, `beyond-2.png`, `beyond-7.png`, `beyond-8.png` and `beyond-10.png`.

On Windows, tests use Chrome at `C:/Program Files/Google/Chrome/Application/chrome.exe`. Adjust `playwright.config.ts` if necessary. On other systems, run `npx playwright install chromium`. Browser profiles and artifacts stay inside this workspace. Set `PLAYWRIGHT_BASE_URL` to `http://localhost:4173` to test an already running production preview. `npm run format` formats source and documentation.
