import type { Mission } from '../hooks/useMission'

const sets: Record<number, [string, string][]> = {
  0: [
    ['all', 'The frontier question'],
    ['analogy', 'The New World analogy'],
    ['transport', 'Expeditions to networks'],
  ],
  1: [
    ['all', 'Both routes'],
    ['crew', 'Crew'],
    ['cargo', 'Cargo'],
  ],
  2: [
    ['all', 'Auto'],
    ['0', 'Outpost'],
    ['1', 'Resources'],
    ['2', 'Industry'],
    ['3', 'Partial autonomy'],
  ],
  5: [
    ['all', 'Water loop'],
    ['materials', 'Material loop'],
  ],
  8: [
    ['all', 'Compare all'],
    ['chemical', 'Chemical'],
    ['ntp', 'NTP'],
    ['nep', 'NEP'],
  ],
  9: [
    ['all', 'Mars power'],
    ['moon', 'Lunar power'],
    ['nep', 'NEP vehicle'],
  ],
  10: [
    ['all', 'All systems'],
    ['triangle', "Zubrin's trade triangle"],
    ['expanded', 'Extended solar network'],
    ['nep', 'NEP logistics'],
  ],
}

const propulsion: Record<string, string> = {
  all: 'Conceptual comparison — real mission performance depends on reactor power, vehicle mass, specific impulse, thrust, payload, trajectory, launch infrastructure, and mission duration.',
  chemical:
    'Chemical propulsion (High-thrust conventional transport): Mature technology, essential for high-acceleration burns, launch, and landing; limited by lower specific impulse (~450 s).',
  ntp: 'Nuclear Thermal Propulsion (Fast long-range transport): High thrust relative to electric, roughly 2× chemical specific impulse (~900 s). Highly attractive for reducing crew transit times and high-energy trajectories.',
  nep: 'Nuclear Electric Propulsion (Interplanetary cargo ship): Extremely high propellant efficiency (~3,000–5,000 s Isp) with continuous low thrust for heavy cargo and repeated logistics; requires long spiral departure phases and large radiator arrays.',
}

export function BeyondControls({ mission }: { mission: Mission }) {
  const { index, option, setOption } = mission

  const captions: Record<number, string> = {
    0:
      option === 'analogy'
        ? "Robert Zubrin's argument: Settling North America created value not merely by shipping commodities to Europe, but by establishing a new branch of human civilization that produced new science, industry, and institutions. Mars could follow a comparable path."
        : option === 'transport'
          ? 'Every frontier begins as an extraordinary, high-risk expedition. Through navigation, infrastructure, and economics, transatlantic movement became routine transport. Could interplanetary transport undergo a comparable transition?'
          : 'THE NEW WORLD ANALOGY · Mars may play a role in the new age of exploration analogous to North America in the previous age — creating a second productive center of human civilization.',
    1: 'The Moon: High-thrust chemical for crew & landings vs electric for slow cargo. Polar ice & regolith. Helium-3: Speculative — dependent on future fusion technology. Water from Mars to the Moon makes no logistical sense.',
    2: [
      'Stage 1: Earth-dependent base imports habitats, machinery, power systems, life-support, robotics, spare parts, and crew.',
      'Stage 2: Local ISRU & construction begins — water, oxygen, methane, and durable regolith structures.',
      'Stage 3: Industrial settlement adds controlled-environment agriculture, local energy grids, and components.',
      'Stage 4: Partially autonomous economy develops broader industrial capability. Long-term scenario.',
    ][option === 'all' ? mission.development : Number(option)],
    3: 'Solving extreme constraints (autonomous robotics, closed-loop life support, dust mitigation, recycling) could yield transformative dual-use technologies on Earth. No guaranteed economic returns promised.',
    4: 'One planet → Two worlds: Mars is not an easy emergency backup. For a long time, a Martian settlement remains dependent on Earth. True civilizational resilience develops only over very long timescales.',
    5:
      option === 'materials'
        ? 'Material loop: MATERIAL → PRODUCT → REPAIR → RECYCLE → NEW PRODUCT. Energy and make-up resources still enter.'
        : 'Water loop: WATER → HUMAN USE → RECOVERY → PURIFICATION → WATER. Losses still require make-up resources.',
    6: 'Speculative long-term scenario: If AI, robotics, and automation drastically lower the marginal cost of material production, humanity could direct greater freedom toward science, exploration, art, philosophy, meaning, and human flourishing.',
    7: 'Asteroid resources: Use space resources in space. Water, metals, silicates, and volatiles supply orbital depots, Moon, Mars, and deep-space vehicles rather than shipping raw ore to Earth.',
    8: propulsion[option],
    9:
      option === 'nep'
        ? 'NEP = Nuclear Electric Propulsion (reactor → electricity → thrusters for spacecraft propulsion). NEP is not the only power source in space.'
        : 'Surface Fission Power = reactor → electricity → habitats, ISRU, greenhouses, mining, and factories. Continuous abundant power independent of sunlight.',
    10:
      option === 'triangle'
        ? "Zubrin's Proposed Interplanetary Trade Triangle: Earth (high-tech goods & settlers) → Mars (food, supplies, equipment) → Asteroids (metals & raw materials) → Earth. Speculative long-term scenario."
        : option === 'expanded'
          ? 'Extended Solar-System Economy: Earth, Moon, Mars, Asteroids, and Orbital Infrastructure exchanging specialized electronics, local structures, water, volatiles, propellants, and depot services.'
          : option === 'nep'
            ? 'NEP Cargo Freighters: Interplanetary cargo ships carrying non-urgent heavy cargo between industrial nodes at very high propellant efficiency.'
            : 'Space settlement is not only about reaching another world. It is about building the energy, transportation, resource and industrial systems that allow civilization to operate beyond Earth.',
  }

  return (
    <aside className="beyond-panel" aria-label="Chapter exploration">
      {index === 0 && (
        <div className="new-world-banner">
          <div className="frontier-quote">
            <span>Every frontier begins as an expedition.</span>
            <em>Some become transportation networks.</em>
          </div>
          <div className="analogy-flow">
            <div className="flow-track">
              <b>EUROPE</b> → oceanic expansion → <b>AMERICAS</b> → new
              civilization
            </div>
            <div className="flow-track highlight">
              <b>EARTH</b> → interplanetary expansion → <b>MARS</b> → new
              civilization
            </div>
          </div>
        </div>
      )}

      {index === 2 && (
        <div className="network-phase">
          EARTH-DEPENDENT BASE → LOCAL ISRU → LOCAL CONSTRUCTION → LOCAL FOOD →
          LOCAL MANUFACTURING → INDUSTRIAL SETTLEMENT → PARTIAL AUTONOMY
        </div>
      )}

      {index === 10 && (
        <div className="network-phase">
          {option === 'triangle'
            ? "ZUBRIN'S PROPOSED INTERPLANETARY TRADE TRIANGLE · LONG-TERM SCENARIO"
            : option === 'expanded'
              ? 'EXTENDED SOLAR-SYSTEM ECONOMY — CONCEPTUAL'
              : option === 'nep'
                ? 'NEP LOGISTICS · INTERPLANETARY CARGO CARRIERS'
                : [
                    'EARTH-DEPENDENT EXPLORATION',
                    'SPACE LOGISTICS',
                    'LOCAL RESOURCES',
                    'LOCAL ENERGY',
                    'LOCAL INDUSTRY',
                    'MULTI-WORLD ECONOMY',
                  ][mission.development]}
        </div>
      )}

      {sets[index] && (
        <div
          className="chapter-options"
          role="group"
          aria-label="Explore this concept"
        >
          {sets[index].map(([value, label]) => (
            <button
              key={value}
              aria-pressed={option === value}
              onClick={() => setOption(value)}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <p>{captions[index]}</p>

      {index === 0 && (
        <small className="analogy-disclaimer">
          Historical note: Transatlantic colonization involved conquest,
          displacement, and violence. Robert Zubrin’s analogy is strictly
          limited to frontier economics, new settlement creation, and
          technological development without romanticizing historical atrocities.
        </small>
      )}

      {index === 2 && (
        <small className="domains-note">
          Innovation domains: autonomous robotics · closed-loop life support ·
          mining · recycling · agriculture · surface nuclear · dust mitigation ·
          radiation shielding · remote medicine · local manufacturing.
        </small>
      )}

      {index === 10 && (
        <small
          style={{
            display: 'block',
            marginTop: '6px',
            color: '#ffbd96',
            fontSize: '9px',
            letterSpacing: '1px',
          }}
        >
          Explore. Build. Learn. Expand.
        </small>
      )}
    </aside>
  )
}
