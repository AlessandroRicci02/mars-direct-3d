import type { Mission } from '../hooks/useMission'
const sets: Record<number, [string, string][]> = {
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
    ['chemical', 'Chemical'],
    ['ntp', 'NTP'],
    ['nep', 'NEP'],
  ],
}
const propulsion: Record<string, string> = {
  all: 'Conceptual comparison — actual mission performance depends strongly on vehicle mass, reactor power, propulsion system, trajectory and mission architecture.',
  chemical:
    'Chemical propulsion (Truck / conventional transport): Technologically mature and often the simplest option for high-thrust missions like launch and landing; relatively low specific impulse.',
  ntp: 'Nuclear Thermal Propulsion (Fast interplanetary transport): High thrust relative to electric, roughly 2× chemical specific impulse in many concepts. Attractive for reducing crew transit time.',
  nep: 'Nuclear Electric Propulsion (High-efficiency cargo ship): Very high propellant efficiency with continuous low thrust for heavy cargo and logistics; involves long spiral departure phases.',
}
export function BeyondControls({ mission }: { mission: Mission }) {
  const { index, option, setOption } = mission
  const captions: Record<number, string> = {
    0: 'BEYOND MARS DIRECT · Transportation, energy, resources and the expansion of human civilization.',
    1: 'The Moon: High-thrust chemical for crew & landings vs electric for slow cargo. Polar ice & regolith. Helium-3: Speculative — dependent on future fusion technology.',
    2: [
      'Initial settlement imports: habitats, machinery, power systems, life-support, robots, spare parts, people.',
      'Local production begins: water, oxygen, methane, and construction materials.',
      'Industrial settlement adds structures, controlled-environment agriculture, and components.',
      'Partially self-sufficient economy: broader industrial capacity. Long-term scenario.',
    ][option === 'all' ? mission.development : Number(option)],
    3: 'Solving extreme constraints (closed-loop life support, robotics, recycling) could yield transformative technologies for Earth. No financial returns promised.',
    4: 'One planet → Two worlds: For a long time, a Martian settlement would remain dependent on Earth. True resilience develops only over very long timescales.',
    5:
      option === 'materials'
        ? 'Material loop: MATERIAL → PRODUCT → REPAIR → RECYCLE → NEW PRODUCT. Energy and make-up resources still enter.'
        : 'Water loop: WATER → HUMAN USE → RECOVERY → PURIFICATION → WATER. Losses still require make-up resources.',
    6: 'If automation substantially lowers the marginal cost of material production, societies could direct greater attention toward human flourishing, discovery, meaning, and long-term space expansion.',
    7: 'Asteroid resources: Strategic in-space supply (propellant, shielding, construction) for orbital, lunar, and Martian networks, rather than shipping ore to Earth.',
    8: propulsion[option],
    9:
      option === 'nep'
        ? 'NEP = reactor → electricity → thrusters for spacecraft propulsion. NEP is not the only way to generate electricity on the Moon or Mars.'
        : 'Surface Fission Power = reactor → electricity → habitats, ISRU, greenhouses, mining, and factories. Continuous power independent of sunlight.',
    10: 'Space settlement is not only about reaching another world. It is about building the energy, transportation, resource and industrial systems that allow civilization to operate beyond Earth.',
  }
  return (
    <aside className="beyond-panel" aria-label="Chapter exploration">
      {index === 2 && (
        <div className="network-phase">
          DEPENDENT OUTPOST → LOCAL PRODUCTION → INDUSTRIAL SETTLEMENT → PARTIAL
          AUTONOMY
        </div>
      )}
      {index === 10 && (
        <div className="network-phase">
          {
            [
              'EARTH-DEPENDENT EXPLORATION',
              'SPACE LOGISTICS',
              'LOCAL RESOURCES',
              'LOCAL ENERGY',
              'LOCAL INDUSTRY',
              'MULTI-WORLD ECONOMY',
            ][mission.development]
          }
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
