import axios from 'axios';

const CLAUDE_API_KEY = 'YOUR_CLAUDE_API_KEY_HERE';
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

const client = axios.create({
  baseURL: CLAUDE_API_URL,
  headers: {
    'x-api-key': CLAUDE_API_KEY,
    'anthropic-version': '2023-06-01',
    'content-type': 'application/json',
  },
});

const ask = async (prompt) => {
  const response = await client.post('', {
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });
  return response.data.content[0].text;
};

export const generateIdeas = async () => {
  const prompt = `Generate 5 viral faceless video ideas for YouTube Shorts and Instagram Reels.
Requirements:
- Mass appeal (any age, any gender, any country)
- No camera needed — faceless format (voiceover + visuals)
- Hook must stop the scroll in first 3 seconds
- Short, punchy, curiosity-driven

Return ONLY a valid JSON array like this:
[
  {
    "title": "video title",
    "hook": "the first 3 seconds hook line",
    "format": "Compilation | Facts | Story | Challenge",
    "duration": "30s | 60s | 90s"
  }
]`;

  const text = await ask(prompt);
  const json = text.match(/\[[\s\S]*\]/)?.[0];
  return JSON.parse(json);
};

export const generateScript = async (idea) => {
  const prompt = `You are a viral content scriptwriter. Write a complete production-ready script for this faceless video:

Title: ${idea.title}
Hook: ${idea.hook}
Format: ${idea.format}
Duration: ${idea.duration}

Return ONLY a valid JSON object like this:
{
  "hook": "exact words for first 3 seconds — must be shocking or curiosity-triggering",
  "script": "full voiceover script, broken into short punchy sentences",
  "visuals": "describe exactly what should appear on screen, shot by shot",
  "music": "describe the music vibe and energy — e.g. 'upbeat electronic, builds tension'",
  "caption": "Instagram/YouTube caption optimized for engagement",
  "hashtags": "#tag1 #tag2 #tag3 (10-15 relevant hashtags)"
}`;

  const text = await ask(prompt);
  const json = text.match(/\{[\s\S]*\}/)?.[0];
  return JSON.parse(json);
};
