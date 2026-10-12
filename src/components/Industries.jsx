import { FlaskConical, Fan, Forklift, Sprout, Shirt, Wheat, Mountain, ScrollText, Tractor } from 'lucide-react'
import { INDUSTRIES } from '../data'

const ICONS = { FlaskConical, Fan, Forklift, Sprout, Shirt, Wheat, Mountain, ScrollText, Tractor }

export default function Industries() {
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return (
    <section id="industries" className="section industries">
      <div className="container">
        <div className="ind-head">
          <p className="eyebrow" data-reveal>
            [ 05 ] Industries we serve
          </p>
          <h2 className="h2" data-split>
            Wherever there's a shaft, <em>we're turning it.</em>
          </h2>
        </div>
        <div className="ind-grid">
          {INDUSTRIES.map((ind, i) => {
            const Icon = ICONS[ind.icon]
            return (
              <div className="ind" key={ind.name} onPointerMove={onMove} data-reveal>
                <span className="mono ind-n">{String(i + 1).padStart(2, '0')}</span>
                <Icon className="ind-icon" size={34} strokeWidth={1.3} />
                <h3>{ind.name}</h3>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
