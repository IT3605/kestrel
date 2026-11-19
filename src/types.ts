import type { Timestamp } from 'firebase/firestore';

export interface UserAccount {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  accountLabel: string;
  rememberTrustedDevice: boolean;
  requireStepUpForBilling: boolean;
  preferredAuthMethod: 'google';
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
  | 'analysis';
export type UnauthViewMode = 'side-by-side' | 'focused';
export type PortalTab = 'overview' | 'activity';
