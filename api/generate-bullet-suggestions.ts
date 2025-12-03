import 'dotenv/config';
import type { IncomingMessage, ServerResponse } from 'http';
import path from 'path';
import OpenAI from 'openai';
import type { SearchResult } from 'faiss-node';
import { loadFaissIndex, loadMetadata, generateEmbeddings } from '../src/services/embeddingService';
import { Index } from 'faiss-node';

interface BulletRecord {
  id: string;
  text: string;
  section: string;
}

interface MetadataFile {
  createdAt: string;
  dimension: number;
  count: number;
  bullets: BulletRecord[];
}

interface SuggestionPayload {
  suggestions: Array<{
    text: string;
    rating: number;
    improvements: string[];
  }>;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const INDEX_PATH = path.join(DATA_DIR, 'eliteBulletsIndex.faiss');
const METADATA_PATH = path.join(DATA_DIR, 'eliteBulletsMetadata.json');
const SEARCH_TOP_K = 10;
const MIN_SECTION_MATCHES = 5;
const SUGGESTION_MODEL = process.env.OPENAI_SUGGESTION_MODEL || 'gpt-4o-mini';

let cachedIndex: Index | null = null;
let cachedMetadata: MetadataFile | null = null;

// Lazy initialization of OpenAI client
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

function ensureEnv() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OPENAI_API_KEY');
  }
}

function normalizeLabel(label: number) {
  return typeof label === 'number' && label >= 0 ? label : null;
}

async function ensureResourcesLoaded() {
  if (!cachedIndex) {
    cachedIndex = loadFaissIndex(INDEX_PATH, 'ip');
    if (!cachedIndex) {
      throw new Error(`FAISS index not found. Please run npm run build:faiss to generate ${INDEX_PATH}`);
    }
  }

  if (!cachedMetadata) {
    cachedMetadata = loadMetadata<MetadataFile>(METADATA_PATH);
    if (!cachedMetadata) {
      throw new Error(`Metadata not found. Please run npm run build:faiss to generate ${METADATA_PATH}`);
    }
  }
}

function pickMatches(result: SearchResult, section: string) {
  if (!cachedMetadata) return [];

  const matches = result.labels
    .map((label, idx) => {
      const normalized = normalizeLabel(label);
      if (normalized === null) return null;
      const metadata = cachedMetadata!.bullets[normalized];
      if (!metadata) return null;

      return {
        ...metadata,
        distance: result.distances[idx],
        rank: idx,
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const prioritized = matches.filter((item) => item.section === section);

  if (prioritized.length >= MIN_SECTION_MATCHES) {
    return prioritized.slice(0, MIN_SECTION_MATCHES);
  }

  const remainder = matches.filter((item) => item.section !== section);
  return [...prioritized, ...remainder].slice(0, MIN_SECTION_MATCHES);
}

async function generateSuggestions(original: string, section: string, examples: BulletRecord[], userPrompt?: string) {
  const context = examples
    .map((example, idx) => `Example ${idx + 1} (${example.section}): ${example.text}`)
    .join('\n');

  let userMessage = `Original bullet (${section}):\n${original}\n\nElite reference bullets:\n${context}\n\nInstructions:\n- Produce 3-5 upgraded bullet points\n- Use measurable impact, ownership verbs, and relevant keywords\n- Keep each bullet under 40 words\n- Return structured JSON with text, rating (1-5), and improvement rationales`;

  if (userPrompt) {
    userMessage += `\n\nUser's specific request: ${userPrompt}`;
  }

  const response = await getOpenAIClient().chat.completions.create({
    model: SUGGESTION_MODEL,
    temperature: 0.4,
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'bullet_suggestions',
        schema: {
          type: 'object',
          properties: {
            suggestions: {
              type: 'array',
              minItems: 3,
              maxItems: 5,
              items: {
                type: 'object',
                required: ['text', 'rating', 'improvements'],
                properties: {
                  text: { type: 'string' },
                  rating: { type: 'integer', minimum: 1, maximum: 5 },
                  improvements: {
                    type: 'array',
                    minItems: 1,
                    items: { type: 'string' },
                  },
                },
              },
            },
          },
          required: ['suggestions'],
          additionalProperties: false,
        },
      },
    },
    messages: [
      {
        role: 'system',
        content:
          'You are an elite resume writer specializing in crafting quantified, impact-focused bullet points. Improve the provided bullet by drawing inspiration from elite examples.',
      },
      {
        role: 'user',
        content: userMessage,
      },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('Unexpected response format from OpenAI');
  }

  const payload = JSON.parse(content) as SuggestionPayload;
  return payload.suggestions;
}

async function parseRequestBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

export default async function handler(req: IncomingMessage & { body?: any }, res: ServerResponse) {
  try {
    ensureEnv();

    if (req.method !== 'POST') {
      res.statusCode = 405;
      res.setHeader('Allow', 'POST');
      res.end(JSON.stringify({ error: 'Method not allowed' }));
      return;
    }

    const body = typeof req.body === 'object' && req.body !== null ? req.body : await parseRequestBody(req);
    const bulletText = body?.bulletText?.trim?.();
    const section = body?.section?.trim?.();
    const userPrompt = body?.userPrompt?.trim?.();

    if (!bulletText) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'bulletText is required' }));
      return;
    }

    await ensureResourcesLoaded();

    const [queryEmbedding] = await generateEmbeddings([bulletText]);
    // FAISS search expects a flat array format
    const flatQuery = queryEmbedding.flat();
    const searchResult = cachedIndex!.search(flatQuery, SEARCH_TOP_K);
    const matches = pickMatches(searchResult, section || 'General');

    if (!matches.length) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'Unable to retrieve reference bullets' }));
      return;
    }

    const suggestions = await generateSuggestions(
      bulletText,
      section || matches[0].section || 'General',
      matches,
      userPrompt,
    );

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        suggestions,
        context: matches,
      }),
    );
  } catch (error) {
    console.error('RAG API error:', error);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: (error as Error).message || 'Unknown error' }));
  }
}

