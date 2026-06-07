import axios from 'axios';

// A few solid default voices for faceless narration
export const VOICES = [
  { id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Roger — Casual male' },
  { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam — Deep male' },
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel — Calm female' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella — Soft female' },
  { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh — Energetic male' },
];

// Keys are injected server-side by the Vite proxy (see vite.config.js).
export async function generateVoiceover(text, voiceId) {
  const { data } = await axios.post(
    '/api/elevenlabs',
    { text, voiceId },
    { responseType: 'blob' }
  );
  return URL.createObjectURL(data);
}
