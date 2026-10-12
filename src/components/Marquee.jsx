import { useRef } from 'react'
import { gsap, useGSAP, scrollState } from '../lib/motion'
import { gearPath } from '../lib/gear'

const SEP = gearPath({ cx: 12, cy: 12, outer: 11, root: 8, teeth: 8, top: 0.38, flank: 0.1 })

// Infinite ticker whose speed and direction follow scroll velocity.
export default function Marquee({ items, tone = 'dark' }) {
  const root = useRef()

  useGSAP(
    () => {
      const track = root.current.querySelector('.mq-track')
      const tween = gsap.to(track, { xPercent: -50, duration: 40, ease: 'none', repeat: -1 })
      // start deep into the loop so scrolling up can run it backwards
      tween.totalTime(4000)
      const tick = () => {
        const v = scrollState.velocity
        const target = (v < 0 ? -1 : 1) * (1 + Math.min(Math.abs(v) * 0.25, 6))
        tween.timeScale(gsap.utils.interpolate(tween.timeScale(), target, 0.08))
        root.current.querySelectorAll('.mq-sep').forEach((s) => {
          s.style.transform = `rotate(${tween.progress() * 3600}deg)`
        })
      }
      gsap.ticker.add(tick)
      return () => gsap.ticker.remove(tick)
    },
    { scope: root },
  )

  const row = items.map((t, i) => (
    <span className="mq-item" key={i}>
      {t}
      <svg className="mq-sep" viewBox="0 0 24 24" aria-hidden="true">
        <path d={SEP} />
      </svg>
    </span>
  ))

  return (
    <div className={`marquee marquee-${tone}`} ref={root} aria-hidden="true">
      <div className="mq-track">
        {row}
        {row}
      </div>
    </div>
  )
}
