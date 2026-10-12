import Logo from './Logo'
import { BRAND } from '../data'
import { scrollToTarget } from '../lib/motion'
import { openCatalog } from '../lib/catalog'

export default function Footer() {
  const go = (href) => (e) => {
    e.preventDefault()
    scrollToTarget(href)
  }
  return (
    <footer className="footer">
      <div className="container">
        <div className="foot-top">
          <div className="foot-brand">
            <Logo size={56} />
            <p>
              Precision pulleys, couplings and block bearings.
              <br />
              Manufactured in Agra, India.
            </p>
          </div>
          <nav className="foot-cols">
            <div>
              <p className="mono">Explore</p>
              {[
                ['About', '#about'],
                ['Products', '#products'],
                ['Engineering', '#engineering'],
                ['Industries', '#industries'],
                ['FAQ', '#faq'],
              ].map(([l, h]) => (
                <a key={h} href={h} onClick={go(h)}>
                  {l}
                </a>
              ))}
            </div>
            <div>
              <p className="mono">Reach us</p>
              {BRAND.phones.map((p) => (
                <a key={p} href={`tel:${p.replace(/\s/g, '')}`}>
                  {p}
                </a>
              ))}
              <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
            </div>
            <div>
              <p className="mono">Resources</p>
              <button className="foot-link" onClick={openCatalog}>
                Download catalogue ↓
              </button>
            </div>
          </nav>
        </div>
        <p className="foot-giant" aria-hidden="true">
          Golden<span>Machinery</span>
        </p>
        <div className="foot-bottom mono">
          <span>© {new Date().getFullYear()} Golden Machinery</span>
          <span>{BRAND.tagline}</span>
        </div>
      </div>
    </footer>
  )
}
