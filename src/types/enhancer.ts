export type BulletRating = 1 | 2 | 3 | 4 | 5;

export interface BulletSuggestion {
  id: string;
  text: string;
  rating: BulletRating;
  improvements: string[];
}

export interface BulletPoint {
  id: string;
  originalText: string;
  rating: BulletRating;
  issues: string[];
  suggestions: BulletSuggestion[];
  selectedSuggestionId: string | null;
  userContext?: string;
}

export type SectionName =
  | 'Personal Information'
  | 'Work Experience'
  | 'Education'
  | 'Certifications & Projects'
  | 'Position of Responsibility'
  | 'Extra Curriculars';

export interface CVSection {
  name: SectionName;
  score: number;
  bullets: BulletPoint[];
  completed: boolean;
}

export interface ExperienceBlock {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: BulletPoint[];
}

export interface CalculatorInputs {
  experienceCount: number;
  bulletQuality: 'weak' | 'mixed' | 'fairly-strong' | 'very-strong';
  applicationCount: number;
  targetCTC: number;
}

export interface ROIMetrics {
  manualTime: number;
  aiTime: number;
  timeSaved: number;
  currentRating: number;
  enhancedRating: number;
  currentResponseRate: number;
  enhancedResponseRate: number;
  valueOfTime: number;
}
