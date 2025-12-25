import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function ATSFaq() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const faqs = [
    {
      id: 'difference',
      question: "How is RefineCV's ATS score different from Jobscan or Resume Worded?",
      answer: "RefineCV is trained specifically on Indian MBA placements, not US corporate jobs. We analyze not just ATS compatibility but also verification requirements, one-page optimization, and India-specific formatting norms. Generic tools give you a score; we give you a roadmap.",
    },
    {
      id: 'rejection',
      question: 'I scored 85% on another ATS checker but still got rejected. Why?',
      answer: "ATS pass rate is only half the battle. RefineCV also checks: (1) Can humans read your CV quickly? (2) Are your achievements verifiable? (3) Does your CV match the specific JD? (4) Is your formatting optimized for Indian B-school standards? We go beyond basic ATS compatibility.",
    },
    {
      id: 'accuracy',
      question: 'How accurate is your ATS interpretation?',
      answer: "Our ATS simulator is based on the most common ATS systems used in India (Taleo, Workday, Greenhouse, BambooHR). We replicate their parsing logic with 95%+ accuracy. What you see in our ATS view is what recruiters' systems see.",
    },
    {
      id: 'non-mba',
      question: 'Can I use RefineCV for non-MBA jobs?',
      answer: "Yes! While we're optimized for MBA placements, our ATS analyzer works for any role. The split-panel view, issue detection, and auto-fix features are universal.",
    },
    {
      id: 'keywords',
      question: 'Does RefineCV help with keyword optimization?',
      answer: "Absolutely. Upload your CV + job description, and we'll show you: (1) Which keywords you're missing, (2) Where to naturally integrate them, (3) How to avoid keyword stuffing that triggers ATS spam filters. Our JD CV Match Analyzer complements the ATS Analyzer perfectly.",
    },
    {
      id: 'speed',
      question: 'How long does ATS analysis take?',
      answer: 'Instant. Upload your CV and see your ATS score, split-panel view, and detailed issue breakdown in under 10 seconds. No waiting for reports or emails.',
    },
    {
      id: 'formats',
      question: 'What file formats work with RefineCV?',
      answer: 'We support PDF and Word (.docx) files. We recommend PDF for final applications (preserves formatting) but .docx for editing. Both are ATS-compatible when formatted correctly.',
    },
    {
      id: 'guarantee',
      question: "What if my CV still doesn't pass ATS after using RefineCV?",
      answer: 'If you follow all our recommendations and still face ATS rejections, email us at refinecvhelp@gmail.com with your CV and the job link. We\'ll personally review and provide additional guidance. We\'re committed to your success.',
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-black text-secondary mb-4">
            ATS Analyzer FAQs
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about our ATS analysis
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-background rounded-xl border-2 border-gray-200 overflow-hidden hover:border-primary/30 transition-colors"
            >
              <button
                onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-white/50 transition-colors"
              >
                <h3 className="font-bold text-secondary text-lg pr-4">
                  {faq.question}
                </h3>
                {expandedId === faq.id ? (
                  <ChevronUp className="w-6 h-6 text-primary flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-primary flex-shrink-0" />
                )}
              </button>

              {expandedId === faq.id && (
                <div className="px-6 pb-6">
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
