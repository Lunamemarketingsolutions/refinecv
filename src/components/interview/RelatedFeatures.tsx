import { Link } from 'react-router-dom';
import { FileSearch, Target, Wand2, ArrowRight } from 'lucide-react';

export default function RelatedFeatures() {
  const features = [
    {
      icon: FileSearch,
      title: 'ATS Analyzer',
      description:
        'Check if your CV passes Applicant Tracking Systems. Get a detailed compatibility score and fix formatting issues.',
      link: '/features/ats-analyzer',
      color: 'border-blue-500 hover:border-blue-600',
      iconColor: 'text-blue-600',
    },
    {
      icon: Target,
      title: 'JD CV Match',
      description:
        'Match your CV to job descriptions. Find missing keywords and optimize your CV for specific roles.',
      link: '/features/jd-matcher',
      color: 'border-green-500 hover:border-green-600',
      iconColor: 'text-green-600',
    },
    {
      icon: Wand2,
      title: 'CV Enhancer',
      description:
        'Transform weak bullet points into powerful achievements. Get AI-powered suggestions to improve your CV.',
      link: '/features/cv-enhancer',
      color: 'border-purple-500 hover:border-purple-600',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-secondary mb-4">
            Complete Your CV Toolkit
          </h2>
          <p className="text-lg text-gray-600">
            Maximize your chances with our complete suite of CV tools
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.link}
              className={`bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all hover:scale-[1.05] border-l-4 ${feature.color} group`}
            >
              <feature.icon className={`w-12 h-12 ${feature.iconColor} mb-4`} />

              <h3 className="text-xl font-semibold text-secondary mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-600 leading-relaxed mb-4">
                {feature.description}
              </p>

              <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                <span>Learn More</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
