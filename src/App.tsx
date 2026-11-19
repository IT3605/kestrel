import { useEffect, useRef, useState } from 'react';
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
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoginExperience } from './components/LoginExperience';
import { LossAvoidanceDemo } from './components/LossAvoidanceDemo';
import { OwnIdentityDemo } from './components/OwnIdentityDemo';
import { StatusDemo } from './components/StatusDemo';
import { TopBar } from './components/TopBar';
import {
  auth,
  db,
  handleFirestoreError,
  OperationType,
  signInWithGoogleSSO,
  signOutPortal,
} from './firebase';
import type { DemoPrinciple, PortalTab, SignInEvent, UnauthViewMode, UserAccount } from './types';

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

  const [profile, setProfile] = useState<UserAccount | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [events, setEvents] = useState<SignInEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  const loggedSessionUidRef = useRef<string | null>(null);

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

          await setDoc(userDocRef, {
            uid: user.uid,
            email: safeEmail,
            displayName: safeDisplayName,
            photoURL: safePhoto,
            accountLabel: 'Personal Account',
            rememberTrustedDevice: rememberDevice,
            requireStepUpForBilling: false,
            preferredAuthMethod: 'google',
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
          setProfile(snap.data() as UserAccount);
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
          const aMs = a.createdAt && typeof a.createdAt.toMillis === 'function' ? a.createdAt.toMillis() : Date.now();
          const bMs = b.createdAt && typeof b.createdAt.toMillis === 'function' ? b.createdAt.toMillis() : Date.now();
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
  }) => {
    if (!user) return;
    const path = `users/${user.uid}`;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: updates.displayName.trim().slice(0, 100),
        photoURL: (user.photoURL || '').slice(0, 500),
        accountLabel: updates.accountLabel.trim().slice(0, 60),
        rememberTrustedDevice: updates.rememberTrustedDevice,
        requireStepUpForBilling: updates.requireStepUpForBilling,
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
        unauthMode={unauthMode}
        onChangeUnauthMode={setUnauthMode}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onSignOut={() => void handleSignOut()}
        signingOut={signingOut}
      />

      <div className="flex-1">
        {activePrinciple === 'analysis' ? (
          <AnalysisDashboard onOpenPrinciple={setActivePrinciple} />
        ) : activePrinciple === 'status' ? (
          <StatusDemo
            mode={unauthMode}
            onChangeMode={setUnauthMode}
            onChangePrinciple={setActivePrinciple}
            userName={profile?.displayName ?? user?.displayName ?? null}
          />
        ) : activePrinciple === 'own-identity' ? (
          <OwnIdentityDemo
            mode={unauthMode}
            onChangeMode={setUnauthMode}
            onChangePrinciple={setActivePrinciple}
            userName={profile?.displayName ?? user?.displayName ?? null}
          />
        ) : activePrinciple === 'loss-avoidance' ? (
          <LossAvoidanceDemo
            mode={unauthMode}
            onChangeMode={setUnauthMode}
            onChangePrinciple={setActivePrinciple}
            userName={profile?.displayName ?? user?.displayName ?? null}
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
