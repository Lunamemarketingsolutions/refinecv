import { Briefcase, GraduationCap, FolderOpen, Code, Users, Award } from 'lucide-react';

export default function SectionsEnhanced() {
  const sections = [
    {
      icon: Briefcase,
      emoji: '💼',
      title: 'Work Experience',
      description: 'Weak verbs → Action verbs, No metrics → Quantified impact',
    },
    {
      icon: GraduationCap,
      emoji: '🎓',
      title: 'Education',
      description: 'Just degree → Add GPA, coursework, achievements',
    },
    {
      icon: FolderOpen,
      emoji: '📁',
      title: 'Projects',
      description: 'Technical only → Add user impact, business context',
    },
    {
      icon: Code,
      emoji: '💻',
      title: 'Skills',
      description: 'Simple list → Add proficiency levels, years of experience',
    },
    {
      icon: Users,
      emoji: '👥',
      title: 'Leadership',
      description: 'Title only → Add team size, impact, outcomes',
    },
    {
      icon: Award,
      emoji: '🏆',
      title: 'Certifications',
      description: 'Just listed → Add relevance, skills demonstrated',
    },
  ];

  return (
    <section className="py-12 bg-white rounded-xl shadow-sm mt-8">
      <div className="max-w-6xl mx-auto px-8">
        <h2 className="text-3xl font-bold text-[#0F1C2A] mb-8 text-center" style={{ fontFamily: 'Lato, sans-serif' }}>
          What CV Sections Get Enhanced?
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <div
                key={index}
                className="bg-[#F7F7FE] rounded-lg p-6 border border-gray-200 hover:border-[#2782EA] transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{section.emoji}</span>
                  <IconComponent className="w-6 h-6 text-[#2782EA]" />
                  <h3 className="text-lg font-semibold text-[#0F1C2A]" style={{ fontFamily: 'Lato, sans-serif' }}>
                    {section.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm" style={{ fontFamily: 'Lato, sans-serif' }}>
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

