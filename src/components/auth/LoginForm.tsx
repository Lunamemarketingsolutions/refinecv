import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import SocialLoginButton from './SocialLoginButton';

export default function LoginForm() {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setIsLoading(true);

    try {
      const { error: signInError } = await signIn(email, password);

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please try again.');
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('Please verify your email address before logging in.');
        } else {
          setError(signInError.message);
        }
        return;
      }

      setSuccess('Login successful! Redirecting to dashboard...');

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const { error: googleError } = await signInWithGoogle();

      if (googleError) {
        setError('Google login failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred with Google login.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = email && password && !emailError && !passwordError;

  return (
    <div className="w-full">
      <Link to="/" className="inline-block mb-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-lg">R</span>
          </div>
          <span className="text-xl font-black text-secondary">RefineCV</span>
        </div>
      </Link>

      <h1 className="text-3xl lg:text-4xl font-black text-secondary mb-3">
        Welcome Back
      </h1>
      <p className="text-gray-600 mb-8">
        Log in to continue transforming your CV
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
              }}
              onBlur={() => validatePassword(password)}
              placeholder="Enter your password"
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

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary accent-primary"
              disabled={isLoading}
            />
            <span className="text-sm text-gray-600">Remember me</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Logging in...
            </>
          ) : (
            'Log In'
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
          onClick={handleGoogleLogin}
          disabled={isLoading}
        />
      </div>

      <p className="mt-8 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link to="/signup" className="font-bold text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
