import { Mail, Phone, MapPin, Calendar, Award, Briefcase, GraduationCap, Download, ArrowLeft } from 'lucide-react';
import type { ResumeData } from '../../types/jdMatcher';

interface ResumePreviewProps {
  data: ResumeData;
  onBack?: () => void;
}

export default function ResumePreview({ data, onBack }: ResumePreviewProps) {
  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header with Actions */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 no-print">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Tailoring
            </button>
          )}

          <h1 className="text-xl font-black text-secondary">
            {data.fullName || 'Resume Preview'}
          </h1>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg font-semibold"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Resume Template */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-[210mm] mx-auto bg-white shadow-2xl p-12 min-h-[297mm]">
          {/* Header Section */}
          <div className="border-b-2 border-secondary pb-8 mb-8 text-center">
            <h1 className="text-4xl font-black text-secondary mb-4 tracking-tight">
              {data.fullName || 'Your Name'}
            </h1>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2 transition-colors hover:text-secondary">
                <Mail className="w-4 h-4" />
                <span>email@example.com</span>
              </div>
              <div className="flex items-center gap-2 transition-colors hover:text-secondary">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 transition-colors hover:text-secondary">
                <MapPin className="w-4 h-4" />
                <span>City, Country</span>
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          {data.professionalSummary && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-black text-secondary uppercase tracking-wide">
                  Professional Summary
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-sm text-justify">
                {data.professionalSummary}
              </p>
            </div>
          )}

          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-black text-secondary uppercase tracking-wide">
                  Skills
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-md border border-primary/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-black text-secondary uppercase tracking-wide">
                  Professional Experience
                </h2>
              </div>
              <div className="space-y-6">
                {data.experience.map((exp, index) => (
                  <div key={index} className="group">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-black text-secondary group-hover:text-primary transition-colors">
                          {exp.role}
                        </h3>
                        <div className="font-semibold text-gray-700">
                          {exp.company}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{exp.duration}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-sm text-justify pl-1 border-l-2 border-transparent group-hover:border-primary/30 transition-all">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-black text-secondary uppercase tracking-wide">
                  Project Highlights
                </h2>
              </div>
              <div className="space-y-4">
                {data.projects.map((proj, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-black text-secondary mb-1">
                      {proj.name}
                    </h3>
                    <p className="text-gray-700 text-sm mb-2">
                      {proj.description}
                    </p>
                    {proj.technologies && (
                      <div className="flex flex-wrap gap-1">
                        {proj.technologies.map((tech, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-black text-secondary uppercase tracking-wide">
                  Education
                </h2>
              </div>
              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <h3 className="font-black text-secondary">
                        {edu.degree}
                      </h3>
                      <div className="text-gray-600 text-sm">
                        {edu.institution}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 font-medium">
                      {edu.year}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-black text-secondary uppercase tracking-wide">
                  Licenses & Certifications
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.certifications.map((cert, index) => (
                  <div key={index} className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <h3 className="font-black text-secondary text-sm mb-1">
                      {cert.name}
                    </h3>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{cert.issuer}</span>
                      <span>{cert.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

