import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Download } from 'lucide-react'
import { openCatalog } from '../lib/catalog'
import { gsap, ScrollTrigger, SplitText, useGSAP, scrollState, scrollToTarget } from '../lib/motion'

const PulleyScene = lazy(() => import('./PulleyScene'))

export default function Hero({ ready }) {
  const root = useRef()
  const drag = useRef({ impulse: 0 })
  const [active, setActive] = useState(true)

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: '100px' })
    io.observe(root.current)
    return () => io.disconnect()
  }, [])

  // grab-and-spin: horizontal drag adds angular impulse to the drive
  useEffect(() => {
    const el = root.current.querySelector('.hero-stage')
    let last = null
    const down = (e) => (last = e.clientX)
    const move = (e) => {
      if (last == null) return
      drag.current.impulse = gsap.utils.clamp(-14, 14, drag.current.impulse - (e.clientX - last) * 0.05)
      last = e.clientX
    }
    const up = () => (last = null)
    el.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => {
      el.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
  }, [])

  useGSAP(
    () => {
      if (!ready) return
      const split = SplitText.create('.hero-title .line-inner', { type: 'words,chars', charsClass: 'char' })
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.from(split.chars, { yPercent: 110, rotate: 6, duration: 1.3, stagger: 0.022 })
        .from('.hero-eyebrow', { y: 20, opacity: 0, duration: 1 }, 0.2)
        .from('.hero-sub, .hero-ctas > *', { y: 30, opacity: 0, duration: 1.1, stagger: 0.08 }, 0.5)
        .from('.hero-stats > *', { y: 30, opacity: 0, duration: 1, stagger: 0.07 }, 0.7)
        .from('.hero-stage', { opacity: 0, duration: 2 }, 0)

      const st = ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: '+=90%',
        pin: true,
        scrub: true,
        refreshPriority: 10,
        onUpdate: (self) => (scrollState.heroProgress = self.progress),
        animation: gsap
          .timeline()
          .to('.hero-copy', { yPercent: -18, opacity: 0, ease: 'none', duration: 0.45 }, 0)
          .to('.hero-stats', { y: 60, opacity: 0, ease: 'none', duration: 0.4 }, 0)
          .to('.hero-tagline', { opacity: 1, y: 0, ease: 'none', duration: 0.45 }, 0.55),
      })
      return () => {
        st.kill()
        split.revert()
      }
    },
    { scope: root, dependencies: [ready] },
  )

  return (
    <section id="top" className="hero" ref={root}>
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-stage" data-cursor="drag">
        <Suspense fallback={null}>
          <PulleyScene active={active} drag={drag} />
        </Suspense>
      </div>

      <div className="hero-copy container">
        <p className="eyebrow hero-eyebrow">
          <span className="dot" /> Six decades of power transmission · Agra, India
        </p>
        <h1 className="hero-title">
          <span className="line"><span className="line-inner">Machinery</span></span>
          <span className="line"><span className="line-inner">works on</span></span>
          <span className="line"><span className="line-inner accent">our hand.</span></span>
        </h1>
        <p className="hero-sub">
          Precision-cast pulleys, couplings and block bearings, balanced and machined to keep India's
          industry turning.
        </p>
        <div className="hero-ctas">
          <button className="btn btn-primary" onClick={() => scrollToTarget('#products')}>
            Explore products <ArrowDownRight size={18} />
          </button>
          <button className="btn btn-ghost" onClick={() => scrollToTarget('#contact')}>
            Request a quote <ArrowUpRight size={18} />
          </button>
          <button className="btn btn-ghost btn-icon" onClick={openCatalog} aria-label="Download catalogue" title="Download catalogue">
            <Download size={18} /> <span>Catalogue</span>
          </button>
        </div>
      </div>

      <p className="hero-tagline container" aria-hidden="true">
        Every turn, <span className="accent">engineered.</span>
      </p>

      <div className="hero-stats container">
        <div>
          <strong>60+</strong>
          <span>Years of casting</span>
        </div>
        <div>
          <strong>12</strong>
          <span>Product lines</span>
        </div>
        <div>
          <strong>02</strong>
          <span>Units in Agra</span>
        </div>
        <div className="hero-hint">
          <span className="mono">Drag the drive · Scroll to power it</span>
          <span className="scroll-line" />
        </div>
      </div>
    </section>
  )
}
