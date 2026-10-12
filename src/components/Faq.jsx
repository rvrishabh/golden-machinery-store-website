import { Plus } from 'lucide-react'
import { FAQS } from '../data'

// Native <details> keeps every answer in the DOM, so crawlers and AI assistants can read it.
export default function Faq() {
  return (
    <section id="faq" className="section faq" aria-labelledby="faq-title">
      <div className="container faq-grid">
        <div className="faq-head">
          <p className="eyebrow" data-reveal>
            [ 06 ] Questions
          </p>
          <h2 className="h2" id="faq-title" data-split>
            Asked <em>often.</em> Answered plainly.
          </h2>
        </div>
        <div className="faq-list">
          {FAQS.map((f, i) => (
            <details className="faq-item" key={f.q} open={i === 0} data-reveal>
              <summary>
                <h3>{f.q}</h3>
                <span className="faq-icon" aria-hidden="true">
                  <Plus size={18} />
                </span>
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
