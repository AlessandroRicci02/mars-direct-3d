import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import { SurfaceTerrain } from './SurfaceTerrain'
import { Astronaut, Spacecraft, CrewHabitat } from './Spacecraft'
import { Label } from './CelestialBodies'
import type { Mission } from '../hooks/useMission'

function Reactor() {
  return (
    <group position={[-4, 0, -13]}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.45, 1.2, 12]} />
        <meshStandardMaterial
          color="#999f9f"
          metalness={0.7}
          roughness={0.35}
        />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.25, 16, 12]} />
        <meshStandardMaterial color="#d8b071" />
      </mesh>
      {[-1, 1].map((side) => (
        <group
          key={side}
          position={[side * 0.85, 0.4, 0]}
          rotation={[0, 0, side * 0.25]}
        >
          <mesh>
            <boxGeometry args={[1.1, 1.1, 0.09]} />
            <meshStandardMaterial
              color="#42494b"
              metalness={0.8}
              roughness={0.4}
            />
          </mesh>
          {Array.from({ length: 6 }, (_, i) => (
            <mesh key={i} position={[-0.45 + i * 0.18, 0, 0.06]}>
              <boxGeometry args={[0.025, 1.05, 0.03]} />
              <meshStandardMaterial color="#9a9c92" />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

function PropellantPlant({ mission }: { mission: Mission }) {
  const particles = useRef<THREE.Group>(null)
  const fuel = useRef<(THREE.Mesh | null)[]>([])
  useFrame(() => {
    const p = mission.reducedMotion ? 1 : mission.progress.current
    if (particles.current)
      particles.current.children.forEach((particle, i) => {
        const t = (p * 6 + (i % 6) / 6) % 1
        const branch = Math.floor(i / 6)
        if (branch === 0)
          particle.position.set(
            THREE.MathUtils.lerp(-1.5, 1, t),
            THREE.MathUtils.lerp(2.4, 1.5, t),
            -1.8,
          )
        if (branch === 1)
          particle.position.set(
            THREE.MathUtils.lerp(-0.4, 1, t),
            0.5,
            THREE.MathUtils.lerp(-3.1, -1.8, t),
          )
        if (branch === 2)
          particle.position.set(
            THREE.MathUtils.lerp(1, 1.8, t),
            0.65,
            THREE.MathUtils.lerp(-1.8, 1, t),
          )
        if (branch === 3)
          particle.position.set(
            THREE.MathUtils.lerp(1, 2.6, t),
            0.9,
            THREE.MathUtils.lerp(-1.8, 1, t),
          )
        if (branch === 4)
          particle.position.set(
            1 + Math.sin(t * Math.PI * 2) * 0.55,
            0.95 + Math.cos(t * Math.PI * 2) * 0.45,
            -1.8,
          )
        particle.visible = p < 2 / 3
      })
    for (const tank of fuel.current) {
      if (tank) {
        tank.scale.y =
          mission.index === 7 ? 1 : Math.max(0.03, Math.min(1, p * 1.5))
        tank.position.y = tank.scale.y * 0.6
      }
    }
  })
  return (
    <>
      <group position={[1, 0, -1.8]}>
        <mesh castShadow position={[0, 0.45, 0]}>
          <boxGeometry args={[1.15, 0.9, 0.8]} />
          <meshStandardMaterial
            color="#cdc6b7"
            metalness={0.45}
            roughness={0.55}
          />
        </mesh>
        <mesh position={[0, 1.15, 0]}>
          <cylinderGeometry args={[0.13, 0.16, 0.65, 12]} />
          <meshStandardMaterial color="#929a99" metalness={0.7} />
        </mesh>
        <mesh position={[0, 1.51, 0]}>
          <cylinderGeometry args={[0.25, 0.13, 0.2, 12]} />
          <meshStandardMaterial color="#c4bca9" />
        </mesh>
        <mesh position={[0, 0.55, 0.41]}>
          <boxGeometry args={[0.5, 0.25, 0.015]} />
          <meshStandardMaterial
            color="#8dcab6"
            emissive="#417364"
            emissiveIntensity={0.8}
          />
        </mesh>
      </group>
      {[1.8, 2.6].map((x, i) => (
        <group key={x} position={[x, 0, 1]}>
          <mesh castShadow position={[0, 0.65, 0]}>
            <capsuleGeometry args={[0.28, 0.9, 6, 16]} />
            <meshStandardMaterial
              color={i ? '#acbfc0' : '#d4b27d'}
              metalness={0.2}
              roughness={0.4}
              transparent
              opacity={0.22}
              depthWrite={false}
            />
          </mesh>
          <mesh
            ref={(mesh) => {
              fuel.current[i] = mesh
            }}
            position={[0, 0.6, 0]}
          >
            <cylinderGeometry args={[0.24, 0.24, 1.2, 16]} />
            <meshStandardMaterial
              color={i ? '#97cbd5' : '#d4a867'}
              emissive={i ? '#284f60' : '#6b4826'}
              emissiveIntensity={0.35}
            />
          </mesh>
        </group>
      ))}
      <Line
        points={[
          [-4, 0.04, -13],
          [-4, 0.04, -3.5],
          [-0.5, 0.04, -1.8],
          [1, 0.04, -1.8],
        ]}
        color="#333a3b"
        lineWidth={3}
      />
      <group position={[-0.4, 0.4, -3.1]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.19, 0.55, 4, 12]} />
          <meshStandardMaterial
            color="#bcc5cc"
            metalness={0.35}
            roughness={0.5}
          />
        </mesh>
      </group>
      {mission.index === 4 && (
        <>
          <Line
            points={[
              [-1.5, 2.4, -1.8],
              [1, 1.5, -1.8],
            ]}
            color="#b9d4d8"
            transparent
            opacity={0.35}
            dashed
            dashSize={0.12}
            gapSize={0.1}
            lineWidth={1}
          />
          <Line
            points={[
              [-0.4, 0.5, -3.1],
              [1, 0.5, -1.8],
            ]}
            color="#c7d5e0"
            transparent
            opacity={0.5}
            lineWidth={1}
          />
          {mission.labels && (
            <>
              <Label position={[-1.8, 3.2, -1.8]} color="blue">
                <b>CO₂ · MARS ATMOSPHERE</b>
              </Label>
              <Label position={[-0.4, 1.35, -3.4]} color="neutral">
                <b>~6 t H₂ · FROM EARTH</b>
              </Label>
              <Label position={[2.2, 1.9, 1.2]} color="green">
                <b>CH₄ + O₂</b>
                <small>RETURN PROPELLANT</small>
              </Label>
            </>
          )}
        </>
      )}
      <Line
        points={[
          [1, 0.3, -1.8],
          [1.8, 0.3, 1],
          [2.6, 0.3, 1],
          [4, 0.3, 0],
        ]}
        color="#b8c0b1"
        lineWidth={2}
      />
      {mission.index === 4 && (
        <group ref={particles}>
          {Array.from({ length: 30 }, (_, i) => (
            <mesh key={i}>
              <sphereGeometry args={[0.045, 8, 8]} />
              <meshBasicMaterial
                color={i < 12 ? '#c7e0e9' : i < 18 ? '#e4b182' : '#9ccfd9'}
              />
            </mesh>
          ))}
        </group>
      )}
    </>
  )
}

function Rover() {
  return (
    <group position={[6, 0, 4]} rotation={[0, -0.5, 0]}>
      <mesh castShadow position={[0, 0.45, 0]}>
        <boxGeometry args={[1.5, 0.5, 0.85]} />
        <meshStandardMaterial color="#d2c7ac" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0.3, 0.94, 0]}>
        <boxGeometry args={[0.75, 0.6, 0.8]} />
        <meshStandardMaterial color="#bbc3bb" />
      </mesh>
      <mesh position={[0.69, 1, 0]}>
        <boxGeometry args={[0.02, 0.35, 0.65]} />
        <meshStandardMaterial color="#294754" metalness={0.7} roughness={0.2} />
      </mesh>
      {[-0.55, 0.55].flatMap((x) =>
        [-0.5, 0.5].map((z) => (
          <mesh
            key={`${x}-${z}`}
            position={[x, 0.2, z]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.27, 0.27, 0.16, 12]} />
            <meshStandardMaterial color="#272827" roughness={1} />
          </mesh>
        )),
      )}
    </group>
  )
}

export function MarsSurface({ mission }: { mission: Mission }) {
  const lander = useRef<THREE.Group>(null)
  const hab = useRef<THREE.Group>(null)
  const { index, labels, progress, reducedMotion } = mission
  useFrame(() => {
    if (lander.current)
      lander.current.position.y =
        index === 3 && !reducedMotion
          ? 0.22 + 7 * Math.pow(1 - Math.min(1, progress.current * 1.8), 2)
          : 0.22
    if (hab.current)
      hab.current.position.y = reducedMotion
        ? 0
        : 5 * Math.pow(1 - Math.min(1, progress.current * 4), 2)
  })
  return (
    <>
      <fog attach="fog" args={['#493a30', 23, 82]} />
      <hemisphereLight args={['#b5b4b7', '#644a33', 0.5]} />
      <ambientLight intensity={0.12} />
      <directionalLight
        castShadow
        position={[-12, 16, 8]}
        intensity={2.5}
        color="#fff0dc"
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.001}
        shadow-normalBias={0.035}
        shadow-radius={3}
      />
      <SurfaceTerrain />
      <group ref={lander} position={[4, 0.22, 0]}>
        <Spacecraft scale={1.5} />
      </group>
      {labels && (
        <Label position={[4, 3.6, 0]}>
          <b>EARTH RETURN VEHICLE</b>
          <small>{index === 3 ? 'UNCREWED ARRIVAL' : 'YOUR RIDE HOME'}</small>
        </Label>
      )}
      {index >= 4 && (
        <>
          <Reactor />
          <PropellantPlant mission={mission} />
          {labels && (
            <>
              <Label position={[-4, 2.4, -13]} color="neutral">
                <b>100 kW NUCLEAR REACTOR</b>
                <small>HISTORICAL MARS DIRECT · REMOTE POWER SOURCE</small>
              </Label>
              <Label position={[-0.8, 2.9, -1.8]} color="green">
                <b>ISRU PLANT</b>
                <small>LOCAL RESOURCES → PROPELLANT</small>
              </Label>
            </>
          )}
        </>
      )}
      {index === 7 && (
        <>
          <group ref={hab}>
            <group position={[9.5, 0, 1.5]}>
              <CrewHabitat />
            </group>
          </group>
          <Rover />
          <Astronaut position={[8.8, 0, 3.2]} scale={0.8} />
          <Astronaut position={[10.1, 0, 3.7]} scale={0.8} />
          <Astronaut position={[5.1, 0, 2.6]} scale={0.8} />
          <Astronaut position={[4.6, 0, 3.3]} scale={0.8} />
          <mesh position={[8.8, 0.9, 3]}>
            <cylinderGeometry args={[0.02, 0.02, 2.4, 8]} />
            <meshStandardMaterial color="#cbd0ca" />
          </mesh>
          <mesh position={[9.1, 1.8, 3]}>
            <boxGeometry args={[0.6, 0.35, 0.015]} />
            <meshStandardMaterial color="#eb865e" />
          </mesh>
          {labels && (
            <Label position={[9.5, 3.9, 1.5]} color="neutral">
              <b>CREW HABITAT</b>
              <small>FOUR EXPLORERS · ONE HOME</small>
            </Label>
          )}
        </>
      )}
    </>
  )
}
