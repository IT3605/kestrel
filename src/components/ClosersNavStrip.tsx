import type { DemoPrinciple } from '../types';

interface ClosersNavStripProps {
  activePrinciple: DemoPrinciple;
  onChangePrinciple: (principle: DemoPrinciple) => void;
}

const CLOSERS_ITEMS: {
  id: Exclude<DemoPrinciple, 'analysis'>;
  letter: string;
  label: string;
  activeClass: string;
}[] = [
  {
    id: 'convenience',
    letter: 'C',
    label: 'Convenience',
    activeClass: 'bg-sky-700 text-white border-sky-700',
  },
  {
    id: 'loss-avoidance',
    letter: 'L',
    label: 'Loss Avoidance',
    activeClass: 'bg-rose-700 text-white border-rose-700',
  },
  {
    id: 'own-identity',
    letter: 'O',
    label: 'Own Identity',
    activeClass: 'bg-violet-700 text-white border-violet-700',
  },
  {
    id: 'status',
    letter: 'S',
    label: 'Status',
    activeClass: 'bg-amber-700 text-white border-amber-700',
  },
  {
    id: 'emotion',
    letter: 'E',
    label: 'Emotion',
    activeClass: 'bg-orange-600 text-white border-orange-600',
  },
  {
    id: 'recognition',
    letter: 'R',
    label: 'Recognition',
    activeClass: 'bg-emerald-700 text-white border-emerald-700',
  },
  {
    id: 'stickiness',
    letter: 'S',
    label: 'Stickiness',
    activeClass: 'bg-slate-900 text-white border-slate-900',
  },
];

export function ClosersNavStrip({
  activePrinciple,
  onChangePrinciple,
}: ClosersNavStripProps) {
  return (
    <div className="mb-6 pb-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
      <div
        role="navigation"
        aria-label="CLOSERS 7 Triggers"
        className="flex flex-wrap items-center gap-1.5"
      >
        {CLOSERS_ITEMS.map((item, idx) => {
          const isActive = activePrinciple === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChangePrinciple(item.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? item.activeClass
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="font-mono font-bold">{idx + 1}. {item.letter}</span>
              <span className={isActive ? 'text-white/95' : 'text-slate-600'}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onChangePrinciple('analysis')}
        className="text-xs font-semibold text-slate-900 hover:text-emerald-700 underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer"
      >
        View Signup Impact Analysis
      </button>
    </div>
  );
}
