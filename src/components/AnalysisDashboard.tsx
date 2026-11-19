import { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Compass,
  ShieldCheck,
} from 'lucide-react';
import type { DemoPrinciple } from '../types';
import { ClosersNavStrip } from './ClosersNavStrip';

interface AnalysisDashboardProps {
  onOpenPrinciple: (principle: DemoPrinciple) => void;
}

type TriggerKey = Exclude<DemoPrinciple, 'analysis' | 'journey'>;

interface PrincipleComparisonRow {
  id: TriggerKey;
  order: string;
  principle: string;
  evidenceRating: string;
  evidenceNote: string;
  signupRole: string;
  beforeLabel: string;
  afterLabel: string;
  beforeRatePct: number;
  afterRatePct: number;
  signupLiftPts: number;
  noGuardrailGrossBonusPts: number;
  noGuardrailChurnDragPts: number;
  stepsBefore: number;
  stepsAfter: number;
  guardrail: string;
  whyItLiftsSignups: string;
  whyGuardrailMatters: string;
  withoutGuardrailRisk: string;
  accentBarClass: string;
}

const PRINCIPLE_ROWS: PrincipleComparisonRow[] = [
  {
    id: 'convenience',
    order: '01',
    principle: 'Convenience',
    evidenceRating: 'Strong',
    evidenceNote: 'Highest-confidence lever: cutting steps from 5 fields to 1 click reliably lifts completion across desktop and mobile.',
    signupRole: 'Removes account-creation friction at entry',
    beforeLabel: '5-field form + PIN + CAPTCHA (~45s)',
    afterLabel: '1-click Google Sign-Up / Sign-In (~3s)',
    beforeRatePct: 54,
    afterRatePct: 86,
    signupLiftPts: 9.0,
    noGuardrailGrossBonusPts: 0.5,
    noGuardrailChurnDragPts: 2.5,
    stepsBefore: 5,
    stepsAfter: 1,
    guardrail: 'Clear default & 1-click sign out',
    whyItLiftsSignups:
      'Every extra box, password rule, and distorted CAPTCHA forces visitors to stop and hunt for credentials. Replacing five manual steps with Google Sign-In turns signup into a single familiar tap.',
    whyGuardrailMatters:
      'Convenient defaults only stay trustworthy when users clearly see whether a shared device will stay signed in and can sign out or end remote device sessions in one click.',
    withoutGuardrailRisk:
      'Silent auto-login without clear session controls causes shared-device anxiety and account-lockout tickets.',
    accentBarClass: 'bg-sky-700',
  },
  {
    id: 'loss-avoidance',
    order: '02',
    principle: 'Loss Avoidance',
    evidenceRating: 'Strong in lab, mixed in field',
    evidenceNote: 'People weigh losing files or credits they already hold more heavily than gaining abstract new storage, provided the deadline is real.',
    signupRole: 'Converts trials before credits & preview files expire',
    beforeLabel: 'Generic "Buy 2 TB for $12/mo" prompt',
    afterLabel: 'Protect 184.6 GB & $25 credit before real deadline',
    beforeRatePct: 18,
    afterRatePct: 34,
    signupLiftPts: 6.5,
    noGuardrailGrossBonusPts: 2.5,
    noGuardrailChurnDragPts: 7.5,
    stepsBefore: 4,
    stepsAfter: 1,
    guardrail: '24h reminder, 1-click export, 2-click cancel & refund',
    whyItLiftsSignups:
      'Instead of pitching an abstract $12/month upgrade, the page shows the concrete 184.6 GB already backed up and the $25.00 early-member credit expiring on a real date.',
    whyGuardrailMatters:
      'Urgency backfires fast when users feel trapped. A 24-hour pre-expiry email reminder, 1-click ZIP export, and 2-click cancel with a 14-day refund guarantee turn pressure into fair reassurance.',
    withoutGuardrailRisk:
      'Fake countdown timers and hidden cancel flows spike chargebacks, refund requests, and negative word of mouth.',
    accentBarClass: 'bg-rose-700',
  },
  {
    id: 'own-identity',
    order: '03',
    principle: 'Own Identity',
    evidenceRating: 'Thin',
    evidenceNote: 'Works best when the circle is genuinely chosen by the user—never an arbitrary label assigned by marketing.',
    signupRole: 'Anchors signup to a chosen family or team group',
    beforeLabel: 'Anonymous "Individual storage account"',
    afterLabel: 'User-chosen group named on screen + shared streak',
    beforeRatePct: 29,
    afterRatePct: 43,
    signupLiftPts: 3.0,
    noGuardrailGrossBonusPts: 0.5,
    noGuardrailChurnDragPts: 3.5,
    stepsBefore: 3,
    stepsAfter: 1,
    guardrail: 'Share status only by consent + 1-click opt-out',
    whyItLiftsSignups:
      'Backing up files alone feels like an easy-to-postpone chore. Naming the user’s chosen circle—such as Tan Family Vault or Design Studio Pod—shifts the cue from solo maintenance to protecting something "we" share.',
    whyGuardrailMatters:
      'Broadcasting activity to a group without explicit permission feels invasive. Users must choose whether their sync status is visible and be able to switch to private mode in one click.',
    withoutGuardrailRisk:
      'Auto-sharing user activity without consent triggers privacy complaints and immediate group exits.',
    accentBarClass: 'bg-violet-700',
  },
  {
    id: 'status',
    order: '04',
    principle: 'Status',
    evidenceRating: 'Mixed',
    evidenceNote: 'Visible next-tier milestones motivate active users, but public leaderboards discourage newcomers near the bottom.',
    signupRole: 'Motivates completing onboarding steps toward next tier',
    beforeLabel: 'Flat "Standard User" static label',
    afterLabel: 'Plain-number progress (4 / 5 steps) to Trusted Steward',
    beforeRatePct: 22,
    afterRatePct: 38,
    signupLiftPts: 3.5,
    noGuardrailGrossBonusPts: 0.5,
    noGuardrailChurnDragPts: 4.0,
    stepsBefore: 3,
    stepsAfter: 1,
    guardrail: 'Personal milestones only—no bottom-rank shaming',
    whyItLiftsSignups:
      'Replacing a static "Standard User" label with plain numbers (4 / 5 steps to unlock 90-day history in Trusted Steward) shows new members exactly how close they are to tangible perks.',
    whyGuardrailMatters:
      'Public rankings that highlight how far behind a newcomer sits cause early drop-out. Keeping progress personal—plus offering a "Hide tier view" option—keeps motivation constructive.',
    withoutGuardrailRisk:
      'Bottom-of-ladder shaming pushes newly signed-up members to abandon onboarding before completing setup.',
    accentBarClass: 'bg-amber-700',
  },
  {
    id: 'emotion',
    order: '05',
    principle: 'Emotion',
    evidenceRating: 'Indirect, weaker than gloss',
    evidenceNote: 'Evidence for emotional flair alone is modest; quiet human relevance helps, whereas heavy theatrics annoy.',
    signupRole: 'Connects signup to human memories + welcome celebration',
    beforeLabel: 'Cold encryption & storage spec form',
    afterLabel: 'Memory story + accessible reduced-motion celebration',
    beforeRatePct: 24,
    afterRatePct: 35,
    signupLiftPts: 2.5,
    noGuardrailGrossBonusPts: 0.0,
    noGuardrailChurnDragPts: 3.5,
    stepsBefore: 3,
    stepsAfter: 1,
    guardrail: 'Respects reduced-motion & avoids guilt-tripping',
    whyItLiftsSignups:
      'Leads with a relatable, low-key reminder about protecting everyday photos on aging phones instead of cold server jargon, followed by a brief 450ms checkmark reward upon completion.',
    whyGuardrailMatters:
      'Going overboard with full-screen confetti, guilt-laden copy, or aggressive popups damages credibility and excludes motion-sensitive users. A reduced-motion mode keeps the welcome calm.',
    withoutGuardrailRisk:
      'Guilt-tripping and flashy motion overload trigger declines, accessibility complaints, and brand distrust.',
    accentBarClass: 'bg-orange-600',
  },
  {
    id: 'recognition',
    order: '06',
    principle: 'Recognition',
    evidenceRating: 'Small, varies with context',
    evidenceNote: 'Social proof helps undecided visitors only when the numbers hold up to inspection and reviews reflect real use.',
    signupRole: 'Builds signup trust with exact counts & verified reviews',
    beforeLabel: '"Loved by millions!" + unverified 5-star quotes',
    afterLabel: 'Reconciled vault counts + verified tenure reviews',
    beforeRatePct: 21,
    afterRatePct: 36,
    signupLiftPts: 3.0,
    noGuardrailGrossBonusPts: 1.0,
    noGuardrailChurnDragPts: 4.0,
    stepsBefore: 3,
    stepsAfter: 1,
    guardrail: 'Counts reconcile to data + review quality filter',
    whyItLiftsSignups:
      'Vague claims like "Loved by millions!" are easy to dismiss as ad copy. Showing an exact total (1,428 verified vaults) that reconciles across Family + Studio + Solo alongside reviews tied to real tenure builds quiet trust.',
    whyGuardrailMatters:
      'If displayed numbers don’t match product data or if reviews look fabricated, skepticism spikes across the entire signup page. Auditing counts and requiring 30+ days of real backup history protects credibility.',
    withoutGuardrailRisk:
      'Inflated counts and anonymous 5-star quotes erode visitor trust and hurt conversion among careful buyers.',
    accentBarClass: 'bg-emerald-700',
  },
  {
    id: 'stickiness',
    order: '07',
    principle: 'Stickiness',
    evidenceRating: 'Moderate',
    evidenceNote: 'Commitment loops turn one-time trial signups into durable multi-month members—provided breaks don’t punish users.',
    signupRole: 'Turns new signups into weekly returning members',
    beforeLabel: 'One-off upload with zero habit follow-up',
    afterLabel: 'Weekly backup streak with Streak Freeze & safe return',
    beforeRatePct: 26,
    afterRatePct: 44,
    signupLiftPts: 3.5,
    noGuardrailGrossBonusPts: 0.5,
    noGuardrailChurnDragPts: 5.0,
    stepsBefore: 3,
    stepsAfter: 1,
    guardrail: 'Notification opt-outs + welcoming return after break',
    whyItLiftsSignups:
      'Signups only pay off if new members build a lasting rhythm. Framing backups as a gentle weekly habit with visible continuity keeps people engaged well past week one.',
    whyGuardrailMatters:
      'Strict streaks that reset to zero after one missed week or bombard users with non-stop emails cause resentment and churn. Streak Freezes, a welcoming return after a break, and 1-click reminder opt-outs keep commitment sustainable.',
    withoutGuardrailRisk:
      'Nagging notifications and punishing streak resets drive email unsubscribes and permanent account abandonment.',
    accentBarClass: 'bg-slate-900',
  },
];

const TRAFFIC_OPTIONS = [2500, 10000, 25000, 50000];
const BASELINE_OVERALL_SIGNUP_RATE = 19.0;

export function AnalysisDashboard({ onOpenPrinciple }: AnalysisDashboardProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | TriggerKey>('all');
  const [monthlyVisitors, setMonthlyVisitors] = useState<number>(10000);
  const [guardrailsEnabled, setGuardrailsEnabled] = useState<boolean>(true);
  const [expandedExplanationId, setExpandedExplanationId] = useState<TriggerKey | null>('convenience');
  const [enabledPrinciples, setEnabledPrinciples] = useState<Record<TriggerKey, boolean>>({
    convenience: true,
    'loss-avoidance': true,
    'own-identity': true,
    status: true,
    emotion: true,
    recognition: true,
    stickiness: true,
  });

  const togglePrinciple = (id: TriggerKey) => {
    setEnabledPrinciples((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const visibleRows =
    selectedFilter === 'all'
      ? PRINCIPLE_ROWS
      : PRINCIPLE_ROWS.filter((r) => r.id === selectedFilter);

  const activeRows = PRINCIPLE_ROWS.filter((r) => enabledPrinciples[r.id]);
  const baseLiftPts = activeRows.reduce((sum, r) => sum + r.signupLiftPts, 0);
  const darkPatternGrossBonusPts = activeRows.reduce(
    (sum, r) => sum + r.noGuardrailGrossBonusPts,
    0
  );
  const earlyChurnDragPts = guardrailsEnabled
    ? 0
    : activeRows.reduce((sum, r) => sum + r.noGuardrailChurnDragPts, 0);

  const grossSignupRate =
    BASELINE_OVERALL_SIGNUP_RATE +
    baseLiftPts +
    (guardrailsEnabled ? 0 : darkPatternGrossBonusPts);
  const netRetainedSignupRate = Math.max(
    BASELINE_OVERALL_SIGNUP_RATE,
    grossSignupRate - earlyChurnDragPts
  );

  const totalStepsBefore = PRINCIPLE_ROWS.reduce((sum, r) => sum + r.stepsBefore, 0);
  const totalStepsAfter = PRINCIPLE_ROWS.reduce(
    (sum, r) => sum + (enabledPrinciples[r.id] ? r.stepsAfter : r.stepsBefore),
    0
  );

  const baselineSignups = Math.round((monthlyVisitors * BASELINE_OVERALL_SIGNUP_RATE) / 100);
  const projectedGrossSignups = Math.round((monthlyVisitors * grossSignupRate) / 100);
  const projectedNetSignups = Math.round((monthlyVisitors * netRetainedSignupRate) / 100);
  const churnedOrRefundedSignups = projectedGrossSignups - projectedNetSignups;
  const extraNetSignupsPerMonth = projectedNetSignups - baselineSignups;

  const resetTicketsAvoided = enabledPrinciples.convenience
    ? Math.round(monthlyVisitors * 0.08)
    : 0;

  return (
    <main id="top" className="max-w-[1320px] mx-auto px-6 py-10 lg:py-12">
      <ClosersNavStrip activePrinciple="analysis" onChangePrinciple={onOpenPrinciple} />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 pb-8 border-b border-slate-200">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold text-emerald-700 mb-2">
            Full 7-Trigger CLOSERS Audit · Kestrel CloudSync
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight [text-wrap:balance]">
            Increasing Signups Without Eroding User Trust
          </h1>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            How all seven enhancements—<strong className="font-medium text-slate-900">Convenience, Loss Avoidance, Own Identity, Status, Emotion, Recognition, and Stickiness</strong>—lift visitor-to-member signups, why each trigger works, and what happens if guardrails are skipped.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto shrink-0">
          <button
            type="button"
            onClick={() => onOpenPrinciple('journey')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Compass className="w-4 h-4" aria-hidden="true" />
            <span>Walk Through Guided Journey</span>
          </button>
        </div>
      </div>

      {/* Filter Bar + Guardrail Mode Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div
          role="tablist"
          aria-label="Filter analysis by principle"
          className="inline-flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg self-start"
        >
          <button
            type="button"
            role="tab"
            aria-selected={selectedFilter === 'all'}
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All (7)
          </button>
          {PRINCIPLE_ROWS.map((row) => (
            <button
              key={row.id}
              type="button"
              role="tab"
              aria-selected={selectedFilter === row.id}
              onClick={() => {
                setSelectedFilter(row.id);
                setExpandedExplanationId(row.id);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedFilter === row.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {row.principle}
            </button>
          ))}
        </div>

        <div
          role="tablist"
          aria-label="Compare with vs. without trust guardrails"
          className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start lg:self-auto shrink-0"
        >
          <button
            type="button"
            role="tab"
            aria-selected={guardrailsEnabled}
            onClick={() => setGuardrailsEnabled(true)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              guardrailsEnabled
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
            <span>With Guardrails</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={!guardrailsEnabled}
            onClick={() => setGuardrailsEnabled(false)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              !guardrailsEnabled
                ? 'bg-white text-rose-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Without Guardrails</span>
          </button>
        </div>
      </div>

      {/* Warning Callout When Without Guardrails Is Selected */}
      {!guardrailsEnabled && (
        <div
          role="status"
          className="mb-8 p-5 rounded-xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="space-y-1">
            <p className="text-sm font-semibold text-rose-950">
              Without guardrails, short-term clicks rise—but net retained members drop
            </p>
            <p className="text-xs text-rose-800 leading-relaxed">
              Removing cancellation clarity, consent opt-outs, reduced-motion accessibility, count reconciliation, and streak freezes causes an estimated{' '}
              <strong className="font-mono tabular-nums">
                -{earlyChurnDragPts.toFixed(1)} pts
              </strong>{' '}
              in early refunds, unsubscribes, and abandoned accounts ({churnedOrRefundedSignups.toLocaleString()} lost members/mo).
            </p>
          </div>
          <button
            type="button"
            onClick={() => setGuardrailsEnabled(true)}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-rose-800 hover:bg-rose-900 rounded-lg whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-auto"
          >
            Restore All Guardrails
          </button>
        </div>
      )}

      {/* Top KPI Summary Strip */}
      <section aria-label="Signup KPI summary" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-xs font-medium text-slate-500">
            {guardrailsEnabled ? 'Net Retained Signup Rate' : 'Net Rate After Early Churn'}
          </p>
          <div className="mt-2 flex items-baseline gap-2.5">
            <span className="text-3xl font-bold font-mono tabular-nums text-slate-900">
              {netRetainedSignupRate.toFixed(1)}%
            </span>
            <span
              className={`text-xs font-mono tabular-nums font-medium ${
                guardrailsEnabled ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {guardrailsEnabled
                ? `+${(netRetainedSignupRate - BASELINE_OVERALL_SIGNUP_RATE).toFixed(1)} pts`
                : `${grossSignupRate.toFixed(1)}% gross (-${earlyChurnDragPts.toFixed(1)} churn)`}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Up from {BASELINE_OVERALL_SIGNUP_RATE.toFixed(1)}% legacy baseline
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-xs font-medium text-slate-500">Net Retained Signups / Mo</p>
          <div className="mt-2 flex items-baseline gap-2.5">
            <span className="text-3xl font-bold font-mono tabular-nums text-slate-900">
              {projectedNetSignups.toLocaleString()}
            </span>
            <span
              className={`text-xs font-mono tabular-nums font-medium ${
                guardrailsEnabled ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              +{extraNetSignupsPerMonth.toLocaleString()} net
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {guardrailsEnabled
              ? `Out of ${monthlyVisitors.toLocaleString()} monthly visitors`
              : `${churnedOrRefundedSignups.toLocaleString()} signups lost to refunds/opt-outs`}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-xs font-medium text-slate-500">Steps Across 7 Touchpoints</p>
          <div className="mt-2 flex items-baseline gap-2.5">
            <span className="text-3xl font-bold font-mono tabular-nums text-slate-900">
              {totalStepsAfter}
            </span>
            <span className="text-xs font-mono tabular-nums text-emerald-700 font-medium">
              down from {totalStepsBefore}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {activeRows.length} of 7 enhancements active
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-xs font-medium text-slate-500">Trust &amp; Support Impact</p>
          <div className="mt-2 flex items-baseline gap-2.5">
            <span className="text-3xl font-bold font-mono tabular-nums text-slate-900">
              {resetTicketsAvoided.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500">resets avoided / mo</span>
          </div>
          <p className={`mt-2 text-xs font-medium ${guardrailsEnabled ? 'text-emerald-700' : 'text-rose-700'}`}>
            {guardrailsEnabled
              ? '7/7 trust guardrails protecting retention'
              : 'Guardrails disabled — elevated complaint risk'}
          </p>
        </div>
      </section>

      {/* Simulator + Before/After Chart */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 items-start">
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 sm:p-7 space-y-6">
          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-1">
              Signup Lift Simulator
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Toggle individual triggers or switch between With vs. Without Guardrails to see how sustainable growth is built.
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-700 mb-2">Monthly Portal Visitors</p>
            <div className="grid grid-cols-4 gap-2">
              {TRAFFIC_OPTIONS.map((vol) => (
                <button
                  key={vol}
                  type="button"
                  onClick={() => setMonthlyVisitors(vol)}
                  className={`py-2 px-2 text-xs font-mono tabular-nums rounded-lg border transition-colors cursor-pointer ${
                    monthlyVisitors === vol
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {vol >= 1000 ? `${vol / 1000}k` : vol}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <p className="text-xs font-medium text-slate-700">Enabled Enhancements</p>
            {PRINCIPLE_ROWS.map((row) => (
              <label
                key={row.id}
                className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer select-none"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <input
                    type="checkbox"
                    checked={enabledPrinciples[row.id]}
                    onChange={() => togglePrinciple(row.id)}
                    className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                  />
                  <div className="min-w-0">
                    <span className="block text-sm font-medium text-slate-900 truncate">
                      {row.order}. {row.principle}
                    </span>
                    <span className="block text-xs text-slate-500 truncate">
                      {row.signupRole}
                    </span>
                  </div>
                </div>
                <span className="font-mono tabular-nums text-xs text-emerald-700 font-medium shrink-0">
                  +{row.signupLiftPts.toFixed(1)} pts
                </span>
              </label>
            ))}
          </div>

          <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">
            Illustrative UX planning model combining all 7 CLOSERS triggers; validate final conversion and refund/opt-out rates via live A/B tests.
          </p>
        </div>

        {/* Right: Before vs. After Step Completion Bars */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-100">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Before vs. After Touchpoint Completion Rate
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                How each redesigned step removes drop-off—and why trust guardrails keep gains durable
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-300 inline-block" aria-hidden="true" />
                Before
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-900 inline-block" aria-hidden="true" />
                After (Enabled)
              </span>
            </div>
          </div>

          <div className="space-y-5">
            {visibleRows.map((row) => {
              const isEnabled = enabledPrinciples[row.id];
              const currentAfterPct = isEnabled
                ? Math.max(
                    row.beforeRatePct,
                    row.afterRatePct - (guardrailsEnabled ? 0 : Math.round(row.noGuardrailChurnDragPts))
                  )
                : row.beforeRatePct;
              const deltaPct = currentAfterPct - row.beforeRatePct;

              return (
                <div key={row.id} className="space-y-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-semibold text-slate-900">
                        {row.order}. {row.principle}
                      </span>
                      <span className="text-xs text-slate-500">· {row.evidenceRating}</span>
                    </div>
                    <div className="flex items-baseline gap-2 font-mono tabular-nums text-xs">
                      <span className="text-slate-500">{row.beforeRatePct}%</span>
                      <span aria-hidden="true" className="text-slate-400">
                        →
                      </span>
                      <span className="font-semibold text-slate-900">{currentAfterPct}%</span>
                      {deltaPct > 0 && (
                        <span className="text-emerald-700 font-medium">(+{deltaPct} pts)</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-300 rounded-full transition-all duration-300"
                        style={{ width: `${row.beforeRatePct}%` }}
                      />
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isEnabled ? row.accentBarClass : 'bg-slate-300'
                        }`}
                        style={{ width: `${currentAfterPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Rich Explanations Section: How Each Principle & Guardrail Works */}
      <section className="mb-10 bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Detailed Explanations: Why Each Trigger Lifts Signups &amp; Why Guardrails Matter
            </h2>
            <p className="text-sm text-slate-600">
              Select any trigger below to read the customer psychology behind the change, its evidence strength, and the risk when guardrails are missing.
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {visibleRows.map((row) => {
            const isExpanded =
              selectedFilter !== 'all' || expandedExplanationId === row.id;

            return (
              <div key={row.id} className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedExplanationId((prev) => (prev === row.id ? null : row.id))
                    }
                    className="flex items-center gap-3 text-left cursor-pointer group"
                  >
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${row.accentBarClass}`} aria-hidden="true" />
                    <div>
                      <span className="text-sm font-bold text-slate-900 group-hover:underline">
                        {row.order}. {row.principle}
                      </span>
                      <span className="ml-2 text-xs text-slate-500">
                        · Evidence: {row.evidenceRating}
                      </span>
                      <p className="text-xs text-slate-600 mt-0.5">{row.signupRole}</p>
                    </div>
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onOpenPrinciple(row.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                    >
                      <span>Open Demo</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    {selectedFilter === 'all' && (
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedExplanationId((prev) => (prev === row.id ? null : row.id))
                        }
                        aria-label={isExpanded ? 'Collapse explanation' : 'Expand explanation'}
                        className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md cursor-pointer"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" aria-hidden="true" />
                        ) : (
                          <ChevronDown className="w-4 h-4" aria-hidden="true" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <p className="text-xs font-semibold text-slate-900">
                        Why it lifts signups
                      </p>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {row.whyItLiftsSignups}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                      <p className="text-xs font-semibold text-emerald-950">
                        Why the guardrail matters
                      </p>
                      <p className="text-xs text-emerald-900 leading-relaxed">
                        {row.whyGuardrailMatters}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 space-y-1.5">
                      <p className="text-xs font-semibold text-rose-950">
                        What breaks without it &amp; evidence note
                      </p>
                      <p className="text-xs text-rose-900 leading-relaxed">
                        {row.withoutGuardrailRisk}
                      </p>
                      <p className="text-xs text-slate-600 pt-1 border-t border-rose-200/70">
                        <strong className="font-medium text-slate-800">Evidence:</strong>{' '}
                        {row.evidenceNote}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Complete 7-Enhancement Audit Table */}
      <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Full Signup Redesign &amp; Guardrail Matrix
            </h2>
            <p className="text-sm text-slate-600">
              Side-by-side summary of all 7 CLOSERS touchpoints, step reduction, and user-protection guardrails.
            </p>
          </div>
          <span className="text-xs font-mono tabular-nums text-slate-500">
            {visibleRows.length} of 7 flows
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-medium text-slate-500">
                <th className="py-3 px-5">Enhancement</th>
                <th className="py-3 px-5">Before (Original)</th>
                <th className="py-3 px-5">After (Improved)</th>
                <th className="py-3 px-5 text-right">Steps</th>
                <th className="py-3 px-5">Guardrail</th>
                <th className="py-3 px-5 text-right">Live Demo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {visibleRows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-5 align-top">
                    <div className="font-semibold text-slate-900">
                      {row.order}. {row.principle}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{row.signupRole}</div>
                  </td>
                  <td className="py-4 px-5 align-top text-xs text-slate-600 max-w-[210px]">
                    {row.beforeLabel}
                  </td>
                  <td className="py-4 px-5 align-top text-xs text-slate-900 font-medium max-w-[220px]">
                    <span className="inline-flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{row.afterLabel}</span>
                    </span>
                  </td>
                  <td className="py-4 px-5 align-top text-right font-mono tabular-nums text-xs text-slate-800 whitespace-nowrap">
                    {row.stepsBefore} → {row.stepsAfter}
                  </td>
                  <td className="py-4 px-5 align-top text-xs text-slate-700 max-w-[210px]">
                    <span className="inline-flex items-start gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{row.guardrail}</span>
                    </span>
                  </td>
                  <td className="py-4 px-5 align-top text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onOpenPrinciple(row.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                    >
                      <span>Open</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
