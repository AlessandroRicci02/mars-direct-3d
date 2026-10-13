import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useMission } from './hooks/useMission'
import MissionUI from './ui/MissionUI'

const MissionScene = lazy(() => import('./scene/MissionScene'))

export default function App() {
  const mission = useMission()
  const previousSection = useRef(mission.section)
  const [partTransition, setPartTransition] = useState(false)
  useEffect(() => {
    const changed = previousSection.current !== mission.section
    previousSection.current = mission.section
    setPartTransition(
      changed && mission.section === 'beyond' && !mission.reducedMotion,
    )
    const timeout = window.setTimeout(() => setPartTransition(false), 2600)
    return () => window.clearTimeout(timeout)
  }, [mission.section, mission.reducedMotion])
  return (
    <div
      className="experience"
      data-stage={mission.index}
      data-section={mission.section}
      data-focus={mission.focus3d}
    >
      <Suspense
        fallback={
          <div className="scene-loading">
            <span className="loading-orbit" />
            <span>PREPARING THE EXPEDITION</span>
          </div>
        }
      >
        <MissionScene mission={mission} />
      </Suspense>
      <MissionUI mission={mission} />
      {partTransition && !mission.focus3d && (
        <div className="part-transition" aria-hidden="true">
          <span>PART II</span>
          <strong>Beyond Mars Direct</strong>
        </div>
      )}
    </div>
  )
}
