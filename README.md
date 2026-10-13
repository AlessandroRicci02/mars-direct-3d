# Mars Direct — The Road to Mars

An interactive educational 3D experience with two distinct parts: **Mars Direct — How we get there** (10 chapters) and **Beyond Mars Direct — Why build a spacefaring civilization?** (11 chapters). The original orange/dark identity and timeline remain, with a SpaceX-inspired presentation: bold uppercase titles, restrained navigation, outlined actions and more space for the scenes. No SpaceX branding or imagery is used.

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

**Focus 3D** (or **H**) clears titles, panels, header and timeline and smoothly centers the scene. Pause, replay, labels and chapter navigation remain available. **H**, **Escape** or **Show interface** restores the reading view without restarting the scene. Focus labels have a separate preference; hidden interface controls are inert. On a phone, Focus fills the viewport instead of retaining the taller reading layout.

In **Propulsion**, all vehicles share one departure clock: NTP arrives first, chemical second and NEP last, with progress trails and arrival readouts. Vehicles hold at the destination until replay. This is an illustrative mission, not calculated flight times or a universal ranking of propulsion systems. Reduced motion shows a static comparison with the same ordering.

In **AI & robots**, choose cargo handling, equipment maintenance or human possibilities. Articulated humanoid concept models demonstrate the first two tasks; the third returns to the wider question of science, culture and human purpose. A small helper robot also appears at the manufacturing stage of Mars industry. The worksite is a future concept under human supervision, not an existing Mars deployment; NASA Valkyrie research is linked in the notes.

Part II offers crew/cargo route emphasis, a selectable New World historical analogy, seven visible industrial development steps, water/material loops with make-up inputs and losses, chemical/NTP/NEP comparison, and distinct Mars/lunar/vehicle power systems. The final network progressively adds logistics, resources, surface power and industry; it stays complete until replay. Filters emphasize solid warm chemical routes, dashed green NTP routes or dotted blue NEP freight routes. The proposed historical trade triangle is a separate optional view. Longer explanations and sources live in chapter notes and About.

## Where the code lives

| File                                 | Purpose                                                                                                |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `src/data/mission.ts`                | Original ten chapters, copy, timing and scene modes                                                    |
| `src/data/beyond.ts`                 | Eleven future-facing chapters, epistemic labels and sources                                            |
| `src/data/development.ts`            | Seven industrial steps and six final-network development phases                                        |
| `src/data/propulsion.ts`             | Shared illustrative departure clock, separate arrival times and reduced-motion snapshot                |
| `src/data/solarSystem.ts`            | Planet dimensions, orbital radii and collision bounds                                                  |
| `src/data/orbitalMotion.ts`          | Accelerated circular orbits and illustrative solar transfer ellipse                                    |
| `src/hooks/useMission.ts`            | Two-part navigation, progress, clock, pause, replay and options                                        |
| `src/scene/MissionScene.tsx`         | Shared Canvas and scene selection                                                                      |
| `src/scene/CelestialBodies.tsx`      | Textured planets, atmosphere, Sun, illumination and moving labels                                      |
| `src/scene/Trajectories.tsx`         | Transfer marker, vehicle motion and future rendezvous                                                  |
| `src/scene/Spacecraft.tsx`           | ERV, shared crew habitat, rotating tether and astronauts                                               |
| `src/scene/MarsSurface.tsx`          | Landing, ISRU particles, filling tanks, reactor, rover and base                                        |
| `src/scene/SurfaceTerrain.tsx`       | Lightweight terrain, horizon and instanced rocks                                                       |
| `src/scene/BeyondScene.tsx`          | New World analogy, lunar routes, industry, loops, asteroids, propulsion, surface power, trade triangle |
| `src/scene/BeyondIntroduction.tsx`   | Part II opening, historical analogy and repeated logistics                                             |
| `src/scene/BeyondPrimitives.tsx`     | Reusable resource flows, stations, Moon, asteroids and sailing ship                                    |
| `src/scene/Infrastructure.tsx`       | Surface grids, heat/electricity/thrust diagram, radiators and electric freighters                      |
| `src/scene/LogisticsNetwork.tsx`     | Progressive final network and transportation filters                                                   |
| `src/scene/HumanoidRobots.tsx`       | Articulated humanoids, cargo and maintenance worksite                                                  |
| `src/scene/PropulsionComparison.tsx` | Separate propulsion lanes, trails, braking and held arrivals                                           |
| `src/ui/PropulsionReadout.tsx`       | Synchronized route progress and arrival status                                                         |
| `src/scene/CameraController.tsx`     | GSAP easing, responsive framing and bounded orbit controls                                             |
| `src/scene/SceneLabels.tsx`          | DOM labels projected from 3D anchors                                                                   |
| `src/ui/MissionUI.tsx`               | Existing visual interface, timeline, ISRU callout, epistemic notes and modal                           |
| `src/ui/BeyondControls.tsx`          | Compact chapter interactions, analogy banners, trade triangle and explanations                         |
| `src/styles.css`                     | Responsive styling                                                                                     |
| `src/presentation.css`               | Focused aerospace presentation pass and its responsive adjustments                                     |
| `public/textures/`                   | Local planet maps, attribution and license                                                             |

React, TypeScript, Vite, Three.js, React Three Fiber, Drei and GSAP power the experience. Fonts and textures are local; no API keys or backend are required. Internet access at runtime is only needed to open external references. Geometry is generated in code, terrain rocks are instanced, and pixel density is capped at 1.75.

The same `CrewHabitat` component appears in launch, tethered transit and on Mars. ERV #1 is fueled on Mars before crew departure; ERV #2 is separate. Surface equipment is separated, but real-world safety distances are not represented to scale.

## Scientific scope

**Visualization not to scale.** Part I presents a proposed historical architecture, not a scheduled mission. Part II explores concepts and long-term scenarios, not forecasts. Labels distinguish historical proposals, current technology, engineering concepts, Zubrin proposals and speculation.

Earth and Mars share a diameter scale (12,756 km and 6,792 km); mean orbital radii preserve approximately 1:1.524. Bodies and spacecraft are enlarged relative to distances. The Sun is separately size-compressed. Beyond Mars diagrams use their own explanatory scales.

Earth and Mars orbit in the same direction with periods proportional to 365.256 and 686.98 days. A transfer starts at the departure world's position and reaches the destination's **future** position. Chapters are pedagogical vignettes: phases reset between launch opportunities and are not one continuous ephemeris. The focus-centered ellipse is time-remapped for storytelling, not a physical Hohmann transfer, Lambert solution or mission optimization. A small vertical offset keeps enlarged vehicles outside enlarged planets. Launch/arrival maneuvers, inclinations and real ephemerides are omitted.

The first cargo crossing is shown as about eight months, matching Zubrin's 1995 description. Crew travel is represented as roughly six months, with launch opportunities roughly 26 months apart and about 18 months on the surface. Exact durations vary by proposal and trajectory. The original plant uses a **100 kW nuclear reactor** and **approximately 6 metric tonnes of liquid hydrogen delivered from Earth with the uncrewed ERV**. Atmospheric CO₂ is processed through Sabatier reaction and electrolysis, recycling hydrogen and storing methane and oxygen. Additional oxygen production completes the system. The chemistry graphic is a process overview, not a balanced net equation; notes give the individual reactions.

Extracting hydrogen from Martian ice is explicitly a **future/local-water variant**. Return propellant is verified before crew departure. AI-enabled cost reductions, broad Martian industrial independence, helium-3 fusion and a multiworld economy are conditional scenarios, not demonstrated capabilities. Electric thrusters exist; the depicted nuclear-electric logistics infrastructure is an engineering concept. Propulsion animations illustrate thrust patterns, not quantitative performance rankings.

The **New World analogy** is Robert Zubrin's historical argument comparing frontier economics, settlement creation, and technological spillovers to North America. Historical colonization involved conquest, displacement, and violence; the analogy is strictly limited to economic and technological frontier dynamics without romanticizing historical atrocities. Zubrin's **interplanetary trade triangle** (Earth → Mars → Asteroids → Earth) is a speculative economic model, and the extended 5-node solar economy is a broader conceptual extrapolation.

## Sources and assets

- [The Mars Society: Zubrin’s The New World on Mars (2024) and economic argument](https://www.marssociety.org/news/2024/02/24/new-robert-zubrin-book-the-new-world-on-mars-has-been-published/)
- [Robert Zubrin: Mars Direct (1995)](https://marspapers.org/paper/Zubrin_1995_3.pdf) — historical hydrogen, power, cargo transfer and surface-stay descriptions.
- [The Mars Society: Mars Direct Concepts](https://www.marssociety.org/concepts/mars-direct/)
- [NASA: Sabatier/electrolysis demonstration plant](https://ntrs.nasa.gov/citations/19970026756)
- [NASA planetary fact sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/)
- [NASA: lunar water and ices](https://science.nasa.gov/moon/moon-water-and-ices/)
- [NASA: in-situ resource utilization](https://www.nasa.gov/overview-in-situ-resource-utilization/)
- [NASA: space nuclear propulsion (NTP & NEP)](https://www.nasa.gov/space-technology-mission-directorate/tdm/space-nuclear-propulsion/)
- [NASA: Valkyrie humanoid robotics research](https://www.nasa.gov/technology/r5/)
- [NASA: fission surface power project](https://www.nasa.gov/directorates/stmd/fission-surface-power/)
- [NASA/JPL: near-Earth asteroid resources](https://cneos.jpl.nasa.gov/about/nea_resource.html)

Asset credits are in `public/textures/ATTRIBUTION.md`. Solar System Scope day, cloud, Mars and Sun maps are CC BY 4.0. Earth normal/ocean masks and the Moon map come from Three.js examples. Earth uses a separate cloud layer, subtle surface normals, an ocean roughness mask and a lit atmospheric rim. These are visualization assets, not precision measurements. This independent project is not affiliated with NASA, The Mars Society or SpaceX.

## Tests and screenshots

```powershell
npm run typecheck
npm test
npm run format:check
```

Playwright visits all 21 chapters, exercises interactions, verifies intercept math and orbital speed ratios, checks visible motion and pause, tests resize/mobile navigation, checks console errors and captures screenshots into `artifacts/`. Representative files: `01-introduction.png`, `chapter-2.png`, `chapter-4.png`, `chapter-6.png`, `beyond-2.png`, `beyond-7.png`, `beyond-8.png` and `beyond-10.png`.

On Windows, tests use Chrome at `C:/Program Files/Google/Chrome/Application/chrome.exe`. Adjust `playwright.config.ts` if necessary. On other systems, run `npx playwright install chromium`. Browser profiles and artifacts stay inside this workspace. Set `PLAYWRIGHT_BASE_URL` to `http://localhost:4173` to test an already running production preview. `npm run format` formats source and documentation.
