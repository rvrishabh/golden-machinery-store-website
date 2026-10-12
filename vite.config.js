import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import seoPlugin from './seo/plugin.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Public site address, used for canonical URL, Open Graph and sitemap.xml.
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = process.env.SITE_URL || env.SITE_URL || ''
  return {
    plugins: [react(), seoPlugin({ siteUrl })],
  }
})
