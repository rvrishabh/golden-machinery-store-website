import { useEffect, useRef } from 'react'
import { gearPath } from '../lib/gear'
import { scrollState, scrollToTarget } from '../lib/motion'

const GEAR = gearPath({ cx: 50, cy: 50, outer: 46, root: 38, teeth: 14, top: 0.38, flank: 0.1 })

// Fixed progress gear: turns with page position, click to return to top.
export default function ScrollGear() {
  const gear = useRef()
  const pct = useRef()
  const ring = useRef()

  useEffect(() => {
    let raf
    const C = 2 * Math.PI * 30
    const tick = () => {
      const p = scrollState.progress || 0
      gear.current.style.transform = `rotate(${p * 1080}deg)`
      ring.current.style.strokeDashoffset = C * (1 - p)
      pct.current.textContent = String(Math.round(p * 100)).padStart(2, '0')
      raf = requestAnimationFrame(tick)
    }
    ring.current.style.strokeDasharray = C
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <button className="scroll-gear" onClick={() => scrollToTarget('#top')} aria-label="Back to top">
      <svg viewBox="0 0 100 100" className="sg-ring">
        <circle cx="50" cy="50" r="30" ref={ring} />
      </svg>
      <svg viewBox="0 0 100 100" className="sg-gear" ref={gear}>
        <path d={GEAR} />
      </svg>
      <span className="mono" ref={pct}>00</span>
    </button>
  )
}
