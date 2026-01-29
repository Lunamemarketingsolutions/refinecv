import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function InterviewFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How does the AI generate personalized questions?',
      answer:
        'Our AI analyzes your CV (experience, skills, achievements) and the job description (requirements, responsibilities, company) to create 20 questions tailored to YOUR profile. For example, if you have Amazon experience and are applying to a Google PM role, you\'ll get questions like: "How would you apply your Amazon experience to Google\'s product development process?"',
    },
    {
      question: 'Do I need to type my answers?',
      answer:
        "No! You answer using your voice, just like a real interview. Click the microphone button, speak your answer, and our AI evaluates it. This helps you practice delivery, pace, and articulation—not just content.",
    },
    {
      question: 'Is there a transcript of my answers?',
      answer:
        "Not yet. Transcript feature is planned for a future update. Currently, the AI evaluates your spoken answers in real-time and provides feedback, but you won't see a written transcript.",
    },
    {
      question: "What's the STAR framework?",
      answer:
        'STAR stands for Situation, Task, Action, Result. It\'s the gold standard for answering behavioral interview questions. Our AI checks if your answers include all 4 components and guides you to strengthen weak areas. Example:\n• Situation: "At Amazon, our app had 30% user drop-off"\n• Task: "I was tasked with improving retention"\n• Action: "I conducted user research, identified 3 pain points, prioritized fixes"\n• Result: "Reduced drop-off to 10%, increased retention by 25%"',
    },
    {
      question: 'How long does a practice session take?',
      answer:
        '30-45 minutes for all 20 questions. You can pause anytime and resume later. Each question takes 2-3 minutes to answer, plus 30 seconds for AI feedback.',
    },
    {
      question: 'Can I practice for different roles?',
      answer:
        'Yes! Upload different job descriptions for each session. Practice for PM roles, consulting cases, engineering interviews, marketing positions—any role. The AI adapts questions based on the JD you provide.',
    },
    {
      question: 'How many times can I practice?',
      answer:
        'Free tier: 2 sessions per month. Premium: Unlimited sessions. We recommend 2-3 sessions before your real interview to reach 85%+ readiness.',
    },
    {
      question: 'Is my data private?',
      answer:
        'Absolutely. Your CV and interview practice data are encrypted and never shared with third parties. See our Privacy Policy for details.',
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-secondary mb-4">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-all overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-lg text-secondary pr-4">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-6 h-6 text-purple-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0" />
                )}
              </button>

              {openIndex === index && (
                <div className="px-6 pb-4">
                  <div className="pt-2 text-gray-600 leading-relaxed whitespace-pre-line">
                    {faq.answer}
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
