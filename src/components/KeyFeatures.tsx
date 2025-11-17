import { Star, Link, Shield, BarChart, Zap, Briefcase } from 'lucide-react';

export default function KeyFeatures() {
  const features = [
    {
      icon: Star,
      title: 'Laser-Sharp CV Point Rating',
      description: 'Every bullet point gets rated and improved with authentic suggestions from top IIM CVs.',
    },
    {
      icon: Link,
      title: 'Perfect Job-to-CV Match',
      description: 'See exactly how your CV aligns with each JD—strengths, gaps, and what to fix.',
    },
    {
      icon: Shield,
      title: 'Guaranteed ATS Approval',
      description: 'Preview exactly how ATS systems read your CV. Fix formatting issues before applying.',
    },
    {
      icon: BarChart,
      title: 'One-Page Profile Intelligence',
      description: 'Get a comprehensive dashboard with your ATS score, KPIs, and actionable recommendations.',
    },
    {
      icon: Zap,
      title: 'Zero-Effort Improvement Plan',
      description: 'Prioritized, doable recommendations that show you exactly what to improve—and why.',
    },
    {
      icon: Briefcase,
      title: 'Jobs That Actually Fit You',
      description: 'AI matches you with relevant openings + suggests LinkedIn connections for referrals.',
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-secondary mb-4">
            Why Students Love RefineCV
          </h2>
          <p className="text-xl text-gray-600">
            Discover the features that make RefineCV the go-to tool for landing your dream job
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
