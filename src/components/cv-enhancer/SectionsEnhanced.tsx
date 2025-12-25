export default function SectionsEnhanced() {
  const sections = [
    {
      emoji: '💼',
      title: 'Work Experience',
      description: 'Weak verbs → Action verbs, No metrics → Quantified impact',
    },
    {
      emoji: '🎓',
      title: 'Education',
      description: 'Just degree → Add GPA, coursework, achievements',
    },
    {
      emoji: '📁',
      title: 'Projects',
      description: 'Technical only → Add user impact, business context',
    },
    {
      emoji: '💻',
      title: 'Skills',
      description: 'Simple list → Add proficiency levels, years of experience',
    },
    {
      emoji: '👥',
      title: 'Leadership',
      description: 'Title only → Add team size, impact, outcomes',
    },
    {
      emoji: '🏆',
      title: 'Certifications',
      description: 'Just listed → Add relevance, skills demonstrated',
    },
  ];

  return (
    <section className="py-16 lg:py-20 bg-white rounded-xl shadow-sm mt-12">
      <div className="max-w-[calc(95%+96px)] lg:max-w-[calc(90%+96px)] xl:max-w-[calc(85%+96px)] mx-auto px-6 sm:px-8 lg:px-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-[#0F1C2A] mb-12 lg:mb-16 text-center" style={{ fontFamily: 'Lato, sans-serif' }}>
          What CV Sections Get Enhanced?
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          {sections.map((section, index) => {
            return (
              <div
                key={index}
                className="bg-[#F7F7FE] rounded-xl p-8 border-2 border-gray-200 hover:border-[#2782EA] transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center gap-4 mb-5">
                  <span className="text-4xl flex-shrink-0">{section.emoji}</span>
                  <h3 className="text-xl font-semibold text-[#0F1C2A] leading-tight flex-1" style={{ fontFamily: 'Lato, sans-serif' }}>
                    {section.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-base leading-relaxed" style={{ fontFamily: 'Lato, sans-serif' }}>
                  {section.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

