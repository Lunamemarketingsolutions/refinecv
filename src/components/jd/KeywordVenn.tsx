import { ArrowRight } from 'lucide-react';

export default function KeywordVenn() {
  const cvOnlyKeywords = ['Photography', 'Marathon Runner', 'College Fest', 'Debate Club', 'Sports Captain'];
  const jdOnlyKeywords = ['Machine Learning', 'Agile', 'Stakeholder Management', 'Cloud Computing', 'API Design', 'Scrum', 'DevOps'];
  const matchedKeywords = ['Python', 'Data Analysis', 'SQL', 'Project Management', 'Team Leadership', 'Communication', 'Problem Solving', 'Excel', 'Leadership', 'Analytics', 'Presentation', 'Strategic Thinking', 'Collaboration', 'Time Management', 'Critical Thinking', 'Client Management', 'Reporting', 'Documentation'];

  const totalJDKeywords = jdOnlyKeywords.length + matchedKeywords.length;
  const matchPercentage = Math.round((matchedKeywords.length / totalJDKeywords) * 100);

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-black text-secondary mb-4">
            Visualize Your Keyword Gaps
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            See exactly where your CV overlaps with the JD—and where it doesn't
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 lg:p-12 shadow-lg mb-8">
          <div className="relative h-[400px] lg:h-[500px] flex items-center justify-center mb-8">
            <div className="absolute left-0 lg:left-[5%] top-1/2 -translate-y-1/2 w-64 h-64 lg:w-80 lg:h-80 rounded-full border-4 border-primary bg-primary/5 flex items-center justify-center z-10">
              <div className="text-center px-4">
                <p className="font-black text-primary text-2xl mb-2">Your CV</p>
                <p className="font-bold text-secondary text-xl">{cvOnlyKeywords.length + matchedKeywords.length} Keywords</p>
              </div>
            </div>

            <div className="absolute right-0 lg:right-[5%] top-1/2 -translate-y-1/2 w-64 h-64 lg:w-80 lg:h-80 rounded-full border-4 border-blue-500 bg-blue-500/5 flex items-center justify-center z-10">
              <div className="text-center px-4">
                <p className="font-black text-blue-600 text-2xl mb-2">Job Description</p>
                <p className="font-bold text-secondary text-xl">{totalJDKeywords} Requirements</p>
              </div>
            </div>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 lg:w-56 lg:h-56 rounded-full bg-success/20 border-4 border-success flex items-center justify-center z-20">
              <div className="text-center px-4">
                <p className="font-black text-success text-3xl lg:text-4xl mb-1">{matchedKeywords.length}</p>
                <p className="font-bold text-secondary text-sm lg:text-base">Matched</p>
                <p className="font-black text-success text-2xl lg:text-3xl mt-2">{matchPercentage}%</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-primary/5 rounded-lg p-6 border-2 border-primary/20">
              <h3 className="font-bold text-primary mb-3 text-lg">CV Only ({cvOnlyKeywords.length})</h3>
              <p className="text-xs text-gray-600 mb-3">Keywords in your CV but not required by this JD</p>
              <div className="flex flex-wrap gap-2">
                {cvOnlyKeywords.map((keyword, idx) => (
                  <span key={idx} className="text-xs bg-white px-2 py-1 rounded border border-primary/20 text-gray-700">
                    {keyword}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-3 italic">Interesting but not relevant to THIS JD</p>
            </div>

            <div className="bg-success/5 rounded-lg p-6 border-2 border-success/20">
              <h3 className="font-bold text-success mb-3 text-lg">Matched ({matchedKeywords.length})</h3>
              <p className="text-xs text-gray-600 mb-3">Keywords present in both CV and JD</p>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                {matchedKeywords.slice(0, 12).map((keyword, idx) => (
                  <span key={idx} className="text-xs bg-white px-2 py-1 rounded border border-success/20 text-gray-700">
                    {keyword}
                  </span>
                ))}
                {matchedKeywords.length > 12 && (
                  <span className="text-xs text-success font-semibold">+{matchedKeywords.length - 12} more</span>
                )}
              </div>
              <p className="text-xs text-success mt-3 font-semibold">{matchPercentage}% of JD keywords covered</p>
            </div>

            <div className="bg-error/5 rounded-lg p-6 border-2 border-error/20">
              <h3 className="font-bold text-error mb-3 text-lg">Missing ({jdOnlyKeywords.length})</h3>
              <p className="text-xs text-gray-600 mb-3">Required by JD but missing from your CV</p>
              <div className="flex flex-wrap gap-2">
                {jdOnlyKeywords.map((keyword, idx) => (
                  <span key={idx} className="text-xs bg-white px-2 py-1 rounded border border-error/20 text-gray-700 font-semibold">
                    {keyword}
                  </span>
                ))}
              </div>
              <p className="text-xs text-error mt-3 font-bold">HIGH PRIORITY to add</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg border-2 border-primary/20">
          <h3 className="text-2xl font-black text-secondary mb-4">To reach 90%+ match:</h3>
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <div className="bg-error text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">1</div>
              <p className="text-gray-700">Add 7 missing keywords from JD (right-only section)</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-warning text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">2</div>
              <p className="text-gray-700">Remove or de-emphasize 5 irrelevant keywords from CV (left-only section)</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-success text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">3</div>
              <p className="text-gray-700">Strengthen 3 partial matches in overlap</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-primary/5 rounded-lg p-4">
            <div>
              <p className="text-sm text-gray-600">Estimated time:</p>
              <p className="text-2xl font-black text-primary">20 minutes</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Estimated impact:</p>
              <p className="text-2xl font-black text-success">+18% match score</p>
            </div>
            <a
              href="#signup"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold hover:scale-105 transition-all"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
