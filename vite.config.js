import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { handleAuthRequest } from './netlify/functions/auth.js'
import { handleTuitionsRequest } from './netlify/functions/tuitions.js'
import { handleTeachersRequest } from './netlify/functions/teachers.js'

function localNetlifyFunctionsPlugin() {
  return {
    name: 'local-netlify-functions',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        try {
          const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
          const isApi = url.pathname.startsWith('/api/') || url.pathname.startsWith('/.netlify/functions/')
          if (!isApi) {
            return next()
          }

          let body = ''
          if (req.method !== 'GET' && req.method !== 'HEAD') {
            for await (const chunk of req) {
              body += chunk
            }
          }

          let result = null
          if (url.pathname.includes('/auth')) {
            result = await handleAuthRequest({
              method: req.method,
              path: url.pathname,
              headers: req.headers,
              body,
            })
          } else if (url.pathname.endsWith('/tuitions')) {
            result = await handleTuitionsRequest({
              method: req.method,
              headers: req.headers,
            })
          } else if (url.pathname.endsWith('/teachers')) {
            const queryStringParameters = Object.fromEntries(url.searchParams.entries())
            result = await handleTeachersRequest({
              method: req.method,
              queryStringParameters,
              headers: req.headers,
            })
          }

          if (result) {
            res.statusCode = result.statusCode
            if (result.headers) {
              for (const [key, val] of Object.entries(result.headers)) {
                res.setHeader(key, val)
              }
            }
            return res.end(result.body)
          }

          next()
        } catch (err) {
          console.error('Local API middleware error:', err)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Internal Server Error', details: err.message }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  Object.assign(process.env, env)

  return {
    plugins: [react(), tailwindcss(), localNetlifyFunctionsPlugin()],
  }
})
