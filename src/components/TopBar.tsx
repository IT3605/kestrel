import type { User } from 'firebase/auth';
import type { DemoPrinciple, PortalTab } from '../types';

interface TopBarProps {
  user: User | null;
  activePrinciple: DemoPrinciple;
  onChangePrinciple: (principle: DemoPrinciple) => void;
  activeTab: PortalTab;
  onChangeTab: (tab: PortalTab) => void;
  onSignOut: () => void;
  signingOut: boolean;
}

export function TopBar({
  user,
  activePrinciple,
  onChangePrinciple,
  activeTab,
  onChangeTab,
  onSignOut,
  signingOut,
}: TopBarProps) {
  const inDemoView = activePrinciple !== 'analysis';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-[1320px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line brand wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            onChangePrinciple('analysis');
            if (user) {
              onChangeTab('overview');
            }
          }}
          className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 rounded-sm"
        >
          Kestrel Portal
        </a>

        {/* Zone 2: Concise single-line navigation links (4–5 items) */}
        {!user ? (
          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
          >
            <button
              type="button"
              onClick={() => onChangePrinciple('analysis')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activePrinciple === 'analysis'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              Signup Impact
            </button>
            <button
              type="button"
              onClick={() => onChangePrinciple('convenience')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activePrinciple === 'convenience'
                  ? 'border-sky-700 text-slate-900'
                  : 'border-transparent hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              Google Sign-Up
            </button>
            <button
              type="button"
              onClick={() => onChangePrinciple('recognition')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activePrinciple === 'recognition'
                  ? 'border-emerald-700 text-slate-900'
                  : 'border-transparent hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              Recognition
            </button>
            <button
              type="button"
              onClick={() => onChangePrinciple('stickiness')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activePrinciple === 'stickiness'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              Stickiness
            </button>
          </nav>
        ) : (
          <nav
            aria-label="Account Navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
          >
            <button
              type="button"
              onClick={() => {
                onChangePrinciple('convenience');
                onChangeTab('overview');
              }}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activePrinciple === 'convenience' && activeTab === 'overview'
                  ? 'border-emerald-700 text-slate-900'
                  : 'border-transparent hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              My Account
            </button>
            <button
              type="button"
              onClick={() => onChangePrinciple('recognition')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activePrinciple === 'recognition'
                  ? 'border-emerald-700 text-slate-900'
                  : 'border-transparent hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              Recognition
            </button>
            <button
              type="button"
              onClick={() => onChangePrinciple('stickiness')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activePrinciple === 'stickiness'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              Stickiness
            </button>
            <button
              type="button"
              onClick={() => onChangePrinciple('analysis')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activePrinciple === 'analysis'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              Signup Impact
            </button>
          </nav>
        )}

        {/* Zone 3: Single primary action */}
        <div className="flex items-center shrink-0">
          {!user ? (
            inDemoView ? (
              <button
                type="button"
                onClick={() => onChangePrinciple('analysis')}
                className="px-4 py-2 min-h-[40px] text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
              >
                Signup Impact
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onChangePrinciple('convenience')}
                className="px-4 py-2 min-h-[40px] text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
              >
                Open Live Demos
              </button>
            )
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
