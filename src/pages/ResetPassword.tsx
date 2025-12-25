import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2, CheckCircle, XCircle, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [sessionValid, setSessionValid] = useState(false);

  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  // Validate password on mount and when it changes
  useEffect(() => {
    validatePassword(password);
  }, [password]);

  // Validate confirm password when it or password changes
  useEffect(() => {
    if (confirmPassword) {
      validateConfirmPassword(confirmPassword);
    }
  }, [confirmPassword, password]);

  // Handle URL hash tokens and set session
  useEffect(() => {
    const handleResetLink = async () => {
      try {
        setIsValidating(true);
        setError(null);

        // Check URL hash for Supabase tokens (format: #access_token=...&type=recovery)
        const hash = window.location.hash.substring(1);
        const hashParams = new URLSearchParams(hash);
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type') || searchParams.get('type');

        console.log('Reset password link detected:', { type, hasAccessToken: !!accessToken });

        // Supabase password reset links come with tokens in the hash
        if (accessToken && type === 'recovery') {
          // Set the session with the tokens to validate the reset link
          const { data: { session }, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });

          if (sessionError) {
            console.error('Session error:', sessionError);
            setError('This reset link is invalid or has expired. Please request a new one.');
            setSessionValid(false);
            setIsValidating(false);
            return;
          }

          if (session) {
            console.log('✅ Reset link validated, session set');
            setSessionValid(true);
            setIsValidating(false);
            return;
          }
        }

        // Fallback: Check if user is already authenticated (might have clicked link while logged in)
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Session check error:', error);
          setError('Unable to validate reset link. Please request a new one.');
          setSessionValid(false);
          setIsValidating(false);
          return;
        }

        if (session) {
          // User has a valid session, allow password reset
          setSessionValid(true);
          setIsValidating(false);
        } else {
          // No tokens and no session - invalid reset link
          setError('This reset link is invalid or has expired. Please request a new one.');
          setSessionValid(false);
          setIsValidating(false);
        }
      } catch (err) {
        console.error('Error handling reset link:', err);
        setError('An unexpected error occurred. Please try again.');
        setSessionValid(false);
        setIsValidating(false);
      }
    };

    handleResetLink();
  }, [searchParams]);

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError(null);
      return false;
    }
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }
    setPasswordError(null);
    return true;
  };

  const validateConfirmPassword = (confirmPassword: string): boolean => {
    if (!confirmPassword) {
      setConfirmPasswordError(null);
      return false;
    }
    if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (!isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    setIsLoading(true);

    try {
      // Update password using Supabase
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        console.error('Password update error:', updateError);
        if (updateError.message.includes('same as the old password')) {
          setError('New password must be different from your current password.');
        } else {
          setError(updateError.message || 'Failed to update password. Please try again.');
        }
        setIsLoading(false);
        return;
      }

      // Success!
      setSuccess(true);
      console.log('✅ Password updated successfully');

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Password reset successfully! Please log in with your new password.' 
          } 
        });
      }, 3000);

    } catch (err) {
      console.error('Password reset exception:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const isFormValid = password && confirmPassword && !passwordError && !confirmPasswordError;

  // Loading state while validating reset link
  if (isValidating) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8 text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-black text-secondary mb-2">
              Validating Reset Link
            </h2>
            <p className="text-gray-600">
              Please wait while we verify your password reset link...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state - invalid/expired link
  if (!sessionValid) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link to="/login" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
            ← Back to Login
          </Link>

          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-8 h-8 text-error" />
            </div>
            <h2 className="text-2xl font-black text-secondary mb-3">
              Invalid Reset Link
            </h2>
            <p className="text-gray-600 mb-6">
              {error || 'This password reset link is invalid or has expired.'}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Password reset links expire after a certain time for security reasons.
            </p>
            <div className="space-y-3">
              <Link
                to="/forgot-password"
                className="block w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Request New Reset Link
              </Link>
              <Link
                to="/login"
                className="block w-full text-primary font-semibold hover:underline"
              >
                Return to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-2xl font-black text-secondary mb-3">
              Password Reset Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Your password has been updated successfully.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Redirecting to login page...
            </p>
            <Link
              to="/login"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Password reset form
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link to="/login" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
          ← Back to Login
        </Link>

        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-secondary">
                Reset Password
              </h1>
              <p className="text-sm text-gray-500">
                Enter your new password
              </p>
            </div>
          </div>

          <p className="text-gray-600 mb-6">
            Please enter a new password for your account. Make sure it's at least 8 characters long.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-error/10 border-2 border-error/20 rounded-lg">
              <p className="text-error text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) validatePassword(e.target.value);
                  }}
                  onBlur={() => validatePassword(password)}
                  placeholder="At least 8 characters"
                  className={`w-full px-4 py-3 pr-12 border-2 rounded-lg focus:outline-none transition-all ${
                    passwordError
                      ? 'border-error focus:border-error focus:ring-4 focus:ring-error/10'
                      : password && !passwordError
                      ? 'border-success'
                      : 'border-gray-300 focus:border-primary focus:ring-4 focus:ring-primary/10'
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="mt-1 text-xs text-error">{passwordError}</p>
              )}
              {password && !passwordError && (
                <p className="mt-1 text-xs text-success">✓ Password meets requirements</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (confirmPasswordError) validateConfirmPassword(e.target.value);
                  }}
                  onBlur={() => validateConfirmPassword(confirmPassword)}
                  placeholder="Re-enter your password"
                  className={`w-full px-4 py-3 pr-12 border-2 rounded-lg focus:outline-none transition-all ${
                    confirmPasswordError
                      ? 'border-error focus:border-error focus:ring-4 focus:ring-error/10'
                      : confirmPassword && !confirmPasswordError
                      ? 'border-success'
                      : 'border-gray-300 focus:border-primary focus:ring-4 focus:ring-primary/10'
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {confirmPasswordError && (
                <p className="mt-1 text-xs text-error">{confirmPasswordError}</p>
              )}
              {confirmPassword && !confirmPasswordError && (
                <p className="mt-1 text-xs text-success">✓ Passwords match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Updating Password...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Remember your password?{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

