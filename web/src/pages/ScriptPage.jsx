import { useState, useEffect } from 'react';
import { generateScript } from '../services/groqService';
import { searchVideos } from '../services/pexelsService';
import { generateVoiceover, VOICES } from '../services/elevenLabsService';

// Normalize hashtags from any AI format (#a#b, "a, b", "a b") into clean "#a #b #c".
function formatHashtags(raw) {
  return String(raw || '')
    .split(/[\s,#]+/)
    .filter(Boolean)
    .map((t) => `#${t}`)
    .join(' ');
}

// Preset reusable satisfying/abstract background loops that exist on Pexels.
const BG_PRESETS = ['satisfying', 'ink water', 'fluid art', 'kinetic sand', 'slime', 'lava lamp', 'particles', 'neon lights', 'aerial nature'];

function Voiceover({ script }) {
  const [voiceId, setVoiceId] = useState(VOICES[0].id);
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // strip timestamps like [0-3s] so they aren't read aloud
  const cleanText = (script || '').replace(/\[[^\]]*\]/g, '').replace(/\s+/g, ' ').trim();

  const run = async () => {
    setLoading(true);
    setError(false);
    setAudioUrl(null);
    try {
      setAudioUrl(await generateVoiceover(cleanText, voiceId));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4">
      <p className="text-xs font-bold text-insta mb-3">🎙️ AI VOICEOVER (ElevenLabs)</p>
      <div className="flex gap-2 mb-3">
        <select
          value={voiceId}
          onChange={(e) => setVoiceId(e.target.value)}
          className="flex-1 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-insta"
        >
          {VOICES.map((v) => (
            <option key={v.id} value={v.id}>{v.name}</option>
          ))}
        </select>
        <button
          onClick={run}
          disabled={loading || !cleanText}
          className="bg-insta hover:bg-insta-light disabled:opacity-50 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          {loading ? 'Generating...' : '🎙️ Generate'}
        </button>
      </div>

      {error && (
        <p className="text-red-400 text-xs text-center py-2">Couldn't generate — check your ElevenLabs credits.</p>
      )}

      {audioUrl && (
        <div className="space-y-2">
          <audio controls src={audioUrl} className="w-full" />
          <a href={audioUrl} download="hookai-voiceover.mp3"
            className="block text-center text-insta text-xs font-bold py-1">⬇ Download MP3</a>
        </div>
      )}
    </div>
  );
}

// Reusable grid of playable/downloadable Pexels clips.
function ClipGrid({ clips }) {
  const [playingId, setPlayingId] = useState(null);
  if (clips.length === 0) return null;
  return (
    <div className="grid grid-cols-3 gap-2">
      {clips.map((v) => (
        <div key={v.id} className="group relative rounded-lg overflow-hidden bg-[#0A0A0A]">
          {playingId === v.id ? (
            <video src={v.downloadUrl} controls autoPlay muted loop className="w-full h-32 object-cover bg-black" />
          ) : (
            <>
              <img src={v.preview} alt="" className="w-full h-32 object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                <button onClick={() => setPlayingId(v.id)}
                  className="text-white text-2xl leading-none hover:scale-110 transition-transform">▶</button>
                <a href={v.downloadUrl} target="_blank" rel="noreferrer" download
                  className="text-insta text-xs font-bold">⬇ Download</a>
                <a href={v.pageUrl} target="_blank" rel="noreferrer"
                  className="text-gray-300 text-[10px]">View on Pexels</a>
              </div>
              <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1 rounded">{v.duration}s</span>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

// Background picker for the text-driven format: pick ONE engaging loop to run
// behind the captions. It does NOT need to match the topic — it just holds attention.
function BackgroundFootage({ suggestions = [], defaultSearch }) {
  const [query, setQuery] = useState(defaultSearch || 'satisfying');
  const [clips, setClips] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async (q) => {
    if (!q.trim()) return;
    setQuery(q);
    setLoading(true);
    try {
      setClips(await searchVideos(q.trim(), 6));
    } catch {
      setClips([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(defaultSearch || 'satisfying'); }, [defaultSearch]);

  const ytSearch = (term) => `https://www.youtube.com/results?search_query=${encodeURIComponent(term + ' no copyright gameplay 9:16')}`;

  return (
    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4">
      <p className="text-xs font-bold text-insta mb-1">🎮 BACKGROUND — Keep Eyes on Screen</p>
      <p className="text-gray-500 text-xs mb-3">Text-driven format: bold captions over one engaging loop. The background does NOT need to match the topic — it just stops people scrolling. Pick one and loop it for the whole video.</p>

      {suggestions.length > 0 && (
        <div className="mb-3">
          <p className="text-[10px] font-bold text-gray-600 mb-1">AI SUGGESTIONS FOR THIS VIDEO</p>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => load(s)}
                className="bg-[#0A0A0A] border border-[#2A2A2A] hover:border-insta text-gray-300 text-xs px-2.5 py-1 rounded-full transition-colors">
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="text-[10px] font-bold text-gray-600 mb-1">SATISFYING LOOPS (free on Pexels)</p>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {BG_PRESETS.map((p) => (
          <button key={p} onClick={() => load(p)}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
              query === p ? 'bg-insta border-insta text-white' : 'bg-[#0A0A0A] border-[#2A2A2A] hover:border-insta text-gray-300'
            }`}>
            {p}
          </button>
        ))}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); load(query); }} className="flex gap-2 mb-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search background loops..."
          className="flex-1 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-insta"
        />
        <button type="submit" disabled={loading}
          className="bg-insta hover:bg-insta-light disabled:opacity-50 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
          {loading ? '...' : 'Search'}
        </button>
      </form>

      {loading ? (
        <p className="text-gray-600 text-xs text-center py-4 animate-pulse">Finding backgrounds…</p>
      ) : clips.length === 0 ? (
        <p className="text-gray-600 text-xs text-center py-4">No clips found. Try another term.</p>
      ) : (
        <ClipGrid clips={clips} />
      )}

      <div className="mt-3 pt-3 border-t border-[#2A2A2A]">
        <p className="text-[10px] font-bold text-gray-600 mb-1">PREFER GAMEPLAY? (Minecraft parkour, Subway Surfers — the classic combo)</p>
        <div className="flex flex-wrap gap-1.5">
          {['Minecraft parkour', 'Subway Surfers', 'GTA driving', 'satisfying ASMR'].map((g) => (
            <a key={g} href={ytSearch(g)} target="_blank" rel="noreferrer"
              className="bg-[#0A0A0A] border border-[#2A2A2A] hover:border-insta text-gray-300 text-xs px-2.5 py-1 rounded-full transition-colors">
              {g} ↗
            </a>
          ))}
        </div>
        <p className="text-gray-600 text-[10px] mt-2">Download no-copyright gameplay from YouTube, then loop it behind your captions.</p>
      </div>
    </div>
  );
}

function CapCutExport({ idea, script }) {
  const [copied, setCopied] = useState(false);

  const exportText = `
🎬 VIDEO TITLE: ${idea.title}

━━━━━━━━━━━━━━━━━━━━
🎣 HOOK (First 3 seconds)
━━━━━━━━━━━━━━━━━━━━
${script.hook}

━━━━━━━━━━━━━━━━━━━━
📖 VOICEOVER SCRIPT (each line = one caption)
━━━━━━━━━━━━━━━━━━━━
${script.script}

━━━━━━━━━━━━━━━━━━━━
🎮 BACKGROUND IDEAS
━━━━━━━━━━━━━━━━━━━━
${(script.backgrounds || []).join('\n')}

━━━━━━━━━━━━━━━━━━━━
🎵 MUSIC VIBE
━━━━━━━━━━━━━━━━━━━━
${script.music}

━━━━━━━━━━━━━━━━━━━━
✏️ CAPTION
━━━━━━━━━━━━━━━━━━━━
${script.caption}

━━━━━━━━━━━━━━━━━━━━
#️⃣ HASHTAGS
━━━━━━━━━━━━━━━━━━━━
${script.hashtags}
`.trim();

  const copy = () => {
    navigator.clipboard.writeText(exportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className="w-full bg-[#1A1A1A] hover:bg-[#222] border border-dashed border-insta rounded-xl p-4 text-center transition-all"
    >
      <p className="text-insta font-bold text-sm">{copied ? '✅ Copied to clipboard!' : '📋 Copy Full Script for CapCut'}</p>
      <p className="text-gray-600 text-xs mt-1">Everything formatted and ready to paste</p>
    </button>
  );
}

function Section({ title, content, highlight }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`bg-[#1A1A1A] rounded-xl p-4 border ${highlight ? 'border-insta' : 'border-[#2A2A2A]'}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-insta">{title}</span>
        <button onClick={copy} className="text-xs text-gray-500 hover:text-white transition-colors">
          {copied ? '✅ Copied' : 'Copy'}
        </button>
      </div>
      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line break-words">{content}</p>
    </div>
  );
}

export default function ScriptPage({ idea, onBack, onMarkPosted, postedTitles = [] }) {
  const [script, setScript] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (idea) {
      setScript(null);
      setLoading(true);
      generateScript(idea).then(setScript).finally(() => setLoading(false));
    }
  }, [idea]);

  if (!idea) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center text-gray-600">
        <div className="text-5xl mb-4">📝</div>
        <p>Pick an idea from the Ideas tab first</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-gray-500 hover:text-white text-sm flex items-center gap-1 transition-colors">
          ← Back to ideas
        </button>
        {idea && (
          postedTitles.includes(idea.title)
            ? <span className="text-green-500 text-sm font-bold">✅ Posted</span>
            : <button
                onClick={() => onMarkPosted(idea)}
                className="bg-green-600 hover:bg-green-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
              >
                ✅ Mark as Posted
              </button>
        )}
      </div>

      <h2 className="text-white font-black text-xl mb-6">{idea.title}</h2>

      {loading && (
        <div className="text-center py-16">
          <div className="text-4xl mb-4 animate-pulse">✍️</div>
          <p className="text-gray-500">Writing your script...</p>
        </div>
      )}

      {script && (
        <div className="space-y-3">
          <Section title="🎣 HOOK — First 3 Seconds" content={script.hook} highlight />
          <Section title="📖 FULL SCRIPT — Each line = one caption" content={script.script} />
          <Voiceover script={script.script} />
          <BackgroundFootage suggestions={script.backgrounds || []} defaultSearch={script.bgSearch} />
          <Section title="🎵 MUSIC VIBE" content={script.music} />
          <Section title="✏️ CAPTION" content={script.caption} />
          <Section title="#️⃣ HASHTAGS" content={formatHashtags(script.hashtags)} />

          {script.thumbnails?.length > 0 && (
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4">
              <p className="text-xs font-bold text-insta mb-3">🖼️ THUMBNAIL IDEAS</p>
              <div className="space-y-2">
                {script.thumbnails.map((t, i) => (
                  <div key={i} className="flex gap-2 py-2 border-b border-[#2A2A2A] last:border-0">
                    <span className="text-insta font-bold text-sm shrink-0">#{i + 1}</span>
                    <p className="text-gray-300 text-sm leading-relaxed">{t}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <CapCutExport idea={idea} script={script} />

          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4">
              <p className="text-xs font-bold text-insta mb-3">🔗 RESOURCES — Where to Find Your Media</p>
              <div className="space-y-3">
                {script.resources?.map((r, i) => (
                  <a key={i} href={r.url} target="_blank" rel="noreferrer"
                    className="block py-2 border-b border-[#2A2A2A] hover:opacity-70 transition-opacity">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white text-sm font-semibold">{r.site}</span>
                      <span className="text-gray-600 text-xs">→</span>
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed">{r.tip}</p>
                  </a>
                ))}

                <p className="text-xs font-bold text-gray-600 pt-1 pb-1">TOOLS — Always Useful</p>
                {[
                  { site: '✂️ CapCut', tip: 'Edit video, add AI voiceover, auto-captions, background music', url: 'https://www.capcut.com' },
                  { site: '🎵 YouTube Audio Library', tip: 'Free licensed background music for any video', url: 'https://www.youtube.com/audiolibrary' },
                  { site: '🤖 ElevenLabs', tip: 'AI voiceover — generate realistic narration from your script', url: 'https://elevenlabs.io' },
                  { site: '🎨 Canva', tip: 'Create text overlays, thumbnails, and title cards', url: 'https://www.canva.com' },
                ].map((r, i) => (
                  <a key={i} href={r.url} target="_blank" rel="noreferrer"
                    className="block py-2 border-b border-[#2A2A2A] last:border-0 hover:opacity-70 transition-opacity">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white text-sm font-semibold">{r.site}</span>
                      <span className="text-gray-600 text-xs">→</span>
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed">{r.tip}</p>
                  </a>
                ))}
              </div>
            </div>
        </div>
      )}
    </div>
  );
}
