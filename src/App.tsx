/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChallengeArena } from './components/challenges/ChallengeArena';
import { FooterBanner } from './components/layout/FooterBanner';
import { TopNavBar } from './components/layout/TopNavBar';
import { ExpeditionSidePanel } from './components/map/ExpeditionSidePanel';
import { TreasureTrailMap, type VoyageTransition } from './components/map/TreasureTrailMap';
import { JoinAdventureView } from './components/views/JoinAdventureView';
import { RulesView } from './components/views/RulesView';
import { TreasureVaultView } from './components/views/TreasureVaultView';
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
    toggleSound,
    joinAdventure,
    completeChallenge,
    revealHint,
    resetHunt,
  } = useTreasureHuntState(huntProgressRepository);

  const handleSelectChallenge = (id: ChallengeId) => {
    setVoyageTransition(null);
    navigate(`/challenges/${id}`);
  };

  const handleVoyageToMap = useCallback((fromId: ChallengeId) => {
    const toId: ChallengeId | 'treasure' =
      fromId < 6 ? ((fromId + 1) as ChallengeId) : 'treasure';
    setVoyageTransition({ fromId, toId });
    navigate('/', { silent: true });
  }, [navigate]);

  const handleVoyageArrival = useCallback(() => {
    setVoyageTransition(null);
  }, []);

  useEffect(() => {
    if (route.path !== '/') setVoyageTransition(null);
  }, [route.path]);

  const handlePrimaryTrailCta = () => {
    setVoyageTransition(null);
    if (isAllCompleted) {
      navigate('/treasure', { silent: true });
      return;
    }
    if (!state.profile) {
      navigate('/join', { silent: true });
      return;
    }
    navigate(`/challenges/${nextRecommendedId}`, { silent: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#051029] text-slate-100">
      <TopNavBar
        route={route}
        hasProfile={Boolean(state.profile)}
        nextChallengeId={nextRecommendedId}
        onNavigate={navigate}
      />

      <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto max-w-6xl">
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
                <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
                  <div className="lg:col-span-7">
                    <TreasureTrailMap
                      completedIds={state.completedIds}
                      nextRecommendedId={nextRecommendedId}
                      maxUnlockedId={nextRecommendedId}
                      hasProfile={Boolean(state.profile)}
                      isAllCompleted={isAllCompleted}
                      voyageTransition={voyageTransition}
                      onVoyageArrival={handleVoyageArrival}
                      onSelectChallenge={handleSelectChallenge}
                      onPrimaryCta={handlePrimaryTrailCta}
                    />
                  </div>
                  <div className="lg:col-span-5 lg:sticky lg:top-20">
                    <ExpeditionSidePanel
                      profile={state.profile}
                      completedIds={state.completedIds}
                      nextRecommendedId={nextRecommendedId}
                      soundEnabled={state.soundEnabled}
                      onToggleSound={toggleSound}
                      onSelectChallenge={handleSelectChallenge}
                      onNavigate={navigate}
                    />
                  </div>
                </div>
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
                  hintsUsed={state.hintsUsedByChallenge[route.challengeId] ?? 0}
                  soundEnabled={state.soundEnabled}
                  onToggleSound={toggleSound}
                  onComplete={completeChallenge}
                  onVoyageToMap={handleVoyageToMap}
                  onRevealHint={revealHint}
                  onNavigate={navigate}
                />
              )}

              {route.view === 'join' && (
                <JoinAdventureView
                  existingProfile={state.profile}
                  onJoin={joinAdventure}
                  onNavigate={navigate}
                />
              )}

              {route.view === 'rules' && (
                <RulesView
                  soundEnabled={state.soundEnabled}
                  onToggleSound={toggleSound}
                  onNavigate={navigate}
                />
              )}

              {route.view === 'treasure' && (
                <TreasureVaultView
                  profile={state.profile}
                  completedIds={state.completedIds}
                  hintsUsedByChallenge={state.hintsUsedByChallenge}
                  startedAt={state.startedAt}
                  completedAt={state.completedAt}
                  onNavigate={navigate}
                  onReset={resetHunt}
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

      <FooterBanner
        onNavigate={navigate}
        onReset={() => {
          resetHunt();
          navigate('/');
        }}
      />
    </div>
  );
}
