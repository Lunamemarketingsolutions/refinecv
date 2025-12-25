import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface DashboardData {
  user: {
    name: string;
    plan: 'free' | 'premium';
    email?: string;
  };
  stats: {
    totalAnalyses: number;
    atsPassRate: number;
    cvsUploaded: number;
    timeSaved: number;
  };
  usageToday: {
    atsAnalyzer: { used: number; limit: number };
    jdMatch: { used: number; limit: number };
    cvEnhancer: { used: number; limit: number };
  };
  featureUsage: {
    atsAnalyzerCount: number;
    jdMatchCount: number;
    cvEnhancerCount: number;
  };
  recentActivity: Array<{
    id: string;
    cvName: string;
    toolUsed: 'ats_analyzer' | 'jd_matcher' | 'cv_enhancer';
    date: string;
    score: number | string;
    scoreType: 'ats' | 'match' | 'rating';
  }>;
}

export function useDashboardData() {
  const { user: authUser } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authUser) {
      setLoading(false);
      return;
    }

    async function fetchDashboardData() {
      try {
        setLoading(true);
        setError(null);

        // Try to get user profile, but don't fail if table doesn't exist
        let profile = null;
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', authUser.id)
          .maybeSingle();

        // If table doesn't exist, that's okay - we'll use defaults
        if (profileError && !profileError.message.includes('does not exist')) {
          console.warn('Profile fetch error (non-critical):', profileError);
        } else {
          profile = profileData;
        }

        // If profile doesn't exist, create it (fallback if trigger didn't fire)
        if (!profile && !profileError) {
          try {
            const { data: newProfile, error: createError } = await supabase
              .from('user_profiles')
              .insert({
                id: authUser.id,
                full_name: authUser.email?.split('@')[0] || 'User',
                plan_type: 'free',
              })
              .select()
              .single();

            if (!createError && newProfile) {
              profile = newProfile;
            } else if (createError) {
              console.warn('Profile creation error (non-critical):', createError);
            }
          } catch (createErr) {
            console.warn('Profile creation exception (non-critical):', createErr);
          }
        }

        const userName = profile?.full_name || authUser.email?.split('@')[0] || 'User';
        const userPlan = profile?.plan_type || 'free';

        // Try to fetch data, but use empty arrays if tables don't exist
        const { data: analyses, error: analysesError } = await supabase
          .from('cv_analyses')
          .select('*')
          .eq('user_id', authUser.id)
          .order('created_at', { ascending: false });

        if (analysesError && !analysesError.message.includes('does not exist')) {
          console.warn('Analyses fetch error (non-critical):', analysesError);
        }

        const { data: uploads, error: uploadsError } = await supabase
          .from('cv_uploads')
          .select('*')
          .eq('user_id', authUser.id);

        if (uploadsError && !uploadsError.message.includes('does not exist')) {
          console.warn('Uploads fetch error (non-critical):', uploadsError);
        }

        const today = new Date().toISOString().split('T')[0];
        const { data: todayUsage, error: usageError } = await supabase
          .from('usage_tracking')
          .select('*')
          .eq('user_id', authUser.id)
          .eq('date_only', today);

        if (usageError && !usageError.message.includes('does not exist')) {
          console.warn('Usage tracking fetch error (non-critical):', usageError);
        }

        const totalAnalyses = analyses?.length || 0;
        const atsAnalyses = analyses?.filter(a => a.tool_type === 'ats_analyzer' && a.ats_score) || [];
        const avgAtsScore = atsAnalyses.length > 0
          ? Math.round(atsAnalyses.reduce((sum, a) => sum + (a.ats_score || 0), 0) / atsAnalyses.length)
          : 0;

        const cvsUploaded = uploads?.length || 0;
        const timeSaved = Math.floor(totalAnalyses * 2.5);

        const atsUsageToday = todayUsage?.filter(u => u.tool_type === 'ats_analyzer').length || 0;
        const jdUsageToday = todayUsage?.filter(u => u.tool_type === 'jd_matcher').length || 0;
        const cvEnhancerUsageToday = todayUsage?.filter(u => u.tool_type === 'cv_enhancer').length || 0;

        // Get feature usage counts from usage_tracking table (more accurate)
        const { data: allUsage, error: allUsageError } = await supabase
          .from('usage_tracking')
          .select('tool_type')
          .eq('user_id', authUser.id);

        if (allUsageError && !allUsageError.message.includes('does not exist')) {
          console.warn('All usage tracking fetch error (non-critical):', allUsageError);
        }

        const atsAnalyzerCount = allUsage?.filter(u => u.tool_type === 'ats_analyzer').length || 0;
        const jdMatchCount = allUsage?.filter(u => u.tool_type === 'jd_matcher').length || 0;
        const cvEnhancerCount = allUsage?.filter(u => u.tool_type === 'cv_enhancer').length || 0;

        // Get recent activity from usage_tracking joined with cv_uploads
        const { data: recentUsage, error: recentUsageError } = await supabase
          .from('usage_tracking')
          .select(`
            id,
            tool_type,
            created_at,
            cv_uploads!inner(file_name)
          `)
          .eq('user_id', authUser.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (recentUsageError && !recentUsageError.message.includes('does not exist')) {
          console.warn('Recent usage tracking fetch error (non-critical):', recentUsageError);
        }

        const recentActivity = (recentUsage || []).map((usage: any) => {
          let scoreType: 'ats' | 'match' | 'rating' = 'ats';
          let score: number | string = 0;

          if (usage.tool_type === 'ats_analyzer') {
            scoreType = 'ats';
            score = 0; // We don't have score in usage_tracking, could join with ats_analyses if needed
          } else if (usage.tool_type === 'jd_matcher') {
            scoreType = 'match';
            score = 0; // We don't have score in usage_tracking, could join with jd_matches if needed
          } else {
            scoreType = 'rating';
            score = '4.5';
          }

          return {
            id: usage.id,
            cvName: usage.cv_uploads?.file_name || 'Unnamed CV',
            toolUsed: usage.tool_type || 'ats_analyzer',
            date: usage.created_at,
            score,
            scoreType,
          };
        });

        const dashboardData: DashboardData = {
          user: {
            name: userName,
            plan: userPlan as 'free' | 'premium',
            email: authUser.email,
          },
          stats: {
            totalAnalyses,
            atsPassRate: avgAtsScore,
            cvsUploaded,
            timeSaved,
          },
          usageToday: {
            atsAnalyzer: { used: atsUsageToday, limit: 3 },
            jdMatch: { used: jdUsageToday, limit: 3 },
            cvEnhancer: { used: cvEnhancerUsageToday, limit: 3 },
          },
          featureUsage: {
            atsAnalyzerCount,
            jdMatchCount,
            cvEnhancerCount,
          },
          recentActivity,
        };

        setData(dashboardData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');

        setData({
          user: {
            name: authUser.email?.split('@')[0] || 'User',
            plan: 'free',
            email: authUser.email,
          },
          stats: {
            totalAnalyses: 0,
            atsPassRate: 0,
            cvsUploaded: 0,
            timeSaved: 0,
          },
          usageToday: {
            atsAnalyzer: { used: 0, limit: 3 },
            jdMatch: { used: 0, limit: 3 },
            cvEnhancer: { used: 0, limit: 3 },
          },
          featureUsage: {
            atsAnalyzerCount: 0,
            jdMatchCount: 0,
            cvEnhancerCount: 0,
          },
          recentActivity: [],
        });
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [authUser]);

  return { data, loading, error };
}
