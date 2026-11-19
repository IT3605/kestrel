import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  Camera,
  Check,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import type { DemoPrinciple, UnauthViewMode } from '../types';
import { ClosersNavStrip } from './ClosersNavStrip';

interface EmotionDemoProps {
  mode: UnauthViewMode;
  onChangeMode: (mode: UnauthViewMode) => void;
  onChangePrinciple: (principle: DemoPrinciple) => void;
  userName?: string | null;
}

const SUBTLE_TICKS = [
  { id: 1, x: -26, y: -22 },
  { id: 2, x: 26, y: -22 },
  { id: 3, x: -28, y: 18 },
  { id: 4, x: 28, y: 18 },
];

export function EmotionDemo({
  mode,
  onChangeMode,
  onChangePrinciple,
  userName,
}: EmotionDemoProps) {
  const osPrefersReduced = useReducedMotion();
  const [reducedMotionPreview, setReducedMotionPreview] = useState(Boolean(osPrefersReduced));
  const [beforeSubmitted, setBeforeSubmitted] = useState(false);
  const [beforeEmail, setBeforeEmail] = useState('');
  const [beforePassword, setBeforePassword] = useState('');
  const [afterCompleted, setAfterCompleted] = useState(false);
  const [browsingOnly, setBrowsingOnly] = useState(false);

  useEffect(() => {
    if (osPrefersReduced) {
      setReducedMotionPreview(true);
    }
  }, [osPrefersReduced]);

  const ownerDisplay = userName?.trim() ? userName.trim() : 'your devices';

  const handleBeforeSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setBeforeSubmitted(true);
  };

  const handleCompleteSignup = () => {
    setBrowsingOnly(false);
    setAfterCompleted(true);
  };

  const handleReset = () => {
    setAfterCompleted(false);
    setBrowsingOnly(false);
  };

  return (
    <main id="top" className="max-w-[1320px] mx-auto px-6 py-10 lg:py-12">
      <ClosersNavStrip activePrinciple="emotion" onChangePrinciple={onChangePrinciple} />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 pb-8 border-b border-slate-200">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold text-orange-700 mb-2">
            05. Emotion · Measured Warmth
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight [text-wrap:balance]">
            Add genuine warmth without going overboard
          </h1>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Compare a cold technical signup box on the left against a calm, human experience for <strong className="font-medium text-slate-900">Kestrel CloudSync</strong> on the right—using quiet storytelling and a restrained celebration with a reduced-motion version.
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
          aria-label="Before and After Measured Emotion Comparison"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
        >
          {/* BEFORE: Cold Spec-Driven Signup */}
          <div className="lg:col-span-6 bg-slate-100/80 border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-2 pb-5 mb-6 border-b border-slate-200">
                <span className="text-sm font-semibold text-slate-900">
                  Before · Cold Technical Signup
                </span>
                <span className="text-xs text-slate-500">
                  Dry specs · Flat acknowledgement
                </span>
              </div>

              <div className="bg-white border border-slate-300 rounded-xl overflow-hidden">
                <div className="bg-slate-800 text-white px-5 py-3.5 flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold tracking-tight">
                    Kestrel CloudSync · User Registration
                  </span>
                  <span className="text-xs text-slate-300">New Account</span>
                </div>

                {beforeSubmitted ? (
                  <div className="p-6 sm:p-7 space-y-4">
                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-700 space-y-1">
                      <p className="font-semibold text-slate-900">Registration complete.</p>
                      <p className="text-xs text-slate-500 font-mono">
                        Record initialized · Quota: 5 GB · Status: Ready
                      </p>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Transactional text feels indifferent—visitors rarely feel confident enough to upload personal photos right away.
                    </p>
                    <button
                      type="button"
                      onClick={() => setBeforeSubmitted(false)}
                      className="text-xs font-medium text-slate-700 underline underline-offset-2 cursor-pointer"
                    >
                      Reset old form
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleBeforeSignup} className="p-6 sm:p-7 space-y-4">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 mb-1">
                        Create Storage Account
                      </h2>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Register for a 5 GB cloud bucket with AES-256 encryption and background sync daemon.
                      </p>
                    </div>

                    <div>
                      <label htmlFor="cold-email" className="block text-xs font-medium text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        id="cold-email"
                        type="email"
                        value={beforeEmail}
                        onChange={(e) => setBeforeEmail(e.target.value)}
                        placeholder="user@example.com"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="cold-pass" className="block text-xs font-medium text-slate-700 mb-1">
                        Create Password *
                      </label>
                      <input
                        id="cold-pass"
                        type="password"
                        value={beforePassword}
                        onChange={(e) => setBeforePassword(e.target.value)}
                        placeholder="Minimum 12 characters"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full min-h-[42px] px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium rounded-md transition-colors cursor-pointer"
                    >
                      Submit Registration
                    </button>
                  </form>
                )}
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-200 space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center justify-between gap-4">
                <span>Tone</span>
                <span className="font-medium text-slate-800">Technical &amp; detached</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Post-signup feedback</span>
                <span className="font-medium text-slate-800">Cold status string</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Risk</span>
                <span className="font-medium text-slate-800">Low warmth, early drop-off</span>
              </div>
            </div>
          </div>

          {/* AFTER: Measured Warmth + Restrained Celebration */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 pb-5 mb-6 border-b border-slate-200">
                <span className="text-sm font-semibold text-orange-800">
                  After · Quiet Warmth + Restrained Celebration
                </span>
                <label className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={reducedMotionPreview}
                    onChange={(e) => setReducedMotionPreview(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-orange-600 focus:ring-orange-600 cursor-pointer"
                  />
                  <span>Reduced-motion mode</span>
                </label>
              </div>

              {afterCompleted ? (
                <div className="py-4 space-y-6">
                  {/* Restrained Celebration Surface */}
                  <div className="rounded-xl bg-orange-50/70 border border-orange-200 p-6 sm:p-7 text-center">
                    <div className="relative w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                      {!reducedMotionPreview &&
                        SUBTLE_TICKS.map((tick) => (
                          <motion.span
                            key={tick.id}
                            initial={{ opacity: 0.9, scale: 0.6, x: 0, y: 0 }}
                            animate={{ opacity: 0, scale: 1, x: tick.x, y: tick.y }}
                            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                            aria-hidden="true"
                            className="absolute w-1.5 h-1.5 rounded-full bg-orange-500"
                          />
                        ))}

                      <motion.div
                        initial={reducedMotionPreview ? false : { opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={
                          reducedMotionPreview
                            ? { duration: 0 }
                            : { duration: 0.22, ease: [0.16, 1, 0.3, 1] }
                        }
                        className="w-11 h-11 rounded-full bg-emerald-700 text-white flex items-center justify-center"
                      >
                        <Check className="w-5 h-5" aria-hidden="true" />
                      </motion.div>
                    </div>

                    <h2 className="text-xl font-bold text-slate-900 [text-wrap:balance]">
                      You&apos;re all set — your starter vault is ready
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                      Photos and files from {ownerDisplay} are backed up quietly in the background, with 30 days of Pro access included.
                    </p>
                    <p className="mt-3 text-xs text-slate-500">
                      {reducedMotionPreview
                        ? 'Reduced-motion active: calm instant confirmation with zero movement.'
                        : 'Subtle motion active: brief 450ms settle without heavy confetti.'}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => onChangePrinciple('analysis')}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    >
                      <span>View Signup Impact</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Replay</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Quiet Human Story Framing */}
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 flex items-center justify-center shrink-0">
                      <Camera className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Phones get lost and laptops age out—keeping your photos and everyday documents safe shouldn&apos;t feel like configuring a server.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 [text-wrap:balance] mb-2">
                      Keep the photos and files that matter
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Start your free 30-day Kestrel CloudSync vault in one click. Quiet, automatic backup with no card required.
                    </p>
                  </div>

                  {browsingOnly && (
                    <div
                      role="status"
                      className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed"
                    >
                      No pressure: explore plans, export rules, and security details at your own pace with zero popups or guilt messages.
                    </div>
                  )}

                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={handleCompleteSignup}
                      className="w-full min-h-[50px] px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 whitespace-nowrap"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                      <span>Create Free Vault</span>
                    </button>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs text-slate-600">
                      <span>Free 30-day starter vault · No card needed</span>
                      <button
                        type="button"
                        onClick={() => setBrowsingOnly((prev) => !prev)}
                        className="text-slate-700 hover:text-slate-900 underline underline-offset-2 cursor-pointer"
                      >
                        Explore features first
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-5 border-t border-slate-200 space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center justify-between gap-4">
                <span>Tone</span>
                <span className="font-medium text-orange-800">
                  Warm, plain, never theatrical
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Post-signup feedback</span>
                <span className="font-medium text-orange-800">
                  Subtle celebration + reduced-motion version
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Guardrail</span>
                <span className="font-medium text-emerald-700">
                  No hype, no guilt copy, calm skip path
                </span>
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* Focused Preview */
        <section className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-medium text-orange-800">Kestrel CloudSync · Starter Vault</span>
            <label className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={reducedMotionPreview}
                onChange={(e) => setReducedMotionPreview(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-300 text-orange-600 focus:ring-orange-600"
              />
              <span>Reduced-motion mode</span>
            </label>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 flex items-start gap-3.5">
            <Camera className="w-4 h-4 text-orange-700 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs text-slate-700 leading-relaxed">
              Phones get lost and laptops age out—keeping your photos and everyday documents safe shouldn&apos;t feel like configuring a server.
            </p>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 [text-wrap:balance] mb-2">
              Keep the photos and files that matter
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Start your free 30-day vault in one click—no credit card required.
            </p>
          </div>

          {afterCompleted ? (
            <div className="p-6 rounded-xl bg-orange-50/70 border border-orange-200 text-center space-y-2">
              <p className="text-lg font-bold text-slate-900">
                You&apos;re all set — your starter vault is ready
              </p>
              <p className="text-xs text-slate-600">
                {reducedMotionPreview
                  ? 'Reduced-motion confirmation shown.'
                  : 'Subtle celebration played.'}
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-2 text-xs font-medium text-slate-800 underline underline-offset-2 cursor-pointer"
              >
                Replay
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleCompleteSignup}
              className="w-full min-h-[50px] px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Create Free Vault
            </button>
          )}

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <span>Respects reduced-motion settings · No card required</span>
            <button
              type="button"
              onClick={() => onChangeMode('side-by-side')}
              className="font-medium text-slate-900 underline underline-offset-4 hover:text-orange-700 cursor-pointer"
            >
              View Before &amp; After
            </button>
          </div>
        </section>
      )}

      {/* What Changed & Restraint Cards */}
      <section id="what-changed" className="mt-12 bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">
            Why Measured Emotion Works Better Than Over-the-Top Hype
          </h2>
          <p className="text-sm text-slate-600">
            Research evidence for emotion is indirect—warmth helps visitors feel understood, while excessive theatrics cause complaints and distrust.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-medium text-slate-500">
                <th className="py-3 px-6">Element</th>
                <th className="py-3 px-6">Before (Cold Form)</th>
                <th className="py-3 px-6">After (Measured Warmth)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              <tr>
                <td className="py-3.5 px-6 font-medium text-slate-900">Opening Cue</td>
                <td className="py-3.5 px-6 text-slate-600">
                  Technical specs (AES-256, 5 GB cloud bucket)
                </td>
                <td className="py-3.5 px-6 text-orange-800 font-medium">
                  Calm, relatable reminder about protecting everyday photos
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-slate-900">Completion Moment</td>
                <td className="py-3.5 px-6 text-slate-600">
                  Plain &ldquo;Record initialized&rdquo; text
                </td>
                <td className="py-3.5 px-6 text-slate-800">
                  Subtle 450ms checkmark celebration + reduced-motion version
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-slate-900">Guardrail</td>
                <td className="py-3.5 px-6 text-slate-600">
                  No sensory sensitivity or tone restraint
                </td>
                <td className="py-3.5 px-6 text-slate-800">
                  No confetti overload, no guilt copy, calm skip option
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <Camera className="w-5 h-5 text-orange-600 mb-3" aria-hidden="true" />
          <h3 className="text-base font-semibold text-slate-900 mb-2">
            Human Context, Not Melodrama
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            One honest sentence about lost phones and saved photos connects without sounding forced or salesy.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <CheckCircle2 className="w-5 h-5 text-orange-600 mb-3" aria-hidden="true" />
          <h3 className="text-base font-semibold text-slate-900 mb-2">
            Subtle Reduced-Motion Celebration
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            A brief 450ms confirmation lift rewards signup while automatically calming down when reduced-motion is preferred.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <ShieldCheck className="w-5 h-5 text-emerald-700 mb-3" aria-hidden="true" />
          <h3 className="text-base font-semibold text-slate-900 mb-2">
            Respects the Guardrail
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Avoids pushy emotional pressure or flashy popups that trigger declines, complaints, and anger.
          </p>
        </div>
      </section>
    </main>
  );
}
