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

Requirements:
- Mass appeal — any age, gender, country can watch and enjoy
- Faceless format — voiceover + visuals only, no camera or face needed
- Hook must stop the scroll in the first 3 seconds — shocking, curiosity-triggering, or unbelievable
- Topics: mysteries, wild facts, untold stories, mind-blowing science, bizarre history, satisfying compilations
- Avoid generic self-help, motivation, or fitness content
- Make titles feel urgent and specific, not vague
- IMPORTANT: every idea must be based on TRUE, real facts/events (no fabricated or sci-fi claims), AND must be visualizable with real stock footage (nature, animals, space, cities, people, objects, weather) — avoid topics that can only be shown with footage that doesn't exist${excludeBlock}

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
  const prompt = `You are a viral faceless content scriptwriter. Write a complete, production-ready script for this video.

Title: ${idea.title}
Hook: ${idea.hook}
Format: ${idea.format}
Duration: ${idea.duration}

CRITICAL RULES — follow these exactly:
1. ACCURACY: Every fact and claim must be TRUE and verifiable. Do NOT invent fake experiments, fake studies, fake events, or sci-fi claims (e.g. "wormhole in a lab", "artificial black holes"). If you are not sure something is real, do not say it.
2. FOOTAGE-FRIENDLY VISUALS: Every visual must be something that ABUNDANT free stock footage already exists for on Pexels — e.g. nature, oceans, animals, space/stars, cities, people, food, weather, technology, hands, everyday objects. NEVER describe a visual that real stock footage cannot show (no fictional or hyper-specific lab phenomena).
3. SEGMENTS: Break the video into 5-8 timed segments that cover the full duration. For EACH segment provide a simple 1-3 word stock search term that will return relevant, real Pexels clips for that exact moment.

Return ONLY a valid JSON object, no explanation, no markdown:
{
  "hook": "exact words for the first 3 seconds — shocking or curiosity-triggering, but TRUE",
  "segments": [
    {
      "time": "0-3s",
      "narration": "exact voiceover words for this segment",
      "visual": "concrete description of what is on screen (must be stock-footage-friendly)",
      "search": "simple 1-3 word Pexels search term for this segment's footage"
    }
  ],
  "music": "music vibe and energy description",
  "caption": "Instagram/YouTube caption optimized for engagement",
  "hashtags": "10-15 relevant hashtags",
  "resources": [
    {
      "site": "site name e.g. Pexels, Pixabay, NASA Image Library, Storyblocks, Mixkit",
      "url": "direct search URL for this topic",
      "tip": "exactly what to search or look for on this site for this specific video"
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
