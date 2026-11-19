import { useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  ShieldCheck,
  ThumbsUp,
} from 'lucide-react';
import type { DemoPrinciple, UnauthViewMode } from '../types';
import { ClosersNavStrip } from './ClosersNavStrip';

interface RecognitionDemoProps {
  mode: UnauthViewMode;
  onChangeMode: (mode: UnauthViewMode) => void;
  onChangePrinciple: (principle: DemoPrinciple) => void;
  userName?: string | null;
}

interface VerifiedReview {
  id: string;
  author: string;
  tenure: string;
  quote: string;
  helpfulCount: number;
}

const INITIAL_REVIEWS: VerifiedReview[] = [
  {
    id: 'r1',
    author: 'Hannah L.',
    tenure: 'Verified 11-month member · 210 GB synced',
    quote: 'Moved our whole family photo archive in one evening without losing folder dates.',
    helpfulCount: 18,
  },
  {
    id: 'r2',
    author: 'Devon K.',
    tenure: 'Verified 6-month member · 94 GB synced',
    quote: 'Signing in with Google took seconds and file export worked cleanly when we tested it.',
    helpfulCount: 12,
  },
];

export function RecognitionDemo({
  mode,
  onChangeMode,
  onChangePrinciple,
  userName,
}: RecognitionDemoProps) {
  const [beforeClicked, setBeforeClicked] = useState(false);
  const [showReconciliation, setShowReconciliation] = useState(true);
  const [joinedCount, setJoinedCount] = useState(false);
  const [helpfulVoted, setHelpfulVoted] = useState<Record<string, boolean>>({});

  // Exact reconciled breakdown: 612 + 489 + 327 (+ 1 if user joins) = total
  const familyVaults = 612;
  const studioPods = 489;
  const soloAccounts = 327 + (joinedCount ? 1 : 0);
  const totalVerifiedAccounts = familyVaults + studioPods + soloAccounts;

  const ownerDisplay = userName?.trim() ? userName.trim() : 'You';

  const toggleHelpful = (id: string) => {
    setHelpfulVoted((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <main id="top" className="max-w-[1320px] mx-auto px-6 py-10 lg:py-12">
      <ClosersNavStrip activePrinciple="recognition" onChangePrinciple={onChangePrinciple} />

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 pb-8 border-b border-slate-200">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold text-emerald-700 mb-2">
            06. Recognition · The Validation Magnet
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight [text-wrap:balance]">
            Social proof backed by counts that actually reconcile
          </h1>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Compare vague marketing claims on the left against transparent, verifiable proof for <strong className="font-medium text-slate-900">Kestrel CloudSync</strong> on the right—where every number adds up and reviews are quality-checked.
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
          aria-label="Before and After Recognition Comparison"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
        >
          {/* BEFORE: Vague Unverified Social Proof */}
          <div className="lg:col-span-6 bg-slate-100/80 border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-2 pb-5 mb-6 border-b border-slate-200">
                <span className="text-sm font-semibold text-slate-900">
                  Before · Vague Vanity Claims
                </span>
                <span className="text-xs text-slate-500">
                  Unverified numbers · Generic quotes
                </span>
              </div>

              <div className="bg-white border border-slate-300 rounded-xl overflow-hidden">
                <div className="bg-slate-800 text-white px-5 py-3.5 flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold tracking-tight">
                    Kestrel CloudSync · Why Join
                  </span>
                  <span className="text-xs text-slate-300">Overview</span>
                </div>

                <div className="p-6 sm:p-7 space-y-5">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">
                      Loved by millions worldwide!
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Join our #1 rated cloud storage platform today. Rated 5 stars everywhere!
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs text-slate-600">
                    <p className="italic">&ldquo;Best app ever!!&rdquo; — Happy User</p>
                    <p className="text-slate-400">No verification · No breakdown of numbers</p>
                  </div>

                  {beforeClicked && (
                    <div
                      role="status"
                      className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed"
                    >
                      Visitors are skeptical of inflated &ldquo;millions of users&rdquo; claims and anonymous 5-star quotes that don&apos;t match real product data.
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setBeforeClicked(true)}
                    className="w-full min-h-[44px] px-4 py-2.5 bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium rounded-md transition-colors cursor-pointer"
                  >
                    Sign Up Now
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-200 space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center justify-between gap-4">
                <span>Number accuracy</span>
                <span className="font-medium text-slate-800">Unverifiable rounding</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Review credibility</span>
                <span className="font-medium text-slate-800">Anonymous, no usage context</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Visitor trust</span>
                <span className="font-medium text-slate-800">Low—reads like ad fluff</span>
              </div>
            </div>
          </div>

          {/* AFTER: Reconciled Counts & Quality-Checked Reviews */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-2 pb-5 mb-6 border-b border-slate-200">
                <span className="text-sm font-semibold text-emerald-800">
                  After · Reconciled Counts + Quality Reviews
                </span>
                <span className="text-xs text-emerald-700 font-medium">
                  Exact data match · Verified usage
                </span>
              </div>

              <div className="space-y-5">
                {/* Exact Reconciled Count Banner */}
                <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-emerald-800">
                        Active CloudSync Vaults Backed Up This Week
                      </p>
                      <p className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
                        {totalVerifiedAccounts.toLocaleString()} verified vaults
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowReconciliation((prev) => !prev)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-900 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-100/60 transition-colors cursor-pointer self-start sm:self-auto shrink-0"
                    >
                      <span>{showReconciliation ? 'Hide breakdown' : 'Verify count'}</span>
                      {showReconciliation ? (
                        <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                      )}
                    </button>
                  </div>

                  {showReconciliation && (
                    <div className="mt-4 pt-4 border-t border-emerald-200/80 grid grid-cols-3 gap-3 text-xs">
                      <div className="bg-white border border-emerald-100 rounded-lg p-2.5">
                        <span className="block text-slate-500">Family Vaults</span>
                        <span className="font-mono tabular-nums font-semibold text-slate-900">
                          {familyVaults.toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-white border border-emerald-100 rounded-lg p-2.5">
                        <span className="block text-slate-500">Studio Pods</span>
                        <span className="font-mono tabular-nums font-semibold text-slate-900">
                          {studioPods.toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-white border border-emerald-100 rounded-lg p-2.5">
                        <span className="block text-slate-500">Solo Vaults</span>
                        <span className="font-mono tabular-nums font-semibold text-slate-900">
                          {soloAccounts.toLocaleString()}
                        </span>
                      </div>
                      <p className="col-span-3 text-emerald-900 font-mono tabular-nums">
                        {familyVaults} + {studioPods} + {soloAccounts} = {totalVerifiedAccounts} (exact match)
                      </p>
                    </div>
                  )}
                </div>

                {/* Quality-Checked Verified Reviews */}
                <div className="border border-slate-200 rounded-xl divide-y divide-slate-100">
                  {INITIAL_REVIEWS.map((review) => {
                    const voted = Boolean(helpfulVoted[review.id]);
                    const count = review.helpfulCount + (voted ? 1 : 0);
                    return (
                      <div key={review.id} className="p-4 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <span className="text-sm font-semibold text-slate-900">
                              {review.author}
                            </span>
                            <span className="block text-xs text-emerald-700">
                              {review.tenure}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleHelpful(review.id)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                              voted
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            <ThumbsUp className="w-3.5 h-3.5" aria-hidden="true" />
                            <span className="font-mono tabular-nums">Helpful ({count})</span>
                          </button>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          &ldquo;{review.quote}&rdquo;
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Signup Action updating reconciled count */}
                {joinedCount ? (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs font-medium text-emerald-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
                      <span>
                        {ownerDisplay} added as vault #{totalVerifiedAccounts.toLocaleString()} — counts reconciled live.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setJoinedCount(false)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 underline underline-offset-2 cursor-pointer shrink-0"
                    >
                      <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Reset</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setJoinedCount(true)}
                    className="w-full min-h-[50px] px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Join {totalVerifiedAccounts.toLocaleString()} Active Vaults · Start Free
                  </button>
                )}

                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
                  <span>Reviews require 30+ days of real backup history; unverified entries are excluded.</span>
                </p>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-200 space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center justify-between gap-4">
                <span>Number accuracy</span>
                <span className="font-medium text-emerald-700">
                  Reconciles across Family + Studio + Solo
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Review credibility</span>
                <span className="font-medium text-emerald-700">
                  Verified member tenure &amp; GB synced
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Guardrail</span>
                <span className="font-medium text-emerald-700">
                  Audit breakdown &amp; quality filter
                </span>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 space-y-6">
          <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-emerald-800">Verified Active Vaults This Week</p>
              <p className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
                {totalVerifiedAccounts.toLocaleString()} vaults
              </p>
              <p className="text-xs text-emerald-900 font-mono tabular-nums mt-1">
                {familyVaults} Family + {studioPods} Studio + {soloAccounts} Solo = {totalVerifiedAccounts}
              </p>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl divide-y divide-slate-100">
            {INITIAL_REVIEWS.map((review) => (
              <div key={review.id} className="p-4 space-y-1">
                <p className="text-sm font-semibold text-slate-900">
                  {review.author} <span className="text-xs font-normal text-emerald-700">· {review.tenure}</span>
                </p>
                <p className="text-xs text-slate-600">&ldquo;{review.quote}&rdquo;</p>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setJoinedCount(true)}
            className="w-full min-h-[50px] px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
          >
            {joinedCount
              ? `Joined as Vault #${totalVerifiedAccounts.toLocaleString()}`
              : `Join ${totalVerifiedAccounts.toLocaleString()} Active Vaults`}
          </button>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Counts match database totals · Verified reviews only</span>
            <button
              type="button"
              onClick={() => onChangeMode('side-by-side')}
              className="font-medium text-slate-900 underline underline-offset-4 cursor-pointer"
            >
              View Before &amp; After
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
