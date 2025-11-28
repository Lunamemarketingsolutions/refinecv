import { extractTextFromPDF, validatePDFFile } from './pdfExtractor';
import { extractTextFromDOCX, validateDOCXFile } from './docxExtractor';

export type SupportedFileType = 'application/pdf' | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export interface ExtractionResult {
  success: boolean;
  text?: string;
  error?: string;
}

export async function extractTextFromFile(file: File): Promise<ExtractionResult> {
  try {
    if (file.type === 'application/pdf') {
      const validation = validatePDFFile(file);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }
      const text = await extractTextFromPDF(file);
      return { success: true, text };
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const validation = validateDOCXFile(file);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }
      const text = await extractTextFromDOCX(file);
      return { success: true, text };
    } else {
      return {
        success: false,
        error: 'Unsupported file type. Please upload a PDF or DOCX file.',
      };
    }
  } catch (error) {
    console.error('Error extracting text from file:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to extract text from file',
    };
  }
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 5MB' };
  }

  const supportedTypes: SupportedFileType[] = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (!supportedTypes.includes(file.type as SupportedFileType)) {
    return {
      valid: false,
      error: 'Unsupported file type. Only PDF and DOCX files are supported.',
    };
  }

  return { valid: true };
}

export function getFileExtension(file: File): string {
  if (file.type === 'application/pdf') return 'pdf';
  if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'docx';
  return 'unknown';
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
