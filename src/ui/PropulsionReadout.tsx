import { useLayoutEffect, useRef } from 'react'
import type { Mission } from '../hooks/useMission'
import {
  propulsionDemo,
  propulsionProgress,
  propulsionTime,
} from '../data/propulsion'

export function PropulsionReadout({ mission }: { mission: Mission }) {
  const root = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    let frame = 0
    const tick = () => {
      const time = propulsionTime(
        mission.elapsed.current,
        mission.reducedMotion,
      )
      for (const kind of ['ntp', 'chemical', 'nep'] as const) {
        const item = root.current?.querySelector<HTMLElement>(
          `[data-engine="${kind}"]`,
        )
        if (!item) continue
        const progress = propulsionProgress(kind, time)
        item.dataset.progress = progress.toFixed(4)
        item.dataset.arrived = String(progress === 1)
        const bar = item.querySelector<HTMLElement>('i')!
        const status = item.querySelector<HTMLElement>('small')!
        bar.style.transform = `scaleX(${progress})`
        status.textContent =
          progress === 1 ? 'ARRIVED' : `${Math.floor(progress * 100)}% ROUTE`
      }
      frame = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(frame)
  }, [mission.elapsed, mission.reducedMotion, mission.resetKey, mission.paused])
  return (
    <div
      ref={root}
      className="propulsion-readout"
      aria-label="Illustrative route progress"
    >
      <span>
        {mission.reducedMotion
          ? 'STATIC COMPARISON · MOTION REDUCED'
          : 'SHARED DEPARTURE · ILLUSTRATIVE ARRIVAL ORDER'}
      </span>
      <div className="propulsion-results">
        {(['ntp', 'chemical', 'nep'] as const).map((kind) => (
          <div
            key={kind}
            data-engine={kind}
            style={{ color: propulsionDemo[kind].color }}
          >
            <b>
              <em>0{propulsionDemo[kind].rank}</em> {propulsionDemo[kind].name}
            </b>
            <small>0% ROUTE</small>
            <div className="route-progress">
              <i />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
