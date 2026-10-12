// Build-time SEO / AEO for a client-rendered site.
// Everything is generated from src/data.js so the page, the structured data,
// the crawlable HTML and llms.txt can never drift apart.
import { BRAND, PRODUCTS, CATEGORIES, ADVANTAGES, INDUSTRIES, FAQS } from '../src/data.js'

const CATALOG = '/golden-machinery-catalogue.pdf'
const TITLE = 'Golden Machinery | V-Belt Pulley, Crown Patta Pulley & Coupling Manufacturer in Agra'
const DESCRIPTION =
  'Golden Machinery, Agra: 60+ years manufacturing V-belt pulleys, step, split & bearing pulleys, crown patta pulleys, elevator pulleys, couplings and block bearings for Indian industry.'
const KEYWORDS = [
  'pulley manufacturer in Agra',
  'V-belt pulley manufacturer',
  'crown patta pulley',
  'split pulley',
  'step pulley',
  'elevator pulley',
  'block bearing',
  'couplings',
  'power transmission products India',
  'Golden Machinery',
]

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const catLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label
const tel = (p) => p.replace(/\s/g, '')

function urls(siteUrl) {
  const base = siteUrl ? siteUrl.replace(/\/$/, '') : ''
  return { base, abs: (path) => (base ? base + path : path) }
}

function structuredData(siteUrl) {
  const { base, abs } = urls(siteUrl)
  const orgId = abs('/#organization')
  const address = (u) => ({
    '@type': 'PostalAddress',
    streetAddress: u.lines[0],
    addressLocality: 'Agra',
    addressRegion: 'Uttar Pradesh',
    postalCode: '282004',
    addressCountry: 'IN',
  })

  const organization = {
    '@type': 'Organization',
    '@id': orgId,
    name: BRAND.name,
    url: base || undefined,
    logo: abs('/brand/logo.png'),
    image: abs('/brand/og-image.png'),
    slogan: BRAND.tagline,
    description: DESCRIPTION,
    email: BRAND.email,
    telephone: tel(BRAND.phones[1]),
    areaServed: { '@type': 'Country', name: 'India' },
    knowsAbout: ['Pulleys', 'V-belt pulleys', 'Flat belt pulleys', 'Couplings', 'Block bearings', 'Mechanical power transmission'],
    contactPoint: BRAND.phones.map((p) => ({
      '@type': 'ContactPoint',
      telephone: tel(p),
      contactType: 'sales',
      areaServed: 'IN',
      availableLanguage: ['en', 'hi'],
    })),
    address: address(BRAND.units[0]),
    location: BRAND.units.map((u) => ({
      '@type': 'Place',
      name: `${BRAND.name} ${u.label}`,
      address: address(u),
    })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Golden Machinery product range',
      itemListElement: PRODUCTS.map((p) => ({
        '@type': 'Offer',
        itemOffered: { '@id': abs(`/#product-${p.id}`) },
      })),
    },
  }

  const localBusinesses = BRAND.units.map((u, i) => ({
    '@type': 'LocalBusiness',
    '@id': abs(`/#unit-${i + 1}`),
    name: `${BRAND.name} – ${u.label}`,
    parentOrganization: { '@id': orgId },
    image: abs('/brand/og-image.png'),
    telephone: tel(BRAND.phones[i] || BRAND.phones[0]),
    email: BRAND.email,
    address: address(u),
    url: base || undefined,
  }))

  const products = PRODUCTS.map((p) => ({
    '@type': 'Product',
    '@id': abs(`/#product-${p.id}`),
    name: p.name,
    description: p.summary,
    image: abs(p.image),
    category: catLabel(p.category),
    brand: { '@type': 'Brand', name: BRAND.name },
    manufacturer: { '@id': orgId },
    additionalProperty: p.features.map((f) => ({ '@type': 'PropertyValue', name: 'Feature', value: f })),
  }))

  const itemList = {
    '@type': 'ItemList',
    name: 'Golden Machinery products',
    numberOfItems: PRODUCTS.length,
    itemListElement: PRODUCTS.map((p, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@id': abs(`/#product-${p.id}`) } })),
  }

  const faq = {
    '@type': 'FAQPage',
    '@id': abs('/#faq'),
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  const website = {
    '@type': 'WebSite',
    '@id': abs('/#website'),
    name: BRAND.name,
    url: base || undefined,
    inLanguage: 'en-IN',
    publisher: { '@id': orgId },
  }

  const webpage = {
    '@type': 'WebPage',
    '@id': abs('/#webpage'),
    url: base || undefined,
    name: TITLE,
    description: DESCRIPTION,
    isPartOf: { '@id': abs('/#website') },
    about: { '@id': orgId },
    primaryImageOfPage: abs('/brand/og-image.png'),
    inLanguage: 'en-IN',
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [organization, ...localBusinesses, website, webpage, itemList, ...products, faq],
  }
}

function headTags(siteUrl) {
  const { base, abs } = urls(siteUrl)
  const og = abs('/brand/og-image.png')
  const tags = [
    `<meta name="description" content="${esc(DESCRIPTION)}" />`,
    `<meta name="keywords" content="${esc(KEYWORDS.join(', '))}" />`,
    `<meta name="author" content="${esc(BRAND.name)}" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`,
    `<meta name="geo.region" content="IN-UP" />`,
    `<meta name="geo.placename" content="Agra" />`,
    base && `<link rel="canonical" href="${base}/" />`,
    `<link rel="alternate" type="text/plain" title="LLM summary" href="/llms.txt" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(BRAND.name)}" />`,
    `<meta property="og:locale" content="en_IN" />`,
    `<meta property="og:title" content="${esc(TITLE)}" />`,
    `<meta property="og:description" content="${esc(DESCRIPTION)}" />`,
    base && `<meta property="og:url" content="${base}/" />`,
    `<meta property="og:image" content="${og}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="Golden Machinery pulleys and the tagline Machinery works on our hand" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(TITLE)}" />`,
    `<meta name="twitter:description" content="${esc(DESCRIPTION)}" />`,
    `<meta name="twitter:image" content="${og}" />`,
    `<script type="application/ld+json">${JSON.stringify(structuredData(siteUrl)).replace(/</g, '\\u003c')}</script>`,
  ]
  return tags.filter(Boolean).join('\n    ')
}

// Plain semantic HTML of the whole page. Non-JS crawlers (most AI bots) read
// this; React replaces it on mount with the same content, fully styled.
function staticBody() {
  const p = (t) => `<p>${esc(t)}</p>`
  return `
      <div class="seo-static">
        <header>
          <a href="/">${esc(BRAND.name)}</a>
          <nav aria-label="Primary">
            <a href="#about">About</a> <a href="#products">Products</a> <a href="#engineering">Engineering</a>
            <a href="#industries">Industries</a> <a href="#faq">FAQ</a> <a href="#contact">Contact</a>
          </nav>
        </header>
        <main>
          <section id="top">
            <h1>${esc(BRAND.name)}: ${esc(BRAND.tagline)}</h1>
            ${p("Precision-cast pulleys, couplings and block bearings, balanced and machined to keep India's industry turning. Over six decades of power transmission manufacturing in Agra, Uttar Pradesh.")}
          </section>
          <section id="about">
            <h2>About Golden Machinery</h2>
            ${p('Golden Machinery is a trusted manufacturer of mechanical power transmission products with over 60 years of excellence: precision-crafted pulleys, couplings and block bearings, including Patta Pulleys, Solid V-belt Pulleys, Poly-V Pulleys and Couplings.')}
            ${p('Customer satisfaction is our paramount goal. We offer world-class products at competitive prices and build lasting relationships with every customer.')}
            <h3>Vision</h3>
            ${p('To emerge as the foremost and most distinguished manufacturer of Pulleys and Couplings in India, setting benchmarks in both quality and quantity.')}
            <h3>Mission</h3>
            ${p('On-time delivery of defect-free products, minimal wastage through sustainable practice, and cost efficiency through continuous value engineering.')}
          </section>
          <section id="products">
            <h2>Products</h2>
            ${PRODUCTS.map(
              (pr) => `<article id="product-${pr.id}">
              <h3>${esc(pr.name)}</h3>
              <img src="${pr.image}" alt="${esc(pr.name)} by Golden Machinery" width="300" height="300" loading="lazy" />
              <p><strong>Category:</strong> ${esc(catLabel(pr.category))}</p>
              ${p(pr.summary)}
              <ul>${pr.features.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
              <p><strong>Typical use:</strong> ${esc(pr.uses.join(', '))}</p>
            </article>`,
            ).join('\n            ')}
          </section>
          <section id="advantages">
            <h2>The Golden advantage</h2>
            <ul>${ADVANTAGES.map((a) => `<li><strong>${esc(a.title)}:</strong> ${esc(a.body)}</li>`).join('')}</ul>
          </section>
          <section id="industries">
            <h2>Industries we serve</h2>
            <ul>${INDUSTRIES.map((i) => `<li>${esc(i.name)}</li>`).join('')}</ul>
          </section>
          <section id="faq">
            <h2>Frequently asked questions</h2>
            ${FAQS.map((f) => `<h3>${esc(f.q)}</h3>${p(f.a)}`).join('\n            ')}
          </section>
          <section id="contact">
            <h2>Contact Golden Machinery</h2>
            ${BRAND.units
              .map((u) => `<address><strong>${esc(u.label)}:</strong> ${u.lines.map(esc).join(', ')}</address>`)
              .join('\n            ')}
            <p>Phone: ${BRAND.phones.map((ph) => `<a href="tel:${tel(ph)}">${esc(ph)}</a>`).join(', ')}</p>
            <p>Email: <a href="mailto:${BRAND.email}">${esc(BRAND.email)}</a></p>
          </section>
        </main>
      </div>`
}

function llmsTxt(siteUrl, full) {
  const { abs } = urls(siteUrl)
  const lines = [
    `# ${BRAND.name}`,
    '',
    `> ${BRAND.name} is a manufacturer of mechanical power transmission products based in Agra, Uttar Pradesh, India, with over six decades (60+ years) of experience. It makes V-belt pulleys, crown patta (flat belt) pulleys, elevator pulleys, couplings and block bearings. Tagline: "${BRAND.tagline}"`,
    '',
    '## Key facts',
    '',
    `- Name: ${BRAND.name}`,
    '- Business: Manufacturer of pulleys, couplings and block bearings',
    '- Experience: 60+ years',
    ...BRAND.units.map((u) => `- ${u.label}: ${u.lines.join(', ')}`),
    `- Phone / WhatsApp: ${BRAND.phones.join(', ')}`,
    `- Email: ${BRAND.email}`,
    `- Website: ${abs('/')}`,
    `- Product catalogue (PDF, available after a short enquiry form): ${abs('/#contact')}`,
    '',
    '## Products',
    '',
    ...PRODUCTS.map((p) => `- **${p.name}** (${catLabel(p.category)}): ${p.summary}${full ? ` Features: ${p.features.join('; ')}. Typical use: ${p.uses.join(', ')}.` : ''}`),
    '',
    '## Industries served',
    '',
    ...INDUSTRIES.map((i) => `- ${i.name}`),
    '',
  ]
  if (full) {
    lines.push('## Why Golden pulleys', '', ...ADVANTAGES.map((a) => `- **${a.title}:** ${a.body}`), '')
  }
  lines.push('## FAQ', '', ...FAQS.flatMap((f) => [`### ${f.q}`, '', f.a, '']))
  if (!full) lines.push('## Optional', '', `- [Full details](${abs('/llms-full.txt')}): products with features and uses, advantages, FAQ`, '')
  return lines.join('\n')
}

// Welcome search engines and AI crawlers explicitly.
function robotsTxt(siteUrl) {
  const { base } = urls(siteUrl)
  const bots = [
    'Googlebot', 'Bingbot', 'Google-Extended', 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
    'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'anthropic-ai', 'PerplexityBot', 'Perplexity-User',
    'Applebot', 'Applebot-Extended', 'CCBot', 'Meta-ExternalAgent', 'Bytespider', 'DuckDuckBot', 'YandexBot',
  ]
  return [
    '# Golden Machinery welcomes search engines and AI assistants.',
    // the catalogue PDF stays behind the enquiry form, so keep it out of indexes
    ...bots.flatMap((b) => [`User-agent: ${b}`, 'Allow: /', `Disallow: ${CATALOG}`, '']),
    'User-agent: *',
    'Allow: /',
    `Disallow: ${CATALOG}`,
    '',
    base ? `Sitemap: ${base}/sitemap.xml` : '# Set SITE_URL at build time to publish the sitemap location.',
    '',
  ].join('\n')
}

function sitemapXml(siteUrl) {
  const { base } = urls(siteUrl)
  const today = new Date().toISOString().slice(0, 10)
  const images = [...PRODUCTS.map((p) => [p.image, p.name]), ['/brand/og-image.png', BRAND.name]]
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${base}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
${images.map(([src, title]) => `    <image:image><image:loc>${base}${src}</image:loc><image:title>${esc(title)}</image:title></image:image>`).join('\n')}
  </url>
</urlset>
`
}

export default function seoPlugin({ siteUrl } = {}) {
  const files = () => ({
    'robots.txt': robotsTxt(siteUrl),
    'llms.txt': llmsTxt(siteUrl, false),
    'llms-full.txt': llmsTxt(siteUrl, true),
    ...(siteUrl ? { 'sitemap.xml': sitemapXml(siteUrl) } : {}),
  })
  return {
    name: 'golden-seo',
    configResolved(config) {
      if (!siteUrl && config.command === 'build')
        config.logger.warn('\n[seo] SITE_URL is not set: canonical/og:url and sitemap.xml are skipped. Build with SITE_URL=https://your-domain\n')
    },
    transformIndexHtml(html) {
      return html
        .replace('<!--seo:head-->', headTags(siteUrl))
        .replace('<div id="root"></div>', `<div id="root">${staticBody()}\n    </div>`)
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const name = req.url?.replace(/^\//, '')
        const body = files()[name]
        if (!body) return next()
        res.setHeader('Content-Type', name.endsWith('.xml') ? 'application/xml' : 'text/plain; charset=utf-8')
        res.end(body)
      })
    },
    generateBundle() {
      for (const [fileName, source] of Object.entries(files())) this.emitFile({ type: 'asset', fileName, source })
    },
  }
}
