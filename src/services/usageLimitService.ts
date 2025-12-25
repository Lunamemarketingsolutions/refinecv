import { supabase } from '../lib/supabase';
import { getToolUsageCount, ToolType } from './usageTrackingService';

export interface UserPlan {
  plan_type: 'free' | 'premium';
  premium_expires_at: string | null;
}

export interface UsageLimitCheck {
  allowed: boolean;
  reason?: string;
  currentUsage?: number;
  limit?: number;
}

/**
 * Get user's plan information
 * 
 * @param userId - The authenticated user's ID
 * @returns User plan information or null if not found
 */
export async function getUserPlan(userId: string): Promise<UserPlan | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('plan_type, premium_expires_at')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user plan:', error);
      return null;
    }

    if (!data) {
      // Default to free plan if profile doesn't exist
      return { plan_type: 'free', premium_expires_at: null };
    }

    return {
      plan_type: data.plan_type || 'free',
      premium_expires_at: data.premium_expires_at,
    };
  } catch (err) {
    console.error('Error getting user plan:', err);
    return { plan_type: 'free', premium_expires_at: null };
  }
}

/**
 * Check if user has an active premium subscription
 * 
 * @param plan - User plan information
 * @returns true if user has active premium subscription
 */
export function hasActiveSubscription(plan: UserPlan | null): boolean {
  if (!plan) return false;
  
  if (plan.plan_type === 'premium') {
    // Check if subscription hasn't expired
    if (plan.premium_expires_at) {
      const expiryDate = new Date(plan.premium_expires_at);
      const now = new Date();
      return expiryDate > now;
    }
    // If premium but no expiry date, assume active (legacy or lifetime)
    return true;
  }
  
  return false;
}

/**
 * Check if user can use a specific feature based on their plan and usage
 * 
 * @param userId - The authenticated user's ID
 * @param toolType - The tool/feature to check
 * @param freePlanLimit - Maximum uses for free plan (default: 3)
 * @returns Usage limit check result
 */
export async function checkUsageLimit(
  userId: string,
  toolType: ToolType,
  freePlanLimit: number = 3
): Promise<UsageLimitCheck> {
  try {
    // Verify we have a valid user ID
    if (!userId) {
      console.error('❌ checkUsageLimit: No userId provided');
      return {
        allowed: true,
        reason: 'Unable to verify usage limit. Please log in again.',
      };
    }

    // Verify current session user matches the provided userId
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      console.error('❌ checkUsageLimit: No active session', sessionError);
      return {
        allowed: true,
        reason: 'Unable to verify usage limit. Please log in again.',
      };
    }

    if (session.user.id !== userId) {
      console.error('❌ checkUsageLimit: User ID mismatch', {
        provided: userId,
        session: session.user.id,
        email: session.user.email,
      });
      // Use the session user ID instead
      userId = session.user.id;
    }

    console.log('🔍 Checking usage limit:', {
      userId,
      toolType,
      freePlanLimit,
      sessionUserId: session.user.id,
      email: session.user.email,
    });

    // Get user plan
    const plan = await getUserPlan(userId);
    console.log('📋 User plan:', plan);
    
    // If user has active subscription, allow unlimited usage
    if (hasActiveSubscription(plan)) {
      console.log('✅ Premium user - unlimited access');
      return {
        allowed: true,
        currentUsage: 0, // Unlimited, so count doesn't matter
        limit: Infinity,
      };
    }

    // For free plan users, check usage count
    const usageCount = await getToolUsageCount(userId, toolType);
    console.log('📊 Usage count:', {
      userId,
      toolType,
      usageCount,
      limit: freePlanLimit,
    });
    
    if (usageCount >= freePlanLimit) {
      console.log('🚫 Usage limit reached:', {
        userId,
        toolType,
        usageCount,
        limit: freePlanLimit,
      });
      return {
        allowed: false,
        reason: `You've reached the limit of ${freePlanLimit} uses for this feature on the free plan. Upgrade to premium for unlimited access.`,
        currentUsage: usageCount,
        limit: freePlanLimit,
      };
    }

    console.log('✅ Usage limit check passed:', {
      userId,
      toolType,
      usageCount,
      limit: freePlanLimit,
    });

    return {
      allowed: true,
      currentUsage: usageCount,
      limit: freePlanLimit,
    };
  } catch (err) {
    console.error('❌ Error checking usage limit:', err);
    // On error, allow usage (fail open) but log the error
    return {
      allowed: true,
      reason: 'Unable to verify usage limit. Please try again.',
    };
  }
}

/**
 * Get a user-friendly tool name for display
 * 
 * @param toolType - The tool type
 * @returns User-friendly name
 */
export function getToolDisplayName(toolType: ToolType): string {
  switch (toolType) {
    case 'ats_analyzer':
      return 'ATS Analyzer';
    case 'jd_matcher':
      return 'JD CV Matcher';
    case 'cv_enhancer':
      return 'CV Enhancer';
    default:
      return 'Feature';
  }
}

