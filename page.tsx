'use client'

import { useCallback, useRef, useState } from 'react'
import './rpg.css'

type Tab = 'projects' | 'skills' | 'vsco' | 'socials'

const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons'

const LANGUAGES = [
  { name: 'C++', icon: `${DEVICON}/cplusplus/cplusplus-original.svg` },
  { name: 'Java', icon: `${DEVICON}/java/java-original.svg` },
  { name: 'C', icon: `${DEVICON}/c/c-original.svg` },
  { name: 'Python', icon: `${DEVICON}/python/python-original.svg` },
  { name: 'HTML', icon: `${DEVICON}/html5/html5-original.svg` },
  { name: 'CSS', icon: `${DEVICON}/css3/css3-original.svg` },
]

const TOOLS = [
  { name: 'Docker', icon: `${DEVICON}/docker/docker-original.svg` },
  { name: 'React', icon: `${DEVICON}/react/react-original.svg` },
  { name: 'JS', icon: `${DEVICON}/javascript/javascript-original.svg` },
]

const TABS: { id: Tab; label: string; className: string }[] = [
  { id: 'projects', label: '[PROJECTS]', className: 'tab-projects' },
  { id: 'skills', label: '[SKILLS]', className: 'tab-skills' },
  { id: 'vsco', label: '[VSCO]', className: 'tab-vsco' },
  { id: 'socials', label: '[SOCIALS]', className: 'tab-socials' },
]

function Flourish({ flip = false }: { flip?: boolean }) {
  return (
    <img
      src="/flourish.png"
      alt=""
      aria-hidden="true"
      className={flip ? 'flip' : undefined}
    />
  )
}

function Heading({ text }: { text: string }) {
  return (
    <div className="rpg-heading">
      <Flourish />
      <h2>{text}</h2>
      <Flourish flip />
    </div>
  )
}

function SkillSlot({
  name,
  icon,
  onClick,
}: {
  name: string
  icon: string
  onClick: () => void
}) {
  return (
    <button type="button" className="rpg-skill" onClick={onClick}>
      <span className="tile">
        <img src={icon || "/placeholder.svg"} alt="" aria-hidden="true" crossOrigin="anonymous" />
      </span>
      <span className="label">{name}</span>
    </button>
  )
}

export default function Page() {
  const [tab, setTab] = useState<Tab>('projects')
  const audioCtx = useRef<AudioContext | null>(null)

  // Soft acoustic UI blip via WebAudio (no mp3 file needed)
  const playClick = useCallback(() => {
    try {
      if (!audioCtx.current) {
        audioCtx.current = new AudioContext()
      }
      const ctx = audioCtx.current
      if (ctx.state === 'suspended') ctx.resume()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(660, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.09)
      gain.gain.setValueAtTime(0.12, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.13)
    } catch {
      // audio unavailable — ignore
    }
  }, [])

  const selectTab = (t: Tab) => {
    playClick()
    setTab(t)
  }

  const showChips = tab !== 'projects'

  return (
    <main className="rpg-viewport">
      <div className="rpg-stage" role="application" aria-label="Ananya Setia — RPG portfolio">
        {/* -------- TABS (positioned exactly over the drawn chips) -------- */}
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`rpg-tab ${t.className} ${showChips ? 'chip' : ''} ${
              showChips && tab === t.id ? 'active' : ''
            }`}
            aria-pressed={tab === t.id}
            onClick={() => selectTab(t.id)}
          >
            {showChips ? t.label : <span className="sr-only">{t.label}</span>}
          </button>
        ))}

        {/* -------- PROJECTS view = the untouched original artwork -------- */}
        {tab === 'projects' && (
          <>
            {[22.1, 35.6, 49.2].map((top) => (
              <button
                key={top}
                type="button"
                className="rpg-slot-hotspot"
                style={{ top: `${top}%` }}
                aria-label="Empty project slot — projects to be added"
                onClick={playClick}
              />
            ))}
          </>
        )}

        {/* -------- SKILLS -------- */}
        {tab === 'skills' && (
          <section className="rpg-panel" aria-label="Skills">
            <Heading text="SKILLS" />
            <p className="rpg-subheading">LANGUAGES</p>
            <div className="rpg-skill-row">
              {LANGUAGES.map((s) => (
                <SkillSlot key={s.name} name={s.name} icon={s.icon} onClick={playClick} />
              ))}
            </div>
            <p className="rpg-subheading">{'TOOLS & FRAMEWORKS'}</p>
            <div className="rpg-skill-row">
              {TOOLS.map((s) => (
                <SkillSlot key={s.name} name={s.name} icon={s.icon} onClick={playClick} />
              ))}
            </div>
            <img src="/minimap.png" alt="Mini map of the forest" className="rpg-minimap" />
          </section>
        )}

        {/* -------- VSCO -------- */}
        {tab === 'vsco' && (
          <section className="rpg-panel" aria-label="VSCO gallery">
            <Heading text="VSCO" />
            <div className="rpg-gallery">
              {Array.from({ length: 6 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className="rpg-photo"
                  onClick={playClick}
                  aria-label={`Empty photo frame ${i + 1}`}
                >
                  {'photo soon...'}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* -------- SOCIALS -------- */}
        {tab === 'socials' && (
          <section className="rpg-panel" aria-label="Socials">
            <Heading text="SOCIALS" />
            <div className="rpg-socials">
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="rpg-badge"
                onClick={playClick}
              >
                <img src={`${DEVICON}/github/github-original.svg`} alt="" aria-hidden="true" />
                GITHUB
              </a>
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="rpg-badge"
                onClick={playClick}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="#E4405F"
                  style={{ width: 'clamp(16px, 1.8vw, 38px)', height: 'clamp(16px, 1.8vw, 38px)' }}
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                </svg>
                INSTAGRAM
              </a>
            </div>
            <p className="rpg-empty-note">{'more links to be planted here...'}</p>
            <img src="/minimap.png" alt="Mini map of the forest" className="rpg-minimap" />
          </section>
        )}

        {/* film grain on top of everything, matching the art */}
        <div className="rpg-grain" />
      </div>
    </main>
  )
}
