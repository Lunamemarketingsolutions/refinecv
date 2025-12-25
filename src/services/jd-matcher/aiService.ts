// OpenRouter API Configuration
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY?.trim();
const OPENROUTER_API_URL = import.meta.env.VITE_OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = import.meta.env.VITE_AI_MODEL || 'openai/gpt-3.5-turbo';

// Debug: Log configuration (without exposing full key)
if (import.meta.env.DEV) {
  console.log('OpenRouter API Configuration:', {
    hasApiKey: !!OPENROUTER_API_KEY,
    apiKeyLength: OPENROUTER_API_KEY?.length || 0,
    apiKeyPrefix: OPENROUTER_API_KEY ? OPENROUTER_API_KEY.substring(0, 10) + '...' : 'missing',
    apiUrl: OPENROUTER_API_URL,
    model: MODEL
  });
}

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
      max_tokens: 4000, // Increased to handle longer responses
      response_format: { type: "json_object" } // Force JSON output
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Resume Analyzer'
    };

    if (!OPENROUTER_API_KEY) {
      throw new Error('VITE_OPENROUTER_API_KEY is not configured. Please add it to your .env.local file.');
    }

    // Validate API key format
    if (!OPENROUTER_API_KEY.startsWith('sk-or-v1-')) {
      console.warn('OpenRouter API key format may be incorrect. Expected format: sk-or-v1-...');
    }

    headers['Authorization'] = `Bearer ${OPENROUTER_API_KEY}`;

    console.log('Making OpenRouter API request:', {
      url: OPENROUTER_API_URL,
      model: MODEL,
      hasApiKey: !!OPENROUTER_API_KEY,
      apiKeyPrefix: OPENROUTER_API_KEY.substring(0, 10) + '...'
    });

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const statusCode = response.status;
      const errorMessage = errorData.error?.message || response.statusText;
      
      console.error('OpenRouter API Error:', {
        status: statusCode,
        statusText: response.statusText,
        error: errorData,
        apiKeyConfigured: !!OPENROUTER_API_KEY
      });
      
      // Provide more helpful error messages
      if (statusCode === 401 || errorMessage.includes('User not found') || errorMessage.includes('Invalid API key')) {
        throw new Error(
          `OpenRouter API Authentication Failed: ${errorMessage}\n\n` +
          `Please check:\n` +
          `1. Your API key is valid at https://openrouter.ai/keys\n` +
          `2. The key in .env.local matches your OpenRouter account\n` +
          `3. Your OpenRouter account is active and has credits\n` +
          `4. Restart the dev server after updating .env.local`
        );
      }
      
      throw new Error(`API Error (${statusCode}): ${errorMessage}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No response from AI');
    }

    // Clean up markdown code blocks if present
    let jsonString = content.replace(/```json\n|\n```|```/g, "").trim();
    
    // Try to extract JSON if it's wrapped in other text
    const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonString = jsonMatch[0];
    }

    // Log the JSON string for debugging (first 500 chars)
    console.log('AI Response (first 500 chars):', jsonString.substring(0, 500));
    if (jsonString.length > 500) {
      console.log('AI Response (last 500 chars):', jsonString.substring(jsonString.length - 500));
    }

    try {
      // Try to fix common JSON issues before parsing
      let cleanedJson = jsonString;
      
      // Remove trailing commas before closing braces/brackets
      cleanedJson = cleanedJson.replace(/,(\s*[}\]])/g, '$1');
      
      // Fix unescaped quotes in strings (basic attempt)
      // This is tricky, so we'll try parsing first and only fix if needed
      
      let parsed;
      try {
        parsed = JSON.parse(cleanedJson);
      } catch (parseError) {
        // If still fails, try to find and fix the issue at the error position
        if (parseError instanceof SyntaxError) {
          const match = parseError.message.match(/position (\d+)/);
          if (match) {
            const errorPos = parseInt(match[1]);
            console.error('JSON parse error at position:', errorPos);
            console.error('Context around error:', {
              before: cleanedJson.substring(Math.max(0, errorPos - 50), errorPos),
              after: cleanedJson.substring(errorPos, Math.min(cleanedJson.length, errorPos + 50)),
              fullLength: cleanedJson.length
            });
            
            // Try to fix common issues
            // Remove any control characters that might break JSON
            cleanedJson = cleanedJson.replace(/[\x00-\x1F\x7F]/g, '');
            
            // Try parsing again
            try {
              parsed = JSON.parse(cleanedJson);
            } catch (secondError) {
              // Last resort: log the full response for manual inspection
              console.error('Failed to parse JSON after cleanup. Full response:', content);
              throw new Error(`Invalid JSON response from AI. Error at position ${errorPos}: ${parseError.message}`);
            }
          } else {
            throw parseError;
          }
        } else {
          throw parseError;
        }
      }
      
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

