import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function JDFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How does RefineCV\'s keyword matching differ from just Ctrl+F in the JD?',
      answer: 'We don\'t just find exact keyword matches. Our AI understands synonyms ("led" = "managed" = "directed"), context ("Python for data analysis" vs "Python for web dev"), and prioritizes keywords by importance (mentioned 5x in JD = higher priority than mentioned 1x).',
    },
    {
      question: 'Will tailoring my CV for each JD make it look fake or keyword-stuffed?',
      answer: 'No! RefineCV suggests natural integration. Instead of stuffing "Machine Learning" 10 times, we suggest adding ONE authentic project: "Built ML model to predict customer churn." It\'s real experience, naturally phrased, that happens to match JD keywords.',
    },
    {
      question: 'Can I use this for non-MBA roles?',
      answer: 'Yes! JD CV Match works for any role. While we\'re optimized for MBA placements (consulting, banking, PM, marketing), the keyword analysis, match scoring, and tailoring suggestions work universally.',
    },
    {
      question: 'How many JDs can I analyze with my CV?',
      answer: 'Free users: 3 JD matches per day. Premium: Unlimited. During placement season with 50+ applications, Premium is essential.',
    },
    {
      question: 'Does RefineCV help me lie or exaggerate?',
      answer: 'Absolutely not. We help you reframe authentic experiences to match JD language. If the JD wants "stakeholder management" and your CV says "coordinated with clients," we suggest changing the phrasing—not inventing fake experience.',
    },
    {
      question: 'What if I don\'t have experience for a required keyword?',
      answer: 'RefineCV flags this as "High Priority Gap" and suggests: (1) Related experience you DO have that\'s close, (2) How to quickly build that experience (online course, project, volunteer work), (3) How to frame transferable skills.',
    },
    {
      question: 'How accurate is the match % score?',
      answer: 'Our match % is based on: (1) Keyword coverage (60% weight), (2) Experience relevance (25% weight), (3) Formatting/ATS compatibility (15% weight). An 85% match means you meet 85% of JD requirements as detected by our AI.',
    },
    {
      question: 'Can I save different CV versions for different roles?',
      answer: 'Yes! Save "Consulting CV," "Banking CV," "PM CV" and compare their match scores across different JDs. Track which version performs best for which roles.',
    },
    {
      question: 'How long does JD analysis take?',
      answer: 'Under 30 seconds. Upload CV, paste JD, get instant match %, keyword gaps, strengths/weaknesses, and action items.',
    },
    {
      question: 'What if I follow all recommendations but still don\'t get shortlisted?',
      answer: 'JD matching is one factor. Shortlisting also depends on profile (GPA, college, past companies). If you have 85%+ match but no responses, the issue may be ATS formatting (use our ATS Analyzer) or profile gaps (email us for personalized advice).',
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-black text-secondary mb-4">
            JD CV Match Analyzer FAQs
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-background rounded-xl border-2 border-primary/20 overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-primary/5 transition-colors"
              >
                <span className="font-bold text-secondary pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-primary flex-shrink-0 transition-transform ${
                    openIndex === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === idx && (
                <div className="px-6 py-4 bg-white border-t border-primary/10">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
