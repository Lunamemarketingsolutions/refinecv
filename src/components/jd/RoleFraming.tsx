import { useState } from 'react';
import { Briefcase, TrendingUp, Package, ArrowRight } from 'lucide-react';

export default function RoleFraming() {
  const [activeTab, setActiveTab] = useState<'consulting' | 'banking' | 'pm'>('consulting');

  const originalBullet = '"Led team of 10 students to organize college tech fest with 500+ participants and ₹5 lakh budget"';

  const framings = {
    consulting: {
      icon: Briefcase,
      title: 'For Consulting Role',
      keywords: 'Structured problem-solving, data-driven, stakeholder management, business impact',
      tailored: 'Structured and executed 3-day tech fest by defining problem statement (low attendance), analyzing 3 years of historical data, and implementing hypothesis-driven solutions; increased participation by 25% (500 to 625 attendees) while managing ₹5L budget and coordinating with 10 cross-functional team members',
      changes: [
        'Added: "Structured," "hypothesis-driven," "data-driven" (consulting keywords)',
        'Quantified: "25% increase" (consultants love metrics)',
        'Emphasized: "problem statement," "analyzed data," "solutions"',
        'Frame: Shows analytical thinking and business impact',
      ],
      before: 42,
      after: 87,
    },
    banking: {
      icon: TrendingUp,
      title: 'For Investment Banking Role',
      keywords: 'Financial management, ROI, stakeholder coordination, deadline execution',
      tailored: 'Managed ₹5 lakh budget for college tech fest (500+ attendees), achieving 15% cost savings through vendor negotiations and sponsorship deals; delivered project under budget and on time while coordinating with 10 team members and 20+ external stakeholders',
      changes: [
        'Led with: "Managed ₹5L budget" (banking cares about money)',
        'Added: "Cost savings," "vendor negotiations," "sponsorship deals" (financial acumen)',
        'Emphasized: "Under budget and on time" (execution discipline)',
        'Frame: Shows financial management and stakeholder coordination',
      ],
      before: 42,
      after: 84,
    },
    pm: {
      icon: Package,
      title: 'For Product Management Role',
      keywords: 'User research, roadmap, cross-functional collaboration, metrics, iteration',
      tailored: 'Defined event roadmap for college tech fest based on user research (surveys from 200+ students); collaborated with cross-functional team of 10 (marketing, tech, ops) to execute 3-day event with 500+ attendees; iterated on feedback (post-event NPS: 8.5/10) to improve future versions',
      changes: [
        'Added: "roadmap," "user research," "cross-functional," "NPS" (PM keywords)',
        'Emphasized: "Collaborated," "iterated on feedback" (PM is about teamwork and iteration)',
        'Quantified: "NPS score" (PMs love product metrics)',
        'Frame: Shows product thinking and user-centric approach',
      ],
      before: 42,
      after: 89,
    },
  };

  const currentFraming = framings[activeTab];
  const Icon = currentFraming.icon;

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-black text-secondary mb-4">
            Same Experience, Different Framing
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            See how RefineCV helps you reframe the SAME bullet point for Consulting vs Banking vs Product Management
          </p>
        </div>

        <div className="bg-background rounded-2xl p-6 lg:p-8 mb-8">
          <div className="mb-6">
            <h3 className="font-bold text-secondary mb-3">Original Generic Bullet:</h3>
            <div className="bg-white rounded-lg p-4 border-2 border-gray-300">
              <p className="text-gray-700 italic">{originalBullet}</p>
            </div>
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('consulting')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold whitespace-nowrap transition-all ${
                activeTab === 'consulting'
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Briefcase className="w-5 h-5" />
              Consulting
            </button>
            <button
              onClick={() => setActiveTab('banking')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold whitespace-nowrap transition-all ${
                activeTab === 'banking'
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              Banking
            </button>
            <button
              onClick={() => setActiveTab('pm')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold whitespace-nowrap transition-all ${
                activeTab === 'pm'
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Package className="w-5 h-5" />
              Product Management
            </button>
          </div>

          <div className="bg-white rounded-xl p-6 lg:p-8 border-2 border-primary/20">
            <div className="flex items-start gap-3 mb-4">
              <Icon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-black text-secondary mb-2">{currentFraming.title}</h3>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">JD Keywords Detected:</span> {currentFraming.keywords}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-bold text-secondary mb-3">RefineCV Tailored Version:</h4>
              <div className="bg-primary/5 rounded-lg p-4 border-2 border-primary/20">
                <p className="text-gray-700 leading-relaxed">{currentFraming.tailored}</p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-bold text-secondary mb-3 flex items-center gap-2">
                What Changed
                <span className="text-xs font-normal text-gray-600">(Highlighted changes)</span>
              </h4>
              <ul className="space-y-2">
                {currentFraming.changes.map((change, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                    <span className="text-gray-700">{change}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-r from-error/10 to-success/10 rounded-lg p-4 border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Match Score Journey:</p>
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-2xl font-black text-error">{currentFraming.before}%</span>
                      <span className="text-xs text-gray-600 ml-1">before</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-primary" />
                    <div>
                      <span className="text-2xl font-black text-success">{currentFraming.after}%</span>
                      <span className="text-xs text-gray-600 ml-1">after</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-success">+{currentFraming.after - currentFraming.before}%</p>
                  <p className="text-xs text-gray-600">improvement</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 rounded-2xl p-6 lg:p-8 border-2 border-primary/20">
          <div className="flex items-start gap-4">
            <div className="text-4xl">💡</div>
            <div className="flex-1">
              <h3 className="text-xl font-black text-secondary mb-4">Same Experience. Three Different Stories.</h3>
              <div className="space-y-3 text-gray-700">
                <p>Your college fest leadership demonstrates:</p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-primary/20">
                    <p className="font-bold text-primary mb-2">For Consulting:</p>
                    <p className="text-sm">Structured problem-solving</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-primary/20">
                    <p className="font-bold text-primary mb-2">For Banking:</p>
                    <p className="text-sm">Financial management</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-primary/20">
                    <p className="font-bold text-primary mb-2">For PM:</p>
                    <p className="text-sm">Product roadmap execution</p>
                  </div>
                </div>
                <p className="text-lg font-semibold text-secondary mt-4">
                  RefineCV helps you emphasize the RIGHT aspects for EACH role—in 15 minutes, not 3 hours.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <a
            href="#signup"
            className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-xl font-black text-lg hover:scale-105 hover:shadow-xl transition-all"
          >
            Tailor My CV for Any Role
            <ArrowRight className="w-6 h-6" />
          </a>
        </div>
      </div>
    </section>
  );
}
