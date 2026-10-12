import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, SplitText, useGSAP, scrollState, setLenis, prefersReducedMotion } from './lib/motion'
import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import About from './components/About'
import Products from './components/Products'
import Engineering from './components/Engineering'
import Advantages from './components/Advantages'
import Industries from './components/Industries'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ScrollGear from './components/ScrollGear'
import { INDUSTRIES } from './data'

const TICKER = ['V-Belt Pulleys', 'Crown Patta Pulleys', 'Couplings', 'Block Bearings', 'Step Pulleys', 'Elevator Pulleys', 'Poly-V Pulleys', 'Made to drawing']

export default function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion) {
      const on = () => {
        const max = document.documentElement.scrollHeight - innerHeight
        scrollState.progress = max > 0 ? scrollY / max : 0
      }
      window.addEventListener('scroll', on, { passive: true })
      return () => window.removeEventListener('scroll', on)
    }
    const lenis = new Lenis({ lerp: 0.09, anchors: true, wheelMultiplier: 0.9 })
    setLenis(lenis)
    lenis.on('scroll', (e) => {
      scrollState.velocity = e.velocity
      scrollState.progress = e.progress
      scrollState.direction = e.direction
      ScrollTrigger.update()
    })
    const raf = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    // velocity decays to zero when the wheel stops
    const decay = () => (scrollState.velocity *= lenis.isScrolling ? 1 : 0.9)
    gsap.ticker.add(decay)
    return () => {
      gsap.ticker.remove(raf)
      gsap.ticker.remove(decay)
      lenis.destroy()
      setLenis(null)
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('is-loading', !ready)
    if (ready) {
      // pins are created at different times; refresh them top-down
      ScrollTrigger.sort()
      ScrollTrigger.refresh()
    }
  }, [ready])

  // Site-wide scroll reveals: [data-split] headings rise line by line, [data-reveal] fades up.
  useGSAP(
    () => {
      if (!ready) return
      const splits = gsap.utils.toArray('[data-split]').map((el) =>
        SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'split-line',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 105,
              duration: 1.2,
              ease: 'expo.out',
              stagger: 0.09,
              scrollTrigger: { trigger: el, start: 'top 85%' },
            }),
        }),
      )
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
        })
      })
      return () => splits.forEach((s) => s.revert())
    },
    { dependencies: [ready] },
  )

  return (
    <>
      {!prefersReducedMotion && <Preloader onDone={() => setReady(true)} />}
      {prefersReducedMotion && <ReadyNow onReady={() => setReady(true)} />}
      <Cursor />
      <div className="grain" aria-hidden="true" />
      <Nav />
      <main>
        <Hero ready={ready} />
        <Marquee items={TICKER} tone="gold" />
        <About />
        <Products />
        <Engineering />
        <Advantages />
        <Marquee items={INDUSTRIES.map((i) => i.name)} />
        <Industries />
        <Contact />
      </main>
      <Footer />
      <ScrollGear />
    </>
  )
}

function ReadyNow({ onReady }) {
  useEffect(() => onReady(), [onReady])
  return null
}
