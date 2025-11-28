interface PartialMatchesProps {
  matches: any[];
}

export default function PartialMatches({ matches }: PartialMatchesProps) {
  return (
    <section className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-amber-600">
          Partial Matches ({matches.length} keywords)
        </h2>
        <p className="text-gray-600 mt-2">
          You have these concepts but not using JD's exact language - easy wins by rephrasing
        </p>
      </div>

      <div className="space-y-6">
        {matches.map((match, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg border-l-4 border-amber-500 p-6">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-2 font-semibold">Your CV Says:</p>
                <p className="text-sm text-gray-700 font-mono">{match.cvPhrase}</p>
              </div>
              <div className="bg-success/10 rounded-lg p-4">
                <p className="text-xs text-success mb-2 font-semibold">JD Prefers:</p>
                <p className="text-sm text-success font-mono font-bold">{match.jdPrefers}</p>
              </div>
            </div>

            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <h4 className="font-semibold text-secondary mb-2">Quick Fix:</h4>
              <p className="text-sm text-gray-700 mb-3">
                Replace "{match.cvPhrase}" with "{match.jdPrefers}" to match JD's exact terminology.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600">Time: <span className="font-semibold">2-3 minutes</span></span>
                <span className="text-amber-600 font-semibold">Impact: +{match.impact}%</span>
              </div>
            </div>
          </div>
        ))}

        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
          <h3 className="font-bold text-secondary mb-3">Easy Wins - Just Rephrase!</h3>
          <div className="text-sm text-gray-700 space-y-2">
            <p>All {matches.length} partial match fixes:</p>
            <p className="text-lg font-bold text-amber-600">Total impact: +{matches.reduce((sum, m) => sum + m.impact, 0)}% match score</p>
            <p>Total time: ~15 minutes</p>
            <p>Difficulty: <span className="text-success font-bold">LOW</span> (you already have the experience, just use JD's exact words!)</p>
          </div>
        </div>
      </div>
    </section>
  );
}
