import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import faiss from 'faiss-node';

const { Index, IndexFlatIP, IndexFlatL2 } = faiss;

const EMBEDDING_MODEL = process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small';
const DEFAULT_BATCH_SIZE = Number(process.env.EMBEDDING_BATCH_SIZE || 64);

// Lazy initialization of OpenAI client to allow env vars to load first
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required. Please check your .env.local file.');
    }
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

export interface EmbeddingOptions {
  batchSize?: number;
  normalize?: boolean;
}

export interface FaissPaths {
  indexPath: string;
  metadataPath: string;
}

function chunkArray<T>(items: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize));
  }
  return chunks;
}

function normalizeVector(vector: number[]): number[] {
  const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
  if (!norm) {
    return vector;
  }

  return vector.map((value) => value / norm);
}

function flattenVectors(vectors: number[][]): number[] {
  if (vectors.length === 0) {
    return [];
  }

  // FAISS expects a flat array: [v1[0], v1[1], ..., v1[d], v2[0], v2[1], ..., v2[d], ...]
  const result: number[] = [];
  vectors.forEach((vector) => {
    result.push(...vector);
  });

  return result;
}

export async function generateEmbeddings(
  texts: string[],
  options: EmbeddingOptions = {},
): Promise<number[][]> {
  const batchSize = options.batchSize || DEFAULT_BATCH_SIZE;
  const normalize = options.normalize ?? true;

  const embeddings: number[][] = [];
  const inputBatches = chunkArray(texts, batchSize);

  for (const batch of inputBatches) {
    const response = await getOpenAIClient().embeddings.create({
      model: EMBEDDING_MODEL,
      input: batch,
    });

    response.data.forEach((item) => {
      const vector = item.embedding;
      embeddings.push(normalize ? normalizeVector(vector) : vector);
    });
  }

  return embeddings;
}

export function createFaissIndex(
  embeddings: number[][],
  metric: 'ip' | 'l2' = 'ip',
): Index {
  if (!embeddings.length) {
    throw new Error('Cannot build FAISS index without embeddings');
  }

  const dimension = embeddings[0].length;
  const index = metric === 'ip' ? new IndexFlatIP(dimension) : new IndexFlatL2(dimension);

  // FAISS expects a flat array format: [v1[0], v1[1], ..., v1[d], v2[0], ...]
  const vectors = flattenVectors(embeddings);
  index.add(vectors);

  return index;
}

export function saveFaissIndex(index: Index, outputPath: string): void {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  index.write(outputPath);
}

export function loadFaissIndex(indexPath: string, metric: 'ip' | 'l2' = 'ip'): Index | null {
  if (!fs.existsSync(indexPath)) {
    return null;
  }

  const IndexFactory = metric === 'ip' ? IndexFlatIP : IndexFlatL2;
  return IndexFactory.read(indexPath);
}

export function saveMetadata(metadata: unknown, metadataPath: string): void {
  const dir = path.dirname(metadataPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');
}

export function loadMetadata<T>(metadataPath: string): T | null {
  if (!fs.existsSync(metadataPath)) {
    return null;
  }

  const raw = fs.readFileSync(metadataPath, 'utf-8');
  return JSON.parse(raw) as T;
}

