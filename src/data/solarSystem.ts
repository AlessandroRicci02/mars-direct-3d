import { Vector3 } from 'three'

// NASA equatorial diameters and mean orbital distances. World units compress
// distances relative to body sizes; Earth and Mars share the SAME body scale.
export const EARTH_DIAMETER_KM = 12756
export const MARS_DIAMETER_KM = 6792
export const MARS_ORBIT_RATIO = 228 / 149.6
export const EARTH_RADIUS = 1.15
export const MARS_RADIUS = (EARTH_RADIUS * MARS_DIAMETER_KM) / EARTH_DIAMETER_KM
// The Sun is deliberately size-compressed separately, disclosed in its label.
export const SUN_RADIUS = 2.8
export const SUN = new Vector3(-3, 0, 3)
export const EARTH = new Vector3(4, 0, -6)
export const EARTH_ORBIT_RADIUS = EARTH.distanceTo(SUN)
export const MARS_ORBIT_RADIUS = EARTH_ORBIT_RADIUS * MARS_ORBIT_RATIO
export const MARS = SUN.clone().add(
  new Vector3(18, 0, -10).normalize().multiplyScalar(MARS_ORBIT_RADIUS),
)

export const EARTH_DEPARTURE = EARTH.clone().add(
  new Vector3(0.1, 0.25, -EARTH_RADIUS - 0.3),
)
export const MARS_ARRIVAL = MARS.clone().add(
  new Vector3(-0.15, 0.2, -MARS_RADIUS - 0.2),
)
export const MARS_DEPARTURE = MARS.clone().add(
  new Vector3(0, 0.3, MARS_RADIUS + 0.35),
)
export const EARTH_ARRIVAL = EARTH.clone().add(
  new Vector3(0.1, 0.3, EARTH_RADIUS + 0.4),
)

export const BODY_BOUNDS = [
  { center: SUN, radius: SUN_RADIUS },
  { center: EARTH, radius: EARTH_RADIUS },
  { center: MARS, radius: MARS_RADIUS },
]

export function keepCameraOutsideBodies(position: Vector3, clearance = 0.9) {
  for (const body of BODY_BOUNDS) {
    const offset = position.clone().sub(body.center)
    const minimum = body.radius + clearance
    if (offset.lengthSq() < minimum * minimum) {
      if (offset.lengthSq() < 1e-8) offset.set(0, 1, 0)
      position.copy(body.center).add(offset.normalize().multiplyScalar(minimum))
    }
  }
  return position
}
