export const industrySteps = [
  {
    short: 'Outpost',
    title: 'EARTH-DEPENDENT BASE',
    caption:
      'Habitats, power systems, machinery and spare parts arrive from Earth.',
  },
  {
    short: 'ISRU',
    title: 'LOCAL RESOURCES',
    caption:
      'Prospecting and extraction supply water, oxygen and methane. Specialized equipment is still imported.',
  },
  {
    short: 'Construction',
    title: 'LOCAL CONSTRUCTION',
    caption:
      'Regolith shielding, landing pads and structures reduce the mass imported from Earth.',
  },
  {
    short: 'Food',
    title: 'LOCAL FOOD',
    caption:
      'Controlled-environment agriculture joins the life-support and water-recovery systems.',
  },
  {
    short: 'Manufacturing',
    title: 'LOCAL MANUFACTURING',
    caption:
      'Workshops repair machinery and make selected components from local feedstocks.',
  },
  {
    short: 'Industry',
    title: 'INDUSTRIAL SETTLEMENT',
    caption:
      'Mining, power and manufacturing connect into an industrial system with continuing Earth imports.',
  },
  {
    short: 'Partial autonomy',
    title: 'PARTIAL SELF-SUFFICIENCY',
    caption:
      'Broader local production reduces dependence. Advanced electronics, medicines and specialized machinery may still come from Earth.',
  },
] as const

export const networkSteps = [
  'EARTH-DEPENDENT EXPLORATION',
  'SPACE LOGISTICS',
  'LOCAL RESOURCES',
  'LOCAL ENERGY',
  'LOCAL INDUSTRY',
  'MULTI-WORLD ECONOMY',
] as const
