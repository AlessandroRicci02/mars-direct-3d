import { useCallback, useEffect, useRef, useState } from 'react'
import { beyondStages } from '../data/beyond'
import { stages } from '../data/mission'

export function useMission() {
  const [section, setSection] = useState<'mission' | 'beyond'>('mission')
  const [option, setOption] = useState('all')
  const [development, setDevelopment] = useState(0)
  const elapsed = useRef(0)
  const chapters = section === 'mission' ? stages : beyondStages
  const [index, setIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(false)
  const [paused, setPaused] = useState(false)
  const [labels, setLabels] = useState(true)
  const [resetKey, setResetKey] = useState(0)
  const [reducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const progress = useRef(0)
  const stage = chapters[index]
  const goToSection = useCallback((part: 'mission' | 'beyond') => {
    setSection(part)
    setIndex(0)
    progress.current = 0
    elapsed.current = 0
    setOption('all')
    setDevelopment(0)
  }, [])
  const goTo = useCallback(
    (next: number) => {
      if (next >= chapters.length && section === 'mission') {
        goToSection('beyond')
        return
      }
      if (next < 0 && section === 'beyond') {
        setSection('mission')
        setIndex(9)
      } else setIndex(Math.max(0, Math.min(chapters.length - 1, next)))
      progress.current = 0
      elapsed.current = 0
      setOption('all')
      setDevelopment(0)
    },
    [chapters.length, section, goToSection],
  )
  useEffect(() => {
    let frame = 0
    let last = performance.now()
    const tick = (now: number) => {
      const delta = Math.min((now - last) / 1000, 0.1)
      last = now
      if (!paused && !document.hidden) {
        if (!reducedMotion) elapsed.current += delta
        progress.current = Math.min(
          1,
          progress.current + delta / stage.duration,
        )
        if (section === 'beyond' && index === 2 && option === 'all')
          setDevelopment(Math.min(3, Math.floor(progress.current * 4)))
        if (section === 'beyond' && index === 10)
          setDevelopment(Math.min(5, Math.floor(progress.current * 6)))
      }
      if (autoplay && progress.current >= 1 && !paused) {
        if (section === 'beyond' && index === chapters.length - 1)
          setAutoplay(false)
        else goTo(index + 1)
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [
    index,
    autoplay,
    paused,
    stage.duration,
    goTo,
    section,
    chapters.length,
    option,
    reducedMotion,
  ])
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (document.querySelector('dialog[open]')) return
      if (
        (event.target as HTMLElement).closest(
          'button, a, input, [role="dialog"]',
        )
      )
        return
      if (event.key === 'ArrowRight') goTo(index + 1)
      if (event.key === 'ArrowLeft') goTo(index - 1)
      if (event.code === 'Space') {
        event.preventDefault()
        setPaused((value) => !value)
      }
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [index, goTo])
  const replay = () => {
    progress.current = 0
    elapsed.current = 0
    setDevelopment(0)
    setResetKey((value) => value + 1)
    setPaused(false)
  }
  return {
    section,
    chapters,
    goToSection,
    option,
    development,
    setOption,
    elapsed,
    index,
    stage,
    goTo,
    autoplay,
    setAutoplay,
    paused,
    setPaused,
    labels,
    setLabels,
    progress,
    resetKey,
    replay,
    reducedMotion,
  }
}
export type Mission = ReturnType<typeof useMission>
