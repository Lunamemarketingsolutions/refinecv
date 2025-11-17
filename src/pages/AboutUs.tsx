import { Eye, Link2, Wand2, TrendingUp, Clock, UserCheck, CheckCircle, Globe } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AboutUs() {
  const features = [
    {
      number: '01',
      icon: Eye,
      title: 'ATS Analyzer',
      description: 'Upload your CV and instantly see how Applicant Tracking Systems read it. Get your ATS score, identify formatting issues, and understand exactly what recruiters see versus what you intended. No more black-box rejections.',
    },
    {
      number: '02',
      icon: Link2,
      title: 'JD CV Match Analyzer',
      description: 'Upload your CV alongside any job description. Our AI identifies keyword matches, highlights skill gaps, pinpoints your strengths and weaknesses for that specific role, and provides doable recommendations to improve your match percentage.',
    },
    {
      number: '03',
      icon: Wand2,
      title: 'Instant CV Enhancer',
      description: 'Get section-by-section analysis of your CV with authentic improvement suggestions. Every bullet point is rated, weak phrases are identified, and you receive AI-powered rephrasing that maintains your authentic voice while amplifying impact.',
    },
  ];

  const trustSignals = [
    {
      title: 'Trained on Real Placements',
      description: '600+ CVs from successful IIM graduates at McKinsey, Goldman Sachs, Amazon, and more',
    },
    {
      title: 'Built for Indian MBA Market',
      description: 'Understands consulting vs. banking vs. product management CV nuances',
    },
    {
      title: 'Data-Driven, Not Opinion-Based',
      description: 'AI recommendations backed by actual placement patterns',
    },
    {
      title: 'Instant Feedback',
      description: 'Get insights in 30 seconds, not 3 weeks of waiting for seniors',
    },
    {
      title: 'Privacy-First',
      description: 'Your CV data is encrypted and never shared',
    },
  ];

  const metrics = [
    {
      icon: TrendingUp,
      stat: '45%',
      label: 'Average ATS Score Increase',
    },
    {
      icon: Clock,
      stat: 'Minutes',
      label: 'To Tailor CVs for Specific JDs',
    },
    {
      icon: UserCheck,
      stat: 'Zero',
      label: 'Waiting for Senior Feedback',
    },
  ];

  const countries = ['India', 'USA', 'Germany', 'Singapore', 'UAE', 'Canada', 'Australia'];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 lg:pb-24 bg-gradient-to-b from-primary/10 to-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-primary"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-primary"></div>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-block mb-6">
              <span className="bg-primary text-white px-6 py-2 rounded-full text-sm font-semibold">
                Our Story
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-secondary mb-6">
              About RefineCV
            </h1>

            <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto">
              AI-powered CV intelligence platform built specifically for Indian MBA students.
            </p>

            <div className="mt-8 flex justify-center">
              <div className="w-24 h-0.5 bg-primary"></div>
            </div>
          </div>
        </section>

        {/* Origin Story */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-12 items-center">
              <div className="lg:col-span-3 space-y-6">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-secondary mb-8">
                  How It Started
                </h2>

                <p className="text-lg text-secondary leading-relaxed">
                  We're a team of 11 AI engineers, data scientists, designers, and former recruiters from across 7 countries who came together while learning Generative AI. During our learning journey, two IIM Kozhikode members shared a persistent problem: despite having strong profiles, their generic CVs were getting rejected without clear feedback.
                </p>

                <p className="text-lg text-secondary leading-relaxed">
                  This sparked a deeper investigation. We interviewed students from IIM Ahmedabad, IIM Bangalore, XLRI, ISB, and other top B-schools. The pattern was clear—talented students were running to seniors, professors, and expensive consultants for CV advice, getting inconsistent feedback, and still facing rejections.
                </p>

                <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg my-8">
                  <p className="text-xl lg:text-2xl italic text-secondary">
                    "The problem wasn't talent. It was translation."
                  </p>
                </div>

                <p className="text-lg text-secondary leading-relaxed">
                  Students didn't know how to translate their experiences into the language recruiters speak: impact, metrics, and outcomes. Traditional CV feedback was slow, expensive, and subjective. Generic AI tools didn't understand the nuances of Indian MBA recruiting.
                </p>

                <p className="text-lg text-primary font-bold text-xl">
                  We decided to solve this.
                </p>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 shadow-lg">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-md text-center">
                      <Globe className="w-12 h-12 text-primary mx-auto mb-3" />
                      <div className="text-3xl font-black text-secondary mb-1">11</div>
                      <div className="text-sm text-gray-600">Team Members</div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-md text-center">
                      <Globe className="w-12 h-12 text-primary mx-auto mb-3" />
                      <div className="text-3xl font-black text-secondary mb-1">7</div>
                      <div className="text-sm text-gray-600">Countries</div>
                    </div>
                    <div className="col-span-2 bg-white rounded-xl p-6 shadow-md text-center">
                      <CheckCircle className="w-12 h-12 text-primary mx-auto mb-3" />
                      <div className="text-3xl font-black text-secondary mb-1">600+</div>
                      <div className="text-sm text-gray-600">Elite CVs Analyzed</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Solution */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-secondary mb-6">
                Our Solution
              </h2>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                RefineCV is trained on 600+ elite CVs from students who successfully placed at top companies. Our AI provides data-driven, actionable insights that help students craft tailored, ATS-ready CVs in minutes—not weeks.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-t-4 border-primary"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-black text-primary">{feature.number}</span>
                    </div>
                    <feature.icon className="w-10 h-10 text-primary" />
                  </div>

                  <h3 className="text-2xl font-bold text-secondary mb-4">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-20 lg:py-32 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-white"></div>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="mb-6">
              <span className="text-sm uppercase tracking-wider text-white/80">Our Mission</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-8">
              To democratize access to world-class CV insights for every MBA student—regardless of their network, background, or budget.
            </h2>

            <p className="text-xl text-white/90 leading-relaxed">
              We believe talent is universal, but opportunity isn't. RefineCV bridges that gap by making expert-level CV feedback accessible, affordable, and instant.
            </p>
          </div>
        </section>

        {/* Why RefineCV Works */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-secondary mb-4">
                Why RefineCV Works
              </h2>
              <div className="w-24 h-1 bg-primary mx-auto"></div>
            </div>

            <div className="space-y-6">
              {trustSignals.map((signal, index) => (
                <div
                  key={index}
                  className="bg-background rounded-xl p-6 flex items-start space-x-4 hover:shadow-lg transition-shadow duration-300"
                >
                  <CheckCircle className="w-8 h-8 text-success flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-secondary mb-2">
                      {signal.title}
                    </h3>
                    <p className="text-gray-600">
                      {signal.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The Team */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-secondary mb-6">
                The Team
              </h2>
              <p className="text-xl text-gray-600">
                United by one belief: Your CV shouldn't be a barrier. It should be a bridge to your dream career.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg">
              <p className="text-lg text-secondary leading-relaxed mb-8">
                We're engineers, data scientists, designers, recruiters, and MBA students from India, USA, Germany, Singapore, UAE, Canada, and Australia. We've built products at Google, Amazon, and startups. We've reviewed 50,000+ CVs. We've lived this problem firsthand.
              </p>

              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-5xl font-black text-primary mb-2">11</div>
                  <div className="text-sm uppercase tracking-wider text-gray-600">Team Members</div>
                </div>
                <div className="text-center border-x border-gray-200">
                  <div className="text-5xl font-black text-primary mb-2">7</div>
                  <div className="text-sm uppercase tracking-wider text-gray-600">Countries</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-black text-primary mb-2">50K+</div>
                  <div className="text-sm uppercase tracking-wider text-gray-600">CVs Reviewed</div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex flex-wrap justify-center gap-3">
                  {countries.map((country, index) => (
                    <span
                      key={index}
                      className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold"
                    >
                      {country}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-secondary mb-6">
                Join 5,000+ MBA Students
              </h2>
              <p className="text-xl text-gray-600">
                Students from IIM Ahmedabad, IIM Bangalore, IIM Calcutta, XLRI, ISB, and 50+ top B-schools trust RefineCV
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {metrics.map((metric, index) => (
                <div
                  key={index}
                  className="bg-background rounded-2xl p-8 text-center hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <metric.icon className="w-12 h-12 text-primary mx-auto mb-6" />
                  <div className="text-6xl font-black text-primary mb-4">
                    {metric.stat}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 lg:py-32 bg-gradient-to-br from-primary via-primary to-primary/90 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white"></div>
            <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-white"></div>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
              Ready to Refine Your CV?
            </h2>

            <p className="text-xl text-white/90 mb-10">
              Join thousands of MBA students who've transformed their job search with data-driven CV insights.
            </p>

            <button className="bg-white text-primary px-12 py-5 rounded-full text-xl font-bold hover:scale-105 hover:shadow-2xl transition-all duration-300">
              Get Started Free
            </button>

            <p className="text-white/80 text-sm mt-6">
              3 free analyses per day • No credit card required
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
