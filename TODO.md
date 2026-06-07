# HookAI — Roadmap & TODO

_Last updated: 2026-06-06_

---

## Phase 1 — MVP (Web App) ✅ DONE

### Setup
- [x] React Native project scaffolded (Expo Go) — parked for future
- [x] React web app created (Vite + Tailwind)
- [x] Git repo initialized and pushed to GitHub

### UI — Web App
- [x] Ideas tab — idea cards with generate button
- [x] Script tab — full production breakdown per idea
- [x] Posted tab — track published videos
- [x] Dark theme, mobile-responsive
- [x] Instagram purple-pink theme + gradient logo
- [x] Top tab navigation

### AI Integration
- [x] Groq API wired up (`llama-3.3-70b-versatile`, free)
- [x] Real idea generation — dedupes past ideas, injects today's date
- [x] Real script generation — hook, script, visuals, music, caption, hashtags, thumbnails
- [x] Copy individual sections to clipboard
- [x] Generate 5 more ideas without losing existing pool

---

## Phase 2 — In-App Production Tools ✅ DONE

- [x] CapCut export — one-click copy of full formatted script
- [x] Thumbnail ideas (3 AI concepts per video)
- [x] AI-generated topic-specific resource links + static tools
- [x] **Pexels inline stock video search** — auto-filled clean query, grid, direct download
- [x] **ElevenLabs in-app voiceover** — voice picker, generate, play, download MP3
- [x] Post tracker — mark ideas as posted (localStorage)

---

## Phase 3 — Security & Hardening ✅ DONE

- [x] Move all API keys server-side (no `VITE_` prefix, never bundled)
- [x] Vite server-side proxy for Groq / Pexels / ElevenLabs
- [x] Verified production build contains zero keys

---

## Phase 4 — Polish 📌 Planned

- [ ] Loading skeletons instead of spinners
- [ ] Regenerate a single idea without refreshing all
- [ ] Edit script text before generating voiceover
- [ ] Save favorite voiceovers / scripts beyond localStorage
- [ ] Show ElevenLabs credit balance in-app

---

## Phase 5 — Deploy & Persistence 🔧 Planned

- [ ] Replicate the 3 proxy endpoints as serverless functions (Vercel/Netlify) for public deploy
- [ ] Deploy web app to a public URL
- [ ] Optional backend (Spring Boot / serverless) for cross-device persistence
- [ ] PostgreSQL schema (ideas, scripts, posted) if going multi-device

---

## Phase 6 — Growth Features 🚀 Planned

- [ ] Trend detection — pull today's trending topics as input
- [ ] Niche filter — facts, horror, history, science, etc.
- [ ] Performance tracker — manually log views/likes per post
- [ ] Auto-detect best posting time per platform

---

## Phase 7 — Monetization (Post stable visa) 💰 Future

- [ ] Multi-user support
- [ ] Stripe payment integration
- [ ] Pricing: Free (3 ideas/day) vs Pro ($9/month, unlimited)
- [ ] Route income through India entity
- [ ] Landing page

---

## Backlog / Ideas

- Push notification: "Your daily ideas are ready" (revive mobile app)
- AI-generated images for thumbnails (not just concepts)
- CapCut template recommendations per video format
- One-click "send script + footage links" bundle export
