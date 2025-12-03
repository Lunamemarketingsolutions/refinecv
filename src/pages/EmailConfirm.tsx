import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function EmailConfirm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Check URL hash for Supabase tokens (format: #access_token=...&type=...)
        const hash = window.location.hash.substring(1);
        const hashParams = new URLSearchParams(hash);
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type') || searchParams.get('type');

        // Supabase email confirmation links typically come with tokens in the hash
        if (accessToken && type === 'signup') {
          // Set the session with the tokens
          const { data: { session }, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });

          if (sessionError) {
            throw sessionError;
          }

          if (session) {
            setStatus('success');
            setMessage('Email verified successfully! Redirecting to dashboard...');
            setTimeout(() => navigate('/dashboard'), 2000);
            return;
          }
        }

        // Fallback: Check if user is already authenticated
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (session && session.user.email_confirmed_at) {
          setStatus('success');
          setMessage('Email already verified! Redirecting to dashboard...');
          setTimeout(() => navigate('/dashboard'), 2000);
        } else if (session) {
          // User is logged in but email might not be confirmed yet
          setStatus('success');
          setMessage('Redirecting to dashboard...');
          setTimeout(() => navigate('/dashboard'), 2000);
        } else {
          // No session - redirect to login
          setStatus('error');
          setMessage('Please log in to complete email verification.');
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (error: any) {
        console.error('Email verification error:', error);
        setStatus('error');
        setMessage(error.message || 'Failed to verify email. The link may have expired. Please try logging in.');
        setTimeout(() => navigate('/login'), 5000);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-[#F7F7FE] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 text-[#2782EA] mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-[#0F1C2A] mb-2">Verifying Email</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#0F1C2A] mb-2">Email Verified!</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#0F1C2A] mb-2">Verification Failed</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-[#2782EA] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#1e6bc7] transition-colors"
            >
              Go to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

