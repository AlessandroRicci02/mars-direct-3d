import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'
import type { Mission } from '../hooks/useMission'
import { Planet, DISTANT_SUN } from './CelestialBodies'
import {
  Flow,
  Caption,
  Station,
  Rock,
  Moon,
  amber,
  blue,
  mint,
} from './BeyondPrimitives'
import type { P } from './BeyondPrimitives'
import { industrySteps } from '../data/development'
import { Astronaut } from './Spacecraft'
import { SurfaceTerrain } from './SurfaceTerrain'
import { ElectricFreighter, SurfacePower } from './Infrastructure'
import { LogisticsNetwork } from './LogisticsNetwork'
import { BeyondIntroduction } from './BeyondIntroduction'
import { PropulsionComparison } from './PropulsionComparison'
import { HumanoidRobot, RobotWorksite } from './HumanoidRobots'

function MoonLogistics({ mission }: { mission: Mission }) {
  return (
    <>
      <Planet
        lightPosition={DISTANT_SUN}
        kind="earth"
        radius={2}
        position={new THREE.Vector3(0, 0, 0)}
        paused={mission.paused || mission.reducedMotion}
      />
      <Moon at={[10, 0, -1]} />
      <Flow
        from={[1, 1, 0]}
        to={[9, 1, -1]}
        mission={mission}
        bend={2}
        speed={2}
        color={amber}
        dim={mission.option === 'cargo'}
      />
      <Flow
        from={[1, -1, 0]}
        to={[9, -1, -1]}
        mission={mission}
        bend={-2}
        speed={0.35}
        color={blue}
        dim={mission.option === 'crew'}
      />
      <Caption at={[0, -2.8, 0]} title="EARTH" mission={mission} />
      <Caption
        at={[10, -2, -1]}
        title="MOON"
        sub="POLAR ICE · REGOLITH"
        mission={mission}
      />
      <Caption
        at={[5, 3, 0]}
        title="CREW · HIGH THRUST"
        sub="CHEMICAL · CURRENT TECHNOLOGY"
        mission={mission}
      />
      <Caption
        at={[5, -3, 0]}
        title="CARGO · EFFICIENT, SLOW"
        sub="ELECTRIC LOGISTICS · PROPOSED"
        mission={mission}
      />
    </>
  )
}
function Industry({ mission }: { mission: Mission }) {
  const level =
    mission.option === 'all' ? mission.development : Number(mission.option)
  return (
    <>
      <SurfaceTerrain />
      <Station at={[5, 0, 2]} kind="habitat" />
      <Station at={[-1, 0, -8]} kind="power" />
      <Astronaut position={[6.6, 0, 3]} scale={0.8} />
      <Caption
        at={[6, 5.5, 2]}
        title={industrySteps[level]?.title || industrySteps[0].title}
        sub={
          level === 0
            ? 'HABITATS · MACHINERY · PARTS · PEOPLE IMPORTED'
            : 'SPECIALIZED IMPORTS STILL NEEDED'
        }
        mission={mission}
      />
      {level > 0 && (
        <>
          <Station at={[2, 0, -2]} mission={mission} />
          <group position={[-0.5, 0, -4]}>
            <mesh position={[0, 0.25, 0]} castShadow>
              <boxGeometry args={[1, 0.5, 0.8]} />
              <meshStandardMaterial color="#a99d82" />
            </mesh>
            <mesh position={[0.4, 0.8, 0]} rotation={[0, 0, -0.6]} castShadow>
              <boxGeometry args={[0.15, 1.7, 0.15]} />
              <meshStandardMaterial color="#9d7652" />
            </mesh>
            <mesh position={[1, 0.4, 0]}>
              <coneGeometry args={[0.18, 0.65, 8]} />
              <meshStandardMaterial color="#626767" metalness={0.5} />
            </mesh>
          </group>
          <Caption
            at={[0, 2.5, -2]}
            title="WATER · O₂ · CH₄"
            mission={mission}
          />
          <Flow
            from={[-1, 0.4, -8]}
            to={[2, 0.4, -2]}
            bend={0.2}
            mission={mission}
            color={mint}
          />
        </>
      )}
      {level >= 2 && (
        <>
          <mesh position={[10, 0.02, 2]} receiveShadow>
            <cylinderGeometry args={[2.3, 2.3, 0.15, 32]} />
            <meshStandardMaterial color="#746353" roughness={1} />
          </mesh>
          {[-1, 0, 1].map((i) => (
            <mesh key={i} position={[8 + i * 1.2, 0.45, -7]} castShadow>
              <boxGeometry args={[1, 0.9, 1.5]} />
              <meshStandardMaterial color="#9b775f" roughness={1} />
            </mesh>
          ))}
        </>
      )}
      {level >= 3 && (
        <>
          <Station at={[9, 0, -3]} kind="greenhouse" mission={mission} />
          <Caption at={[9, 2.8, -3]} title="FOOD" mission={mission} />
        </>
      )}
      {level >= 4 && (
        <>
          <Station at={[12, 0, 1]} mission={mission} />
          <HumanoidRobot
            mission={mission}
            at={[10.5, 0, 2.5]}
            scale={0.75}
            task="service"
          />
          <Caption at={[12, 2.8, 1]} title="MANUFACTURING" mission={mission} />
        </>
      )}
      {level >= 5 && (
        <>
          <Station at={[7, 0, -7]} mission={mission} />
          {level >= 6 && (
            <Station
              at={[13, 0, -6]}
              kind="habitat"
              scale={0.8}
              mission={mission}
            />
          )}
          <Flow
            from={[7, 1, -7]}
            to={[5, 1, 2]}
            mission={mission}
            color={mint}
          />
          <Flow
            from={[12, 1, 1]}
            to={[7, 1, -7]}
            mission={mission}
            color={blue}
          />
        </>
      )}
      <Flow
        from={[-7, 4, 3]}
        to={[5, 1, 2]}
        mission={mission}
        color={blue}
        dim={level > 3}
      />
      <Caption at={[-1, 3, 3]} title="FROM EARTH" mission={mission} />
    </>
  )
}

function Systems({ mission }: { mission: Mission }) {
  const material = mission.option === 'materials'
  const names = material
    ? ['MATERIAL', 'PRODUCT', 'REPAIR', 'RECYCLE']
    : ['WATER', 'HUMAN USE', 'RECOVERY', 'PURIFICATION']
  const nodes: P[] = [
    [0, 0, 0],
    [5, 0, -3],
    [10, 0, 0],
    [5, 0, 4],
  ]
  return (
    <>
      {nodes.map((at, i) => (
        <group key={names[i]}>
          <Station
            at={at}
            kind={i === 0 ? 'depot' : i === 1 ? 'habitat' : 'factory'}
            scale={0.7}
          />
          <Caption at={[at[0], 2, at[2]]} title={names[i]} mission={mission} />
          <Flow
            from={[at[0], 0.5, at[2]]}
            to={[nodes[(i + 1) % 4][0], 0.5, nodes[(i + 1) % 4][2]]}
            mission={mission}
            color={material ? amber : blue}
            bend={0.5}
          />
        </group>
      ))}
      <Flow
        from={[-2.5, 1, 0]}
        to={[-0.4, 0.5, 0]}
        bend={0}
        color={mint}
        mission={mission}
      />
      <Caption at={[-1.5, 2.5, 0]} title="MAKE-UP INPUTS" mission={mission} />
      <Station at={[2, 2, -4]} kind="power" scale={0.4} />
      <Flow
        from={[2, 2.5, -4]}
        to={[5, 0.5, -3]}
        bend={0}
        color={mint}
        mission={mission}
      />
      <Caption at={[2, 3.5, -4]} title="ENERGY" mission={mission} />
      <Flow
        from={[10.5, 0.5, 0]}
        to={[13, -0.5, 0]}
        bend={0}
        color={amber}
        mission={mission}
      />
      <Caption at={[12.3, 1.7, 0]} title="LOSSES OUT" mission={mission} />
    </>
  )
}
function Ideas({ mission }: { mission: Mission }) {
  const speculative = mission.index === 6
  const names = speculative
    ? [
        'SCIENCE',
        'ART & CULTURE',
        'RELATIONSHIPS',
        'EDUCATION',
        'PHILOSOPHY',
        'EXPLORATION',
      ]
    : [
        'POWER',
        'LIFE SUPPORT',
        'ROBOTICS',
        'FARMING',
        'RECYCLING',
        'REMOTE MEDICINE',
      ]
  return (
    <>
      <Planet
        lightPosition={DISTANT_SUN}
        kind="earth"
        radius={1.7}
        position={new THREE.Vector3(5, 0, 0)}
        paused={mission.paused || mission.reducedMotion}
      />
      {names.map((name, i) => {
        const angle = (i / 6) * Math.PI * 2,
          at: P = [5 + Math.cos(angle) * 5, Math.sin(angle) * 3.4, 0]
        return (
          <group key={name}>
            <mesh position={at}>
              <octahedronGeometry args={[0.38]} />
              <meshStandardMaterial
                color={speculative ? amber : mint}
                emissive={speculative ? amber : mint}
                emissiveIntensity={0.3}
              />
            </mesh>
            <Caption
              at={[at[0], at[1] + 0.9, 0]}
              title={name}
              mission={mission}
            />
            <Flow
              from={speculative ? [5, 0, 0] : at}
              to={speculative ? at : [5, 0, 0]}
              mission={mission}
              color={speculative ? amber : mint}
              bend={0}
            />
          </group>
        )
      })}
    </>
  )
}
function Asteroids({ mission }: { mission: Mission }) {
  const group = useRef<THREE.Group>(null)
  const drill = useRef<THREE.Group>(null)
  useFrame(() => {
    if (group.current) group.current.rotation.y = mission.elapsed.current * 0.04
    if (drill.current)
      drill.current.rotation.z =
        -0.45 + Math.sin(mission.elapsed.current * 0.6) * 0.08
  })
  return (
    <>
      <group position={[3, 0, 0]} ref={group}>
        <Rock at={[0, 0, 0]} scale={2} />
        <group position={[0, 1.9, 0]}>
          <mesh position={[0, 0.2, 0]} castShadow>
            <boxGeometry args={[0.8, 0.4, 0.7]} />
            <meshStandardMaterial color="#c1b9a4" metalness={0.4} />
          </mesh>
          {[-1, 1].map((side) => (
            <mesh
              key={side}
              position={[side * 0.65, 0.2, 0]}
              rotation={[-0.4, 0, 0]}
            >
              <boxGeometry args={[0.55, 0.05, 0.9]} />
              <meshStandardMaterial color="#31546e" metalness={0.5} />
            </mesh>
          ))}
          <group ref={drill} position={[0.4, 0.2, 0]}>
            <mesh position={[0.4, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.05, 0.05, 0.9, 8]} />
              <meshStandardMaterial color="#bc8e61" />
            </mesh>
            <mesh position={[0.85, -0.2, 0]}>
              <cylinderGeometry args={[0.06, 0.12, 0.65, 8]} />
              <meshStandardMaterial color="#838a8d" metalness={0.7} />
            </mesh>
          </group>
        </group>
        {Array.from({ length: 14 }, (_, i) => (
          <Rock
            key={i}
            at={[
              Math.cos(i * 2.4) * 4,
              Math.sin(i * 3) * 1.3,
              Math.sin(i * 2.4) * 3,
            ]}
            scale={0.06 + (i % 3) * 0.04}
          />
        ))}
      </group>
      <Caption
        at={[3, 3, 0]}
        title="PROSPECT → EXTRACT → PROCESS"
        sub="POTENTIAL FUTURE SPACE-RESOURCE ECONOMY"
        mission={mission}
      />
      {[
        'WATER → PROPELLANT',
        'METALS → STRUCTURES',
        'SILICATES → SHIELDING',
        'VOLATILES → INDUSTRY',
      ].map((name, i) => {
        const at: P = [10.5, (i - 1.5) * 2, 0]
        return (
          <group key={name}>
            <group position={at}>
              {i === 0 ? (
                <group scale={0.17} rotation={[0, 0, -Math.PI / 2]}>
                  <ElectricFreighter thrust={false} />
                </group>
              ) : i === 1 ? (
                <Station at={[0, -0.25, 0]} kind="depot" scale={0.35} />
              ) : i === 2 ? (
                <>
                  <Moon at={[-0.35, 0, 0]} radius={0.28} />
                  <Planet
                    lightPosition={DISTANT_SUN}
                    kind="mars"
                    radius={0.23}
                    position={new THREE.Vector3(0.35, 0, 0)}
                    paused={mission.paused || mission.reducedMotion}
                  />
                </>
              ) : (
                <Station at={[0, -0.2, 0]} scale={0.3} />
              )}
            </group>
            <Flow
              from={[5, 0, 0]}
              to={at}
              mission={mission}
              color={i % 2 ? amber : blue}
            />
            <Caption
              at={[at[0], at[1] + 0.9, at[2]]}
              title={name}
              sub={
                [
                  'DEEP-SPACE VEHICLES',
                  'ORBITAL INFRASTRUCTURE',
                  'MOON & MARS',
                  'LUNAR / MARTIAN INDUSTRY',
                ][i]
              }
              mission={mission}
            />
          </group>
        )
      })}
    </>
  )
}
function ResilienceScene({ mission }: { mission: Mission }) {
  return (
    <>
      <Planet
        lightPosition={DISTANT_SUN}
        kind="earth"
        radius={1.7}
        position={new THREE.Vector3(0, 0, 1)}
        paused={mission.paused || mission.reducedMotion}
      />
      <Planet
        lightPosition={DISTANT_SUN}
        kind="mars"
        radius={0.9}
        position={new THREE.Vector3(10, 0, 0)}
        paused={mission.paused || mission.reducedMotion}
      />
      <Caption
        at={[0, -2.5, 1]}
        title="EARTH"
        sub="PEOPLE · KNOWLEDGE · FOUNDATION FOR A LONG TIME"
        mission={mission}
      />
      <Caption
        at={[10, -1.8, 0]}
        title="MARS"
        sub="DEPENDENT INITIALLY · INDEPENDENT CAPACITY OVER LONG TIMESCALES"
        mission={mission}
      />
      <group position={[0, 0, 1]}>
        <Station at={[0.8, 1.6, 0.4]} kind="power" scale={0.12} />
        <mesh position={[1.2, 1.4, 0.2]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshBasicMaterial color="#a9e4ca" />
        </mesh>
      </group>
      <group position={[10, 0, 0]} visible={mission.option === 'future'}>
        <Station at={[0.4, 0.9, 0.2]} kind="power" scale={0.12} />
        <Station at={[-0.4, 0.8, -0.3]} kind="habitat" scale={0.14} />
        <mesh position={[0.5, 0.8, 0.1]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color="#eeb27e" />
        </mesh>
      </group>
      <Flow
        from={[1, 1, 1]}
        to={[9, 1, 0]}
        mission={mission}
        color={amber}
        speed={1.2}
        dim={mission.option === 'future'}
      />
      <Caption
        at={[5, 2, 0]}
        title="ONE PLANET → TWO WORLDS"
        sub="CIVILIZATIONAL RESILIENCE · NOT AN EASY BACKUP"
        mission={mission}
      />
    </>
  )
}

export function BeyondScene({ mission }: { mission: Mission }) {
  const i = mission.index
  return (
    <group>
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[-10, 15, 10]}
        intensity={2.6}
        color="#fff9f2"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-normalBias={0.04}
      />
      {i !== 2 && (
        <Stars radius={80} depth={40} count={1500} factor={2} fade speed={0} />
      )}
      {i === 0 ? (
        <BeyondIntroduction mission={mission} />
      ) : i === 1 ? (
        <MoonLogistics mission={mission} />
      ) : i === 2 ? (
        <Industry mission={mission} />
      ) : i === 3 || (i === 6 && mission.option === 'purpose') ? (
        <Ideas mission={mission} />
      ) : i === 4 ? (
        <ResilienceScene mission={mission} />
      ) : i === 5 ? (
        <Systems mission={mission} />
      ) : i === 6 ? (
        <RobotWorksite mission={mission} />
      ) : i === 7 ? (
        <Asteroids mission={mission} />
      ) : i === 8 ? (
        <PropulsionComparison mission={mission} />
      ) : i === 9 ? (
        <SurfacePower mission={mission} />
      ) : (
        <LogisticsNetwork mission={mission} />
      )}
    </group>
  )
}
