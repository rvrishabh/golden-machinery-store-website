import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/motion'
import { gearPath } from '../lib/gear'

const BIG = gearPath({ cx: 60, cy: 60, outer: 56, root: 46, teeth: 14, top: 0.38, flank: 0.1 })
const SMALL = gearPath({ cx: 30, cy: 30, outer: 28, root: 21, teeth: 8, top: 0.36, flank: 0.12 })

export default function Preloader({ onDone }) {
  const root = useRef()

  useGSAP(
    () => {
      const counter = { v: 0 }
      const tl = gsap.timeline({ onComplete: onDone })
      gsap.to('.pl-gear-big', { rotate: 360, duration: 3.5, repeat: -1, ease: 'none', transformOrigin: '50% 50%' })
      gsap.to('.pl-gear-small', { rotate: -630, duration: 3.5, repeat: -1, ease: 'none', transformOrigin: '50% 50%' })
      tl.to(counter, {
        v: 100,
        duration: 2,
        ease: 'power2.inOut',
        onUpdate: () => {
          root.current.querySelector('.pl-count').textContent = String(Math.round(counter.v)).padStart(3, '0')
          root.current.querySelector('.pl-bar span').style.transform = `scaleX(${counter.v / 100})`
        },
      })
        .to('.pl-inner', { y: -40, opacity: 0, duration: 0.6, ease: 'power3.in' })
        .to(root.current, { yPercent: -100, duration: 1, ease: 'expo.inOut' }, '-=0.15')
        .set(root.current, { display: 'none' })
    },
    { scope: root },
  )

  return (
    <div className="preloader" ref={root}>
      <div className="pl-inner">
        <div className="pl-gears" aria-hidden="true">
          <svg className="pl-gear-big" viewBox="0 0 120 120" width="120" height="120">
            <path d={BIG} fill="none" stroke="var(--gold)" strokeWidth="2" />
            <circle cx="60" cy="60" r="14" fill="none" stroke="var(--gold)" strokeWidth="2" />
          </svg>
          <svg className="pl-gear-small" viewBox="0 0 60 60" width="60" height="60">
            <path d={SMALL} fill="none" stroke="var(--blue)" strokeWidth="2" />
            <circle cx="30" cy="30" r="7" fill="none" stroke="var(--blue)" strokeWidth="2" />
          </svg>
        </div>
        <p className="pl-brand">Golden Machinery</p>
        <p className="pl-tag mono">Machinery works on our hand</p>
        <div className="pl-bar">
          <span />
        </div>
        <p className="pl-count mono">000</p>
      </div>
    </div>
  )
}
