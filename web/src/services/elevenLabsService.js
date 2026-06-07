import axios from 'axios';

const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;

// A few solid default voices for faceless narration
export const VOICES = [
  { id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Roger — Casual male' },
  { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam — Deep male' },
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel — Calm female' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella — Soft female' },
  { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh — Energetic male' },
];

export async function generateVoiceover(text, voiceId) {
  const { data } = await axios.post(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    },
    {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      responseType: 'blob',
    }
  );
  return URL.createObjectURL(data);
}
