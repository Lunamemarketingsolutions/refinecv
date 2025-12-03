import { extractTextFromFile } from '../utils/fileExtractor';

export interface ParsedSection {
  name: string;
  bullets: string[];
}

export interface ParsedCV {
  sections: string[];
  content: Record<string, string[] | Record<string, string>>;
  rawHtml: string;
  rawText: string;
}

// Common section headers to look for
const SECTION_HEADERS = [
  'Personal Information',
  'Personal Details',
  'Contact Information',
  'Work Experience',
  'Experience',
  'Professional Experience',
  'Employment History',
  'Education',
  'Educational Background',
  'Academic Qualifications',
  'Certifications',
  'Certifications & Projects',
  'Projects',
  'Positions of Responsibility',
  'Leadership',
  'Extracurriculars',
  'Extracurricular Activities',
  'Achievements',
  'Skills',
  'Technical Skills',
  'Languages',
  'References',
];

// Fuzzy match threshold for similar section names
const SIMILARITY_THRESHOLD = 0.85;

function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];
  const len1 = str1.length;
  const len2 = str2.length;

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + 1
        );
      }
    }
  }

  return matrix[len1][len2];
}

function similarity(str1: string, str2: string): number {
  const maxLen = Math.max(str1.length, str2.length);
  if (maxLen === 0) return 1;
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  return 1 - distance / maxLen;
}

function normalizeSectionName(name: string): string {
  // Map variations to standard names
  const mappings: Record<string, string> = {
    'personal details': 'Personal Information',
    'contact information': 'Personal Information',
    'experience': 'Work Experience',
    'professional experience': 'Work Experience',
    'employment history': 'Work Experience',
    'educational background': 'Education',
    'academic qualifications': 'Education',
    'certifications & projects': 'Certifications & Projects',
    'extracurricular activities': 'Extracurriculars',
    'positions of responsibility': 'Positions of Responsibility',
  };

  const lower = name.toLowerCase().trim();
  return mappings[lower] || name;
}

function findSimilarSection(sectionName: string, existingSections: string[]): string | null {
  const normalized = normalizeSectionName(sectionName);
  
  for (const existing of existingSections) {
    const existingNormalized = normalizeSectionName(existing);
    if (similarity(normalized, existingNormalized) >= SIMILARITY_THRESHOLD) {
      return existing;
    }
  }
  
  return null;
}

function parseCVText(text: string): ParsedCV {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const sections: ParsedSection[] = [];
  const content: Record<string, string[] | Record<string, string>> = {};
  let currentSection: ParsedSection | null = null;
  
  // Detect section headers
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const upperLine = line.toUpperCase();
    
    // Check if this line is a section header
    let isHeader = false;
    let headerName = '';
    
    // Check against known headers
    for (const header of SECTION_HEADERS) {
      if (upperLine.includes(header.toUpperCase()) || 
          similarity(upperLine, header.toUpperCase()) > 0.7) {
        isHeader = true;
        headerName = header;
        break;
      }
    }
    
    // Also check if line is all caps and short (likely a header)
    if (!isHeader && line.length < 50 && line === upperLine && line.length > 2) {
      isHeader = true;
      headerName = line;
    }
    
    if (isHeader) {
      // Save previous section
      if (currentSection && currentSection.bullets.length > 0) {
        sections.push(currentSection);
      }
      
      // Check for similar section and merge
      const normalizedName = normalizeSectionName(headerName);
      const similarSection = findSimilarSection(normalizedName, sections.map(s => s.name));
      
      if (similarSection) {
        currentSection = sections.find(s => s.name === similarSection)!;
      } else {
        currentSection = {
          name: normalizedName,
          bullets: [],
        };
      }
    } else if (currentSection) {
      // Add as bullet point
      // Remove common bullet characters
      const cleaned = line.replace(/^[•\-\*\+\d+\.\)]\s*/, '').trim();
      if (cleaned.length > 0) {
        currentSection.bullets.push(cleaned);
      }
    } else {
      // Content before first section - treat as Personal Information
      if (!currentSection) {
        currentSection = {
          name: 'Personal Information',
          bullets: [],
        };
      }
      const cleaned = line.replace(/^[•\-\*\+\d+\.\)]\s*/, '').trim();
      if (cleaned.length > 0) {
        currentSection.bullets.push(cleaned);
      }
    }
  }
  
  // Save last section
  if (currentSection && currentSection.bullets.length > 0) {
    const similarSection = findSimilarSection(currentSection.name, sections.map(s => s.name));
    if (similarSection) {
      const existing = sections.find(s => s.name === similarSection)!;
      existing.bullets.push(...currentSection.bullets);
    } else {
      sections.push(currentSection);
    }
  }
  
  // Convert to content format
  for (const section of sections) {
    if (section.name === 'Personal Information') {
      // Parse personal info into structured format
      const personalInfo: Record<string, string> = {};
      for (const bullet of section.bullets) {
        // Try to extract email
        const emailMatch = bullet.match(/[\w\.-]+@[\w\.-]+\.\w+/);
        if (emailMatch) {
          personalInfo.email = emailMatch[0];
        }
        // Try to extract phone
        const phoneMatch = bullet.match(/[\d\s\-\+\(\)]{10,}/);
        if (phoneMatch && !emailMatch) {
          personalInfo.phone = phoneMatch[0].trim();
        }
        // Try to extract name (first line, usually)
        if (!personalInfo.name && bullet.length < 50 && !emailMatch && !phoneMatch) {
          personalInfo.name = bullet;
        }
        // LinkedIn/GitHub
        if (bullet.toLowerCase().includes('linkedin')) {
          personalInfo.linkedin = bullet;
        }
        if (bullet.toLowerCase().includes('github')) {
          personalInfo.github = bullet;
        }
      }
      content[section.name] = personalInfo;
    } else {
      content[section.name] = section.bullets;
    }
  }
  
  // Generate HTML preview
  const rawHtml = generateHTMLPreview(sections, content);
  
  return {
    sections: sections.map(s => s.name),
    content,
    rawHtml,
    rawText: text,
  };
}

function generateHTMLPreview(sections: ParsedSection[], content: Record<string, any>): string {
  let html = '<div style="font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; line-height: 1.6;">';
  
  for (const section of sections) {
    html += `<h2 style="color: #2782EA; border-bottom: 2px solid #2782EA; padding-bottom: 5px; margin-top: 30px;">${section.name.toUpperCase()}</h2>`;
    
    if (section.name === 'Personal Information' && typeof content[section.name] === 'object') {
      const info = content[section.name] as Record<string, string>;
      html += '<div style="margin-bottom: 20px;">';
      if (info.name) html += `<p style="font-size: 24px; font-weight: bold; margin: 0;">${info.name}</p>`;
      html += '<p style="margin: 10px 0;">';
      const details: string[] = [];
      if (info.email) details.push(info.email);
      if (info.phone) details.push(info.phone);
      if (info.linkedin) details.push(info.linkedin);
      if (info.github) details.push(info.github);
      html += details.join(' | ');
      html += '</p></div>';
    } else {
      html += '<ul style="margin-left: 20px;">';
      const bullets = Array.isArray(content[section.name]) 
        ? content[section.name] as string[]
        : section.bullets;
      for (const bullet of bullets) {
        html += `<li style="margin-bottom: 8px;">${bullet}</li>`;
      }
      html += '</ul>';
    }
  }
  
  html += '</div>';
  return html;
}

export async function parseCVFile(file: File): Promise<ParsedCV> {
  const extractionResult = await extractTextFromFile(file);
  
  if (!extractionResult.success || !extractionResult.text) {
    throw new Error(extractionResult.error || 'Failed to extract text from CV');
  }
  
  return parseCVText(extractionResult.text);
}

export async function parseCVFromText(text: string): Promise<ParsedCV> {
  return parseCVText(text);
}

