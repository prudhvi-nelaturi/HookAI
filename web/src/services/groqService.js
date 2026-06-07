import axios from 'axios';

// Keys are injected server-side by the Vite proxy (see vite.config.js).
const ask = async (prompt) => {
  const response = await axios.post('/api/groq', {
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.9,
  });
  return response.data.choices[0].message.content;
};

export const generateIdeas = async (excludeTitles = []) => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const excludeBlock = excludeTitles.length > 0
    ? `\n\nDo NOT generate ideas with these titles or similar topics (already generated):\n${excludeTitles.map(t => `- ${t}`).join('\n')}`
    : '';

  const prompt = `Today is ${today}. Generate 5 fresh viral faceless video ideas for YouTube Shorts and Instagram Reels.

These videos use the TEXT-DRIVEN format: a voiceover reads a gripping story/script, bold animated captions appear on screen, all over a reusable engaging background (satisfying loops or gameplay). The visuals do NOT need to match the topic — so the IDEA must win purely as a spoken story.

Requirements:
- Mass appeal — any age, gender, country can watch and enjoy
- The HOOK (first line) must be so curiosity-triggering or shocking that nobody can scroll past it
- The idea must work as a SPOKEN STORY that keeps people listening to the very end (strong narrative payoff, "wait for it", or a list that builds)
- Every idea must be based on TRUE, real facts/events — no fabricated or sci-fi claims
- Topics: wild true stories, shocking facts, unsolved mysteries, "things you didn't know", psychology tricks, history's craziest moments, scary real events, "what would happen if"
- Avoid generic self-help, motivation, or fitness content
- Make titles feel urgent and specific, not vague${excludeBlock}

Return ONLY a valid JSON array, no explanation, no markdown:
[
  {
    "title": "video title",
    "hook": "the exact first 3 seconds hook line",
    "format": "Compilation | Facts | Story",
    "duration": "30s | 60s | 90s"
  }
]`;

  try {
    const text = await ask(prompt);
    const json = text.match(/\[[\s\S]*\]/)?.[0];
    return JSON.parse(json);
  } catch (e) {
    console.error('Groq API error status:', e?.response?.status);
    console.error('Groq API error data:', JSON.stringify(e?.response?.data));
    console.error('Groq API error message:', e.message);
    throw e;
  }
};

export const generateScript = async (idea) => {
  const prompt = `You are a viral faceless content scriptwriter for the TEXT-DRIVEN format: a voiceover reads the script, bold animated captions appear on screen word-by-word, all over a reusable engaging background (satisfying loop or gameplay). The visuals do NOT need to match the topic — the script and hook carry everything.

Title: ${idea.title}
Hook: ${idea.hook}
Format: ${idea.format}
Duration: ${idea.duration}

CRITICAL RULES:
1. ACCURACY: Every fact/claim must be TRUE and verifiable. No fabricated or sci-fi claims.
2. CAPTION-FRIENDLY: Write the script in SHORT, punchy sentences (5-12 words each). Each sentence should land as one on-screen caption. No long run-on sentences.
3. RETENTION: Open with the exact hook. Build curiosity so viewers stay to the end. End on a satisfying payoff or a question that drives comments.
4. SPOKEN: Write how people TALK, not how they write. Conversational, energetic.

Return ONLY a valid JSON object, no explanation, no markdown:
{
  "hook": "exact words for the first 3 seconds — must stop the scroll, but TRUE",
  "script": "the full voiceover script as short punchy sentences separated by newlines (each line = one caption). Include the hook as the first line.",
  "backgrounds": [
    "suggested background vibe 1 (e.g. 'Minecraft parkour gameplay')",
    "suggested background vibe 2 (e.g. 'satisfying soap cutting')",
    "suggested background vibe 3 (e.g. 'kinetic sand cutting')"
  ],
  "bgSearch": "a simple Pexels search term for a satisfying/abstract background loop (e.g. 'satisfying', 'ink water', 'fluid art')",
  "music": "music vibe and energy description",
  "caption": "Instagram/YouTube caption optimized for engagement",
  "hashtags": "10-15 relevant hashtags",
  "resources": [
    {
      "site": "site name e.g. Pexels, Pixabay, YouTube (no-copyright gameplay), Mixkit",
      "url": "direct search URL",
      "tip": "exactly what to look for on this site for the background or assets"
    }
  ],
  "thumbnails": [
    "thumbnail concept 1 — describe the image, text overlay, and color scheme",
    "thumbnail concept 2",
    "thumbnail concept 3"
  ]
}`;
  const text = await ask(prompt);
  const json = text.match(/\{[\s\S]*\}/)?.[0];
  return JSON.parse(json);
};
