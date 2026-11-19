import { useState } from 'react';
import { ArrowRight, Check, ShieldCheck } from 'lucide-react';
import type { DemoPrinciple } from '../types';
import { ClosersNavStrip } from './ClosersNavStrip';

interface AnalysisDashboardProps {
  onOpenPrinciple: (principle: DemoPrinciple) => void;
}

type TriggerKey = Exclude<DemoPrinciple, 'analysis'>;

interface PrincipleComparisonRow {
  id: TriggerKey;
  order: string;
  principle: string;
  evidenceRating: string;
  signupRole: string;
  beforeLabel: string;
  afterLabel: string;
  beforeRatePct: number;
  afterRatePct: number;
  signupLiftPts: number;
  stepsBefore: number;
  stepsAfter: number;
  guardrail: string;
  accentBarClass: string;
}

const PRINCIPLE_ROWS: PrincipleComparisonRow[] = [
  {
    id: 'convenience',
    order: '01',
    principle: 'Convenience',
    evidenceRating: 'Strong',
    signupRole: 'Removes account-creation friction at entry',
    beforeLabel: '5-field form + PIN + CAPTCHA (~45s)',
    afterLabel: '1-click Google Sign-Up / Sign-In (~3s)',
    beforeRatePct: 54,
    afterRatePct: 86,
    signupLiftPts: 9.0,
    stepsBefore: 5,
    stepsAfter: 1,
    guardrail: 'Clear default & 1-click sign out',
    accentBarClass: 'bg-sky-700',
  },
  {
    id: 'loss-avoidance',
    order: '02',
    principle: 'Loss Avoidance',
    evidenceRating: 'Strong in lab, mixed in field',
    signupRole: 'Converts trials before credits & preview files expire',
    beforeLabel: 'Generic "Buy 2 TB for $12/mo" prompt',
    afterLabel: 'Protect 184.6 GB & $25 credit before real deadline',
    beforeRatePct: 18,
    afterRatePct: 34,
    signupLiftPts: 6.5,
    stepsBefore: 4,
    stepsAfter: 1,
    guardrail: '24h reminder, 1-click export, 2-click cancel & refund',
    accentBarClass: 'bg-rose-700',
  },
  {
    id: 'own-identity',
    order: '03',
    principle: 'Own Identity',
    evidenceRating: 'Thin',
    signupRole: 'Anchors signup to a chosen family or team group',
    beforeLabel: 'Anonymous "Individual storage account"',
    afterLabel: 'User-chosen group named on screen + shared streak',
    beforeRatePct: 29,
    afterRatePct: 43,
    signupLiftPts: 3.0,
    stepsBefore: 3,
    stepsAfter: 1,
    guardrail: 'Share status only by consent + 1-click opt-out',
    accentBarClass: 'bg-violet-700',
  },
  {
    id: 'status',
    order: '04',
    principle: 'Status',
    evidenceRating: 'Mixed',
    signupRole: 'Motivates completing onboarding steps toward next tier',
    beforeLabel: 'Flat "Standard User" static label',
    afterLabel: 'Plain-number progress (4 / 5 steps) to Trusted Steward',
    beforeRatePct: 22,
    afterRatePct: 38,
    signupLiftPts: 3.5,
    stepsBefore: 3,
    stepsAfter: 1,
    guardrail: 'Personal milestones only—no bottom-rank shaming',
    accentBarClass: 'bg-amber-700',
  },
  {
    id: 'emotion',
    order: '05',
    principle: 'Emotion',
    evidenceRating: 'Indirect, weaker than gloss',
    signupRole: 'Connects signup to human memories + welcome celebration',
    beforeLabel: 'Cold encryption & storage spec form',
    afterLabel: 'Memory story + accessible reduced-motion celebration',
    beforeRatePct: 24,
    afterRatePct: 35,
    signupLiftPts: 2.5,
    stepsBefore: 3,
    stepsAfter: 1,
    guardrail: 'Respects reduced-motion & avoids guilt-tripping',
    accentBarClass: 'bg-orange-600',
  },
  {
    id: 'recognition',
    order: '06',
    principle: 'Recognition',
    evidenceRating: 'Small, varies with context',
    signupRole: 'Builds signup trust with exact counts & verified reviews',
    beforeLabel: '"Loved by millions!" + unverified 5-star quotes',
    afterLabel: 'Reconciled vault counts + verified tenure reviews',
    beforeRatePct: 21,
    afterRatePct: 36,
    signupLiftPts: 3.0,
    stepsBefore: 3,
    stepsAfter: 1,
    guardrail: 'Counts reconcile to data + review quality filter',
    accentBarClass: 'bg-emerald-700',
  },
  {
    id: 'stickiness',
    order: '07',
    principle: 'Stickiness',
    evidenceRating: 'Moderate',
    signupRole: 'Turns new signups into weekly returning members',
    beforeLabel: 'One-off upload with zero habit follow-up',
    afterLabel: 'Weekly backup streak with Streak Freeze & safe return',
    beforeRatePct: 26,
    afterRatePct: 44,
    signupLiftPts: 3.5,
    stepsBefore: 3,
    stepsAfter: 1,
    guardrail: 'Notification opt-outs + welcoming return after break',
    accentBarClass: 'bg-slate-900',
  },
];

const TRAFFIC_OPTIONS = [2500, 10000, 25000, 50000];
const BASELINE_OVERALL_SIGNUP_RATE = 19.0;

export function AnalysisDashboard({ onOpenPrinciple }: AnalysisDashboardProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | TriggerKey>('all');
  const [monthlyVisitors, setMonthlyVisitors] = useState<number>(10000);
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
  const totalLiftPts = activeRows.reduce((sum, r) => sum + r.signupLiftPts, 0);
  const projectedOverallSignupRate = BASELINE_OVERALL_SIGNUP_RATE + totalLiftPts;

  const totalStepsBefore = PRINCIPLE_ROWS.reduce((sum, r) => sum + r.stepsBefore, 0);
  const totalStepsAfter = PRINCIPLE_ROWS.reduce(
    (sum, r) => sum + (enabledPrinciples[r.id] ? r.stepsAfter : r.stepsBefore),
    0
  );

  const baselineSignups = Math.round((monthlyVisitors * BASELINE_OVERALL_SIGNUP_RATE) / 100);
  const projectedSignups = Math.round((monthlyVisitors * projectedOverallSignupRate) / 100);
  const extraSignupsPerMonth = projectedSignups - baselineSignups;
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
            Full 7-Trigger CLOSERS Audit
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight [text-wrap:balance]">
            Increasing Signups Across Kestrel CloudSync
          </h1>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            How all seven enhancements—<strong className="font-medium text-slate-900">Convenience, Loss Avoidance, Own Identity, Status, Emotion, Recognition, and Stickiness</strong>—work together to lift visitor-to-member signups and retention while protecting user trust.
          </p>
        </div>

        {/* Filter Bar */}
        <div
          role="tablist"
          aria-label="Filter analysis by principle"
          className="inline-flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg self-start lg:self-auto"
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
              onClick={() => setSelectedFilter(row.id)}
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
      </div>

      {/* Top KPI Summary Strip Focused on Signup Objective */}
      <section aria-label="Signup KPI summary" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-xs font-medium text-slate-500">Projected Signup Rate</p>
          <div className="mt-2 flex items-baseline gap-2.5">
            <span className="text-3xl font-bold font-mono tabular-nums text-slate-900">
              {projectedOverallSignupRate.toFixed(1)}%
            </span>
            <span className="text-xs font-mono tabular-nums text-emerald-700 font-medium">
              +{totalLiftPts.toFixed(1)} pts
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Up from {BASELINE_OVERALL_SIGNUP_RATE.toFixed(1)}% legacy baseline
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-xs font-medium text-slate-500">Projected Monthly Signups</p>
          <div className="mt-2 flex items-baseline gap-2.5">
            <span className="text-3xl font-bold font-mono tabular-nums text-slate-900">
              {projectedSignups.toLocaleString()}
            </span>
            <span className="text-xs font-mono tabular-nums text-emerald-700 font-medium">
              +{extraSignupsPerMonth.toLocaleString()} new
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Out of {monthlyVisitors.toLocaleString()} monthly visitors
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
          <p className="text-xs font-medium text-slate-500">Password Resets Avoided / Mo</p>
          <div className="mt-2 flex items-baseline gap-2.5">
            <span className="text-3xl font-bold font-mono tabular-nums text-slate-900">
              {resetTicketsAvoided.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500">
              {enabledPrinciples.convenience ? 'Google SSO on' : 'Google SSO off'}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            7/7 trust guardrails active
          </p>
        </div>
      </section>

      {/* Simulator + Before/After Chart */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8 items-start">
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 sm:p-7 space-y-6">
          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-1">
              Signup Lift Simulator
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Toggle each UX enhancement on or off to see how individual triggers combine toward the signup goal.
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
            Illustrative UX projection for planning; validate final conversion and unsubscribe/complaint rates via A/B tests.
          </p>
        </div>

        {/* Right: Before vs. After Step Completion Bars */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-100">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Before vs. After Step Completion Rate
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                How each redesigned touchpoint removes drop-off along the signup journey
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
              const currentAfterPct = isEnabled ? row.afterRatePct : row.beforeRatePct;
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
                      <span aria-hidden="true" className="text-slate-400">→</span>
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

      {/* Complete 7-Enhancement Audit Table */}
      <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Full Signup Redesign &amp; Guardrail Matrix
            </h2>
            <p className="text-sm text-slate-600">
              Every CLOSERS enhancement implemented, its role in driving signups, and its user-protection guardrail.
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
                    <div className="text-xs text-slate-500 mt-0.5">
                      {row.signupRole}
                    </div>
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
