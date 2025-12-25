import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Check, X, Target, Clock, TrendingUp, Shield, RefreshCw, Award,
  Building, ChevronDown, Infinity, AlertCircle
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Pricing() {
  const location = useLocation();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [applications, setApplications] = useState(10);
  const [ctc, setCTC] = useState(12);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [limitMessage, setLimitMessage] = useState<string | null>(null);
  const [toolName, setToolName] = useState<string | null>(null);

  useEffect(() => {
    // Check if user was redirected due to usage limit
    if (location.state) {
      const state = location.state as { message?: string; toolName?: string };
      if (state.message) {
        setLimitMessage(state.message);
        setToolName(state.toolName || null);
      }
    }
  }, [location]);

  const timeSaved = (applications * 3) - (applications * 0.25);
  const monthlySavings = ctc / 12;
  const roi = monthlySavings - 0.499;

  const freeFeatures = [
    { included: true, text: '3 CV analyses per day' },
    { included: true, text: 'Basic ATS score (overall percentage only)' },
    { included: true, text: 'Basic JD match percentage (match % only)' },
    { included: true, text: 'Limited CV suggestions (1-2 per section, no AI rephrasing)' },
    { included: true, text: 'Basic dashboard access' },
    { included: true, text: 'Community support' },
    { included: false, text: 'Section-wise detailed ratings' },
    { included: false, text: 'AI-powered bullet point rephrasing' },
    { included: false, text: 'Detailed CV vs JD analysis' },
    { included: false, text: 'ATS viewer with formatting insights' },
    { included: false, text: 'Job matching engine' },
    { included: false, text: 'LinkedIn connection suggestions' },
    { included: false, text: 'Export reports (PDF)' },
    { included: false, text: 'Historical CV tracking' },
    { included: false, text: 'Priority support' },
  ];

  const premiumFeatures = [
    'Unlimited CV analyses (no daily limit)',
    'Advanced ATS score breakdown (section-wise analysis)',
    'Section-wise detailed ratings (rate every CV section)',
    'AI-powered bullet point rephrasing (authentic suggestions)',
    'Complete CV vs JD analysis (strengths, weaknesses, recommendations)',
    'ATS viewer with formatting insights (see what ATS sees)',
    'Job matching engine (find relevant openings)',
    'LinkedIn connection intelligence (networking suggestions)',
    'Export reports as PDF (download and share)',
    'Historical CV tracking (version history)',
    'Multiple CV versions (manage different CVs)',
    'Priority email support (24-hour response)',
    'Early access to new features',
  ];

  const valueCards = [
    {
      icon: Target,
      title: 'Land More Interviews',
      stat: '3.5x',
      description: 'Premium users get 3.5x more interview calls with tailored CVs for each JD',
      quote: '"I went from 2 interviews to 7 in one month"',
      author: '- Arjun, IIM Bangalore',
    },
    {
      icon: Clock,
      title: 'Save Time',
      stat: '15 min',
      description: 'Create a perfectly tailored CV in just 15 minutes vs. 3+ hours manually',
      quote: '"Saved me hours during placement season"',
      author: '- Priya, XLRI',
    },
    {
      icon: TrendingUp,
      title: 'Better Offers',
      stat: '45%',
      description: 'Average ATS score improvement for Premium users vs. 15% for Free',
      quote: '"Got into my dream consulting firm"',
      author: '- Rahul, IIM Ahmedabad',
    },
  ];

  const successStories = [
    {
      before: 'Free Plan: Basic score, generic CV, 2 interview calls',
      after: 'Premium: 86% ATS score, tailored for consulting, 8 shortlists',
      quote: 'The JD comparison feature showed me exactly what McKinsey looks for. I tailored every bullet point.',
      name: 'Sneha K.',
      detail: 'IIM Kozhikode → McKinsey',
    },
    {
      before: 'Stuck at 45% ATS score, no idea what was wrong',
      after: 'Jumped to 89% with Premium\'s formatting fixes',
      quote: 'The ATS viewer revealed my contact info wasn\'t being parsed. Fixed it in 5 minutes.',
      name: 'Aditya M.',
      detail: 'XLRI → Goldman Sachs',
    },
    {
      before: 'Sent same CV to 30 companies, 1 response',
      after: 'Tailored CVs with Premium, 12 responses from 20 applications',
      quote: 'Job matching + LinkedIn connections = I networked my way into Google. Worth every rupee.',
      name: 'Riya P.',
      detail: 'ISB → Google',
    },
  ];

  const faqs = [
    {
      question: 'Is the Free plan really free forever?',
      answer: 'Yes! The Free plan is 100% free forever. No credit card required. No hidden fees. 3 CV analyses per day, forever.',
    },
    {
      question: 'What happens after the 7-day Premium trial?',
      answer: 'You\'ll be charged ₹499/month (or ₹4,999/year if you chose annual). You can cancel anytime during the trial with zero charges.',
    },
    {
      question: 'Can I upgrade from Free to Premium anytime?',
      answer: 'Absolutely! Upgrade with one click from your dashboard. Your Free analyses don\'t count against Premium limits.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept UPI, credit/debit cards, net banking, and wallets (Paytm, PhonePe, Google Pay). All payments are secure and encrypted.',
    },
    {
      question: 'Is there a student discount?',
      answer: 'Our launch offer (₹499 instead of ₹999) IS our student pricing! We\'ve priced Premium affordably for MBA students. Bulk discounts available for college placement cells.',
    },
    {
      question: 'Can I cancel my Premium subscription anytime?',
      answer: 'Yes. Cancel anytime from your account settings. You\'ll retain Premium access until the end of your billing period. No cancellation fees.',
    },
    {
      question: 'What\'s included in the 7-day free trial?',
      answer: 'Full access to all Premium features: unlimited analyses, job matching, LinkedIn suggestions, export reports, priority support. No feature restrictions.',
    },
    {
      question: 'Do you offer refunds?',
      answer: 'Yes. If you\'re not satisfied, email us within 7 days of purchase for a full refund. No questions asked. See our Refund Policy for details.',
    },
    {
      question: 'What\'s the difference between monthly and annual billing?',
      answer: 'Monthly: ₹499/month, billed monthly. Annual: ₹4,999/year (₹416/month), billed once. Annual saves you 25% + 2 extra months free.',
    },
    {
      question: 'Can I switch between monthly and annual plans?',
      answer: 'Yes! Upgrade to annual anytime to save 25%. Downgrades take effect at the end of your current billing cycle.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Usage Limit Banner */}
        {limitMessage && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-20 mx-4 sm:mx-6 lg:mx-8 rounded-r-lg shadow-sm">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5 mr-3" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-yellow-800 mb-1">
                  Usage Limit Reached
                </h3>
                <p className="text-yellow-700">
                  {limitMessage}
                </p>
                {toolName && (
                  <p className="text-sm text-yellow-600 mt-2">
                    Upgrade to premium to continue using {toolName} and get unlimited access to all features.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-to-b from-primary/10 to-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-block mb-6">
              <span className="bg-primary text-white px-6 py-2 rounded-full text-sm font-semibold">
                Simple, Transparent Pricing
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-secondary mb-6">
              Choose Your Plan
            </h1>

            <p className="text-xl text-gray-600 mb-8">
              Start free, upgrade when you're ready. No credit card required. No hidden fees.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className={`font-semibold ${billingCycle === 'monthly' ? 'text-primary' : 'text-gray-600'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                className="relative w-16 h-8 bg-gray-300 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                style={{ backgroundColor: billingCycle === 'annual' ? '#2762ea' : '#D1D5DB' }}
              >
                <div
                  className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow transition-transform"
                  style={{ transform: billingCycle === 'annual' ? 'translateX(32px)' : 'translateX(0)' }}
                />
              </button>
              <span className={`font-semibold ${billingCycle === 'annual' ? 'text-primary' : 'text-gray-600'}`}>
                Annual
              </span>
              {billingCycle === 'annual' && (
                <span className="bg-success text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                  Save 25%
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 items-stretch">
              {/* Free Plan */}
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 lg:p-10 shadow-lg">
                <div className="mb-6">
                  <span className="bg-success text-white px-4 py-1 rounded-full text-sm font-semibold">
                    FREE FOREVER
                  </span>
                </div>

                <h2 className="text-3xl font-black text-secondary mb-2">Free</h2>
                <p className="text-gray-600 mb-6">Get started with CV basics</p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black text-secondary">₹0</span>
                    <span className="text-xl text-gray-600">/month</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Forever free • No credit card needed</p>
                </div>

                <button className="w-full border-2 border-primary text-primary py-4 rounded-lg font-bold text-lg hover:bg-primary/5 transition-all mb-8">
                  Get Started Free
                </button>

                <div>
                  <h3 className="font-bold text-secondary mb-4">What's included:</h3>
                  <div className="space-y-3">
                    {freeFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={feature.included ? 'text-secondary' : 'text-gray-400'}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-sm text-gray-600 mt-6 text-center">
                  Perfect for trying out RefineCV
                </p>
              </div>

              {/* Premium Plan */}
              <div className="relative bg-gradient-to-br from-primary to-primary/90 rounded-2xl p-8 lg:p-10 shadow-2xl lg:scale-105 text-white">
                <div className="absolute -top-4 right-8">
                  <span className="bg-white text-primary px-4 py-2 rounded-full text-xs font-bold uppercase">
                    MOST POPULAR
                  </span>
                </div>

                <div className="mb-6">
                  <span className="bg-white text-primary px-4 py-1 rounded-full text-sm font-semibold animate-pulse">
                    LAUNCH OFFER
                  </span>
                </div>

                <h2 className="text-3xl font-black mb-2">Premium</h2>
                <p className="text-white/90 mb-6">Everything you need to land your dream job</p>

                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl line-through opacity-70">
                      ₹{billingCycle === 'monthly' ? '999' : '9,999'}
                    </span>
                    <span className="bg-success text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Save 50%{billingCycle === 'annual' ? ' + 2 Months Free' : ''}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black">
                      ₹{billingCycle === 'monthly' ? '499' : '4,999'}
                    </span>
                    <span className="text-xl opacity-80">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                  </div>
                  {billingCycle === 'annual' && (
                    <p className="text-sm opacity-70 mt-2">₹416/month when billed annually</p>
                  )}
                </div>

                <button className="w-full bg-white text-primary py-4 rounded-lg font-bold text-lg hover:scale-105 hover:shadow-2xl transition-all mb-2">
                  Start Premium Trial
                </button>
                <p className="text-sm text-center opacity-80 mb-8">7-day free trial • Cancel anytime</p>

                <div>
                  <h3 className="font-bold mb-4">Everything in Free, plus:</h3>
                  <div className="space-y-3">
                    {premiumFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-sm opacity-80 mt-6 text-center">
                  Everything an MBA student needs to succeed
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-secondary mb-4">
                Why Students Upgrade to Premium
              </h2>
              <p className="text-xl text-gray-600">
                Real results from MBA students who chose Premium
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {valueCards.map((card, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <card.icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-2xl font-bold text-secondary mb-4">{card.title}</h3>
                  <div className="text-5xl font-black text-primary mb-4">{card.stat}</div>
                  <p className="text-gray-600 mb-4">{card.description}</p>
                  <div className="border-t pt-4 mt-4">
                    <p className="italic text-gray-600 text-sm mb-1">{card.quote}</p>
                    <p className="text-primary font-semibold text-sm">{card.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ROI Calculator */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-secondary mb-4">
                See Your Return on Investment
              </h2>
              <p className="text-xl text-gray-600">
                Calculate how Premium pays for itself
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-lg">
              <div className="space-y-8">
                <div>
                  <label className="block text-secondary font-semibold mb-4">
                    How many jobs do you apply to per month?
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={applications}
                    onChange={(e) => setApplications(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="text-center mt-2">
                    <span className="text-2xl font-bold text-primary">{applications}</span>
                    <span className="text-gray-600"> applications</span>
                  </div>
                </div>

                <div>
                  <label className="block text-secondary font-semibold mb-4">
                    Value of landing your dream job (annual CTC):
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={ctc}
                    onChange={(e) => setCTC(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="text-center mt-2">
                    <span className="text-2xl font-bold text-primary">₹{ctc}</span>
                    <span className="text-gray-600"> lakhs</span>
                  </div>
                </div>

                <div className="bg-primary text-white rounded-xl p-8 mt-8">
                  <h3 className="text-2xl font-bold mb-6 text-center">Your ROI Breakdown</h3>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg">Time Saved:</span>
                      <span className="text-2xl font-bold">{timeSaved.toFixed(1)} hours/month</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-lg">Interview Success Rate:</span>
                      <span className="text-2xl font-bold">+250%</span>
                    </div>

                    <div className="flex justify-between items-center border-t border-white/20 pt-4">
                      <span className="text-lg">Premium Cost:</span>
                      <span className="text-xl font-semibold">₹499/month</span>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4 mt-4">
                      <p className="text-lg font-semibold text-center">
                        If Premium helps you land your job even 1 month faster, you save ₹{monthlySavings.toFixed(1)} lakhs
                      </p>
                    </div>
                  </div>

                  <div className="bg-success text-white rounded-lg p-4 mt-6 text-center">
                    <p className="text-xl font-bold">Premium pays for itself in your first application</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-secondary mb-4">
                Success Stories from Premium Users
              </h2>
              <p className="text-xl text-gray-600">
                See how Premium transformed their placement journey
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {successStories.map((story, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="mb-4">
                    <div className="text-sm font-semibold text-gray-500 mb-2">BEFORE:</div>
                    <p className="text-gray-600">{story.before}</p>
                  </div>

                  <div className="mb-4 pb-4 border-b">
                    <div className="text-sm font-semibold text-success mb-2">AFTER:</div>
                    <p className="text-secondary font-semibold">{story.after}</p>
                  </div>

                  <p className="italic text-gray-600 mb-4">{story.quote}</p>

                  <div>
                    <p className="font-bold text-secondary">{story.name}</p>
                    <p className="text-primary text-sm">{story.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-secondary mb-4">
                Pricing FAQs
              </h2>
              <p className="text-xl text-gray-600">
                Common questions about plans and billing
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-bold text-secondary pr-4">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-primary flex-shrink-0 transition-transform ${
                        openFaq === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Signals */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl font-black text-secondary text-center mb-12">
              Trusted by 5,000+ MBA Students
            </h3>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                <div className="text-xl font-bold text-secondary mb-1">Secure Payments</div>
                <div className="text-gray-600">256-bit SSL encryption</div>
              </div>

              <div className="text-center">
                <RefreshCw className="w-12 h-12 text-primary mx-auto mb-4" />
                <div className="text-xl font-bold text-secondary mb-1">7-Day Money Back</div>
                <div className="text-gray-600">No questions asked</div>
              </div>

              <div className="text-center">
                <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                <div className="text-xl font-bold text-secondary mb-1">99% Satisfaction</div>
                <div className="text-gray-600">Based on user surveys</div>
              </div>
            </div>
          </div>
        </section>

        {/* Enterprise Plans */}
        <section className="py-20 lg:py-32 bg-primary text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Building className="w-16 h-16 mx-auto mb-6" />

            <h2 className="text-4xl sm:text-5xl font-black mb-6">
              College Placement Cell or Student Club?
            </h2>

            <p className="text-xl opacity-90 mb-8">
              Get special pricing for bulk licenses, custom features, and dedicated support for your entire student body.
            </p>

            <div className="bg-white/10 rounded-xl p-8 mb-8 text-left max-w-2xl mx-auto">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 mt-1" />
                  <span>Custom branding for your college</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 mt-1" />
                  <span>Bulk licenses at 40% discount</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 mt-1" />
                  <span>Dedicated account manager</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 mt-1" />
                  <span>Custom analytics dashboard</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 mt-1" />
                  <span>White-label options available</span>
                </div>
              </div>
            </div>

            <button className="bg-white text-primary px-10 py-4 rounded-lg text-lg font-bold hover:scale-105 hover:shadow-2xl transition-all mb-4">
              Contact for Enterprise Pricing
            </button>

            <p className="text-sm opacity-80">
              Email: refinecvhelp@gmail.com
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 lg:py-32 bg-background">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl sm:text-5xl font-black text-secondary mb-6">
              Ready to Transform Your CV?
            </h2>

            <p className="text-xl text-gray-600 mb-12">
              Join 5,000+ MBA students who've upgraded their placement game with RefineCV Premium.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <div className="text-center">
                <button className="bg-primary text-white px-10 py-4 rounded-lg text-lg font-bold hover:scale-105 hover:shadow-xl transition-all">
                  Start Premium Trial
                </button>
                <p className="text-sm text-gray-600 mt-2">7-day free trial • No credit card</p>
              </div>

              <div className="text-center">
                <button className="border-2 border-primary text-primary px-10 py-4 rounded-lg text-lg font-bold hover:bg-primary/5 transition-all">
                  Start with Free Plan
                </button>
                <p className="text-sm text-gray-600 mt-2">3 analyses/day forever</p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-success" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-success" />
                <span>7-day money back</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-success" />
                <span>No hidden fees</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
