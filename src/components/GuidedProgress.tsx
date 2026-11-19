import { useState } from 'react';
import type { User } from 'firebase/auth';
import {
  Activity,
  ArrowRight,
  Award,
  BarChart3,
  Check,
  Compass,
  Eye,
  EyeOff,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import type {
  ClosersPreferences,
  DemoPrinciple,
  PortalFeatureUsage,
  PortalTab,
  SignInEvent,
  UserAccount,
} from '../types';

interface GuidedProgressProps {
  user: User;
  profile: UserAccount | null;
  events: SignInEvent[];
  closersPrefs: ClosersPreferences;
  featureUsage: PortalFeatureUsage;
  onChangeTab: (tab: PortalTab) => void;
  onChangePrinciple: (principle: DemoPrinciple) => void;
  onFocusProfileField: (elementId: string) => void;
}

type RoadmapCategory = 'profile' | 'feature';

interface RoadmapMilestone {
  id: string;
  stepNumber: number;
  category: RoadmapCategory;
  categoryLabel: string;
  title: string;
  description: string;
  weightPct: number;
  completed: boolean;
  actionLabel: string;
  onAction: () => void;
}

interface PortalStatusTier {
  name: string;
  minPct: number;
  summary: string;
}

const STATUS_TIERS: PortalStatusTier[] = [
  {
    name: 'New Member',
    minPct: 0,
    summary: 'Google Sign-In active — complete your profile and explore portal tools to advance.',
  },
  {
    name: 'Active Explorer',
    minPct: 35,
    summary: 'Core account setup underway — keep exploring guardrails and insights to reach Trusted Steward.',
  },
  {
    name: 'Trusted Steward',
    minPct: 70,
    summary: 'Strong profile hygiene and portal familiarity — one or two steps left for Portal Champion.',
  },
  {
    name: 'Portal Champion',
    minPct: 100,
    summary: 'All profile and feature milestones completed — full portal status unlocked.',
  },
];

export function GuidedProgress({
  user,
  profile,
  events,
  closersPrefs,
  featureUsage,
  onChangeTab,
  onChangePrinciple,
  onFocusProfileField,
}: GuidedProgressProps) {
  const [collapsed, setCollapsed] = useState(false);

  const profileCustomized =
    featureUsage.savedProfile ||
    Boolean(
      profile?.accountLabel && profile.accountLabel !== 'Personal Account'
    ) ||
    Boolean(
      profile?.updatedAt &&
        profile?.createdAt &&
        typeof profile.updatedAt.toMillis === 'function' &&
        typeof profile.createdAt.toMillis === 'function' &&
        profile.updatedAt.toMillis() > profile.createdAt.toMillis() + 1000
    );

  const guardrailsReviewed =
    featureUsage.reviewedGuardrails ||
    Boolean(profile?.requireStepUpForBilling) ||
    closersPrefs.optedOutOfGroup ||
    closersPrefs.hideTierProgress ||
    !closersPrefs.weeklyReminderOptIn ||
    closersPrefs.reducedMotionCelebration;

  const activityReviewed =
    featureUsage.visitedActivity || events.some((ev) => ev.status === 'ended');

  const milestones: RoadmapMilestone[] = [
    {
      id: 'verified-sso',
      stepNumber: 1,
      category: 'profile',
      categoryLabel: 'Profile Completion',
      title: 'Google Account Verified',
      description: 'Password-free sign-in connected with your verified Google email.',
      weightPct: 15,
      completed: Boolean(user.emailVerified),
      actionLabel: 'Verified',
      onAction: () => onFocusProfileField('profile-display-name'),
    },
    {
      id: 'personalize-profile',
      stepNumber: 2,
      category: 'profile',
      categoryLabel: 'Profile Completion',
      title: 'Save Account Profile',
      description: 'Confirm your display name, account type, and chosen group label.',
      weightPct: 15,
      completed: profileCustomized,
      actionLabel: 'Edit Profile',
      onAction: () => onFocusProfileField('profile-display-name'),
    },
    {
      id: 'review-guardrails',
      stepNumber: 3,
      category: 'profile',
      categoryLabel: 'Profile Completion',
      title: 'Set Privacy Guardrails',
      description: 'Review group sharing consent, 24h trial alerts, and streak reminders.',
      weightPct: 20,
      completed: guardrailsReviewed,
      actionLabel: 'Review Settings',
      onAction: () => onFocusProfileField('profile-chosen-group'),
    },
    {
      id: 'inspect-sessions',
      stepNumber: 4,
      category: 'feature',
      categoryLabel: 'Feature Usage',
      title: 'Check Recent Sign-Ins',
      description: 'Inspect active browser sessions and manage signed-in devices.',
      weightPct: 15,
      completed: activityReviewed,
      actionLabel: 'Open Sign-Ins',
      onAction: () => onChangeTab('activity'),
    },
    {
      id: 'guided-journey',
      stepNumber: 5,
      category: 'feature',
      categoryLabel: 'Feature Usage',
      title: 'Walk the Guided Journey',
      description: 'Experience all 7 CLOSERS triggers in one continuous signup flow.',
      weightPct: 20,
      completed: featureUsage.visitedJourney,
      actionLabel: 'Start Journey',
      onAction: () => onChangePrinciple('journey'),
    },
    {
      id: 'signup-impact',
      stepNumber: 6,
      category: 'feature',
      categoryLabel: 'Feature Usage',
      title: 'Explore Signup Impact',
      description: 'Compare With vs. Without Guardrails in the conversion simulator.',
      weightPct: 15,
      completed: featureUsage.visitedAnalysis,
      actionLabel: 'View Analysis',
      onAction: () => onChangePrinciple('analysis'),
    },
  ];

  const profileScorePct = milestones
    .filter((m) => m.category === 'profile' && m.completed)
    .reduce((sum, m) => sum + m.weightPct, 0);

  const featureScorePct = milestones
    .filter((m) => m.category === 'feature' && m.completed)
    .reduce((sum, m) => sum + m.weightPct, 0);

  const totalScorePct = Math.min(100, profileScorePct + featureScorePct);
  const completedCount = milestones.filter((m) => m.completed).length;

  const currentTier =
    [...STATUS_TIERS].reverse().find((t) => totalScorePct >= t.minPct) ?? STATUS_TIERS[0];
  const nextTier = STATUS_TIERS.find((t) => t.minPct > totalScorePct) ?? null;
  const pctToNextTier = nextTier ? Math.max(0, nextTier.minPct - totalScorePct) : 0;

  const nextMilestone = milestones.find((m) => !m.completed) ?? null;

  const getMilestoneIcon = (id: string) => {
    switch (id) {
      case 'verified-sso':
      case 'personalize-profile':
        return UserCheck;
      case 'review-guardrails':
        return ShieldCheck;
      case 'inspect-sessions':
        return Activity;
      case 'guided-journey':
        return Compass;
      default:
        return BarChart3;
    }
  };

  if (collapsed) {
    return (
      <section
        aria-label="Guided Progress summary"
        className="mt-8 bg-white border border-slate-200 rounded-xl px-6 py-4 flex flex-wrap items-center justify-between gap-4"
      >
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-slate-900">
            <Award className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
            <span className="text-sm font-semibold">Guided Progress</span>
          </div>
          <span className="text-xs text-slate-600 font-mono tabular-nums">
            {currentTier.name} · {totalScorePct}% ({completedCount}/{milestones.length} steps)
          </span>
        </div>
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 underline underline-offset-4 cursor-pointer whitespace-nowrap shrink-0"
        >
          <Eye className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Show roadmap</span>
        </button>
      </section>
    );
  }

  return (
    <section
      aria-label="Guided Progress Roadmap"
      className="mt-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6"
    >
      {/* Top Row: Portal Status Header & Contribution Breakdown */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-1.5">
            <Award className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Guided Progress · Dynamic Onboarding Roadmap</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Portal Status: {currentTier.name}
          </h2>
          <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
            {currentTier.summary}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto shrink-0">
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-right">
            <span className="block text-xs text-slate-500">Overall Status</span>
            <span className="font-mono tabular-nums text-lg font-bold text-slate-900">
              {totalScorePct}%{' '}
              <span className="text-xs font-medium text-slate-500">
                ({completedCount}/{milestones.length})
              </span>
            </span>
          </div>

          <button
            type="button"
            onClick={() => setCollapsed(true)}
            aria-label="Hide guided progress roadmap"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Hide</span>
          </button>
        </div>
      </div>

      {/* Stacked Contribution Meter: Profile Completion + Feature Usage -> Overall Status */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-5">
            <span className="inline-flex items-center gap-2 text-slate-700">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-700 inline-block" aria-hidden="true" />
              <span>
                Profile Completion:{' '}
                <strong className="font-mono tabular-nums text-slate-900">
                  {profileScorePct}%
                </strong>{' '}
                <span className="text-slate-500 font-mono tabular-nums">/ 50%</span>
              </span>
            </span>
            <span className="inline-flex items-center gap-2 text-slate-700">
              <span className="w-2.5 h-2.5 rounded-sm bg-sky-700 inline-block" aria-hidden="true" />
              <span>
                Feature Usage:{' '}
                <strong className="font-mono tabular-nums text-slate-900">
                  {featureScorePct}%
                </strong>{' '}
                <span className="text-slate-500 font-mono tabular-nums">/ 50%</span>
              </span>
            </span>
          </div>

          <span className="font-mono tabular-nums text-slate-600">
            {nextTier
              ? `${pctToNextTier}% more to reach ${nextTier.name}`
              : 'Top portal tier reached'}
          </span>
        </div>

        {/* Stacked Progress Bar */}
        <div
          role="progressbar"
          aria-valuenow={totalScorePct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Overall portal status progress"
          className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex"
        >
          {profileScorePct > 0 && (
            <div
              className="h-full bg-emerald-700 transition-all duration-300"
              style={{ width: `${profileScorePct}%` }}
            />
          )}
          {featureScorePct > 0 && (
            <div
              className="h-full bg-sky-700 transition-all duration-300"
              style={{ width: `${featureScorePct}%` }}
            />
          )}
        </div>

        {/* Tier Threshold Markers */}
        <div className="grid grid-cols-4 gap-2 pt-1 text-[11px] font-mono tabular-nums text-slate-500">
          {STATUS_TIERS.map((tier) => {
            const unlocked = totalScorePct >= tier.minPct;
            const isCurrent = currentTier.name === tier.name;
            return (
              <div
                key={tier.name}
                className={`truncate ${
                  isCurrent
                    ? 'text-slate-900 font-semibold'
                    : unlocked
                      ? 'text-emerald-700'
                      : 'text-slate-400'
                }`}
              >
                {tier.minPct}% · {tier.name}
              </div>
            );
          })}
        </div>
      </div>

      {/* Connected Visual Roadmap Nodes */}
      <div className="relative pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
          {milestones.map((item) => {
            const Icon = getMilestoneIcon(item.id);
            const isNext = nextMilestone?.id === item.id;
            const isProfile = item.category === 'profile';

            return (
              <div
                key={item.id}
                className={`rounded-xl border p-4 flex flex-col justify-between transition-colors ${
                  item.completed
                    ? isProfile
                      ? 'bg-emerald-50/60 border-emerald-200'
                      : 'bg-sky-50/60 border-sky-200'
                    : isNext
                      ? 'bg-white border-slate-900 shadow-sm'
                      : 'bg-slate-50/70 border-slate-200'
                }`}
              >
                <div>
                  {/* Node Step Header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                        item.completed
                          ? isProfile
                            ? 'bg-emerald-700 text-white'
                            : 'bg-sky-700 text-white'
                          : isNext
                            ? 'bg-slate-900 text-white'
                            : 'bg-white border border-slate-300 text-slate-600'
                      }`}
                    >
                      {item.completed ? (
                        <Check className="w-3.5 h-3.5" aria-hidden="true" />
                      ) : (
                        item.stepNumber
                      )}
                    </div>

                    <span
                      className={`text-[11px] font-mono tabular-nums font-semibold ${
                        item.completed
                          ? isProfile
                            ? 'text-emerald-800'
                            : 'text-sky-800'
                          : 'text-slate-500'
                      }`}
                    >
                      +{item.weightPct}%
                    </span>
                  </div>

                  {/* Category + Title */}
                  <p
                    className={`text-[11px] font-medium mb-1 flex items-center gap-1 ${
                      isProfile ? 'text-emerald-800' : 'text-sky-800'
                    }`}
                  >
                    <Icon className="w-3 h-3 shrink-0" aria-hidden="true" />
                    <span>{item.categoryLabel}</span>
                  </p>
                  <h3 className="text-sm font-semibold text-slate-900 leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/70">
                  {item.completed ? (
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium ${
                        isProfile ? 'text-emerald-800' : 'text-sky-800'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>Completed</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={item.onAction}
                      className={`w-full px-3 py-1.5 text-xs font-semibold rounded-lg inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                        isNext
                          ? 'bg-slate-900 hover:bg-slate-800 text-white'
                          : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <span>{item.actionLabel}</span>
                      <ArrowRight className="w-3 h-3 shrink-0" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Next-Step Callout */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
        {nextMilestone ? (
          <>
            <span>
              <strong className="font-semibold text-slate-900">Recommended next step:</strong>{' '}
              {nextMilestone.title} (+{nextMilestone.weightPct}% toward{' '}
              {nextTier ? nextTier.name : 'Portal Champion'})
            </span>
            <button
              type="button"
              onClick={nextMilestone.onAction}
              className="inline-flex items-center gap-1.5 font-semibold text-slate-900 hover:text-emerald-700 underline underline-offset-4 cursor-pointer self-start sm:self-auto whitespace-nowrap shrink-0"
            >
              <span>{nextMilestone.actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </>
        ) : (
          <span className="text-emerald-800 font-medium">
            All 6 profile and feature milestones completed — personal progress only, no public rank pressure.
          </span>
        )}
      </div>
    </section>
  );
}
