import { useCallback, useEffect, useState } from 'react';
import type { AppRoute, ChallengeId } from '../../domain/hunt/types';
import { soundEngine } from '../audio/soundEngine';

function parsePathname(pathname: string): AppRoute {
  const normalized = pathname.replace(/\/+$/, '') || '/';

  const challengeMatch = normalized.match(/^\/challenges\/([1-6])$/);
  if (challengeMatch) {
    const id = Number(challengeMatch[1]) as ChallengeId;
    return {
      path: `/challenges/${id}`,
      view: 'challenge',
      challengeId: id,
    };
  }

  if (normalized === '/map') return { path: '/map', view: 'home' };
  return { path: '/', view: 'login' };
}

export function useAppRouter() {
  const [route, setRoute] = useState<AppRoute>(() => {
    if (typeof window === 'undefined') {
      return { path: '/', view: 'login' };
    }
    return parsePathname(window.location.pathname);
  });

  useEffect(() => {
    const handlePopState = () => {
      setRoute(parsePathname(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((targetPath: string, options?: { silent?: boolean }) => {
    if (!options?.silent) {
      soundEngine.play('click');
    }
    const nextRoute = parsePathname(targetPath);
    if (typeof window !== 'undefined' && window.location.pathname !== nextRoute.path) {
      window.history.pushState({}, '', nextRoute.path);
    }
    setRoute(nextRoute);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return { route, navigate };
}
