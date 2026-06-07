# HookAI

A personal AI-powered faceless content engine that generates viral video ideas, full scripts, AI voiceovers, and stock footage for YouTube Shorts and Instagram Reels — no camera, no editing skills required.

> **Status (2026-06-06):** Web app MVP is live and working end-to-end. Ideas → script → AI voiceover → stock footage → CapCut export → posted tracking, all inside the app.

---

## Why This Exists

Content creation is hard not because of recording or editing — it's hard because of:
- Not knowing what to post
- Not knowing how to hook viewers in the first 3 seconds
- Losing consistency because ideation is exhausting

HookAI removes all three blockers. Open the app, get today's ideas, pick one, get a full production-ready script with voiceover and footage, post.

---

## Target Platforms

- YouTube Shorts (primary — fastest monetization path)
- Instagram Reels (cross-post same video)

---

## Content Philosophy — Text-Driven Format

HookAI produces **text-driven** faceless videos: a voiceover reads a gripping script, **bold animated captions** appear on screen, all over a **reusable engaging background** (satisfying loops or no-copyright gameplay).

Why this format: free stock footage can't compellingly visualize arbitrary topics — and for faceless content the visuals are what hold viewers. Decoupling visuals from topic means:
- The **hook + story + captions** carry the video (where the value actually is)
- Any topic works — no footage-availability constraint
- The same backgrounds are **reused across every video** → brutally consistent output

Principles:
- **Faceless** — no camera, voiceover + captions only
- **Mass appeal** — any age, gender, country
- **Hook-first** — the first line must stop the scroll
- **Retention-built** — short punchy lines, curiosity that pays off
- **Factually accurate** — true stories/facts only, no fabricated claims
- **Theme:** Instagram-inspired purple-pink (`#C13584` / `#833AB4` / `#E1306C`)

---

## The In-App Production Loop

1. 💡 **Ideas** — AI generates gripping, true, spoken-story ideas (dedupes against past ideas, injects today's date)
2. 📝 **Script** — caption-friendly script (one punchy line per on-screen caption) + hook, music vibe, caption, hashtags, thumbnails
3. 🎙️ **AI Voiceover** — pick a voice, generate narration, play and download MP3 (ElevenLabs)
4. 🎮 **Background** — pick ONE engaging loop: AI suggestions + satisfying-loop presets (Pexels) + no-copyright gameplay links (YouTube)
5. 📋 **CapCut export** — one-click copy of the full formatted script
6. 🔗 **Resources** — AI-suggested media sources + always-useful tools
7. ✅ **Posted** — mark and track which ideas you actually published

---

## Architecture

```
HookAI/
├── web/                         # Live web app (Vite + React + Tailwind)
│   ├── src/
│   │   ├── App.jsx              # Tab nav: Ideas / Script / Posted
│   │   ├── pages/
│   │   │   ├── HomePage.jsx     # Idea generation + pool (localStorage)
│   │   │   ├── ScriptPage.jsx   # Script + Voiceover + Pexels + CapCut + resources
│   │   │   └── PostedPage.jsx   # Posted video tracker
│   │   └── services/
│   │       ├── groqService.js   # AI ideas + scripts (calls /api/groq)
│   │       ├── pexelsService.js # Stock video search (calls /api/pexels)
│   │       └── elevenLabsService.js # AI voiceover (calls /api/elevenlabs)
│   ├── vite.config.js          # Server-side API proxy — injects keys, hides them from bundle
│   └── .env                    # Server-only keys (gitignored, no VITE_ prefix)
│
└── mobile/                      # React Native (Expo) — parked for future, not active
```

### Key security design
API keys (Groq, Pexels, ElevenLabs) live in `.env` **without** the `VITE_` prefix, so they are never bundled into the browser. The Vite dev server (`vite.config.js`) runs a server-side proxy that injects the keys into outgoing requests. The frontend only ever calls `/api/groq`, `/api/pexels`, `/api/elevenlabs` — no keys reach the client. Verified: a production build contains none of the keys.

> **Deploy note:** The proxy currently lives in the Vite dev server. When deploying to a public URL, replicate these three endpoints as serverless functions (Vercel/Netlify `/api`) or a small Node server, reading the same env vars. The frontend code does not change.

---

## Stack

| Layer | Technology |
|---|---|
| Web App | React + Vite + Tailwind CSS v3 |
| AI Engine | Groq API (`llama-3.3-70b-versatile`) — free |
| Voiceover | ElevenLabs API (free tier, 10k credits/mo) |
| Stock footage | Pexels API (free, 200 req/hr) |
| API proxy | Vite dev-server middleware (keys server-side) |
| Storage | Browser localStorage (idea pool, posted videos) |
| Mobile (parked) | React Native (Expo Go) |
| Backend (future) | Serverless functions for prod proxy + persistence |

---

## Running Locally

```bash
cd web
npm install
npm run dev          # http://localhost:5173 (also exposed on LAN for phone testing)
```

Requires `web/.env` with:
```
GROQ_API_KEY=...
PEXELS_API_KEY=...
ELEVENLABS_API_KEY=...
```

---

## Free-Tier Limits

| Service | Free limit |
|---|---|
| Groq | Generous rate limits, free |
| ElevenLabs | 10,000 credits/mo (~10 min audio, ~15 voiceovers) |
| Pexels | 200 requests/hour |

---

## Monetization Plan

- **Now:** Personal use only — build an audience on YouTube/Reels first
- **Later:** Open to creators if the audience validates the tool
- **Income routing:** Through India (family entity) to avoid OPT complications
- **Never block earnings** — if visa is an issue, route smartly, never stop
