export const CATALOG_URL = '/golden-machinery-catalogue.pdf'
export const CATALOG_FILENAME = 'Golden-Machinery-Catalogue.pdf'

const OPEN_EVENT = 'catalog:open'
const STORAGE_KEY = 'gm-catalog-lead'

// Any button can ask for the catalogue; the gate modal listens for this.
export const openCatalog = () => window.dispatchEvent(new CustomEvent(OPEN_EVENT))
export const onCatalogOpen = (fn) => {
  window.addEventListener(OPEN_EVENT, fn)
  return () => window.removeEventListener(OPEN_EVENT, fn)
}

// Where catalogue leads are POSTed as JSON. Set VITE_LEAD_ENDPOINT in .env
// (e.g. a Formspree / Web3Forms / Google Apps Script URL). Unset = not sent anywhere.
const ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT

export async function submitLead(lead) {
  const payload = { ...lead, source: 'Catalogue download', submittedAt: new Date().toISOString(), page: location.href }
  if (!ENDPOINT) {
    console.warn('[catalog] VITE_LEAD_ENDPOINT is not set; lead was not sent.', payload)
    return false
  }
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Lead endpoint responded ${res.status}`)
  return true
}

export function downloadCatalog() {
  const a = document.createElement('a')
  a.href = CATALOG_URL
  a.download = CATALOG_FILENAME
  document.body.appendChild(a)
  a.click()
  a.remove()
}

export function loadSavedLead() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null
  } catch {
    return null
  }
}

export function saveLead(lead) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lead))
  } catch {
    // storage blocked (private mode); the form just won't be pre-filled next time
  }
}
