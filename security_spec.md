# Security Specification & Payload-First TDD

## 1. Data Invariants
1. **Strict Ownership Isolation**: A `UserAccount` at `/users/{userId}` can only be read, created, or updated by the authenticated, email-verified user whose `request.auth.uid == userId`. Collection listing on `/users` is strictly denied (`allow list: if false`).
2. **Master Gate on Subcollection**: A `SignInEvent` at `/users/{userId}/signInEvents/{eventId}` cannot exist without a valid parent `UserAccount` at `/users/{userId}` owned by `request.auth.uid`.
3. **Immutable Identity & Creation Timestamp**: `uid` and `createdAt` must never change after document creation.
4. **Server-Enforced Temporal Integrity**: `createdAt` on create and `updatedAt` on create/update must strictly equal `request.time`.
5. **Bounded Payload & Strict Allowlisted Keys**: Every string has strict `.size()` bounds and IDs match `^[a-zA-Z0-9_\-]+$`; shadow fields and unverified emails (`email_verified != true`) are rejected.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Cross-Tenant Read**: User B attempts `get(/users/userA)` -> `PERMISSION_DENIED`.
2. **Collection Enumeration**: Signed-in user attempts `list(/users)` -> `PERMISSION_DENIED`.
3. **Identity Spoofing on Create**: User B attempts `create(/users/userB)` with `uid: "userA"` -> `PERMISSION_DENIED`.
4. **Shadow Field Injection**: User A creates `/users/userA` with extra field `isAdmin: true` -> `PERMISSION_DENIED`.
5. **Unverified Email Write**: User A with `email_verified: false` attempts `create(/users/userA)` -> `PERMISSION_DENIED`.
6. **Client-Forged Timestamp on Create**: User A sets `createdAt` to a past timestamp instead of `request.time` -> `PERMISSION_DENIED`.
7. **Immutable Field Mutation**: User A updates `/users/userA` changing `uid` or `createdAt` -> `PERMISSION_DENIED`.
8. **Disallowed Auth Provider**: User A sets `preferredAuthMethod: "password"` instead of `"google"` -> `PERMISSION_DENIED`.
9. **String Resource Exhaustion**: User A updates `displayName` with a 10,000-character string -> `PERMISSION_DENIED`.
10. **Path ID Poisoning**: User A writes to `/users/userA/signInEvents/bad$id!` -> `PERMISSION_DENIED`.
11. **Orphaned Subcollection Write**: User A creates `/users/userA/signInEvents/ev1` before `/users/userA` exists -> `PERMISSION_DENIED`.
12. **Terminal State Violation**: User A attempts to revert a `SignInEvent` from `status: "ended"` back to `"active"` -> `PERMISSION_DENIED`.
