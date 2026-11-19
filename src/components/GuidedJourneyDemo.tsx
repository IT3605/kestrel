import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Bell,
  Camera,
  Check,
  CheckCircle2,
  Clock,
  Flame,
  HardDrive,
  RotateCcw,
  ShieldCheck,
  Snowflake,
  Users,
} from 'lucide-react';
import type { ClosersPreferences, DemoPrinciple } from '../types';
import { ClosersNavStrip } from './ClosersNavStrip';

interface GuidedJourneyDemoProps {
  onChangePrinciple: (principle: DemoPrinciple) => void;
  userName?: string | null;
  isSignedIn: boolean;
  onGoogleSignIn: () => Promise<void>;
  signingIn: boolean;
  closersPrefs: ClosersPreferences;
  onUpdateClosersPrefs: (partial: Partial<ClosersPreferences>) => void;
}

const STEPS: {
  step: number;
  letter: string;
  title: string;
  subtitle: string;
}[] = [
  { step: 1, letter: 'C', title: 'Convenience', subtitle: '1-click Google Sign-Up' },
  { step: 2, letter: 'E', title: 'Emotion', subtitle: 'Quiet human context' },
  { step: 3, letter: 'R', title: 'Recognition', subtitle: 'Reconciled vault proof' },
  { step: 4, letter: 'O', title: 'Own Identity', subtitle: 'Your chosen group' },
  { step: 5, letter: 'S', title: 'Status', subtitle: 'Plain-number progress' },
  { step: 6, letter: 'S', title: 'Stickiness', subtitle: 'Streak with a freeze' },
  { step: 7, letter: 'L', title: 'Loss Avoidance', subtitle: 'Protect files & credit' },
];

const GROUP_OPTIONS = ['Tan Family Vault', 'Design Studio Pod', 'Weekend Photo Club'];

export function GuidedJourneyDemo({
  onChangePrinciple,
  userName,
  isSignedIn,
  onGoogleSignIn,
  signingIn,
  closersPrefs,
  onUpdateClosersPrefs,
}: GuidedJourneyDemoProps) {
  const osPrefersReduced = useReducedMotion();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedJourney, setCompletedJourney] = useState(false);
  const [milestoneSteps, setMilestoneSteps] = useState(4);
  const [streakWeeks, setStreakWeeks] = useState(1);
  const [freezeTested, setFreezeTested] = useState(false);
  const [showAuditBreakdown, setShowAuditBreakdown] = useState(false);

  const reducedMotion = Boolean(osPrefersReduced) || closersPrefs.reducedMotionCelebration;
  const ownerDisplay = userName?.trim() ? userName.trim() : 'Your Workspace';

  const deadlineFormatted = useMemo(() => {
    const target = new Date(Date.now() + 7 * 86400 * 1000);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(target);
  }, []);

  const handleRestart = () => {
    setCurrentStep(1);
    setCompletedJourney(false);
    setMilestoneSteps(4);
    setStreakWeeks(1);
    setFreezeTested(false);
  };

  return (
    <main id="top" className="max-w-[1320px] mx-auto px-6 py-10 lg:py-12">
      <ClosersNavStrip activePrinciple="journey" onChangePrinciple={onChangePrinciple} />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 pb-8 border-b border-slate-200">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold text-emerald-700 mb-2">
            End-to-End Customer Walkthrough · All 7 Triggers Combined
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight [text-wrap:balance]">
            Experience the full 7-step signup journey
          </h1>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Walk through <strong className="font-medium text-slate-900">Kestrel CloudSync</strong> as a real visitor—from first Google click to weekly backup habit—with every privacy, consent, and cancellation guardrail active.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shrink-0">
          <span className="block text-xs text-slate-500">Journey Progress</span>
          <span className="font-mono tabular-nums text-base font-bold text-slate-900">
            {completedJourney ? '7 / 7 complete' : `Step ${currentStep} of 7`}
          </span>
        </div>
      </div>

      {/* 7-Step Horizontal Progress Rail */}
      <nav aria-label="Guided Journey Steps" className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-8">
        {STEPS.map((s) => {
          const isCurrent = !completedJourney && currentStep === s.step;
          const isDone = completedJourney || currentStep > s.step;
          return (
            <button
              key={s.step}
              type="button"
              onClick={() => {
                setCompletedJourney(false);
                setCurrentStep(s.step);
              }}
              className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                isCurrent
                  ? 'bg-slate-900 text-white border-slate-900'
                  : isDone
                    ? 'bg-emerald-50 text-emerald-950 border-emerald-200 hover:bg-emerald-100/70'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between gap-2 text-xs font-mono font-bold">
                <span>
                  {s.step}. {s.letter}
                </span>
                {isDone && <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" aria-hidden="true" />}
              </div>
              <span
                className={`block text-xs font-semibold mt-1 truncate ${
                  isCurrent ? 'text-white' : 'text-slate-900'
                }`}
              >
                {s.title}
              </span>
              <span
                className={`block text-[11px] truncate ${
                  isCurrent ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                {s.subtitle}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Main Step Card */}
      <section className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-10">
        {completedJourney ? (
          <div className="space-y-6">
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.25 }}
              className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2"
            >
              <div className="flex items-center gap-2.5 text-emerald-900">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" aria-hidden="true" />
                <h2 className="text-xl font-bold">
                  {ownerDisplay} completed all 7 CLOSERS steps
                </h2>
              </div>
              <p className="text-sm text-emerald-950 leading-relaxed">
                Your choices—group identity, reminder preferences, tier visibility, and reduced-motion settings—carried smoothly across every step{isSignedIn ? ' and are saved to your account.' : '.'}
              </p>
            </motion.div>

            <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 text-sm">
              <div className="p-4 flex items-center justify-between gap-4">
                <span className="text-slate-600">Chosen group (Own Identity)</span>
                <span className="font-semibold text-slate-900">
                  {closersPrefs.optedOutOfGroup ? 'Private (opted out)' : closersPrefs.chosenGroupName}
                </span>
              </div>
              <div className="p-4 flex items-center justify-between gap-4">
                <span className="text-slate-600">Onboarding tier (Status)</span>
                <span className="font-mono tabular-nums font-semibold text-slate-900">
                  {milestoneSteps >= 5 ? 'Trusted Steward (5 / 5)' : `Member (${milestoneSteps} / 5)`}
                </span>
              </div>
              <div className="p-4 flex items-center justify-between gap-4">
                <span className="text-slate-600">Weekly sync streak (Stickiness)</span>
                <span className="font-mono tabular-nums font-semibold text-slate-900">
                  {streakWeeks} {streakWeeks === 1 ? 'week' : 'weeks'} ·{' '}
                  {closersPrefs.weeklyReminderOptIn ? 'Reminders ON' : 'Reminders opted out'}
                </span>
              </div>
              <div className="p-4 flex items-center justify-between gap-4">
                <span className="text-slate-600">Trial protection (Loss Avoidance)</span>
                <span className="font-semibold text-emerald-700">
                  184.6 GB &amp; $25 credit active ·{' '}
                  {closersPrefs.trialReminder24h ? '24h reminder ON' : '24h reminder OFF'}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onChangePrinciple('analysis')}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>View Signup Impact Analysis</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
                {isSignedIn && (
                  <button
                    type="button"
                    onClick={() => onChangePrinciple('convenience')}
                    className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Manage in My Account
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={handleRestart}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 underline underline-offset-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Restart Journey</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Step 1: Convenience */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-semibold text-sky-700 mb-1">
                    Step 1 of 7 · C — Convenience
                  </p>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Start in one click with Google—no 5-field form
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    Instead of asking for account numbers, passwords, PINs, and CAPTCHAs, let visitors enter immediately.
                  </p>
                </div>

                {isSignedIn ? (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-sm text-emerald-950">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" aria-hidden="true" />
                    <span>
                      Signed in as <strong>{ownerDisplay}</strong>. Your choices in the next 6 steps will save directly to your account.
                    </span>
                  </div>
                ) : (
                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <button
                      type="button"
                      onClick={() => void onGoogleSignIn()}
                      disabled={signingIn}
                      className="w-full min-h-[48px] px-5 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      {signingIn ? 'Signing you in...' : 'Continue with Google (Live Sign-In)'}
                    </button>
                    <p className="text-xs text-slate-500 text-center">
                      Or click &ldquo;Next Step&rdquo; below to preview the rest of the journey as a guest.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Emotion */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-semibold text-orange-700 mb-1">
                    Step 2 of 7 · E — Emotion (Measured Warmth)
                  </p>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Connect to real moments—without hype
                  </h2>
                </div>

                <div className="rounded-xl bg-orange-50/70 border border-orange-200 p-5 flex items-start gap-3.5">
                  <Camera className="w-5 h-5 text-orange-700 shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Phones get lost and laptops age out—keeping your photos and everyday documents safe shouldn&apos;t feel like configuring a server.
                  </p>
                </div>

                <label className="flex items-center gap-3 p-3.5 rounded-lg border border-slate-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={closersPrefs.reducedMotionCelebration}
                    onChange={(e) =>
                      onUpdateClosersPrefs({ reducedMotionCelebration: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-600 cursor-pointer"
                  />
                  <div>
                    <span className="block text-sm font-medium text-slate-900">
                      Use reduced-motion confirmations
                    </span>
                    <span className="block text-xs text-slate-500">
                      Guardrail: keeps celebrations calm and accessible with zero flashing.
                    </span>
                  </div>
                </label>
              </div>
            )}

            {/* Step 3: Recognition */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-semibold text-emerald-700 mb-1">
                    Step 3 of 7 · R — Recognition
                  </p>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Verify social proof with numbers that add up
                  </h2>
                </div>

                <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-emerald-800">
                        Active CloudSync Vaults Backed Up This Week
                      </p>
                      <p className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                        1,428 verified vaults
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAuditBreakdown((prev) => !prev)}
                      className="px-3 py-1.5 text-xs font-medium bg-white border border-emerald-200 rounded-lg text-emerald-900 cursor-pointer"
                    >
                      {showAuditBreakdown ? 'Hide breakdown' : 'Verify breakdown'}
                    </button>
                  </div>
                  {showAuditBreakdown && (
                    <p className="text-xs font-mono tabular-nums text-emerald-900 pt-3 border-t border-emerald-200">
                      612 Family + 489 Studio + 327 Solo = 1,428 (exact reconciled total)
                    </p>
                  )}
                </div>

                <p className="text-xs text-slate-600 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
                  <span>
                    Guardrail: reviews are filtered for 30+ days of verified backup usage—never unverified quotes.
                  </span>
                </p>
              </div>
            )}

            {/* Step 4: Own Identity */}
            {currentStep === 4 && (
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-semibold text-violet-800 mb-1">
                    Step 4 of 7 · O — Own Identity
                  </p>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Name the group you&apos;re protecting together
                  </h2>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {GROUP_OPTIONS.map((grp) => (
                      <button
                        key={grp}
                        type="button"
                        onClick={() =>
                          onUpdateClosersPrefs({ chosenGroupName: grp, optedOutOfGroup: false })
                        }
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border cursor-pointer ${
                          closersPrefs.chosenGroupName === grp && !closersPrefs.optedOutOfGroup
                            ? 'bg-violet-800 text-white border-violet-800'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {grp}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    maxLength={40}
                    value={closersPrefs.chosenGroupName}
                    onChange={(e) =>
                      onUpdateClosersPrefs({
                        chosenGroupName: e.target.value.slice(0, 40) || 'Tan Family Vault',
                        optedOutOfGroup: false,
                      })
                    }
                    aria-label="Chosen group name"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>

                <div className="p-4 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-violet-800 shrink-0" aria-hidden="true" />
                    <span className="text-sm font-semibold text-slate-900">
                      {closersPrefs.optedOutOfGroup
                        ? 'Private solo mode (opted out)'
                        : closersPrefs.chosenGroupName}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateClosersPrefs({ optedOutOfGroup: !closersPrefs.optedOutOfGroup })
                    }
                    className="text-xs font-medium text-violet-900 underline underline-offset-2 cursor-pointer"
                  >
                    {closersPrefs.optedOutOfGroup ? 'Rejoin group' : 'Opt out of group view'}
                  </button>
                </div>

                <label className="flex items-center gap-3 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={closersPrefs.shareGroupStatus}
                    onChange={(e) => onUpdateClosersPrefs({ shareGroupStatus: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-violet-700 cursor-pointer"
                  />
                  <span>
                    Guardrail: only share my backup activity with {closersPrefs.chosenGroupName} when I opt in
                  </span>
                </label>
              </div>
            )}

            {/* Step 5: Status */}
            {currentStep === 5 && (
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-semibold text-amber-800 mb-1">
                    Step 5 of 7 · S — Status
                  </p>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Climb to Trusted Steward in plain numbers
                  </h2>
                </div>

                <div className="p-5 rounded-xl bg-amber-50 border border-amber-200 space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-700 shrink-0" aria-hidden="true" />
                      <span className="text-base font-bold text-slate-900">
                        {milestoneSteps >= 5 ? 'Trusted Steward Unlocked' : '1 step left to Trusted Steward'}
                      </span>
                    </div>
                    <span className="font-mono tabular-nums text-sm font-bold text-amber-900">
                      {milestoneSteps} / 5 steps
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMilestoneSteps(5)}
                    disabled={milestoneSteps >= 5}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    {milestoneSteps >= 5 ? 'Step Completed (5 / 5)' : 'Complete Final Setup Step (+1)'}
                  </button>
                </div>

                <label className="flex items-center gap-3 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={closersPrefs.hideTierProgress}
                    onChange={(e) => onUpdateClosersPrefs({ hideTierProgress: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-amber-700 cursor-pointer"
                  />
                  <span>
                    Guardrail: hide tier progress bars (personal milestones only—never public bottom-rank shaming)
                  </span>
                </label>
              </div>
            )}

            {/* Step 6: Stickiness */}
            {currentStep === 6 && (
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-semibold text-slate-900 mb-1">
                    Step 6 of 7 · S — Stickiness
                  </p>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Start a forgiving weekly backup streak
                  </h2>
                </div>

                <div className="p-5 rounded-xl bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-slate-300">Weekly Habit</span>
                    <div className="text-xl font-bold font-mono tabular-nums flex items-center gap-2 mt-1">
                      {freezeTested ? (
                        <Snowflake className="w-5 h-5 text-sky-300" aria-hidden="true" />
                      ) : (
                        <Flame className="w-5 h-5 text-orange-400" aria-hidden="true" />
                      )}
                      <span>
                        {streakWeeks}-week streak {freezeTested ? '(Freeze active)' : ''}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setStreakWeeks((w) => w + 1);
                        setFreezeTested(false);
                      }}
                      className="px-3 py-1.5 bg-white text-slate-900 text-xs font-semibold rounded-lg cursor-pointer"
                    >
                      +1 Week
                    </button>
                    <button
                      type="button"
                      onClick={() => setFreezeTested((f) => !f)}
                      className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-sky-200 text-xs font-semibold rounded-lg cursor-pointer"
                    >
                      {freezeTested ? 'Return After Break' : 'Test Freeze'}
                    </button>
                  </div>
                </div>

                <label className="flex items-center gap-3 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={closersPrefs.weeklyReminderOptIn}
                    onChange={(e) => onUpdateClosersPrefs({ weeklyReminderOptIn: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-slate-900 cursor-pointer"
                  />
                  <span>
                    Guardrail: send optional Sunday reminder email (uncheck to opt out anytime)
                  </span>
                </label>
              </div>
            )}

            {/* Step 7: Loss Avoidance */}
            {currentStep === 7 && (
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-semibold text-rose-700 mb-1">
                    Step 7 of 7 · L — Loss Avoidance
                  </p>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Protect your 184.6 GB &amp; $25.00 credit before {deadlineFormatted}
                  </h2>
                </div>

                <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 text-sm">
                  <div className="p-4 flex items-center justify-between gap-4">
                    <span className="inline-flex items-center gap-2 font-medium text-slate-900">
                      <HardDrive className="w-4 h-4 text-slate-700" aria-hidden="true" />
                      184.6 GB synced across 3 devices
                    </span>
                    <span className="text-xs font-medium text-rose-700">Protected</span>
                  </div>
                  <div className="p-4 flex items-center justify-between gap-4">
                    <span className="inline-flex items-center gap-2 font-medium text-slate-900">
                      <Clock className="w-4 h-4 text-rose-700" aria-hidden="true" />
                      $25.00 Early-Member Credit
                    </span>
                    <span className="text-xs font-medium text-rose-700">
                      Applied before {deadlineFormatted}
                    </span>
                  </div>
                </div>

                <label className="flex items-center gap-3 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={closersPrefs.trialReminder24h}
                    onChange={(e) => onUpdateClosersPrefs({ trialReminder24h: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-rose-700 cursor-pointer"
                  />
                  <span className="inline-flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                    Guardrail: email me 24h before trial ends (plus 1-click export &amp; 2-click cancel)
                  </span>
                </label>
              </div>
            )}

            {/* Step Footer Navigation */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
              <button
                type="button"
                disabled={currentStep === 1}
                onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-slate-700 hover:text-slate-900 disabled:opacity-40 border border-slate-200 rounded-lg cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Previous</span>
              </button>

              {currentStep < 7 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((s) => Math.min(7, s + 1))}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg cursor-pointer"
                >
                  <span>Next Step ({currentStep + 1} of 7)</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setCompletedJourney(true)}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Finish Guided Journey</span>
                </button>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
