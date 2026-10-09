export type SceneMode = 'solar' | 'surface' | 'beyond'
export interface MissionStage {
  id: number
  short: string
  eyebrow: string
  title: string
  accent: string
  description: string
  detail: string
  metric: string
  metricLabel: string
  time: string
  location: string
  mode: SceneMode
  duration: number
  status?: string
}

export const stages: MissionStage[] = [
  {
    id: 0,
    short: 'The idea',
    eyebrow: 'A NEW WAY TO ANOTHER WORLD',
    title: 'The road',
    accent: 'to Mars.',
    description:
      'Go there. Live off the land. Come home. A bold, simple idea for making humanity a multiplanetary species.',
    detail:
      'Proposed by Robert Zubrin and David Baker in 1990, Mars Direct sends the return vehicle first. Instead of bringing all the return propellant from Earth, make it on Mars.',
    metric: '10',
    metricLabel: 'CHAPTERS · ONE EXTRAORDINARY JOURNEY',
    time: 'MISSION OVERVIEW',
    location: 'INNER SOLAR SYSTEM',
    mode: 'solar',
    duration: 14,
  },
  {
    id: 1,
    short: 'Send ahead',
    eyebrow: '01 / PREPARE THE WAY',
    title: 'A way home.',
    accent: 'Sent first.',
    description:
      'Before any astronaut leaves Earth, an uncrewed Earth Return Vehicle sets out for Mars.',
    detail:
      'The ERV carries a propellant plant, approximately 6 metric tonnes of liquid hydrogen from Earth, and a 100 kW nuclear reactor. Its first job is to prepare the return journey.',
    metric: '0',
    metricLabel: 'CREW ABOARD THE FIRST ERV',
    time: 'MONTH 0 · FIRST LAUNCH',
    location: 'EARTH DEPARTURE',
    mode: 'solar',
    duration: 12,
  },
  {
    id: 2,
    short: 'The crossing',
    eyebrow: '02 / CROSS INTERPLANETARY SPACE',
    title: 'Across',
    accent: 'the silence.',
    description:
      'The Earth Return Vehicle follows a curved interplanetary path toward the Red Planet.',
    detail:
      'The uncrewed cargo crossing is shown as approximately eight months, following the 1995 Mars Direct description. Crew transfers are represented as roughly six months; timing depends on the chosen mission. Spacecraft follow an orbit around the Sun to meet Mars where it will be later. This accelerated circular-orbit illustration is not a calculated mission trajectory.',
    metric: '~8',
    metricLabel: 'MONTH CARGO TRANSFER TO MARS',
    time: 'MONTHS 0–8 · OUTBOUND',
    location: 'EARTH → MARS',
    mode: 'solar',
    duration: 14,
  },
  {
    id: 3,
    short: 'Touch down',
    eyebrow: '03 / THE FIRST ARRIVAL',
    title: 'First contact.',
    accent: 'No crew yet.',
    description:
      'The ERV descends to the Martian surface. A way home has arrived, but its tanks still need filling.',
    detail:
      'The landing establishes the first mission site. In this schematic descent, the lander settles onto its legs and prepares to deploy its equipment.',
    metric: '01',
    metricLabel: 'RETURN VEHICLE ON MARS',
    time: '~MONTH 8 · ARRIVAL',
    location: 'MARS · PREPARATION SITE',
    mode: 'surface',
    duration: 12,
  },
  {
    id: 4,
    short: 'Make fuel',
    eyebrow: '04 / LIVE OFF THE LAND',
    title: 'An atmosphere.',
    accent: 'A way home.',
    description:
      'Turn Martian carbon dioxide and hydrogen brought from Earth into methane and oxygen propellant.',
    detail:
      'A 100 kW nuclear reactor powers compressors and the automated propellant production plant. Approximately 6 metric tonnes of liquid hydrogen brought from Earth with the ERV react with atmospheric CO2 via the Sabatier process and electrolysis. Hydrogen is recycled. Return propellant is produced and verified before the crew ever leaves Earth.',
    metric: 'ISRU',
    metricLabel: 'MAKE RETURN PROPELLANT BEFORE CREW DEPARTURE',
    time: 'BEFORE MONTH 26 · PREPARATION',
    location: 'MARS · PROPELLANT PLANT',
    mode: 'surface',
    duration: 17,
  },
  {
    id: 5,
    short: 'Crew launch',
    eyebrow: '05 / THE NEXT LAUNCH WINDOW',
    title: 'Now,',
    accent: 'the people.',
    description:
      'With a fueled ride home waiting on Mars (ERV #1), a crew habitat and a second ERV (ERV #2) depart Earth.',
    detail:
      'ERV #1 is already fueled on Mars. Only after that capability is demonstrated does the crew depart. ERV #2 flies separately from the crew habitat, preparing the next mission and providing backup. The crew travels in the Habitat vehicle, launched with its Trans-Mars Injection stage.',
    metric: '26',
    metricLabel: 'MONTHS AFTER THE FIRST ERV LAUNCH',
    time: '~MONTH 26 · SECOND WINDOW',
    location: 'EARTH · TWO DEPARTURES',
    mode: 'solar',
    duration: 14,
  },
  {
    id: 6,
    short: 'In transit',
    eyebrow: '06 / A HOME BETWEEN WORLDS',
    title: 'Next stop.',
    accent: 'Another world.',
    description:
      'The crew travels to Mars in the same habitat that will become their home on the surface.',
    detail:
      'The crew travels in the Habitat vehicle. After trans-Mars injection, the habitat is connected to its spent booster propulsion stage by a tether. Rotating the tethered system at roughly 1 rpm produces artificial gravity during the six-month crossing.',
    metric: '~6',
    metricLabel: 'MONTHS IN THE CREW HABITAT',
    time: '~MONTHS 26–32 · CREW TRANSIT',
    location: 'EN ROUTE TO MARS',
    mode: 'solar',
    duration: 14,
  },
  {
    id: 7,
    short: 'Explore Mars',
    eyebrow: '07 / TIME TO EXPLORE',
    title: 'A small base.',
    accent: 'A giant step.',
    description:
      'The habitat lands near the fueled ERV. Four explorers begin an extended mission on the surface.',
    detail:
      'The habitat lands near the waiting ERV #1. A long stay makes room for field science, rover traverses, and experiments while planets move toward the return window. The 100 kW nuclear reactor remains stationed remotely from the living area.',
    metric: '~18',
    metricLabel: 'MONTHS LIVING & WORKING ON MARS',
    time: '~MONTHS 32–50 · SURFACE MISSION',
    location: 'MARS · FIRST CREWED OUTPOST',
    mode: 'surface',
    duration: 16,
  },
  {
    id: 8,
    short: 'Come home',
    eyebrow: '08 / THE RETURN JOURNEY',
    title: 'Made on Mars.',
    accent: 'Bound for Earth.',
    description:
      'The crew boards the waiting ERV and lifts off, using return propellant produced on Mars.',
    detail:
      'The habitat and surface equipment remain behind. The ERV carries the explorers back toward Earth, completing the first expedition.',
    metric: 'HOME',
    metricLabel: 'RETURN PROPELLANT PRODUCED ON MARS',
    time: '~MONTH 50+ · EARTH RETURN',
    location: 'MARS → EARTH',
    mode: 'solar',
    duration: 18,
  },
  {
    id: 9,
    short: 'Repeat',
    eyebrow: '09 / BEYOND A SINGLE MISSION',
    title: 'Not a visit.',
    accent: 'A beginning.',
    description: 'Live off the land. Explore. Return. Repeat.',
    detail:
      'Successive launch windows deliver new habitats, return vehicles, and exploration sites. Mars Direct is a proposed path toward sustained exploration and, eventually, a permanent human presence.',
    metric: '26',
    metricLabel: 'MONTHS BETWEEN NEW OPPORTUNITIES',
    time: 'SUBSEQUENT LAUNCH WINDOWS',
    location: 'A GROWING NETWORK',
    mode: 'solar',
    duration: 16,
  },
]
