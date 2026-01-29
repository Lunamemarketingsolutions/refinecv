import { Mic, MessageSquare, BarChart } from 'lucide-react';

export default function SampleResults() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-secondary mb-4">
            See What You'll Get
          </h2>
          <p className="text-lg sm:text-xl text-gray-600">
            Real feedback, real improvement
          </p>
        </div>

        <div className="space-y-16">
          <div>
            <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl p-8 lg:p-12 shadow-xl border-2 border-purple-200 mb-6">
              <div className="aspect-video flex items-center justify-center">
                <div className="text-center">
                  <Mic className="w-20 h-20 text-purple-600 mx-auto mb-4" />
                  <p className="text-xl font-semibold text-gray-700">
                    Interview Session Interface
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    AI Coach • Question Card • Voice Input • Progress Tracker
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Interface Features:
              </p>
              <ol className="space-y-2 text-sm text-gray-600">
                <li>1. AI Coach avatar with status indicator</li>
                <li>2. Clear question text with STAR guidelines</li>
                <li>3. Large microphone button for voice input</li>
                <li>4. Progress tracker (Question 5 of 20)</li>
              </ol>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-green-200 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="w-8 h-8 text-purple-600" />
                <h3 className="text-2xl font-semibold text-secondary">
                  Real-Time Feedback Example
                </h3>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="text-4xl font-black text-success">85%</div>
                  <div className="text-sm text-gray-600">Strong Answer</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <p className="text-sm font-bold text-success">Strengths:</p>
                  </div>
                  <ul className="ml-4 space-y-1 text-sm text-gray-600">
                    <li>• Excellent STAR structure: Clear situation, task, action, result</li>
                    <li>• Quantified impact: "Increased sales by 30%, generated ₹12L revenue"</li>
                    <li>• Demonstrated leadership: "Coordinated 8-member cross-functional team"</li>
                  </ul>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <p className="text-sm font-bold text-amber-600">Could Be Stronger:</p>
                  </div>
                  <ul className="ml-4 space-y-1 text-sm text-gray-600">
                    <li>• Add more context on the challenge (why was it difficult?)</li>
                    <li>• Expand on decision-making process</li>
                    <li>• Mention long-term impact (6 months later)</li>
                  </ul>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <p className="text-sm font-bold text-purple-600">Coach's Tip:</p>
                  </div>
                  <p className="ml-4 text-sm text-gray-700">
                    For leadership questions, emphasize HOW you motivated the team and overcame specific obstacles.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-xl border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-6">
                <BarChart className="w-8 h-8 text-purple-600" />
                <h3 className="text-2xl font-semibold text-secondary">
                  Performance Report
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="bg-white rounded-xl p-6 mb-4">
                    <div className="text-center mb-4">
                      <div className="text-5xl font-black text-purple-600 mb-2">78%</div>
                      <div className="flex justify-center gap-1 mb-2">
                        {[1, 2, 3, 4].map((star) => (
                          <svg
                            key={star}
                            className="w-5 h-5 text-amber-400 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                        <svg
                          className="w-5 h-5 text-gray-300 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      </div>
                      <p className="text-sm font-semibold text-gray-700">
                        Good - Ready with Refinement
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4">
                    <p className="text-xs font-bold text-gray-700 mb-3">Category Performance:</p>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Introduction:</span>
                        <span className="font-semibold text-success">88% ★★★★★</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Behavioral:</span>
                        <span className="font-semibold text-amber-600">75% ★★★★☆</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Technical:</span>
                        <span className="font-semibold text-success">82% ★★★★☆</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Culture Fit:</span>
                        <span className="font-semibold text-amber-600">70% ★★★☆☆</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Soft Skills:</span>
                        <span className="font-semibold text-success">85% ★★★★★</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4">
                    <p className="text-xs font-bold text-success mb-2">Top Strengths:</p>
                    <ol className="space-y-1 text-xs text-gray-600">
                      <li>1. Strong quantification (metrics in every answer)</li>
                      <li>2. STAR framework usage (12/15 questions)</li>
                      <li>3. Confident delivery</li>
                    </ol>
                  </div>

                  <div className="bg-white rounded-xl p-4">
                    <p className="text-xs font-bold text-purple-600 mb-2">Action Plan:</p>
                    <ul className="space-y-1 text-xs text-gray-600">
                      <li>• Re-practice Question 8 (weakest - 55%)</li>
                      <li>• Research company culture deeply</li>
                      <li>• Add metrics to 5 behavioral stories</li>
                      <li>• 2 more sessions to reach 85%+ (Excellent)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
