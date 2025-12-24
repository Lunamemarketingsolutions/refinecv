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
  try {
    console.log('Making API request to:', API_ROUTE, { bulletText, section, userPrompt });
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

    console.log('API response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const errorMessage = errorBody.error || `HTTP ${response.status}: ${response.statusText}`;
      console.error('API error response:', errorBody);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('API success response:', data);
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Could not connect to the AI service. Please ensure the API server is running on port 3001.');
    }
    throw error;
  }
}

