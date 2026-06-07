# HookAI

A personal AI-powered faceless content engine that generates viral video ideas, full scripts, and production instructions for YouTube Shorts and Instagram Reels — no camera, no editing skills required.

---

## Why This Exists

Content creation is hard not because of recording or editing — it's hard because of:
- Not knowing what to post
- Not knowing how to hook viewers in the first 3 seconds
- Losing consistency because ideation is exhausting

HookAI removes all three blockers. Open the app, get today's ideas, pick one, get a full production-ready script, record, post.

---

## Target Platforms

- YouTube Shorts (primary — fastest monetization path)
- Instagram Reels (cross-post same video)

---

## Content Philosophy

- **Faceless** — no on-camera presence required
- **Mass appeal** — any age, gender, country
- **Hook-first** — first 3 seconds engineered to stop the scroll
- **MrBeast-inspired structure** — hook → escalation → payoff
- **Formats:** Compilations, Facts, Reddit Stories, Voiceover + Visuals

---

## Architecture

```
HookAI (React Native - Mobile)
    └── src/
        ├── screens/
        │   ├── HomeScreen.js       # Daily idea generation
        │   ├── ScriptScreen.js     # Full script view
        │   └── HistoryScreen.js    # Saved scripts (coming soon)
        ├── navigation/
        │   └── AppNavigator.js     # Bottom tab navigation
        ├── services/
        │   └── claudeService.js    # Claude API integration
        └── constants/
            └── colors.js           # Design tokens

HookAI Web (React + Tailwind - planned)
    └── Mirrors mobile features, accessible via phone browser
```

---

## Stack

| Layer | Technology |
|---|---|
| Mobile App | React Native (Expo Go) |
| Web App | React + Tailwind CSS (planned) |
| AI Engine | Claude API (claude-haiku) |
| Backend | Spring Boot (planned — for history, auth, saved scripts) |
| Database | PostgreSQL (planned) |
| Hosting | Railway / Render free tier |

---

## Features

### MVP (Phase 1)
- [x] Project scaffold (React Native + Expo)
- [ ] Daily idea generation (5 ideas/day via Claude API)
- [ ] Full script generation per idea (hook, script, visuals, music, caption, hashtags)
- [ ] Dark mode UI with clean design
- [ ] Web app version (React + Tailwind)

### Phase 2
- [ ] Claude API integration (replace mock data)
- [ ] Save/bookmark scripts
- [ ] History screen (view past scripts)
- [ ] Copy to clipboard per section

### Phase 3
- [ ] Backend (Spring Boot) for persistent storage
- [ ] User accounts
- [ ] Push notifications ("Your daily ideas are ready")
- [ ] Analytics (track which ideas you used, post performance)

### Phase 4 (if monetized)
- [ ] Open to other creators ($9–19/month)
- [ ] Custom niche settings
- [ ] Trend detection (pull from trending topics)

---

## Monetization Plan

- **Phase 1–2:** Personal use only — build audience on YouTube/Reels
- **Phase 3+:** Open to creators if audience validates the tool
- **Income routing:** Through India (family entity) to avoid OPT complications
- **Never block earnings** — if visa is an issue, route smartly, never stop

---

## Cost Structure

| Item | Cost |
|---|---|
| Claude API (Haiku) | ~$2–5/month |
| Backend hosting | $0 (Railway/Render free tier) |
| Domain (future) | ~$12/year |
| **Total** | **~$2–5/month** |
