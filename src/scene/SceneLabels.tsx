import { useLayoutEffect, useId, useRef, useSyncExternalStore } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Entry {
  id: string
  color: string
  children: React.ReactNode
  element: HTMLDivElement | null
}
const entries = new Map<string, Entry>()
const listeners = new Set<() => void>()
let snapshot: Entry[] = []
function publish() {
  snapshot = [...entries.values()]
  listeners.forEach((listener) => listener())
}
function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

// Keep HTML in React DOM's own tree, and only project coordinates from the 3D renderer.
// This avoids creating and destroying independent React roots during scene transitions.
export function Label({
  position,
  children,
  color = 'orange',
}: {
  position: [number, number, number]
  children: React.ReactNode
  color?: string
}) {
  const id = useId()
  const anchor = useRef<THREE.Group>(null)
  const point = useRef(new THREE.Vector3())
  useLayoutEffect(() => {
    entries.set(id, { id, color, children, element: null })
    publish()
    return () => {
      entries.delete(id)
      publish()
    }
  }, [id, color, children])
  useFrame(({ camera, size }) => {
    const element = entries.get(id)?.element
    if (!element || !anchor.current) return
    anchor.current.getWorldPosition(point.current)
    point.current.project(camera)
    let visible =
      point.current.z < 1 &&
      Math.abs(point.current.x) < 1.15 &&
      Math.abs(point.current.y) < 1.1
    let parent: THREE.Object3D | null = anchor.current
    while (parent) {
      if (!parent.visible) visible = false
      parent = parent.parent
    }
    element.style.visibility = visible ? 'visible' : 'hidden'
    element.style.transform = `translate(${((point.current.x + 1) * size.width) / 2}px, ${((-point.current.y + 1) * size.height) / 2}px) translate(-50%, -50%)`
  })
  return <group ref={anchor} position={position} />
}

export function SceneLabels() {
  const labels = useSyncExternalStore(subscribe, () => snapshot)
  return (
    <div className="scene-labels" aria-hidden="true">
      {labels.map((label) => (
        <div
          key={label.id}
          ref={(element) => {
            label.element = element
          }}
          className={`scene-label ${label.color}`}
        >
          <span className="label-pin" />
          {label.children}
        </div>
      ))}
    </div>
  )
}
