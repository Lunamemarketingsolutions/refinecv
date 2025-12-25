import { supabase } from '../../lib/supabase';
import { trackFeatureUsage } from '../usageTrackingService';
import type { ATSAnalysis } from '../../types/ats';

export interface SaveResumeParams {
  fileName: string;
  fileSize: number;
  fileUrl: string;
  storagePath: string;
  analysis: ATSAnalysis;
  userId: string;
  cvUploadId?: string;
}

export interface StoredResume {
  cvUpload: {
    id: string;
    user_id: string;
    file_name: string;
    file_path: string;
    file_size: number;
    extracted_text: string | null;
    created_at: string;
  };
  analysis: {
    id: string;
    user_id: string;
    cv_upload_id: string;
    overall_score: number;
    critical_issues: any[];
    warnings: any[];
    passed_checks: string[];
    ats_text_extraction: string;
    section_scores: any;
    detected_sections: any;
    word_count: number;
    character_count: number;
    page_count: number;
    created_at: string;
    updated_at: string;
  } | null;
}

export async function saveResumeAnalysis(params: SaveResumeParams): Promise<StoredResume> {
  const { fileName, fileSize, fileUrl, analysis, userId, cvUploadId: providedCvUploadId } = params;

  // Get public URL from storage path
  const storagePath = params.storagePath;

  let cvUploadId: string;

  if (providedCvUploadId) {
    // Use provided cv_upload_id and update it
    cvUploadId = providedCvUploadId;
    await supabase
      .from('cv_uploads')
      .update({
        extracted_text: analysis.extractedText,
        file_size: fileSize,
      })
      .eq('id', cvUploadId)
      .eq('user_id', userId);
  } else {
    // Find existing cv_upload by file_path or create new one
    const { data: existingUpload } = await supabase
      .from('cv_uploads')
      .select('*')
      .eq('file_path', storagePath)
      .eq('user_id', userId)
      .maybeSingle();

    if (existingUpload) {
      cvUploadId = existingUpload.id;
      // Update existing upload
      await supabase
        .from('cv_uploads')
        .update({
          extracted_text: analysis.extractedText,
          file_size: fileSize,
        })
        .eq('id', cvUploadId);
    } else {
      // Create new cv_upload
      const { data: uploadData, error: uploadError } = await supabase
        .from('cv_uploads')
        .insert({
          user_id: userId,
          file_name: fileName,
          file_path: storagePath,
          file_size: fileSize,
          extracted_text: analysis.extractedText,
          session_id: '', // Legacy field, can be empty
        })
        .select()
        .single();

      if (uploadError || !uploadData) {
        throw new Error(`Failed to save CV upload: ${uploadError?.message || 'Unknown error'}`);
      }

      cvUploadId = uploadData.id;
    }
  }

  // Save or update ATS analysis
  const { data: existingAnalysis } = await supabase
    .from('ats_analyses')
    .select('*')
    .eq('cv_upload_id', cvUploadId)
    .eq('user_id', userId)
    .maybeSingle();

  let analysisData;

  if (existingAnalysis) {
    // Update existing analysis
    const { data, error } = await supabase
      .from('ats_analyses')
      .update({
        overall_score: analysis.score,
        ats_text_extraction: analysis.extractedText,
        critical_issues: analysis.issues.filter(i => i.type === 'error'),
        warnings: analysis.issues.filter(i => i.type === 'warning' || i.type === 'info'),
        passed_checks: [],
        section_scores: {},
        detected_sections: analysis.detectedSections || [],
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingAnalysis.id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to update ATS analysis: ${error?.message || 'Unknown error'}`);
    }

    analysisData = data;
  } else {
    // Create new analysis
    const insertData: any = {
      user_id: userId,
      cv_upload_id: cvUploadId,
      overall_score: analysis.score,
      ats_text_extraction: analysis.extractedText,
      critical_issues: analysis.issues.filter(i => i.type === 'error'),
      warnings: analysis.issues.filter(i => i.type === 'warning' || i.type === 'info'),
      passed_checks: [],
      section_scores: {},
      detected_sections: analysis.detectedSections || [],
    };

    const { data, error } = await supabase
      .from('ats_analyses')
      .insert(insertData)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to save ATS analysis: ${error?.message || 'Unknown error'}`);
    }

    analysisData = data;
  }

  // Get the cv_upload data
  const { data: cvUploadData } = await supabase
    .from('cv_uploads')
    .select('*')
    .eq('id', cvUploadId)
    .single();

  if (!cvUploadData) {
    throw new Error('Failed to retrieve CV upload data');
  }

  // Track feature usage (non-blocking, but await to ensure it's called)
  // Note: Don't pass analysisData.id as analysisId because it references ats_analyses,
  // but the foreign key constraint expects cv_analyses. We use cv_upload_id instead.
  trackFeatureUsage(userId, 'ats_analyzer', cvUploadId).catch((err) => {
    console.error('Failed to track ATS analyzer usage:', err);
    // Don't throw - tracking failure shouldn't break the upload flow
  });

  return {
    cvUpload: cvUploadData,
    analysis: analysisData,
  };
}

export async function getResumeById(id: string, userId: string): Promise<StoredResume | null> {
  const { data: cvUploadData, error: cvError } = await supabase
    .from('cv_uploads')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (cvError || !cvUploadData) {
    return null;
  }

  const { data: analysisData } = await supabase
    .from('ats_analyses')
    .select('*')
    .eq('cv_upload_id', id)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return {
    cvUpload: cvUploadData,
    analysis: analysisData,
  };
}

export async function getAllResumes(
  userId: string,
  limit: number = 20,
  offset: number = 0
): Promise<StoredResume[]> {
  const { data: uploads, error: uploadError } = await supabase
    .from('cv_uploads')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (uploadError || !uploads) {
    throw new Error(`Failed to fetch resumes: ${uploadError?.message || 'Unknown error'}`);
  }

  const resumesWithAnalysis = await Promise.all(
    uploads.map(async (upload) => {
      const { data: analysisData } = await supabase
        .from('ats_analyses')
        .select('*')
        .eq('cv_upload_id', upload.id)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      return {
        cvUpload: upload,
        analysis: analysisData,
      };
    })
  );

  return resumesWithAnalysis;
}

export async function deleteResume(id: string, userId: string, storagePath?: string): Promise<void> {
  // Delete analysis first
  const { error: analysisError } = await supabase
    .from('ats_analyses')
    .delete()
    .eq('cv_upload_id', id)
    .eq('user_id', userId);

  if (analysisError) {
    throw new Error(`Failed to delete analysis: ${analysisError.message}`);
  }

  // Delete suggestions and edits
  await supabase
    .from('resume_suggestions')
    .delete()
    .eq('cv_upload_id', id)
    .eq('user_id', userId);

  await supabase
    .from('resume_edits')
    .delete()
    .eq('cv_upload_id', id)
    .eq('user_id', userId);

  // Delete cv_upload
  const { error: uploadError } = await supabase
    .from('cv_uploads')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (uploadError) {
    throw new Error(`Failed to delete resume: ${uploadError.message}`);
  }

  // Delete from storage if path provided
  if (storagePath) {
    const { deleteResumeFromStorage } = await import('./storageService');
    await deleteResumeFromStorage(storagePath);
  }
}

export async function updateResumeAnalysis(
  cvUploadId: string,
  userId: string,
  analysis: ATSAnalysis
): Promise<any> {
  const { data, error } = await supabase
    .from('ats_analyses')
    .update({
      overall_score: analysis.score,
      ats_text_extraction: analysis.extractedText,
      critical_issues: analysis.issues.filter(i => i.type === 'error'),
      warnings: analysis.issues.filter(i => i.type === 'warning' || i.type === 'info'),
      detected_sections: analysis.detectedSections || [],
      updated_at: new Date().toISOString(),
    })
    .eq('cv_upload_id', cvUploadId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error || !data) {
    throw new Error(`Failed to update analysis: ${error?.message || 'Unknown error'}`);
  }

  return data;
}
