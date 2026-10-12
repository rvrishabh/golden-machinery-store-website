import { sendLead } from './leads'

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

export function submitLead(lead, botcheck) {
  return sendLead({ subject: `Catalogue download: ${lead.name}${lead.company ? ` (${lead.company})` : ''}`, fields: lead, botcheck })
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
