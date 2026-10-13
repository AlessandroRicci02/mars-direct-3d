export type PropulsionKind = 'chemical' | 'ntp' | 'nep'

// Seconds of this animation, NOT flight-time predictions or physical speeds.
// One clock, one departure and a held arrival avoid ambiguous looping races.
export const propulsionDemo = {
  chemical: { duration: 14, rank: 2, name: 'Chemical', color: '#efaa7c' },
  ntp: { duration: 9, rank: 1, name: 'NTP', color: '#b5d7bc' },
  nep: { duration: 21, rank: 3, name: 'NEP', color: '#8ebbd9' },
} as const

export function propulsionProgress(kind: PropulsionKind, elapsed: number) {
  const t = Math.max(0, Math.min(1, elapsed / propulsionDemo[kind].duration))
  return kind === 'nep' ? t ** 1.35 : t
}

export function propulsionTime(elapsed: number, reducedMotion: boolean) {
  return reducedMotion ? 6 : elapsed
}
