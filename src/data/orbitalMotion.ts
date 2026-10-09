import { Vector3 } from 'three'
import { SUN, EARTH_ORBIT_RADIUS, MARS_ORBIT_RADIUS } from './solarSystem'

export const TRANSFER_DAYS = 180
export const EARTH_PERIOD = 365.256
export const MARS_PERIOD = 686.98
const departure = -Math.PI + 0.25
export function orbitPosition(
  kind: 'earth' | 'mars',
  days: number,
  returning = false,
  transferDays = TRANSFER_DAYS,
) {
  const period = kind === 'earth' ? EARTH_PERIOD : MARS_PERIOD
  const radius = kind === 'earth' ? EARTH_ORBIT_RADIUS : MARS_ORBIT_RADIUS
  const initial = returning
    ? kind === 'mars'
      ? 0.25
      : 0.25 + Math.PI - (Math.PI * 2 * transferDays) / EARTH_PERIOD
    : kind === 'earth'
      ? departure
      : departure + Math.PI - (Math.PI * 2 * transferDays) / MARS_PERIOD
  const angle = initial + (days * Math.PI * 2) / period
  return new Vector3(
    SUN.x + radius * Math.cos(angle),
    0,
    SUN.z + radius * Math.sin(angle),
  )
}

// Focus-centered transfer ellipse. Time is intentionally illustrative: 180 days
// is not the physical Hohmann duration for these radii. No Lambert solve implied.
export function transferPoint(t: number, returning = false) {
  const a = (EARTH_ORBIT_RADIUS + MARS_ORBIT_RADIUS) / 2
  const e =
    (MARS_ORBIT_RADIUS - EARTH_ORBIT_RADIUS) /
    (MARS_ORBIT_RADIUS + EARTH_ORBIT_RADIUS)
  const mean = Math.PI * (Math.max(0, Math.min(1, t)) + (returning ? 1 : 0))
  let anomaly = mean
  for (let i = 0; i < 7; i++)
    anomaly -=
      (anomaly - e * Math.sin(anomaly) - mean) / (1 - e * Math.cos(anomaly))
  const x = a * (Math.cos(anomaly) - e),
    z = a * Math.sqrt(1 - e * e) * Math.sin(anomaly)
  const angle = returning ? 0.25 + Math.PI : departure
  return new Vector3(
    SUN.x + x * Math.cos(angle) - z * Math.sin(angle),
    0,
    SUN.z + x * Math.sin(angle) + z * Math.cos(angle),
  )
}
export function missionDays(index: number, progress: number, elapsed: number) {
  if (index === 0 || index === 9) return elapsed * 12
  if (index === 1 || index === 5) return progress * 6
  if (index === 8) return Math.max(0, (progress - 0.3) / 0.7) * TRANSFER_DAYS
  return 6 + progress * (transferDuration(index) - 6)
}

export function transferDuration(index: number) {
  return index === 1 || index === 2 ? 240 : TRANSFER_DAYS
}
