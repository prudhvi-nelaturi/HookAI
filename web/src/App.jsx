import { useState } from 'react';
import HomePage from './pages/HomePage';
import ScriptPage from './pages/ScriptPage';
import PostedPage from './pages/PostedPage';

const tabs = [
  { id: 'ideas', icon: '💡', label: 'Ideas' },
  { id: 'script', icon: '📝', label: 'Script' },
  { id: 'posted', icon: '✅', label: 'Posted' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('ideas');
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [usedTitles, setUsedTitles] = useState([]);
  const [postedIdeas, setPostedIdeas] = useState(() => {
    try { return JSON.parse(localStorage.getItem('hookai_posted') || '[]'); } catch { return []; }
  });

  const markAsPosted = (idea) => {
    setPostedIdeas(prev => {
      if (prev.find(p => p.title === idea.title)) return prev;
      const updated = [{ ...idea, postedAt: new Date().toISOString() }, ...prev];
      localStorage.setItem('hookai_posted', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSelectIdea = (idea) => {
    setSelectedIdea(idea);
    setUsedTitles(prev => prev.includes(idea.title) ? prev : [...prev, idea.title]);
    setActiveTab('script');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      <div className="fixed top-0 left-0 right-0 bg-[#1A1A1A] border-b border-[#2A2A2A] flex z-10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
              activeTab === tab.id ? 'text-insta' : 'text-gray-600'
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-xs font-semibold">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pt-20">
        {activeTab === 'ideas' && <HomePage onSelectIdea={handleSelectIdea} usedTitles={usedTitles} />}
        {activeTab === 'script' && <ScriptPage idea={selectedIdea} onBack={() => setActiveTab('ideas')} onMarkPosted={markAsPosted} postedTitles={postedIdeas.map(p => p.title)} />}
        {activeTab === 'posted' && <PostedPage postedIdeas={postedIdeas} />}
      </div>
    </div>
  );
}
