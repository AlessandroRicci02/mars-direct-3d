import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard, Line } from '@react-three/drei'
import type { Line2 } from 'three-stdlib'
import * as THREE from 'three'
import { Label } from './SceneLabels'
import { Spacecraft, TetherCraft, CrewHabitat } from './Spacecraft'
import {
  missionDays,
  transferPoint,
  transferDuration,
} from '../data/orbitalMotion'
import type { Mission } from '../hooks/useMission'
export function Trajectories({ mission }: { mission: Mission }) {
  const returning = mission.index === 8,
    crew = mission.index === 5 || mission.index === 6
  const ship = useRef<THREE.Group>(null),
    vehicle = useRef<THREE.Group>(null),
    rendezvous = useRef<THREE.Group>(null),
    second = useRef<THREE.Group>(null),
    trail = useRef<Line2>(null)
  const points = useMemo(
    () =>
      Array.from({ length: 129 }, (_, i) => transferPoint(i / 128, returning)),
    [returning],
  )
  const positions = useMemo(() => new Float32Array(96), [])
  const arrival = transferPoint(1, returning)
  const visualPoint = (t: number) => {
    const p = transferPoint(t, returning)
    p.y =
      0.1 +
      (crew ? 2.7 : 1.9) * Math.exp(-t * 30) +
      (crew ? 2.7 : 1.5) * Math.exp(-(1 - t) * 30)
    return p
  }
  useFrame(() => {
    if (!ship.current) return
    const t =
      missionDays(
        mission.index,
        mission.progress.current,
        mission.elapsed.current,
      ) / transferDuration(mission.index)
    // Retire the prediction marker when the real planet reaches it, so the
    // arrival label does not stack over the fueled-ERV/planet annotations.
    if(rendezvous.current) rendezvous.current.visible=t<.94
    ship.current.position.copy(visualPoint(t))
    if (!crew && vehicle.current)
      vehicle.current.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        transferPoint(Math.min(1, t + 0.001), returning)
          .sub(transferPoint(Math.max(0, t - 0.001), returning))
          .normalize(),
      )
    if (second.current)
      second.current.position
        .copy(visualPoint(Math.max(0, t - 0.08)))
        .add(new THREE.Vector3(0, 1.4, 2.8))
    if (trail.current) {
      for (let i = 0; i < 32; i++)
        visualPoint(Math.max(0, t - 0.13 + (i / 31) * 0.13)).toArray(
          positions,
          i * 3,
        )
      trail.current.geometry.setPositions(positions)
    }
  })
  if (mission.index === 0 || mission.index === 9) return null
  return (
    <>
      <Line
        points={points}
        color={returning ? '#a9e4ca' : '#eeb27e'}
        lineWidth={1.6}
        transparent
        opacity={0.8}
        dashed={returning}
        dashSize={0.2}
        gapSize={0.12}
      />
      <group ref={rendezvous} position={arrival}>
        <mesh>
          <sphereGeometry args={[returning ? 1.2 : 0.7, 20, 12]} />
          <meshBasicMaterial
            color="#9ecab7"
            wireframe
            transparent
            opacity={0.2}
          />
        </mesh>
        {mission.labels && (
          <Label position={[0, 2.9, 0]} color="green">
            <b>{returning ? 'EARTH' : 'MARS'} AT ARRIVAL</b>
            <small>FUTURE RENDEZVOUS</small>
          </Label>
        )}
      </group>
      <Line
        ref={trail}
        points={points.slice(0, 32)}
        color="#ffe2b7"
        lineWidth={3}
        transparent
        opacity={0.7}
      />
      <group ref={ship}>
        <group ref={vehicle}>
          {mission.index === 6 ? (
            <group scale={1.25}>
              <TetherCraft paused={mission.paused || mission.reducedMotion} />
            </group>
          ) : crew ? (
            <group scale={0.55}>
              <CrewHabitat />
            </group>
          ) : (
            <Spacecraft
              scale={0.65}
              thrust={mission.index === 1 || returning}
            />
          )}
        </group>
        <Billboard>
          <mesh>
            <ringGeometry args={[0.65, 0.68, 40]} />
            <meshBasicMaterial
              color="#ffe1a9"
              transparent
              opacity={0.55}
              depthWrite={false}
            />
          </mesh>
        </Billboard>
        <pointLight position={[0, 2, 2]} intensity={3} distance={5} />
        {mission.labels && (
          <Label position={[0, 4, 0]} color="neutral">
            <b>{crew ? 'CREW HABITAT' : 'EARTH RETURN VEHICLE #1'}</b>
            <small>
              {mission.index === 6
                ? 'HABITAT + TETHER + SPENT PROPULSION STAGE'
                : returning
                  ? 'CREW RETURN'
                  : 'EARTH DEPARTURE'}
            </small>
          </Label>
        )}
      </group>
      {crew && (
        <group ref={second}>
          <Spacecraft scale={0.48} />
          {mission.labels && (
            <Label position={[-3, -5, 2]}>
              <b>ERV #2</b>
              <small>SEPARATE · NEXT MISSION / BACKUP</small>
            </Label>
          )}
        </group>
      )}
    </>
  )
}
