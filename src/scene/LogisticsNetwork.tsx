import * as THREE from 'three'
import type { Mission } from '../hooks/useMission'
import { Planet, DISTANT_SUN } from './CelestialBodies'
import {
  Caption,
  Flow,
  Moon,
  Rock,
  Station,
  amber,
  blue,
  mint,
} from './BeyondPrimitives'
import { FreighterRoute } from './Infrastructure'

export function LogisticsNetwork({ mission }: { mission: Mission }) {
  const option = mission.option
  const triangle = option === 'triangle'
  // Monotonic chapter progress: completed infrastructure remains visible until replay.
  const step = option === 'all' ? mission.development : 5
  const dim = (kind: string) =>
    !['all', 'expanded', 'triangle', kind].includes(option)
  const paused = mission.paused || mission.reducedMotion
  return (
    <group position={[0.5, 0.5, 0]} scale={0.86}>
      <Planet
        lightPosition={DISTANT_SUN}
        kind="earth"
        radius={1.5}
        position={new THREE.Vector3(0, 0, 1)}
        paused={paused}
      />
      <Planet
        lightPosition={DISTANT_SUN}
        kind="mars"
        radius={0.8}
        position={new THREE.Vector3(11, 0, 0)}
        paused={paused}
      />
      <Caption
        at={[0, -2.1, 1]}
        title="EARTH"
        sub="PEOPLE · SPECIALIZED IMPORTS"
        mission={mission}
      />
      <Caption
        at={[11, -1.5, 0]}
        title="MARS"
        sub={step >= 4 ? 'LOCAL INDUSTRY' : 'DEPENDENT OUTPOST'}
        mission={mission}
      />
      <Flow
        from={[1.2, 0.5, 1]}
        to={[10.2, 0.5, 0]}
        bend={-1.1}
        mission={mission}
        color={mint}
        style="dashed"
        dim={dim('ntp')}
      />
      {step >= 1 && !triangle && (
        <>
          <Moon at={[0.7, 4.3, -1]} radius={0.55} />
          <Caption
            at={[0.7, 5.6, -1]}
            title="MOON"
            sub="LOCAL RESOURCES"
            mission={mission}
          />
          <Station at={[5.4, 1.9, 0]} kind="depot" scale={0.6} />
          <Caption at={[5.4, 1.3, 0]} title="ORBITAL DEPOT" mission={mission} />
          <Flow
            from={[-0.4, 1.5, 1]}
            to={[0.3, 3.8, -1]}
            bend={0.2}
            mission={mission}
            color={amber}
            dim={dim('chemical')}
            speed={1.5}
          />
          <Flow
            from={[1.2, 4, -1]}
            to={[5.1, 2.5, 0]}
            bend={0.25}
            mission={mission}
            color={amber}
            dim={dim('chemical')}
          />
        </>
      )}
      {step >= 2 && (
        <>
          <Rock at={[10.4, 5, -3]} scale={0.65} />
          <Rock at={[12, 5.7, -4]} scale={0.3} />
          <Rock at={[8.9, 5.8, -4.5]} scale={0.3} />
          <Caption
            at={[10.5, 6.5, -3]}
            title="ASTEROIDS"
            sub="WATER · METALS · FEEDSTOCK"
            mission={mission}
          />
          <Flow
            from={[10.9, 1, 0]}
            to={[10.4, 4.5, -3]}
            bend={0.25}
            mission={mission}
            color={blue}
            style="dotted"
            dim={dim('nep')}
            speed={0.45}
          />
          {triangle ? (
            <Flow
              from={[9.7, 5, -3]}
              to={[0, 1.5, 1]}
              bend={2}
              mission={mission}
              color={blue}
              style="dotted"
              speed={0.4}
            />
          ) : (
            <Flow
              from={[9.7, 4.8, -3]}
              to={[5.6, 2.6, 0]}
              bend={0.5}
              mission={mission}
              color={blue}
              style="dotted"
              dim={dim('nep')}
              speed={0.45}
            />
          )}
        </>
      )}
      {step >= 3 && !triangle && (
        <>
          <Station at={[11.2, 0.75, 0.2]} kind="power" scale={0.16} />
          <Station at={[0.9, 4.8, -0.9]} kind="power" scale={0.12} />
          {[
            [11.3, 1.1, 0.2],
            [1, 5, -0.9],
          ].map((at, i) => (
            <mesh key={i} position={new THREE.Vector3(...at)}>
              <sphereGeometry args={[0.09, 12, 8]} />
              <meshBasicMaterial color={mint} />
            </mesh>
          ))}
          <Caption at={[12.1, 2, 0]} title="SURFACE POWER" mission={mission} />
        </>
      )}
      {step >= 4 && !triangle && (
        <>
          <Station at={[10.6, 0.65, 0.4]} kind="factory" scale={0.16} />
          <Flow
            from={[6, 2.3, 0]}
            to={[10.3, 0.8, 0]}
            bend={0.9}
            mission={mission}
            color={blue}
            style="dotted"
            dim={dim('nep')}
            speed={0.45}
          />
        </>
      )}
      {step >= 5 && !triangle && (
        <>
          <Flow
            from={[9.7, 5.3, -3]}
            to={[1.3, 4.5, -1]}
            bend={1.5}
            mission={mission}
            color={blue}
            style="dotted"
            dim={dim('nep')}
            speed={0.4}
          />
          {!dim('nep') && (
            <FreighterRoute
              from={[9.7, 4.8, -3]}
              to={[5.6, 2.6, 0]}
              bend={0.5}
              mission={mission}
              scale={0.24}
            />
          )}
        </>
      )}
      {triangle && (
        <Caption
          at={[5.5, 3, 0]}
          title="ZUBRIN’S TRADE TRIANGLE"
          sub="PROPOSED ECONOMIC MODEL"
          mission={mission}
        />
      )}
    </group>
  )
}
