import { useState } from 'react';
import { Clock, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';

export default function BulletPointCalculator() {
  const [experienceCount, setExperienceCount] = useState(3);
  const [bulletQuality, setBulletQuality] = useState<string>('mixed');
  const [applicationCount, setApplicationCount] = useState(30);
  const [targetCTC, setTargetCTC] = useState(18);

  const totalBullets = experienceCount * 5;

  const qualityMap: Record<string, { rating: number; weak: number; medium: number; strong: number }> = {
    weak: { rating: 2, weak: 60, medium: 30, strong: 10 },
    mixed: { rating: 3, weak: 40, medium: 40, strong: 20 },
    'fairly-strong': { rating: 4, weak: 20, medium: 30, strong: 50 },
    'very-strong': { rating: 4.5, weak: 5, medium: 20, strong: 75 },
  };

  const quality = qualityMap[bulletQuality];
  const manualTimePerBullet = 0.75;
  const aiTimePerBullet = 0.05;

  const manualTotalTime = totalBullets * manualTimePerBullet;
  const aiTotalTime = 0.25;
  const timeSaved = manualTotalTime - aiTotalTime;

  const currentResponseRate = quality.rating <= 2 ? 4 : quality.rating === 3 ? 8 : quality.rating === 4 ? 12 : 15;
  const enhancedResponseRate = 20;

  const currentResponses = Math.round((applicationCount * currentResponseRate) / 100);
  const enhancedResponses = Math.round((applicationCount * enhancedResponseRate) / 100);

  const hourlyRate = (targetCTC * 100000) / (12 * 160);
  const valueOfTime = Math.round(timeSaved * hourlyRate);

  return (
    <section id="calculator" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-black text-secondary mb-4">
            How Much Time Are You Wasting on Bullet Points?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Calculate the time and opportunity cost of weak bullets vs. AI-enhanced bullets
          </p>
        </div>

        <div className="bg-background rounded-2xl p-6 lg:p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-secondary mb-2">
                How many work experiences/internships do you have?
              </label>
              <input
                type="range"
                min="1"
                max="6"
                value={experienceCount}
                onChange={(e) => setExperienceCount(Number(e.target.value))}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>{experienceCount} experiences</span>
                <span>≈ {totalBullets} bullet points total</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-secondary mb-2">
                Current bullet point quality (be honest):
              </label>
              <select
                value={bulletQuality}
                onChange={(e) => setBulletQuality(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-secondary"
              >
                <option value="weak">Mostly weak (vague, passive, no metrics)</option>
                <option value="mixed">Mixed quality (some good, some weak)</option>
                <option value="fairly-strong">Fairly strong (specific, some metrics)</option>
                <option value="very-strong">Very strong (quantified, achievement-driven)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-secondary mb-2">
                How many applications this placement season?
              </label>
              <input
                type="range"
                min="5"
                max="100"
                value={applicationCount}
                onChange={(e) => setApplicationCount(Number(e.target.value))}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>{applicationCount} applications</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-secondary mb-2">
                Your target CTC?
              </label>
              <input
                type="range"
                min="10"
                max="50"
                step="2"
                value={targetCTC}
                onChange={(e) => setTargetCTC(Number(e.target.value))}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>₹{targetCTC} lakhs</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gradient-to-br from-error/5 to-error/10 rounded-2xl p-6 lg:p-8 border-2 border-error/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-error">Your Current Manual Process</h3>
              <TrendingDown className="w-8 h-8 text-error" />
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">Current Average Rating:</p>
                <div className="text-5xl font-black text-error mb-2">{quality.rating}/5 ★</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Weak bullets (1-2 stars):</span>
                    <span className="font-semibold text-error">{quality.weak}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Mediocre bullets (3 stars):</span>
                    <span className="font-semibold text-warning">{quality.medium}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Strong bullets (4-5 stars):</span>
                    <span className="font-semibold text-success">{quality.strong}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/50 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-600 mb-2">Time Investment to Fix Manually:</p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-black text-error">{manualTotalTime.toFixed(1)}</span>
                  <span className="text-xl font-semibold text-gray-600">hours</span>
                </div>
                <p className="text-sm text-gray-600">{totalBullets} bullets × 45 min = {(manualTotalTime / 8).toFixed(1)} full days</p>
              </div>

              <div className="bg-white/50 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-600 mb-3">The Hidden Costs:</p>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
                    <span>Hours spent Googling "strong action verbs"</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
                    <span>Time waiting for senior feedback</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
                    <span>Iterations per bullet: 3-5 versions</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/50 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-600 mb-2">Interview Probability:</p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-black text-error">{currentResponseRate}%</span>
                  <span className="text-sm text-gray-600">response rate</span>
                </div>
                <p className="text-sm text-gray-600">Out of {applicationCount} applications: Only {currentResponses} responses expected</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-success/5 to-success/10 rounded-2xl p-6 lg:p-8 border-2 border-success/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-success">Your RefineCV AI Process</h3>
              <TrendingUp className="w-8 h-8 text-success" />
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">Enhanced Average Rating:</p>
                <div className="text-5xl font-black text-success mb-2">4.5/5 ★</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Weak bullets (1-2 stars):</span>
                    <span className="font-semibold text-error">0%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Mediocre bullets (3 stars):</span>
                    <span className="font-semibold text-warning">5%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Strong bullets (4-5 stars):</span>
                    <span className="font-semibold text-success">95%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/50 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-600 mb-2">Time Investment with AI:</p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-black text-success">{aiTotalTime}</span>
                  <span className="text-xl font-semibold text-gray-600">hours</span>
                </div>
                <p className="text-sm text-gray-600">15 minutes for entire CV</p>
                <div className="mt-3 pt-3 border-t border-success/20">
                  <p className="text-sm font-black text-success">Time Saved: {timeSaved.toFixed(1)} hours = {(timeSaved / 8).toFixed(1)} full days</p>
                </div>
              </div>

              <div className="bg-white/50 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-600 mb-3">The Efficiency Gains:</p>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    <span>AI generates 3-5 versions instantly</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    <span>No waiting for feedback</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    <span>Live preview shows result immediately</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/50 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-600 mb-2">Interview Probability:</p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-black text-success">{enhancedResponseRate}%</span>
                  <span className="text-sm text-gray-600">response rate</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Out of {applicationCount} applications: {enhancedResponses} responses expected</p>
                <p className="text-sm font-black text-success">That's {enhancedResponses - currentResponses} more interview calls!</p>
              </div>

              <div className="bg-white/50 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-600 mb-2">ROI Calculation:</p>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>Time saved: {timeSaved.toFixed(1)} hours</p>
                  <p>Value of time: ₹{valueOfTime.toLocaleString('en-IN')}</p>
                  <p>RefineCV Premium: ₹499/month</p>
                  <p className="text-base font-black text-success mt-2">ROI: {(valueOfTime / 499).toFixed(1)}x</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary text-white rounded-2xl p-8 lg:p-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-3 mb-6">
              <Clock className="w-8 h-8 flex-shrink-0" />
              <div>
                <h3 className="text-2xl lg:text-3xl font-black mb-4">The Time Math:</h3>
                <div className="space-y-4 text-lg">
                  <div>
                    <p className="font-bold mb-2">MANUAL BULLET REWRITING:</p>
                    <ul className="space-y-1 text-white/90">
                      <li>• {manualTotalTime.toFixed(1)} hours per CV</li>
                      <li>• That's {(manualTotalTime / 8).toFixed(1)} full working days</li>
                      <li>• Average rating: {quality.rating}/5 stars</li>
                      <li>• Interview response rate: {currentResponseRate}%</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-bold mb-2">REFINECV AI ENHANCEMENT:</p>
                    <ul className="space-y-1 text-white/90">
                      <li>• 15 minutes for entire CV</li>
                      <li>• Average rating: 4.5/5 stars</li>
                      <li>• Interview response rate: {enhancedResponseRate}%</li>
                      <li>• {enhancedResponses - currentResponses} more interview calls</li>
                    </ul>
                  </div>
                  <div className="pt-4 border-t border-white/20">
                    <p className="text-xl font-black">
                      Save {timeSaved.toFixed(1)} hours = {(timeSaved / 8).toFixed(1)} full days + {enhancedResponses - currentResponses}x more interview calls
                    </p>
                    <p className="mt-3 text-white/90">
                      During placement season, those {timeSaved.toFixed(1)} saved hours = time for interview prep instead of bullet point anxiety.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <a
            href="#enhancer-demo"
            className="inline-flex items-center gap-3 bg-white text-primary px-8 py-4 rounded-xl font-black text-lg hover:scale-105 hover:shadow-xl transition-all border-2 border-primary"
          >
            Start Enhancing Bullets
          </a>
          <p className="mt-4 text-sm text-gray-600">
            3 free enhancements per day • See AI suggestions instantly
          </p>
        </div>
      </div>
    </section>
  );
}
