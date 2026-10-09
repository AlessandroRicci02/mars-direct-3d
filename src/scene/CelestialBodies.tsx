import { useMemo, useRef } from 'react'
import type { Mission } from '../hooks/useMission'
import {
  orbitPosition,
  missionDays,
  transferDuration,
} from '../data/orbitalMotion'
import { useFrame } from '@react-three/fiber'
import { Line, Stars, useTexture, Billboard } from '@react-three/drei'
import * as THREE from 'three'
import { Label } from './SceneLabels'
import {
  EARTH,
  MARS,
  SUN,
  EARTH_RADIUS,
  MARS_RADIUS,
  SUN_RADIUS,
  EARTH_ORBIT_RADIUS,
  MARS_ORBIT_RADIUS,
} from '../data/solarSystem'
export { Label } from './SceneLabels'
export { EARTH, MARS, SUN } from '../data/solarSystem'

function Atmosphere({
  radius,
  color,
  position,
}: {
  radius: number
  color: string
  position: THREE.Vector3
}) {
  const shell = useRef<THREE.Mesh>(null)
  const world = useMemo(() => new THREE.Vector3(), [])
  useFrame(() => {
    if (shell.current)
      material.uniforms.sunDirection.value
        .copy(SUN)
        .sub(shell.current.getWorldPosition(world))
        .normalize()
  })
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          glowColor: { value: new THREE.Color(color) },
          sunDirection: { value: SUN.clone().sub(position).normalize() },
        },
        vertexShader: `varying vec3 vNormal; varying vec3 vView; varying vec3 worldNormal;
      void main(){ vec4 p=modelViewMatrix*vec4(position,1.0); vNormal=normalize(normalMatrix*normal); vView=normalize(-p.xyz); worldNormal=normalize(mat3(modelMatrix)*normal); gl_Position=projectionMatrix*p; }`,
        fragmentShader: `uniform vec3 glowColor; uniform vec3 sunDirection; varying vec3 vNormal; varying vec3 vView; varying vec3 worldNormal;
      void main(){ float rim=pow(1.0-abs(dot(normalize(vNormal),normalize(vView))),3.8); float day=smoothstep(-0.2,0.8,dot(normalize(worldNormal),sunDirection)); gl_FragColor=vec4(glowColor,rim*(0.06+day*0.55)); }`,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [color, position],
  )
  return (
    <mesh ref={shell} material={material}>
      <sphereGeometry args={[radius * 1.035, 64, 48]} />
    </mesh>
  )
}

export function Planet({
  kind,
  position,
  radius,
  paused,
  subdued = false,
}: {
  kind: 'mars' | 'earth'
  position: THREE.Vector3
  radius: number
  paused: boolean
  subdued?: boolean
}) {
  const surface = useRef<THREE.Group>(null)
  const clouds = useRef<THREE.Mesh>(null)
  const map = useTexture(
    `/textures/${kind === 'earth' ? 'earth_atmos_2048' : '2k_mars'}.jpg`,
  )
  const cloudMap = useTexture('/textures/2k_earth_clouds.jpg')
  useMemo(() => {
    map.colorSpace = THREE.SRGBColorSpace
    map.anisotropy = 8
    cloudMap.anisotropy = 4
  }, [map, cloudMap])
  useFrame((_, delta) => {
    if (paused) return
    if (surface.current) surface.current.rotation.y += delta * 0.012
    if (clouds.current) clouds.current.rotation.y += delta * 0.017
  })
  return (
    <group position={position}>
      <group rotation={[0, 0, kind === 'earth' ? 0.409 : 0.44]}>
        <group ref={surface} rotation={[0, kind === 'earth' ? 2.6 : 1.7, 0]}>
          <mesh>
            <sphereGeometry args={[radius, 80, 56]} />
            <meshStandardMaterial
              map={map}
              color={subdued ? '#777b83' : '#ffffff'}
              roughness={kind === 'earth' ? 0.68 : 0.98}
              metalness={0}
            />
          </mesh>
        </group>
        {kind === 'earth' && (
          <mesh ref={clouds} rotation={[0, 2.6, 0]}>
            <sphereGeometry args={[radius * 1.009, 64, 48]} />
            <meshStandardMaterial
              alphaMap={cloudMap}
              color={subdued ? '#81909c' : '#ffffff'}
              transparent
              opacity={0.68}
              depthWrite={false}
              roughness={1}
            />
          </mesh>
        )}
      </group>
      <Atmosphere
        radius={radius}
        color={kind === 'earth' ? '#529ada' : '#b9825d'}
        position={position}
      />
    </group>
  )
}

function Sun({ subdued }: { subdued: boolean }) {
  const map = useTexture('/textures/2k_sun.jpg')
  useMemo(() => {
    map.colorSpace = THREE.SRGBColorSpace
  }, [map])
  const corona = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { strength: { value: subdued ? 0.12 : 0.35 } },
        vertexShader:
          'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
        fragmentShader:
          'varying vec2 vUv; uniform float strength; void main(){float d=length(vUv-0.5)*2.0;float a=pow(max(0.0,1.0-d),3.0)*strength;gl_FragColor=vec4(1.0,0.58,0.25,a);}',
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [subdued],
  )
  return (
    <group position={SUN}>
      <Billboard>
        <mesh material={corona}>
          <planeGeometry args={[SUN_RADIUS * 5.5, SUN_RADIUS * 5.5]} />
        </mesh>
      </Billboard>
      <mesh>
        <sphereGeometry args={[SUN_RADIUS, 64, 48]} />
        <meshBasicMaterial
          map={map}
          color={subdued ? '#bca681' : '#fff3c9'}
          toneMapped={false}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[SUN_RADIUS * 1.008, 64, 48]} />
        <meshBasicMaterial
          color="#fff5d6"
          transparent
          opacity={subdued ? 0.18 : 0.4}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

function Orbit({
  radius,
  color,
  opacity,
}: {
  radius: number
  color: string
  opacity: number
}) {
  const points = useMemo(
    () =>
      Array.from({ length: 193 }, (_, i) => {
        const a = (i / 192) * Math.PI * 2
        return new THREE.Vector3(
          SUN.x + Math.cos(a) * radius,
          -0.06,
          SUN.z + Math.sin(a) * radius,
        )
      }),
    [radius],
  )
  return (
    <Line
      points={points}
      color={color}
      transparent
      opacity={opacity}
      lineWidth={0.85}
    />
  )
}

function OrbitingPlanet({
  kind,
  mission,
}: {
  kind: 'earth' | 'mars'
  mission: Mission
}) {
  const group = useRef<THREE.Group>(null)
  const sites = useRef<THREE.Group>(null)
  const radius = kind === 'earth' ? EARTH_RADIUS : MARS_RADIUS
  useFrame(() => {
    if (group.current)
      group.current.position.copy(
        orbitPosition(
          kind,
          missionDays(
            mission.index,
            mission.progress.current,
            mission.elapsed.current,
          ),
          mission.index === 8,
          transferDuration(mission.index),
        ),
      )
    if (group.current)
      (kind === 'earth' ? EARTH : MARS).copy(group.current.position)
    sites.current?.children.forEach((site, i) => {
      site.visible = mission.progress.current >= i * 0.22
    })
  })
  return (
    <group ref={group}>
      <Planet
        kind={kind}
        radius={radius}
        position={new THREE.Vector3()}
        paused={mission.paused || mission.reducedMotion}
      />
      {mission.labels && (
        <Label
          position={[0, -radius - 0.7, 0]}
          color={kind === 'earth' ? 'blue' : undefined}
        >
          <b>{kind.toUpperCase()}</b>
          <small>
            {kind === 'earth' ? '12,756 KM · 1.000 AU' : '6,792 KM · 1.524 AU'}
          </small>
        </Label>
      )}
      {kind === 'mars' && (mission.index === 5 || mission.index === 6) && (
        <>
          {mission.labels && (
            <Label position={[0, 2.2, 0]} color="green">
              <b>ERV #1 · FUELED ON MARS</b>
              <small>RETURN READY BEFORE CREW DEPARTURE</small>
            </Label>
          )}
          <mesh position={[0, radius + 0.13, 0]}>
            <cylinderGeometry args={[0.08, 0.12, 0.26, 8]} />
            <meshStandardMaterial color="#d2dfca" emissive="#3b6b43" />
          </mesh>
        </>
      )}
      {kind === 'mars' && mission.index === 9 && (
        <>
          <group ref={sites}>
            {[-0.4, 0, 0.4].map((x, i) => (
              <group key={x} position={[x, 0.5, 0.3]} rotation={[0, 0, -x]}>
                <mesh position={[0, 0.1, 0]}>
                  <cylinderGeometry args={[0.07, 0.09, 0.2, 10]} />
                  <meshStandardMaterial
                    color="#d9dcc9"
                    emissive="#537c58"
                    emissiveIntensity={0.5}
                  />
                </mesh>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[0.13, 0.16, 20]} />
                  <meshBasicMaterial color="#b7d6ab" side={THREE.DoubleSide} />
                </mesh>
                {i === 1 && mission.labels && (
                  <Label position={[0, 2.3, 0]} color="green">
                    <b>SUCCESSIVE EXPLORATION SITES</b>
                    <small>NEW WINDOW · NEW OUTPOST</small>
                  </Label>
                )}
              </group>
            ))}
          </group>
        </>
      )}
    </group>
  )
}
export function CelestialBodies({ mission }: { mission: Mission }) {
  return (
    <>
      <Stars
        radius={90}
        depth={50}
        count={2600}
        factor={2.6}
        saturation={0.08}
        fade
        speed={0}
      />
      <ambientLight intensity={0.13} color="#a5bbd2" />
      <pointLight position={SUN} intensity={440} decay={2} color="#fff6e9" />
      <Sun subdued={mission.index !== 0 && mission.index !== 9} />
      <Orbit radius={EARTH_ORBIT_RADIUS} color="#7396b3" opacity={0.44} />
      <Orbit radius={MARS_ORBIT_RADIUS} color="#b3977b" opacity={0.38} />
      <OrbitingPlanet kind="earth" mission={mission} />
      <OrbitingPlanet kind="mars" mission={mission} />
      {mission.labels && (
        <Label position={[SUN.x, SUN_RADIUS + 2, SUN.z]} color="neutral">
          <b>SUN</b>
          <small>SIZE COMPRESSED</small>
        </Label>
      )}
    </>
  )
}
