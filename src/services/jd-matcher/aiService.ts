// OpenRouter API Configuration
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_API_URL = import.meta.env.VITE_OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = import.meta.env.VITE_AI_MODEL || 'openai/gpt-3.5-turbo';

import type { ResumeData, Recommendation, JDMatchAnalysis } from '../../types/jdMatcher';

export async function analyzeResumeWithAI(text: string, jobDescription?: string): Promise<JDMatchAnalysis> {
  let prompt = `You are an expert resume analyzer. Extract the following information from the resume text provided below.
Return the output strictly as a JSON object with the following structure (no markdown, just pure JSON):
{
  "fullName": "string",
  "professionalSummary": "string",
  "skills": ["string", "string"],
  "experience": [
    {
      "company": "string",
      "role": "string",
      "duration": "string",
      "description": "string"
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "year": "string"
    }
  ],
  "certifications": [
    {
      "name": "string",
      "issuer": "string",
      "year": "string"
    }
  ],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "technologies": ["string"]
    }
  ]`;

  if (jobDescription) {
    prompt += `,
  "recommendations": [
    {
      "id": "string (unique)",
      "type": "summary" | "skill" | "experience" | "education" | "certification" | "project",
      "current": "string (original text or empty if new)",
      "suggested": "string (optimized text based on JD)",
      "reason": "string (why this change is recommended)"
    }
  ]
}

Compare the resume against the following Job Description and suggest specific improvements to better match keywords and requirements.
- Summary: Tailor to the JD.
- Skills: Add missing keywords, remove irrelevant ones.
- Experience: Rephrase bullets to match JD language/impact.
- Education: Highlight relevant coursework or honors if applicable.
- Certifications: Suggest adding relevant certs if missing or highlighting existing ones.
- Projects: Tailor descriptions to demonstrate required skills.

Job Description:
${jobDescription}`;
  } else {
    prompt += `
}`;
  }

  prompt += `

Resume Text:
${text}`;

  try {
    const payload = {
      model: MODEL,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 3000
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Resume Analyzer'
    };

    if (OPENROUTER_API_KEY) {
      headers['Authorization'] = `Bearer ${OPENROUTER_API_KEY}`;
    } else {
      throw new Error('VITE_OPENROUTER_API_KEY is not configured. Please add it to your .env.local file.');
    }

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No response from AI');
    }

    // Clean up markdown code blocks if present
    const jsonString = content.replace(/```json\n|\n```|```/g, "").trim();

    try {
      const parsed = JSON.parse(jsonString);
      
      // Ensure recommendations array exists
      const recommendations: Recommendation[] = parsed.recommendations || [];
      
      // Generate IDs for recommendations if missing
      recommendations.forEach((rec, index) => {
        if (!rec.id) {
          rec.id = `rec-${Date.now()}-${index}`;
        }
      });

      const resumeData: ResumeData = {
        fullName: parsed.fullName || '',
        professionalSummary: parsed.professionalSummary || '',
        skills: parsed.skills || [],
        experience: parsed.experience || [],
        education: parsed.education || [],
        certifications: parsed.certifications || [],
        projects: parsed.projects || []
      };

      return {
        resumeData,
        recommendations,
        jdText: jobDescription || ''
      };
    } catch (error) {
      console.error("Failed to parse AI response:", error);
      console.log("Raw response:", content);
      throw new Error("Failed to parse resume data from AI response");
    }
  } catch (error) {
    console.error('AI Analysis Error:', error);
    throw error;
  }
}

