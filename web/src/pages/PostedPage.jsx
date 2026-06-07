export default function PostedPage({ postedIdeas }) {
  if (postedIdeas.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center text-gray-600">
        <div className="text-5xl mb-4">✅</div>
        <p className="text-base">No posted videos yet</p>
        <p className="text-sm text-gray-700 mt-2">Generate an idea, write the script, post it, then mark it as posted</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">Posted Videos</h1>
        <p className="text-gray-500 text-sm mt-1">{postedIdeas.length} video{postedIdeas.length !== 1 ? 's' : ''} posted</p>
      </div>

      <div className="space-y-3">
        {postedIdeas.map((idea, index) => (
          <div key={index} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4">
            <div className="flex justify-between items-start mb-1">
              <div className="text-xs font-bold text-green-500">{idea.format} · {idea.duration}</div>
              <div className="text-xs text-gray-600">
                {new Date(idea.postedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
            <div className="text-white font-bold text-base mb-2">{idea.title}</div>
            <div className="text-gray-500 text-sm">🎣 {idea.hook}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
