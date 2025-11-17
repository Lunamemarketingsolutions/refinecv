import { useState, useMemo } from 'react';
import { Clock, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

export default function ROICalculator() {
  const [applications, setApplications] = useState(30);
  const [ctc, setCtc] = useState(18);
  const [experience, setExperience] = useState('0-1 years (Fresher)');
  const [daysUntil, setDaysUntil] = useState(45);

  const calculations = useMemo(() => {
    const withoutTime = applications * 3.5;
    const withoutDays = Math.floor(withoutTime / 8);
    const withoutPassRate = 25;
    const withoutReached = Math.floor(applications * 0.25);
    const withoutInterviews = Math.floor(applications * 0.04);

    const withTime = applications * 0.25;
    const withDays = Math.floor(withTime / 8);
    const withPassRate = 90;
    const withReached = Math.floor(applications * 0.9);
    const withInterviews = Math.floor(applications * 0.3);

    const timeSaved = withoutTime - withTime;
    const daysSaved = Math.floor(timeSaved / 8);
    const monthlyValue = Math.floor(ctc / 12);
    const hourlyValue = Math.floor((ctc * 100000) / (365 * 8));

    return {
      without: {
        time: withoutTime,
        days: withoutDays,
        passRate: withoutPassRate,
        reached: withoutReached,
        interviews: withoutInterviews,
        stress: 90,
      },
      with: {
        time: withTime,
        days: withDays,
        passRate: withPassRate,
        reached: withReached,
        interviews: withInterviews,
        stress: 20,
      },
      savings: {
        hours: timeSaved,
        days: daysSaved,
        monthlyValue,
        hourlyValue,
        roi: Math.floor((timeSaved * hourlyValue) / 499),
      },
    };
  }, [applications, ctc]);

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-black text-secondary mb-4">
            The Placement Season Reality Check
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Calculate how much time, stress, and opportunity cost you're losing without RefineCV
          </p>
        </div>

        <div className="bg-background rounded-2xl p-6 lg:p-8 mb-8">
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-secondary font-semibold mb-3">
                How many companies are you applying to this placement season?
              </label>
              <input
                type="range"
                min="5"
                max="100"
                value={applications}
                onChange={(e) => setApplications(Number(e.target.value))}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="text-center mt-2 text-2xl font-black text-primary">
                {applications} applications
              </div>
            </div>

            <div>
              <label className="block text-secondary font-semibold mb-3">
                What's your dream job's annual CTC?
              </label>
              <input
                type="range"
                min="8"
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
                How much work experience do you have?
              </label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary focus:outline-none font-semibold text-secondary"
              >
                <option>0-1 years (Fresher)</option>
                <option>1-3 years</option>
                <option>3-5 years</option>
                <option>5+ years</option>
              </select>
            </div>

            <div>
              <label className="block text-secondary font-semibold mb-3">
                How many days until placements start?
              </label>
              <input
                type="range"
                min="1"
                max="180"
                value={daysUntil}
                onChange={(e) => setDaysUntil(Number(e.target.value))}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="text-center mt-2 text-2xl font-black text-primary">
                {daysUntil} days remaining
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gradient-to-br from-error/10 to-error/5 rounded-2xl p-6 lg:p-8 border-2 border-error/20">
            <div className="inline-block bg-error text-white px-4 py-1 rounded-full font-bold text-sm mb-6">
              Your Current Path
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-error" />
                  <h3 className="font-bold text-secondary">Time Investment</h3>
                </div>
                <div className="text-5xl font-black text-error mb-2">
                  {calculations.without.time} hours
                </div>
                <p className="text-gray-600">That's {calculations.without.days} full days of work</p>
                <div className="w-full bg-error/20 rounded-full h-3 mt-3">
                  <div className="bg-error h-3 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-secondary mb-2">ATS Pass Rate</h3>
                <div className="text-5xl font-black text-error mb-2">25%</div>
                <p className="text-gray-600 text-sm">Industry average ATS pass rate</p>
              </div>

              <div>
                <h3 className="font-bold text-secondary mb-3">Likely Outcome</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Applications submitted:</span>
                    <span className="font-bold text-secondary">{applications}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ATS-rejected:</span>
                    <span className="font-bold text-error">{applications - calculations.without.reached}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reached humans:</span>
                    <span className="font-bold text-warning">{calculations.without.reached}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Interview calls:</span>
                    <span className="font-bold text-success">{calculations.without.interviews}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-secondary mb-2">Stress Level</h3>
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <div className="bg-error h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ width: '90%' }}>
                    90%
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-2">Multiple tools, conflicting advice, constant anxiety</p>
              </div>

              <div className="bg-white/50 rounded-lg p-4 border-2 border-error/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-700">
                      <span className="font-bold">Opportunity cost:</span> If placement delayed by 1 month = ₹{calculations.savings.monthlyValue.toLocaleString('en-IN')} lost
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-success/10 to-success/5 rounded-2xl p-6 lg:p-8 border-2 border-success/20">
            <div className="inline-block bg-success text-white px-4 py-1 rounded-full font-bold text-sm mb-6">
              Your RefineCV Path
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-success" />
                  <h3 className="font-bold text-secondary">Time Investment</h3>
                </div>
                <div className="text-5xl font-black text-success mb-2">
                  {calculations.with.time} hours
                </div>
                <p className="text-gray-600">Save {calculations.savings.hours} hours = {calculations.savings.days} full days</p>
                <div className="w-full bg-success/20 rounded-full h-3 mt-3">
                  <div className="bg-success h-3 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-secondary mb-2">ATS Pass Rate</h3>
                <div className="text-5xl font-black text-success mb-2">90%+</div>
                <p className="text-gray-600 text-sm">RefineCV user average</p>
              </div>

              <div>
                <h3 className="font-bold text-secondary mb-3">Likely Outcome</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Applications submitted:</span>
                    <span className="font-bold text-secondary">{applications}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ATS-passed:</span>
                    <span className="font-bold text-success">{calculations.with.reached}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reached humans:</span>
                    <span className="font-bold text-success">{calculations.with.reached}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Interview calls:</span>
                    <span className="font-bold text-success">{calculations.with.interviews}</span>
                  </div>
                </div>
                <p className="text-success font-semibold text-sm mt-2">3.5x more than industry average</p>
              </div>

              <div>
                <h3 className="font-bold text-secondary mb-2">Stress Level</h3>
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <div className="bg-success h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ width: '20%' }}>
                    20%
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-2">Single tool, clear feedback, confident applications</p>
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
                    <p className="text-success font-bold text-lg mt-2">
                      ROI: {calculations.savings.roi}x return
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary text-white rounded-2xl p-6 lg:p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="w-8 h-8" />
            <h3 className="text-2xl lg:text-3xl font-black">Bottom Line</h3>
          </div>
          <div className="max-w-4xl mx-auto space-y-3 mb-6">
            <p className="text-lg">
              <span className="font-bold">WITHOUT RefineCV:</span> {calculations.without.time} hours, 25% ATS pass rate, {calculations.without.interviews} interviews
            </p>
            <p className="text-lg">
              <span className="font-bold">WITH RefineCV:</span> {calculations.with.time} hours (save {calculations.savings.hours} hours), 90% ATS pass rate, {calculations.with.interviews} interviews
            </p>
            <p className="text-xl font-bold mt-4">
              RefineCV pays for itself if it helps you land your job even 1 week faster.
            </p>
            <p className="text-lg opacity-90">
              During placement season with {applications} applications, you save {calculations.savings.days} full days and 3.5x your interview chances.
            </p>
          </div>
          <a
            href="#upload"
            className="inline-block bg-white text-primary px-8 py-4 rounded-xl font-black text-lg hover:scale-105 transition-all"
          >
            Start Saving Time Today →
          </a>
          <p className="mt-4 text-sm opacity-90">
            3 free analyses per day • No credit card required
          </p>
        </div>
      </div>
    </section>
  );
}
