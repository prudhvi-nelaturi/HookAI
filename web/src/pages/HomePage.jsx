import { useState } from 'react';
import { generateIdeas } from '../services/groqService';

export default function HomePage({ onSelectIdea, usedTitles }) {
  const [pool, setPool] = useState(() => {
    try { return JSON.parse(localStorage.getItem('hookai_pool') || '[]'); } catch { return []; }
  });
  const [loading, setLoading] = useState(false);

  const fetchIdeas = async () => {
    setLoading(true);
    try {
      const allTitles = pool.map(i => i.title);
      const newIdeas = await generateIdeas(allTitles);
      setPool(prev => {
        const updated = [...prev, ...newIdeas];
        localStorage.setItem('hookai_pool', JSON.stringify(updated));
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-white">HookAI <span className="text-red-500">⚡</span></h1>
        <p className="text-gray-500 text-sm mt-1">Your daily viral faceless content engine</p>
      </div>

      <button
        onClick={fetchIdeas}
        disabled={loading}
        className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold py-4 rounded-xl text-base transition-all mb-6"
      >
        {loading ? 'Generating ideas...' : pool.length === 0 ? '⚡ Generate Today\'s Ideas' : '⚡ Generate 5 More'}
      </button>

      {pool.length === 0 && !loading && (
        <div className="text-center py-16 text-gray-600">
          <div className="text-5xl mb-4">💡</div>
          <p>Hit the button to get 5 viral ideas</p>
        </div>
      )}

      <div className="space-y-3">
        {pool.map((idea, index) => {
          const used = usedTitles.includes(idea.title);
          return (
            <button
              key={index}
              onClick={() => onSelectIdea(idea)}
              className={`w-full text-left border rounded-xl p-4 transition-all ${
                used
                  ? 'bg-[#111] border-[#222] opacity-50'
                  : 'bg-[#1A1A1A] hover:bg-[#222] border-[#2A2A2A] hover:border-red-500'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="text-xs font-bold text-red-500">#{index + 1} · {idea.format} · {idea.duration}</div>
                {used && <span className="text-xs text-gray-600 font-semibold">USED</span>}
              </div>
              <div className="text-white font-bold text-base mb-2">{idea.title}</div>
              <div className="text-gray-500 text-sm">🎣 {idea.hook}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
