import { supabase } from '../lib/supabase';
import {
  SAMPLE_CV_TEXT,
  SAMPLE_JD_TEXT,
  SAMPLE_ATS_RESULTS,
  SAMPLE_JD_MATCH_RESULTS
} from './sampleDataConstants';

export async function createATSSample(userId: string): Promise<string> {
  try {
    const { data: cvUpload, error: cvError } = await supabase
      .from('cv_uploads')
      .insert({
        user_id: userId,
        file_name: SAMPLE_ATS_RESULTS.cvName,
        file_path: `${userId}/sample_cv.pdf`,
        file_size: 245760,
        extracted_text: SAMPLE_CV_TEXT,
        is_sample: true,
      })
      .select()
      .maybeSingle();

    if (cvError || !cvUpload) {
      throw new Error('Failed to create sample CV upload');
    }

    const { data: analysis, error: analysisError } = await supabase
      .from('ats_analyses')
      .insert({
        user_id: userId,
        cv_upload_id: cvUpload.id,
        overall_score: SAMPLE_ATS_RESULTS.overallScore,
        is_sample: true,
        critical_issues: SAMPLE_ATS_RESULTS.critical_issues,
        warnings: SAMPLE_ATS_RESULTS.warnings,
        passed_checks: SAMPLE_ATS_RESULTS.passed_checks,
        ats_text_extraction: SAMPLE_ATS_RESULTS.ats_text_extraction,
        section_scores: SAMPLE_ATS_RESULTS.section_scores,
      })
      .select()
      .maybeSingle();

    if (analysisError || !analysis) {
      throw new Error('Failed to create sample analysis');
    }

    return analysis.id;
  } catch (error) {
    console.error('Error creating ATS sample:', error);
    throw error;
  }
}

export async function createJDMatchSample(userId: string): Promise<string> {
  try {
    const { data: cvUpload, error: cvError } = await supabase
      .from('cv_uploads')
      .insert({
        user_id: userId,
        file_name: SAMPLE_JD_MATCH_RESULTS.cvName,
        file_path: `${userId}/sample_cv.pdf`,
        file_size: 245760,
        extracted_text: SAMPLE_CV_TEXT,
        is_sample: true,
      })
      .select()
      .maybeSingle();

    if (cvError || !cvUpload) {
      throw new Error('Failed to create sample CV upload');
    }

    const { data: match, error: matchError } = await supabase
      .from('jd_matches')
      .insert({
        user_id: userId,
        cv_upload_id: cvUpload.id,
        jd_text: SAMPLE_JD_TEXT,
        jd_source: 'paste',
        jd_metadata: SAMPLE_JD_MATCH_RESULTS.jdInfo,
        overall_score: SAMPLE_JD_MATCH_RESULTS.overallScore,
        is_sample: true,
        matched_keywords: SAMPLE_JD_MATCH_RESULTS.matchedKeywordsDetail,
        partial_matches: SAMPLE_JD_MATCH_RESULTS.partialMatchesDetail,
        missing_keywords: SAMPLE_JD_MATCH_RESULTS.missingKeywordsDetail,
        strengths: SAMPLE_JD_MATCH_RESULTS.strengths,
        weaknesses: SAMPLE_JD_MATCH_RESULTS.weaknesses,
        action_items: SAMPLE_JD_MATCH_RESULTS.actionPlan,
      })
      .select()
      .maybeSingle();

    if (matchError || !match) {
      throw new Error('Failed to create sample match');
    }

    return match.id;
  } catch (error) {
    console.error('Error creating JD match sample:', error);
    throw error;
  }
}

