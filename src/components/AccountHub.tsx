import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { Check, CheckCircle2, LogOut, Shield, Trash2, UserCheck } from 'lucide-react';
import type {
  ClosersPreferences,
  DemoPrinciple,
  PortalFeatureUsage,
  PortalTab,
  SignInEvent,
  UserAccount,
} from '../types';
import { ClosersNavStrip } from './ClosersNavStrip';
import { GuidedProgress } from './GuidedProgress';

interface AccountHubProps {
  user: User;
  profile: UserAccount | null;
  profileLoading: boolean;
  events: SignInEvent[];
  eventsLoading: boolean;
  activeTab: PortalTab;
  onChangeTab: (tab: PortalTab) => void;
  onChangePrinciple: (principle: DemoPrinciple) => void;
  closersPrefs: ClosersPreferences;
  featureUsage: PortalFeatureUsage;
  onSaveProfile: (updates: {
    displayName: string;
    accountLabel: string;
    rememberTrustedDevice: boolean;
    requireStepUpForBilling: boolean;
    closersPrefs: ClosersPreferences;
  }) => Promise<void>;
  onEndSession: (eventId: string) => Promise<void>;
  onDeleteSession: (eventId: string) => Promise<void>;
}

export function AccountHub({
  user,
  profile,
  profileLoading,
  events,
  eventsLoading,
  activeTab,
  onChangeTab,
  onChangePrinciple,
  closersPrefs,
  featureUsage,
  onSaveProfile,
  onEndSession,
  onDeleteSession,
}: AccountHubProps) {
  const [displayName, setDisplayName] = useState(profile?.displayName ?? user.displayName ?? '');
  const [accountLabel, setAccountLabel] = useState(profile?.accountLabel ?? 'Personal Account');
  const [rememberTrustedDevice, setRememberTrustedDevice] = useState(
    profile?.rememberTrustedDevice ?? true
  );
  const [requireStepUpForBilling, setRequireStepUpForBilling] = useState(
    profile?.requireStepUpForBilling ?? false
  );
  const [draftClosers, setDraftClosers] = useState<ClosersPreferences>(closersPrefs);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [avatarFailed, setAvatarFailed] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName);
      setAccountLabel(profile.accountLabel);
      setRememberTrustedDevice(profile.rememberTrustedDevice);
      setRequireStepUpForBilling(profile.requireStepUpForBilling);
    }
  }, [profile]);

  useEffect(() => {
    setDraftClosers(closersPrefs);
  }, [closersPrefs]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveMessage(null);
    setSaveError(null);

    const trimmedName = displayName.trim();
    const trimmedLabel = accountLabel.trim();
    const trimmedGroup = draftClosers.chosenGroupName.trim() || 'Tan Family Vault';

    if (trimmedName.length < 1 || trimmedName.length > 100) {
      setSaveError('Please enter a name between 1 and 100 characters.');
      return;
    }
    if (trimmedLabel.length < 1 || trimmedLabel.length > 60) {
      setSaveError('Please select a valid account type.');
      return;
    }
    if (trimmedGroup.length < 1 || trimmedGroup.length > 40) {
      setSaveError('Group name must be between 1 and 40 characters.');
      return;
    }

    setSaving(true);
    try {
      await onSaveProfile({
        displayName: trimmedName,
        accountLabel: trimmedLabel,
        rememberTrustedDevice,
        requireStepUpForBilling,
        closersPrefs: {
          ...draftClosers,
          chosenGroupName: trimmedGroup,
        },
      });
      setSaveMessage('Your account and guardrail preferences have been saved.');
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Could not save preferences.');
    } finally {
      setSaving(false);
    }
  };

  const initials = (profile?.displayName || user.displayName || user.email || 'U')
    .trim()
    .slice(0, 2)
    .toUpperCase();

  const formatTimestamp = (ts: SignInEvent['createdAt']) => {
    if (!ts || typeof ts.toDate !== 'function') {
      return 'Just now';
    }
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(ts.toDate());
  };

  const handleFocusProfileField = (elementId: string) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.focus();
    }
  };

  return (
    <main id="top" className="max-w-[1320px] mx-auto px-6 py-10">
      <ClosersNavStrip activePrinciple="convenience" onChangePrinciple={onChangePrinciple} />

      {/* Friendly Welcome Header with Desktop + Mobile Tab Switcher */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
        <div>
          <p className="text-xs font-medium text-emerald-700 mb-1">
            Signed in with Google
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 [text-wrap:balance]">
            Welcome back, {profile?.displayName || user.displayName || 'there'}
          </h1>
          <p className="mt-1.5 text-sm text-slate-600">
            Manage your Google account settings, saved privacy guardrails, and recent sign-in devices.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Account sections"
          className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'overview'}
            onClick={() => onChangeTab('overview')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Account
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'activity'}
            onClick={() => onChangeTab('activity')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'activity'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Recent Sign-Ins ({events.length})
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
          <GuidedProgress
            user={user}
            profile={profile}
            events={events}
            closersPrefs={closersPrefs}
            featureUsage={featureUsage}
            onChangeTab={onChangeTab}
            onChangePrinciple={onChangePrinciple}
            onFocusProfileField={handleFocusProfileField}
          />
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Customer Profile Summary */}
          <section className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              {user.photoURL && !avatarFailed ? (
                <img
                  src={user.photoURL}
                  alt={profile?.displayName || user.displayName || 'Your profile photo'}
                  referrerPolicy="no-referrer"
                  onError={() => setAvatarFailed(true)}
                  className="w-14 h-14 rounded-full object-cover border border-slate-200 shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-slate-900 text-white font-semibold text-base flex items-center justify-center shrink-0">
                  {initials}
                </div>
              )}

              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-slate-900 truncate">
                  {profile?.displayName || user.displayName || 'Google Account'}
                </h2>
                <p className="text-sm text-slate-600 truncate">{user.email}</p>
              </div>
            </div>

            <dl className="mt-6 space-y-4 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-500">Sign-in method</dt>
                <dd className="font-medium text-slate-900 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                  <span>Google Account</span>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-500">Email status</dt>
                <dd className="font-medium text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                  <span>{user.emailVerified ? 'Verified' : 'Pending'}</span>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-500">Account type</dt>
                <dd className="font-medium text-slate-900">
                  {profile?.accountLabel || 'Personal Account'}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-500">Chosen group</dt>
                <dd className="font-medium text-slate-900">
                  {closersPrefs.optedOutOfGroup ? 'Private (opted out)' : closersPrefs.chosenGroupName}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-500">Recent sign-ins</dt>
                <dd className="font-mono tabular-nums text-slate-900">
                  <button
                    type="button"
                    onClick={() => onChangeTab('activity')}
                    className="underline underline-offset-2 hover:text-emerald-700 cursor-pointer"
                  >
                    {events.length} {events.length === 1 ? 'visit' : 'visits'}
                  </button>
                </dd>
              </div>
            </dl>
          </section>

          {/* Preferences + Persisted Guardrails Form */}
          <section className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-1">
              Account &amp; Privacy Guardrail Preferences
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              Changes made here—or inside any live demo—are saved to your account across sessions.
            </p>

            {profileLoading ? (
              <div className="space-y-4 animate-pulse" aria-label="Loading your preferences">
                <div className="h-10 bg-slate-100 rounded-lg" />
                <div className="h-10 bg-slate-100 rounded-lg" />
                <div className="h-12 bg-slate-100 rounded-lg" />
              </div>
            ) : (
              <form onSubmit={handleProfileSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="profile-display-name"
                      className="block text-xs font-medium text-slate-700 mb-1.5"
                    >
                      Display Name
                    </label>
                    <input
                      id="profile-display-name"
                      type="text"
                      maxLength={100}
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="profile-account-label"
                      className="block text-xs font-medium text-slate-700 mb-1.5"
                    >
                      Account Type
                    </label>
                    <select
                      id="profile-account-label"
                      value={accountLabel}
                      onChange={(e) => setAccountLabel(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-emerald-700"
                    >
                      <option value="Personal Account">Personal Account</option>
                      <option value="Home & Mobile">Home &amp; Mobile</option>
                      <option value="Family Plan">Family Plan</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="profile-chosen-group"
                    className="block text-xs font-medium text-slate-700 mb-1.5"
                  >
                    Chosen Group Name (Own Identity)
                  </label>
                  <input
                    id="profile-chosen-group"
                    type="text"
                    maxLength={40}
                    value={draftClosers.chosenGroupName}
                    onChange={(e) =>
                      setDraftClosers((prev) => ({ ...prev, chosenGroupName: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-700"
                  />
                </div>

                <div className="pt-2 space-y-3 border-t border-slate-100">
                  <label className="flex items-start gap-3 cursor-pointer pt-2">
                    <input
                      type="checkbox"
                      checked={rememberTrustedDevice}
                      onChange={(e) => setRememberTrustedDevice(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-700 cursor-pointer"
                    />
                    <div>
                      <span className="block text-sm font-medium text-slate-900">
                        Stay signed in on this device
                      </span>
                      <span className="block text-xs text-slate-500">
                        Go straight to your account next time you visit from this browser.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={requireStepUpForBilling}
                      onChange={(e) => setRequireStepUpForBilling(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-700 cursor-pointer"
                    />
                    <div>
                      <span className="block text-sm font-medium text-slate-900">
                        Confirm with Google before payment changes
                      </span>
                      <span className="block text-xs text-slate-500">
                        Quickly verify it&apos;s you with Google instead of entering a 6-digit PIN.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draftClosers.shareGroupStatus && !draftClosers.optedOutOfGroup}
                      onChange={(e) =>
                        setDraftClosers((prev) => ({
                          ...prev,
                          shareGroupStatus: e.target.checked,
                          optedOutOfGroup: e.target.checked ? false : prev.optedOutOfGroup,
                        }))
                      }
                      className="mt-0.5 w-4 h-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-700 cursor-pointer"
                    />
                    <div>
                      <span className="block text-sm font-medium text-slate-900">
                        Share backup activity with my chosen group
                      </span>
                      <span className="block text-xs text-slate-500">
                        Consent guardrail: keep off to sync privately without notifying group members.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draftClosers.weeklyReminderOptIn}
                      onChange={(e) =>
                        setDraftClosers((prev) => ({ ...prev, weeklyReminderOptIn: e.target.checked }))
                      }
                      className="mt-0.5 w-4 h-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-700 cursor-pointer"
                    />
                    <div>
                      <span className="block text-sm font-medium text-slate-900">
                        Weekly Sunday backup streak reminders
                      </span>
                      <span className="block text-xs text-slate-500">
                        Stickiness guardrail: opt out anytime while keeping your streak intact.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draftClosers.trialReminder24h}
                      onChange={(e) =>
                        setDraftClosers((prev) => ({ ...prev, trialReminder24h: e.target.checked }))
                      }
                      className="mt-0.5 w-4 h-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-700 cursor-pointer"
                    />
                    <div>
                      <span className="block text-sm font-medium text-slate-900">
                        Send 24-hour reminder before trial or credit expires
                      </span>
                      <span className="block text-xs text-slate-500">
                        Loss Avoidance guardrail: prevents unexpected renewals.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draftClosers.hideTierProgress}
                      onChange={(e) =>
                        setDraftClosers((prev) => ({ ...prev, hideTierProgress: e.target.checked }))
                      }
                      className="mt-0.5 w-4 h-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-700 cursor-pointer"
                    />
                    <div>
                      <span className="block text-sm font-medium text-slate-900">
                        Hide status tier ladder comparisons
                      </span>
                      <span className="block text-xs text-slate-500">
                        Status guardrail: switch to a calm simple view anytime.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draftClosers.reducedMotionCelebration}
                      onChange={(e) =>
                        setDraftClosers((prev) => ({
                          ...prev,
                          reducedMotionCelebration: e.target.checked,
                        }))
                      }
                      className="mt-0.5 w-4 h-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-700 cursor-pointer"
                    />
                    <div>
                      <span className="block text-sm font-medium text-slate-900">
                        Use reduced-motion confirmation screens
                      </span>
                      <span className="block text-xs text-slate-500">
                        Emotion guardrail: disables celebratory motion for calm, accessible feedback.
                      </span>
                    </div>
                  </label>
                </div>

                {saveError && (
                  <p role="alert" className="text-sm text-red-700">
                    {saveError}
                  </p>
                )}

                {saveMessage && (
                  <p role="status" className="text-sm text-emerald-700 flex items-center gap-1.5">
                    <Check className="w-4 h-4" aria-hidden="true" />
                    <span>{saveMessage}</span>
                  </p>
                )}

                <div className="pt-2 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 min-h-[42px] bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {saving ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>
              </form>
            )}
          </section>
          </div>
        </>
      )}

      {activeTab === 'activity' && (
        <section className="mt-8 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Recent Sign-Ins
              </h2>
              <p className="text-sm text-slate-600">
                Devices where you recently signed in using Google.
              </p>
            </div>
            <span className="text-xs font-mono tabular-nums text-slate-500">
              {events.length} {events.length === 1 ? 'visit' : 'visits'}
            </span>
          </div>

          {eventsLoading ? (
            <div className="p-6 space-y-3 animate-pulse">
              <div className="h-10 bg-slate-100 rounded-lg" />
              <div className="h-10 bg-slate-100 rounded-lg" />
              <div className="h-10 bg-slate-100 rounded-lg" />
            </div>
          ) : events.length === 0 ? (
            <div className="p-10 text-center">
              <Shield className="w-6 h-6 text-slate-400 mx-auto mb-3" aria-hidden="true" />
              <p className="text-sm font-medium text-slate-900 mb-1">No recent sign-ins</p>
              <p className="text-xs text-slate-500">
                Your future visits will appear here so you can keep track of your devices.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-medium text-slate-500">
                    <th className="py-3 px-6">Device &amp; Browser</th>
                    <th className="py-3 px-6">Signed in via</th>
                    <th className="py-3 px-6">When</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {events.map((ev) => (
                    <tr key={ev.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-6 font-medium text-slate-900">
                        {ev.deviceSummary}
                      </td>
                      <td className="py-3.5 px-6 text-slate-600 text-xs">
                        Google Account
                      </td>
                      <td className="py-3.5 px-6 text-slate-600 font-mono tabular-nums text-xs">
                        {formatTimestamp(ev.createdAt)}
                      </td>
                      <td className="py-3.5 px-6">
                        {ev.status === 'active' ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                            <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                            Signed out
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-6 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          {ev.status === 'active' && (
                            <button
                              type="button"
                              onClick={() => void onEndSession(ev.id)}
                              className="px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            >
                              Sign out device
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => void onDeleteSession(ev.id)}
                            aria-label="Remove entry"
                            className="p-1.5 text-slate-400 hover:text-red-700 rounded-md transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
