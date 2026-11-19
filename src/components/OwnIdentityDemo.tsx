import { useState } from 'react';
import {
  Check,
  CheckCircle2,
  EyeOff,
  FolderSync,
  Lock,
  RotateCcw,
  ShieldCheck,
  UserCheck,
  Users,
} from 'lucide-react';
import type { ClosersPreferences, DemoPrinciple, UnauthViewMode } from '../types';
import { ClosersNavStrip } from './ClosersNavStrip';

interface OwnIdentityDemoProps {
  mode: UnauthViewMode;
  onChangeMode: (mode: UnauthViewMode) => void;
  onChangePrinciple: (principle: DemoPrinciple) => void;
  userName?: string | null;
  closersPrefs: ClosersPreferences;
  onUpdateClosersPrefs: (partial: Partial<ClosersPreferences>) => void;
}

interface PresetGroup {
  id: string;
  name: string;
  roleCopy: string;
  streakWeeks: number;
}

const PRESET_GROUPS: PresetGroup[] = [
  {
    id: 'family',
    name: 'Tan Family Vault',
    roleCopy: 'Keeping family photos & travel albums safe together',
    streakWeeks: 14,
  },
  {
    id: 'studio',
    name: 'Design Studio Pod',
    roleCopy: 'Backing up active client deliverables on schedule',
    streakWeeks: 9,
  },
  {
    id: 'weekend',
    name: 'Weekend Photo Club',
    roleCopy: 'Sharing Sunday walk RAW shoots in one shared vault',
    streakWeeks: 6,
  },
];

export function OwnIdentityDemo({
  mode,
  onChangeMode,
  onChangePrinciple,
  userName,
  closersPrefs,
  onUpdateClosersPrefs,
}: OwnIdentityDemoProps) {
  const [beforeClicked, setBeforeClicked] = useState(false);
  const [syncedThisWeek, setSyncedThisWeek] = useState(false);

  const displayedGroupName = closersPrefs.chosenGroupName || 'Tan Family Vault';
  const activePreset =
    PRESET_GROUPS.find((g) => g.name === displayedGroupName) ?? PRESET_GROUPS[0];
  const isCustomGroup = !PRESET_GROUPS.some((g) => g.name === displayedGroupName);
  const shareActivityConsent = closersPrefs.shareGroupStatus;
  const optedOutOfGroup = closersPrefs.optedOutOfGroup;

  const currentUserDisplay = userName?.trim() ? userName.trim() : 'You';
  const currentStreak = syncedThisWeek
    ? activePreset.streakWeeks + 1
    : activePreset.streakWeeks;

  const handleResetDemo = () => {
    setSyncedThisWeek(false);
    onUpdateClosersPrefs({
      shareGroupStatus: true,
      optedOutOfGroup: false,
    });
  };

  return (
    <main id="top" className="max-w-[1320px] mx-auto px-6 py-10 lg:py-12">
      <ClosersNavStrip activePrinciple="own-identity" onChangePrinciple={onChangePrinciple} />

      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 pb-8 border-b border-slate-200">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold text-violet-800 mb-2">
            03. Own Identity · Tribes &amp; Ties
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight [text-wrap:balance]">
            Turn a solo chore into something &ldquo;we&rdquo; do together
          </h1>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Compare an anonymous solo backup prompt on the left with a chosen-group experience for <strong className="font-medium text-slate-900">Kestrel CloudSync</strong> on the right—naming the user&apos;s own group on screen while keeping sharing strictly opt-in.
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
          aria-label="Before and After Own Identity Comparison"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
        >
          {/* BEFORE: Anonymous Solo Task Prompt */}
          <div className="lg:col-span-6 bg-slate-100/80 border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-2 pb-5 mb-6 border-b border-slate-200">
                <span className="text-sm font-semibold text-slate-900">
                  Before · Generic Solo Reminder
                </span>
                <span className="text-xs text-slate-500">
                  No personal group or shared tie
                </span>
              </div>

              <div className="bg-white border border-slate-300 rounded-xl overflow-hidden">
                <div className="bg-slate-800 text-white px-5 py-3.5 flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold tracking-tight">
                    Kestrel CloudSync · Weekly Check
                  </span>
                  <span className="text-xs text-slate-300">Individual Account</span>
                </div>

                <div className="p-6 sm:p-7 space-y-5">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">
                      Weekly folder backup pending
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      You have 18 unsynced photos from this week. Run a manual backup to keep your individual cloud folder up to date.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs text-slate-600">
                    <div className="flex items-center justify-between gap-4">
                      <span>Pending items</span>
                      <span className="font-mono tabular-nums text-slate-800">18 files (64 MB)</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span>Account mode</span>
                      <span className="text-slate-800">Single-user storage</span>
                    </div>
                  </div>

                  {beforeClicked && (
                    <div
                      role="status"
                      className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed"
                    >
                      When backup feels like an isolated, anonymous task, users easily skip it for weeks because nothing ties it to people they care about.
                    </div>
                  )}

                  <div className="pt-2 space-y-2.5">
                    <button
                      type="button"
                      onClick={() => setBeforeClicked(true)}
                      className="w-full min-h-[44px] px-4 py-2.5 bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium rounded-md transition-colors cursor-pointer"
                    >
                      Run Solo Backup
                    </button>
                    <button
                      type="button"
                      onClick={() => setBeforeClicked(true)}
                      className="w-full min-h-[40px] px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-medium rounded-md transition-colors cursor-pointer"
                    >
                      Skip for now
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-200 space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center justify-between gap-4">
                <span>Who it&apos;s for</span>
                <span className="font-medium text-slate-800">Generic &ldquo;User&rdquo;</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Sense of belonging</span>
                <span className="font-medium text-slate-800">None—isolated chore</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Motivation to act now</span>
                <span className="font-medium text-slate-800">Low—easy to postpone</span>
              </div>
            </div>
          </div>

          {/* AFTER: Own Identity — Chosen Group Named on Screen + Opt-Out Guardrails */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-2 pb-5 mb-6 border-b border-slate-200">
                <span className="text-sm font-semibold text-violet-800">
                  After · Chosen Group Identity + Consent
                </span>
                <span className="text-xs text-violet-700 font-medium">
                  Named group · Opt-out anytime
                </span>
              </div>

              {/* Interactive Group Picker so presenter can demonstrate "A group the user chose, named on screen" */}
              <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-medium text-slate-700">
                    Group you chose to be part of:
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {PRESET_GROUPS.map((group) => (
                      <button
                        key={group.id}
                        type="button"
                        onClick={() => {
                          onUpdateClosersPrefs({
                            chosenGroupName: group.name,
                            optedOutOfGroup: false,
                          });
                        }}
                        className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                          displayedGroupName === group.name && !optedOutOfGroup
                            ? 'bg-violet-800 text-white'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {group.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="custom-tribe-name" className="sr-only">
                    Or type your own group name
                  </label>
                  <input
                    id="custom-tribe-name"
                    type="text"
                    maxLength={40}
                    value={isCustomGroup ? displayedGroupName : ''}
                    onChange={(e) => {
                      onUpdateClosersPrefs({
                        chosenGroupName: e.target.value.slice(0, 40) || 'Tan Family Vault',
                        optedOutOfGroup: false,
                      });
                    }}
                    placeholder="Or type any group name (e.g. Weekend Hikers, Class of '26)..."
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-700"
                  />
                </div>
              </div>

              {optedOutOfGroup ? (
                <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center gap-2.5 text-slate-900">
                    <EyeOff className="w-5 h-5 text-slate-600 shrink-0" aria-hidden="true" />
                    <h2 className="text-lg font-bold">
                      You&apos;ve opted out of {displayedGroupName}
                    </h2>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Your personal backups stay private in your own Kestrel CloudSync folder, and nothing is shared with the group. You can rejoin anytime.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetDemo}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Rejoin {displayedGroupName}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Named Tribe Banner */}
                  <div className="p-4 rounded-xl bg-violet-50 border border-violet-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-violet-700">
                        Your Chosen Group · 4 members
                      </p>
                      <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                        {displayedGroupName}
                      </h2>
                      <p className="text-xs text-slate-600 mt-0.5">{activePreset.roleCopy}</p>
                    </div>
                    <div className="bg-white border border-violet-200 rounded-lg px-3.5 py-2 text-right shrink-0">
                      <span className="block text-xs text-slate-500">Shared Streak</span>
                      <span className="font-mono tabular-nums text-base font-bold text-violet-800">
                        {currentStreak} weeks
                      </span>
                    </div>
                  </div>

                  {/* Group Members List (Shows explicit consent + private opt-out member) */}
                  <div className="border border-slate-200 rounded-xl divide-y divide-slate-100">
                    <div className="p-3.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <UserCheck className="w-4 h-4 text-violet-700 shrink-0" aria-hidden="true" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {currentUserDisplay} (You)
                          </p>
                          <p className="text-xs text-slate-500">
                            {!shareActivityConsent
                              ? 'Private · Activity hidden from group'
                              : syncedThisWeek
                                ? 'Synced 18 photos just now'
                                : '18 photos waiting to join this week’s album'}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-xs font-medium whitespace-nowrap shrink-0 ${
                          !shareActivityConsent
                            ? 'text-slate-500'
                            : syncedThisWeek
                              ? 'text-emerald-700'
                              : 'text-violet-700'
                        }`}
                      >
                        {!shareActivityConsent
                          ? 'Hidden'
                          : syncedThisWeek
                            ? 'Synced'
                            : 'Waiting on you'}
                      </span>
                    </div>

                    <div className="p-3.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">Mei Lin</p>
                          <p className="text-xs text-slate-500">Shared 24 photos · 2 hours ago</p>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-emerald-700 inline-flex items-center gap-1 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                        Synced
                      </span>
                    </div>

                    <div className="p-3.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">Marcus</p>
                          <p className="text-xs text-slate-500">Shared 11 files · Yesterday</p>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-emerald-700 inline-flex items-center gap-1 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                        Synced
                      </span>
                    </div>

                    <div className="p-3.5 flex items-center justify-between gap-4 bg-slate-50/60">
                      <div className="flex items-center gap-3">
                        <Lock className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                        <div>
                          <p className="text-sm font-medium text-slate-700">Aisha</p>
                          <p className="text-xs text-slate-500">
                            Syncing privately (opted out of status sharing)
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-slate-500 shrink-0">Private</span>
                    </div>
                  </div>

                  {/* Primary Action */}
                  {syncedThisWeek ? (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 text-sm font-medium text-emerald-900">
                        <Check className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
                        <span>
                          {displayedGroupName} streak updated to {currentStreak} weeks!
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleResetDemo}
                        className="text-xs font-medium text-slate-700 underline underline-offset-2 cursor-pointer self-start sm:self-auto"
                      >
                        Reset demo
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSyncedThisWeek(true)}
                      className="w-full min-h-[50px] px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2.5 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 whitespace-nowrap"
                    >
                      <FolderSync className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>Sync Now &amp; Keep {displayedGroupName} Streak</span>
                    </button>
                  )}

                  {/* Explicit Consent & Opt-Out Guardrails */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={shareActivityConsent}
                        onChange={(e) =>
                          onUpdateClosersPrefs({ shareGroupStatus: e.target.checked })
                        }
                        className="w-4 h-4 rounded border-slate-300 text-violet-700 focus:ring-violet-700 cursor-pointer"
                      />
                      <span>Share my sync status with {displayedGroupName}</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => onUpdateClosersPrefs({ optedOutOfGroup: true })}
                      className="text-slate-600 hover:text-slate-900 underline underline-offset-2 cursor-pointer self-start sm:self-auto"
                    >
                      Opt out of group view
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-5 border-t border-slate-200 space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center justify-between gap-4">
                <span>Who it&apos;s for</span>
                <span className="font-medium text-violet-800">
                  {displayedGroupName} (chosen by you)
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Sense of belonging</span>
                <span className="font-medium text-violet-800">
                  Shared {currentStreak}-week group streak
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Privacy guardrail</span>
                <span className="font-medium text-emerald-700">
                  Share only by consent · 1-click opt-out
                </span>
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* Focused Preview of Own Identity Experience */
        <section className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 space-y-6">
          <div className="p-5 rounded-xl bg-violet-50 border border-violet-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-violet-700">Your Chosen Group · 4 members</p>
              <h2 className="text-2xl font-bold text-slate-900 mt-0.5">{displayedGroupName}</h2>
              <p className="text-xs text-slate-600 mt-1">{activePreset.roleCopy}</p>
            </div>
            <div className="bg-white border border-violet-200 rounded-lg px-4 py-2.5 text-right shrink-0">
              <span className="block text-xs text-slate-500">Shared Streak</span>
              <span className="font-mono tabular-nums text-lg font-bold text-violet-800">
                {currentStreak} weeks
              </span>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl divide-y divide-slate-100">
            <div className="p-4 flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-slate-900">
                {currentUserDisplay} (You)
              </span>
              <span className="text-xs font-medium text-violet-700">
                {!shareActivityConsent
                  ? 'Private mode'
                  : syncedThisWeek
                    ? 'Synced just now'
                    : '18 photos ready'}
              </span>
            </div>
            <div className="p-4 flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-slate-900">Mei Lin &amp; Marcus</span>
              <span className="text-xs font-medium text-emerald-700">Synced this week</span>
            </div>
            <div className="p-4 flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-slate-700">Aisha</span>
              <span className="text-xs text-slate-500">Private (opted out of sharing)</span>
            </div>
          </div>

          {syncedThisWeek ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-emerald-900">
                {displayedGroupName} streak updated to {currentStreak} weeks!
              </span>
              <button
                type="button"
                onClick={handleResetDemo}
                className="text-xs font-medium text-slate-700 underline underline-offset-2 cursor-pointer"
              >
                Reset
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setSyncedThisWeek(true)}
              className="w-full min-h-[52px] px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Sync Now &amp; Keep {displayedGroupName} Streak
            </button>
          )}

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <span>Activity shared only with your permission · Opt out anytime</span>
            <button
              type="button"
              onClick={() => onChangeMode('side-by-side')}
              className="font-medium text-slate-900 underline underline-offset-4 hover:text-violet-700 cursor-pointer"
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
            How Own Identity Changes the Experience
          </h2>
          <p className="text-sm text-slate-600">
            Moving from an isolated utility screen to a shared &ldquo;us&rdquo; group chosen by the user—with explicit consent guardrails.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-medium text-slate-500">
                <th className="py-3 px-6">Element</th>
                <th className="py-3 px-6">Before (Anonymous Solo Task)</th>
                <th className="py-3 px-6">After (Chosen Group + Consent)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              <tr>
                <td className="py-3.5 px-6 font-medium text-slate-900">Identity Cue</td>
                <td className="py-3.5 px-6 text-slate-600">
                  Generic &ldquo;Individual Account&rdquo; message
                </td>
                <td className="py-3.5 px-6 text-violet-800 font-medium">
                  Names the group the user chose on screen ({displayedGroupName})
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-slate-900">Shared Tie (&ldquo;US&rdquo;)</td>
                <td className="py-3.5 px-6 text-slate-600">
                  Single-player checklist with no social context
                </td>
                <td className="py-3.5 px-6 text-slate-800">
                  Shared {currentStreak}-week group streak where everyone contributes
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-slate-900">Privacy Guardrail</td>
                <td className="py-3.5 px-6 text-slate-600">
                  No group sharing choices
                </td>
                <td className="py-3.5 px-6 text-slate-800">
                  Activity shared only by consent, with instant opt-out
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Principle & Guardrail Cards */}
      <section id="benefits" className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <Users className="w-5 h-5 text-violet-700 mb-3" aria-hidden="true" />
          <h3 className="text-base font-semibold text-slate-900 mb-2">
            Tribes &amp; Ties (&ldquo;US&rdquo;)
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            People act more readily when a step connects to a group they identify with—like family albums, a project pod, or a hobby club.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <UserCheck className="w-5 h-5 text-violet-700 mb-3" aria-hidden="true" />
          <h3 className="text-base font-semibold text-slate-900 mb-2">
            Chosen &amp; Named on Screen
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            The group isn&apos;t forced or auto-assigned—the user picks or names their own circle, and sees that exact name reflected back.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <ShieldCheck className="w-5 h-5 text-emerald-700 mb-3" aria-hidden="true" />
          <h3 className="text-base font-semibold text-slate-900 mb-2">
            Consent &amp; Opt-Out Guardrail
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Users choose whether their sync status appears to the group and can leave or switch to private mode in one click.
          </p>
        </div>
      </section>
    </main>
  );
}
