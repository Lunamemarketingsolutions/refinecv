export interface ResumeData {
  fullName: string;
  professionalSummary: string;
  skills: string[];
  experience: Array<{
    company: string;
    role: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    year: string;
  }>;
  projects?: Array<{
    name: string;
    description: string;
    technologies?: string[];
  }>;
}

export interface Recommendation {
  id: string;
  type: 'summary' | 'skill' | 'experience' | 'education' | 'certification' | 'project';
  current: string;
  suggested: string;
  reason: string;
}

export interface JDMatchAnalysis {
  resumeData: ResumeData;
  recommendations: Recommendation[];
  jdText: string;
}

export interface JDMatchRecord {
  id: string;
  user_id: string;
  cv_upload_id: string | null;
  jd_text: string;
  jd_source: 'paste' | 'pdf' | 'docx' | 'txt' | 'image';
  jd_metadata: Record<string, any>;
  resume_data?: ResumeData;
  recommendations?: Recommendation[];
  applied_recommendations?: string[]; // IDs of accepted recommendations
  created_at: string;
  updated_at: string;
}

