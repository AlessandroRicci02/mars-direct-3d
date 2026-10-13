import type { Mission } from '../hooks/useMission'
import { industrySteps, networkSteps } from '../data/development'
import { PropulsionReadout } from './PropulsionReadout'

const sets: Record<number, [string, string][]> = {
  0: [
    ['all', 'The next frontier'],
    ['analogy', 'New World analogy'],
    ['transport', 'Transport networks'],
  ],
  1: [
    ['all', 'Both routes'],
    ['crew', 'Crew'],
    ['cargo', 'Cargo'],
  ],
  2: [
    ['all', 'Auto'],
    ...industrySteps.map((s, i): [string, string] => [String(i), s.short]),
  ],
  4: [
    ['all', 'Earth-dependent'],
    ['future', 'Independent capacity'],
  ],
  5: [
    ['all', 'Water loop'],
    ['materials', 'Material loop'],
  ],
  6: [
    ['all', 'Cargo handling'],
    ['service', 'Maintenance'],
    ['purpose', 'Human possibilities'],
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
    ['all', 'Build network'],
    ['expanded', 'Full network'],
    ['chemical', 'Chemical'],
    ['ntp', 'NTP'],
    ['nep', 'NEP'],
    ['triangle', "Zubrin's triangle"],
  ],
}

const propulsion: Record<string, string> = {
  all: 'In this illustrative mission: NTP first, chemical next, NEP cargo last. Actual flight times depend on vehicle and trajectory; this is not a universal speed ranking.',
  chemical:
    'High thrust, short burns, then coast. Mature technology for launch, landing and impulsive maneuvers.',
  ntp: 'A reactor heats propellant directly. High thrust; many concepts target about twice the specific impulse of the best chemical engines.',
  nep: 'A reactor supplies electric thrusters. Efficient, continuous low thrust; departure spirals, reactor mass and radiator area shape the mission.',
}

export function BeyondControls({ mission }: { mission: Mission }) {
  const { index, option, setOption } = mission
  const level = option === 'all' ? mission.development : Number(option)
  const captions: Record<number, string> = {
    0:
      option === 'analogy'
        ? 'Zubrin’s economic analogy: new settlements can become centers of invention. Historical colonization also involved conquest and displacement; this is a limited analogy.'
        : option === 'transport'
          ? 'An expedition becomes a network only through dependable transport, power and resupply. A possible future, not an inevitable one.'
          : 'Beyond a single mission: transportation, energy, resources — and the people who might build a future with them.',
    1:
      option === 'cargo'
        ? 'Electric propulsion can trade travel time for propellant efficiency. Cargo can wait; people and landing maneuvers have different needs.'
        : 'Chemical propulsion serves crew and landings. Polar ice, regolith oxygen and local construction are potential lunar resources.',
    2: industrySteps[level]?.caption || '',
    3: 'Power, robotics, farming and life support could produce useful knowledge on Earth. Economic returns are not guaranteed.',
    4:
      option === 'future'
        ? 'Resilience requires independently productive industry, medicine, electronics and reliable life support. This remains a distant scenario.'
        : 'For a long time, a Martian settlement would remain dependent on Earth. Mars is not an easy emergency backup.',
    5: 'Follow the particles around the loop. Energy and make-up resources enter; unrecovered losses leave.',
    6:
      option === 'purpose'
        ? 'If AI and robotics make material production cheaper, more time could go to science, art, relationships and exploration. A possibility, not a forecast.'
        : option === 'service'
          ? 'AI-assisted perception and task planning could help humanoids inspect and maintain equipment. People set goals, supervise and handle exceptions; delayed links require local autonomy.'
          : 'Humanoid robots could handle supplies and use tools designed for people, alongside specialized rovers. This future worksite illustrates a role for AI and human supervision.',
    7: 'Composition varies by asteroid. Prospect first; then use water, metals and other materials where they are useful in space.',
    8: propulsion[option],
    9:
      option === 'nep'
        ? 'Reactor heat → electrical conversion → electric thrusters. Radiators reject waste heat. This vehicle is not a surface power grid.'
        : 'A surface reactor supplies the settlement. Solar, storage and fuel cells can complement it; fission is not the only solution.',
    10:
      option === 'triangle'
        ? 'Zubrin’s proposed trade triangle: Earth supplies Mars; Mars supports asteroid operations; asteroid products return toward Earth. An economic hypothesis.'
        : option === 'chemical'
          ? 'Chemical: crew transport near Earth, local maneuvers and landings. Solid warm routes.'
          : option === 'ntp'
            ? 'NTP: a proposed option for high-thrust interplanetary transport. Dashed green routes.'
            : option === 'nep'
              ? 'NEP: proposed freighters carry non-urgent cargo between resource and industrial nodes. Dotted blue routes.'
              : 'Resources used in space, local surface power and complementary transport systems. An illustrative long-term network.',
  }
  return (
    <aside
      className="beyond-panel"
      aria-label="Chapter exploration"
      data-development={mission.development}
    >
      {index === 2 && (
        <div className="network-phase">
          {String(level + 1).padStart(2, '0')} / 07 ·{' '}
          {industrySteps[level]?.title}
        </div>
      )}
      {index === 10 && (
        <div className="network-phase">
          {option === 'all'
            ? `${String(mission.development + 1).padStart(2, '0')} / 06 · ${networkSteps[mission.development]}`
            : 'LONG-TERM SCENARIO · SELECT A SYSTEM'}
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
      {index === 8 && <PropulsionReadout mission={mission} />}
      <p>{captions[index]}</p>
      {index === 10 && (
        <small className="closing-line">Explore. Build. Learn. Expand.</small>
      )}
    </aside>
  )
}
