import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { X, MessageCircle, Mail, Check } from 'lucide-react'
import { BRAND, CATEGORIES } from '../data'
import { lenis } from '../lib/motion'

export default function ProductModal({ product, onClose }) {
  useEffect(() => {
    if (!product) return
    lenis?.stop()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      lenis?.start()
      window.removeEventListener('keydown', onKey)
    }
  }, [product, onClose])

  const msg = product
    ? encodeURIComponent(`Hello Golden Machinery, I'd like a quote for the ${product.name}.`)
    : ''

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={product.name}
        >
          <motion.div
            className="modal-panel"
            initial={{ y: 60, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
          >
            <button className="modal-close" onClick={onClose} aria-label="Close">
              <X size={20} />
            </button>
            <div className="modal-media">
              <div className="modal-rings" aria-hidden="true" />
              <motion.img
                src={product.image}
                alt={product.name}
                initial={{ rotate: -40, scale: 0.7, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 18, stiffness: 90, delay: 0.1 }}
              />
            </div>
            <div className="modal-info">
              <p className="mono gold">{CATEGORIES.find((c) => c.id === product.category)?.label}</p>
              <h3>{product.name}</h3>
              <p className="modal-sum">{product.summary}</p>
              <div className="modal-cols">
                <div>
                  <p className="mono k">Highlights</p>
                  <ul>
                    {product.features.map((f) => (
                      <li key={f}>
                        <Check size={14} /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mono k">Typical use</p>
                  <ul>
                    {product.uses.map((f) => (
                      <li key={f}>
                        <span className="tick" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="modal-note">
                Available in custom diameters, bores and groove configurations, machined to your drawing.
              </p>
              <div className="modal-ctas">
                <a className="btn btn-gold" href={`https://wa.me/${BRAND.whatsapp}?text=${msg}`} target="_blank" rel="noreferrer">
                  <MessageCircle size={18} /> Quote on WhatsApp
                </a>
                <a className="btn btn-ghost" href={`mailto:${BRAND.email}?subject=${encodeURIComponent('Enquiry: ' + product.name)}&body=${msg}`}>
                  <Mail size={18} /> Email
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
