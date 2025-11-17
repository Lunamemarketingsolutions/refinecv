import { useState, useMemo } from 'react';
import { Clock, TrendingUp, AlertTriangle, CheckCircle, Target, Zap, ArrowRight } from 'lucide-react';

export default function PlacementCalculator() {
  const [roles, setRoles] = useState(4);
  const [companiesPerRole, setCompaniesPerRole] = useState(10);
  const [ctc, setCtc] = useState(20);
  const [daysUntil, setDaysUntil] = useState(30);

  const calculations = useMemo(() => {
    const totalApplications = roles * companiesPerRole;

    const genericTime = totalApplications * 0.5;
    const genericDays = Math.floor(genericTime / 8);
    const genericResponseRate = 0.035;
    const genericResponses = Math.floor(totalApplications * genericResponseRate);
    const genericInterviews = Math.floor(totalApplications * 0.015);

    const refineCVTime = totalApplications * 0.25;
    const refineCVDays = Math.floor(refineCVTime / 8);
    const refineCVResponseRate = 0.20;
    const refineCVResponses = Math.floor(totalApplications * refineCVResponseRate);
    const refineCVInterviews = Math.floor(totalApplications * 0.125);

    const timeSaved = genericTime - refineCVTime;
    const daysSaved = Math.floor(timeSaved / 8);
    const monthlyValue = Math.floor(ctc / 12);
    const hourlyValue = Math.floor((ctc * 100000) / (365 * 8));
    const roi = Math.floor((timeSaved * hourlyValue) / 499);

    return {
      totalApplications,
      generic: {
        time: genericTime,
        days: genericDays,
        responseRate: '2-5%',
        responses: genericResponses,
        interviews: genericInterviews,
        matchScore: '35-50%',
        keywordCoverage: '20-30%',
        stress: 90,
      },
      refineCV: {
        time: refineCVTime,
        days: refineCVDays,
        responseRate: '15-25%',
        responses: refineCVResponses,
        interviews: refineCVInterviews,
        matchScore: '80-90%',
        keywordCoverage: '80-90%',
        stress: 30,
      },
      savings: {
        hours: timeSaved,
        days: daysSaved,
        monthlyValue,
        hourlyValue,
        roi,
      },
    };
  }, [roles, companiesPerRole, ctc]);

  return (
    <section id="calculator" className="py-16 lg:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-black text-secondary mb-4">
            The Placement Season Calculator
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            See how much time and opportunity cost generic CVs are costing you
          </p>
        </div>

        <div className="bg-background rounded-2xl p-6 lg:p-8 mb-8">
          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-secondary font-semibold mb-3">
                How many different roles are you targeting?
              </label>
              <input
                type="range"
                min="2"
                max="10"
                value={roles}
                onChange={(e) => setRoles(Number(e.target.value))}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="text-center mt-2 text-2xl font-black text-primary">
                {roles} different roles
              </div>
              <p className="text-center text-sm text-gray-600 mt-1">
                Consulting, Investment Banking, Product Management, Marketing
              </p>
            </div>

            <div>
              <label className="block text-secondary font-semibold mb-3">
                How many companies per role?
              </label>
              <input
                type="range"
                min="3"
                max="30"
                value={companiesPerRole}
                onChange={(e) => setCompaniesPerRole(Number(e.target.value))}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="text-center mt-2 text-2xl font-black text-primary">
                {companiesPerRole} companies per role
              </div>
            </div>

            <div>
              <label className="block text-secondary font-semibold mb-3">
                Your target CTC?
              </label>
              <input
                type="range"
                min="10"
                max="50"
                value={ctc}
                onChange={(e) => setCtc(Number(e.target.value))}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="text-center mt-2 text-2xl font-black text-primary">
                ₹{ctc} lakhs
              </div>
            </div>

            <div>
              <label className="block text-secondary font-semibold mb-3">
                Days until placement season starts?
              </label>
              <input
                type="range"
                min="1"
                max="120"
                value={daysUntil}
                onChange={(e) => setDaysUntil(Number(e.target.value))}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="text-center mt-2 text-2xl font-black text-primary">
                {daysUntil} days remaining
              </div>
            </div>
          </div>

          <div className="text-center py-4 border-t-2 border-primary/20">
            <div className="text-3xl font-black text-primary">
              = {calculations.totalApplications} applications this placement season
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gradient-to-br from-error/10 to-error/5 rounded-2xl p-6 lg:p-8 border-2 border-error/20">
            <div className="inline-block bg-error text-white px-4 py-2 rounded-full font-bold text-sm mb-6">
              Sending Same CV Everywhere
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-error" />
                  <h3 className="font-bold text-secondary">Time Investment</h3>
                </div>
                <div className="text-5xl font-black text-error mb-2">
                  {calculations.generic.time} hours
                </div>
                <p className="text-gray-600">That's {calculations.generic.days} full days spent on barely-customized CVs</p>
                <p className="text-sm text-gray-500 mt-1">And they're still essentially generic</p>
              </div>

              <div>
                <h3 className="font-bold text-secondary mb-2">Response Rate</h3>
                <div className="text-4xl font-black text-error mb-2">{calculations.generic.responseRate}</div>
                <p className="text-gray-600 text-sm">Generic CV response rate</p>
                <p className="text-sm text-gray-700 mt-2">
                  Out of {calculations.totalApplications} applications, expect only <span className="font-bold text-error">{calculations.generic.responses}</span> responses
                </p>
              </div>

              <div>
                <h3 className="font-bold text-secondary mb-2">Match Scores</h3>
                <div className="text-3xl font-black text-error mb-3">{calculations.generic.matchScore}</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Consulting JD:</span>
                    <span className="font-bold text-error">40% match</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Banking JD:</span>
                    <span className="font-bold text-error">45% match</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">PM JD:</span>
                    <span className="font-bold text-error">35% match</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Marketing JD:</span>
                    <span className="font-bold text-error">38% match</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-secondary mb-2">Keyword Coverage</h3>
                <div className="text-3xl font-black text-error mb-2">{calculations.generic.keywordCoverage}</div>
                <p className="text-sm text-gray-600">of JD keywords covered</p>
              </div>

              <div>
                <h3 className="font-bold text-secondary mb-3">Likely Outcomes</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Applications:</span>
                    <span className="font-bold text-secondary">{calculations.totalApplications}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Responses:</span>
                    <span className="font-bold text-error">{calculations.generic.responses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Interviews:</span>
                    <span className="font-bold text-error">{calculations.generic.interviews}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/50 rounded-lg p-4 border-2 border-error/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-700 mb-2">
                      You're essentially gambling {calculations.totalApplications} applications on a generic CV
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-bold">Placement season stress:</span> <span className="text-error font-bold">{calculations.generic.stress}%</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-error/5 rounded-lg p-4 border border-error/20">
                <p className="text-xs font-semibold text-error mb-2">THE PLACEMENT WEEK REALITY:</p>
                <div className="space-y-1 text-xs text-gray-700">
                  <p>Day 1: 20 companies. Same CV sent 20 times.</p>
                  <p>Day 2: 15 companies. Still same CV.</p>
                  <p className="font-bold text-error">Day 3: 0 interview calls. Panic mode.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-success/10 to-success/5 rounded-2xl p-6 lg:p-8 border-2 border-success/20">
            <div className="inline-block bg-success text-white px-4 py-2 rounded-full font-bold text-sm mb-6">
              Tailored CV for Every Role
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-success" />
                  <h3 className="font-bold text-secondary">Time Investment</h3>
                </div>
                <div className="text-5xl font-black text-success mb-2">
                  {calculations.refineCV.time} hours
                </div>
                <p className="text-gray-600">Save {calculations.savings.hours} hours = {calculations.savings.days} full days</p>
                <p className="text-sm text-success font-semibold mt-1">Spend saved time on interview prep instead</p>
              </div>

              <div>
                <h3 className="font-bold text-secondary mb-2">Response Rate</h3>
                <div className="text-4xl font-black text-success mb-2">{calculations.refineCV.responseRate}</div>
                <p className="text-gray-600 text-sm">Tailored CV response rate (3-5x higher)</p>
                <p className="text-sm text-gray-700 mt-2">
                  Out of {calculations.totalApplications} applications, expect <span className="font-bold text-success">{calculations.refineCV.responses}</span> responses
                </p>
                <p className="text-success font-semibold text-sm mt-1">That's {calculations.refineCV.responses - calculations.generic.responses} more interview calls</p>
              </div>

              <div>
                <h3 className="font-bold text-secondary mb-2">Match Scores</h3>
                <div className="text-3xl font-black text-success mb-3">{calculations.refineCV.matchScore}</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Consulting JD:</span>
                    <span className="font-bold text-success">87% match</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Banking JD:</span>
                    <span className="font-bold text-success">85% match</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">PM JD:</span>
                    <span className="font-bold text-success">89% match</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Marketing JD:</span>
                    <span className="font-bold text-success">82% match</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-secondary mb-2">Keyword Coverage</h3>
                <div className="text-3xl font-black text-success mb-2">{calculations.refineCV.keywordCoverage}</div>
                <p className="text-sm text-gray-600">of JD keywords covered</p>
              </div>

              <div>
                <h3 className="font-bold text-secondary mb-3">Likely Outcomes</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Applications:</span>
                    <span className="font-bold text-secondary">{calculations.totalApplications}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Responses:</span>
                    <span className="font-bold text-success">{calculations.refineCV.responses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Interviews:</span>
                    <span className="font-bold text-success">{calculations.refineCV.interviews}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/50 rounded-lg p-4 border-2 border-success/20">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-gray-700 mb-1">
                      <span className="font-bold">RefineCV Premium:</span> ₹499/month
                    </p>
                    <p className="text-gray-700 mb-1">
                      <span className="font-bold">Time saved value:</span> ₹{Math.floor(calculations.savings.hours * calculations.savings.hourlyValue).toLocaleString('en-IN')}
                    </p>
                    <p className="text-gray-700 mb-2">
                      If you land job 2 weeks faster: ₹{Math.floor((ctc * 100000 * 2) / 52).toLocaleString('en-IN')} gained
                    </p>
                    <p className="text-success font-bold text-lg">
                      ROI: {calculations.savings.roi}x return
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      <span className="font-bold">Placement season stress:</span> <span className="text-success font-bold">{calculations.refineCV.stress}%</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-success/5 rounded-lg p-4 border border-success/20">
                <p className="text-xs font-semibold text-success mb-2">THE PLACEMENT WEEK REALITY:</p>
                <div className="space-y-1 text-xs text-gray-700">
                  <p>Day 1: 20 companies. 20 tailored CVs in 5 hours with RefineCV.</p>
                  <p>Day 2: 15 companies. Another 15 tailored CVs in 4 hours.</p>
                  <p className="font-bold text-success">Day 3: 12 interview calls. Preparation mode activated.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary text-white rounded-2xl p-6 lg:p-8 mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="w-8 h-8" />
            <h3 className="text-2xl lg:text-3xl font-black">The Math That Matters</h3>
          </div>
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-lg font-bold mb-2">GENERIC CV APPROACH:</p>
              <ul className="space-y-1 text-sm">
                <li>• {calculations.totalApplications} applications × 2-5% response = {calculations.generic.responses} interview calls</li>
                <li>• {calculations.generic.time} hours spent on minimal customization</li>
                <li>• 35-50% average JD match score</li>
                <li>• High stress, low confidence</li>
              </ul>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-lg font-bold mb-2">REFINECV JD MATCHING:</p>
              <ul className="space-y-1 text-sm">
                <li>• {calculations.totalApplications} applications × 15-25% response = {calculations.refineCV.responses} interview calls</li>
                <li>• {calculations.refineCV.time} hours for fully tailored CVs (save {calculations.savings.hours} hours = {calculations.savings.days} full days)</li>
                <li>• 80-90% average JD match score</li>
                <li>• Structured process, high confidence</li>
              </ul>
            </div>
            <p className="text-xl font-bold text-center mt-6">
              That's 3-5x MORE interview calls while saving {calculations.savings.days} full days.
            </p>
            <p className="text-lg text-center opacity-90">
              If even ONE of those extra interviews converts to an offer, RefineCV paid for itself 20x over.
            </p>
          </div>
        </div>

        <div className="text-center">
          <a
            href="#viewer"
            className="inline-flex items-center gap-3 bg-white text-primary border-2 border-primary px-8 py-4 rounded-xl font-black text-lg hover:scale-105 hover:shadow-xl transition-all"
          >
            Start Matching CVs to JDs
            <ArrowRight className="w-6 h-6" />
          </a>
          <p className="mt-4 text-sm text-gray-600">
            3 free analyses per day • See match % instantly
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="text-center">
            <Target className="w-12 h-12 text-primary mx-auto mb-3" />
            <div className="text-4xl font-black text-primary mb-2">3-5x</div>
            <p className="text-secondary font-semibold">Higher Response Rate</p>
            <p className="text-sm text-gray-600 mt-1">With tailored CVs vs generic</p>
          </div>
          <div className="text-center">
            <Zap className="w-12 h-12 text-primary mx-auto mb-3" />
            <div className="text-4xl font-black text-primary mb-2">15 min</div>
            <p className="text-secondary font-semibold">Per Tailored CV</p>
            <p className="text-sm text-gray-600 mt-1">vs 3-4 hours manually</p>
          </div>
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-primary mx-auto mb-3" />
            <div className="text-4xl font-black text-primary mb-2">80-90%</div>
            <p className="text-secondary font-semibold">Average Match Score</p>
            <p className="text-sm text-gray-600 mt-1">RefineCV users vs 35-50% generic</p>
          </div>
        </div>
      </div>
    </section>
  );
}
