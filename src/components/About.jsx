import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/motion'

const STATS = [
  { n: 60, suffix: '+', label: 'Years of manufacturing excellence' },
  { n: 12, suffix: '', label: 'Product lines, cast & machined in-house' },
  { n: 9, suffix: '', label: 'Industries kept in motion' },
  { n: 2, suffix: '', label: 'Manufacturing units in Agra' },
]

export default function About() {
  const root = useRef()

  useGSAP(
    () => {
      root.current.querySelectorAll('.stat-num').forEach((el) => {
        const n = +el.dataset.n
        const o = { v: 0 }
        gsap.to(o, {
          v: n,
          duration: 2,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
          onUpdate: () => (el.textContent = String(Math.round(o.v)).padStart(2, '0')),
        })
      })
      gsap.fromTo(
        '.about-visual img',
        { yPercent: 12, rotate: -8 },
        {
          yPercent: -12,
          rotate: 8,
          ease: 'none',
          scrollTrigger: { trigger: '.about-visual', start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
      gsap.to('.about-visual .orbit', {
        rotate: 360,
        ease: 'none',
        scrollTrigger: { trigger: '.about-visual', start: 'top bottom', end: 'bottom top', scrub: true },
      })
    },
    { scope: root },
  )

  return (
    <section id="about" className="section about" ref={root}>
      <div className="container">
        <p className="eyebrow" data-reveal>
          [ 01 ] About Golden Machinery
        </p>
        <div className="about-grid">
          <div className="about-copy">
            <h2 className="h2" data-split>
              Six decades of <em>precision</em> in power transmission.
            </h2>
            <p className="lead" data-reveal>
              Golden Machinery is a trusted manufacturer of mechanical power transmission products: precision-crafted
              pulleys, couplings and block bearings, including Patta Pulleys, Solid V-belt Pulleys, Poly-V Pulleys and
              Couplings.
            </p>
            <p data-reveal>
              Our commitment to quality has defined our success for over 60 years. We offer world-class products at
              competitive prices, and we build lasting relationships, so every customer becomes part of our extended
              family. As industry evolves, we adapt with it, so every product meets the highest standards of
              reliability and durability.
            </p>
            <p className="signature" data-reveal>
              A relationship for life.
            </p>
          </div>
          <div className="about-visual" data-cursor="view">
            <svg className="orbit" viewBox="0 0 200 200" aria-hidden="true">
              <defs>
                <path id="orbit-path" d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" />
              </defs>
              <text>
                <textPath href="#orbit-path">
                  QUALITY · PRECISION · RELIABILITY · DURABILITY · QUALITY · PRECISION · RELIABILITY ·
                </textPath>
              </text>
            </svg>
            <img src="/brand/hero-pair.png" alt="Golden Machinery V-belt pulleys in pink and blue finish" loading="lazy" />
          </div>
        </div>

        <div className="stats">
          {STATS.map((s) => (
            <div className="stat" key={s.label} data-reveal>
              <div className="stat-n">
                <span className="stat-num" data-n={s.n}>
                  00
                </span>
                <span className="accent">{s.suffix}</span>
              </div>
              <p>{s.label}</p>
            </div>
          ))}
        </div>

        <div className="vm">
          <article className="vm-card" data-reveal>
            <span className="mono vm-k">Vision</span>
            <p>
              To emerge as the foremost and most distinguished manufacturer of Pulleys and Couplings in India, setting
              benchmarks in both quality and quantity by giving customers reliable, cost-effective solutions for all
              their power transmission needs.
            </p>
          </article>
          <article className="vm-card" data-reveal>
            <span className="mono vm-k">Mission</span>
            <p>
              To deliver excellence by putting customer satisfaction and industry advancement first: on-time delivery
              of defect-free products, less wastage through sustainable practice, and cost efficiency through
              continuous value engineering.
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}
