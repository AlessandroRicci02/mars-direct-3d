import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

export function Spacecraft({
  habitat = false,
  thrust = false,
  scale = 1,
}: {
  habitat?: boolean
  thrust?: boolean
  scale?: number
}) {
  return (
    <group scale={scale}>
      <mesh castShadow position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.36, 0.43, 1.1, 16]} />
        <meshStandardMaterial color="#dfd9ce" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh castShadow position={[0, 1.45, 0]}>
        <coneGeometry args={[0.36, 0.45, 16]} />
        <meshStandardMaterial
          color={habitat ? '#dadbd7' : '#ed9366'}
          metalness={0.35}
          roughness={0.45}
        />
      </mesh>
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.445, 0.445, 0.18, 16]} />
        <meshStandardMaterial color="#a95738" />
      </mesh>
      <mesh position={[0, 1.08, 0]}>
        <cylinderGeometry args={[0.367, 0.367, 0.16, 16]} />
        <meshStandardMaterial color="#182c3b" metalness={0.7} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.19, 0.28, 0.3, 12]} />
        <meshStandardMaterial color="#35383b" metalness={0.8} roughness={0.3} />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <group key={i} rotation={[0, (i * Math.PI) / 2 + Math.PI / 4, 0]}>
          <mesh castShadow position={[0.43, 0.14, 0]} rotation={[0, 0, -0.55]}>
            <cylinderGeometry args={[0.035, 0.045, 0.8, 6]} />
            <meshStandardMaterial color="#a4a5a3" metalness={0.8} />
          </mesh>
          <mesh position={[0.65, -0.2, 0]}>
            <cylinderGeometry args={[0.13, 0.15, 0.07, 8]} />
            <meshStandardMaterial color="#444648" />
          </mesh>
        </group>
      ))}
      {habitat && (
        <>
          {[-1, 1].map((side) => (
            <mesh key={side} position={[side * 0.9, 0.7, 0]}>
              <boxGeometry args={[1, 0.04, 0.6]} />
              <meshStandardMaterial
                color="#28475d"
                metalness={0.65}
                roughness={0.3}
              />
            </mesh>
          ))}
        </>
      )}
      {thrust && (
        <group position={[0, -0.7, 0]}>
          <mesh rotation={[0, 0, Math.PI]}>
            <coneGeometry args={[0.2, 1.4, 16]} />
            <meshBasicMaterial
              color="#86cfff"
              transparent
              opacity={0.55}
              depthWrite={false}
            />
          </mesh>
          <mesh position={[0, 0.25, 0]} rotation={[0, 0, Math.PI]}>
            <coneGeometry args={[0.1, 0.9, 16]} />
            <meshBasicMaterial color="#fff5de" />
          </mesh>
          <pointLight intensity={2} distance={3} color="#7ad2ff" />
        </group>
      )}
    </group>
  )
}

export function SpentStage({
  scale = 1,
  thrust = false,
}: {
  scale?: number
  thrust?: boolean
}) {
  return (
    <group scale={scale}>
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.34, 0.34, 1.2, 16]} />
        <meshStandardMaterial
          color="#c2c7c9"
          metalness={0.65}
          roughness={0.35}
        />
      </mesh>
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.355, 0.355, 0.15, 16]} />
        <meshStandardMaterial color="#889299" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.45, 0]}>
        <cylinderGeometry args={[0.355, 0.355, 0.15, 16]} />
        <meshStandardMaterial color="#364047" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.85, 0]}>
        <coneGeometry args={[0.22, 0.5, 16]} />
        <meshStandardMaterial
          color="#222527"
          metalness={0.85}
          roughness={0.25}
        />
      </mesh>
      {thrust && (
        <group position={[0, -1.35, 0]}>
          <mesh rotation={[0, 0, Math.PI]}>
            <coneGeometry args={[0.22, 1.6, 16]} />
            <meshBasicMaterial
              color="#7eccff"
              transparent
              opacity={0.6}
              depthWrite={false}
            />
          </mesh>
          <mesh position={[0, 0.3, 0]} rotation={[0, 0, Math.PI]}>
            <coneGeometry args={[0.12, 1.0, 16]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <pointLight intensity={3} distance={4} color="#8adaff" />
        </group>
      )}
    </group>
  )
}

export function HabitatDepartureStack({ scale = 0.55 }: { scale?: number }) {
  return (
    <group scale={scale}>
      <group position={[0, 0.7, 0]}>
        <CrewHabitat />
      </group>
      <group position={[0, -1.1, 0]}>
        <SpentStage scale={1.1} thrust={true} />
      </group>
    </group>
  )
}

export function TetherCraft({ paused }: { paused: boolean }) {
  const group = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (group.current && !paused) group.current.rotation.z += delta * 0.23
  })
  return (
    <group ref={group}>
      <Line
        points={[
          [0, -1.8, 0],
          [0, 1.8, 0],
        ]}
        color="#d0dde2"
        lineWidth={1.3}
      />
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.08, 12, 8]} />
        <meshStandardMaterial
          color="#e2a578"
          emissive="#753e19"
          emissiveIntensity={0.6}
        />
      </mesh>
      <group position={[0, 1.8, 0]}>
        <group scale={0.34} rotation={[0, 0, Math.PI]}>
          <CrewHabitat />
        </group>
      </group>
      <group position={[0, -1.8, 0]}>
        <SpentStage scale={0.46} />
      </group>
    </group>
  )
}

export function Astronaut({
  position = [0, 0, 0],
  scale = 1,
}: {
  position?: [number, number, number]
  scale?: number
}) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.65, 0]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial color="#e5e4da" />
      </mesh>
      <mesh position={[0, 0.66, 0.11]}>
        <sphereGeometry args={[0.11, 12, 8]} />
        <meshStandardMaterial
          color="#9d7139"
          metalness={0.85}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <capsuleGeometry args={[0.12, 0.22, 4, 8]} />
        <meshStandardMaterial color="#e1dcd1" />
      </mesh>
      <mesh position={[0, 0.44, -0.13]}>
        <boxGeometry args={[0.2, 0.26, 0.1]} />
        <meshStandardMaterial color="#a6adb0" />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 0.085, 0.13, 0]}>
            <capsuleGeometry args={[0.055, 0.19, 3, 8]} />
            <meshStandardMaterial color="#dedcd6" />
          </mesh>
          <mesh
            position={[side * 0.18, 0.39, 0]}
            rotation={[0, 0, side * 0.22]}
          >
            <capsuleGeometry args={[0.045, 0.2, 3, 8]} />
            <meshStandardMaterial color="#dedcd6" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export function CrewHabitat() {
  return (
    <group name="crew-habitat">
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i * Math.PI) / 2) * 0.9,
            0.06,
            Math.sin((i * Math.PI) / 2) * 0.9,
          ]}
        >
          <cylinderGeometry args={[0.08, 0.12, 0.26, 8]} />
          <meshStandardMaterial color="#92978f" />
        </mesh>
      ))}
      <mesh castShadow position={[0, 1.1, 0]}>
        <cylinderGeometry args={[1, 1.1, 2, 24]} />
        <meshStandardMaterial
          color="#e1dbcb"
          metalness={0.2}
          roughness={0.65}
        />
      </mesh>
      <mesh castShadow position={[0, 2.15, 0]} scale={[1, 0.4, 1]}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshStandardMaterial color="#c8c7bc" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[1.015, 1.04, 0.22, 24]} />
        <meshStandardMaterial color="#293c48" metalness={0.7} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.65, 1]}>
        <boxGeometry args={[0.6, 1.1, 0.18]} />
        <meshStandardMaterial color="#666c6a" />
      </mesh>
      <mesh position={[0, 0.7, 1.1]}>
        <boxGeometry args={[0.42, 0.8, 0.05]} />
        <meshStandardMaterial color="#c2c6bd" />
      </mesh>
      <mesh position={[0, 2.9, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 1.5, 8]} />
        <meshStandardMaterial color="#b4bbbd" />
      </mesh>
      <mesh position={[0.22, 3.35, 0]} rotation={[0.5, 0, 0.5]}>
        <sphereGeometry args={[0.4, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#ced0c7" side={THREE.DoubleSide} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, -0.13 + i * 0.11, 1.6 - i * 0.18]}>
          <boxGeometry args={[0.65, 0.12, 0.3]} />
          <meshStandardMaterial color="#747b7c" />
        </mesh>
      ))}
    </group>
  )
}
