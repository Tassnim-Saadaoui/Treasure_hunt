import { useCallback, useEffect, useState } from 'react';
import type { HuntProgressRepository } from '../application/ports/HuntProgressRepository';
import {
  areAllChallengesCompleted,
  completeChallenge as completeChallengeProgress,
  createInitialProgressState,
  getNextChallengeId,
  joinHunt,
  recordHint,
  resetProgress,
  toggleSound as toggleSoundProgress,
} from '../domain/hunt/progress';
import { soundEngine } from '../lib/audio/soundEngine';
import type { ChallengeId, ExplorerProfile, HuntProgressState } from '../domain/hunt/types';

export function useTreasureHuntState(
  repository: HuntProgressRepository,
  isAuthenticated: boolean
) {
  const [state, setState] = useState(createInitialProgressState);
  const [isHydrated, setIsHydrated] = useState(false);
  const [persistenceError, setPersistenceError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;
    void repository.load().then((savedState) => {
      if (!isCurrent) return;
      setState(savedState);
      setIsHydrated(true);
    }).catch(() => {
      if (!isCurrent) return;
      setState(createInitialProgressState());
      setIsHydrated(true);
    });
    return () => {
      isCurrent = false;
    };
  }, [repository]);

  useEffect(() => {
    if (!isHydrated) return;
    soundEngine.setEnabled(state.soundEnabled);
  }, [isHydrated, repository, state]);

  useEffect(() => {
    if (!isHydrated || !isAuthenticated) return;
    let isCurrent = true;
    void repository.save(state).then(() => {
      if (isCurrent) setPersistenceError(null);
    }).catch((error: unknown) => {
      if (isCurrent) {
        setPersistenceError(
          error instanceof Error ? error.message : 'Could not save your adventure progress.'
        );
      }
    });
    return () => {
      isCurrent = false;
    };
  }, [isAuthenticated, isHydrated, repository, state]);

  const restoreProgress = useCallback((savedState: HuntProgressState) => {
    setState(savedState);
    setIsHydrated(true);
    setPersistenceError(null);
  }, []);

  const toggleSound = useCallback(() => {
    setState((current) => {
      const next = toggleSoundProgress(current);
      soundEngine.setEnabled(next.soundEnabled);
      if (next.soundEnabled) soundEngine.play('stepUnlock');
      return next;
    });
  }, []);

  const joinAdventure = useCallback((profile: Omit<ExplorerProfile, 'joinedAt'>) => {
    soundEngine.play('stepUnlock');
    setState((current) => joinHunt(current, profile));
  }, []);

  const onCompleteChallenge = useCallback((id: ChallengeId) => {
    setState((current) => completeChallengeProgress(current, id));
  }, []);

  const revealHint = useCallback((id: ChallengeId) => {
    soundEngine.play('hint');
    setState((current) => recordHint(current, id));
  }, []);

  const resetHunt = useCallback(() => {
    soundEngine.play('click');
    setState((current) => resetProgress(current));
  }, []);

  return {
    state,
    isHydrated,
    persistenceError,
    restoreProgress,
    nextRecommendedId: getNextChallengeId(state.completedIds),
    isAllCompleted: areAllChallengesCompleted(state.completedIds),
    toggleSound,
    joinAdventure,
    completeChallenge: onCompleteChallenge,
    revealHint,
    resetHunt,
  };
}
