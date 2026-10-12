import { useMemo, useRef, useState } from 'react'
import { ArrowUpRight, Download } from 'lucide-react'
import { openCatalog } from '../lib/catalog'
import { gsap, ScrollTrigger, useGSAP } from '../lib/motion'
import { PRODUCTS, CATEGORIES } from '../data'
import ProductModal from './ProductModal'

const catLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label

export default function Products() {
  const root = useRef()
  const [filter, setFilter] = useState('all')
  const [open, setOpen] = useState(null)
  const list = useMemo(() => (filter === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter)), [filter])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 900px)', () => {
        const track = root.current.querySelector('.rail-track')
        const rollers = gsap.utils.toArray('.card[data-roll] .card-img img', root.current)
        const floaters = gsap.utils.toArray('.card:not([data-roll]) .card-img img', root.current)
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 64)
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: '.rail',
            start: 'top top',
            end: () => '+=' + distance(),
            pin: true,
            scrub: 0.6,
            refreshPriority: 5,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const x = self.progress * distance()
              // roll like a wheel: rotation = distance travelled / radius
              rollers.forEach((img) => (img.style.transform = `rotate(${(x / 130) * 57.3}deg)`))
              floaters.forEach((img, i) => (img.style.transform = `translateY(${Math.sin(x / 220 + i) * 10}px) rotate(${Math.sin(x / 300 + i) * 4}deg)`))
              root.current.querySelector('.rail-progress span').style.transform = `scaleX(${self.progress})`
            },
          },
        })
        return () => tween.scrollTrigger?.kill()
      })
      ScrollTrigger.refresh()
    },
    { scope: root, dependencies: [list], revertOnUpdate: true },
  )

  return (
    <section id="products" className="section products" ref={root}>
      <div className="rail">
        <div className="container rail-head">
          <div>
            <p className="eyebrow" data-reveal>
              [ 02 ] Product range
            </p>
            <h2 className="h2" data-split>
              Cast. Machined. <em>Balanced.</em>
            </h2>
          </div>
          <div className="filters" role="tablist" aria-label="Filter products">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                role="tab"
                aria-selected={filter === c.id}
                className={`chip ${filter === c.id ? 'is-active' : ''}`}
                onClick={() => setFilter(c.id)}
              >
                {c.label}
                <span className="mono">
                  {c.id === 'all' ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === c.id).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="rail-viewport">
          <div className="rail-track">
            {list.map((p) => {
              const n = PRODUCTS.indexOf(p) + 1
              return (
                <article
                  key={p.id}
                  className="card"
                  data-roll={p.roll ? '' : undefined}
                  data-cursor="view"
                  onClick={() => setOpen(p)}
                >
                  <div className="card-top mono">
                    <span>{String(n).padStart(2, '0')}</span>
                    <span>{catLabel(p.category)}</span>
                  </div>
                  <div className="card-img">
                    <div className="card-glow" />
                    <img src={p.image} alt={p.name} loading="lazy" draggable="false" />
                  </div>
                  <div className="card-body">
                    <h3>{p.name}</h3>
                    <p>{p.summary}</p>
                    <button className="card-cta" aria-label={`View ${p.name}`}>
                      Details <ArrowUpRight size={16} />
                    </button>
                  </div>
                </article>
              )
            })}
            <article className="card card-end">
              <p className="mono">Need a custom size?</p>
              <h3>Made to your drawing.</h3>
              <p>Bore, diameter, groove count and face width, machined to your specification.</p>
              <a href="#contact" className="btn btn-primary">
                Send a drawing <ArrowUpRight size={18} />
              </a>
              <button className="btn btn-ghost" onClick={openCatalog}>
                <Download size={18} /> Full catalogue
              </button>
            </article>
          </div>
        </div>
        <div className="container rail-foot">
          <div className="rail-progress">
            <span />
          </div>
          <span className="mono">Scroll to roll →</span>
        </div>
      </div>
      <ProductModal product={open} onClose={() => setOpen(null)} />
    </section>
  )
}
