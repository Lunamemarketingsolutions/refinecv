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
    // Get file extension as fallback (some browsers don't set MIME type correctly)
    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
    
    // Check if it's a PDF (by MIME type or extension)
    const isPDF = file.type === 'application/pdf' || fileExtension === '.pdf';
    
    // Check if it's a DOCX (by MIME type or extension)
    const isDOCX = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
                   fileExtension === '.docx';
    
    if (isPDF) {
      const validation = validatePDFFile(file);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }
      const text = await extractTextFromPDF(file);
      return { success: true, text };
    } else if (isDOCX) {
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

  // Get file extension as fallback (some browsers don't set MIME type correctly)
  const fileName = file.name.toLowerCase();
  const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
  
  // Check if it's a PDF (by MIME type or extension)
  const isPDF = file.type === 'application/pdf' || fileExtension === '.pdf';
  
  // Check if it's a DOCX (by MIME type or extension)
  const isDOCX = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
                 fileExtension === '.docx';

  if (!isPDF && !isDOCX) {
    return {
      valid: false,
      error: 'Unsupported file type. Only PDF and DOCX files are supported.',
    };
  }

  return { valid: true };
}

export function getFileExtension(file: File): string {
  // Check MIME type first
  if (file.type === 'application/pdf') return 'pdf';
  if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'docx';
  
  // Fallback to file extension if MIME type is not set
  const fileName = file.name.toLowerCase();
  const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
  if (fileExtension === '.pdf') return 'pdf';
  if (fileExtension === '.docx') return 'docx';
  
  return 'unknown';
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
