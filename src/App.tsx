/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useTreasureHuntState } from './hooks/useTreasureHuntState';
import { huntProgressRepository } from './infrastructure/persistence/LocalStorageHuntProgressRepository';
import { getAvatarPublicUrl, type PlayerAuthResult, type PlayerRecord } from './infrastructure/persistence/PlayerAuthClient';
import { useAppRouter } from './lib/router/useAppRouter';
import type { ChallengeId } from './domain/hunt/types';
import { HomePage } from './pages/home/page';
import { DroneDeliveryTransition } from './pages/home/components/DroneDeliveryTransition';
import { ChatbotParadoxTransition } from './pages/home/components/ChatbotParadoxTransition';
import { ChallengePages } from './pages/challenges/page';
import type { VoyageTransition } from './pages/home/components/TreasureTrailMap';
import { PlayerAuthPage } from './pages/Login/Page';
import { UserRound } from 'lucide-react';

export default function App() {
  const { route, navigate } = useAppRouter();
  const [voyageTransition, setVoyageTransition] = useState<VoyageTransition | null>(null);
  const [isDroneEntryActive, setIsDroneEntryActive] = useState(false);
  const [isChatbotEntryActive, setIsChatbotEntryActive] = useState(false);
  const [authStatus, setAuthStatus] = useState<'anonymous' | 'authenticated'>('anonymous');
  const [player, setPlayer] = useState<PlayerRecord | null>(null);
  const {
    state,
    isHydrated,
    persistenceError,
    restoreProgress,
    nextRecommendedId,
    isAllCompleted,
    completeChallenge,
  } = useTreasureHuntState(huntProgressRepository, authStatus === 'authenticated');

  useEffect(() => {
    if (authStatus === 'anonymous' && route.view !== 'login') {
      navigate('/', { silent: true });
    } else if (authStatus === 'authenticated' && route.view === 'login') {
      navigate('/map', { silent: true });
    }
  }, [authStatus, navigate, route.view]);

  const handleAuthenticated = useCallback((result: PlayerAuthResult) => {
    restoreProgress(result.progress);
    setPlayer(result.player);
    setAuthStatus('authenticated');
    navigate('/map', { silent: true });
  }, [navigate, restoreProgress]);

  const handleSelectChallenge = useCallback((id: ChallengeId) => {
    if (id === 3) {
      setIsDroneEntryActive(true);
      return;
    }
    if (id === 5) {
      setIsChatbotEntryActive(true);
      return;
    }
    navigate(`/challenges/${id}`);
  }, [navigate]);

  const handlePrimaryTrailCta = useCallback(() => {
    if (isAllCompleted) return;
    handleSelectChallenge(nextRecommendedId);
  }, [handleSelectChallenge, isAllCompleted, nextRecommendedId]);

  useEffect(() => {
    if (!isDroneEntryActive) return;
    const timeoutId = window.setTimeout(() => {
      setIsDroneEntryActive(false);
      navigate('/challenges/3', { silent: true });
    }, 2400);
    return () => window.clearTimeout(timeoutId);
  }, [isDroneEntryActive, navigate]);

  useEffect(() => {
    if (!isChatbotEntryActive) return;
    const timeoutId = window.setTimeout(() => {
      setIsChatbotEntryActive(false);
      navigate('/challenges/5', { silent: true });
    }, 2700);
    return () => window.clearTimeout(timeoutId);
  }, [isChatbotEntryActive, navigate]);

  const handleVoyageToMap = useCallback((fromId: ChallengeId) => {
    setVoyageTransition({ fromId, toId: fromId === 6 ? 'treasure' : ((fromId + 1) as ChallengeId) });
    navigate('/map', { silent: true });
  }, [navigate]);

  const handleVoyageArrival = useCallback(() => {
    setVoyageTransition(null);
  }, []);

  if (authStatus === 'authenticated' && !isHydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#061535] p-6 text-center text-slate-300">
        <p role="status">Loading your adventure…</p>
      </main>
    );
  }

  if (route.view === 'login') {
    return <PlayerAuthPage onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#051029] text-slate-100">
      <DroneDeliveryTransition
        isActive={isDroneEntryActive}
      />
      <ChatbotParadoxTransition isActive={isChatbotEntryActive} />
      <main className="flex-1 px-2 py-2 sm:px-6 sm:py-8 lg:px-10">
        <div className="mx-auto w-full max-w-[1200px]">
          {isHydrated && authStatus === 'authenticated' ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={route.path}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              >
              {persistenceError && (
                <p role="alert" className="mb-4 rounded-xl border border-red-400/40 bg-red-950/50 px-4 py-3 text-sm text-red-100">
                  Progress could not be saved to your account: {persistenceError}
                </p>
              )}
              {route.view === 'home' && (
                <div>
                  {player && (
                    <section
                      aria-label="Player profile"
                      className="mb-4 flex items-center gap-3 rounded-2xl border border-[#F5C542]/25 bg-[#0A1B42] p-3 sm:p-4"
                    >
                      {getAvatarPublicUrl(player.avatar) ? (
                        <img
                          src={getAvatarPublicUrl(player.avatar)}
                          alt={`${player.nickname}'s avatar`}
                          className="h-14 w-14 rounded-xl border border-[#F5C542]/60 object-cover"
                        />
                      ) : (
                        <span className="flex h-14 w-14 items-center justify-center rounded-xl border border-[#F5C542]/60 bg-[#051029] text-[#F5C542]">
                          <UserRound className="h-7 w-7" />
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="truncate font-bold text-white">{player.nickname}</p>
                        <p className="text-xs text-slate-300">
                          Score {player.score} · Challenge {Math.min(6, nextRecommendedId)} · {state.completedIds.length}/6 completed
                        </p>
                      </div>
                    </section>
                  )}
                  <HomePage
                    completedIds={state.completedIds}
                    nextRecommendedId={nextRecommendedId}
                    maxUnlockedId={nextRecommendedId}
                    isAllCompleted={isAllCompleted}
                    voyageTransition={voyageTransition}
                    onVoyageArrival={handleVoyageArrival}
                    onSelectChallenge={handleSelectChallenge}
                    onPrimaryCta={handlePrimaryTrailCta}
                  />
                </div>
              )}

              {route.view === 'challenge' && (
                <ChallengePages
                  challengeId={route.challengeId}
                  completedIds={state.completedIds}
                  isUnlocked={
                    route.challengeId <= nextRecommendedId ||
                    state.completedIds.includes(route.challengeId)
                  }
                  onComplete={completeChallenge}
                  onVoyageToMap={handleVoyageToMap}
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
