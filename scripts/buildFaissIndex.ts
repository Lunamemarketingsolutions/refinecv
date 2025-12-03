import dotenv from 'dotenv';
import fs from 'fs';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });
import path from 'path';
import { randomUUID } from 'crypto';
import { fileURLToPath } from 'url';
import {
  createFaissIndex,
  generateEmbeddings,
  saveFaissIndex,
  saveMetadata,
} from '../src/services/embeddingService';

interface SectionedBulletPoints {
  [section: string]: string[];
}

interface BulletMetadata {
  id: string;
  text: string;
  section: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(PROJECT_ROOT, 'data');
const SOURCE_JSON = path.join(PROJECT_ROOT, 'src', 'data', 'eliteBulletPoints.json');
const INDEX_PATH = path.join(DATA_DIR, 'eliteBulletsIndex.faiss');
const METADATA_PATH = path.join(DATA_DIR, 'eliteBulletsMetadata.json');

async function buildIndex() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OPENAI_API_KEY. Please set it before running the script.');
  }

  if (!fs.existsSync(SOURCE_JSON)) {
    throw new Error(`Could not find elite bullet data at ${SOURCE_JSON}`);
  }

  console.log('Reading elite bullet JSON...');
  const raw = fs.readFileSync(SOURCE_JSON, 'utf-8');
  const parsed = JSON.parse(raw) as SectionedBulletPoints;

  const bulletRecords: BulletMetadata[] = [];
  const bulletTexts: string[] = [];

  Object.entries(parsed).forEach(([section, bullets]) => {
    if (!Array.isArray(bullets)) return;

    bullets.forEach((text) => {
      const normalized = (text || '').trim();
      if (!normalized) return;

      bulletRecords.push({
        id: randomUUID(),
        text: normalized,
        section,
      });
      bulletTexts.push(normalized);
    });
  });

  if (bulletTexts.length === 0) {
    throw new Error('No bullet points were found in the provided JSON file.');
  }

  console.log(`Generating embeddings for ${bulletTexts.length} bullet points...`);
  const embeddings = await generateEmbeddings(bulletTexts, {
    batchSize: Number(process.env.EMBEDDING_BATCH_SIZE || 64),
    normalize: true,
  });

  console.log('Building FAISS index...');
  const index = createFaissIndex(embeddings, 'ip');

  console.log(`Saving FAISS index to ${INDEX_PATH}`);
  saveFaissIndex(index, INDEX_PATH);

  console.log(`Saving metadata to ${METADATA_PATH}`);
  saveMetadata(
    {
      createdAt: new Date().toISOString(),
      dimension: embeddings[0].length,
      count: embeddings.length,
      bullets: bulletRecords,
    },
    METADATA_PATH,
  );

  console.log('FAISS index build complete.');
}

buildIndex().catch((error) => {
  console.error('Failed to build FAISS index:', error);
  process.exit(1);
});

