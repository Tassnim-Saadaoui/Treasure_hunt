import type { AppRoute, ChallengeId } from '../../domain/hunt/types';
import { soundEngine } from '../../lib/audio/soundEngine';

interface TopNavBarProps {
  route: AppRoute;
  hasProfile: boolean;
  nextChallengeId: ChallengeId;
  onNavigate: (path: string, options?: { silent?: boolean }) => void;
}

export function TopNavBar({
  route,
  hasProfile,
  nextChallengeId,
  onNavigate,
}: TopNavBarProps) {
  const isRouteActive = (target: string) => {
    if (target === '/') return route.view === 'home';
    if (target === '/challenges') return route.view === 'challenge';
    return route.path === target;
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#051029]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-8 px-4 sm:px-6">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/');
          }}
          className="font-display text-base sm:text-lg font-bold tracking-wider text-[#F5C542] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F5C542]"
        >
          NATEG Hunt
        </a>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300" aria-label="Primary">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/');
            }}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-white ${
              isRouteActive('/') ? 'text-[#F5C542] underline underline-offset-8 decoration-2' : ''
            }`}
          >
            Trail
          </a>
          <a
            href={`/challenges/${nextChallengeId}`}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(`/challenges/${nextChallengeId}`);
            }}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-white ${
              isRouteActive('/challenges') ? 'text-[#F5C542] underline underline-offset-8 decoration-2' : ''
            }`}
          >
            Challenges
          </a>
          <a
            href="/rules"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/rules');
            }}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-white ${
              isRouteActive('/rules') ? 'text-[#F5C542] underline underline-offset-8 decoration-2' : ''
            }`}
          >
            Rules
          </a>
          <a
            href="/treasure"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/treasure');
            }}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-white ${
              isRouteActive('/treasure') ? 'text-[#F5C542] underline underline-offset-8 decoration-2' : ''
            }`}
          >
            Vault
          </a>
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => {
              soundEngine.play('stepUnlock');
              onNavigate(hasProfile ? `/challenges/${nextChallengeId}` : '/join', { silent: true });
            }}
            className="min-h-[40px] rounded-xl bg-[#C8102E] px-4 py-2 text-xs sm:text-sm font-semibold text-white transition-transform duration-150 hover:bg-[#E11D3F] active:scale-[0.98] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5C542]"
          >
            {hasProfile ? `Challenge ${nextChallengeId}` : 'Join Adventure'}
          </button>
        </div>
      </div>
    </header>
  );
}
