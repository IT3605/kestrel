import { useState } from 'react';
import {
  AlertCircle,
  Check,
  Clock,
  Eye,
  EyeOff,
  HelpCircle,
  RefreshCw,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import type { DemoPrinciple, UnauthViewMode } from '../types';
import { ClosersNavStrip } from './ClosersNavStrip';

interface LoginExperienceProps {
  mode: UnauthViewMode;
  onChangeMode: (mode: UnauthViewMode) => void;
  onChangePrinciple: (principle: DemoPrinciple) => void;
  rememberDevice: boolean;
  onToggleRememberDevice: (value: boolean) => void;
  onGoogleSignIn: () => Promise<void>;
  signingIn: boolean;
  authError: string | null;
}

function GoogleGlyph() {
  return (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99-3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
      />
    </svg>
  );
}

export function LoginExperience({
  mode,
  onChangeMode,
  onChangePrinciple,
  rememberDevice,
  onToggleRememberDevice,
  onGoogleSignIn,
  signingIn,
  authError,
}: LoginExperienceProps) {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [oldPortalNotice, setOldPortalNotice] = useState<string | null>(null);
  const [oldAccountNumber, setOldAccountNumber] = useState('');
  const [oldUsername, setOldUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [oldPin, setOldPin] = useState('');
  const [oldCaptcha, setOldCaptcha] = useState('');
  const [oldRememberId, setOldRememberId] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('K7M4P');

  const regenerateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let next = '';
    for (let i = 0; i < 5; i += 1) {
      next += chars[Math.floor(Math.random() * chars.length)];
    }
    setCaptchaToken(next);
    setOldCaptcha('');
  };

  const handleOldLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOldPortalNotice(
      'With the old page, you had to look up your Account Number, remember a password and PIN, and type a verification code just to get in.'
    );
  };

  return (
    <main id="top" className="max-w-[1320px] mx-auto px-6 py-10 lg:py-12">
      <ClosersNavStrip activePrinciple="convenience" onChangePrinciple={onChangePrinciple} />

      {/* Friendly End-User Intro */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 pb-8 border-b border-slate-200">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold text-sky-700 mb-2">
            01. Convenience · Google Sign-In
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight [text-wrap:balance]">
            A simpler, faster way to sign in
          </h1>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            See the difference side by side: compare our old multi-step sign-in page on the left with the new one-click Google sign-in on the right.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Page view mode"
          className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start lg:self-auto shrink-0"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'side-by-side'}
            onClick={() => onChangeMode('side-by-side')}
            className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              mode === 'side-by-side'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Before &amp; After
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'focused'}
            onClick={() => onChangeMode('focused')}
            className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              mode === 'focused'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            New Page Only
          </button>
        </div>
      </div>

      {mode === 'side-by-side' ? (
        <section
          aria-label="Before and After Sign-In Comparison"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
        >
          {/* BEFORE: Old Customer Sign-In Page */}
          <div className="lg:col-span-6 bg-slate-100/80 border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-2 pb-5 mb-6 border-b border-slate-200">
                <span className="text-sm font-semibold text-slate-900">
                  Before · Old Sign-In Page
                </span>
                <span className="text-xs text-slate-500">
                  5 steps · ~45 seconds to sign in
                </span>
              </div>

              {/* Realistic Old Portal Window */}
              <div className="bg-white border border-slate-300 rounded-xl overflow-hidden">
                <div className="bg-slate-800 text-white px-5 py-3.5 flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold tracking-tight">
                    Kestrel Portal · Customer Login
                  </span>
                  <span className="text-xs text-slate-300">Member Access</span>
                </div>

                <form onSubmit={handleOldLoginSubmit} className="p-5 sm:p-6 space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Please enter your account number, username, password, and 6-digit PIN to view your account.
                  </p>

                  {oldPortalNotice && (
                    <div
                      role="status"
                      className="p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900"
                    >
                      <HelpCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" aria-hidden="true" />
                      <span>{oldPortalNotice}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="old-account-num" className="block text-xs font-medium text-slate-700 mb-1">
                        Account Number *
                      </label>
                      <input
                        id="old-account-num"
                        type="text"
                        value={oldAccountNumber}
                        onChange={(e) => setOldAccountNumber(e.target.value)}
                        placeholder="e.g. 8849-2010"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="old-username" className="block text-xs font-medium text-slate-700 mb-1">
                        Username *
                      </label>
                      <input
                        id="old-username"
                        type="text"
                        value={oldUsername}
                        onChange={(e) => setOldUsername(e.target.value)}
                        placeholder="Your portal username"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="old-password" className="block text-xs font-medium text-slate-700 mb-1">
                        Password *
                      </label>
                      <div className="relative">
                        <input
                          id="old-password"
                          type={showOldPassword ? 'text' : 'password'}
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          placeholder="Min. 12 characters"
                          className="w-full pl-3 pr-9 py-2 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowOldPassword((prev) => !prev)}
                          aria-label={showOldPassword ? 'Hide password' : 'Show password'}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 cursor-pointer"
                        >
                          {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="old-pin" className="block text-xs font-medium text-slate-700 mb-1">
                        6-Digit Security PIN *
                      </label>
                      <input
                        id="old-pin"
                        type="password"
                        maxLength={6}
                        value={oldPin}
                        onChange={(e) => setOldPin(e.target.value)}
                        placeholder="••••••"
                        className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-md bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="old-captcha" className="block text-xs font-medium text-slate-700 mb-1">
                      Type the letters shown below *
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-2 bg-slate-200 text-slate-800 font-mono text-sm tracking-[0.22em] select-none rounded-md line-through decoration-slate-500/60 shrink-0">
                        {captchaToken}
                      </div>
                      <button
                        type="button"
                        onClick={regenerateCaptcha}
                        aria-label="Get a new code"
                        className="p-2 min-h-[38px] min-w-[38px] border border-slate-300 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-50 cursor-pointer flex items-center justify-center shrink-0"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <input
                        id="old-captcha"
                        type="text"
                        value={oldCaptcha}
                        onChange={(e) => setOldCaptcha(e.target.value)}
                        placeholder="Enter letters"
                        className="flex-1 min-w-0 px-3 py-2 text-sm font-mono uppercase border border-slate-300 rounded-md bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                    <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={oldRememberId}
                        onChange={(e) => setOldRememberId(e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-slate-300"
                      />
                      <span>Remember my Account Number</span>
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setOldPortalNotice(
                          'Forgot your password or PIN? You would have to answer security questions or wait for an SMS reset code.'
                        )
                      }
                      className="text-slate-600 underline underline-offset-2 hover:text-slate-900 cursor-pointer"
                    >
                      Forgot Password or PIN?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full min-h-[42px] px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium rounded-md transition-colors cursor-pointer"
                  >
                    Sign In
                  </button>
                </form>
              </div>
            </div>

            {/* Plain-language takeaway */}
            <div className="mt-6 pt-5 border-t border-slate-200 space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center justify-between gap-4">
                <span>Things to type</span>
                <span className="font-medium text-slate-800">5 separate boxes</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>If you forget details</span>
                <span className="font-medium text-slate-800">Reset password, PIN, or look up bill</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>On a phone screen</span>
                <span className="font-medium text-slate-800">Slow typing &amp; hard-to-read codes</span>
              </div>
            </div>
          </div>

          {/* AFTER: New Friendly Google Sign-In Page */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-2 pb-5 mb-6 border-b border-slate-200">
                <span className="text-sm font-semibold text-emerald-800">
                  After · New 1-Click Sign-In
                </span>
                <span className="text-xs text-emerald-700 font-medium">
                  1 click · ~3 seconds to sign in
                </span>
              </div>

              <div className="py-4 sm:py-8 max-w-md mx-auto">
                <p className="text-xs font-medium text-slate-500 mb-2">
                  Kestrel Portal
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 [text-wrap:balance] mb-3">
                  Welcome back
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-8">
                  Keep your photos, devices, and account safe without the password headache—sign in with the Google account you already trust.
                </p>

                {authError && (
                  <div
                    role="alert"
                    className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3 text-sm text-red-800"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" aria-hidden="true" />
                    <span>{authError}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={onGoogleSignIn}
                  disabled={signingIn}
                  className="w-full min-h-[52px] px-5 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-3 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 whitespace-nowrap"
                >
                  <GoogleGlyph />
                  <span>{signingIn ? 'Signing you in...' : 'Continue with Google'}</span>
                </button>

                <label className="mt-5 flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => onToggleRememberDevice(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-700 cursor-pointer"
                  />
                  <span className="text-sm text-slate-600">
                    Keep me signed in on this device
                  </span>
                </label>

                <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Protected by your Google account security—you never have to create or update another password here.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Try it live: click <strong className="font-medium text-slate-900">Continue with Google</strong> to see how fast signing in feels.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Plain-language takeaway mirroring left panel */}
            <div className="mt-6 pt-5 border-t border-slate-200 space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center justify-between gap-4">
                <span>Things to type</span>
                <span className="font-medium text-emerald-700">Nothing—just 1 click</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>If you forget details</span>
                <span className="font-medium text-emerald-700">Nothing extra to remember</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>On a phone screen</span>
                <span className="font-medium text-emerald-700">One tap and you&apos;re in</span>
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* Focused Preview of the New Customer Sign-In Page */
        <section className="grid grid-cols-1 lg:grid-cols-12 rounded-2xl overflow-hidden border border-slate-200 bg-white">
          <div className="lg:col-span-6 relative bg-slate-900 text-white p-8 sm:p-12 flex flex-col justify-between min-h-[400px] lg:min-h-[580px]">
            <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
              <svg
                className="w-full h-full opacity-20"
                viewBox="0 0 800 900"
                fill="none"
                preserveAspectRatio="xMidYMid slice"
              >
                <defs>
                  <pattern id="portalGridFocused" width="80" height="80" patternUnits="userSpaceOnUse">
                    <path d="M 80 0 L 0 0 0 80" stroke="#94A3B8" strokeWidth="0.75" />
                  </pattern>
                  <linearGradient id="atriumBeamFocused" x1="0" y1="0" x2="800" y2="900" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.22" />
                    <stop offset="55%" stopColor="#0F172A" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <rect width="800" height="900" fill="url(#portalGridFocused)" />
                <rect width="800" height="900" fill="url(#atriumBeamFocused)" />
                <circle cx="620" cy="180" r="240" stroke="#CBD5E1" strokeWidth="0.75" strokeOpacity="0.35" />
                <circle cx="620" cy="180" r="140" stroke="#34D399" strokeWidth="0.75" strokeOpacity="0.4" />
              </svg>
            </div>

            <div className="relative z-10 max-w-lg">
              <p className="text-xs font-medium tracking-wide text-emerald-400 mb-4">
                Kestrel Portal
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight [text-wrap:balance] mb-5">
                Your account, one click away.
              </h2>
              <p className="text-base text-slate-300 leading-relaxed">
                Check your plan, update preferences, and manage your account without hunting for account numbers or resetting forgotten passwords.
              </p>
            </div>

            <div className="relative z-10 mt-10 pt-8 border-t border-slate-800 space-y-3 text-sm">
              <div className="flex items-baseline justify-between gap-4 pb-3 border-b border-slate-800/80">
                <span className="text-slate-400">Sign-in time</span>
                <span className="font-medium text-emerald-400">About 3 seconds</span>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-slate-400">Extra passwords needed</span>
                <span className="font-medium text-slate-200">None</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center bg-white">
            <div className="max-w-md w-full mx-auto">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 [text-wrap:balance] mb-2">
                Welcome back
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-8">
                Sign in instantly using your Google account.
              </p>

              {authError && (
                <div
                  role="alert"
                  className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3 text-sm text-red-800"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" aria-hidden="true" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="button"
                onClick={onGoogleSignIn}
                disabled={signingIn}
                className="w-full min-h-[52px] px-5 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-3 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 whitespace-nowrap"
              >
                <GoogleGlyph />
                <span>{signingIn ? 'Signing you in...' : 'Continue with Google'}</span>
              </button>

              <label className="mt-5 flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => onToggleRememberDevice(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-700 cursor-pointer"
                />
                <span className="text-sm text-slate-600">
                  Keep me signed in on this device
                </span>
              </label>

              <p className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-500">
                Want to show the side-by-side comparison?{' '}
                <button
                  type="button"
                  onClick={() => onChangeMode('side-by-side')}
                  className="font-medium text-slate-900 underline underline-offset-4 hover:text-emerald-700 cursor-pointer"
                >
                  View Before &amp; After
                </button>
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Simple End-User What Changed Table */}
      <section id="what-changed" className="mt-12 bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              What Changed for Customers
            </h2>
            <p className="text-sm text-slate-600">
              A quick look at how the new sign-in removes everyday hassles.
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-medium text-slate-500">
                <th className="py-3 px-6">Step</th>
                <th className="py-3 px-6">Before (Old Page)</th>
                <th className="py-3 px-6">After (New Page)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              <tr>
                <td className="py-3.5 px-6 font-medium text-slate-900">Finding your account</td>
                <td className="py-3.5 px-6 text-slate-600">
                  Had to look up an Account Number and username first
                </td>
                <td className="py-3.5 px-6 text-emerald-700 font-medium">
                  Automatically matches your Google email
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-slate-900">Passwords &amp; PINs</td>
                <td className="py-3.5 px-6 text-slate-600">
                  Had to remember both a long password and a 6-digit PIN
                </td>
                <td className="py-3.5 px-6 text-slate-800">
                  No new passwords or PINs to remember
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-slate-900">Verification codes</td>
                <td className="py-3.5 px-6 text-slate-600">
                  Had to squint at and retype distorted letters
                </td>
                <td className="py-3.5 px-6 text-slate-800">
                  Removed completely—handled silently by Google
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-slate-900">Getting locked out</td>
                <td className="py-3.5 px-6 text-slate-600">
                  Too many wrong tries locked the account until you reset it
                </td>
                <td className="py-3.5 px-6 text-slate-800">
                  Instant access as long as you&apos;re signed into Google
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Everyday Benefits */}
      <section id="benefits" className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <Clock className="w-5 h-5 text-emerald-700 mb-3" aria-hidden="true" />
          <h3 className="text-base font-semibold text-slate-900 mb-2">
            Sign in in seconds
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Skip filling out five separate boxes every time you want to check your account or pay a bill.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <Smartphone className="w-5 h-5 text-emerald-700 mb-3" aria-hidden="true" />
          <h3 className="text-base font-semibold text-slate-900 mb-2">
            Effortless on mobile
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            One tap on your phone screen—no tiny password fields, typos, or hard-to-read verification letters.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <ShieldCheck className="w-5 h-5 text-emerald-700 mb-3" aria-hidden="true" />
          <h3 className="text-base font-semibold text-slate-900 mb-2">
            Safe by default
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Your account stays protected by Google&apos;s own sign-in security, so you don&apos;t need to reuse passwords.
          </p>
        </div>
      </section>
    </main>
  );
}
