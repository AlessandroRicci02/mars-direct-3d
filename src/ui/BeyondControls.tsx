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
  all: 'Thrust patterns, not a race. Travel time depends on mass, power, trajectory and architecture.',
  chemical:
    'CURRENT TECHNOLOGY · High thrust. Short burns and coasting. Launch, landing and local operations.',
  ntp: 'ENGINEERING CONCEPT · Reactor heats propellant. High thrust; around 2× chemical specific impulse in many concepts.',
  nep: 'ENGINEERING CONCEPT · Reactor → electricity → thrusters. Low continuous thrust; high efficiency and demanding power systems.',
}
export function BeyondControls({ mission }: { mission: Mission }) {
  const { index, option, setOption } = mission
  const captions: Record<number, string> = {
    0: 'PART II · Transportation → resources → energy → industry',
    1: 'Lunar ice and regolith: engineering opportunities. Helium-3: speculative — dependent on future fusion technology.',
    2: [
      'Earth supplies habitats, equipment, energy systems and spare parts.',
      'Local water, oxygen, methane and building materials.',
      'Agriculture, power infrastructure and selected manufactured components.',
      'A broader industrial base. Specialized imports and maintenance remain.',
    ][option === 'all' ? mission.development : Number(option)],
    3: 'Useful knowledge is possible. Economic returns are not guaranteed.',
    4: 'A second planet is not an independent civilization without its own industrial base.',
    5:
      option === 'materials'
        ? 'Materials → production → use & repair → recycling. Energy and make-up materials still enter.'
        : 'Water → use → recovery → purification. Losses and contaminants still require make-up water.',
    6: 'IF costs fall, society still chooses how to use its resources. This is speculation.',
    7: 'Prospecting first. Extraction, processing and transport must each prove practical.',
    8: propulsion[option],
    9:
      option === 'nep'
        ? 'NEP uses electricity for propulsion. It is not the only way to generate electricity on the Moon or Mars.'
        : 'Surface power serves life support and industry. Solar, storage and fuel cells are also options.',
    10: 'Mint: chemical / local · Amber: possible NTP / crew · Blue: possible NEP / cargo · Reactor symbols: surface power',
  }
  return (
    <aside className="beyond-panel" aria-label="Chapter exploration">
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
    </aside>
  )
}
