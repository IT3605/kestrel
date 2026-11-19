import { useState } from 'react';
import { ArrowRight, Check, ShieldCheck } from 'lucide-react';
import type { DemoPrinciple } from '../types';

interface AnalysisDashboardProps {
  onOpenPrinciple: (principle: DemoPrinciple) => void;
}

interface PrincipleComparisonRow {
  id: Exclude<DemoPrinciple, 'analysis'>;
  order: string;
  principle: string;
  evidenceRating: string;
  productSurface: string;
  beforeLabel: string;
  afterLabel: string;
  beforeRatePct: number;
  afterRatePct: number;
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
    productSurface: 'Kestrel Portal Sign-In',
    beforeLabel: '5-field form + PIN + CAPTCHA (~45s)',
    afterLabel: '1-click Google Sign-In (~3s)',
    beforeRatePct: 54,
    afterRatePct: 86,
    stepsBefore: 5,
    stepsAfter: 1,
    guardrail: 'Easy default change & 1-click sign out',
    accentBarClass: 'bg-emerald-700',
  },
  {
    id: 'loss-avoidance',
    order: '02',
    principle: 'Loss Avoidance',
    evidenceRating: 'Strong in lab, mixed in field',
    productSurface: 'CloudSync Pro Renewal',
    beforeLabel: 'Generic "Buy 2 TB for $12/mo" prompt',
    afterLabel: 'Protect 184.6 GB & $25 credit before real deadline',
    beforeRatePct: 18,
    afterRatePct: 34,
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
    productSurface: 'Shared Backup Vault',
    beforeLabel: 'Anonymous "Weekly solo backup due"',
    afterLabel: 'User-chosen group named on screen + streak',
    beforeRatePct: 29,
    afterRatePct: 43,
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
    productSurface: 'Membership Tier Ladder',
    beforeLabel: 'Flat "Standard User" static label',
    afterLabel: 'Plain-number progress (4 / 5 steps) to Trusted Steward',
    beforeRatePct: 22,
    afterRatePct: 38,
    stepsBefore: 3,
    stepsAfter: 1,
    guardrail: 'Personal milestones only—no bottom-rank shaming',
    accentBarClass: 'bg-amber-700',
  },
];

const TRAFFIC_OPTIONS = [2500, 10000, 25000, 50000];

export function AnalysisDashboard({ onOpenPrinciple }: AnalysisDashboardProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | Exclude<DemoPrinciple, 'analysis'>>('all');
  const [monthlyVisitors, setMonthlyVisitors] = useState<number>(10000);
  const [enabledPrinciples, setEnabledPrinciples] = useState<
    Record<Exclude<DemoPrinciple, 'analysis'>, boolean>
  >({
    convenience: true,
    'loss-avoidance': true,
    'own-identity': true,
    status: true,
  });

  const togglePrinciple = (id: Exclude<DemoPrinciple, 'analysis'>) => {
    setEnabledPrinciples((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const visibleRows =
    selectedFilter === 'all'
      ? PRINCIPLE_ROWS
      : PRINCIPLE_ROWS.filter((r) => r.id === selectedFilter);

  const activeCount = Object.values(enabledPrinciples).filter(Boolean).length;

  // Compute modeled flow metrics across enabled changes
  const activeRows = PRINCIPLE_ROWS.filter((r) => enabledPrinciples[r.id]);
  const avgBeforeRate =
    PRINCIPLE_ROWS.reduce((sum, r) => sum + r.beforeRatePct, 0) / PRINCIPLE_ROWS.length;

  const avgAfterRate =
    PRINCIPLE_ROWS.reduce(
      (sum, r) => sum + (enabledPrinciples[r.id] ? r.afterRatePct : r.beforeRatePct),
      0
    ) / PRINCIPLE_ROWS.length;

  const totalStepsBefore = PRINCIPLE_ROWS.reduce((sum, r) => sum + r.stepsBefore, 0);
  const totalStepsAfter = PRINCIPLE_ROWS.reduce(
    (sum, r) => sum + (enabledPrinciples[r.id] ? r.stepsAfter : r.stepsBefore),
    0
  );

  const baselineCompleted = Math.round((monthlyVisitors * avgBeforeRate) / 100);
  const projectedCompleted = Math.round((monthlyVisitors * avgAfterRate) / 100);
  const netLiftCompleted = projectedCompleted - baselineCompleted;
  const resetTicketsAvoided = enabledPrinciples.convenience
    ? Math.round(monthlyVisitors * 0.08)
    : 0;

  return (
    <main id="top" className="max-w-[1320px] mx-auto px-6 py-10 lg:py-12">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 pb-8 border-b border-slate-200">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 mb-3">
            <button
              type="button"
              onClick={() => onOpenPrinciple('convenience')}
              className="hover:text-slate-900 underline underline-offset-4 cursor-pointer"
            >
              01. Convenience
            </button>
            <span aria-hidden="true">/</span>
            <button
              type="button"
              onClick={() => onOpenPrinciple('loss-avoidance')}
              className="hover:text-slate-900 underline underline-offset-4 cursor-pointer"
            >
              02. Loss Avoidance
            </button>
            <span aria-hidden="true">/</span>
            <button
              type="button"
              onClick={() => onOpenPrinciple('own-identity')}
              className="hover:text-slate-900 underline underline-offset-4 cursor-pointer"
            >
              03. Own Identity
            </button>
            <span aria-hidden="true">/</span>
            <button
              type="button"
              onClick={() => onOpenPrinciple('status')}
              className="hover:text-slate-900 underline underline-offset-4 cursor-pointer"
            >
              04. Status
            </button>
            <span aria-hidden="true">/</span>
            <span className="text-slate-900 font-semibold">Impact Analysis</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight [text-wrap:balance]">
            Before &amp; After UX Impact Analysis
          </h1>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            A side-by-side operational summary of the four improvements applied to <strong className="font-medium text-slate-900">Kestrel Portal &amp; CloudSync Pro</strong>—showing step reductions, modeled completion lift, and ethical guardrails.
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
            All (4)
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

      {/* Top KPI Summary Strip (Single Elevation, Tabular Numerals) */}
      <section aria-label="Summary metrics" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-xs font-medium text-slate-500">Total User Steps (4 Flows)</p>
          <div className="mt-2 flex items-baseline gap-2.5">
            <span className="text-3xl font-bold font-mono tabular-nums text-slate-900">
              {totalStepsAfter}
            </span>
            <span className="text-xs font-mono tabular-nums text-emerald-700 font-medium">
              down from {totalStepsBefore}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {activeCount} of 4 improvements active
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-xs font-medium text-slate-500">Modeled Avg. Completion</p>
          <div className="mt-2 flex items-baseline gap-2.5">
            <span className="text-3xl font-bold font-mono tabular-nums text-slate-900">
              {avgAfterRate.toFixed(1)}%
            </span>
            <span className="text-xs font-mono tabular-nums text-emerald-700 font-medium">
              +{Math.max(0, avgAfterRate - avgBeforeRate).toFixed(1)} pts
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Baseline was {avgBeforeRate.toFixed(1)}%
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-xs font-medium text-slate-500">Monthly Completed Journeys</p>
          <div className="mt-2 flex items-baseline gap-2.5">
            <span className="text-3xl font-bold font-mono tabular-nums text-slate-900">
              {projectedCompleted.toLocaleString()}
            </span>
            <span className="text-xs font-mono tabular-nums text-emerald-700 font-medium">
              +{netLiftCompleted.toLocaleString()}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Out of {monthlyVisitors.toLocaleString()} visitors
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
            4/4 guardrails active
          </p>
        </div>
      </section>

      {/* Interactive Scenario Modeling + Before/After Bar Comparison */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8 items-start">
        {/* Left: Interactive Controls */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 sm:p-7 space-y-6">
          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-1">
              Interactive Impact Simulator
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Toggle individual improvements on or off and adjust monthly traffic to see the projected impact.
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

          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <p className="text-xs font-medium text-slate-700">Enabled UX Changes</p>
            {PRINCIPLE_ROWS.map((row) => (
              <label
                key={row.id}
                className="flex items-center justify-between gap-3 p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer select-none"
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
                      {row.productSurface}
                    </span>
                  </div>
                </div>
                <span className="font-mono tabular-nums text-xs text-slate-600 shrink-0">
                  {row.stepsBefore} → {row.stepsAfter} step
                </span>
              </label>
            ))}
          </div>

          <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">
            Illustrative UX model for demo planning—real conversion should be validated via A/B testing with the guardrails monitored.
          </p>
        </div>

        {/* Right: Before vs. After Completion Rate Comparison Chart */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-100">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Before vs. After Completion by Trigger
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Comparing legacy baseline flows against the redesigned screens
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

          <div className="space-y-6">
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
                      <span className="text-xs text-slate-500">· {row.productSurface}</span>
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

                  {/* Dual Horizontal Bar */}
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

      {/* Full Change Breakdown & Guardrail Audit Table */}
      <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Complete Redesign &amp; Guardrail Audit
            </h2>
            <p className="text-sm text-slate-600">
              Review every front-end change, evidence strength, and user-protection guardrail—or jump directly into any screen.
            </p>
          </div>
          <span className="text-xs font-mono tabular-nums text-slate-500">
            {visibleRows.length} {visibleRows.length === 1 ? 'flow' : 'flows'} shown
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-medium text-slate-500">
                <th className="py-3 px-5">Principle</th>
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
                      {row.productSurface} · {row.evidenceRating}
                    </div>
                  </td>
                  <td className="py-4 px-5 align-top text-xs text-slate-600 max-w-[220px]">
                    {row.beforeLabel}
                  </td>
                  <td className="py-4 px-5 align-top text-xs text-slate-900 font-medium max-w-[230px]">
                    <span className="inline-flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{row.afterLabel}</span>
                    </span>
                  </td>
                  <td className="py-4 px-5 align-top text-right font-mono tabular-nums text-xs text-slate-800 whitespace-nowrap">
                    {row.stepsBefore} → {row.stepsAfter}
                  </td>
                  <td className="py-4 px-5 align-top text-xs text-slate-700 max-w-[220px]">
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

      {activeRows.length === 0 && (
        <p className="mt-4 text-xs text-slate-500">
          Enable at least one UX change in the simulator above to preview projected lift.
        </p>
      )}
    </main>
  );
}
