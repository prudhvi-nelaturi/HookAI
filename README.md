# HookAI ⚡

> Your daily viral faceless content engine for YouTube Shorts & Instagram Reels.

HookAI turns a single click into a complete, production-ready short — idea, script, AI voiceover, and stock footage — without leaving the app. No camera. No editing skills. No staring at a blank screen wondering what to post.

---

## ✨ What it does

| Step | What you get |
|---|---|
| 💡 **Ideas** | 5 fresh viral faceless video ideas, deduped against what you've already made |
| 📝 **Script** | Full timestamped script — hook, voiceover, visuals, music vibe, caption, hashtags, thumbnail concepts |
| 🎙️ **Voiceover** | Pick a voice, generate narration, play & download the MP3 (ElevenLabs) |
| 🎥 **Footage** | Inline stock video search with direct downloads (Pexels) |
| 📋 **Export** | One-click copy of the full formatted script for CapCut |
| ✅ **Posted** | Track which ideas you've actually published |

---

## 🛠️ Stack

- **Frontend:** React + Vite + Tailwind CSS
- **AI:** Groq (`llama-3.3-70b-versatile`) for ideas & scripts
- **Voiceover:** ElevenLabs Text-to-Speech
- **Footage:** Pexels video API
- **API proxy:** Vite dev-server middleware (keeps all keys server-side)
- **Storage:** Browser localStorage

---

## 🚀 Getting started

```bash
cd web
npm install
npm run dev
```

The app runs at `http://localhost:5173` (also exposed on your local network for phone testing).

### Environment

Create `web/.env` with your own keys (all free tiers):

```env
GROQ_API_KEY=your_groq_key
PEXELS_API_KEY=your_pexels_key
ELEVENLABS_API_KEY=your_elevenlabs_key
```

Get keys here:
- [Groq](https://console.groq.com) — free, generous limits
- [Pexels](https://www.pexels.com/api/) — free, 200 req/hr
- [ElevenLabs](https://elevenlabs.io) — free, 10,000 credits/mo (~10 min of audio)

> 🔒 **Keys are never shipped to the browser.** They use no `VITE_` prefix and are injected server-side by the Vite proxy (`vite.config.js`). The frontend only ever calls `/api/groq`, `/api/pexels`, and `/api/elevenlabs`.

---

## 📁 Structure

```
HookAI/
├── web/                  # The live web app
│   ├── src/
│   │   ├── pages/        # Ideas, Script, Posted
│   │   └── services/     # groq / pexels / elevenlabs (keyless API calls)
│   └── vite.config.js    # Server-side API proxy
└── mobile/               # React Native (Expo) — parked for future
```

---

## 🗺️ Roadmap

See [TODO.md](TODO.md) for the full roadmap and [HOOKAI.md](HOOKAI.md) for architecture details.

Phases 1–3 (MVP, in-app production tools, key security) are **done**. Next up: polish, public deploy via serverless functions, and growth features.

---

## 📄 License

See [LICENSE](LICENSE). Personal project — not affiliated with Groq, Pexels, ElevenLabs, Instagram, or YouTube.
