/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChallengeArena } from './components/challenges/ChallengeArena';
import { TopNavBar } from './components/layout/TopNavBar';
import { TreasureTrailMap, type VoyageTransition } from './components/map/TreasureTrailMap';
import { useTreasureHuntState } from './hooks/useTreasureHuntState';
import { huntProgressRepository } from './infrastructure/persistence/LocalStorageHuntProgressRepository';
import { useAppRouter } from './lib/router/useAppRouter';
import type { ChallengeId } from './domain/hunt/types';

export default function App() {
  const { route, navigate } = useAppRouter();
  const [voyageTransition, setVoyageTransition] = useState<VoyageTransition | null>(null);
  const {
    state,
    isHydrated,
    nextRecommendedId,
    isAllCompleted,
    completeChallenge,
  } = useTreasureHuntState(huntProgressRepository);

  const handleSelectChallenge = (id: ChallengeId) => {
    navigate(`/challenges/${id}`);
  };

  const handlePrimaryTrailCta = useCallback(() => {
    if (isAllCompleted) return;
    navigate(`/challenges/${nextRecommendedId}`, { silent: true });
  }, [isAllCompleted, navigate, nextRecommendedId]);

  const handleVoyageToMap = useCallback((fromId: ChallengeId) => {
    setVoyageTransition({ fromId, toId: fromId === 6 ? 'treasure' : ((fromId + 1) as ChallengeId) });
    navigate('/', { silent: true });
  }, [navigate]);

  const handleVoyageArrival = useCallback(() => {
    setVoyageTransition(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#051029] text-slate-100">
      <TopNavBar />

      <main className="flex-1 px-3 py-4 sm:px-6 sm:py-8 lg:px-10">
        <div className="mx-auto w-full max-w-[1600px]">
          {isHydrated ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={route.path}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              >
              {route.view === 'home' && (
                <TreasureTrailMap
                  completedIds={state.completedIds}
                  nextRecommendedId={nextRecommendedId}
                  maxUnlockedId={nextRecommendedId}
                  isAllCompleted={isAllCompleted}
                  voyageTransition={voyageTransition}
                  onVoyageArrival={handleVoyageArrival}
                  onSelectChallenge={handleSelectChallenge}
                  onPrimaryCta={handlePrimaryTrailCta}
                />
              )}

              {route.view === 'challenge' && (
                <ChallengeArena
                  challengeId={route.challengeId}
                  completedIds={state.completedIds}
                  maxUnlockedId={nextRecommendedId}
                  isUnlocked={
                    route.challengeId <= nextRecommendedId ||
                    state.completedIds.includes(route.challengeId)
                  }
                  onComplete={completeChallenge}
                  onVoyageToMap={handleVoyageToMap}
                  onNavigate={navigate}
                />
              )}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div
              role="status"
              className="rounded-2xl border border-white/10 bg-[#0A1B42] p-8 text-center text-slate-300"
            >
              Loading your expedition...
            </div>
          )}
        </div>
      </main>

    </div>
  );
}
