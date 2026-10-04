import { Logo } from './Logo';
import type { Page } from '@/types';

const NAV_ITEMS: { label: string; page: Page }[] = [
  { label: 'How It Works', page: 'landing' },
  { label: 'Investigations', page: 'investigations' },
  { label: 'Evidence Universe', page: 'evidence' },
  { label: 'Conflicts', page: 'conflicts' },
  { label: 'Case History', page: 'history' },
];

export function Navbar({
  currentPage,
  onNavigate,
  onStartInvestigation,
}: {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onStartInvestigation: () => void;
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-subtle">
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 group"
          aria-label="VeriScope home"
        >
          <Logo size={30} className="transition-transform group-hover:rotate-12 duration-500" />
          <div className="text-left">
            <div className="text-base font-bold tracking-widest text-white leading-none">VERISCOPE</div>
            <div className="text-[9px] font-mono text-cyan-glow/70 tracking-[0.2em] mt-0.5">
              INTELLIGENT DOCUMENT INVESTIGATION
            </div>
          </div>
        </button>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                currentPage === item.page
                  ? 'text-cyan-glow bg-cyan-glow/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={onStartInvestigation}
          className="group relative px-4 py-2 text-xs font-bold tracking-wider uppercase rounded-lg overflow-hidden transition-transform hover:scale-105"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-cosmos-500 to-cyan-glow opacity-90" />
          <span className="absolute inset-0 bg-gradient-to-r from-cosmos-500 to-cyan-glow opacity-50 blur-md group-hover:opacity-80 transition-opacity" />
          <span className="relative text-white">Start Investigation</span>
        </button>
      </div>

      {/* Mobile nav */}
      <nav className="lg:hidden flex items-center gap-1 px-6 pb-2 overflow-x-auto">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.page}
            onClick={() => onNavigate(item.page)}
            className={`whitespace-nowrap px-3 py-1 text-[11px] font-medium rounded transition-colors ${
              currentPage === item.page ? 'text-cyan-glow bg-cyan-glow/10' : 'text-gray-400'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
