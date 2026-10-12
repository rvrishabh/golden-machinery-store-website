import { useState } from 'react'
import { ArrowUpRight, MapPin, Phone, Mail, MessageCircle } from 'lucide-react'
import { BRAND, PRODUCTS } from '../data'

export default function Contact() {
  const [form, setForm] = useState({ name: '', company: '', phone: '', product: '', message: '' })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  // No backend: the enquiry opens in WhatsApp, pre-filled, for the visitor to send.
  const submit = (e) => {
    e.preventDefault()
    const text = [
      'Hello Golden Machinery, I have an enquiry.',
      `Name: ${form.name}`,
      form.company && `Company: ${form.company}`,
      `Phone: ${form.phone}`,
      form.product && `Product: ${form.product}`,
      form.message && `Details: ${form.message}`,
    ]
      .filter(Boolean)
      .join('\n')
    window.open(`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
  }

  return (
    <section id="contact" className="section contact">
      <div className="container contact-grid">
        <div>
          <p className="eyebrow" data-reveal>
            [ 06 ] Contact
          </p>
          <h2 className="h2" data-split>
            Let's get your <em>drive</em> running.
          </h2>
          <p className="lead" data-reveal>
            Share a drawing, a part number or just the problem. We'll come back with the right pulley and a
            competitive quote.
          </p>

          <div className="contact-cards">
            {BRAND.units.map((u) => (
              <div className="c-card" key={u.label} data-reveal>
                <MapPin size={18} />
                <div>
                  <p className="mono gold">{u.label}</p>
                  {u.lines.map((l) => (
                    <p key={l}>{l}</p>
                  ))}
                </div>
              </div>
            ))}
            <div className="c-card" data-reveal>
              <Phone size={18} />
              <div>
                <p className="mono gold">Call</p>
                {BRAND.phones.map((p) => (
                  <a key={p} href={`tel:${p.replace(/\s/g, '')}`}>
                    {p}
                  </a>
                ))}
              </div>
            </div>
            <div className="c-card" data-reveal>
              <Mail size={18} />
              <div>
                <p className="mono gold">Email</p>
                <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
              </div>
            </div>
          </div>
        </div>

        <form className="form" onSubmit={submit} data-reveal>
          <div className="form-head">
            <p className="mono">Enquiry form</p>
            <span className="mono gold">Opens in WhatsApp</span>
          </div>
          <div className="row">
            <label>
              <span>Name *</span>
              <input required value={form.name} onChange={set('name')} autoComplete="name" />
            </label>
            <label>
              <span>Company</span>
              <input value={form.company} onChange={set('company')} autoComplete="organization" />
            </label>
          </div>
          <div className="row">
            <label>
              <span>Phone *</span>
              <input required type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" />
            </label>
            <label>
              <span>Product</span>
              <select value={form.product} onChange={set('product')}>
                <option value="">Select a product</option>
                {PRODUCTS.map((p) => (
                  <option key={p.id}>{p.name}</option>
                ))}
                <option>Custom / made to drawing</option>
              </select>
            </label>
          </div>
          <label>
            <span>Requirement</span>
            <textarea rows={4} value={form.message} onChange={set('message')} placeholder="Size, bore, grooves, quantity…" />
          </label>
          <button className="btn btn-gold btn-lg" type="submit">
            <MessageCircle size={18} /> Send via WhatsApp <ArrowUpRight size={18} />
          </button>
        </form>
      </div>
    </section>
  )
}
