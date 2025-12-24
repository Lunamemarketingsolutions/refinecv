import { supabase } from '../../lib/supabase';
import type { JDMatchAnalysis, JDMatchRecord, Recommendation } from '../../types/jdMatcher';

export interface SaveJDMatchParams {
  userId: string;
  cvUploadId: string | null;
  jdText: string;
  jdSource: 'paste' | 'pdf' | 'docx' | 'txt' | 'image';
  jdMetadata?: Record<string, any>;
  analysis: JDMatchAnalysis;
}

export async function saveJDMatchAnalysis(params: SaveJDMatchParams): Promise<JDMatchRecord> {
  const { userId, cvUploadId, jdText, jdSource, jdMetadata, analysis } = params;

  const { data, error } = await supabase
    .from('jd_matches')
    .insert({
      user_id: userId,
      cv_upload_id: cvUploadId,
      jd_text: jdText,
      jd_source: jdSource,
      jd_metadata: jdMetadata || {},
      resume_data: analysis.resumeData,
      recommendations: analysis.recommendations,
      applied_recommendations: [],
      overall_score: 0, // Will be calculated if needed
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving JD match:', error);
    throw new Error(`Failed to save JD match analysis: ${error.message}`);
  }

  return data as JDMatchRecord;
}

export async function updateJDMatchAnalysis(
  matchId: string,
  userId: string,
  updates: {
    resumeData?: any;
    appliedRecommendations?: string[];
    recommendations?: Recommendation[];
  }
): Promise<JDMatchRecord> {
  const updateData: any = {};

  if (updates.resumeData) {
    updateData.resume_data = updates.resumeData;
  }

  if (updates.appliedRecommendations) {
    updateData.applied_recommendations = updates.appliedRecommendations;
  }

  if (updates.recommendations) {
    updateData.recommendations = updates.recommendations;
  }

  const { data, error } = await supabase
    .from('jd_matches')
    .update(updateData)
    .eq('id', matchId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating JD match:', error);
    throw new Error(`Failed to update JD match analysis: ${error.message}`);
  }

  return data as JDMatchRecord;
}

export async function getJDMatchById(matchId: string, userId: string): Promise<JDMatchRecord | null> {
  const { data, error } = await supabase
    .from('jd_matches')
    .select('*')
    .eq('id', matchId)
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    console.error('Error fetching JD match:', error);
    throw new Error(`Failed to fetch JD match: ${error.message}`);
  }

  return data as JDMatchRecord;
}

export async function getAllJDMatches(userId: string, limit: number = 50, offset: number = 0): Promise<JDMatchRecord[]> {
  const { data, error } = await supabase
    .from('jd_matches')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching JD matches:', error);
    throw new Error(`Failed to fetch JD matches: ${error.message}`);
  }

  return (data || []) as JDMatchRecord[];
}

