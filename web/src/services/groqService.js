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

export const generateIdeas = async () => {
  const prompt = `Generate 5 viral faceless video ideas for YouTube Shorts and Instagram Reels.
Requirements:
- Mass appeal (any age, gender, country)
- Faceless format — voiceover + visuals only, no camera needed
- Hook must stop the scroll in the first 3 seconds
- Short, punchy, high curiosity gap

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
  "music": "music vibe and energy description",
  "caption": "Instagram/YouTube caption optimized for engagement",
  "hashtags": "10-15 relevant hashtags"
}`;
  const text = await ask(prompt);
  const json = text.match(/\{[\s\S]*\}/)?.[0];
  return JSON.parse(json);
};
