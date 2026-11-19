import type { Timestamp } from 'firebase/firestore';

export interface ClosersPreferences {
  chosenGroupName: string;
  shareGroupStatus: boolean;
  optedOutOfGroup: boolean;
  hideTierProgress: boolean;
  weeklyReminderOptIn: boolean;
  trialReminder24h: boolean;
  reducedMotionCelebration: boolean;
}

export const DEFAULT_CLOSERS_PREFERENCES: ClosersPreferences = {
  chosenGroupName: 'Tan Family Vault',
  shareGroupStatus: true,
  optedOutOfGroup: false,
  hideTierProgress: false,
  weeklyReminderOptIn: true,
  trialReminder24h: true,
  reducedMotionCelebration: false,
};

export interface UserAccount {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  accountLabel: string;
  rememberTrustedDevice: boolean;
  requireStepUpForBilling: boolean;
  preferredAuthMethod: 'google';
  chosenGroupName?: string;
  shareGroupStatus?: boolean;
  optedOutOfGroup?: boolean;
  hideTierProgress?: boolean;
  weeklyReminderOptIn?: boolean;
  trialReminder24h?: boolean;
  reducedMotionCelebration?: boolean;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export interface SignInEvent {
  id: string;
  uid: string;
  provider: 'google.com';
  deviceSummary: string;
  status: 'active' | 'ended';
  createdAt: Timestamp | null;
}

export type DemoPrinciple =
  | 'convenience'
  | 'loss-avoidance'
  | 'own-identity'
  | 'status'
  | 'emotion'
  | 'recognition'
  | 'stickiness'
  | 'journey'
  | 'analysis';
export type UnauthViewMode = 'side-by-side' | 'focused';
export type PortalTab = 'overview' | 'activity';
