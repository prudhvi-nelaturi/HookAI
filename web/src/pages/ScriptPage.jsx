import { useState, useEffect } from 'react';
import { generateScript } from '../services/groqService';

function Section({ title, content, highlight }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`bg-[#1A1A1A] rounded-xl p-4 border ${highlight ? 'border-red-500' : 'border-[#2A2A2A]'}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-red-500">{title}</span>
        <button onClick={copy} className="text-xs text-gray-500 hover:text-white transition-colors">
          {copied ? '✅ Copied' : 'Copy'}
        </button>
      </div>
      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{content}</p>
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
          <Section title="📖 FULL SCRIPT" content={script.script} />
          <Section title="🎬 VISUALS" content={script.visuals} />
          <Section title="🎵 MUSIC VIBE" content={script.music} />
          <Section title="✏️ CAPTION" content={script.caption} />
          <Section title="#️⃣ HASHTAGS" content={script.hashtags} />
        </div>
      )}
    </div>
  );
}
