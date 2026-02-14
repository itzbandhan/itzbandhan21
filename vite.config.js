import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Custom plugin to generate sitemap.xml at build time
const sitemapPlugin = () => {
  return {
    name: 'generate-sitemap',
    closeBundle: async () => {
      const baseUrl = 'https://itzbandhan.tech'
      const routes = [
        { path: '/', priority: '1.0', changefreq: 'weekly' },
        { path: '/#about', priority: '0.8', changefreq: 'monthly' },
        { path: '/#skills', priority: '0.8', changefreq: 'monthly' },
        { path: '/#projects', priority: '0.9', changefreq: 'weekly' },
        { path: '/#contact', priority: '0.7', changefreq: 'monthly' },
      ]

      const today = new Date().toISOString().split('T')[0]
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`

      const distDir = path.resolve(__dirname, 'dist')
      if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir)
      }
      fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap)
      console.log('\x1b[32m%s\x1b[0m', '✓ Sitemap generated successfully in dist/sitemap.xml')
    }
  }
}

export default defineConfig({
  plugins: [react(), sitemapPlugin()],
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
