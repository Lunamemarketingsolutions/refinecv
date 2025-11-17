import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function EnhancerFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Will AI-enhanced bullets sound robotic or fake?",
      answer: "No! RefineCV generates 3-5 versions per bullet so you can choose what feels authentic to your voice. We also preserve your industry context and role type. If you're in consulting, bullets emphasize structured problem-solving. If you're in product, bullets emphasize user research and roadmaps. You're always in control."
    },
    {
      question: "How does RefineCV suggest metrics without making them up?",
      answer: "Our AI asks for your context: 'What was the starting point? What did you achieve?' Then it frames your actual numbers in achievement-driven language. Example: You say 'we had 100 users, reached 150.' AI suggests: 'Grew user base by 50% (100 to 150 users) through...' The numbers are yours; the framing is AI-powered."
    },
    {
      question: "What if I don't have metrics for an experience?",
      answer: "AI helps you find hidden metrics. Example: 'Organized college event' → AI asks: 'How many attendees? Budget? Team size? Sponsors?' Even if you don't have revenue numbers, you have scope (team size, time, participants). AI helps you quantify what you CAN verify."
    },
    {
      question: "Can I use this for internships and projects, not just full-time jobs?",
      answer: "Absolutely! RefineCV works for all CV sections: internships, projects, college leadership, volunteering, extracurriculars. The AI understands context—intern bullet points will have realistic scope (500 users, not 500K users)."
    },
    {
      question: "How does the section-by-section approach work?",
      answer: "You move through your CV progressively: Personal Info → Work Experience → Education → Projects → Leadership → Skills. Each section gets rated (1-5 stars), and AI suggests improvements. You see a progress bar at the top and an overall CV score that updates as you enhance each section."
    },
    {
      question: "What if I want to edit AI suggestions manually?",
      answer: "Every AI suggestion is editable! Click 'Edit Manually' and you get a text editor with formatting options (bold, italics, bullets). Make any changes you want. The live CV preview updates instantly."
    },
    {
      question: "Is the live CV preview accurate to how my final CV will look?",
      answer: "Yes! The preview mirrors standard CV formatting (fonts, spacing, sections). What you see is what you get. You can zoom in/out, and when you're done, click 'Download PDF' to get your formatted CV exactly as previewed."
    },
    {
      question: "How many bullet points can I enhance?",
      answer: "Free users: 3 bullets per day (enough to test the feature). Premium: Unlimited. For full CV enhancement (15-25 bullets), Premium is recommended."
    },
    {
      question: "Will RefineCV help with verification-safe bullet points?",
      answer: "Yes! If you write 'Increased revenue by 500%,' AI flags it: '⚠️ High number—may be hard to verify. Do you have documentary proof?' If you write realistic numbers with context, AI approves: '✓ Verification-safe: 20% increase with documented baseline.'"
    },
    {
      question: "Can I save multiple CV versions (Consulting CV, Banking CV, PM CV)?",
      answer: "Yes! Save different versions: 'Consulting CV' emphasizes structured thinking, 'PM CV' emphasizes user research and roadmaps. Each version has separate enhancement history. Compare versions side-by-side to see which scores higher for each role type."
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-black text-secondary mb-4">
            Instant CV Enhancer FAQs
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-bold text-secondary pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-primary flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
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
