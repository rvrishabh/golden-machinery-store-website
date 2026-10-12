// Web3Forms delivers each submission to the inbox the access key was created for.
// The key is meant to be public (it only allows sending to that inbox).
const ENDPOINT = 'https://api.web3forms.com/submit'
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY

const LABELS = {
  name: 'Name',
  phone: 'Phone',
  email: 'Email',
  company: 'Company',
  city: 'City',
  interest: 'Interested in',
  product: 'Product',
  message: 'Requirement',
}

export async function sendLead({ subject, fields, botcheck = false }) {
  if (!ACCESS_KEY) {
    console.warn('[leads] VITE_WEB3FORMS_KEY is not set; submission was not sent.', fields)
    return false
  }
  // human-readable keys so the email reads cleanly
  const readable = Object.fromEntries(
    Object.entries(fields)
      .filter(([k, v]) => v && k !== 'email')
      .map(([k, v]) => [LABELS[k] || k, v]),
  )
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: ACCESS_KEY,
      subject,
      from_name: 'Golden Machinery Website',
      // Web3Forms uses `email` as the reply-to address
      email: fields.email || undefined,
      botcheck,
      ...readable,
      Page: location.href,
    }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || data.success === false) throw new Error(data.message || `Web3Forms responded ${res.status}`)
  return true
}
