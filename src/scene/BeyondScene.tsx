import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line, Stars, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import type { Mission } from '../hooks/useMission'
import { Planet } from './CelestialBodies'
import { Label } from './SceneLabels'
import { CrewHabitat, Spacecraft, Astronaut } from './Spacecraft'
import { SurfaceTerrain } from './SurfaceTerrain'

type P = [number, number, number]
const blue = '#91bed5',
  amber = '#edaf7e',
  mint = '#a9ccb5'

function Flow({
  from,
  to,
  mission,
  color = amber,
  bend = 1,
  speed = 1,
  dim = false,
}: {
  from: P
  to: P
  mission: Mission
  color?: string
  bend?: number
  speed?: number
  dim?: boolean
}) {
  const dots = useRef<THREE.Group>(null)
  const curve = useMemo(
    () =>
      new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(...from),
        new THREE.Vector3(...from)
          .lerp(new THREE.Vector3(...to), 0.5)
          .add(new THREE.Vector3(0, bend, 0)),
        new THREE.Vector3(...to),
      ),
    [...from, ...to, bend],
  )
  useFrame(() => {
    dots.current?.children.forEach((dot, i) => {
      dot.position.copy(
        curve.getPoint((mission.elapsed.current * 0.065 * speed + i / 5) % 1),
      )
    })
  })
  return (
    <group>
      <Line
        points={curve.getPoints(48)}
        color={color}
        lineWidth={dim ? 0.6 : 1.4}
        transparent
        opacity={dim ? 0.12 : 0.6}
      />
      <group ref={dots}>
        {Array.from({ length: 5 }, (_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[dim ? 0.025 : 0.07, 8, 6]} />
            <meshBasicMaterial color={color} />
          </mesh>
        ))}
      </group>
    </group>
  )
}
function Caption({
  at,
  title,
  sub,
  mission,
}: {
  at: P
  title: string
  sub?: string
  mission: Mission
}) {
  return mission.labels ? (
    <Label position={at} color="neutral">
      <b>{title}</b>
      {sub && <small>{sub}</small>}
    </Label>
  ) : null
}

function Station({
  at,
  kind = 'factory',
  scale = 1,
  mission,
}: {
  at: P
  kind?: string
  scale?: number
  mission?: Mission
}) {
  const building = useRef<THREE.Group>(null),
    age = useRef(0)
  useFrame((_, delta) => {
    if (!mission || !building.current) return
    if (!mission.paused) age.current = Math.min(1, age.current + delta / 1.2)
    building.current.scale.y =
      scale *
      (mission.reducedMotion
        ? 1
        : 0.01 + 0.99 * (1 - Math.pow(1 - age.current, 3)))
  })
  return (
    <group ref={building} position={at} scale={scale}>
      {kind === 'habitat' ? (
        <CrewHabitat />
      ) : kind === 'power' ? (
        <>
          <mesh castShadow position={[0, 0.7, 0]}>
            <cylinderGeometry args={[0.35, 0.5, 1.5, 16]} />
            <meshStandardMaterial
              color="#bbb8ab"
              metalness={0.6}
              roughness={0.4}
            />
          </mesh>
          {[-1, 1].map((i) => (
            <mesh
              key={i}
              position={[i * 0.9, 0.8, 0]}
              rotation={[0, 0, i * 0.2]}
            >
              <boxGeometry args={[1.1, 1.8, 0.07]} />
              <meshStandardMaterial color="#536369" metalness={0.7} />
            </mesh>
          ))}
        </>
      ) : kind === 'greenhouse' ? (
        <mesh castShadow position={[0, 0.3, 0]} scale={[1.8, 0.8, 1]}>
          <sphereGeometry args={[1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color="#79a18a"
            transparent
            opacity={0.65}
            metalness={0.4}
            roughness={0.25}
          />
        </mesh>
      ) : (
        <>
          <mesh castShadow position={[0, 0.6, 0]}>
            <boxGeometry args={[2.1, 1.2, 1.3]} />
            <meshStandardMaterial color="#bdb5a4" roughness={0.7} />
          </mesh>
          {[0, 1].map((i) => (
            <mesh key={i} castShadow position={[i * 0.7 - 0.35, 1.6, 0]}>
              <cylinderGeometry args={[0.24, 0.24, 0.8, 12]} />
              <meshStandardMaterial color="#71878b" metalness={0.65} />
            </mesh>
          ))}
          <mesh position={[0, 0.7, 0.66]}>
            <boxGeometry args={[1.4, 0.12, 0.02]} />
            <meshStandardMaterial
              color={mint}
              emissive={mint}
              emissiveIntensity={0.35}
            />
          </mesh>
        </>
      )}
    </group>
  )
}

function Rock({ at, scale = 1 }: { at: P; scale?: number }) {
  const geo = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(1, 2),
      p = g.attributes.position
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i),
        y = p.getY(i),
        z = p.getZ(i)
      const r = 1 + 0.12 * Math.sin(x * 13 + y * 17 + z * 21)
      p.setXYZ(i, x * r * 1.3, y * r, z * r * 0.8)
    }
    g.computeVertexNormals()
    return g
  }, [])
  return (
    <mesh geometry={geo} position={at} scale={scale} castShadow>
      <meshStandardMaterial color="#8b8177" roughness={1} flatShading />
    </mesh>
  )
}
function Moon({ at, radius = 1.6 }: { at: P; radius?: number }) {
  const map = useTexture('/textures/moon_1024.jpg')
  useMemo(() => {
    map.colorSpace = THREE.SRGBColorSpace
  }, [map])
  return (
    <mesh position={at}>
      <sphereGeometry args={[radius, 48, 32]} />
      <meshStandardMaterial map={map} roughness={1} />
    </mesh>
  )
}

function MoonLogistics({ mission }: { mission: Mission }) {
  return (
    <>
      <Planet
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
const industryNames = [
  'DEPENDENT OUTPOST',
  'LOCAL PRODUCTION',
  'INDUSTRIAL SETTLEMENT',
  'PARTIALLY SELF-SUFFICIENT ECONOMY',
]
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
        title={industryNames[level]}
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
      {level > 1 && (
        <>
          <Station at={[9, 0, -3]} kind="greenhouse" mission={mission} />
          <Station at={[12, 0, 1]} mission={mission} />
          <Caption
            at={[11, 2.8, -1]}
            title="FOOD · MATERIALS · COMPONENTS"
            mission={mission}
          />
        </>
      )}
      {level > 2 && (
        <>
          <Station at={[7, 0, -7]} mission={mission} />
          <Station
            at={[13, 0, -6]}
            kind="habitat"
            scale={0.8}
            mission={mission}
          />
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
        dim={level > 1}
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
          <Station at={at} scale={0.7} />
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
      <Caption
        at={[5, -2, 1]}
        title="ENERGY IN · LOSSES OUT · MAINTENANCE ALWAYS"
        mission={mission}
      />
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
  useFrame(() => {
    if (group.current) group.current.rotation.y = mission.elapsed.current * 0.04
  })
  return (
    <>
      <group position={[3, 0, 0]} ref={group}>
        <Rock at={[0, 0, 0]} scale={2} />
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
        const at: P = [10, (i - 1.5) * 2, 0]
        return (
          <group key={name}>
            <Flow
              from={[5, 0, 0]}
              to={at}
              mission={mission}
              color={i % 2 ? amber : blue}
            />
            <Caption
              at={at}
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
function EngineLane({ mission, index }: { mission: Mission; index: number }) {
  const group = useRef<THREE.Group>(null),
    plume = useRef<THREE.Group>(null)
  const y = 3 - index * 3,
    kind = ['chemical', 'ntp', 'nep'][index],
    color = [amber, mint, blue][index]
  const active = mission.option === 'all' || mission.option === kind
  useFrame(() => {
    const t = (mission.elapsed.current / 18) % 1
    if (group.current) {
      const travel = index === 2 ? Math.max(0, (t - 0.25) / 0.75) : t
      group.current.position.set(
        -1 + travel * 13,
        y,
        index === 2 && t < 0.25 ? Math.sin(t * 32) * 0.65 : 0,
      )
      if (index === 2 && t < 0.25)
        group.current.position.x = -1 + Math.cos(t * 32) * 0.65
    }
    if (plume.current)
      plume.current.visible = active && (index === 2 || t < 0.14 || t > 0.87)
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
        opacity={0.35}
        dashed
        dashSize={0.25}
        gapSize={0.15}
      />
      <group ref={group} rotation={[0, 0, -Math.PI / 2]}>
        <Spacecraft scale={0.5} />
        {index === 1 && (
          <mesh position={[0, -0.65, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.9, 12]} />
            <meshStandardMaterial color="#abbca8" metalness={0.6} />
          </mesh>
        )}
        {index === 2 && <Station at={[0, -1, 0]} kind="power" scale={0.5} />}
        <group ref={plume}>
          <mesh position={[0, -1.3, 0]} rotation={[0, 0, Math.PI]}>
            <coneGeometry args={[index === 2 ? 0.07 : 0.18, 1.5, 12]} />
            <meshBasicMaterial color={color} transparent opacity={0.7} />
          </mesh>
        </group>
      </group>
      <Caption
        at={[4, y + 1, 0]}
        title={kind.toUpperCase()}
        sub={
          index === 0
            ? 'SHORT BURNS · COAST'
            : index === 1
              ? 'REACTOR HEATS PROPELLANT'
              : 'DEPARTURE SPIRAL · CONTINUOUS THRUST'
        }
        mission={mission}
      />
    </group>
  )
}
function Power({ mission }: { mission: Mission }) {
  const nep = mission.option === 'nep',
    moon = mission.option === 'moon'
  const names = nep
    ? ['POWER CONVERSION', 'ELECTRIC THRUSTERS', 'RADIATORS']
    : ['HABITAT / LIFE SUPPORT', 'ISRU / MINING', 'GREENHOUSE / FACTORY']
  return (
    <>
      <Station at={[1, 0, 0]} kind="power" scale={1.5} />
      <Caption
        at={[1, 3, 0]}
        title={
          nep
            ? 'NEP REACTOR'
            : moon
              ? 'LUNAR POLAR REACTOR'
              : 'MARS SURFACE REACTOR'
        }
        mission={mission}
      />
      {names.map((name, i) => {
        const at: P = [9, 0, (i - 1) * 4]
        return (
          <group key={name}>
            <Station
              at={at}
              kind={
                nep
                  ? 'factory'
                  : i === 0
                    ? 'habitat'
                    : i === 2
                      ? 'greenhouse'
                      : 'factory'
              }
              scale={0.65}
            />
            <Flow
              from={[2, 0.5, 0]}
              to={[8, 0.5, at[2]]}
              mission={mission}
              color={mint}
            />
            <Caption at={[9, 2.6, at[2]]} title={name} mission={mission} />
          </group>
        )
      })}
      <Caption
        at={[5, -2, 0]}
        title={
          nep ? 'ELECTRICITY → THRUST' : 'ELECTRICITY → A WORKING SETTLEMENT'
        }
        mission={mission}
      />
    </>
  )
}

function Network({ mission }: { mission: Mission }) {
  const final = mission.index === 10,
    resilience = mission.index === 4
  const links = useRef<THREE.Group>(null)
  useFrame(() => {
    links.current?.children.forEach((child, i) => {
      child.visible = !final || mission.progress.current > i * 0.1
    })
  })
  return (
    <>
      <Planet
        kind="earth"
        radius={1.7}
        position={new THREE.Vector3(0, 0, 1)}
        paused={mission.paused || mission.reducedMotion}
      />
      <Planet
        kind="mars"
        radius={0.9}
        position={new THREE.Vector3(10, 0, 0)}
        paused={mission.paused || mission.reducedMotion}
      />
      <Caption
        at={[0, -2.5, 1]}
        title="EARTH"
        sub="PEOPLE · KNOWLEDGE · EQUIPMENT"
        mission={mission}
      />
      <Caption
        at={[10, -1.8, 0]}
        title="MARS"
        sub={resilience ? 'DEPENDENT FOR A LONG TIME' : 'ENERGY · INDUSTRY'}
        mission={mission}
      />
      {!resilience && (
        <>
          <Moon at={[2, 3, -2]} radius={0.65} />
          <Caption at={[2, 4.4, -2]} title="MOON" mission={mission} />
          <Rock at={[8, 3, -5]} scale={0.7} />
          <Rock at={[6, 4, -7]} scale={0.35} />
          <Rock at={[10, 4, -8]} scale={0.42} />
          <Caption at={[8, 4.4, -5]} title="ASTEROIDS" mission={mission} />
        </>
      )}
      <group ref={links}>
        <group>
          <Flow
            from={[1, 1, 1]}
            to={[9, 1, 0]}
            mission={mission}
            color={amber}
            dim={mission.option !== 'all' && mission.option !== 'ntp'}
            speed={1.2}
          />
        </group>
        {!resilience && (
          <group>
            <Flow
              from={[0, 1, 1]}
              to={[2, 3, -2]}
              mission={mission}
              color={mint}
              dim={mission.option !== 'all' && mission.option !== 'chemical'}
              bend={0.5}
            />
          </group>
        )}
        {!resilience && (
          <group>
            <Flow
              from={[8, 3, -5]}
              to={[10, 1, 0]}
              mission={mission}
              color={blue}
              dim={mission.option !== 'all' && mission.option !== 'nep'}
              speed={0.45}
            />
            <Flow
              from={[8, 3, -5]}
              to={[2, 3, -2]}
              mission={mission}
              color={blue}
              bend={2}
              speed={0.45}
              dim={mission.option !== 'all' && mission.option !== 'nep'}
            />
          </group>
        )}
        {!resilience && (
          <group>
            <Station at={[10, 1.2, 0]} kind="power" scale={0.2} />
            <Station at={[2, 3.7, -2]} kind="power" scale={0.12} />
          </group>
        )}
      </group>
      {resilience && (
        <>
          <group position={[0, 0, 1]}>
            <Station at={[0.8, 1.6, 0.4]} kind="power" scale={0.12} />
            <mesh position={[1.2, 1.4, 0.2]}>
              <sphereGeometry args={[0.07, 8, 8]} />
              <meshBasicMaterial color="#a9e4ca" />
            </mesh>
          </group>
          <group position={[10, 0, 0]}>
            <Station at={[0.4, 0.9, 0.2]} kind="power" scale={0.12} />
            <Station at={[-0.4, 0.8, -0.3]} kind="habitat" scale={0.14} />
            <mesh position={[0.5, 0.8, 0.1]}>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshBasicMaterial color="#eeb27e" />
            </mesh>
          </group>
          <Caption
            at={[5, 2, 0]}
            title="ONE PLANET → TWO WORLDS"
            sub="DEPENDENT INITIALLY · INDEPENDENT CAPACITY OVER VERY LONG TIMESCALES"
            mission={mission}
          />
        </>
      )}
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
        color="#fff0dc"
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
      {i === 1 ? (
        <MoonLogistics mission={mission} />
      ) : i === 2 ? (
        <Industry mission={mission} />
      ) : i === 3 || i === 6 ? (
        <Ideas mission={mission} />
      ) : i === 5 ? (
        <Systems mission={mission} />
      ) : i === 7 ? (
        <Asteroids mission={mission} />
      ) : i === 8 ? (
        <>
          {[0, 1, 2].map((index) => (
            <EngineLane key={index} index={index} mission={mission} />
          ))}
        </>
      ) : i === 9 ? (
        <Power mission={mission} />
      ) : (
        <Network mission={mission} />
      )}
    </group>
  )
}
