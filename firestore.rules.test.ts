/**
 * Payload-First Security TDD specification for Firestore Security Rules.
 * Verifies the "Dirty Dozen" adversarial payloads against the expected rule invariants.
 */

export interface SecurityTestCase {
  id: number;
  name: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  path: string;
  auth: { uid: string; email_verified: boolean } | null;
  payload?: Record<string, unknown>;
  expected: 'PERMISSION_DENIED';
  enforcingGate: string;
}

export const dirtyDozenTests: SecurityTestCase[] = [
  {
    id: 1,
    name: 'Cross-Tenant Profile Read',
    operation: 'get',
    path: '/users/userA',
    auth: { uid: 'userB', email_verified: true },
    expected: 'PERMISSION_DENIED',
    enforcingGate: 'isOwner(userId)',
  },
  {
    id: 2,
    name: 'Users Collection Enumeration',
    operation: 'list',
    path: '/users',
    auth: { uid: 'userA', email_verified: true },
    expected: 'PERMISSION_DENIED',
    enforcingGate: 'allow list: if false',
  },
  {
    id: 3,
    name: 'Identity Spoofing on Profile Create',
    operation: 'create',
    path: '/users/userB',
    auth: { uid: 'userB', email_verified: true },
    payload: {
      uid: 'userA',
      email: 'b@example.com',
      displayName: 'User B',
      photoURL: '',
      accountLabel: 'Personal',
      rememberTrustedDevice: true,
      requireStepUpForBilling: false,
      preferredAuthMethod: 'google',
    },
    expected: 'PERMISSION_DENIED',
    enforcingGate: 'isValidUserAccount -> data.uid == request.auth.uid',
  },
  {
    id: 4,
    name: 'Shadow Field Injection (isAdmin)',
    operation: 'create',
    path: '/users/userA',
    auth: { uid: 'userA', email_verified: true },
    payload: {
      uid: 'userA',
      email: 'a@example.com',
      displayName: 'User A',
      photoURL: '',
      accountLabel: 'Personal',
      rememberTrustedDevice: true,
      requireStepUpForBilling: false,
      preferredAuthMethod: 'google',
      isAdmin: true,
    },
    expected: 'PERMISSION_DENIED',
    enforcingGate: 'data.keys().hasOnly([...])',
  },
  {
    id: 5,
    name: 'Unverified Email Write',
    operation: 'create',
    path: '/users/userA',
    auth: { uid: 'userA', email_verified: false },
    expected: 'PERMISSION_DENIED',
    enforcingGate: 'isVerifiedUser()',
  },
  {
    id: 6,
    name: 'Client-Forged Timestamp',
    operation: 'create',
    path: '/users/userA',
    auth: { uid: 'userA', email_verified: true },
    payload: { createdAt: '2020-01-01T00:00:00Z' },
    expected: 'PERMISSION_DENIED',
    enforcingGate: 'incoming().createdAt == request.time',
  },
  {
    id: 7,
    name: 'Immutable UID Mutation on Update',
    operation: 'update',
    path: '/users/userA',
    auth: { uid: 'userA', email_verified: true },
    payload: { uid: 'userC' },
    expected: 'PERMISSION_DENIED',
    enforcingGate: 'affectedKeys().hasOnly(...) && incoming().uid == existing().uid',
  },
  {
    id: 8,
    name: 'Disallowed Provider Value',
    operation: 'create',
    path: '/users/userA',
    auth: { uid: 'userA', email_verified: true },
    payload: { preferredAuthMethod: 'password' },
    expected: 'PERMISSION_DENIED',
    enforcingGate: "data.preferredAuthMethod == 'google'",
  },
  {
    id: 9,
    name: 'Oversized DisplayName Resource Exhaustion',
    operation: 'update',
    path: '/users/userA',
    auth: { uid: 'userA', email_verified: true },
    payload: { displayName: 'x'.repeat(10000) },
    expected: 'PERMISSION_DENIED',
    enforcingGate: 'data.displayName.size() <= 100',
  },
  {
    id: 10,
    name: 'Path ID Poisoning on SignInEvent',
    operation: 'create',
    path: '/users/userA/signInEvents/bad$id!',
    auth: { uid: 'userA', email_verified: true },
    expected: 'PERMISSION_DENIED',
    enforcingGate: 'isValidId(eventId)',
  },
  {
    id: 11,
    name: 'Orphaned SignInEvent Without Parent Profile',
    operation: 'create',
    path: '/users/userA/signInEvents/ev1',
    auth: { uid: 'userA', email_verified: true },
    expected: 'PERMISSION_DENIED',
    enforcingGate: 'parentUserExists(userId)',
  },
  {
    id: 12,
    name: 'Terminal State Reversion on SignInEvent',
    operation: 'update',
    path: '/users/userA/signInEvents/ev1',
    auth: { uid: 'userA', email_verified: true },
    payload: { status: 'active' },
    expected: 'PERMISSION_DENIED',
    enforcingGate: "existing().status != 'ended'",
  },
];
