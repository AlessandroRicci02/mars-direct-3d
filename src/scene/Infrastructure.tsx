import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Mission } from '../hooks/useMission'
import { Caption, Flow, Station, amber, blue, mint } from './BeyondPrimitives'
import type { P } from './BeyondPrimitives'

export function Radiators({ scale = 1 }: { scale?: number }) {
  return (
    <group scale={scale}>
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 1.25, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.8, 2.5, 0.07]} />
            <meshStandardMaterial
              color="#425a65"
              roughness={0.55}
              metalness={0.65}
              side={THREE.DoubleSide}
            />
          </mesh>
          {[-0.8, -0.4, 0, 0.4, 0.8].map((y) => (
            <mesh key={y} position={[0, y, 0.05]}>
              <boxGeometry args={[1.75, 0.025, 0.03]} />
              <meshStandardMaterial color="#99a6ac" metalness={0.6} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

// The long boom, shield, radiators and cargo rack distinguish this freighter
// from both the chemical ERV and the crew's descent habitat. Forward is +Y.
export function ElectricFreighter({ thrust = true }: { thrust?: boolean }) {
  return (
    <group>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.075, 0.075, 4.6, 8]} />
        <meshStandardMaterial color="#b5bec3" metalness={0.7} />
      </mesh>
      <mesh position={[0, 2, 0]}>
        <sphereGeometry args={[0.25, 16, 12]} />
        <meshStandardMaterial color="#ded7c7" metalness={0.6} />
      </mesh>
      <mesh position={[0, 1.35, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.1, 16]} />
        <meshStandardMaterial color="#797975" />
      </mesh>
      <group position={[0, -0.35, 0]}>
        <Radiators scale={0.65} />
      </group>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.35, -1.45, 0]} castShadow>
          <boxGeometry args={[0.5, 0.75, 0.55]} />
          <meshStandardMaterial color="#b9b5a9" roughness={0.7} />
        </mesh>
      ))}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.32, -2, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.12, 0.04, 8, 16]} />
            <meshStandardMaterial color="#697e8b" metalness={0.8} />
          </mesh>
          {thrust && (
            <mesh position={[0, -0.65, 0]} rotation={[0, 0, Math.PI]}>
              <coneGeometry args={[0.09, 1.2, 12]} />
              <meshBasicMaterial
                color={blue}
                transparent
                opacity={0.5}
                depthWrite={false}
              />
            </mesh>
          )}
        </group>
      ))}
    </group>
  )
}

export function FreighterRoute({
  from,
  to,
  mission,
  bend = 1,
  scale = 0.2,
}: {
  from: P
  to: P
  mission: Mission
  bend?: number
  scale?: number
}) {
  const ship = useRef<THREE.Group>(null)
  const curve = useMemo(() => {
    const a = new THREE.Vector3(...from),
      b = new THREE.Vector3(...to)
    return new THREE.QuadraticBezierCurve3(
      a,
      a
        .clone()
        .lerp(b, 0.5)
        .add(new THREE.Vector3(0, bend, 0)),
      b,
    )
  }, [...from, ...to, bend])
  const axis = useMemo(() => new THREE.Vector3(0, 1, 0), [])
  useFrame(() => {
    if (!ship.current) return
    const t = (0.25 + mission.elapsed.current * 0.028) % 1
    ship.current.position.copy(curve.getPoint(t))
    ship.current.quaternion.setFromUnitVectors(axis, curve.getTangent(t))
  })
  return (
    <group ref={ship} scale={scale}>
      <ElectricFreighter />
    </group>
  )
}

export function SurfacePower({ mission }: { mission: Mission }) {
  const nep = mission.option === 'nep',
    moon = mission.option === 'moon'
  if (nep)
    return (
      <group position={[0, 1, 0]}>
        <Station at={[0, 0, 0]} kind="power" scale={0.8} />
        <Caption
          at={[0, 2.5, 0]}
          title="REACTOR"
          sub="HEAT"
          mission={mission}
        />
        <Flow
          from={[0.8, 0.5, 0]}
          to={[4.2, 0.5, 0]}
          bend={0}
          color={amber}
          mission={mission}
        />
        <mesh position={[5, 0.5, 0]}>
          <boxGeometry args={[1.4, 0.9, 0.9]} />
          <meshStandardMaterial color="#c3bba9" metalness={0.6} />
        </mesh>
        <Caption
          at={[5, 2.5, 0]}
          title="CONVERSION"
          sub="HEAT → ELECTRICITY"
          mission={mission}
        />
        <Flow
          from={[5.8, 0.5, 0]}
          to={[9.5, 0.5, 0]}
          bend={0}
          color={mint}
          mission={mission}
        />
        <group position={[10.5, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
          {[-0.4, 0.4].map((x) => (
            <group key={x} position={[x, 0, 0]}>
              <mesh>
                <cylinderGeometry args={[0.23, 0.3, 0.6, 20]} />
                <meshStandardMaterial color="#889da4" metalness={0.8} />
              </mesh>
              <mesh position={[0, -1.2, 0]} rotation={[0, 0, Math.PI]}>
                <coneGeometry args={[0.15, 1.8, 16]} />
                <meshBasicMaterial color={blue} transparent opacity={0.6} />
              </mesh>
            </group>
          ))}
        </group>
        <Caption
          at={[10.5, 2.5, 0]}
          title="ELECTRIC THRUSTERS"
          sub="CONTINUOUS LOW THRUST"
          mission={mission}
        />
        <group position={[5, -3, 0]} rotation={[0, 0, Math.PI / 2]}>
          <Radiators scale={0.7} />
        </group>
        <Flow
          from={[5, 0, 0]}
          to={[5, -2.2, 0]}
          bend={0}
          color={amber}
          mission={mission}
        />
        <Caption
          at={[5, -4.3, 0]}
          title="RADIATORS"
          sub="WASTE HEAT TO SPACE"
          mission={mission}
        />
      </group>
    )

  return (
    <group>
      <mesh
        receiveShadow
        position={[5, -0.3, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[8.8, 64]} />
        <meshStandardMaterial
          color={moon ? '#494b4e' : '#593d32'}
          roughness={1}
        />
      </mesh>
      {Array.from({ length: 15 }, (_, i) => (
        <mesh
          key={i}
          position={[1 + ((i * 3.7) % 12), -0.13, -5 + ((i * 2.1) % 10)]}
          scale={[1, 0.25, 0.8]}
        >
          <icosahedronGeometry args={[0.14 + (i % 3) * 0.12, 0]} />
          <meshStandardMaterial
            color={moon ? '#77787a' : '#927058'}
            roughness={1}
          />
        </mesh>
      ))}
      {moon && (
        <mesh position={[11, -0.18, -4]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.4, 32]} />
          <meshStandardMaterial color="#111722" roughness={1} />
        </mesh>
      )}
      <Station at={[0, 0, -1]} kind="power" scale={1.1} />
      <Caption
        at={[0, 3, -1]}
        title={moon ? 'LUNAR POLAR REACTOR' : 'SURFACE FISSION'}
        sub="CONTINUOUS ELECTRICITY"
        mission={mission}
      />
      <Station at={[8, 0, -4]} kind="habitat" scale={0.65} />
      <Station at={[10, 0, 0]} scale={0.65} />
      <Station at={[7, 0, 4]} kind="greenhouse" scale={0.7} />
      {(
        [
          [8, -4, 'HABITAT'],
          [10, 0, moon ? 'POLAR ISRU' : 'ISRU / MINING'],
          [7, 4, 'FOOD / MANUFACTURING'],
        ] as const
      ).map(([x, z, name]) => (
        <group key={name}>
          <Flow
            from={[0.8, 0.15, -1]}
            to={[x, 0.15, z]}
            bend={0.08}
            color={mint}
            mission={mission}
          />
          <Caption at={[x, 2.5, z]} title={name} mission={mission} />
        </group>
      ))}
      <group position={[1, 0.5, 4]} rotation={[-0.55, 0, 0]}>
        <mesh>
          <boxGeometry args={[2.2, 1.3, 0.08]} />
          <meshStandardMaterial color="#213d58" metalness={0.4} />
        </mesh>
        {[-0.7, 0, 0.7].map((x) => (
          <mesh key={x} position={[x, 0, 0.05]}>
            <boxGeometry args={[0.02, 1.3, 0.02]} />
            <meshBasicMaterial color="#648096" />
          </mesh>
        ))}
      </group>
      <mesh position={[3, 0.45, 4]}>
        <boxGeometry args={[0.6, 0.9, 0.65]} />
        <meshStandardMaterial color="#92948c" />
      </mesh>
      <Caption
        at={[1.5, 2.1, 4]}
        title="SOLAR + STORAGE"
        sub="COMPLEMENTARY OPTIONS"
        mission={mission}
      />
      <Flow
        from={[3, 0.2, 4]}
        to={[7, 0.2, 4]}
        bend={0.08}
        color={blue}
        mission={mission}
      />
    </group>
  )
}
