import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bell,
  Check,
  CheckCircle2,
  Clock,
  Download,
  HardDrive,
  Laptop,
  RotateCcw,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import type { DemoPrinciple, UnauthViewMode } from '../types';

interface LossAvoidanceDemoProps {
  mode: UnauthViewMode;
  onChangeMode: (mode: UnauthViewMode) => void;
  onChangePrinciple: (principle: DemoPrinciple) => void;
  userName?: string | null;
}

export function LossAvoidanceDemo({
  mode,
  onChangeMode,
  onChangePrinciple,
  userName,
}: LossAvoidanceDemoProps) {
  // Real deadline anchored 6 days, 14 hours, 22 minutes ahead so the countdown is concrete and honest
  const deadlineTimestamp = useMemo(
    () => Date.now() + (6 * 86400 + 14 * 3600 + 22 * 60 + 18) * 1000,
    []
  );

  const [nowMs, setNowMs] = useState(() => Date.now());
  const [beforeActionFeedback, setBeforeActionFeedback] = useState<string | null>(null);
  const [afterState, setAfterState] = useState<'active' | 'confirmed' | 'exported'>('active');
  const [reminderSet, setReminderSet] = useState(false);
  const [showCancelPolicy, setShowCancelPolicy] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const remainingMs = Math.max(0, deadlineTimestamp - nowMs);
  const totalSeconds = Math.floor(remainingMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => String(n).padStart(2, '0');

  const deadlineFormatted = useMemo(() => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(deadlineTimestamp));
  }, [deadlineTimestamp]);

  const ownerLabel = userName?.trim() ? userName.trim() : 'Your Workspace';

  return (
    <main id="top" className="max-w-[1320px] mx-auto px-6 py-10 lg:py-12">
      {/* Chapter Switcher & Intro */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 pb-8 border-b border-slate-200">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 mb-3">
            <button
              type="button"
              onClick={() => onChangePrinciple('convenience')}
              className="hover:text-slate-900 underline underline-offset-4 cursor-pointer"
            >
              01. Convenience
            </button>
            <span aria-hidden="true">/</span>
            <span className="text-rose-700 font-semibold">
              02. Loss Avoidance · CloudSync Pro
            </span>
            <span aria-hidden="true">/</span>
            <button
              type="button"
              onClick={() => onChangePrinciple('own-identity')}
              className="hover:text-slate-900 underline underline-offset-4 cursor-pointer"
            >
              03. Own Identity
            </button>
            <span aria-hidden="true">/</span>
            <button
              type="button"
              onClick={() => onChangePrinciple('status')}
              className="hover:text-slate-900 underline underline-offset-4 cursor-pointer"
            >
              04. Status
            </button>
            <span aria-hidden="true">/</span>
            <button
              type="button"
              onClick={() => onChangePrinciple('analysis')}
              className="hover:text-slate-900 underline underline-offset-4 cursor-pointer"
            >
              Impact Analysis
            </button>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight [text-wrap:balance]">
            Protect what you&apos;ve already built, before it expires
          </h1>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Compare a generic &ldquo;buy new storage&rdquo; upgrade prompt on the left against a loss-avoidance experience for <strong className="font-medium text-slate-900">Kestrel CloudSync Pro</strong> on the right—showing real backed-up files, an expiring member credit, and transparent cancellation guardrails.
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
          aria-label="Before and After Loss Avoidance Comparison"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
        >
          {/* BEFORE: Generic Gain-Framed Upgrade Page */}
          <div className="lg:col-span-6 bg-slate-100/80 border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-2 pb-5 mb-6 border-b border-slate-200">
                <span className="text-sm font-semibold text-slate-900">
                  Before · Generic Upgrade Prompt
                </span>
                <span className="text-xs text-slate-500">
                  Focuses only on gaining new features
                </span>
              </div>

              <div className="bg-white border border-slate-300 rounded-xl overflow-hidden">
                <div className="bg-slate-800 text-white px-5 py-3.5 flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold tracking-tight">
                    Kestrel CloudSync · Upgrade Plan
                  </span>
                  <span className="text-xs text-slate-300">Plans</span>
                </div>

                <div className="p-6 sm:p-7 space-y-5">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">
                      Upgrade to Kestrel CloudSync Pro
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Get more space and faster backups across your devices. Start a paid subscription today for $12/month.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2.5 text-sm text-slate-700">
                    <p className="font-medium text-slate-900">What you can gain:</p>
                    <ul className="space-y-2 text-xs text-slate-600">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                        <span>Get up to 2 TB of cloud storage</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                        <span>Unlock multi-device folder sync</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                        <span>Access 30-day file version history</span>
                      </li>
                    </ul>
                  </div>

                  {beforeActionFeedback && (
                    <div
                      role="status"
                      className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed"
                    >
                      {beforeActionFeedback}
                    </div>
                  )}

                  <div className="pt-2 space-y-2.5">
                    <button
                      type="button"
                      onClick={() =>
                        setBeforeActionFeedback(
                          'Without showing what is already stored or expiring, most users hesitate because $12/month feels like a brand-new expense rather than protecting what they have.'
                        )
                      }
                      className="w-full min-h-[44px] px-4 py-2.5 bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium rounded-md transition-colors cursor-pointer"
                    >
                      Subscribe for $12/month
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setBeforeActionFeedback(
                          'When users click "Maybe later", they leave without realizing their 184.6 GB sync will pause and their $25 member credit is about to expire.'
                        )
                      }
                      className="w-full min-h-[40px] px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-medium rounded-md transition-colors cursor-pointer"
                    >
                      Maybe later
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-200 space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center justify-between gap-4">
                <span>Emotional framing</span>
                <span className="font-medium text-slate-800">Generic new purchase</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>User&apos;s existing data</span>
                <span className="font-medium text-slate-800">Not shown</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Urgency</span>
                <span className="font-medium text-slate-800">None—easy to ignore</span>
              </div>
            </div>
          </div>

          {/* AFTER: Loss-Avoidance Framed Kestrel CloudSync Pro Experience */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-2 pb-5 mb-6 border-b border-slate-200">
                <span className="text-sm font-semibold text-rose-800">
                  After · Loss Avoidance + Guardrails
                </span>
                <span className="text-xs text-rose-700 font-medium">
                  Protects active files &amp; expiring credit
                </span>
              </div>

              {afterState === 'confirmed' ? (
                <div className="py-6 space-y-6">
                  <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
                    <div className="flex items-center gap-2.5 text-emerald-800">
                      <CheckCircle2 className="w-5 h-5 shrink-0" aria-hidden="true" />
                      <h2 className="text-lg font-bold text-slate-900">
                        Your CloudSync Pro workspace is protected
                      </h2>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      All <strong className="font-semibold">184.6 GB</strong> across your 3 devices remains synced without interruption, and your <strong className="font-semibold">$25.00 member credit</strong> has been applied to your renewal.
                    </p>
                    <p className="text-xs text-slate-600">
                      You can export your files or cancel in 2 clicks anytime from your account settings.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setAfterState('active');
                      setReminderSet(false);
                      setShowCancelPolicy(false);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Reset demo preview</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Real-Deadline Countdown Strip */}
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold text-rose-900">
                        Trial &amp; $25.00 credit end on {deadlineFormatted}
                      </p>
                      <p className="text-xs text-rose-700 mt-0.5">
                        Reserved for {ownerLabel} · No automatic charge without your confirmation
                      </p>
                    </div>
                    <div
                      aria-label="Time remaining before trial and credit expire"
                      className="font-mono tabular-nums text-base sm:text-lg font-bold text-rose-900 bg-white border border-rose-200 rounded-lg px-3.5 py-2 whitespace-nowrap shrink-0 text-center"
                    >
                      {pad(days)}d : {pad(hours)}h : {pad(minutes)}m : {pad(seconds)}s
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 [text-wrap:balance] mb-2">
                      Don&apos;t lose your 184.6 GB backup &amp; $25 credit
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      During your 30-day Kestrel CloudSync Pro access, you backed up photos and project folders across 3 devices. Confirm below to keep everything syncing seamlessly.
                    </p>
                  </div>

                  {/* Concrete Inventory of What Would Be Lost */}
                  <div className="border border-slate-200 rounded-xl divide-y divide-slate-100">
                    <div className="p-4 flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <HardDrive className="w-4 h-4 text-slate-700 mt-0.5 shrink-0" aria-hidden="true" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            184.6 GB synced across 3 devices
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                            <span className="inline-flex items-center gap-1">
                              <Laptop className="w-3 h-3" aria-hidden="true" /> MacBook
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="inline-flex items-center gap-1">
                              <Smartphone className="w-3 h-3" aria-hidden="true" /> Phone
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>Studio Desktop</span>
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-rose-700 whitespace-nowrap shrink-0">
                        Sync pauses
                      </span>
                    </div>

                    <div className="p-4 flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-4 h-4 text-rose-700 mt-0.5 shrink-0" aria-hidden="true" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            $25.00 Early-Member Credit
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Covers your first 2 months ($0 due today, then $12/mo)
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-rose-700 whitespace-nowrap shrink-0">
                        Expires forever
                      </span>
                    </div>

                    <div className="p-4 flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <Clock className="w-4 h-4 text-slate-700 mt-0.5 shrink-0" aria-hidden="true" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            30-Day File Version History
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Older file snapshots drop to 7-day history on free tier
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-slate-600 whitespace-nowrap shrink-0">
                        Drops to 7 days
                      </span>
                    </div>
                  </div>

                  {/* Primary Action */}
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => setAfterState('confirmed')}
                      className="w-full min-h-[50px] px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 whitespace-nowrap"
                    >
                      <span>Keep My 184.6 GB &amp; Apply $25 Credit</span>
                    </button>

                    {/* Ethical Guardrails Bar (Transparent, Zero Dark Patterns) */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs text-slate-600">
                      <button
                        type="button"
                        onClick={() => setReminderSet((prev) => !prev)}
                        className="inline-flex items-center gap-1.5 hover:text-slate-900 cursor-pointer"
                      >
                        <Bell className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                        <span>
                          {reminderSet ? '24h email reminder scheduled' : 'Remind me 24h before deadline'}
                        </span>
                      </button>

                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => setAfterState('exported')}
                          className="inline-flex items-center gap-1.5 hover:text-slate-900 underline underline-offset-2 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Export files</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowCancelPolicy((prev) => !prev)}
                          className="hover:text-slate-900 underline underline-offset-2 cursor-pointer"
                        >
                          Cancel &amp; refund policy
                        </button>
                      </div>
                    </div>

                    {afterState === 'exported' && (
                      <div
                        role="status"
                        className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700"
                      >
                        Archive ready: you can download all 184.6 GB as standard ZIP folders anytime—your files are never locked in.
                      </div>
                    )}

                    {showCancelPolicy && (
                      <div
                        role="region"
                        aria-label="Cancellation and refund guarantee"
                        className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 leading-relaxed"
                      >
                        <strong className="font-semibold">Honest Guardrail:</strong> Cancel online in 2 clicks anytime with no phone calls. Includes an automatic 14-day full refund guarantee if you change your mind.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-5 border-t border-slate-200 space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center justify-between gap-4">
                <span>Emotional framing</span>
                <span className="font-medium text-rose-700">Protect existing files &amp; credit</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Deadline clarity</span>
                <span className="font-medium text-rose-700">Live countdown tied to real date</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>User trust guardrail</span>
                <span className="font-medium text-emerald-700">1-click export + 2-click cancel + refund</span>
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* Focused Preview of the Improved Loss-Avoidance Page */
        <section className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 space-y-6">
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-rose-900">
                Trial &amp; $25.00 credit end on {deadlineFormatted}
              </p>
              <p className="text-xs text-rose-700 mt-0.5">
                Reserved for {ownerLabel} · No automatic charge without confirmation
              </p>
            </div>
            <div className="font-mono tabular-nums text-lg font-bold text-rose-900 bg-white border border-rose-200 rounded-lg px-4 py-2 whitespace-nowrap shrink-0">
              {pad(days)}d : {pad(hours)}h : {pad(minutes)}m : {pad(seconds)}s
            </div>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 [text-wrap:balance] mb-2">
              Keep your 184.6 GB backup &amp; $25.00 member credit
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Your devices are already synced and protected with Kestrel CloudSync Pro. Confirm before the deadline so your backups don&apos;t pause and your $25 credit doesn&apos;t expire.
            </p>
          </div>

          <div className="border border-slate-200 rounded-xl divide-y divide-slate-100">
            <div className="p-4 flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-slate-900">184.6 GB synced across 3 devices</span>
              <span className="text-xs font-medium text-rose-700">Sync pauses after deadline</span>
            </div>
            <div className="p-4 flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-slate-900">$25.00 Early-Member Credit</span>
              <span className="text-xs font-medium text-rose-700">Expires permanently</span>
            </div>
            <div className="p-4 flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-slate-900">30-Day Version History</span>
              <span className="text-xs font-medium text-slate-600">Drops to 7 days</span>
            </div>
          </div>

          {afterState === 'confirmed' ? (
            <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 text-emerald-900 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" aria-hidden="true" />
                <span>Protected: 184.6 GB active and $25.00 credit applied.</span>
              </div>
              <button
                type="button"
                onClick={() => setAfterState('active')}
                className="text-xs font-medium text-slate-700 underline underline-offset-2 cursor-pointer self-start sm:self-auto"
              >
                Reset
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setAfterState('confirmed')}
              className="w-full min-h-[52px] px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Keep My 184.6 GB &amp; Apply $25 Credit
            </button>
          )}

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <span>Cancel in 2 clicks anytime · 14-day full refund guarantee</span>
            <button
              type="button"
              onClick={() => onChangeMode('side-by-side')}
              className="font-medium text-slate-900 underline underline-offset-4 hover:text-rose-700 cursor-pointer"
            >
              View Before &amp; After
            </button>
          </div>
        </section>
      )}

      {/* What Changed Table */}
      <section id="what-changed" className="mt-12 bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">
            How Loss Avoidance Changes the Experience
          </h2>
          <p className="text-sm text-slate-600">
            Moving from a generic feature pitch to protecting what the user already owns—with clear trust guardrails.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-medium text-slate-500">
                <th className="py-3 px-6">Element</th>
                <th className="py-3 px-6">Before (Gain Only)</th>
                <th className="py-3 px-6">After (Loss Avoidance + Guardrail)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              <tr>
                <td className="py-3.5 px-6 font-medium text-slate-900">Headline &amp; Value</td>
                <td className="py-3.5 px-6 text-slate-600">
                  &ldquo;Get 2 TB storage for $12/month&rdquo;
                </td>
                <td className="py-3.5 px-6 text-rose-800 font-medium">
                  &ldquo;Keep your 184.6 GB backup &amp; $25.00 credit&rdquo;
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-slate-900">Deadline Signal</td>
                <td className="py-3.5 px-6 text-slate-600">
                  No timeline—easy to postpone indefinitely
                </td>
                <td className="py-3.5 px-6 text-slate-800">
                  Live countdown tied to the real credit &amp; trial expiry date
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-slate-900">Customer Trust Guardrail</td>
                <td className="py-3.5 px-6 text-slate-600">
                  No clear exit or data export assurance
                </td>
                <td className="py-3.5 px-6 text-slate-800">
                  24h reminder option, 1-click file export, 2-click cancel &amp; 14-day refund
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Guardrail Cards */}
      <section id="benefits" className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <HardDrive className="w-5 h-5 text-rose-700 mb-3" aria-hidden="true" />
          <h3 className="text-base font-semibold text-slate-900 mb-2">
            Non-Loss &gt; Gain
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Customers care more about keeping the 184.6 GB and $25 credit they already hold than about buying abstract extra space.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <Clock className="w-5 h-5 text-rose-700 mb-3" aria-hidden="true" />
          <h3 className="text-base font-semibold text-slate-900 mb-2">
            Real Deadline Countdown
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            The countdown matches an actual expiration date for the trial and member credit—never a fake timer that resets on refresh.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <ShieldCheck className="w-5 h-5 text-emerald-700 mb-3" aria-hidden="true" />
          <h3 className="text-base font-semibold text-slate-900 mb-2">
            Fairness Guardrails
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Clear export links, optional 24h reminders, and 2-click cancellation prevent complaints, refunds, and surprise renewals.
          </p>
        </div>
      </section>
    </main>
  );
}
