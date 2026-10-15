import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { X, Download, FileText, Check, Loader2 } from 'lucide-react'
import { lenis } from '../lib/motion'
import { onCatalogOpen, submitLead, downloadCatalog, loadSavedLead, saveLead } from '../lib/catalog'
import { PRODUCTS } from '../data'

const EMPTY = { name: '', phone: '', email: '', company: '', city: '', interest: '' }

// Gate: the catalogue PDF downloads only after the visitor submits their details.
export default function CatalogModal() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState('idle') // idle | sending | done
  const [error, setError] = useState('')
  const firstField = useRef()

  useEffect(
    () =>
      onCatalogOpen(() => {
        setForm({ ...EMPTY, ...loadSavedLead() })
        setStatus('idle')
        setError('')
        setOpen(true)
      }),
    [],
  )

  useEffect(() => {
    if (!open) return
    lenis?.stop()
    const t = setTimeout(() => firstField.current?.focus(), 350)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      lenis?.start()
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    const digits = form.phone.replace(/\D/g, '')
    if (digits.length < 10) return setError('Please enter a valid 10-digit phone number.')
    setError('')
    setStatus('sending')
    const lead = { ...form, name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim() }
    try {
      await submitLead(lead, e.target.elements.botcheck?.checked)
    } catch (err) {
      // never hold the catalogue hostage to a network hiccup
      console.error('[catalog] lead submit failed', err)
    }
    saveLead(lead)
    setStatus('done')
    downloadCatalog()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Download catalogue"
        >
          <motion.div
            className="modal-panel catalog-panel"
            initial={{ y: 60, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
          >
            <button className="modal-close" onClick={() => setOpen(false)} aria-label="Close">
              <X size={20} />
            </button>

            <aside className="catalog-side">
              <div className="catalog-doc" aria-hidden="true">
                <FileText size={34} strokeWidth={1.4} />
                <span className="mono">PDF · 8 pages</span>
              </div>
              <p className="mono accent">Product catalogue</p>
              <h3>The complete Golden range.</h3>
              <ul>
                <li><Check size={14} /> All {PRODUCTS.length} products</li>
                <li><Check size={14} /> V-belt & crown patta diagrams</li>
                <li><Check size={14} /> Industries we serve</li>
                <li><Check size={14} /> Both Agra units & contacts</li>
              </ul>
            </aside>

            <div className="catalog-main">
              {status === 'done' ? (
                <div className="catalog-done">
                  <motion.span
                    className="catalog-check"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 14, stiffness: 180 }}
                  >
                    <Check size={30} />
                  </motion.span>
                  <h3>Thank you, {form.name.split(' ')[0]}.</h3>
                  <p>Your catalogue download has started. Our team may reach out on {form.phone} to help with your requirement.</p>
                  <div className="modal-ctas">
                    <button className="btn btn-primary" onClick={downloadCatalog}>
                      <Download size={18} /> Download again
                    </button>
                    <button className="btn btn-ghost" onClick={() => setOpen(false)}>
                      Back to site
                    </button>
                  </div>
                </div>
              ) : (
                <form className="catalog-form" onSubmit={submit}>
                  <input type="checkbox" name="botcheck" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                  <div>
                    <h3>Get the catalogue</h3>
                    <p className="catalog-intro">Share a few details and the PDF downloads instantly.</p>
                  </div>
                  <div className="row">
                    <label>
                      <span>Full name *</span>
                      <input ref={firstField} required value={form.name} onChange={set('name')} autoComplete="name" />
                    </label>
                    <label>
                      <span>Phone *</span>
                      <input required type="tel" inputMode="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" placeholder="+91" />
                    </label>
                  </div>
                  <div className="row">
                    <label>
                      <span>Email *</span>
                      <input required type="email" value={form.email} onChange={set('email')} autoComplete="email" />
                    </label>
                    <label>
                      <span>Company</span>
                      <input value={form.company} onChange={set('company')} autoComplete="organization" />
                    </label>
                  </div>
                  <div className="row">
                    <label>
                      <span>City *</span>
                      <input required value={form.city} onChange={set('city')} autoComplete="address-level2" />
                    </label>
                    <label>
                      <span>Interested in</span>
                      <select value={form.interest} onChange={set('interest')}>
                        <option value="">Select a product</option>
                        {PRODUCTS.map((p) => (
                          <option key={p.id}>{p.name}</option>
                        ))}
                        <option>Custom / made to drawing</option>
                      </select>
                    </label>
                  </div>
                  {error && <p className="form-error" role="alert">{error}</p>}
                  <button className="btn btn-primary btn-lg" type="submit" disabled={status === 'sending'}>
                    {status === 'sending' ? <Loader2 size={18} className="spin" /> : <Download size={18} />}
                    {status === 'sending' ? 'Preparing…' : 'Submit & download'}
                  </button>
                  <p className="catalog-fine">We use these details only to respond to your enquiry.</p>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
