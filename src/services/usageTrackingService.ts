import { supabase } from '../lib/supabase';

export type ToolType = 'ats_analyzer' | 'jd_matcher' | 'cv_enhancer';

export interface UsageRecord {
  id: string;
  user_id: string;
  tool_type: ToolType;
  cv_upload_id: string | null;
  analysis_id: string | null;
  created_at: string;
  date_only: string;
}

export interface UserUsageCounts {
  ats_analyzer: number;
  jd_matcher: number;
  cv_enhancer: number;
}

export interface UsageHistoryItem {
  id: string;
  tool_type: ToolType;
  cv_upload_id: string | null;
  file_name: string | null;
  created_at: string;
}

/**
 * Track feature usage when a user uploads a CV
 * This should be called after successfully creating cv_uploads and analysis records
 * 
 * @param userId - The authenticated user's ID
 * @param toolType - Which tool was used ('ats_analyzer', 'jd_matcher', 'cv_enhancer')
 * @param cvUploadId - The cv_uploads.id that was created
 * @param analysisId - Optional: The analysis/enhancement/match record ID (for backward compatibility)
 * @returns Promise that resolves when tracking is complete (or fails silently)
 */
export async function trackFeatureUsage(
  userId: string,
  toolType: ToolType,
  cvUploadId: string,
  analysisId?: string
): Promise<void> {
  try {
    // Verify user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      console.error(`❌ No active session for usage tracking:`, sessionError);
      return;
    }

    // Verify user_id matches session
    if (session.user.id !== userId) {
      console.error(`❌ User ID mismatch: session=${session.user.id}, provided=${userId}`);
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    console.log(`📊 Attempting to track usage:`, {
      userId,
      toolType,
      cvUploadId,
      analysisId: analysisId || null,
      date_only: today,
      session_user_id: session.user.id,
    });

    const { data, error } = await supabase
      .from('usage_tracking')
      .insert({
        user_id: userId,
        tool_type: toolType,
        cv_upload_id: cvUploadId,
        analysis_id: analysisId || null,
        date_only: today,
      })
      .select();

    if (error) {
      // Log detailed error - usage tracking should not block the main flow
      console.error(`❌ Failed to track usage for ${toolType}:`, {
        error: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        userId,
        toolType,
        cvUploadId,
      });
    } else {
      console.log(`✅ Usage tracked successfully: ${toolType} for user ${userId}`, {
        record_id: data?.[0]?.id,
        inserted: !!data,
      });
    }
  } catch (err) {
    // Log detailed error
    console.error(`❌ Exception tracking usage for ${toolType}:`, {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      userId,
      toolType,
      cvUploadId,
    });
  }
}

/**
 * Get total usage counts per tool for a user
 * 
 * @param userId - The authenticated user's ID
 * @returns Object with counts for each tool type
 */
export async function getUserUsageCounts(userId: string): Promise<UserUsageCounts> {
  try {
    const { data, error } = await supabase
      .from('usage_tracking')
      .select('tool_type')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching usage counts:', error);
      return { ats_analyzer: 0, jd_matcher: 0, cv_enhancer: 0 };
    }

    const counts: UserUsageCounts = {
      ats_analyzer: 0,
      jd_matcher: 0,
      cv_enhancer: 0,
    };

    data?.forEach((record) => {
      if (record.tool_type in counts) {
        counts[record.tool_type as ToolType]++;
      }
    });

    return counts;
  } catch (err) {
    console.error('Error getting usage counts:', err);
    return { ats_analyzer: 0, jd_matcher: 0, cv_enhancer: 0 };
  }
}

/**
 * Get today's usage counts per tool for a user
 * 
 * @param userId - The authenticated user's ID
 * @returns Object with today's counts for each tool type
 */
export async function getUserUsageToday(userId: string): Promise<UserUsageCounts> {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('usage_tracking')
      .select('tool_type')
      .eq('user_id', userId)
      .eq('date_only', today);

    if (error) {
      console.error('Error fetching today usage:', error);
      return { ats_analyzer: 0, jd_matcher: 0, cv_enhancer: 0 };
    }

    const counts: UserUsageCounts = {
      ats_analyzer: 0,
      jd_matcher: 0,
      cv_enhancer: 0,
    };

    data?.forEach((record) => {
      if (record.tool_type in counts) {
        counts[record.tool_type as ToolType]++;
      }
    });

    return counts;
  } catch (err) {
    console.error('Error getting today usage:', err);
    return { ats_analyzer: 0, jd_matcher: 0, cv_enhancer: 0 };
  }
}

/**
 * Get usage history for a user with file names
 * 
 * @param userId - The authenticated user's ID
 * @param limit - Maximum number of records to return
 * @param offset - Offset for pagination
 * @returns Array of usage history items with file names
 */
export async function getUserUsageHistory(
  userId: string,
  limit: number = 50,
  offset: number = 0
): Promise<UsageHistoryItem[]> {
  try {
    const { data, error } = await supabase
      .from('usage_tracking')
      .select(`
        id,
        tool_type,
        cv_upload_id,
        created_at,
        cv_uploads!inner(file_name)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching usage history:', error);
      return [];
    }

    return (data || []).map((record: any) => ({
      id: record.id,
      tool_type: record.tool_type as ToolType,
      cv_upload_id: record.cv_upload_id,
      file_name: record.cv_uploads?.file_name || null,
      created_at: record.created_at,
    }));
  } catch (err) {
    console.error('Error getting usage history:', err);
    return [];
  }
}

/**
 * Get usage count for a specific tool
 * 
 * @param userId - The authenticated user's ID
 * @param toolType - The tool type to count
 * @returns Total count of usage for the specified tool
 */
export async function getToolUsageCount(
  userId: string,
  toolType: ToolType
): Promise<number> {
  try {
    // Verify we have a valid user ID
    if (!userId) {
      console.error('❌ getToolUsageCount: No userId provided');
      return 0;
    }

    // Verify current session user matches the provided userId
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      console.error('❌ getToolUsageCount: No active session', sessionError);
      return 0;
    }

    // Use session user ID to ensure we're querying for the correct user
    const actualUserId = session.user.id;
    if (actualUserId !== userId) {
      console.warn('⚠️ getToolUsageCount: User ID mismatch, using session user ID', {
        provided: userId,
        session: actualUserId,
      });
    }

    console.log('🔍 Querying usage count:', {
      providedUserId: userId,
      actualUserId,
      toolType,
      sessionEmail: session.user.email,
    });

    const { count, error, data } = await supabase
      .from('usage_tracking')
      .select('id, user_id, tool_type, created_at', { count: 'exact', head: false })
      .eq('user_id', actualUserId)
      .eq('tool_type', toolType);

    if (error) {
      console.error(`❌ Error fetching ${toolType} count:`, error);
      return 0;
    }

    // Double-check: verify all returned records belong to the correct user
    if (data && data.length > 0) {
      const wrongUserRecords = data.filter(record => record.user_id !== actualUserId);
      if (wrongUserRecords.length > 0) {
        console.error('❌ CRITICAL: Found records with wrong user_id!', {
          actualUserId,
          wrongRecords: wrongUserRecords,
        });
      }
    }

    const finalCount = count || 0;
    console.log('📊 Usage count result:', {
      userId: actualUserId,
      toolType,
      count: finalCount,
      recordsFound: data?.length || 0,
    });

    return finalCount;
  } catch (err) {
    console.error(`❌ Error getting ${toolType} count:`, err);
    return 0;
  }
}

