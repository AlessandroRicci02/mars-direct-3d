import { Suspense, Component } from 'react'
import { Canvas } from '@react-three/fiber'
import { CelestialBodies } from './CelestialBodies'
import { Trajectories } from './Trajectories'
import { BeyondScene } from './BeyondScene'
import { MarsSurface } from './MarsSurface'
import { CameraController } from './CameraController'
import { SceneLabels } from './SceneLabels'
import type { Mission } from '../hooks/useMission'

class SceneBoundary extends Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    if (this.state.failed)
      return (
        <div className="webgl-fallback">
          <span>3D VIEW UNAVAILABLE</span>
          <p>
            Your browser could not start WebGL. Enable hardware acceleration and
            reload to explore the scene. You can still read every mission
            chapter.
          </p>
          <button onClick={() => window.location.reload()}>
            Reload experience
          </button>
        </div>
      )
    return this.props.children
  }
}

export default function MissionScene({ mission }: { mission: Mission }) {
  return (
    <div
      className={`scene-container ${mission.stage.mode}`}
      aria-label={`Interactive 3D view: ${mission.stage.location}`}
    >
      <SceneBoundary>
        <Canvas
          shadows="soft"
          dpr={[1, 1.75]}
          camera={{ position: [4, 14, 29], fov: 43, near: 0.1, far: 300 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          fallback={
            <div className="webgl-fallback">
              WebGL is required for the 3D view. The mission chapters remain
              available below.
            </div>
          }
        >
          <color
            attach="background"
            args={[mission.stage.mode === 'surface' ? '#191518' : '#080b10']}
          />
          <Suspense fallback={null}>
            {mission.section === 'beyond' ? (
              <BeyondScene mission={mission} />
            ) : mission.stage.mode === 'surface' ? (
              <MarsSurface mission={mission} />
            ) : (
              <>
                <CelestialBodies mission={mission} />
                <Trajectories mission={mission} />
              </>
            )}
          </Suspense>
          <CameraController mission={mission} />
        </Canvas>
        <SceneLabels />
        <div
          key={mission.stage.mode}
          className="scene-transition"
          aria-hidden="true"
        />
      </SceneBoundary>
    </div>
  )
}
