import { Quote } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      quote: "Finally, a tool that understands what students need. The step-by-step improvement plan was so clear and actionable.",
      name: "Sneha Kapoor",
      details: "Marketing • DU",
      initials: "SK",
    },
    {
      quote: "I went from 0 interview calls to 6 shortlists in 2 weeks. RefineCV showed me exactly what recruiters wanted to see.",
      name: "Arjun Reddy",
      details: "Finance • IIM Lucknow",
      initials: "AR",
    },
    {
      quote: "The JD comparison feature is a game-changer. I now tailor my CV for every application in minutes.",
      name: "Priya Mehta",
      details: "Operations • XLRI",
      initials: "PM",
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-secondary mb-4">
            Student Success Stories
          </h2>
          <p className="text-xl text-gray-600">
            Join thousands of students who transformed their job search with RefineCV
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow border border-gray-100 relative"
            >
              <Quote className="w-12 h-12 text-primary/20 mb-4" />

              <p className="text-lg text-secondary mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  {testimonial.initials}
                </div>
                <div>
                  <div className="font-bold text-secondary">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.details}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
