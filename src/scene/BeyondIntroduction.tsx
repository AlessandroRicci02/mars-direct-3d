import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Mission } from '../hooks/useMission'
import { Planet, DISTANT_SUN } from './CelestialBodies'
import { Spacecraft } from './Spacecraft'
import {
  Caption,
  Flow,
  SailingShip,
  Station,
  amber,
  blue,
  mint,
} from './BeyondPrimitives'
import { FreighterRoute } from './Infrastructure'

export function BeyondIntroduction({ mission }: { mission: Mission }) {
  const sailing = useRef<THREE.Group>(null),
    craft = useRef<THREE.Group>(null)
  const analogy = mission.option === 'analogy',
    network = mission.option === 'transport'
  const height = analogy ? 3 : 0
  useFrame(() => {
    const t = (mission.elapsed.current * 0.045) % 1
    sailing.current?.position.set(9 - 8 * t, -2.3, 0)
    craft.current?.position.set(
      2 + 6 * t,
      height + Math.sin(t * Math.PI) * 2,
      0,
    )
  })
  return (
    <group position={[0, 1, 0]}>
      <Planet
        lightPosition={DISTANT_SUN}
        kind="earth"
        radius={analogy ? 1.2 : 2}
        position={new THREE.Vector3(0, height, 0)}
        paused={mission.paused || mission.reducedMotion}
      />
      <Planet
        lightPosition={DISTANT_SUN}
        kind="mars"
        radius={analogy ? 0.64 : 1.064}
        position={new THREE.Vector3(10, height, 0)}
        paused={mission.paused || mission.reducedMotion}
      />
      <Caption
        at={[0, height - (analogy ? 1.6 : 2.7), 0]}
        title="EARTH"
        sub="THE POINT OF DEPARTURE"
        mission={mission}
      />
      <Caption
        at={[10, height - (analogy ? 1.2 : 1.7), 0]}
        title="MARS"
        sub="A POSSIBLE NEW CENTER"
        mission={mission}
      />
      <Flow
        from={[2, height, 0]}
        to={[8, height, 0]}
        bend={4}
        mission={mission}
        color={amber}
      />
      <group ref={craft} scale={0.4} rotation={[0, 0, -Math.PI / 2]}>
        <Spacecraft />
      </group>
      {analogy && (
        <group>
          <mesh position={[5, -2.55, 0]} receiveShadow>
            <boxGeometry args={[10, 0.15, 3]} />
            <meshStandardMaterial
              color="#123344"
              roughness={0.45}
              metalness={0.25}
            />
          </mesh>
          {[0, 10].map((x) => (
            <mesh key={x} position={[x, -2.25, 0]} scale={[1.3, 0.25, 1]}>
              <icosahedronGeometry args={[1, 1]} />
              <meshStandardMaterial color="#6b7358" roughness={1} />
            </mesh>
          ))}
          <group ref={sailing}>
            <SailingShip mission={mission} scale={0.7} />
          </group>
          <Flow
            from={[9, -2.25, 0]}
            to={[1, -2.25, 0]}
            bend={0}
            mission={mission}
            color={blue}
            speed={0.55}
            style="dashed"
          />
          <Caption at={[0, -3.5, 0]} title="AMERICAS" mission={mission} />
          <Caption at={[10, -3.5, 0]} title="EUROPE" mission={mission} />
          <Caption
            at={[5, -0.4, 0]}
            title="ZUBRIN’S LIMITED HISTORICAL ANALOGY"
            mission={mission}
          />
        </group>
      )}
      {network && (
        <group>
          <Station at={[5, -2, 0]} kind="depot" scale={0.8} />
          <Caption
            at={[5, -3.5, 0]}
            title="REPEATED LOGISTICS"
            sub="TRANSPORT · ENERGY · RESOURCES"
            mission={mission}
          />
          <Flow
            from={[1.5, -0.5, 0]}
            to={[4.5, -1.5, 0]}
            bend={-1}
            mission={mission}
            color={mint}
          />
          <Flow
            from={[5.5, -1.5, 0]}
            to={[9, -0.5, 0]}
            bend={-1}
            mission={mission}
            color={blue}
            style="dotted"
            speed={0.4}
          />
          <FreighterRoute
            from={[5.5, -1.5, 0]}
            to={[9, -0.5, 0]}
            bend={-1}
            mission={mission}
            scale={0.2}
          />
        </group>
      )}
      {!analogy && !network && (
        <Caption
          at={[5, 4, 0]}
          title="FROM EXPEDITION TO POSSIBILITY"
          sub="PART II · BEYOND MARS DIRECT"
          mission={mission}
        />
      )}
    </group>
  )
}
