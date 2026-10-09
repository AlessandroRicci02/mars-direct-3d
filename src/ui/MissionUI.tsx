import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  CircleHelp,
  Crosshair,
  Maximize2,
  Mouse,
  Pause,
  Play,
  RotateCcw,
  Tags,
  X,
} from 'lucide-react'
import { sourceNotes } from '../data/beyond'
import { BeyondControls } from './BeyondControls'
import type { Mission } from '../hooks/useMission'

function Mark() {
  return (
    <svg
      className="brand-mark"
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="10" fill="currentColor" />
      <ellipse
        cx="24"
        cy="24"
        rx="22"
        ry="8"
        transform="rotate(-40 24 24)"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="40" cy="10" r="2.5" fill="#f1ece2" />
    </svg>
  )
}

function ChapterProgress({ mission }: { mission: Mission }) {
  const line = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let frame: number
    const tick = () => {
      if (line.current)
        line.current.style.transform = `scaleX(${mission.progress.current})`
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [mission.progress])
  return (
    <div className="chapter-progress" aria-hidden="true">
      <div ref={line} />
    </div>
  )
}

function FuelProcess({ mission }: { mission: Mission }) {
  const [percent, setPercent] = useState(0)
  const [variant, setVariant] = useState<'original' | 'future'>('original')
  useEffect(() => {
    const timer = setInterval(
      () =>
        setPercent(
          Math.round(Math.min(1, mission.progress.current * 1.5) * 100),
        ),
      150,
    )
    return () => clearInterval(timer)
  }, [mission.progress])
  return (
    <div className="fuel-panel" data-ready={percent === 100}>
      <div className="panel-caption">
        <span className="status-dot" />{' '}
        {percent === 100
          ? 'RETURN READY · CREW CLEARED'
          : 'FUEL FIRST · CREW WAITS ON EARTH'}
      </div>

      <div className="isru-diagram">
        <div className="isru-branch-row">
          <div className="isru-node-card">
            <span className="isru-source-tag">EARTH</span>
            <span className="isru-flow-arrow">↓</span>
            <span className="isru-subtext">~6 t H₂ transported with ERV</span>
          </div>
          <div className="isru-plus">+</div>
          <div className="isru-node-card">
            <span className="isru-source-tag">MARS ATMOSPHERE</span>
            <span className="isru-flow-arrow">↓</span>
            <span className="isru-subtext">CO₂</span>
          </div>
        </div>

        <div className="isru-flow-arrow central">↓</div>

        <div className="isru-core-card">
          <div className="isru-core-title">H₂ + CO₂</div>
          <div className="isru-flow-arrow">↓</div>
          <div className="isru-plant-label">ISRU PROCESS · 100 kW REACTOR</div>
          <div className="isru-flow-arrow">↓</div>
          <div className="isru-chem-output">CH₄ + O₂</div>
          <div className="isru-flow-arrow">↓</div>
          <div className="isru-dest-label">RETURN PROPELLANT</div>
        </div>
      </div>

      <div className="fuel-caption">
        <span>
          {percent === 100
            ? 'RETURN TANKS VERIFIED'
            : 'PRODUCING RETURN PROPELLANT'}
        </span>
        <b>{percent}%</b>
      </div>
      <div className="fuel-bar">
        <div style={{ width: `${percent}%` }} />
      </div>
      <p role="status">
        {percent === 100 ? (
          <>
            <Check size={14} /> Fueled before the crew leaves Earth.
          </>
        ) : (
          'Crew waits on Earth until the return propellant is ready.'
        )}
      </p>

      <div className="isru-variant-bar">
        <button
          className={`isru-variant-pill ${variant === 'original' ? 'active' : ''}`}
          onClick={() => setVariant('original')}
        >
          Original Mars Direct
        </button>
        <button
          className={`isru-variant-pill ${variant === 'future' ? 'active' : ''}`}
          onClick={() => setVariant('future')}
        >
          Future/local-water variant
        </button>
      </div>
      <small className="process-note">
        {variant === 'original'
          ? '100 kW nuclear reactor · ~6 t H₂ imported from Earth with ERV · Sabatier + water electrolysis · hydrogen recycled.'
          : 'Later ISRU concepts can obtain hydrogen from Martian water ice, reducing or eliminating the need to transport it from Earth.'}
      </small>
    </div>
  )
}

export default function MissionUI({ mission }: { mission: Mission }) {
  const {
    index,
    stage,
    goTo,
    autoplay,
    setAutoplay,
    paused,
    setPaused,
    labels,
    setLabels,
    replay,
  } = mission
  const beyond = mission.section === 'beyond'
  const chapters = mission.chapters
  const [modal, setModal] = useState<'architecture' | 'about' | 'notes' | null>(
    null,
  )
  const dialog = useRef<HTMLDialogElement>(null)
  const wasPaused = useRef(false)
  const openModal = (value: typeof modal) => {
    wasPaused.current = paused
    setPaused(true)
    setModal(value)
  }
  const closeModal = () => {
    setModal(null)
    setPaused(wasPaused.current)
  }
  useEffect(() => {
    if (modal) dialog.current?.showModal()
    else dialog.current?.close()
  }, [modal])
  const activeStep = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    activeStep.current?.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
      behavior: 'smooth',
    })
  }, [index])
  const [fullscreen, setFullscreen] = useState(false)
  useEffect(() => {
    const change = () => setFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', change)
    return () => document.removeEventListener('fullscreenchange', change)
  }, [])
  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await document.documentElement.requestFullscreen()
    } catch {
      /* Browser may deny fullscreen; the experience remains usable. */
    }
  }
  return (
    <>
      <div className="scene-vignette" />
      <header className="site-header">
        <button
          className="brand"
          onClick={() => mission.goToSection('mission')}
          aria-label="Mars Direct home"
        >
          <Mark />
          <span>
            MARS DIRECT<small>THE ROAD TO MARS</small>
          </span>
        </button>
        <nav aria-label="Main navigation">
          <button
            className={!beyond ? 'nav-active' : ''}
            onClick={() => mission.goToSection('mission')}
          >
            The mission
          </button>
          <button onClick={() => openModal('architecture')}>
            The architecture <ArrowUpRight size={12} />
          </button>
          <button
            className={beyond ? 'nav-active' : ''}
            onClick={() => mission.goToSection('beyond')}
          >
            Beyond Mars
          </button>
          <button onClick={() => openModal('about')}>
            About <ArrowUpRight size={12} />
          </button>
        </nav>
        <div className="header-tag">
          <span className="status-dot" /> AN INTERACTIVE EXPEDITION
        </div>
      </header>

      <main
        className={`story ${index === 0 ? 'intro-story' : 'chapter-story'}`}
        key={`${mission.section}-${stage.id}`}
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="eyebrow">
          <span />
          {stage.eyebrow}
        </div>
        <span className="epistemic-tag">
          {stage.status || 'HISTORICAL MARS DIRECT · PROPOSED'}
        </span>
        <h1>
          <span>{stage.title}</span>
          <em>{stage.accent}</em>
        </h1>
        <p className="description">{stage.description}</p>
        {!beyond && index === 0 && (
          <p className="intro-credit">
            Robert Zubrin’s vision. Your journey begins here.
          </p>
        )}
        <button className="notes-button" onClick={() => openModal('notes')}>
          <CircleHelp size={14} />{' '}
          {!beyond && index === 0
            ? 'The idea behind Mars Direct'
            : 'Inside this chapter'}
          <ChevronRight size={13} />
        </button>
        <div className="story-actions">
          {(index > 0 || beyond) && (
            <button
              className="back-button"
              onClick={() => goTo(index - 1)}
              aria-label="Previous chapter"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <button
            className="primary-button"
            onClick={() => {
              if (beyond && index === chapters.length - 1)
                mission.goToSection('mission')
              else goTo(index + 1)
            }}
          >
            {beyond
              ? index === 10
                ? 'Return to the mission'
                : 'Next chapter'
              : index === 0
                ? 'Begin the journey'
                : index === 9
                  ? 'Continue beyond Mars'
                  : 'Next chapter'}
            {index === 9 ? <RotateCcw size={17} /> : <ArrowRight size={18} />}
          </button>
          {!beyond && index === 0 && (
            <span className="journey-length">
              10 CHAPTERS
              <br />
              <b>~3 MIN EXPLORATION</b>
            </span>
          )}
        </div>
        {index !== 0 && (
          <div className="chapter-stat">
            <strong>{stage.metric}</strong>
            <span>{stage.metricLabel}</span>
          </div>
        )}
      </main>

      <aside className="view-indicator">
        <span className="target-icon">
          <Crosshair size={16} />
        </span>
        <div>
          {stage.location}
          <small>{stage.time}</small>
        </div>
        <span className="view-live">LIVE 3D</span>
      </aside>
      {stage.mode === 'solar' && (
        <div className="scene-legend" aria-label="Orbital line legend">
          <span>
            <i className="orbit-key earth-key" /> Earth orbit
          </span>
          <span>
            <i className="orbit-key mars-key" /> Mars orbit
          </span>
          {index > 0 && (
            <span>
              <i
                className={`transfer-key ${index === 8 ? 'return-key' : ''}`}
              />{' '}
              {index === 8 ? 'Earth return' : 'Mission transfer'}
            </span>
          )}
        </div>
      )}
      {!beyond && index === 0 && (
        <aside className="principle-card">
          <span>THE GUIDING PRINCIPLE</span>
          <p>
            Travel light.
            <br />
            Think ahead.
            <br />
            <em>Live off the land.</em>
          </p>
          <div>
            <span className="tiny-line" /> MARS DIRECT / EST. 1990
          </div>
        </aside>
      )}
      {!beyond && index === 4 && (
        <FuelProcess key={mission.resetKey} mission={mission} />
      )}
      {!beyond && index === 9 && (
        <aside className="repeat-card">
          <span className="status-dot" />
          <span>
            ONE ARCHITECTURE.
            <br />
            <strong>COUNTLESS POSSIBILITIES.</strong>
          </span>
        </aside>
      )}

      {beyond && <BeyondControls mission={mission} />}
      {!beyond && (index === 2 || index === 6) && (
        <aside className="transfer-note">
          Interplanetary spacecraft do not fly toward where Mars is when they
          leave Earth. They follow an orbit around the Sun designed to meet Mars
          later.
          <small>Visualization not to scale · accelerated time</small>
        </aside>
      )}
      <div className="scene-tools">
        <span className="orbit-hint">
          <Mouse size={15} /> Drag to orbit
        </span>
        <div className="tool-buttons">
          <button
            aria-label={paused ? 'Resume animation' : 'Pause animation'}
            aria-pressed={paused}
            title={
              paused ? 'Resume animation (Space)' : 'Pause animation (Space)'
            }
            onClick={() => setPaused(!paused)}
          >
            {paused ? <Play size={16} /> : <Pause size={16} />}
          </button>
          <button
            aria-label={labels ? 'Hide labels' : 'Show labels'}
            aria-pressed={labels}
            title="Toggle scene labels"
            onClick={() => setLabels(!labels)}
          >
            <Tags size={16} />
          </button>
          <button
            aria-label="Replay chapter and reset camera"
            title="Replay chapter & reset camera"
            onClick={replay}
          >
            <RotateCcw size={16} />
          </button>
          {document.fullscreenEnabled && (
            <button
              aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              title="Fullscreen"
              onClick={toggleFullscreen}
            >
              <Maximize2 size={16} />
            </button>
          )}
        </div>
      </div>

      <footer className="mission-footer">
        <div className="timeline-heading">
          <div>
            <span className="timeline-caption">
              {beyond ? 'PART II · BEYOND MARS' : 'PART I · THE MISSION'}
            </span>
            <span className="chapter-count">
              {String(index + 1).padStart(2, '0')}{' '}
              <span>/ {chapters.length}</span>
            </span>
          </div>
          <button
            className={`autoplay-button ${autoplay ? 'on' : ''}`}
            aria-pressed={autoplay}
            onClick={() => {
              setAutoplay(!autoplay)
              if (!autoplay) {
                setPaused(false)
                if (mission.progress.current >= 1) replay()
              }
            }}
          >
            {autoplay ? <Pause size={12} /> : <Play size={12} />}{' '}
            {autoplay ? 'Autoplay on' : 'Autoplay'}
            <span className="toggle">
              <span />
            </span>
          </button>
        </div>
        <nav
          className="timeline"
          aria-label={beyond ? 'Beyond Mars chapters' : 'Mission chapters'}
          style={{
            gridTemplateColumns: `repeat(${chapters.length}, minmax(0, 1fr))`,
          }}
        >
          {chapters.map((item, i) => (
            <button
              ref={i === index ? activeStep : undefined}
              key={item.id}
              className={`timeline-step ${i === index ? 'active' : ''} ${i < index ? 'visited' : ''}`}
              aria-current={i === index ? 'step' : undefined}
              aria-label={`Chapter ${i + 1}: ${item.short}`}
              onClick={() => goTo(i)}
            >
              <div className="step-line">
                <span className="step-node">
                  {i < index ? <Check size={9} /> : <span />}
                </span>
              </div>
              <span className="step-number">{String(i).padStart(2, '0')}</span>
              <span className="step-name">{item.short}</span>
              {i === index && <ChapterProgress mission={mission} />}
            </button>
          ))}
        </nav>
        <div className="footer-meta">
          <span>AN IDEA THAT BRINGS ANOTHER WORLD WITHIN REACH.</span>
          <span>
            <span className="scale-dot" />{' '}
            <span title="Earth and Mars share a diameter scale. Mean orbital radii are proportional (1 : 1.524). Bodies and vehicles are enlarged relative to distances; the Sun is separately size-compressed.">
              Visualization not to scale.
            </span>
            <b className="keyboard-hint">← → EXPLORE</b>
          </span>
        </div>
      </footer>

      <dialog
        ref={dialog}
        aria-labelledby="notes-title"
        onCancel={(event) => {
          event.preventDefault()
          closeModal()
        }}
        onClick={(event) => {
          if (event.target === dialog.current) closeModal()
        }}
        className="info-dialog"
      >
        <div className="dialog-inner">
          <button
            className="dialog-close"
            aria-label="Close dialog"
            onClick={closeModal}
          >
            <X size={20} />
          </button>
          <span className="eyebrow">MARS DIRECT / FIELD NOTES</span>
          <h2 id="notes-title">
            {modal === 'architecture'
              ? 'A simpler way to Mars.'
              : modal === 'about'
                ? 'An idea worth exploring.'
                : !beyond && index === 0
                  ? 'Send the way home first.'
                  : `${stage.title} ${stage.accent}`}
          </h2>
          {modal === 'notes' && (
            <>
              <p>{stage.detail}</p>
              {!beyond && index === 4 && (
                <div className="reaction-notes">
                  <p>
                    <b>1. Sabatier reaction</b>
                    <br />
                    CO₂ + 4H₂ → CH₄ + 2H₂O
                  </p>
                  <p>
                    <b>2. Water electrolysis</b>
                    <br />
                    2H₂O → 2H₂ + O₂
                  </p>
                  <small>
                    Recycle hydrogen and accumulate methane and oxygen.
                    Additional oxygen production is part of the overall
                    propellant system; the overview is not a balanced net
                    equation.
                  </small>
                  <p>
                    <b>Original Mars Direct</b>
                    <br />
                    Approximately 6 metric tonnes of liquid hydrogen arrive from
                    Earth with the uncrewed ERV. A 100 kW nuclear reactor powers
                    the plant.
                  </p>
                  <p>
                    <b>Future/local-water variant</b>
                    <br />
                    Later ISRU concepts could extract hydrogen from Martian
                    water ice, reducing or eliminating imported hydrogen. This
                    is a different resource strategy.
                  </p>
                </div>
              )}
              <div className="note-callout">
                {stage.metric} <span>{stage.metricLabel.toLowerCase()}</span>
              </div>
            </>
          )}
          {modal === 'architecture' && (
            <>
              <p>
                Mars Direct connects a series of modest, repeatable missions
                into a sustained exploration program. Three ideas make the
                architecture work together.
              </p>
              <ol className="architecture-list">
                <li>
                  <b>Prepare before you commit.</b>
                  <span>
                    Send an uncrewed Earth Return Vehicle. Make and verify its
                    return propellant before launching the crew.
                  </span>
                </li>
                <li>
                  <b>Use what Mars provides.</b>
                  <span>
                    Process atmospheric carbon dioxide with imported hydrogen,
                    using nuclear power, to produce methane and oxygen.
                  </span>
                </li>
                <li>
                  <b>Build on every mission.</b>
                  <span>
                    Launch another ERV with the next crew habitat. Leave
                    habitats and equipment behind for future explorers.
                  </span>
                </li>
              </ol>
              <p className="subtle">
                The original proposal sends approximately 6 metric tonnes of
                liquid hydrogen and a 100 kW nuclear reactor with the uncrewed
                ERV. Local water extraction is a possible later development, not
                a prerequisite shown in this experience.
              </p>
            </>
          )}
          {modal === 'about' && (
            <>
              <p>
                Mars Direct — The Road to Mars is an educational 3D
                interpretation of the mission architecture proposed by Robert
                Zubrin and David Baker in 1990.
              </p>
              <p>
                Use the chapter timeline or arrow keys to explore. Drag the
                scene to change your view. Pause, replay, hide labels, or let
                Autoplay guide you through both parts: 10 mission chapters and
                11 Beyond Mars chapters.
              </p>
              <div className="note-callout">
                A concept, <span>not a scheduled mission.</span>
              </div>
              <p className="subtle">
                Earth and Mars use their real diameter ratio (Mars is about 53%
                of Earth), and mean orbital radii use the ratio 1 : 1.524.
                Bodies are enlarged relative to distances. The Sun is separately
                size-compressed: its real diameter is about 109 Earth diameters.
                Vehicles and outposts are enlarged to remain visible. Orbital
                positions, circular paths, timing, and transfers are
                illustrative, not an ephemeris or orbital simulation.
              </p>
            </>
          )}
          <div className="dialog-sources">
            <span>SCIENCE & SCENARIO NOTES</span>
            <p className="dialog-epistemic-note">
              <b>Epistemic note:</b> The North America / Mars analogy is Robert
              Zubrin’s historical argument. The Earth–Mars–Asteroid trade
              triangle is Zubrin’s proposed economic model. The extended
              Earth–Moon–Mars–Asteroids network is a broader extrapolation, not
              necessarily his exact architecture.
            </p>
            {sourceNotes.map(([title, url]) => (
              <a key={url} href={url} target="_blank" rel="noreferrer">
                {title} <ArrowUpRight size={13} />
              </a>
            ))}
            {modal === 'about' && (
              <>
                <a
                  href="https://www.solarsystemscope.com/textures/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Planet maps · Solar System Scope / INOVE · CC BY 4.0{' '}
                  <ArrowUpRight size={14} />
                </a>
                <a
                  href="/textures/ATTRIBUTION.md"
                  target="_blank"
                  rel="noreferrer"
                >
                  Earth and Moon imagery, texture credits & licenses{' '}
                  <ArrowUpRight size={14} />
                </a>
              </>
            )}
            <a
              href="https://ntrs.nasa.gov/citations/19970026756"
              target="_blank"
              rel="noreferrer"
            >
              NASA · Sabatier / electrolysis demonstration{' '}
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </dialog>
    </>
  )
}
