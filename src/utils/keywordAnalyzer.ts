import { MatchedKeyword, MissingKeyword, PartialMatch, ActionItem } from '../lib/supabase';

const commonSkills = [
  'python', 'java', 'javascript', 'typescript', 'react', 'node', 'sql', 'mongodb',
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'git', 'agile', 'scrum',
  'machine learning', 'ml', 'ai', 'data analysis', 'data science', 'analytics',
  'leadership', 'management', 'project management', 'team management',
  'communication', 'problem solving', 'collaboration', 'strategic planning',
  'excel', 'powerpoint', 'tableau', 'power bi', 'salesforce', 'crm',
  'marketing', 'seo', 'content', 'digital marketing', 'social media',
  'product management', 'product strategy', 'roadmap', 'stakeholder management',
  'consulting', 'strategy', 'business development', 'sales', 'revenue growth',
  'financial analysis', 'budgeting', 'forecasting', 'accounting',
  'cloud computing', 'devops', 'ci/cd', 'microservices', 'api', 'rest',
  'ux', 'ui', 'design', 'figma', 'sketch', 'adobe', 'photoshop'
];

const synonymMap: Record<string, string[]> = {
  'led': ['managed', 'headed', 'directed', 'oversaw', 'supervised'],
  'developed': ['built', 'created', 'designed', 'implemented', 'engineered'],
  'improved': ['enhanced', 'optimized', 'increased', 'boosted', 'elevated'],
  'collaborated': ['worked with', 'partnered', 'coordinated', 'teamed'],
  'analyzed': ['evaluated', 'assessed', 'examined', 'studied', 'investigated'],
  'revenue': ['sales', 'income', 'earnings'],
  'team': ['group', 'squad', 'unit'],
  'project': ['initiative', 'program', 'effort'],
};

export function extractKeywords(text: string): Map<string, number> {
  const normalizedText = text.toLowerCase();
  const keywordCounts = new Map<string, number>();

  commonSkills.forEach(skill => {
    const regex = new RegExp(`\\b${skill}\\b`, 'gi');
    const matches = normalizedText.match(regex);
    if (matches) {
      keywordCounts.set(skill, matches.length);
    }
  });

  return keywordCounts;
}

export function findPartialMatches(cvText: string, jdText: string): PartialMatch[] {
  const partialMatches: PartialMatch[] = [];
  const cvLower = cvText.toLowerCase();
  const jdLower = jdText.toLowerCase();

  Object.entries(synonymMap).forEach(([canonical, synonyms]) => {
    const jdHasCanonical = jdLower.includes(canonical);

    synonyms.forEach(synonym => {
      if (cvLower.includes(synonym) && jdHasCanonical && !cvLower.includes(canonical)) {
        partialMatches.push({
          cvText: synonym.charAt(0).toUpperCase() + synonym.slice(1),
          jdText: canonical.charAt(0).toUpperCase() + canonical.slice(1),
          recommendation: `Change "${synonym}" to "${canonical}" to match JD language`
        });
      }
    });
  });

  return partialMatches.slice(0, 5);
}

export function analyzeKeywordMatch(cvText: string, jdText: string) {
  const cvKeywords = extractKeywords(cvText);
  const jdKeywords = extractKeywords(jdText);

  const matched: MatchedKeyword[] = [];
  const missing: MissingKeyword[] = [];

  jdKeywords.forEach((jdCount, keyword) => {
    const cvCount = cvKeywords.get(keyword) || 0;

    if (cvCount > 0) {
      matched.push({ keyword, cvCount, jdCount });
    } else {
      const priority = jdCount >= 3 ? 'High' : jdCount >= 2 ? 'Medium' : 'Low';
      const suggestions = generateSuggestions(keyword);

      missing.push({
        keyword,
        jdCount,
        priority,
        suggestion: suggestions.where,
        example: suggestions.example
      });
    }
  });

  const matchScore = calculateMatchScore(matched.length, jdKeywords.size, cvText, jdText);
  const partialMatches = findPartialMatches(cvText, jdText);
  const strengths = generateStrengths(matched, cvText, jdText);
  const weaknesses = generateWeaknesses(missing, cvText, jdText);
  const actionItems = generateActionItems(missing, partialMatches, matchScore);

  return {
    matchScore,
    matched: matched.slice(0, 25),
    missing: missing.slice(0, 10),
    partialMatches,
    strengths,
    weaknesses,
    actionItems
  };
}

function calculateMatchScore(
  matchedCount: number,
  totalJDKeywords: number,
  cvText: string,
  jdText: string
): number {
  if (totalJDKeywords === 0) return 50;

  const keywordScore = (matchedCount / totalJDKeywords) * 100;

  const cvWords = cvText.toLowerCase().split(/\s+/).length;
  const lengthBonus = Math.min(cvWords / 500, 1) * 10;

  const rawScore = keywordScore * 0.85 + lengthBonus;

  return Math.round(Math.min(rawScore, 100));
}

function generateSuggestions(keyword: string): { where: string; example: string } {
  const lowerKeyword = keyword.toLowerCase();

  if (['python', 'java', 'javascript', 'sql', 'react'].includes(lowerKeyword)) {
    return {
      where: 'Add to Skills section or Projects',
      example: `Used ${keyword} to develop and implement...`
    };
  }

  if (['leadership', 'management', 'team'].some(term => lowerKeyword.includes(term))) {
    return {
      where: 'Add to Work Experience section',
      example: `Led team using ${keyword} principles...`
    };
  }

  if (['agile', 'scrum', 'devops'].includes(lowerKeyword)) {
    return {
      where: 'Add to Work Experience or Skills',
      example: `Collaborated in ${keyword} environment...`
    };
  }

  return {
    where: 'Add to relevant section',
    example: `Applied ${keyword} to achieve...`
  };
}

function generateStrengths(matched: MatchedKeyword[], cvText: string, jdText: string): string[] {
  const strengths: string[] = [];

  if (matched.length > 0) {
    const topMatch = matched[0];
    strengths.push(
      `Your ${topMatch.keyword} experience (${topMatch.cvCount} mentions) aligns well with JD requirements (${topMatch.jdCount} mentions)`
    );
  }

  const hasLeadership = matched.some(m =>
    ['leadership', 'management', 'led', 'managed'].includes(m.keyword.toLowerCase())
  );
  if (hasLeadership) {
    strengths.push('Your leadership experience matches the JD\'s management requirements');
  }

  const hasTechnical = matched.some(m =>
    ['python', 'sql', 'java', 'javascript'].includes(m.keyword.toLowerCase())
  );
  if (hasTechnical) {
    strengths.push('Your technical skills align with the required technologies');
  }

  if (cvText.match(/\d+%|\d+x|increased|improved|growth/gi)) {
    strengths.push('Your quantified achievements demonstrate measurable impact');
  }

  if (matched.length >= 15) {
    strengths.push(`Strong keyword coverage with ${matched.length} matching terms`);
  }

  return strengths.slice(0, 5);
}

function generateWeaknesses(missing: MissingKeyword[], cvText: string, jdText: string): string[] {
  const weaknesses: string[] = [];

  missing.slice(0, 3).forEach(item => {
    weaknesses.push(
      `JD requires ${item.keyword} (${item.jdCount} mentions) - not found in your CV`
    );
  });

  if (missing.filter(m => m.priority === 'High').length >= 3) {
    weaknesses.push('Multiple high-priority keywords are missing from your CV');
  }

  if (!cvText.match(/\d+%|\d+x/g)) {
    weaknesses.push('Consider adding quantified achievements to demonstrate impact');
  }

  return weaknesses.slice(0, 5);
}

function generateActionItems(
  missing: MissingKeyword[],
  partialMatches: PartialMatch[],
  matchScore: number
): ActionItem[] {
  const actions: ActionItem[] = [];

  missing.filter(m => m.priority === 'High').slice(0, 2).forEach(item => {
    const impact = matchScore < 60 ? '+15%' : matchScore < 75 ? '+10%' : '+8%';
    actions.push({
      priority: 'HIGH',
      action: `Add ${item.keyword} to your ${item.suggestion.split(' ')[2] || 'CV'}`,
      impact,
      time: '10-15 minutes',
      suggestion: item.example
    });
  });

  partialMatches.slice(0, 2).forEach(match => {
    actions.push({
      priority: 'HIGH',
      action: match.recommendation,
      impact: '+5%',
      time: '2 minutes'
    });
  });

  missing.filter(m => m.priority === 'Medium').slice(0, 2).forEach(item => {
    actions.push({
      priority: 'MEDIUM',
      action: `Add ${item.keyword} reference`,
      impact: '+4%',
      time: '5-10 minutes',
      suggestion: item.example
    });
  });

  if (actions.length === 0) {
    actions.push({
      priority: 'LOW',
      action: 'Review formatting and structure',
      impact: '+2%',
      time: '5 minutes'
    });
  }

  return actions.slice(0, 5);
}
