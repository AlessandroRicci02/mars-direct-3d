import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Mission } from '../hooks/useMission'
import { Caption, type P } from './BeyondPrimitives'

const shell = '#d7ddd9'
const joint = '#252e34'

function Joint({ at = [0, 0, 0], radius = 0.1 }: { at?: P; radius?: number }) {
  return (
    <mesh position={at} castShadow>
      <sphereGeometry args={[radius, 12, 8]} />
      <meshStandardMaterial color={joint} metalness={0.7} roughness={0.38} />
    </mesh>
  )
}

function Crate({ at = [0, 0, 0] }: { at?: P }) {
  return (
    <group position={at}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.66, 0.4, 0.44]} />
        <meshStandardMaterial
          color="#656e70"
          roughness={0.6}
          metalness={0.35}
        />
      </mesh>
      {[-0.22, 0.22].map((x) => (
        <mesh key={x} position={[x, 0, 0.225]}>
          <boxGeometry args={[0.035, 0.4, 0.018]} />
          <meshStandardMaterial color="#e9a47c" />
        </mesh>
      ))}
      <mesh position={[0, 0.05, 0.232]}>
        <boxGeometry args={[0.23, 0.075, 0.01]} />
        <meshStandardMaterial color="#d1d7d5" />
      </mesh>
    </group>
  )
}

// Unbranded, lightweight concept model. Shoulder/elbow articulation is driven
// by the mission clock, so pause, replay and reduced motion stay consistent.
export function HumanoidRobot({
  mission,
  at = [0, 0, 0],
  scale = 1,
  task = 'carry',
  rotation = 0,
}: {
  mission: Mission
  at?: P
  scale?: number
  task?: 'carry' | 'service'
  rotation?: number
}) {
  const left = useRef<THREE.Group>(null)
  const right = useRef<THREE.Group>(null)
  const elbow = useRef<THREE.Group>(null)
  const head = useRef<THREE.Group>(null)
  const load = useRef<THREE.Group>(null)
  useFrame(() => {
    const wave = Math.sin(mission.elapsed.current * 1.2)
    if (left.current)
      left.current.rotation.x = task === 'carry' ? -0.75 + wave * 0.07 : -0.15
    if (right.current)
      right.current.rotation.x =
        task === 'carry' ? -0.75 + wave * 0.07 : -0.95 + wave * 0.14
    if (elbow.current)
      elbow.current.rotation.x = task === 'carry' ? -0.95 : -0.6 - wave * 0.12
    if (head.current) head.current.rotation.x = 0.12 + wave * 0.04
    if (load.current) load.current.position.y = 1.08 - wave * 0.035
  })
  return (
    <group position={at} scale={scale} rotation={[0, rotation, 0]}>
      <mesh position={[0, 1.32, 0]} castShadow>
        <cylinderGeometry args={[0.37, 0.26, 0.5, 6]} />
        <meshStandardMaterial color={shell} roughness={0.35} metalness={0.5} />
      </mesh>
      <mesh position={[0, 1.39, 0.29]}>
        <boxGeometry args={[0.32, 0.13, 0.055]} />
        <meshStandardMaterial color={joint} metalness={0.5} />
      </mesh>
      <mesh position={[0, 1.4, 0.324]}>
        <boxGeometry args={[0.21, 0.018, 0.015]} />
        <meshBasicMaterial color="#f5a475" />
      </mesh>
      <mesh position={[0, 0.96, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.23, 0.24, 12]} />
        <meshStandardMaterial color={joint} metalness={0.6} />
      </mesh>
      <Joint at={[0, 1.65, 0]} radius={0.09} />
      <group ref={head} position={[0, 1.82, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.17, 0.12, 4, 12]} />
          <meshStandardMaterial
            color={shell}
            metalness={0.4}
            roughness={0.35}
          />
        </mesh>
        <mesh position={[0, 0.025, 0.146]}>
          <boxGeometry args={[0.28, 0.115, 0.06]} />
          <meshStandardMaterial
            color="#081219"
            metalness={0.75}
            roughness={0.16}
          />
        </mesh>
        {[-0.065, 0.065].map((x) => (
          <mesh key={x} position={[x, 0.027, 0.179]}>
            <sphereGeometry args={[0.016, 8, 6]} />
            <meshBasicMaterial color="#97d9e2" />
          </mesh>
        ))}
      </group>
      {[-1, 1].map((side) => (
        <group key={side}>
          <group
            ref={side === -1 ? left : right}
            position={[side * 0.43, 1.51, 0]}
          >
            <Joint radius={0.13} />
            <mesh position={[0, -0.23, 0]} castShadow>
              <capsuleGeometry args={[0.09, 0.25, 3, 10]} />
              <meshStandardMaterial
                color={shell}
                metalness={0.5}
                roughness={0.4}
              />
            </mesh>
            <group
              ref={side === 1 ? elbow : undefined}
              position={[0, -0.43, 0]}
              rotation={[-0.95, 0, 0]}
            >
              <Joint radius={0.09} />
              <mesh position={[0, -0.18, 0]} castShadow>
                <capsuleGeometry args={[0.075, 0.21, 3, 10]} />
                <meshStandardMaterial
                  color={shell}
                  metalness={0.5}
                  roughness={0.4}
                />
              </mesh>
              <mesh position={[0, -0.37, 0]} castShadow>
                <boxGeometry args={[0.12, 0.14, 0.07]} />
                <meshStandardMaterial color={joint} />
              </mesh>
              {[-1, 1].map((finger) => (
                <mesh
                  key={finger}
                  position={[finger * 0.05, -0.45, 0.02]}
                  castShadow
                >
                  <boxGeometry args={[0.025, 0.1, 0.045]} />
                  <meshStandardMaterial color={shell} metalness={0.7} />
                </mesh>
              ))}
            </group>
          </group>
          <Joint at={[side * 0.19, 0.83, 0]} radius={0.12} />
          <mesh position={[side * 0.2, 0.65, 0]} castShadow>
            <capsuleGeometry args={[0.105, 0.22, 3, 10]} />
            <meshStandardMaterial
              color={shell}
              metalness={0.5}
              roughness={0.4}
            />
          </mesh>
          <Joint at={[side * 0.2, 0.42, 0]} radius={0.095} />
          <mesh position={[side * 0.2, 0.25, 0]} castShadow>
            <capsuleGeometry args={[0.085, 0.19, 3, 10]} />
            <meshStandardMaterial
              color={shell}
              metalness={0.5}
              roughness={0.4}
            />
          </mesh>
          <mesh position={[side * 0.2, 0.06, 0.09]} castShadow>
            <boxGeometry args={[0.2, 0.12, 0.38]} />
            <meshStandardMaterial color={joint} roughness={0.75} />
          </mesh>
        </group>
      ))}
      {task === 'carry' && (
        <group ref={load} position={[0, 1.08, 0.73]}>
          <Crate />
        </group>
      )}
    </group>
  )
}

export function RobotWorksite({ mission }: { mission: Mission }) {
  const service = mission.option === 'service'
  return (
    <group>
      <mesh position={[5.5, -0.14, 0]} receiveShadow>
        <boxGeometry args={[10, 0.28, 7]} />
        <meshStandardMaterial color="#363632" roughness={0.95} />
      </mesh>
      {[-2, 0, 2].map((z) => (
        <mesh
          key={z}
          position={[5.5, 0.008, z]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[9.5, 0.018]} />
          <meshBasicMaterial color="#66665c" transparent opacity={0.5} />
        </mesh>
      ))}
      <group position={[8.8, 0, -1.8]} rotation={[0, -0.3, 0]}>
        <mesh position={[0, 0.9, 0]} castShadow>
          <boxGeometry args={[1.3, 1.8, 0.65]} />
          <meshStandardMaterial
            color="#525f64"
            metalness={0.6}
            roughness={0.45}
          />
        </mesh>
        <mesh position={[0, 1.22, 0.335]}>
          <boxGeometry args={[0.95, 0.56, 0.015]} />
          <meshStandardMaterial
            color="#204653"
            emissive="#37748a"
            emissiveIntensity={0.5}
          />
        </mesh>
        {[0.39, 0.53, 0.67].map((y) => (
          <mesh key={y} position={[0, y, 0.34]}>
            <boxGeometry args={[0.85, 0.035, 0.02]} />
            <meshStandardMaterial color="#1b292c" />
          </mesh>
        ))}
      </group>
      <HumanoidRobot
        mission={mission}
        at={[4.1, 0, 0.5]}
        scale={1.7}
        task={service ? 'service' : 'carry'}
        rotation={-0.2}
      />
      <HumanoidRobot
        mission={mission}
        at={[8, 0, 0.6]}
        scale={1.25}
        task="service"
        rotation={-0.35}
      />
      <group position={[7.5, 0, 1.8]}>
        <mesh position={[0, 1.05, 0]} castShadow>
          <boxGeometry args={[1.65, 0.15, 0.85]} />
          <meshStandardMaterial
            color="#7f8785"
            metalness={0.7}
            roughness={0.4}
          />
        </mesh>
        {[-0.6, 0.6].map((x) => (
          <mesh key={x} position={[x, 0.5, 0]} castShadow>
            <boxGeometry args={[0.08, 1, 0.65]} />
            <meshStandardMaterial color={joint} metalness={0.7} />
          </mesh>
        ))}
        <Crate at={[0, 1.32, 0]} />
      </group>
      {service ? (
        <group position={[4.1, 0, 2]}>
          <mesh position={[0, 1.6, 0]} castShadow>
            <boxGeometry args={[1.2, 1, 0.5]} />
            <meshStandardMaterial color="#757f80" metalness={0.6} />
          </mesh>
          <mesh position={[0, 1.1, 0]} castShadow>
            <boxGeometry args={[0.16, 2.2, 0.16]} />
            <meshStandardMaterial color={joint} metalness={0.7} />
          </mesh>
          <mesh position={[0, 1.67, -0.26]}>
            <boxGeometry args={[0.78, 0.4, 0.015]} />
            <meshBasicMaterial color="#274749" />
          </mesh>
        </group>
      ) : (
        <>
          <Crate at={[2.1, 0.2, 1.5]} />
          <Crate at={[2.1, 0.62, 1.5]} />
          <Crate at={[2.1, 0.2, 2.1]} />
        </>
      )}
      <Caption
        at={[3.7, 4, 0.5]}
        title="AI HUMANOID"
        sub={
          service
            ? 'INSPECT · SERVICE · VERIFY'
            : 'HANDLE SUPPLIES · ASSIST CREW'
        }
        mission={mission}
      />
      <Caption
        at={[8.5, 3.7, -1.5]}
        title="HUMAN SUPERVISION"
        sub="TASK PLANNING · EXCEPTION HANDLING"
        mission={mission}
      />
    </group>
  )
}
