import { supabase, CVAnalysis, CVUpload } from '../lib/supabase';
import { extractTextFromPDF, validatePDFFile } from '../utils/pdfExtractor';
import { analyzeKeywordMatch } from '../utils/keywordAnalyzer';

function getSessionId(): string {
  let sessionId = localStorage.getItem('cv_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('cv_session_id', sessionId);
  }
  return sessionId;
}

export async function uploadCV(file: File): Promise<{ success: boolean; data?: CVUpload; error?: string }> {
  try {
    const validation = validatePDFFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const sessionId = getSessionId();
    const fileName = `${sessionId}/${Date.now()}_${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from('cv-uploads')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return { success: false, error: 'Failed to upload file to storage' };
    }

    const extractedText = await extractTextFromPDF(file);

    const { data, error: dbError } = await supabase
      .from('cv_uploads')
      .insert({
        session_id: sessionId,
        file_name: file.name,
        file_path: fileName,
        file_size: file.size,
        extracted_text: extractedText
      })
      .select()
      .maybeSingle();

    if (dbError || !data) {
      console.error('Database insert error:', dbError);
      return { success: false, error: 'Failed to save upload record' };
    }

    return { success: true, data: data as CVUpload };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Upload failed' };
  }
}

export async function analyzeCV(
  cvText: string,
  jdText: string,
  cvUploadId?: string
): Promise<{ success: boolean; data?: CVAnalysis; error?: string }> {
  try {
    if (!cvText || !jdText) {
      return { success: false, error: 'CV text and JD text are required' };
    }

    const analysis = analyzeKeywordMatch(cvText, jdText);
    const sessionId = getSessionId();

    const { data, error } = await supabase
      .from('cv_analyses')
      .insert({
        session_id: sessionId,
        cv_upload_id: cvUploadId || null,
        cv_text: cvText,
        jd_text: jdText,
        match_score: analysis.matchScore,
        matched_keywords: analysis.matched,
        missing_keywords: analysis.missing,
        partial_matches: analysis.partialMatches,
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        action_items: analysis.actionItems,
        analysis_metadata: {
          total_cv_words: cvText.split(/\s+/).length,
          total_jd_words: jdText.split(/\s+/).length,
          analysis_date: new Date().toISOString()
        }
      })
      .select()
      .maybeSingle();

    if (error || !data) {
      console.error('Analysis save error:', error);
      return { success: false, error: 'Failed to save analysis' };
    }

    return { success: true, data: data as CVAnalysis };
  } catch (error) {
    console.error('Analysis error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Analysis failed' };
  }
}

export async function getRecentAnalyses(limit: number = 10): Promise<CVAnalysis[]> {
  try {
    const sessionId = getSessionId();

    const { data, error } = await supabase
      .from('cv_analyses')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Fetch analyses error:', error);
      return [];
    }

    return (data || []) as CVAnalysis[];
  } catch (error) {
    console.error('Get analyses error:', error);
    return [];
  }
}

export async function getAnalysisById(id: string): Promise<CVAnalysis | null> {
  try {
    const { data, error } = await supabase
      .from('cv_analyses')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      console.error('Fetch analysis error:', error);
      return null;
    }

    return data as CVAnalysis;
  } catch (error) {
    console.error('Get analysis error:', error);
    return null;
  }
}

export async function deleteAnalysis(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('cv_analyses')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete analysis error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
}
