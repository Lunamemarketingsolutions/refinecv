import { Star, User } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      quote:
        "I went from 62% to 91% in 3 sessions. The AI feedback was so specific—it told me exactly which parts of my answers were weak. I got the Google PM offer!",
      name: 'Priya Sharma',
      school: 'IIM Bangalore',
      role: 'Product Manager at Google',
    },
    {
      quote:
        'The STAR framework coaching was game-changing. I finally understood how to structure behavioral answers. Practiced 2 sessions, aced my McKinsey interview.',
      name: 'Rahul Verma',
      school: 'ISB Hyderabad',
      role: 'Consultant at McKinsey',
    },
    {
      quote:
        "Best interview prep tool I've used. The real-time feedback is like having a personal coach. Improved my confidence 10x.",
      name: 'Anjali Mehta',
      school: 'XLRI Jamshedpur',
      role: 'Investment Banking Analyst at Goldman Sachs',
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-secondary mb-4">
            What Users Say
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all"
            >
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-5 h-5 text-amber-400 fill-amber-400"
                  />
                ))}
              </div>

              <p className="text-gray-700 italic mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-secondary">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-600">{testimonial.school}</p>
                  <p className="text-xs text-purple-600 font-medium">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
