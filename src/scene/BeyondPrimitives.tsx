import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import type { Mission } from '../hooks/useMission'
import { Label } from './SceneLabels'
import { CrewHabitat } from './Spacecraft'

export type P = [number, number, number]
export const blue = '#91bed5',
  amber = '#edaf7e',
  mint = '#a9ccb5'

export function Flow({
  from,
  to,
  mission,
  color = amber,
  bend = 1,
  speed = 1,
  dim = false,
  style = 'solid',
}: {
  from: P
  to: P
  mission: Mission
  color?: string
  bend?: number
  speed?: number
  dim?: boolean
  style?: 'solid' | 'dashed' | 'dotted'
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
        dashed={style !== 'solid'}
        dashSize={style === 'dotted' ? 0.05 : 0.32}
        gapSize={0.2}
      />
      <mesh
        position={curve.getPoint(0.56)}
        quaternion={new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          curve.getTangent(0.56),
        )}
        visible={!dim}
      >
        <coneGeometry args={[0.09, 0.28, 6]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <group ref={dots} visible={!dim}>
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
export function Caption({
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

export function Station({
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
      ) : kind === 'depot' ? (
        <group>
          <mesh castShadow position={[0, 0.6, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 1.4, 12]} />
            <meshStandardMaterial
              color="#b2b5b8"
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[0, 0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.55, 0.08, 12, 24]} />
            <meshStandardMaterial color="#6a7d87" metalness={0.8} />
          </mesh>
          {[-1, 1].map((s) => (
            <mesh
              key={s}
              position={[s * 0.9, 0.6, 0]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <boxGeometry args={[0.04, 1.1, 0.45]} />
              <meshStandardMaterial color="#35526a" metalness={0.6} />
            </mesh>
          ))}
        </group>
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

export function Rock({ at, scale = 1 }: { at: P; scale?: number }) {
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
export function Moon({ at, radius = 1.6 }: { at: P; radius?: number }) {
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

export function SailingShip({
  scale = 1,
  mission,
}: {
  scale?: number
  mission: Mission
}) {
  const ship = useRef<THREE.Group>(null)
  useFrame(() => {
    if (!ship.current) return
    const t = mission.elapsed.current
    if (!mission.paused && !mission.reducedMotion) {
      ship.current.rotation.z = Math.sin(t * 1.8) * 0.05
      ship.current.rotation.x = Math.cos(t * 1.4) * 0.04
      ship.current.position.y = -0.05 + Math.sin(t * 2.2) * 0.03
    }
  })
  return (
    <group ref={ship} scale={scale}>
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[1.5, 0.45, 0.55]} />
        <meshStandardMaterial color="#654321" roughness={0.8} />
      </mesh>
      <mesh
        position={[-0.9, 0.35, 0]}
        rotation={[0, 0, Math.PI / 4]}
        castShadow
      >
        <boxGeometry args={[0.35, 0.35, 0.5]} />
        <meshStandardMaterial color="#503318" roughness={0.8} />
      </mesh>
      <mesh position={[-1.25, 0.5, 0]} rotation={[0, 0, Math.PI / 6]}>
        <cylinderGeometry args={[0.02, 0.03, 0.7, 8]} />
        <meshStandardMaterial color="#3d2612" />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[1.6, 0.1, 0.08]} />
        <meshStandardMaterial color="#2d1c0d" />
      </mesh>
      <mesh position={[0.6, 0.55, 0]} castShadow>
        <boxGeometry args={[0.5, 0.4, 0.5]} />
        <meshStandardMaterial color="#503318" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.05, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.04, 1.4, 8]} />
        <meshStandardMaterial color="#3d2612" />
      </mesh>
      <mesh position={[0, 0.85, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.7, 8]} />
        <meshStandardMaterial color="#2d1c0d" />
      </mesh>
      <mesh position={[-0.04, 0.85, 0]}>
        <boxGeometry args={[0.02, 0.35, 0.65]} />
        <meshStandardMaterial color="#f7f2ea" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.5, 8]} />
        <meshStandardMaterial color="#2d1c0d" />
      </mesh>
      <mesh position={[-0.04, 1.35, 0]}>
        <boxGeometry args={[0.02, 0.28, 0.48]} />
        <meshStandardMaterial color="#f7f2ea" roughness={0.9} />
      </mesh>
      <mesh position={[-0.5, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.035, 1.1, 8]} />
        <meshStandardMaterial color="#3d2612" />
      </mesh>
      <mesh position={[-0.5, 0.75, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.55, 8]} />
        <meshStandardMaterial color="#2d1c0d" />
      </mesh>
      <mesh position={[-0.54, 0.75, 0]}>
        <boxGeometry args={[0.02, 0.3, 0.5]} />
        <meshStandardMaterial color="#f7f2ea" roughness={0.9} />
      </mesh>
      <mesh position={[0.5, 0.85, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.03, 1.0, 8]} />
        <meshStandardMaterial color="#3d2612" />
      </mesh>
      <mesh position={[0.5, 0.75, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.45, 8]} />
        <meshStandardMaterial color="#2d1c0d" />
      </mesh>
      <mesh position={[0.46, 0.75, 0]}>
        <boxGeometry args={[0.02, 0.26, 0.4]} />
        <meshStandardMaterial color="#f7f2ea" roughness={0.9} />
      </mesh>
    </group>
  )
}
