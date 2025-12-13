import type { ResumeSection, ATSSuggestion } from '../../types/ats';
import { supabase } from '../../lib/supabase';

interface SuggestionGenerationResult {
  suggestedContent: string;
  reason: string;
  estimatedImprovement: number;
}

function generateTableToTextSuggestion(section: ResumeSection): SuggestionGenerationResult {
  const sectionName = section.headerText.toLowerCase();

  if (sectionName.includes('skill') || sectionName.includes('technical')) {
    return {
      suggestedContent: `SKILLS:\n• Programming Languages: Python, JavaScript, Java, C++\n• Frameworks: React, Node.js, Django, Spring Boot\n• Tools: Git, Docker, AWS, Jenkins\n• Databases: PostgreSQL, MongoDB, Redis`,
      reason: 'Tables are difficult for ATS to parse. Converting to a bulleted list ensures all your skills are properly extracted and matched to job requirements.',
      estimatedImprovement: 15
    };
  }

  if (sectionName.includes('experience') || sectionName.includes('work')) {
    return {
      suggestedContent: `PROFESSIONAL EXPERIENCE:\n\nSenior Software Engineer | Tech Company | 2020 - Present\n• Developed and maintained scalable web applications serving 100K+ users\n• Led a team of 5 engineers in implementing new features\n• Improved application performance by 40% through optimization\n\nSoftware Engineer | Previous Company | 2018 - 2020\n• Built RESTful APIs using Node.js and Express\n• Collaborated with cross-functional teams on product development`,
      reason: 'Experience sections in tables often lose formatting during ATS parsing. This standard format ensures dates, companies, and achievements are properly extracted.',
      estimatedImprovement: 20
    };
  }

  if (sectionName.includes('education')) {
    return {
      suggestedContent: `EDUCATION:\n\nBachelor of Science in Computer Science\nUniversity Name | Graduated: May 2018\nGPA: 3.8/4.0\n\nRelevant Coursework: Data Structures, Algorithms, Database Systems, Software Engineering`,
      reason: 'Educational details in tables may not be extracted correctly. This format ensures your degree, institution, and graduation date are all captured by ATS.',
      estimatedImprovement: 10
    };
  }

  return {
    suggestedContent: `${section.headerText.toUpperCase()}:\n• Key point or detail 1\n• Key point or detail 2\n• Key point or detail 3\n• Key point or detail 4`,
    reason: 'Table format detected. Converting to simple bullet points ensures ATS can properly extract and index your information.',
    estimatedImprovement: 12
  };
}

function generateImageToTextSuggestion(section: ResumeSection): SuggestionGenerationResult {
  const sectionName = section.headerText.toLowerCase();

  if (sectionName.includes('contact') || sectionName.includes('header')) {
    return {
      suggestedContent: `John Doe\nSoftware Engineer\n\nEmail: john.doe@email.com\nPhone: (555) 123-4567\nLinkedIn: linkedin.com/in/johndoe\nLocation: San Francisco, CA`,
      reason: 'Image-based headers cannot be read by ATS. Converting to plain text ensures your contact information is properly extracted.',
      estimatedImprovement: 25
    };
  }

  if (sectionName.includes('content') || sectionName.includes('resume')) {
    return {
      suggestedContent: `PROFESSIONAL SUMMARY:\nExperienced professional with strong background in [your field]. Proven track record of [key achievement].\n\nPROFESSIONAL EXPERIENCE:\n\nJob Title | Company Name | 2020 - Present\n• Key achievement or responsibility\n• Quantifiable result or impact\n• Technical skills or tools used\n\nEDUCATION:\n\nDegree Name\nUniversity Name | Graduation Year\n\nSKILLS:\n• Skill category: Specific skills\n• Technical proficiency: Tools and technologies`,
      reason: '⚠️ Your resume is image-based and cannot be read by ATS systems. Image-based resumes require complete recreation using the template shown. Click "Fix with AI" to see the ATS-friendly template, then manually recreate your resume using this structure with your actual information.',
      estimatedImprovement: 35
    };
  }

  return {
    suggestedContent: `${section.headerText.toUpperCase()}:\n\n[Replace this with your actual content as plain text]\n\nImportant: Do not use images, text boxes, or tables. Use simple formatting with bullet points:\n• Point 1\n• Point 2\n• Point 3`,
    reason: 'ATS systems cannot read text within images. All content must be actual text for proper parsing and keyword matching.',
    estimatedImprovement: 20
  };
}

function generateFormattingFixSuggestion(section: ResumeSection): SuggestionGenerationResult {
  return {
    suggestedContent: `${section.headerText.toUpperCase()}:\n\n${section.extractedContent || '[Content extracted from complex formatting]'}\n\nNote: Content has been reformatted for better ATS compatibility.`,
    reason: 'Complex formatting detected in this section. Simplifying the layout improves ATS parsing accuracy and ensures all information is captured.',
    estimatedImprovement: 8
  };
}

export async function generateSuggestionsForSection(
  section: ResumeSection,
  cvUploadId: string,
  userId: string
): Promise<ATSSuggestion | null> {
  console.log('Processing section for suggestions:', {
    headerText: section.headerText,
    wasExtracted: section.wasExtracted,
    hasTable: section.hasTable,
    hasImage: section.hasImage,
    issueReason: section.issueReason
  });

  if (section.wasExtracted && !section.hasTable) {
    console.log('Section was successfully extracted and has no table, skipping suggestion');
    return null;
  }

  let suggestionResult: SuggestionGenerationResult;

  if (section.hasTable) {
    suggestionResult = generateTableToTextSuggestion(section);
  } else if (section.hasImage) {
    suggestionResult = generateImageToTextSuggestion(section);
  } else {
    suggestionResult = generateFormattingFixSuggestion(section);
  }

  const { data, error } = await supabase
    .from('resume_suggestions')
    .insert({
      cv_upload_id: cvUploadId,
      user_id: userId,
      section_name: section.headerText,
      section_key: section.normalizedKey,
      original_content: section.extractedContent,
      suggested_content: suggestionResult.suggestedContent,
      suggestion_reason: suggestionResult.reason,
      status: 'pending',
      line_number: section.lineNumber,
      coordinates: section.coordinates,
      estimated_score_improvement: suggestionResult.estimatedImprovement
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving suggestion to database:', error);
    return null;
  }

  console.log('Suggestion saved successfully:', data.id);

  return {
    id: data.id,
    cvUploadId: data.cv_upload_id,
    sectionName: data.section_name,
    sectionKey: data.section_key,
    originalContent: data.original_content,
    suggestedContent: data.suggested_content,
    suggestionReason: data.suggestion_reason,
    status: data.status,
    lineNumber: data.line_number,
    coordinates: data.coordinates,
    estimatedScoreImprovement: data.estimated_score_improvement,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

export async function generateAllSuggestions(
  sections: ResumeSection[],
  cvUploadId: string,
  userId: string
): Promise<ATSSuggestion[]> {
  console.log(`Generating suggestions for ${sections.length} sections`);

  // Fetch existing suggestions for this resume to avoid duplicates
  const { data: existingSuggestions } = await supabase
    .from('resume_suggestions')
    .select('section_key, status')
    .eq('cv_upload_id', cvUploadId)
    .eq('user_id', userId)
    .in('status', ['pending', 'accepted']);

  const existingSectionKeys = new Set(
    existingSuggestions?.map(s => s.section_key) || []
  );

  console.log('Existing suggestions for sections:', Array.from(existingSectionKeys));

  const suggestions: ATSSuggestion[] = [];

  for (const section of sections) {
    // Skip if we already have a suggestion for this section
    if (existingSectionKeys.has(section.normalizedKey)) {
      console.log(`Skipping section ${section.normalizedKey} - already has a suggestion`);
      continue;
    }

    const suggestion = await generateSuggestionsForSection(section, cvUploadId, userId);
    if (suggestion) {
      suggestions.push(suggestion);
    }
  }

  console.log(`Generated ${suggestions.length} new suggestions (skipped ${existingSectionKeys.size} existing)`);
  return suggestions;
}

export async function getSuggestionsForResume(cvUploadId: string, userId: string): Promise<ATSSuggestion[]> {
  const { data, error } = await supabase
    .from('resume_suggestions')
    .select('*')
    .eq('cv_upload_id', cvUploadId)
    .eq('user_id', userId)
    .eq('status', 'pending')
    .order('estimated_score_improvement', { ascending: false });

  if (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }

  return data.map(row => ({
    id: row.id,
    cvUploadId: row.cv_upload_id,
    sectionName: row.section_name,
    sectionKey: row.section_key,
    originalContent: row.original_content,
    suggestedContent: row.suggested_content,
    suggestionReason: row.suggestion_reason,
    status: row.status,
    lineNumber: row.line_number,
    coordinates: row.coordinates,
    estimatedScoreImprovement: row.estimated_score_improvement,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }));
}

export async function updateSuggestionStatus(
  suggestionId: string,
  userId: string,
  status: 'accepted' | 'rejected'
): Promise<boolean> {
  const { error } = await supabase
    .from('resume_suggestions')
    .update({ status })
    .eq('id', suggestionId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error updating suggestion status:', error);
    return false;
  }

  return true;
}
