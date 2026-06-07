import axios from 'axios';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const client = axios.create({
  baseURL: '/groq/openai/v1',
  headers: {
    Authorization: `Bearer ${GROQ_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

const ask = async (prompt) => {
  const response = await client.post('/chat/completions', {
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
  const prompt = `You are a viral faceless content scriptwriter. Write a complete production-ready script for this video:

Title: ${idea.title}
Hook: ${idea.hook}
Format: ${idea.format}
Duration: ${idea.duration}

Return ONLY a valid JSON object, no explanation, no markdown:
{
  "hook": "exact words for first 3 seconds — must be shocking or curiosity-triggering",
  "script": "full voiceover script with timestamps e.g. [0-3s], [3-15s]",
  "visuals": "shot-by-shot visual instructions as bullet points",
  "searchQuery": "2-3 word generic stock-footage search term for this topic (e.g. 'outer space', 'ocean waves') — simple keywords that will return results on Pexels, NOT the clickbait title",
  "music": "music vibe and energy description",
  "caption": "Instagram/YouTube caption optimized for engagement",
  "hashtags": "10-15 relevant hashtags",
  "resources": [
    {
      "site": "site name e.g. Pexels, Pixabay, NASA Image Library, YouTube, Freepik, Mixkit",
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
