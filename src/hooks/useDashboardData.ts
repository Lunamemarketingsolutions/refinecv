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

        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', authUser.id)
          .maybeSingle();

        if (profileError) throw profileError;

        const userName = profile?.full_name || authUser.email?.split('@')[0] || 'User';
        const userPlan = profile?.plan_type || 'free';

        const { data: analyses, error: analysesError } = await supabase
          .from('cv_analyses')
          .select('*')
          .eq('user_id', authUser.id)
          .order('created_at', { ascending: false });

        if (analysesError) throw analysesError;

        const { data: uploads, error: uploadsError } = await supabase
          .from('cv_uploads')
          .select('*')
          .eq('user_id', authUser.id);

        if (uploadsError) throw uploadsError;

        const today = new Date().toISOString().split('T')[0];
        const { data: todayUsage, error: usageError } = await supabase
          .from('usage_tracking')
          .select('*')
          .eq('user_id', authUser.id)
          .eq('date_only', today);

        if (usageError) throw usageError;

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

        const atsAnalyzerCount = analyses?.filter(a => a.tool_type === 'ats_analyzer').length || 0;
        const jdMatchCount = analyses?.filter(a => a.tool_type === 'jd_matcher').length || 0;
        const cvEnhancerCount = analyses?.filter(a => a.tool_type === 'cv_enhancer').length || 0;

        const recentActivity = analyses?.slice(0, 5).map(analysis => {
          const upload = uploads?.find(u => u.id === analysis.cv_upload_id);
          let scoreType: 'ats' | 'match' | 'rating' = 'ats';
          let score: number | string = 0;

          if (analysis.tool_type === 'ats_analyzer') {
            scoreType = 'ats';
            score = analysis.ats_score || 0;
          } else if (analysis.tool_type === 'jd_matcher') {
            scoreType = 'match';
            score = analysis.match_score || 0;
          } else {
            scoreType = 'rating';
            score = '4.5';
          }

          return {
            id: analysis.id,
            cvName: upload?.file_name || 'Unnamed CV',
            toolUsed: analysis.tool_type || 'ats_analyzer',
            date: analysis.created_at,
            score,
            scoreType,
          };
        }) || [];

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
