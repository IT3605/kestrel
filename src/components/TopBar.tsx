import type { User } from 'firebase/auth';
import type { PortalTab, UnauthViewMode } from '../types';

interface TopBarProps {
  user: User | null;
  unauthMode: UnauthViewMode;
  onChangeUnauthMode: (mode: UnauthViewMode) => void;
  activeTab: PortalTab;
  onChangeTab: (tab: PortalTab) => void;
  onSignOut: () => void;
  signingOut: boolean;
}

export function TopBar({
  user,
  unauthMode,
  onChangeUnauthMode,
  activeTab,
  onChangeTab,
  onSignOut,
  signingOut,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-[1320px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line brand wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            if (!user) {
              onChangeUnauthMode('side-by-side');
            } else {
              onChangeTab('overview');
            }
          }}
          className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 rounded-sm"
        >
          Kestrel Portal
        </a>

        {/* Zone 2: End-user friendly navigation links */}
        {!user ? (
          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
          >
            <button
              type="button"
              onClick={() => onChangeUnauthMode('side-by-side')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                unauthMode === 'side-by-side'
                  ? 'border-emerald-700 text-slate-900'
                  : 'border-transparent hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              Before &amp; After
            </button>
            <button
              type="button"
              onClick={() => onChangeUnauthMode('focused')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                unauthMode === 'focused'
                  ? 'border-emerald-700 text-slate-900'
                  : 'border-transparent hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              New Login Page
            </button>
            <a
              href="#what-changed"
              className="py-1 border-b-2 border-transparent hover:text-slate-900 hover:border-slate-300 transition-colors whitespace-nowrap shrink-0"
            >
              What Changed
            </a>
            <a
              href="#benefits"
              className="py-1 border-b-2 border-transparent hover:text-slate-900 hover:border-slate-300 transition-colors whitespace-nowrap shrink-0"
            >
              Benefits
            </a>
          </nav>
        ) : (
          <nav
            aria-label="Account Navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
          >
            <button
              type="button"
              onClick={() => onChangeTab('overview')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'overview'
                  ? 'border-emerald-700 text-slate-900'
                  : 'border-transparent hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              My Account
            </button>
            <button
              type="button"
              onClick={() => onChangeTab('activity')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'activity'
                  ? 'border-emerald-700 text-slate-900'
                  : 'border-transparent hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              Recent Sign-Ins
            </button>
          </nav>
        )}

        {/* Zone 3: Single primary action */}
        <div className="flex items-center shrink-0">
          {!user ? (
            <button
              type="button"
              onClick={() =>
                onChangeUnauthMode(unauthMode === 'side-by-side' ? 'focused' : 'side-by-side')
              }
              className="px-4 py-2 min-h-[40px] text-sm font-medium text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              {unauthMode === 'side-by-side' ? 'Preview New Page' : 'Compare Before & After'}
            </button>
          ) : (
            <button
              type="button"
              onClick={onSignOut}
              disabled={signingOut}
              className="px-4 py-2 min-h-[40px] text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-60 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              {signingOut ? 'Signing out...' : 'Sign out'}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
