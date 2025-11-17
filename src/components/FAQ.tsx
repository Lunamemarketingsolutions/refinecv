import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Is RefineCV free to use?',
      answer: 'Yes! RefineCV offers a free tier with 3 analyses per day. You can upgrade to Premium anytime for unlimited access and advanced features.',
    },
    {
      question: 'How is RefineCV different from ChatGPT?',
      answer: 'RefineCV is trained specifically on 600+ elite IIM CVs and understands the Indian MBA job market. We provide structured, ATS-focused analysis with actionable recommendations—not generic AI responses.',
    },
    {
      question: 'Is my CV data safe and secure?',
      answer: 'Absolutely. Your CV data is encrypted, never shared with third parties, and you can delete it anytime. We\'re GDPR-compliant and take data privacy seriously.',
    },
    {
      question: 'What does "ATS score" mean?',
      answer: 'Your ATS (Applicant Tracking System) score indicates how well automated systems can read and parse your CV. Higher scores mean better chances of passing initial screening.',
    },
    {
      question: 'Can I use RefineCV for non-MBA jobs?',
      answer: 'Yes! While our AI is trained on MBA CVs, the principles apply to any professional CV. We\'re expanding training data for other industries soon.',
    },
    {
      question: 'Do you support languages outside of English?',
      answer: 'Currently, RefineCV supports English only. We\'re working on Hindi and other Indian language support for future releases.',
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-secondary mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about RefineCV
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:border-primary/30 transition-colors"
            >
              <button
                className="w-full px-6 py-5 flex items-center justify-between text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-lg font-bold text-secondary pr-4">
                  {faq.question}
                </span>
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  {openIndex === index ? (
                    <Minus className="w-5 h-5 text-primary" />
                  ) : (
                    <Plus className="w-5 h-5 text-primary" />
                  )}
                </div>
              </button>

              {openIndex === index && (
                <div className="px-6 pb-5">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
