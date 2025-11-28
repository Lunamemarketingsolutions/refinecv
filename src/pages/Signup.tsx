import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SocialLoginButton from '../components/auth/SocialLoginButton';
import LoginValueProp from '../components/auth/LoginValueProp';

export default function Signup() {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

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

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError('Password is required');
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
      setConfirmPasswordError('Please confirm your password');
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
    setSuccess(null);

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    setIsLoading(true);

    try {
      const { error: signUpError } = await signUp(email, password);

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError('This email is already registered. Please log in.');
        } else {
          setError(signUpError.message);
        }
        return;
      }

      setSuccess('Account created successfully! Please check your email to verify your account.');

      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const { error: googleError } = await signInWithGoogle();

      if (googleError) {
        setError('Google sign up failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred with Google sign up.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = email && password && confirmPassword && !emailError && !passwordError && !confirmPasswordError;

  return (
    <div className="min-h-screen flex">
      <div className="w-full lg:w-2/5 bg-background flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-block mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-lg">R</span>
              </div>
              <span className="text-xl font-black text-secondary">RefineCV</span>
            </div>
          </Link>

          <h1 className="text-3xl lg:text-4xl font-black text-secondary mb-3">
            Create Your Account
          </h1>
          <p className="text-gray-600 mb-8">
            Start transforming your CV today
          </p>

          {error && (
            <div className="mb-6 p-4 bg-error/10 border-2 border-error/20 rounded-lg">
              <p className="text-error text-sm font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-success/10 border-2 border-success/20 rounded-lg">
              <p className="text-success text-sm font-medium">{success}</p>
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
                    : email && !emailError
                    ? 'border-success'
                    : 'border-gray-300 focus:border-primary focus:ring-4 focus:ring-primary/10'
                }`}
                disabled={isLoading}
              />
              {emailError && (
                <p className="mt-1 text-xs text-error">{emailError}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) validatePassword(e.target.value);
                    if (confirmPassword) validateConfirmPassword(confirmPassword);
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
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary mb-2">
                Confirm Password
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
            </div>

            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-sm text-gray-500">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          <div className="space-y-3">
            <SocialLoginButton
              provider="google"
              onClick={handleGoogleSignup}
              disabled={isLoading}
            />
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-primary hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>

      <LoginValueProp />
    </div>
  );
}
