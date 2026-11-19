import { useCallback, useEffect, useRef, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { AccountHub } from './components/AccountHub';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { EmotionDemo } from './components/EmotionDemo';
import { ErrorBoundary } from './components/ErrorBoundary';
import { GuidedJourneyDemo } from './components/GuidedJourneyDemo';
import { LoginExperience } from './components/LoginExperience';
import { LossAvoidanceDemo } from './components/LossAvoidanceDemo';
import { OwnIdentityDemo } from './components/OwnIdentityDemo';
import { RecognitionDemo } from './components/RecognitionDemo';
import { StatusDemo } from './components/StatusDemo';
import { StickinessDemo } from './components/StickinessDemo';
import { TopBar } from './components/TopBar';
import {
  auth,
  db,
  handleFirestoreError,
  OperationType,
  signInWithGoogleSSO,
  signOutPortal,
} from './firebase';
import {
  DEFAULT_CLOSERS_PREFERENCES,
  type ClosersPreferences,
  type DemoPrinciple,
  type PortalTab,
  type SignInEvent,
  type UnauthViewMode,
  type UserAccount,
} from './types';

function getDeviceSummary(): string {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  let browser = 'Web Browser';
  if (ua.includes('Edg/')) browser = 'Microsoft Edge';
  else if (ua.includes('Chrome/')) browser = 'Google Chrome';
  else if (ua.includes('Firefox/')) browser = 'Mozilla Firefox';
  else if (ua.includes('Safari/')) browser = 'Apple Safari';

  let os = 'Desktop';
  if (ua.includes('Mac OS')) os = 'macOS';
  else if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  else if (ua.includes('Linux')) os = 'Linux';

  return `${browser} on ${os}`.slice(0, 120);
}

function mapFirebaseAuthError(error: unknown): string {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code: unknown }).code)
      : '';

  switch (code) {
    case 'auth/popup-closed-by-user':
      return 'Google Sign-In popup was closed before completing. Please try again.';
    case 'auth/popup-blocked':
      return 'Browser blocked the Google Sign-In popup. Please allow popups for this site and retry.';
    case 'auth/cancelled-popup-request':
      return 'Sign-in request was superseded. Please click Continue with Google once.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized in Firebase Authentication settings.';
    default:
      return error instanceof Error ? error.message : 'Unable to sign in with Google.';
  }
}

function extractClosersPrefs(data: UserAccount): ClosersPreferences {
  return {
    chosenGroupName:
      typeof data.chosenGroupName === 'string' && data.chosenGroupName.trim().length > 0
        ? data.chosenGroupName.trim().slice(0, 40)
        : DEFAULT_CLOSERS_PREFERENCES.chosenGroupName,
    shareGroupStatus:
      typeof data.shareGroupStatus === 'boolean'
        ? data.shareGroupStatus
        : DEFAULT_CLOSERS_PREFERENCES.shareGroupStatus,
    optedOutOfGroup:
      typeof data.optedOutOfGroup === 'boolean'
        ? data.optedOutOfGroup
        : DEFAULT_CLOSERS_PREFERENCES.optedOutOfGroup,
    hideTierProgress:
      typeof data.hideTierProgress === 'boolean'
        ? data.hideTierProgress
        : DEFAULT_CLOSERS_PREFERENCES.hideTierProgress,
    weeklyReminderOptIn:
      typeof data.weeklyReminderOptIn === 'boolean'
        ? data.weeklyReminderOptIn
        : DEFAULT_CLOSERS_PREFERENCES.weeklyReminderOptIn,
    trialReminder24h:
      typeof data.trialReminder24h === 'boolean'
        ? data.trialReminder24h
        : DEFAULT_CLOSERS_PREFERENCES.trialReminder24h,
    reducedMotionCelebration:
      typeof data.reducedMotionCelebration === 'boolean'
        ? data.reducedMotionCelebration
        : DEFAULT_CLOSERS_PREFERENCES.reducedMotionCelebration,
  };
}

function PortalApp() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [activePrinciple, setActivePrinciple] = useState<DemoPrinciple>('analysis');
  const [unauthMode, setUnauthMode] = useState<UnauthViewMode>('side-by-side');
  const [activeTab, setActiveTab] = useState<PortalTab>('overview');
  const [rememberDevice, setRememberDevice] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [closersPrefs, setClosersPrefs] = useState<ClosersPreferences>(
    DEFAULT_CLOSERS_PREFERENCES
  );
  const closersPrefsRef = useRef<ClosersPreferences>(DEFAULT_CLOSERS_PREFERENCES);
  closersPrefsRef.current = closersPrefs;

  const [profile, setProfile] = useState<UserAccount | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [events, setEvents] = useState<SignInEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  const loggedSessionUidRef = useRef<string | null>(null);
  const prefsPersistTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setAuthReady(true);
      if (!nextUser) {
        setProfile(null);
        setEvents([]);
        loggedSessionUidRef.current = null;
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!authReady || !user) {
      return;
    }

    let cancelled = false;
    const userDocPath = `users/${user.uid}`;
    const userDocRef = doc(db, 'users', user.uid);
    const eventsCollectionPath = `users/${user.uid}/signInEvents`;

    const syncUserAndSession = async () => {
      setProfileLoading(true);
      try {
        const snapshot = await getDoc(userDocRef);
        if (!snapshot.exists()) {
          const safeDisplayName = (
            user.displayName ||
            user.email?.split('@')[0] ||
            'Account User'
          )
            .trim()
            .slice(0, 100);
          const safeEmail = (user.email || '').trim().slice(0, 254);
          const safePhoto = (user.photoURL || '').slice(0, 500);
          const initialPrefs = closersPrefsRef.current;

          await setDoc(userDocRef, {
            uid: user.uid,
            email: safeEmail,
            displayName: safeDisplayName,
            photoURL: safePhoto,
            accountLabel: 'Personal Account',
            rememberTrustedDevice: rememberDevice,
            requireStepUpForBilling: false,
            preferredAuthMethod: 'google',
            chosenGroupName: initialPrefs.chosenGroupName.trim().slice(0, 40) || 'Tan Family Vault',
            shareGroupStatus: initialPrefs.shareGroupStatus,
            optedOutOfGroup: initialPrefs.optedOutOfGroup,
            hideTierProgress: initialPrefs.hideTierProgress,
            weeklyReminderOptIn: initialPrefs.weeklyReminderOptIn,
            trialReminder24h: initialPrefs.trialReminder24h,
            reducedMotionCelebration: initialPrefs.reducedMotionCelebration,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }

        if (loggedSessionUidRef.current !== user.uid) {
          loggedSessionUidRef.current = user.uid;
          await addDoc(collection(db, 'users', user.uid, 'signInEvents'), {
            uid: user.uid,
            provider: 'google.com',
            deviceSummary: getDeviceSummary(),
            status: 'active',
            createdAt: serverTimestamp(),
          });
        }
      } catch (error) {
        if (!cancelled) {
          handleFirestoreError(error, OperationType.WRITE, userDocPath);
        }
      } finally {
        if (!cancelled) {
          setProfileLoading(false);
        }
      }
    };

    void syncUserAndSession();

    const unsubProfile = onSnapshot(
      userDocRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as UserAccount;
          setProfile(data);
          setClosersPrefs(extractClosersPrefs(data));
        }
        setProfileLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, userDocPath);
      }
    );

    setEventsLoading(true);
    const eventsQuery = query(
      collection(db, 'users', user.uid, 'signInEvents'),
      where('uid', '==', user.uid),
      limit(25)
    );

    const unsubEvents = onSnapshot(
      eventsQuery,
      (snap) => {
        const loaded: SignInEvent[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<SignInEvent, 'id'>),
        }));
        loaded.sort((a, b) => {
          const aMs =
            a.createdAt && typeof a.createdAt.toMillis === 'function'
              ? a.createdAt.toMillis()
              : Date.now();
          const bMs =
            b.createdAt && typeof b.createdAt.toMillis === 'function'
              ? b.createdAt.toMillis()
              : Date.now();
          return bMs - aMs;
        });
        setEvents(loaded);
        setEventsLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, eventsCollectionPath);
      }
    );

    return () => {
      cancelled = true;
      unsubProfile();
      unsubEvents();
    };
  }, [authReady, user, rememberDevice]);

  useEffect(() => {
    return () => {
      if (prefsPersistTimerRef.current) {
        clearTimeout(prefsPersistTimerRef.current);
      }
    };
  }, []);

  const handleUpdateClosersPrefs = useCallback(
    (partial: Partial<ClosersPreferences>) => {
      const next: ClosersPreferences = {
        ...closersPrefsRef.current,
        ...partial,
      };
      if (partial.chosenGroupName !== undefined) {
        next.chosenGroupName = partial.chosenGroupName.slice(0, 40);
      }
      closersPrefsRef.current = next;
      setClosersPrefs(next);

      if (!user) return;

      if (prefsPersistTimerRef.current) {
        clearTimeout(prefsPersistTimerRef.current);
      }

      prefsPersistTimerRef.current = setTimeout(() => {
        const path = `users/${user.uid}`;
        const latest = closersPrefsRef.current;
        const safeGroup = latest.chosenGroupName.trim().slice(0, 40) || 'Tan Family Vault';
        void updateDoc(doc(db, 'users', user.uid), {
          chosenGroupName: safeGroup,
          shareGroupStatus: latest.shareGroupStatus,
          optedOutOfGroup: latest.optedOutOfGroup,
          hideTierProgress: latest.hideTierProgress,
          weeklyReminderOptIn: latest.weeklyReminderOptIn,
          trialReminder24h: latest.trialReminder24h,
          reducedMotionCelebration: latest.reducedMotionCelebration,
          updatedAt: serverTimestamp(),
        }).catch((error) => {
          handleFirestoreError(error, OperationType.UPDATE, path);
        });
      }, 250);
    },
    [user]
  );

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setSigningIn(true);
    try {
      await signInWithGoogleSSO(rememberDevice);
    } catch (error) {
      setAuthError(mapFirebaseAuthError(error));
    } finally {
      setSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOutPortal();
    } finally {
      setSigningOut(false);
    }
  };

  const handleSaveProfile = async (updates: {
    displayName: string;
    accountLabel: string;
    rememberTrustedDevice: boolean;
    requireStepUpForBilling: boolean;
    closersPrefs: ClosersPreferences;
  }) => {
    if (!user) return;
    if (prefsPersistTimerRef.current) {
      clearTimeout(prefsPersistTimerRef.current);
    }
    const safeGroup = updates.closersPrefs.chosenGroupName.trim().slice(0, 40) || 'Tan Family Vault';
    const nextPrefs = {
      ...updates.closersPrefs,
      chosenGroupName: safeGroup,
    };
    setClosersPrefs(nextPrefs);
    closersPrefsRef.current = nextPrefs;

    const path = `users/${user.uid}`;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: updates.displayName.trim().slice(0, 100),
        photoURL: (user.photoURL || '').slice(0, 500),
        accountLabel: updates.accountLabel.trim().slice(0, 60),
        rememberTrustedDevice: updates.rememberTrustedDevice,
        requireStepUpForBilling: updates.requireStepUpForBilling,
        chosenGroupName: nextPrefs.chosenGroupName,
        shareGroupStatus: nextPrefs.shareGroupStatus,
        optedOutOfGroup: nextPrefs.optedOutOfGroup,
        hideTierProgress: nextPrefs.hideTierProgress,
        weeklyReminderOptIn: nextPrefs.weeklyReminderOptIn,
        trialReminder24h: nextPrefs.trialReminder24h,
        reducedMotionCelebration: nextPrefs.reducedMotionCelebration,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const handleEndSession = async (eventId: string) => {
    if (!user) return;
    const path = `users/${user.uid}/signInEvents/${eventId}`;
    try {
      await updateDoc(doc(db, 'users', user.uid, 'signInEvents', eventId), {
        status: 'ended',
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const handleDeleteSession = async (eventId: string) => {
    if (!user) return;
    const path = `users/${user.uid}/signInEvents/${eventId}`;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'signInEvents', eventId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  if (!authReady) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-8 space-y-4 animate-pulse">
          <div className="h-5 w-32 bg-slate-200 rounded" />
          <div className="h-8 w-56 bg-slate-200 rounded" />
          <div className="h-12 w-full bg-slate-100 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <TopBar
        user={user}
        activePrinciple={activePrinciple}
        onChangePrinciple={setActivePrinciple}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onSignOut={() => void handleSignOut()}
        signingOut={signingOut}
      />

      <div className="flex-1">
        {activePrinciple === 'analysis' ? (
          <AnalysisDashboard onOpenPrinciple={setActivePrinciple} />
        ) : activePrinciple === 'journey' ? (
          <GuidedJourneyDemo
            onChangePrinciple={setActivePrinciple}
            userName={profile?.displayName ?? user?.displayName ?? null}
            isSignedIn={Boolean(user)}
            onGoogleSignIn={handleGoogleSignIn}
            signingIn={signingIn}
            closersPrefs={closersPrefs}
            onUpdateClosersPrefs={handleUpdateClosersPrefs}
          />
        ) : activePrinciple === 'stickiness' ? (
          <StickinessDemo
            mode={unauthMode}
            onChangeMode={setUnauthMode}
            onChangePrinciple={setActivePrinciple}
            userName={profile?.displayName ?? user?.displayName ?? null}
            closersPrefs={closersPrefs}
            onUpdateClosersPrefs={handleUpdateClosersPrefs}
          />
        ) : activePrinciple === 'recognition' ? (
          <RecognitionDemo
            mode={unauthMode}
            onChangeMode={setUnauthMode}
            onChangePrinciple={setActivePrinciple}
            userName={profile?.displayName ?? user?.displayName ?? null}
          />
        ) : activePrinciple === 'emotion' ? (
          <EmotionDemo
            mode={unauthMode}
            onChangeMode={setUnauthMode}
            onChangePrinciple={setActivePrinciple}
            userName={profile?.displayName ?? user?.displayName ?? null}
            closersPrefs={closersPrefs}
            onUpdateClosersPrefs={handleUpdateClosersPrefs}
          />
        ) : activePrinciple === 'status' ? (
          <StatusDemo
            mode={unauthMode}
            onChangeMode={setUnauthMode}
            onChangePrinciple={setActivePrinciple}
            userName={profile?.displayName ?? user?.displayName ?? null}
            closersPrefs={closersPrefs}
            onUpdateClosersPrefs={handleUpdateClosersPrefs}
          />
        ) : activePrinciple === 'own-identity' ? (
          <OwnIdentityDemo
            mode={unauthMode}
            onChangeMode={setUnauthMode}
            onChangePrinciple={setActivePrinciple}
            userName={profile?.displayName ?? user?.displayName ?? null}
            closersPrefs={closersPrefs}
            onUpdateClosersPrefs={handleUpdateClosersPrefs}
          />
        ) : activePrinciple === 'loss-avoidance' ? (
          <LossAvoidanceDemo
            mode={unauthMode}
            onChangeMode={setUnauthMode}
            onChangePrinciple={setActivePrinciple}
            userName={profile?.displayName ?? user?.displayName ?? null}
            closersPrefs={closersPrefs}
            onUpdateClosersPrefs={handleUpdateClosersPrefs}
          />
        ) : !user ? (
          <LoginExperience
            mode={unauthMode}
            onChangeMode={setUnauthMode}
            onChangePrinciple={setActivePrinciple}
            rememberDevice={rememberDevice}
            onToggleRememberDevice={setRememberDevice}
            onGoogleSignIn={handleGoogleSignIn}
            signingIn={signingIn}
            authError={authError}
          />
        ) : (
          <AccountHub
            user={user}
            profile={profile}
            profileLoading={profileLoading}
            events={events}
            eventsLoading={eventsLoading}
            activeTab={activeTab}
            onChangeTab={setActiveTab}
            onChangePrinciple={setActivePrinciple}
            closersPrefs={closersPrefs}
            onSaveProfile={handleSaveProfile}
            onEndSession={handleEndSession}
            onDeleteSession={handleDeleteSession}
          />
        )}
      </div>

      <footer className="border-t border-slate-200 bg-white mt-16">
        <div className="max-w-[1320px] mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>Kestrel Portal · Customer Sign-In Preview</span>
          <span>Fast, password-free access with Google</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <PortalApp />
    </ErrorBoundary>
  );
}
