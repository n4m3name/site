import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeShiki from '@shikijs/rehype'

export default defineConfig({
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkMath],
        rehypePlugins: [
          [rehypeShiki, { theme: 'vitesse-black' }],
          rehypeKatex,
        ],
      }),
    },
    react(),
    tailwindcss(),
  ],
})
