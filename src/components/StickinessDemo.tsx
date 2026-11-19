import { useState } from 'react';
import {
  BellOff,
  CheckCircle2,
  Flame,
  PauseCircle,
  RotateCcw,
  ShieldCheck,
  Snowflake,
} from 'lucide-react';
import type { DemoPrinciple, UnauthViewMode } from '../types';
import { ClosersNavStrip } from './ClosersNavStrip';

interface StickinessDemoProps {
  mode: UnauthViewMode;
  onChangeMode: (mode: UnauthViewMode) => void;
  onChangePrinciple: (principle: DemoPrinciple) => void;
  userName?: string | null;
}

export function StickinessDemo({
  mode,
  onChangeMode,
  onChangePrinciple,
  userName,
}: StickinessDemoProps) {
  const [beforeSkipped, setBeforeSkipped] = useState(false);
  const [streakWeeks, setStreakWeeks] = useState(5);
  const [freezesRemaining, setFreezesRemaining] = useState(2);
  const [streakStatus, setStreakStatus] = useState<'active' | 'frozen' | 'returned'>('active');
  const [weeklyReminderOptIn, setWeeklyReminderOptIn] = useState(true);

  const ownerDisplay = userName?.trim() ? userName.trim() : 'Your Vault';

  const handleSyncWeek = () => {
    setStreakWeeks((prev) => prev + 1);
    setStreakStatus('active');
  };

  const handleUseFreeze = () => {
    if (freezesRemaining > 0) {
      setFreezesRemaining((prev) => prev - 1);
      setStreakStatus('frozen');
    }
  };

  const handleReturnAfterBreak = () => {
    setStreakStatus('returned');
  };

  const handleReset = () => {
    setStreakWeeks(5);
    setFreezesRemaining(2);
    setStreakStatus('active');
    setWeeklyReminderOptIn(true);
  };

  return (
    <main id="top" className="max-w-[1320px] mx-auto px-6 py-10 lg:py-12">
      <ClosersNavStrip activePrinciple="stickiness" onChangePrinciple={onChangePrinciple} />

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 pb-8 border-b border-slate-200">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold text-slate-900 mb-2">
            07. Stickiness · Hooked by Commitment
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight [text-wrap:balance]">
            Keep new signups coming back with a streak that forgives breaks
          </h1>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Compare a one-off manual schedule on the left against a committed weekly backup streak for <strong className="font-medium text-slate-900">Kestrel CloudSync</strong> on the right—protected by streak freezes, a calm return after a break, and notification opt-outs.
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
          aria-label="Before and After Stickiness Comparison"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
        >
          {/* BEFORE: One-Off Upload With Zero Habit Loop */}
          <div className="lg:col-span-6 bg-slate-100/80 border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-2 pb-5 mb-6 border-b border-slate-200">
                <span className="text-sm font-semibold text-slate-900">
                  Before · One-Off Manual Upload
                </span>
                <span className="text-xs text-slate-500">
                  No commitment · Easy to abandon
                </span>
              </div>

              <div className="bg-white border border-slate-300 rounded-xl overflow-hidden">
                <div className="bg-slate-800 text-white px-5 py-3.5 flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold tracking-tight">
                    Kestrel CloudSync · Upload Complete
                  </span>
                  <span className="text-xs text-slate-300">Done</span>
                </div>

                <div className="p-6 sm:p-7 space-y-5">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">
                      First upload finished
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Your files are stored. Come back whenever you remember to upload more.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs text-slate-600">
                    <div className="flex items-center justify-between gap-4">
                      <span>Backup rhythm</span>
                      <span className="text-slate-800">Unscheduled</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span>Missed-week recovery</span>
                      <span className="text-slate-500">Not supported</span>
                    </div>
                  </div>

                  {beforeSkipped && (
                    <div
                      role="status"
                      className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed"
                    >
                      Without a gentle commitment loop after signup, most new users upload once and forget to return.
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setBeforeSkipped(true)}
                    className="w-full min-h-[44px] px-4 py-2.5 bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium rounded-md transition-colors cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-200 space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center justify-between gap-4">
                <span>Post-signup habit</span>
                <span className="font-medium text-slate-800">None—one-time visit</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>If user goes on holiday</span>
                <span className="font-medium text-slate-800">Simply stops coming back</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Notification control</span>
                <span className="font-medium text-slate-800">All-or-nothing</span>
              </div>
            </div>
          </div>

          {/* AFTER: Streak with a Freeze + Notification Opt-Outs + Return After a Break */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-2 pb-5 mb-6 border-b border-slate-200">
                <span className="text-sm font-semibold text-slate-900">
                  After · Streak with Freeze &amp; Safe Return
                </span>
                <span className="text-xs text-slate-600 font-medium">
                  Commitment loop · Opt-out friendly
                </span>
              </div>

              <div className="space-y-5">
                {/* Streak Header Card */}
                <div className="p-5 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-slate-300">{ownerDisplay} · Weekly Sync Habit</p>
                    <h2 className="text-2xl font-bold mt-1 flex items-center gap-2 font-mono tabular-nums">
                      {streakStatus === 'frozen' ? (
                        <Snowflake className="w-5 h-5 text-sky-300 shrink-0" aria-hidden="true" />
                      ) : (
                        <Flame className="w-5 h-5 text-orange-400 shrink-0" aria-hidden="true" />
                      )}
                      <span>{streakWeeks}-week backup streak</span>
                    </h2>
                    <p className="text-xs text-slate-300 mt-1">
                      {streakStatus === 'frozen'
                        ? 'Streak frozen safely while you take a break—no progress lost.'
                        : streakStatus === 'returned'
                          ? 'Welcome back! Your streak stayed intact while you were away.'
                          : 'Synced consistently every Sunday to protect new photos.'}
                    </p>
                  </div>
                  <div className="bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-right shrink-0">
                    <span className="block text-xs text-slate-400">Freezes Left</span>
                    <span className="font-mono tabular-nums text-base font-bold text-sky-300">
                      {freezesRemaining} of 2
                    </span>
                  </div>
                </div>

                {/* 6-Week Visual Commitment Strip */}
                <div className="border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span>Weekly Sync Commitment</span>
                    <span className="font-mono tabular-nums">
                      {streakStatus === 'frozen' ? 'Break protected' : 'On track'}
                    </span>
                  </div>
                  <div className="grid grid-cols-6 gap-2">
                    {[1, 2, 3, 4, 5, 6].map((wk) => {
                      const completed = wk <= streakWeeks && !(streakStatus === 'frozen' && wk === streakWeeks);
                      const frozenCell = streakStatus === 'frozen' && wk === streakWeeks;
                      return (
                        <div
                          key={wk}
                          className={`py-2.5 px-1 rounded-lg border text-center text-xs font-mono tabular-nums ${
                            frozenCell
                              ? 'bg-sky-50 border-sky-200 text-sky-900 font-semibold'
                              : completed
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold'
                                : 'bg-slate-50 border-slate-200 text-slate-400'
                          }`}
                        >
                          <span className="block text-[11px]">W{wk}</span>
                          <span className="mt-1 inline-flex justify-center">
                            {frozenCell ? (
                              <Snowflake className="w-3.5 h-3.5 text-sky-700" aria-hidden="true" />
                            ) : completed ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                            ) : (
                              <PauseCircle className="w-3.5 h-3.5 text-slate-300" aria-hidden="true" />
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Interactive Streak, Freeze & Return After Break Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleSyncWeek}
                    className="min-h-[46px] px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Sync This Week (+1 Streak)
                  </button>
                  {streakStatus === 'frozen' ? (
                    <button
                      type="button"
                      onClick={handleReturnAfterBreak}
                      className="min-h-[46px] px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Return After Break
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleUseFreeze}
                      disabled={freezesRemaining === 0}
                      className="min-h-[46px] px-4 py-2.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 disabled:opacity-50 text-sky-900 text-xs font-semibold rounded-lg inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <Snowflake className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Use Streak Freeze</span>
                    </button>
                  )}
                </div>

                {/* Notification Opt-Out Guardrail */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <label className="flex items-center gap-2.5 text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={weeklyReminderOptIn}
                      onChange={(e) => setWeeklyReminderOptIn(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                    />
                    <span>
                      {weeklyReminderOptIn
                        ? 'Weekly Sunday reminder email ON'
                        : 'Reminders opted out (streak still works quietly)'}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 underline underline-offset-2 cursor-pointer self-start sm:self-auto"
                  >
                    <RotateCcw className="w-3 h-3" aria-hidden="true" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-200 space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center justify-between gap-4">
                <span>Post-signup habit</span>
                <span className="font-medium text-slate-900">Gentle weekly backup commitment</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>If user goes on holiday</span>
                <span className="font-medium text-sky-800">
                  Streak Freeze + welcoming return after break
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Notification guardrail</span>
                <span className="font-medium text-emerald-700 inline-flex items-center gap-1">
                  {!weeklyReminderOptIn && <BellOff className="w-3.5 h-3.5" aria-hidden="true" />}
                  1-click notification opt-out anytime
                </span>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 space-y-6">
          <div className="p-5 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-300">{ownerDisplay} · Weekly Sync Habit</p>
              <h2 className="text-2xl font-bold mt-1 font-mono tabular-nums">
                {streakWeeks}-week backup streak
              </h2>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-right">
              <span className="block text-xs text-slate-400">Freezes Left</span>
              <span className="font-mono tabular-nums text-base font-bold text-sky-300">
                {freezesRemaining} of 2
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleSyncWeek}
              className="flex-1 min-h-[48px] px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Sync This Week (+1 Streak)
            </button>
            <button
              type="button"
              onClick={handleUseFreeze}
              disabled={freezesRemaining === 0}
              className="min-h-[48px] px-5 py-3 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-900 text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Use Streak Freeze
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
              Easy notification opt-out &amp; gentle return after breaks
            </span>
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
