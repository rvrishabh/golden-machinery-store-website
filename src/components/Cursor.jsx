import { useEffect, useRef } from 'react'
import { gearPath } from '../lib/gear'
import { scrollState } from '../lib/motion'

const GEAR = gearPath({ cx: 50, cy: 50, outer: 48, root: 39, teeth: 12, top: 0.38, flank: 0.1 })

// A spinning gear cursor: it idles slowly, spins up with pointer speed and
// scroll velocity, and grows over interactive elements.
export default function Cursor() {
  const gearRef = useRef()
  const dotRef = useRef()
  const labelRef = useRef()

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    document.documentElement.classList.add('has-cursor')
    const mouse = { x: innerWidth / 2, y: innerHeight / 2 }
    const pos = { ...mouse }
    let angle = 0
    let speed = 0
    let lastX = mouse.x
    let lastY = mouse.y
    let raf

    const onMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      dotRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`
    }
    const onOver = (e) => {
      const t = e.target.closest('a, button, [data-cursor], input, select, textarea, label')
      const g = gearRef.current
      g.dataset.state = t ? t.dataset.cursor || 'link' : ''
      labelRef.current.textContent = t?.dataset.cursor === 'drag' ? 'Drag' : t?.dataset.cursor === 'view' ? 'View' : ''
    }
    const onDown = () => gearRef.current.classList.add('is-down')
    const onUp = () => gearRef.current.classList.remove('is-down')
    const onLeave = () => gearRef.current.classList.add('is-hidden')
    const onEnter = () => gearRef.current.classList.remove('is-hidden')

    const tick = () => {
      pos.x += (mouse.x - pos.x) * 0.18
      pos.y += (mouse.y - pos.y) * 0.18
      const v = Math.hypot(mouse.x - lastX, mouse.y - lastY)
      lastX = mouse.x
      lastY = mouse.y
      speed += (0.6 + v * 0.35 + Math.abs(scrollState.velocity) * 0.4 - speed) * 0.1
      angle += speed * (scrollState.velocity < 0 ? -1 : 1)
      gearRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
      gearRef.current.firstChild.style.transform = `rotate(${angle}deg)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerover', onOver)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('pointerenter', onEnter)
    return () => {
      cancelAnimationFrame(raf)
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('pointerenter', onEnter)
    }
  }, [])

  return (
    <div className="cursor" aria-hidden="true">
      <div className="cursor-gear" ref={gearRef}>
        <svg viewBox="0 0 100 100">
          <path d={GEAR} />
          <circle cx="50" cy="50" r="13" />
          <line x1="50" y1="37" x2="50" y2="22" />
        </svg>
        <span className="cursor-label mono" ref={labelRef} />
      </div>
      <div className="cursor-dot" ref={dotRef} />
    </div>
  )
}
