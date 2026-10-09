import { lazy, Suspense } from 'react'
import { useMission } from './hooks/useMission'
import MissionUI from './ui/MissionUI'

const MissionScene = lazy(() => import('./scene/MissionScene'))

export default function App() {
  const mission = useMission()
  return (
    <div
      className="experience"
      data-stage={mission.index}
      data-section={mission.section}
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
    </div>
  )
}
