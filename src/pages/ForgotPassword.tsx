import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [emailError, setEmailError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      return;
    }

    setIsLoading(true);

    try {
      const { error: resetError } = await resetPassword(email);

      if (resetError) {
        setError('Failed to send reset email. Please try again.');
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link to="/login" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>

        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8">
          {!success ? (
            <>
              <h1 className="text-3xl font-black text-secondary mb-3">
                Forgot Password?
              </h1>
              <p className="text-gray-600 mb-8">
                Enter your email address and we'll send you instructions to reset your password.
              </p>

              {error && (
                <div className="mb-6 p-4 bg-error/10 border-2 border-error/20 rounded-lg">
                  <p className="text-error text-sm font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-secondary mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) validateEmail(e.target.value);
                    }}
                    onBlur={() => validateEmail(email)}
                    placeholder="your.email@example.com"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                      emailError
                        ? 'border-error focus:border-error focus:ring-4 focus:ring-error/10'
                        : 'border-gray-300 focus:border-primary focus:ring-4 focus:ring-primary/10'
                    }`}
                    disabled={isLoading}
                  />
                  {emailError && (
                    <p className="mt-1 text-xs text-error">{emailError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!email || !!emailError || isLoading}
                  className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Reset Instructions'
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <h2 className="text-2xl font-black text-secondary mb-3">
                Check Your Email
              </h2>
              <p className="text-gray-600 mb-8">
                We've sent password reset instructions to <span className="font-semibold">{email}</span>
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <Link
                to="/login"
                className="inline-block text-primary font-semibold hover:underline"
              >
                Return to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
