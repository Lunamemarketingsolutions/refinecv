import { supabase } from '../../lib/supabase';
import { PDFGenerator } from './pdfGenerationService';
import { uploadResumeToStorage } from './storageService';
import { saveResumeAnalysis } from './resumeService';
import { extractTextFromPDF, analyzePDFForATS } from './pdfProcessor';
import type { ExtractedResumeData, ReformatProgress } from '../../types/ats';

export class ResumeReformatService {
  private onProgress?: (progress: ReformatProgress) => void;

  constructor(onProgress?: (progress: ReformatProgress) => void) {
    this.onProgress = onProgress;
  }

  private updateProgress(stage: ReformatProgress['stage'], percentage: number, message: string) {
    if (this.onProgress) {
      this.onProgress({ stage, percentage, message });
    }
  }

  async extractContent(file: File): Promise<string> {
    this.updateProgress('extracting', 10, 'Extracting text from resume...');

    try {
      const extractedText = await extractTextFromPDF(file);

      if (!extractedText || extractedText.trim().length < 50) {
        throw new Error('Unable to extract sufficient text from the resume. The file may be image-based or corrupted.');
      }

      this.updateProgress('extracting', 30, 'Text extracted successfully');
      return extractedText;
    } catch (error) {
      throw new Error(`Failed to extract text: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async analyzeWithAI(extractedText: string, fileName: string): Promise<ExtractedResumeData> {
    this.updateProgress('analyzing', 40, 'Analyzing resume with AI...');

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/extract-resume-content`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          extractedText,
          fileName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        if (errorData.error === 'insufficient_content') {
          throw new Error(
            `Image-Based Resume Detected: ${errorData.message}\n\nTip: Convert your resume to a text-based PDF using a PDF editor or document converter before reformatting.`
          );
        }

        if (errorData.error === 'placeholder_content_detected') {
          throw new Error(
            `Content Quality Issue: ${errorData.message}\n\nThe system couldn't extract your actual resume content. This usually means the PDF is image-based or has very poor text extraction quality.`
          );
        }

        if (errorData.error === 'insufficient_extracted_content') {
          throw new Error(
            `Extraction Failed: ${errorData.message}\n\nPlease ensure your resume has readable text and proper formatting.`
          );
        }

        throw new Error(errorData.message || errorData.error || 'AI extraction failed');
      }

      const result = await response.json();

      if (!result.success || !result.data) {
        throw new Error('Invalid response from AI service');
      }

      this.updateProgress('analyzing', 60, 'Content analyzed and structured');
      return result.data as ExtractedResumeData;
    } catch (error) {
      if (error instanceof Error && error.message.includes('Image-Based Resume')) {
        throw error;
      }
      if (error instanceof Error && error.message.includes('Content Quality Issue')) {
        throw error;
      }
      if (error instanceof Error && error.message.includes('Extraction Failed')) {
        throw error;
      }
      throw new Error(`AI analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async generatePDF(data: ExtractedResumeData): Promise<Uint8Array> {
    this.updateProgress('generating', 70, 'Generating ATS-friendly PDF...');

    try {
      const generator = new PDFGenerator();
      const pdfBytes = await generator.generateResumePDF(data);

      this.updateProgress('generating', 90, 'PDF generated successfully');
      return pdfBytes;
    } catch (error) {
      throw new Error(`PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async saveReformattedResume(
    pdfBytes: Uint8Array,
    originalFileName: string,
    extractedData: ExtractedResumeData,
    userId: string
  ): Promise<{ fileUrl: string; cvUploadId: string; analysisId: string }> {
    this.updateProgress('generating', 95, 'Saving reformatted resume...');

    try {
      const reformattedFileName = `reformatted_${Date.now()}_${originalFileName}`;
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const file = new File([blob], reformattedFileName, { type: 'application/pdf' });

      const uploadResult = await uploadResumeToStorage(file, userId);

      // Create cv_upload record
      const { data: cvUpload, error: cvError } = await supabase
        .from('cv_uploads')
        .insert({
          user_id: userId,
          file_name: reformattedFileName,
          file_path: uploadResult.path,
          file_size: file.size,
          extracted_text: null, // Will be set by analysis
        })
        .select()
        .single();

      if (cvError || !cvUpload) {
        throw new Error(`Failed to create cv_upload: ${cvError?.message || 'Unknown error'}`);
      }

      const analysis = await analyzePDFForATS(file);

      const savedResume = await saveResumeAnalysis({
        fileName: reformattedFileName,
        fileSize: file.size,
        fileUrl: uploadResult.publicUrl,
        storagePath: uploadResult.path,
        analysis,
        userId,
        cvUploadId: cvUpload.id
      });

      this.updateProgress('complete', 100, 'Reformat complete!');

      return {
        fileUrl: uploadResult.publicUrl,
        cvUploadId: cvUpload.id,
        analysisId: savedResume.analysis!.id
      };
    } catch (error) {
      throw new Error(`Failed to save resume: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async reformatResume(file: File, userId: string): Promise<{
    pdfBytes: Uint8Array;
    extractedData: ExtractedResumeData;
    fileUrl: string;
    cvUploadId: string;
    analysisId: string;
  }> {
    try {
      const extractedText = await this.extractContent(file);

      const extractedData = await this.analyzeWithAI(extractedText, file.name);

      const pdfBytes = await this.generatePDF(extractedData);

      const { fileUrl, cvUploadId, analysisId } = await this.saveReformattedResume(
        pdfBytes,
        file.name,
        extractedData,
        userId
      );

      return {
        pdfBytes,
        extractedData,
        fileUrl,
        cvUploadId,
        analysisId
      };
    } catch (error) {
      this.updateProgress('error', 0, error instanceof Error ? error.message : 'Reformatting failed');
      throw error;
    }
  }

  async reformatFromExtractedText(
    extractedText: string,
    fileName: string,
    userId: string
  ): Promise<{
    pdfBytes: Uint8Array;
    extractedData: ExtractedResumeData;
    fileUrl: string;
    cvUploadId: string;
    analysisId: string;
  }> {
    try {
      this.updateProgress('analyzing', 20, 'Analyzing existing resume...');

      const extractedData = await this.analyzeWithAI(extractedText, fileName);

      const pdfBytes = await this.generatePDF(extractedData);

      const { fileUrl, cvUploadId, analysisId } = await this.saveReformattedResume(
        pdfBytes,
        fileName,
        extractedData,
        userId
      );

      this.updateProgress('complete', 100, 'Reformat complete!');

      return {
        pdfBytes,
        extractedData,
        fileUrl,
        cvUploadId,
        analysisId
      };
    } catch (error) {
      this.updateProgress('error', 0, error instanceof Error ? error.message : 'Reformatting failed');
      throw error;
    }
  }
}

export async function reformatResume(
  file: File,
  userId: string,
  onProgress?: (progress: ReformatProgress) => void
): Promise<{
  pdfBytes: Uint8Array;
  extractedData: ExtractedResumeData;
  fileUrl: string;
  cvUploadId: string;
  analysisId: string;
}> {
  const service = new ResumeReformatService(onProgress);
  return await service.reformatResume(file, userId);
}

export async function reformatFromExtractedText(
  extractedText: string,
  fileName: string,
  userId: string,
  onProgress?: (progress: ReformatProgress) => void
): Promise<{
  pdfBytes: Uint8Array;
  extractedData: ExtractedResumeData;
  fileUrl: string;
  cvUploadId: string;
  analysisId: string;
}> {
  const service = new ResumeReformatService(onProgress);
  return await service.reformatFromExtractedText(extractedText, fileName, userId);
}

