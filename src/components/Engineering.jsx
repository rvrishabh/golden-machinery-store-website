import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { gsap, useGSAP } from '../lib/motion'
import { DIMENSIONS } from '../data'

const SHEETS = [
  { id: 'vbelt', label: 'V-Belt Pulley · Types 1–4', src: '/brand/v-belt-diagram.png' },
  { id: 'patta', label: 'Crown Patta Pulley', src: '/brand/crown-patta-diagram.png' },
]

// Half-section of a 3-groove V pulley, drawn line by line on scroll.
function Blueprint() {
  const grooves = [0, 1, 2].map((i) => {
    const x = 150 + i * 46
    return `L${x},60 L${x + 14},96 L${x + 32},96 L${x + 46},60`
  })
  const part = `M150,60 ${grooves.join(' ')} L288,60 L288,140 L246,140 L246,200 L330,200 L330,250 L108,250 L108,200 L192,200 L192,140 L150,140 Z`
  return (
    <svg className="bp" viewBox="0 0 440 400" aria-label="Animated cross-section drawing of a V-belt pulley">
      <defs>
        <clipPath id="bp-clip">
          <path d={part} />
        </clipPath>
      </defs>
      <g className="bp-part">
        <path d={part} />
        <path d="M108,280 L330,280 L330,330 L246,330 L246,380 L192,380 L192,330 L108,330 Z" className="bp-thin" />
      </g>
      <g className="bp-hatch" clipPath="url(#bp-clip)">
        {Array.from({ length: 30 }, (_, i) => (
          <line key={i} x1={100 + i * 9} y1={260} x2={100 + i * 9 + 200} y2={60} />
        ))}
      </g>
      <line className="bp-axis" x1="60" y1="265" x2="380" y2="265" />
      <g className="bp-dim">
        <line x1="150" y1="30" x2="288" y2="30" />
        <line x1="150" y1="24" x2="150" y2="56" />
        <line x1="288" y1="24" x2="288" y2="56" />
        <line x1="400" y1="60" x2="400" y2="265" />
        <line x1="394" y1="60" x2="406" y2="60" />
        <line x1="40" y1="200" x2="40" y2="330" />
        <line x1="34" y1="200" x2="46" y2="200" />
        <line x1="34" y1="330" x2="46" y2="330" />
      </g>
      <g className="bp-labels mono">
        <text x="219" y="22">F</text>
        <text x="408" y="165">D/2</text>
        <text x="14" y="268">HD</text>
        <text x="206" y="275">BORE</text>
      </g>
    </svg>
  )
}

export default function Engineering() {
  const root = useRef()
  const [sheet, setSheet] = useState(SHEETS[0])

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: '.bp', start: 'top 80%', end: 'bottom 45%', scrub: 1 },
      })
      tl.from('.bp-part path', { drawSVG: 0, duration: 2, stagger: 0.4, ease: 'none' })
        .from('.bp-axis', { drawSVG: '50% 50%', duration: 0.6 }, 0.4)
        .from('.bp-hatch line', { drawSVG: 0, stagger: 0.05, duration: 0.3 }, 1)
        .from('.bp-dim line', { drawSVG: 0, stagger: 0.1, duration: 0.4 }, 1.4)
        .from('.bp-labels text', { opacity: 0, y: 6, stagger: 0.1, duration: 0.3 }, 2)
    },
    { scope: root },
  )

  return (
    <section id="engineering" className="section engineering" ref={root}>
      <div className="container">
        <div className="eng-head">
          <p className="eyebrow" data-reveal>
            [ 03 ] Engineering
          </p>
          <h2 className="h2" data-split>
            Built to the <em>drawing.</em> Not near it.
          </h2>
          <p className="lead" data-reveal>
            Every pulley starts as a dimensioned drawing. Diameter, face, hub and bore are held to spec, then
            balanced, so belts track true and drives run quiet.
          </p>
        </div>

        <div className="eng-grid">
          <div className="eng-draw" data-reveal>
            <div className="eng-frame mono">
              <span>DWG-GM-VB03</span>
              <span>SCALE 1:4</span>
            </div>
            <Blueprint />
            <ul className="dims">
              {DIMENSIONS.map(([k, v]) => (
                <li key={k}>
                  <span className="mono">{k}</span>
                  {v}
                </li>
              ))}
            </ul>
          </div>

          <div className="eng-sheets" data-reveal>
            <div className="tabs" role="tablist">
              {SHEETS.map((s) => (
                <button
                  key={s.id}
                  role="tab"
                  aria-selected={sheet.id === s.id}
                  className={`tab ${sheet.id === s.id ? 'is-active' : ''}`}
                  onClick={() => setSheet(s)}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <div className="sheet" data-cursor="view">
              <AnimatePresence mode="wait">
                <motion.img
                  key={sheet.id}
                  src={sheet.src}
                  alt={`${sheet.label} dimension diagram`}
                  initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
                  transition={{ duration: 0.45 }}
                  loading="lazy"
                />
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
