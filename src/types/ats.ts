// ATS Analysis Types
export interface ATSIssue {
  type: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  impact?: string;
  impactScore?: number;
  problem?: string;
  location?: string;
  atsView?: string;
  solution?: string;
  timeToFix?: string;
  scoreImpact?: string;
  fix?: string;
}

export interface SectionCoordinates {
  x: number;
  y: number;
  width: number;
  height: number;
  pageNumber: number;
}

export interface SectionStyle {
  fontFamily?: string;
  fontSize: number;
  fontWeight?: string;
  color?: string;
}

export interface ResumeSection {
  headerText: string;
  normalizedKey: string;
  wasExtracted: boolean;
  extractedContent?: string;
  lineNumber: number;
  issueReason?: string;
  coordinates?: SectionCoordinates;
  style?: SectionStyle;
  hasTable?: boolean;
  hasImage?: boolean;
}

export interface CategoryScore {
  name: string;
  score: number;
  maxScore: number;
  percentage: number;
  weight: number;
  issues: ATSIssue[];
  details: string[];
}

export interface DetailedATSAnalysis {
  overallScore: number;
  categories: {
    contact: CategoryScore;
    structure: CategoryScore;
    formatting: CategoryScore;
    quality: CategoryScore;
    technical: CategoryScore;
  };
  prioritizedIssues: ATSIssue[];
  recommendations: string[];
  tier: 'excellent' | 'very-good' | 'good' | 'fair' | 'poor';
}

export type SuggestionStatus = 'pending' | 'accepted' | 'rejected';

export interface ATSSuggestion {
  id: string;
  cvUploadId: string;
  sectionName: string;
  sectionKey: string;
  originalContent?: string;
  suggestedContent: string;
  suggestionReason: string;
  status: SuggestionStatus;
  lineNumber?: number;
  coordinates?: SectionCoordinates;
  estimatedScoreImprovement: number;
  createdAt: string;
  updatedAt: string;
}

export interface PDFEdit {
  id: string;
  cvUploadId: string;
  suggestionId?: string;
  editType: 'suggestion_applied' | 'manual_edit' | 'rollback';
  sectionAffected: string;
  changesMade: Record<string, any>;
  createdAt: string;
}

export interface ATSAnalysis {
  score: number;
  issues: ATSIssue[];
  recommendations: string[];
  extractedText: string;
  sections: {
    contact?: string;
    summary?: string;
    experience?: string;
    education?: string;
    skills?: string;
  };
  detectedSections?: ResumeSection[];
  suggestions?: ATSSuggestion[];
  stats: {
    wordCount: number;
    characterCount: number;
    pageCount: number;
  };
  detailedScore?: DetailedATSAnalysis;
}

export interface UploadProgress {
  stage: 'uploading' | 'analyzing' | 'saving' | 'complete' | 'error';
  percentage: number;
  message: string;
}

export interface ReformatProgress {
  stage: 'extracting' | 'analyzing' | 'generating' | 'complete' | 'error';
  percentage: number;
  message: string;
}

// Contact and Resume Data Types
export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface EducationEntry {
  institution: string;
  degree: string;
  field?: string;
  gpa?: string;
  startDate: string;
  endDate: string;
}

export interface WorkExperience {
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  description?: string;
  bullets: string[];
}

export interface Project {
  title: string;
  link?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  bullets: string[];
}

export interface TechnicalSkills {
  categories: {
    name: string;
    skills: string[];
  }[];
}

export interface Achievement {
  title: string;
  organization?: string;
  date?: string;
  description?: string;
}

export interface ExtractedResumeData {
  contact: ContactInfo;
  education: EducationEntry[];
  experience: WorkExperience[];
  skills: TechnicalSkills;
  projects: Project[];
  certifications: Achievement[];
  awards: Achievement[];
  positions: Achievement[];
}
