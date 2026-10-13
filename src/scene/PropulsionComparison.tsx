import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import type { Mission } from '../hooks/useMission'
import {
  propulsionDemo,
  propulsionProgress,
  propulsionTime,
  type PropulsionKind,
} from '../data/propulsion'
import { Caption } from './BeyondPrimitives'
import { Spacecraft } from './Spacecraft'
import { ElectricFreighter } from './Infrastructure'

function EngineLane({
  mission,
  kind,
  index,
}: {
  mission: Mission
  kind: PropulsionKind
  index: number
}) {
  const ship = useRef<THREE.Group>(null)
  const plume = useRef<THREE.Group>(null)
  const trail = useRef<THREE.Mesh>(null)
  const arrival = useRef<THREE.Mesh>(null)
  const y = 3.6 - index * 3.6
  const { color, name, rank } = propulsionDemo[kind]
  const active = mission.option === 'all' || mission.option === kind
  useFrame(() => {
    const t = propulsionProgress(
      kind,
      propulsionTime(mission.elapsed.current, mission.reducedMotion),
    )
    if (ship.current) {
      ship.current.position.set(-1 + t * 13, y, 0)
      ship.current.rotation.z =
        -Math.PI / 2 + Math.PI * THREE.MathUtils.smoothstep(t, 0.83, 0.92)
    }
    if (trail.current) {
      trail.current.position.x = -1 + t * 6.5
      trail.current.scale.x = Math.max(0.001, t * 13)
    }
    if (plume.current)
      plume.current.visible = t < 1 && (kind === 'nep' || t < 0.13 || t > 0.92)
    if (arrival.current) arrival.current.visible = t >= 1
  })
  return (
    <group visible={active}>
      <Line
        points={[
          [-1, y, 0],
          [12, y, 0],
        ]}
        color={color}
        transparent
        opacity={0.25}
        dashed
        dashSize={kind === 'nep' ? 0.06 : 0.22}
        gapSize={0.18}
      />
      <mesh ref={trail} position={[-1, y, 0]}>
        <boxGeometry args={[1, 0.035, 0.035]} />
        <meshBasicMaterial color={color} transparent opacity={0.65} />
      </mesh>
      {[-1, 12].map((x) => (
        <mesh key={x} position={[x, y, 0]}>
          <ringGeometry args={[0.18, 0.21, 24]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      <mesh ref={arrival} position={[12, y, 0]} visible={false}>
        <sphereGeometry args={[0.1, 12, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <group ref={ship} position={[-1, y, 0]} rotation={[0, 0, -Math.PI / 2]}>
        {kind === 'nep' ? (
          <group scale={0.36}>
            <ElectricFreighter thrust={false} />
          </group>
        ) : (
          <Spacecraft scale={0.5} />
        )}
        {kind === 'ntp' && (
          <mesh position={[0, -0.65, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.9, 12]} />
            <meshStandardMaterial
              color="#abbca8"
              metalness={0.6}
              roughness={0.4}
            />
          </mesh>
        )}
        <group ref={plume}>
          <mesh position={[0, -1.35, 0]} rotation={[0, 0, Math.PI]}>
            <coneGeometry
              args={[
                kind === 'nep' ? 0.07 : 0.16,
                kind === 'nep' ? 1.1 : 1.5,
                12,
              ]}
            />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.7}
              depthWrite={false}
            />
          </mesh>
        </group>
      </group>
      <Caption
        at={[4.5, y + 1.25, 0]}
        title={`${name.toUpperCase()} / ${rank === 1 ? 'FIRST ARRIVAL' : rank === 2 ? 'SECOND ARRIVAL' : 'CARGO ARRIVES LAST'}`}
        sub={
          kind === 'chemical'
            ? 'HIGH THRUST · BURN / COAST / BRAKE'
            : kind === 'ntp'
              ? 'HIGH THRUST · REACTOR-HEATED PROPELLANT'
              : 'LOW THRUST · EFFICIENT CARGO'
        }
        mission={mission}
      />
    </group>
  )
}

export function PropulsionComparison({ mission }: { mission: Mission }) {
  return (
    <>
      {(['chemical', 'ntp', 'nep'] as const).map((kind, index) => (
        <EngineLane key={kind} kind={kind} index={index} mission={mission} />
      ))}
    </>
  )
}
