import { useEffect, useState } from 'react'
import { Menu, X, Phone } from 'lucide-react'
import Logo from './Logo'
import { scrollToTarget, lenis } from '../lib/motion'
import { BRAND } from '../data'

const LINKS = [
  ['About', '#about'],
  ['Products', '#products'],
  ['Engineering', '#engineering'],
  ['Industries', '#industries'],
  ['Contact', '#contact'],
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    if (open) lenis?.stop()
    else lenis?.start()
  }, [open])

  const go = (href) => (e) => {
    e.preventDefault()
    setOpen(false)
    scrollToTarget(href)
  }

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="nav-inner container">
        <a href="#top" className="brand" onClick={go('#top')} aria-label="Golden Machinery home">
          <Logo size={40} />
          <span className="brand-text">
            <strong>Golden Machinery</strong>
            <small className="mono">Machinery works on our hand</small>
          </span>
        </a>
        <nav className="nav-links" aria-label="Primary">
          {LINKS.map(([label, href]) => (
            <a key={href} href={href} onClick={go(href)}>
              <span data-text={label}>{label}</span>
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <a className="nav-phone mono" href={`tel:${BRAND.phones[1].replace(/\s/g, '')}`}>
            <Phone size={14} /> {BRAND.phones[1]}
          </a>
          <a href="#contact" className="btn btn-gold btn-sm" onClick={go('#contact')}>
            Enquire
          </a>
          <button className="nav-toggle" onClick={() => setOpen((o) => !o)} aria-label={open ? 'Close menu' : 'Open menu'}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      <div className="nav-sheet" aria-hidden={!open}>
        {LINKS.map(([label, href], i) => (
          <a key={href} href={href} onClick={go(href)} style={{ '--i': i }}>
            <span className="mono">0{i + 1}</span> {label}
          </a>
        ))}
        <div className="nav-sheet-foot mono">
          {BRAND.phones.map((p) => (
            <a key={p} href={`tel:${p.replace(/\s/g, '')}`}>{p}</a>
          ))}
          <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
        </div>
      </div>
    </header>
  )
}
