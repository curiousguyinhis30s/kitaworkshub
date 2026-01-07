'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// --- Helper Components ---

const PasswordStrengthMeter: React.FC<{ password: string }> = ({ password }) => {
  const { strength, color, label } = useMemo(() => {
    if (!password) return { strength: 0, color: 'bg-slate-700', label: '' };

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { strength: 25, color: 'bg-red-500', label: 'Weak' };
    if (score <= 2) return { strength: 50, color: 'bg-yellow-500', label: 'Medium' };
    if (score === 3) return { strength: 75, color: 'bg-lime-500', label: 'Strong' };
    return { strength: 100, color: 'bg-emerald-500', label: 'Very Strong' };
  }, [password]);

  if (!password) return null;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-400">Strength</span>
        <span className={`font-medium ${color.replace('bg-', 'text-')}`}>{label}</span>
      </div>
      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-500 ease-out`}
          style={{ width: `${strength}%` }}
        />
      </div>
    </div>
  );
};

const RequirementItem: React.FC<{ meets: boolean; text: string }> = ({ meets, text }) => (
  <li className={`flex items-center gap-2 text-xs transition-colors ${meets ? 'text-emerald-500' : 'text-slate-500'}`}>
    <span className="flex items-center justify-center w-4 h-4 border rounded-full flex-shrink-0">
      {meets ? (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <div className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
      )}
    </span>
    {text}
  </li>
);

// --- Inner Component (uses useSearchParams) ---

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract URL params on mount
  useEffect(() => {
    const urlToken = searchParams.get('token');
    const urlEmail = searchParams.get('email');

    if (urlToken) setToken(urlToken);
    if (urlEmail) setEmail(urlEmail);
  }, [searchParams]);

  // --- Validation Logic ---
  const requirements = [
    { test: (p: string) => p.length >= 8, text: 'At least 8 characters' },
    { test: (p: string) => /[A-Z]/.test(p), text: '1 uppercase letter' },
    { test: (p: string) => /[0-9]/.test(p), text: '1 number' },
  ];

  const allRequirementsMet = requirements.every(r => r.test(formData.password));
  const passwordsMatch = formData.password === formData.confirmPassword && formData.password !== '';
  const isFormValid = token && email && allRequirementsMet && passwordsMatch;

  // --- Handlers ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !email) {
      setError('Missing email or token. Please check your reset link.');
      return;
    }

    if (!isFormValid) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          token,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      setIsSuccess(true);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/portal/login');
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Render ---

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-xl text-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 text-center border-b border-slate-800">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-emerald-900/50 rounded-lg flex items-center justify-center border border-emerald-800">
                <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Reset Password</h1>
          <p className="text-slate-400 text-sm mt-1">
            Enter your new secure password below.
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Read-only display of email for confirmation */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-500 uppercase">Email Address</label>
              <div className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-400 text-sm select-none">
                {email || 'Loading...'}
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-md bg-red-900/30 border border-red-800 text-red-400 text-sm">
                {error}
              </div>
            )}

            {isSuccess && (
              <div className="p-3 rounded-md bg-emerald-900/30 border border-emerald-800 text-emerald-400 text-sm">
                Password reset successful! Redirecting to login...
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-300">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading || isSuccess}
                className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 disabled:opacity-50"
                required
              />

              <PasswordStrengthMeter password={formData.password} />

              <ul className="space-y-2 mt-3">
                {requirements.map((req, i) => (
                  <RequirementItem
                    key={i}
                    meets={req.test(formData.password)}
                    text={req.text}
                  />
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-300">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={isLoading || isSuccess}
                className={`w-full px-3 py-2 rounded-md bg-slate-950 border text-white placeholder-slate-500 focus:outline-none focus:ring-1 disabled:opacity-50 ${
                    formData.confirmPassword && !passwordsMatch
                      ? 'border-red-900 focus:border-red-900 focus:ring-red-900'
                      : 'border-slate-800 focus:border-emerald-700 focus:ring-emerald-700'
                }`}
                required
              />
              {formData.confirmPassword && !passwordsMatch && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white font-medium shadow-lg shadow-emerald-900/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={!isFormValid || isLoading || isSuccess}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : isSuccess ? 'Password Reset ✓' : 'Set New Password'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 text-center">
          <button
            onClick={() => router.push('/portal/login')}
            className="text-sm text-slate-400 hover:text-emerald-500 transition-colors"
          >
            ← Back to login
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Main Export (with Suspense) ---

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
