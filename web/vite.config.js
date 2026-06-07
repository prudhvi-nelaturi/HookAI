import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Reads a request body and parses it as JSON.
const readJson = (req) =>
  new Promise((resolve) => {
    let raw = ''
    req.on('data', (chunk) => (raw += chunk))
    req.on('end', () => {
      try { resolve(raw ? JSON.parse(raw) : {}) } catch { resolve({}) }
    })
  })

const sendJson = (res, status, data) => {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(data))
}

// Server-side API proxy. Keys live in env (no VITE_ prefix) so they
// are never shipped to the browser bundle.
function apiProxy(env) {
  const GROQ_KEY = env.GROQ_API_KEY
  const PEXELS_KEY = env.PEXELS_API_KEY
  const ELEVENLABS_KEY = env.ELEVENLABS_API_KEY

  return {
    name: 'hookai-api-proxy',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || ''

        // --- Groq chat completions ---
        if (url.startsWith('/api/groq') && req.method === 'POST') {
          try {
            const body = await readJson(req)
            const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${GROQ_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(body),
            })
            return sendJson(res, r.status, await r.json())
          } catch (e) {
            return sendJson(res, 500, { error: e.message })
          }
        }

        // --- Pexels video search ---
        if (url.startsWith('/api/pexels') && req.method === 'GET') {
          try {
            const qs = url.split('?')[1] || ''
            const r = await fetch(`https://api.pexels.com/videos/search?${qs}`, {
              headers: { Authorization: PEXELS_KEY },
            })
            return sendJson(res, r.status, await r.json())
          } catch (e) {
            return sendJson(res, 500, { error: e.message })
          }
        }

        // --- ElevenLabs text-to-speech (returns audio) ---
        if (url.startsWith('/api/elevenlabs') && req.method === 'POST') {
          try {
            const { text, voiceId } = await readJson(req)
            const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
              method: 'POST',
              headers: {
                'xi-api-key': ELEVENLABS_KEY,
                'Content-Type': 'application/json',
                Accept: 'audio/mpeg',
              },
              body: JSON.stringify({
                text,
                model_id: 'eleven_multilingual_v2',
                voice_settings: { stability: 0.5, similarity_boost: 0.75 },
              }),
            })
            if (!r.ok) return sendJson(res, r.status, { error: 'tts failed' })
            const buf = Buffer.from(await r.arrayBuffer())
            res.statusCode = 200
            res.setHeader('Content-Type', 'audio/mpeg')
            return res.end(buf)
          } catch (e) {
            return sendJson(res, 500, { error: e.message })
          }
        }

        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // load ALL env vars (including non-VITE_ prefixed, server-only keys)
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), apiProxy(env)],
    server: { host: true },
  }
})
