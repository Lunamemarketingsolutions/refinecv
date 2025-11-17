import { Eye, Link, Wand2, Search, Users, BarChart, MessageSquare, FileText } from 'lucide-react';

export default function FeatureTools() {
  const tools = [
    { icon: Eye, title: 'CV → ATS View', description: 'See your resume through ATS systems' },
    { icon: Link, title: 'JD → CV Comparison', description: 'Match your CV to job requirements' },
    { icon: Wand2, title: 'CV Improviser', description: 'Get intelligent improvement suggestions' },
    { icon: Search, title: 'Find Jobs', description: 'Discover relevant job opportunities' },
    { icon: Users, title: 'Find Connections', description: 'Connect with referrals on LinkedIn' },
    { icon: BarChart, title: 'Dashboard with ATS Score', description: 'Track your CV performance metrics' },
    { icon: MessageSquare, title: 'Interview Prep Topics', description: 'Prepare for common interview questions' },
    { icon: FileText, title: 'Create CV', description: 'Build a professional CV from scratch' },
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 text-secondary">
            What Can It Do?
          </h2>
          <p className="text-xl text-gray-600">
            Comprehensive tools to optimize every aspect of your job search
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-gray-100"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <tool.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-secondary">
                {tool.title}
              </h3>
              <p className="text-sm text-gray-600">
                {tool.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
