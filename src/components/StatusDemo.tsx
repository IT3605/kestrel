import { useState } from 'react';
import {
  ArrowUpRight,
  Award,
  Check,
  CheckCircle2,
  EyeOff,
  RotateCcw,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import type { DemoPrinciple, UnauthViewMode } from '../types';
import { ClosersNavStrip } from './ClosersNavStrip';

interface StatusDemoProps {
  mode: UnauthViewMode;
  onChangeMode: (mode: UnauthViewMode) => void;
  onChangePrinciple: (principle: DemoPrinciple) => void;
  userName?: string | null;
}

interface TierSpec {
  id: string;
  name: string;
  minMilestones: number;
  perkSummary: string;
}

const TIERS: TierSpec[] = [
  {
    id: 'member',
    name: 'Member',
    minMilestones: 0,
    perkSummary: 'Standard encrypted backup & 7-day version history',
  },
  {
    id: 'steward',
    name: 'Trusted Steward',
    minMilestones: 5,
    perkSummary: '90-day version history & priority recovery',
  },
  {
    id: 'founder',
    name: 'Founder Circle',
    minMilestones: 10,
    perkSummary: '1-year version archive & early hardware beta access',
  },
];

export function StatusDemo({
  mode,
  onChangeMode,
  onChangePrinciple,
  userName,
}: StatusDemoProps) {
  const [beforeNotice, setBeforeNotice] = useState(false);
  const [milestonesCompleted, setMilestonesCompleted] = useState<number>(4);
  const [backedUpGb, setBackedUpGb] = useState<number>(185);
  const [hideTierComparison, setHideTierComparison] = useState(false);

  const ownerDisplay = userName?.trim() ? userName.trim() : 'Your Account';

  const currentTier =
    milestonesCompleted >= 10
      ? TIERS[2]
      : milestonesCompleted >= 5
        ? TIERS[1]
        : TIERS[0];

  const nextTier =
    milestonesCompleted >= 10
      ? null
      : milestonesCompleted >= 5
        ? TIERS[2]
        : TIERS[1];

  const targetMilestones = nextTier ? nextTier.minMilestones : 10;
  const remainingMilestones = Math.max(0, targetMilestones - milestonesCompleted);
  const progressPct = Math.min(100, Math.round((milestonesCompleted / targetMilestones) * 100));

  const handleCompleteMilestone = () => {
    setMilestonesCompleted((prev) => Math.min(10, prev + 1));
    setBackedUpGb((prev) => Math.min(500, prev + 35));
  };

  const handleReset = () => {
    setMilestonesCompleted(4);
    setBackedUpGb(185);
    setHideTierComparison(false);
  };

  return (
    <main id="top" className="max-w-[1320px] mx-auto px-6 py-10 lg:py-12">
      <ClosersNavStrip activePrinciple="status" onChangePrinciple={onChangePrinciple} />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 pb-8 border-b border-slate-200">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold text-amber-800 mb-2">
            04. Status · Climbing the Ladder
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight [text-wrap:balance]">
            Show clear progress to the next tier, in plain numbers
          </h1>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Compare a flat static account label on the left against a transparent tier ladder for <strong className="font-medium text-slate-900">Kestrel CloudSync</strong> on the right—designed without bottom-rank shaming.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto shrink-0">
          <div
            role="tablist"
            aria-label="Page view mode"
            className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg"
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
          <button
            type="button"
            onClick={() => onChangePrinciple('analysis')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Open Impact Analysis</span>
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {mode === 'side-by-side' ? (
        <section
          aria-label="Before and After Status Comparison"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
        >
          {/* BEFORE: Flat Account Label */}
          <div className="lg:col-span-6 bg-slate-100/80 border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-2 pb-5 mb-6 border-b border-slate-200">
                <span className="text-sm font-semibold text-slate-900">
                  Before · Flat Static Account Status
                </span>
                <span className="text-xs text-slate-500">
                  No milestones or next-tier numbers
                </span>
              </div>

              <div className="bg-white border border-slate-300 rounded-xl overflow-hidden">
                <div className="bg-slate-800 text-white px-5 py-3.5 flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold tracking-tight">
                    Kestrel CloudSync · Membership
                  </span>
                  <span className="text-xs text-slate-300">Account Plan</span>
                </div>

                <div className="p-6 sm:p-7 space-y-5">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Current Plan</p>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">
                      Standard User
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      You have an active CloudSync account. Thank you for using Kestrel CloudSync.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs text-slate-600">
                    <div className="flex items-center justify-between gap-4">
                      <span>Storage used</span>
                      <span className="font-mono tabular-nums text-slate-800">185 GB</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span>Next milestone</span>
                      <span className="text-slate-500">Not shown</span>
                    </div>
                  </div>

                  {beforeNotice && (
                    <div
                      role="status"
                      className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed"
                    >
                      Without visible progress numbers or an achievable next tier, users feel no reason to protect extra devices or build long-term loyalty.
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setBeforeNotice(true)}
                    className="w-full min-h-[44px] px-4 py-2.5 bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium rounded-md transition-colors cursor-pointer"
                  >
                    Check Membership Status
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-200 space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center justify-between gap-4">
                <span>Visibility of growth</span>
                <span className="font-medium text-slate-800">Static label only</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Path to next level</span>
                <span className="font-medium text-slate-800">Unclear—no numbers</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Motivation to continue</span>
                <span className="font-medium text-slate-800">Flat after sign-up</span>
              </div>
            </div>
          </div>

          {/* AFTER: Plain-Number Tier Progress + Anti-Drop-Out Guardrails */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-2 pb-5 mb-6 border-b border-slate-200">
                <span className="text-sm font-semibold text-amber-900">
                  After · Plain-Number Tier Progress + Guardrails
                </span>
                <span className="text-xs text-amber-800 font-medium">
                  Clear next step · No bottom-rank shaming
                </span>
              </div>

              {hideTierComparison ? (
                <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center gap-2.5 text-slate-900">
                    <EyeOff className="w-5 h-5 text-slate-600 shrink-0" aria-hidden="true" />
                    <h2 className="text-lg font-bold">Simple View Enabled</h2>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Tier progress and status ladders are hidden. You still keep all your CloudSync backup features and {backedUpGb} GB of protected files.
                  </p>
                  <button
                    type="button"
                    onClick={() => setHideTierComparison(false)}
                    className="px-4 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  >
                    Show tier progress again
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Current Tier & Plain-Number Progress Banner */}
                  <div className="p-5 rounded-xl bg-amber-50 border border-amber-200 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium text-amber-800">
                          {ownerDisplay} · Current Tier
                        </p>
                        <h2 className="text-xl font-bold text-slate-900 mt-0.5 flex items-center gap-2">
                          <Award className="w-5 h-5 text-amber-700 shrink-0" aria-hidden="true" />
                          <span>{currentTier.name}</span>
                        </h2>
                      </div>
                      <div className="bg-white border border-amber-200 rounded-lg px-3.5 py-2 text-right shrink-0">
                        <span className="block text-xs text-slate-500">
                          {nextTier ? `Next: ${nextTier.name}` : 'Top Tier Reached'}
                        </span>
                        <span className="font-mono tabular-nums text-base font-bold text-amber-900">
                          {milestonesCompleted} / {targetMilestones} steps
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="h-2.5 w-full bg-amber-200/70 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-700 transition-all duration-300"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-amber-950 font-mono tabular-nums">
                        <span>{backedUpGb} GB protected</span>
                        <span>
                          {nextTier
                            ? `${remainingMilestones} ${remainingMilestones === 1 ? 'step' : 'steps'} left to unlock ${nextTier.name}`
                            : 'All tier perks unlocked'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 3-Tier Ladder */}
                  <div className="border border-slate-200 rounded-xl divide-y divide-slate-100">
                    {TIERS.map((tier) => {
                      const unlocked = milestonesCompleted >= tier.minMilestones;
                      const isCurrent = currentTier.id === tier.id;
                      return (
                        <div
                          key={tier.id}
                          className={`p-4 flex items-start justify-between gap-4 ${
                            isCurrent ? 'bg-amber-50/40' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <CheckCircle2
                              className={`w-4 h-4 mt-0.5 shrink-0 ${
                                unlocked ? 'text-amber-700' : 'text-slate-300'
                              }`}
                              aria-hidden="true"
                            />
                            <div>
                              <p className="text-sm font-semibold text-slate-900">
                                {tier.name}{' '}
                                {isCurrent && (
                                  <span className="text-xs font-normal text-amber-800">
                                    · You are here
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-slate-600 mt-0.5">{tier.perkSummary}</p>
                            </div>
                          </div>
                          <span className="font-mono tabular-nums text-xs text-slate-600 whitespace-nowrap shrink-0">
                            {tier.minMilestones} steps
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Interactive Climb Action */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={handleCompleteMilestone}
                      disabled={milestonesCompleted >= 10}
                      className="flex-1 min-h-[48px] px-5 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <TrendingUp className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>
                        {milestonesCompleted >= 10
                          ? 'Top Tier Unlocked'
                          : 'Complete Next Backup Step (+1)'}
                      </span>
                    </button>
                    {milestonesCompleted > 4 && (
                      <button
                        type="button"
                        onClick={handleReset}
                        className="px-4 py-2.5 min-h-[48px] border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                      >
                        <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Reset</span>
                      </button>
                    )}
                  </div>

                  {/* Guardrail against bottom-of-ladder drop-out */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
                    <span className="inline-flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
                      <span>Personal milestones only—never public bottom-rank shaming</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setHideTierComparison(true)}
                      className="text-slate-600 hover:text-slate-900 underline underline-offset-2 cursor-pointer self-start sm:self-auto"
                    >
                      Hide tier view
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-5 border-t border-slate-200 space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center justify-between gap-4">
                <span>Visibility of growth</span>
                <span className="font-medium text-amber-900">
                  Plain numbers ({milestonesCompleted} / {targetMilestones} steps)
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Path to next level</span>
                <span className="font-medium text-amber-900">
                  Clear next perk &amp; exact gap
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Drop-out guardrail</span>
                <span className="font-medium text-emerald-700">
                  No bottom-of-ladder shaming · Optional hide
                </span>
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* Focused Preview of Status Ladder */
        <section className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 space-y-6">
          <div className="p-5 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-amber-800">{ownerDisplay} · Current Tier</p>
              <h2 className="text-2xl font-bold text-slate-900 mt-0.5">{currentTier.name}</h2>
              <p className="text-xs text-amber-950 mt-1">
                {nextTier
                  ? `${remainingMilestones} more step${remainingMilestones === 1 ? '' : 's'} to unlock ${nextTier.name}`
                  : 'Top tier unlocked'}
              </p>
            </div>
            <div className="bg-white border border-amber-200 rounded-lg px-4 py-2.5 text-right shrink-0">
              <span className="block text-xs text-slate-500">Progress</span>
              <span className="font-mono tabular-nums text-lg font-bold text-amber-900">
                {milestonesCompleted} / {targetMilestones}
              </span>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl divide-y divide-slate-100">
            {TIERS.map((tier) => {
              const unlocked = milestonesCompleted >= tier.minMilestones;
              return (
                <div key={tier.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Check
                      className={`w-4 h-4 shrink-0 ${
                        unlocked ? 'text-amber-700' : 'text-slate-300'
                      }`}
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{tier.name}</p>
                      <p className="text-xs text-slate-500">{tier.perkSummary}</p>
                    </div>
                  </div>
                  <span className="font-mono tabular-nums text-xs text-slate-600">
                    {tier.minMilestones} steps
                  </span>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleCompleteMilestone}
            disabled={milestonesCompleted >= 10}
            className="w-full min-h-[52px] px-5 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
          >
            {milestonesCompleted >= 10
              ? 'Founder Circle Unlocked'
              : 'Complete Next Backup Step (+1)'}
          </button>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <span>Personal milestones only—never penalized at the bottom</span>
            <button
              type="button"
              onClick={() => onChangeMode('side-by-side')}
              className="font-medium text-slate-900 underline underline-offset-4 hover:text-amber-800 cursor-pointer"
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
            How Status Changes the Experience
          </h2>
          <p className="text-sm text-slate-600">
            Replacing a flat membership label with plain-number milestone progress and respectful guardrails.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-medium text-slate-500">
                <th className="py-3 px-6">Element</th>
                <th className="py-3 px-6">Before (Static Label)</th>
                <th className="py-3 px-6">After (Tier Ladder + Guardrail)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              <tr>
                <td className="py-3.5 px-6 font-medium text-slate-900">Progress Feedback</td>
                <td className="py-3.5 px-6 text-slate-600">
                  Generic &ldquo;Standard User&rdquo; text with no goal
                </td>
                <td className="py-3.5 px-6 text-amber-900 font-medium">
                  Plain numbers ({milestonesCompleted} / {targetMilestones} steps) toward next tier
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-slate-900">Reward Clarity</td>
                <td className="py-3.5 px-6 text-slate-600">
                  No preview of higher-tier perks
                </td>
                <td className="py-3.5 px-6 text-slate-800">
                  Concrete unlocks (90-day history, priority recovery, hardware beta)
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-slate-900">Drop-Out Guardrail</td>
                <td className="py-3.5 px-6 text-slate-600">
                  No protection against newcomer discouragement
                </td>
                <td className="py-3.5 px-6 text-slate-800">
                  Personal milestone ladder without public bottom-rank shaming + hide toggle
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
