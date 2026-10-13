import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import * as THREE from 'three'
import gsap from 'gsap'
import type { Mission } from '../hooks/useMission'
import { orbitPosition } from '../data/orbitalMotion'
import { keepCameraOutsideBodies } from '../data/solarSystem'

type View = {
  position: [number, number, number]
  target: [number, number, number]
}
export const CAMERA_VIEWS: Record<number, View> = {
  0: { position: [4, 14, 29], target: [1, 0, -4] },
  1: { position: [5, 5.5, 7], target: [1, 0, -6] },
  2: { position: [8, 12, 20], target: [3, 0, -7] },
  3: { position: [13, 7.5, 18], target: [0, 1, 0] },
  4: { position: [12, 8, 17], target: [-0.5, 0, -2] },
  5: { position: [5, 7, 10], target: [1, 0.8, -7] },
  6: { position: [9, 10, 15], target: [3, 0, -8] },
  7: { position: [16, 8, 22], target: [1, 0, -1] },
  8: { position: [9, 12, 22], target: [3, 0, -4] },
  9: { position: [6, 16, 30], target: [2, 0, -4] },
}

export function CameraController({ mission }: { mission: Mission }) {
  const { camera, size } = useThree()
  const controls = useRef<OrbitControlsImpl>(null)
  const returning = useRef(false)
  const tween = useRef<gsap.core.Tween | null>(null)
  const surface = mission.stage.mode === 'surface'

  const flyTo = (
    destination: THREE.Vector3,
    target: THREE.Vector3,
    duration: number,
  ) => {
    const control = controls.current
    if (!control) return
    tween.current?.kill()
    control.enabled = false
    control.enableDamping = false
    control.update()
    const start = camera.position.clone()
    const startTarget = control.target.clone()
    const middle = start.clone().lerp(destination, 0.5)
    middle.y += Math.min(3.5, start.distanceTo(destination) * 0.12)
    const path = new THREE.QuadraticBezierCurve3(start, middle, destination)
    const state = { t: 0 }
    tween.current = gsap.to(state, {
      t: 1,
      duration: mission.reducedMotion ? 0 : duration,
      ease: 'sine.inOut',
      onUpdate: () => {
        path.getPoint(state.t, camera.position)
        if (mission.stage.mode === 'solar')
          keepCameraOutsideBodies(camera.position)
        camera.position.y = Math.max(surface ? 2 : 1, camera.position.y)
        control.target.lerpVectors(startTarget, target, state.t)
        control.update()
      },
      onComplete: () => {
        control.enabled = true
        control.enableDamping = true
      },
    })
  }

  useFrame(() => {
    if (mission.stage.mode === 'solar') keepCameraOutsideBodies(camera.position)
    if (
      mission.section === 'mission' &&
      mission.index === 8 &&
      !returning.current &&
      mission.progress.current > 0.7
    ) {
      returning.current = true
      const mobile = size.width < 760
      flyTo(
        orbitPosition('earth', 180, true).add(
          new THREE.Vector3(1, 5.5, mobile ? 22 : 11),
        ),
        orbitPosition('earth', 180, true).add(
          new THREE.Vector3(
            mission.focus3d || mobile ? 0 : -3,
            mobile && !mission.focus3d ? 3.8 : 0,
            0,
          ),
        ),
        3.5,
      )
    }
  })

  useEffect(() => {
    returning.current = false
    const view = CAMERA_VIEWS[mission.index] || CAMERA_VIEWS[0]
    const position = new THREE.Vector3(...view.position)
    const target = new THREE.Vector3(...view.target)
    const mobile = size.width < 760
    if (mission.section === 'beyond') {
      if (mission.index === 2) {
        position.set(mobile ? 16 : 17, mobile ? 21 : 12, mobile ? 56 : 29)
        target.set(mobile ? 6 : 0, mobile ? 1.5 : -2.3, -1)
      } else {
        position.set(mobile ? 5 : 2, mobile ? 14 : 10, mobile ? 53 : 29)
        target.set(mobile ? 5 : -2, mobile ? 2 : -0.7, 0)
        if (mission.index === 10 && mobile) target.y = 3
        if (!mobile && size.width <= 1100) target.y -= 1.4
        if (mission.index === 8 && !mobile) target.y = -3.3
        if (mission.index === 8 && mobile) {
          position.set(5.5, 14, 59)
          target.x = 5.5
        }
        if (mission.index === 6 && mission.option !== 'purpose') {
          position.set(mobile ? 6 : 3, mobile ? 11 : 7, mobile ? 43 : 21)
          target.set(mobile ? 5.5 : 0.5, mobile ? 2 : 0.5, 0)
        }
      }
    } else if (surface) {
      if (mobile) {
        position.set(9, 17, 44)
        target.set(1.5, mission.index === 4 ? -1.2 : 1, -3)
      }
    } else {
      position.set(mobile ? -3 : -7, mobile ? 46 : 30, mobile ? 74 : 51)
      target.set(mobile ? -3 : -10, mobile ? 12 : 0, 2)
    }
    if (!mobile && size.width / size.height < 1.25) position.z += 5
    if (mission.focus3d) {
      if (mission.section === 'beyond') {
        target.set(5.5, 0.5, 0)
        position.set(5.5, mobile ? 16 : 9, mobile ? 48 : 27)
        if (mission.index === 2) {
          target.set(6, 0, -2)
          position.set(17, mobile ? 23 : 13, mobile ? 46 : 27)
        }
        if (mission.index === 6 && mission.option !== 'purpose') {
          target.set(5.5, 1.4, 0)
          position.set(7, mobile ? 9 : 5.5, mobile ? 32 : 15)
        }
        if (mission.index === 8) {
          target.set(5.5, 0.6, 0)
          position.set(5.5, 5.5, mobile ? 47 : 25)
        }
      } else if (surface) {
        target.set(2, 0.5, -2)
        position.set(14, mobile ? 17 : 9, mobile ? 36 : 23)
      } else {
        target.set(-3, 0, 3)
        position.set(-3, mobile ? 57 : 30, mobile ? 78 : 50)
      }
    }
    flyTo(position, target, 2.7)
    return () => {
      tween.current?.kill()
    }
    // flyTo deliberately captures the stage's scene mode; camera ownership is
    // reset only for chapter/replay/viewport changes, not playback UI updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    camera,
    mission.index,
    mission.section,
    mission.resetKey,
    mission.reducedMotion,
    mission.focus3d,
    // Only this option swaps an entire scene; other selectors retain the view.
    mission.index === 6 && mission.option === 'purpose',
    surface,
    size.width,
    size.height,
  ])

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan={false}
      enableZoom={false}
      enableDamping
      dampingFactor={0.055}
      minPolarAngle={0.3}
      maxPolarAngle={surface ? 1.18 : 1.3}
      minAzimuthAngle={-0.6}
      maxAzimuthAngle={1.05}
      rotateSpeed={0.28}
    />
  )
}
