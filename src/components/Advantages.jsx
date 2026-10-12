import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/motion'
import { gearPath } from '../lib/gear'
import { ADVANTAGES } from '../data'

const G1 = gearPath({ cx: 160, cy: 160, outer: 150, root: 130, teeth: 24, top: 0.4, flank: 0.1 })
const G2 = gearPath({ cx: 80, cy: 80, outer: 76, root: 62, teeth: 12, top: 0.4, flank: 0.1 })

export default function Advantages() {
  const root = useRef()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 900px)', () => {
        const items = gsap.utils.toArray('.adv-item')
        const counter = root.current.querySelector('.adv-count')
        gsap.timeline({
          scrollTrigger: {
            trigger: '.adv-list',
            start: 'top center',
            end: 'bottom center',
            scrub: true,
            onUpdate: (self) => {
              const i = Math.min(items.length - 1, Math.floor(self.progress * items.length))
              items.forEach((el, j) => el.classList.toggle('is-active', j === i))
              counter.textContent = `0${i + 1}`
            },
          },
        })
          // meshed gears: the small one turns 2x the big one, opposite direction
          .to('.adv-g1', { rotate: 180, ease: 'none' }, 0)
          .to('.adv-g2', { rotate: -360, ease: 'none' }, 0)
      })
    },
    { scope: root },
  )

  return (
    <section className="section adv" ref={root}>
      <div className="container adv-grid">
        <div className="adv-sticky">
          <p className="eyebrow" data-reveal>
            [ 04 ] The Golden advantage
          </p>
          <h2 className="h2" data-split>
            Why drives run <em>better</em> on Golden.
          </h2>
          <div className="adv-gears" aria-hidden="true">
            <svg className="adv-g1" viewBox="0 0 320 320">
              <path d={G1} />
              <circle cx="160" cy="160" r="40" />
              <circle cx="160" cy="160" r="96" className="faint" />
            </svg>
            <svg className="adv-g2" viewBox="0 0 160 160">
              <path d={G2} />
              <circle cx="80" cy="80" r="20" />
            </svg>
            <span className="adv-count mono">01</span>
          </div>
        </div>
        <ol className="adv-list">
          {ADVANTAGES.map((a, i) => (
            <li className={`adv-item ${i === 0 ? 'is-active' : ''}`} key={a.title} data-reveal>
              <span className="mono adv-n">0{i + 1}</span>
              <div>
                <h3>{a.title}</h3>
                <p>{a.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
