export interface GeneratedSuggestion {
  text: string;
  rating: number;
  improvements: string[];
}

export interface SuggestionResponse {
  suggestions: GeneratedSuggestion[];
  context: Array<{
    id: string;
    text: string;
    section: string;
    distance: number;
    rank: number;
  }>;
}

const API_ROUTE = '/api/generate-bullet-suggestions';

export async function generateBulletSuggestions(
  bulletText: string,
  section?: string,
  userPrompt?: string,
): Promise<SuggestionResponse> {
  const response = await fetch(API_ROUTE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      bulletText,
      section,
      userPrompt,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || 'Failed to generate suggestions');
  }

  return response.json();
}

