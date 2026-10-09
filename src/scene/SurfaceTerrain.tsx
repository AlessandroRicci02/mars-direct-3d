import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js'

const noise = new ImprovedNoise()
function heightAt(x: number, z: number) {
  const distance = Math.hypot(x - 4, z + 2)
  const edge = THREE.MathUtils.smoothstep(distance, 10, 24)
  const broad = noise.noise(x * 0.065, z * 0.065, 4) * 4
  const ridges = Math.abs(noise.noise(x * 0.16, z * 0.11, 9)) * 1.2
  return (
    -0.05 + (broad + ridges) * edge + noise.noise(x * 1.8, z * 1.8, 2) * 0.035
  )
}

export function SurfaceTerrain() {
  const rocks = useRef<THREE.InstancedMesh>(null)
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(120, 120, 140, 140)
    geo.rotateX(-Math.PI / 2)
    const positions = geo.attributes.position
    const colors = new Float32Array(positions.count * 3)
    const color = new THREE.Color(),
      dust = new THREE.Color('#a07d62'),
      basalt = new THREE.Color('#5a493c')
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i),
        z = positions.getZ(i)
      positions.setY(i, heightAt(x, z))
      const patch =
        0.48 +
        noise.noise(x * 0.22, z * 0.22, 2) * 0.45 +
        noise.noise(x * 2, z * 2, 2) * 0.1
      color.copy(basalt).lerp(dust, patch)
      color.toArray(colors, i * 3)
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geo.computeVertexNormals()
    return geo
  }, [])
  useLayoutEffect(() => {
    if (!rocks.current) return
    const dummy = new THREE.Object3D(),
      color = new THREE.Color()
    for (let i = 0; i < 220; i++) {
      const a = i * 2.39996,
        r = Math.sqrt(((Math.sin(i * 127.1) * 43758.5453) % 1) + 1) * 24
      const x = 4 + Math.cos(a) * r,
        z = -2 + Math.sin(a) * r
      const size = (0.04 + (Math.sin(i * 23) + 1) * 0.12) * (r < 9 ? 0.25 : 1)
      dummy.position.set(x, heightAt(x, z) + size * 0.25, z)
      dummy.rotation.set(i, i * 0.77, i * 0.3)
      dummy.scale.set(size * 1.6, size, size * 0.85)
      dummy.updateMatrix()
      rocks.current.setMatrixAt(i, dummy.matrix)
      rocks.current.setColorAt(i, color.set(i % 3 ? '#806652' : '#514941'))
    }
    rocks.current.instanceMatrix.needsUpdate = true
    rocks.current.computeBoundingSphere()
  }, [])
  const sky = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader:
          'varying vec3 p; void main(){p=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
        fragmentShader:
          'varying vec3 p; void main(){float h=normalize(p).y;float haze=pow(1.0-max(h,0.0),5.0);vec3 c=mix(vec3(0.035,0.037,0.05),vec3(0.21,0.16,0.13),haze);gl_FragColor=vec4(c,1.0);}',
        side: THREE.BackSide,
        depthWrite: false,
      }),
    [],
  )
  return (
    <>
      <mesh material={sky}>
        <sphereGeometry args={[140, 32, 24]} />
      </mesh>
      <mesh geometry={geometry} receiveShadow>
        <meshStandardMaterial vertexColors roughness={1} />
      </mesh>
      <instancedMesh
        ref={rocks}
        args={[undefined, undefined, 220]}
        castShadow
        receiveShadow
      >
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial roughness={1} />
      </instancedMesh>
      {/* Two shallow wheel tracks provide a human-scale reference without decals. */}
      {[-0.35, 0.35].map((offset) => (
        <mesh
          key={offset}
          position={[6 + offset, -0.018, 4.4]}
          rotation={[-Math.PI / 2, 0, -0.28]}
        >
          <planeGeometry args={[0.09, 4.5]} />
          <meshStandardMaterial
            color="#504436"
            roughness={1}
            transparent
            opacity={0.35}
            depthWrite={false}
          />
        </mesh>
      ))}
    </>
  )
}
