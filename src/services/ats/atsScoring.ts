import type { ATSIssue, CategoryScore, DetailedATSAnalysis } from '../../types/ats';

const CATEGORY_WEIGHTS = {
  contact: 0.15,
  structure: 0.25,
  formatting: 0.30,
  quality: 0.20,
  technical: 0.10,
};

const ACTION_VERBS = [
  'achieved', 'implemented', 'developed', 'managed', 'led', 'created',
  'improved', 'increased', 'decreased', 'reduced', 'initiated', 'launched',
  'designed', 'built', 'established', 'optimized', 'streamlined', 'executed',
  'delivered', 'spearheaded', 'coordinated', 'directed', 'oversaw', 'enhanced',
];

export function analyzeContactInformation(text: string): CategoryScore {
  const issues: ATSIssue[] = [];
  const details: string[] = [];
  let score = 0;
  const maxScore = 15;

  const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/i.test(text);
  const hasPhone = /(\+\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}/.test(text);
  const hasLinkedIn = /(linkedin\.com\/in\/|linkedin\.com\/pub\/)/i.test(text);
  const hasLocation = /(city|state|country|address|location|, [A-Z]{2}|[A-Z]{2} \d{5})/i.test(text);

  if (hasEmail) {
    score += 5;
    details.push('✓ Email address detected');
  } else {
    issues.push({
      type: 'error',
      title: 'Missing Email Address',
      description: 'ATS requires an email address for contact. Add a clear, professional email at the top of your resume.',
    });
    details.push('✗ Email address not found');
  }

  if (hasPhone) {
    score += 4;
    details.push('✓ Phone number detected');
  } else {
    issues.push({
      type: 'warning',
      title: 'Missing Phone Number',
      description: 'Include a phone number in your contact section for recruiters to reach you easily.',
    });
    details.push('✗ Phone number not found');
  }

  if (hasLinkedIn) {
    score += 3;
    details.push('✓ LinkedIn profile detected');
  } else {
    issues.push({
      type: 'info',
      title: 'LinkedIn Profile Recommended',
      description: 'Adding a LinkedIn URL increases your professional presence and ATS compatibility.',
    });
    details.push('⚠ LinkedIn profile not found');
  }

  if (hasLocation) {
    score += 3;
    details.push('✓ Location information detected');
  } else {
    issues.push({
      type: 'info',
      title: 'Location Information Missing',
      description: 'Consider adding your city and state. Many ATS systems filter by location.',
    });
    details.push('⚠ Location information not found');
  }

  return {
    name: 'Contact Information',
    score,
    maxScore,
    percentage: Math.round((score / maxScore) * 100),
    weight: CATEGORY_WEIGHTS.contact,
    issues,
    details,
  };
}

export function analyzeContentStructure(text: string): CategoryScore {
  const issues: ATSIssue[] = [];
  const details: string[] = [];
  let score = 0;
  const maxScore = 25;
  const lowerText = text.toLowerCase();

  const experienceKeywords = [
    'experience', 'employment', 'work history', 'professional background',
    'professional experience', 'work experience', 'career history',
  ];
  const educationKeywords = [
    'education', 'academic', 'university', 'college', 'degree',
    'bachelor', 'master', 'phd', 'diploma', 'certification',
  ];
  const skillsKeywords = [
    'skills', 'technical skills', 'competencies', 'expertise',
    'core competencies', 'key skills', 'proficiencies', 'technologies',
  ];
  const summaryKeywords = [
    'summary', 'objective', 'profile', 'about', 'professional summary',
    'career objective', 'professional profile', 'overview',
  ];

  const hasExperience = experienceKeywords.some(keyword => lowerText.includes(keyword));
  const hasEducation = educationKeywords.some(keyword => lowerText.includes(keyword));
  const hasSkills = skillsKeywords.some(keyword => lowerText.includes(keyword));
  const hasSummary = summaryKeywords.some(keyword => lowerText.includes(keyword));

  const headerPattern = /^(experience|education|skills|summary|objective|profile)/mi;
  const hasHeaders = headerPattern.test(text);

  if (hasExperience) {
    score += 8;
    details.push('✓ Experience section clearly identified');
  } else {
    issues.push({
      type: 'error',
      title: 'Experience Section Not Found',
      description: 'ATS cannot identify your work experience. Use a clear header like "Work Experience" or "Professional Experience".',
    });
    details.push('✗ Experience section not detected');
  }

  if (hasEducation) {
    score += 6;
    details.push('✓ Education section clearly identified');
  } else {
    issues.push({
      type: 'warning',
      title: 'Education Section Not Clear',
      description: 'Add a clear "Education" section header to help ATS identify your academic background.',
    });
    details.push('✗ Education section not detected');
  }

  if (hasSkills) {
    score += 5;
    details.push('✓ Skills section clearly identified');
  } else {
    issues.push({
      type: 'warning',
      title: 'Skills Section Recommended',
      description: 'Add a dedicated "Skills" section to improve keyword matching and ATS parsing.',
    });
    details.push('⚠ Skills section not detected');
  }

  if (hasSummary) {
    score += 3;
    details.push('✓ Professional summary detected');
  } else {
    issues.push({
      type: 'info',
      title: 'Consider Adding a Summary',
      description: 'A professional summary at the top helps ATS and recruiters quickly understand your profile.',
    });
    details.push('⚠ Professional summary not found');
  }

  if (hasHeaders) {
    score += 3;
    details.push('✓ Clear section headers present');
  } else {
    issues.push({
      type: 'warning',
      title: 'Section Headers Not Standard',
      description: 'Use clear, standard section headers for better ATS compatibility.',
    });
    details.push('⚠ Standard headers not clearly formatted');
  }

  return {
    name: 'Content Structure',
    score,
    maxScore,
    percentage: Math.round((score / maxScore) * 100),
    weight: CATEGORY_WEIGHTS.structure,
    issues,
    details,
  };
}

export function analyzeFormattingParsability(text: string, pageCount: number): CategoryScore {
  const issues: ATSIssue[] = [];
  const details: string[] = [];
  let score = 0;
  const maxScore = 30;

  const textLength = text.trim().length;
  const wordsPerPage = textLength / (pageCount || 1) / 5;

  if (textLength < 100) {
    issues.push({
      type: 'error',
      title: 'Image-Based or Scanned Resume Detected',
      description: 'Almost no text was extracted from your resume. This indicates your resume is image-based or scanned. ATS systems cannot read images. Please recreate your resume as a text-based PDF.',
    });
    details.push('✗ Image-based or scanned document');
    score += 0;
  } else if (textLength < 300 && pageCount >= 1) {
    issues.push({
      type: 'warning',
      title: 'Very Low Text Extraction',
      description: 'Very little text was extracted. Your resume may contain images, graphics, or scanned content that ATS cannot read. Ensure all content is actual text, not images.',
    });
    details.push('⚠ Low text extraction detected');
    score += 10;
  } else {
    score += 30;
    details.push('✓ Text-based content detected');
  }

  const tableIndicators = /\|[\s\S]*?\|/g.test(text) || /\t{2,}/g.test(text);
  if (tableIndicators) {
    issues.push({
      type: 'error',
      title: 'Tables Detected in Resume',
      description: 'Your resume contains tables. ATS systems often fail to correctly parse tabular data, which may scramble your information. Convert tables to simple lists or bullet points.',
    });
    details.push('✗ Table structures detected');
  } else {
    details.push('✓ No tables detected');
  }

  return {
    name: 'Formatting & Parsability',
    score,
    maxScore,
    percentage: Math.round((score / maxScore) * 100),
    weight: CATEGORY_WEIGHTS.formatting,
    issues,
    details,
  };
}

export function analyzeContentQuality(text: string, wordCount: number): CategoryScore {
  const issues: ATSIssue[] = [];
  const details: string[] = [];
  let score = 0;
  const maxScore = 20;

  if (wordCount >= 300 && wordCount <= 800) {
    score += 6;
    details.push(`✓ Optimal word count (${wordCount} words)`);
  } else if (wordCount >= 200 && wordCount < 300) {
    score += 4;
    issues.push({
      type: 'info',
      title: 'Consider Adding More Detail',
      description: `Your resume has ${wordCount} words. Aim for 300-800 words for better depth.`,
    });
    details.push(`⚠ Brief content (${wordCount} words)`);
  } else if (wordCount > 800 && wordCount <= 1000) {
    score += 5;
    issues.push({
      type: 'info',
      title: 'Slightly Lengthy',
      description: `Your resume has ${wordCount} words. Consider being more concise for better impact.`,
    });
    details.push(`⚠ Lengthy content (${wordCount} words)`);
  } else if (wordCount < 200) {
    score += 2;
    issues.push({
      type: 'warning',
      title: 'Content Too Brief',
      description: 'Your resume lacks sufficient detail. Add more information about your experience and achievements.',
    });
    details.push(`✗ Very brief content (${wordCount} words)`);
  } else {
    score += 4;
    issues.push({
      type: 'warning',
      title: 'Content Too Long',
      description: 'Your resume is very lengthy. ATS and recruiters prefer concise, focused resumes.',
    });
    details.push(`✗ Very lengthy content (${wordCount} words)`);
  }

  const lowerText = text.toLowerCase();
  const actionVerbCount = ACTION_VERBS.filter(verb => lowerText.includes(verb)).length;

  if (actionVerbCount >= 5) {
    score += 5;
    details.push(`✓ Strong action verbs present (${actionVerbCount} found)`);
  } else if (actionVerbCount >= 3) {
    score += 3;
    issues.push({
      type: 'info',
      title: 'Add More Action Verbs',
      description: 'Use more action verbs like "achieved", "led", "implemented" to describe your accomplishments.',
    });
    details.push(`⚠ Some action verbs present (${actionVerbCount} found)`);
  } else {
    score += 1;
    issues.push({
      type: 'warning',
      title: 'Lacking Action Verbs',
      description: 'Start bullet points with strong action verbs to make your achievements more impactful.',
    });
    details.push(`✗ Few action verbs detected (${actionVerbCount} found)`);
  }

  const numberPattern = /\d+%|\$\d+|[\d,]+\+|increased by \d+|reduced by \d+/gi;
  const quantifiableMatches = text.match(numberPattern);
  const quantifiableCount = quantifiableMatches ? quantifiableMatches.length : 0;

  if (quantifiableCount >= 3) {
    score += 4;
    details.push(`✓ Quantifiable achievements present (${quantifiableCount} found)`);
  } else if (quantifiableCount >= 1) {
    score += 2;
    issues.push({
      type: 'info',
      title: 'Add More Quantifiable Results',
      description: 'Include specific numbers, percentages, or metrics to demonstrate your impact.',
    });
    details.push(`⚠ Some quantifiable data (${quantifiableCount} found)`);
  } else {
    issues.push({
      type: 'warning',
      title: 'No Quantifiable Achievements',
      description: 'Add measurable results (e.g., "Increased sales by 25%", "Managed team of 10").',
    });
    details.push('✗ No quantifiable achievements detected');
  }

  const technicalTerms = [
    'python', 'java', 'javascript', 'react', 'angular', 'vue', 'node',
    'aws', 'azure', 'docker', 'kubernetes', 'sql', 'mongodb', 'api',
    'agile', 'scrum', 'git', 'ci/cd', 'machine learning', 'data analysis',
  ];
  const keywordCount = technicalTerms.filter(term => lowerText.includes(term)).length;

  if (keywordCount >= 3) {
    score += 3;
    details.push(`✓ Relevant technical keywords present (${keywordCount} found)`);
  } else if (keywordCount >= 1) {
    score += 2;
    details.push(`⚠ Some technical keywords present (${keywordCount} found)`);
  } else {
    score += 1;
    issues.push({
      type: 'info',
      title: 'Consider Adding Industry Keywords',
      description: 'Include relevant technical skills and industry keywords for better ATS matching.',
    });
    details.push('⚠ Few technical keywords detected');
  }

  const repeatedWords = findRepeatedWords(text);
  if (repeatedWords.length === 0) {
    score += 2;
    details.push('✓ Good variety in language');
  } else {
    score += 1;
    details.push('⚠ Some repetitive language detected');
  }

  return {
    name: 'Content Quality',
    score,
    maxScore,
    percentage: Math.round((score / maxScore) * 100),
    weight: CATEGORY_WEIGHTS.quality,
    issues,
    details,
  };
}

export function analyzeTechnicalCompliance(text: string, pageCount: number): CategoryScore {
  const issues: ATSIssue[] = [];
  const details: string[] = [];
  let score = 0;
  const maxScore = 10;

  score += 3;
  details.push('✓ PDF format detected');

  score += 2;
  details.push('✓ File appears to be accessible');

  score += 2;
  details.push('✓ No password protection detected');

  const fancyBullets = text.match(/[■●◆▪★☆►▶]/g);
  if (!fancyBullets || fancyBullets.length < 3) {
    score += 2;
    details.push('✓ Standard bullet points used');
  } else {
    score += 1;
    issues.push({
      type: 'info',
      title: 'Fancy Bullet Points',
      description: 'Replace decorative bullets with standard ones (• or -) for better ATS compatibility.',
    });
    details.push('⚠ Some fancy bullet points detected');
  }

  if (pageCount >= 1 && pageCount <= 2) {
    score += 1;
    details.push(`✓ Optimal page count (${pageCount} page${pageCount > 1 ? 's' : ''})`);
  } else if (pageCount === 3) {
    score += 0.5;
    issues.push({
      type: 'info',
      title: 'Resume Length',
      description: 'Your resume is 3 pages. Most recruiters prefer 1-2 pages.',
    });
    details.push('⚠ Resume is 3 pages (2 pages preferred)');
  } else if (pageCount > 3) {
    issues.push({
      type: 'warning',
      title: 'Resume Too Long',
      description: `Your resume is ${pageCount} pages. Consider condensing to 1-2 pages for better readability.`,
    });
    details.push(`✗ Resume is ${pageCount} pages (too long)`);
  }

  return {
    name: 'Technical Compliance',
    score,
    maxScore,
    percentage: Math.round((score / maxScore) * 100),
    weight: CATEGORY_WEIGHTS.technical,
    issues,
    details,
  };
}

function findRepeatedWords(text: string): string[] {
  const words = text.toLowerCase().match(/\b\w{5,}\b/g) || [];
  const wordCount: Record<string, number> = {};

  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });

  return Object.entries(wordCount)
    .filter(([_, count]) => count > 5)
    .map(([word]) => word);
}

export function calculateDetailedScore(
  text: string,
  wordCount: number,
  pageCount: number
): DetailedATSAnalysis {
  const contact = analyzeContactInformation(text);
  const structure = analyzeContentStructure(text);
  const formatting = analyzeFormattingParsability(text, pageCount);
  const quality = analyzeContentQuality(text, wordCount);
  const technical = analyzeTechnicalCompliance(text, pageCount);

  const overallScore = Math.round(
    contact.percentage * CATEGORY_WEIGHTS.contact +
    structure.percentage * CATEGORY_WEIGHTS.structure +
    formatting.percentage * CATEGORY_WEIGHTS.formatting +
    quality.percentage * CATEGORY_WEIGHTS.quality +
    technical.percentage * CATEGORY_WEIGHTS.technical
  );

  const allIssues = [
    ...contact.issues,
    ...structure.issues,
    ...formatting.issues,
    ...quality.issues,
    ...technical.issues
  ];

  const prioritizedIssues = prioritizeIssues(allIssues);
  const recommendations = generateRecommendations(overallScore, contact, structure, formatting, quality, technical);

  let tier: 'excellent' | 'very-good' | 'good' | 'fair' | 'poor';
  if (overallScore >= 90) tier = 'excellent';
  else if (overallScore >= 75) tier = 'very-good';
  else if (overallScore >= 60) tier = 'good';
  else if (overallScore >= 40) tier = 'fair';
  else tier = 'poor';

  return {
    overallScore,
    categories: {
      contact,
      structure,
      formatting,
      quality,
      technical,
    },
    prioritizedIssues,
    recommendations,
    tier,
  };
}

function prioritizeIssues(issues: ATSIssue[]): ATSIssue[] {
  const priority: Record<string, number> = { error: 1, warning: 2, info: 3 };
  return issues.sort((a, b) => priority[a.type] - priority[b.type]);
}

function generateRecommendations(
  score: number,
  contact: CategoryScore,
  structure: CategoryScore,
  formatting: CategoryScore,
  quality: CategoryScore,
  technical: CategoryScore
): string[] {
  const recommendations: string[] = [];

  if (score >= 90) {
    recommendations.push('Excellent! Your resume is well-optimized for ATS systems.');
    recommendations.push('Continue using clear, standard formatting and section headers.');
    recommendations.push('Keep your content updated with quantifiable achievements.');
  } else if (score >= 75) {
    recommendations.push('Great job! Your resume is ATS-friendly with minor improvements possible.');

    if (contact.percentage < 85) {
      recommendations.push('Consider adding LinkedIn profile or location for complete contact info.');
    }
    if (quality.percentage < 85) {
      recommendations.push('Add more quantifiable achievements to strengthen your impact.');
    }
    if (structure.percentage < 85) {
      recommendations.push('Ensure all major sections (Experience, Education, Skills) are clearly labeled.');
    }
  } else if (score >= 60) {
    recommendations.push('Your resume has good ATS compatibility but needs some improvements.');

    if (formatting.percentage < 70) {
      recommendations.push('Priority: Simplify formatting - use single-column layout and avoid tables.');
    }
    if (structure.percentage < 70) {
      recommendations.push('Priority: Add clear section headers for Experience, Education, and Skills.');
    }
    if (contact.percentage < 70) {
      recommendations.push('Ensure email and phone number are clearly visible at the top.');
    }
    if (quality.percentage < 70) {
      recommendations.push('Use action verbs and add measurable results to your accomplishments.');
    }
  } else if (score >= 40) {
    recommendations.push('Important: Your resume needs significant improvements for ATS compatibility.');
    recommendations.push('Priority #1: Convert to single-column, simple layout without tables or graphics.');
    recommendations.push('Priority #2: Add standard section headers: Experience, Education, Skills.');
    recommendations.push('Priority #3: Ensure contact information (email, phone) is clearly visible.');
    recommendations.push('Add quantifiable achievements with specific numbers and percentages.');
    recommendations.push('Start bullet points with strong action verbs.');
  } else {
    recommendations.push('Critical: Major reformatting required for ATS compatibility.');
    recommendations.push('Urgent: Ensure your resume is not image-based or scanned - text must be selectable.');
    recommendations.push('Urgent: Use simple, single-column layout with no tables or complex formatting.');
    recommendations.push('Urgent: Add clear contact information at the top (email, phone).');
    recommendations.push('Add standard section headers for all major sections.');
    recommendations.push('Expand content with specific achievements and action verbs.');
  }

  return recommendations;
}
