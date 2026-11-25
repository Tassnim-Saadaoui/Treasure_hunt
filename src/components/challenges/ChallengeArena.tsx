import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Lightbulb, Lock, Volume2, VolumeX } from 'lucide-react';
import { CHALLENGES, getChallengeById } from '../../data/challenges';
import { soundEngine } from '../../lib/audio/soundEngine';
import type { ChallengeId } from '../../domain/hunt/types';
import { ChallengeIcon } from '../artwork/ChallengeArtwork';
import { BridgeCrossingPuzzle } from './puzzles/BridgeCrossingPuzzle';
import { CompassPuzzle } from './puzzles/CompassPuzzle';
import { EncryptionPuzzle } from './puzzles/EncryptionPuzzle';
import { ExplorationMapPuzzle } from './puzzles/ExplorationMapPuzzle';
import { FinalVaultPuzzle } from './puzzles/FinalVaultPuzzle';
import { GearRiddlePuzzle } from './puzzles/GearRiddlePuzzle';

interface ChallengeArenaProps {
  challengeId: ChallengeId;
  completedIds: ChallengeId[];
  maxUnlockedId: ChallengeId;
  isUnlocked: boolean;
  hintsUsed: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onComplete: (id: ChallengeId) => void;
  onVoyageToMap: (fromId: ChallengeId) => void;
  onRevealHint: (id: ChallengeId) => void;
  onNavigate: (path: string, options?: { silent?: boolean }) => void;
}

export function ChallengeArena({
  challengeId,
  completedIds,
  maxUnlockedId,
  isUnlocked,
  hintsUsed,
  soundEnabled,
  onToggleSound,
  onComplete,
  onVoyageToMap,
  onRevealHint,
  onNavigate,
}: ChallengeArenaProps) {
  const challenge = getChallengeById(challengeId) ?? CHALLENGES[0];
  const isSolved = completedIds.includes(challenge.id);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );
  const [isReturningToMap, setIsReturningToMap] = useState(false);

  useEffect(() => {
    setFeedback(null);
    setIsReturningToMap(false);
  }, [challengeId]);

  useEffect(() => {
    if (!isReturningToMap) return;
    const timer = window.setTimeout(() => onVoyageToMap(challenge.id), 850);
    return () => window.clearTimeout(timer);
  }, [isReturningToMap, challenge.id, onVoyageToMap]);

  const handleSolve = () => {
    onComplete(challenge.id);
    setFeedback({
      type: 'success',
      text: `${challenge.numberLabel} cleared! Clue token ${challenge.clueToken} added to your log. Returning to the trail...`,
    });
    setIsReturningToMap(true);
  };

  const handleWrongAttempt = (message: string) => {
    setFeedback({ type: 'error', text: message });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Top Action Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => (isSolved ? onVoyageToMap(challenge.id) : onNavigate('/'))}
          className="flex min-h-[44px] items-center gap-2 rounded-xl border border-white/15 bg-[#0A1B42] px-4 py-2 text-xs sm:text-sm font-medium text-slate-200 transition-colors hover:border-white/30 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Map</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5" aria-label="Jump to stage">
            {CHALLENGES.map((item) => {
              const active = item.id === challenge.id;
              const done = completedIds.includes(item.id);
              const stageOpen = item.id <= maxUnlockedId || done;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (stageOpen) onNavigate(`/challenges/${item.id}`);
                  }}
                  disabled={!stageOpen}
                  aria-label={stageOpen ? `Go to Challenge ${item.id}` : `Challenge ${item.id} locked`}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border text-xs font-bold tabular-nums transition-colors ${
                    active
                      ? 'border-[#F5C542] bg-[#F5C542] text-[#051029]'
                      : done
                        ? 'border-[#F5C542]/40 bg-[#166534]/70 text-[#F5C542]'
                        : stageOpen
                          ? 'border-white/15 bg-[#0A1B42] text-slate-300 hover:border-white/35'
                          : 'border-white/10 bg-[#071433] text-slate-500'
                  }`}
                >
                  {stageOpen ? item.id : <Lock className="h-3.5 w-3.5" />}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-[#0A1B42] text-slate-200 hover:border-[#F5C542]/60 hover:text-[#F5C542]"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {!isUnlocked ? (
        <section className="space-y-5 rounded-3xl border border-white/10 bg-[#0A1B42] p-8 text-center shadow-2xl">
          <Lock className="mx-auto h-8 w-8 text-[#F5C542]" />
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#F5C542]">Next stage is still locked</p>
            <h1 className="font-display text-2xl font-bold text-white">
              Clear Challenge {maxUnlockedId} to continue
            </h1>
            <p className="text-sm text-slate-300">Follow the trail one step at a time.</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate(`/challenges/${maxUnlockedId}`, { silent: true })}
            className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-[#C8102E] px-6 py-3 text-sm font-semibold text-white hover:bg-[#E11D3F]"
          >
            <span>Go to Challenge {maxUnlockedId}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </section>
      ) : (
      /* Main Challenge Card */
      <section className="rounded-3xl border border-white/10 bg-[#0A1B42] p-5 sm:p-8 shadow-2xl">
        <div className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#051029] p-2">
            <ChallengeIcon id={challenge.id} className="h-16 w-16" />
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
              <span className="font-semibold text-[#F5C542]">{challenge.numberLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-emerald-300">{challenge.difficulty}</span>
              <span aria-hidden="true">·</span>
              <span>{challenge.discipline}</span>
              <span aria-hidden="true">·</span>
              <span>{challenge.locationHint}</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
              {challenge.title}
            </h1>
            <p className="max-w-2xl text-sm text-slate-300 leading-relaxed">
              {challenge.storyBrief}
            </p>
          </div>
        </div>

        {/* Active Puzzle Module */}
        <div className="pt-6">
          {challenge.id === 1 && (
            <CompassPuzzle
              isSolved={isSolved}
              onSolve={handleSolve}
              onWrongAttempt={handleWrongAttempt}
            />
          )}
          {challenge.id === 2 && (
            <GearRiddlePuzzle
              isSolved={isSolved}
              onSolve={handleSolve}
              onWrongAttempt={handleWrongAttempt}
            />
          )}
          {challenge.id === 3 && (
            <ExplorationMapPuzzle
              isSolved={isSolved}
              onSolve={handleSolve}
              onWrongAttempt={handleWrongAttempt}
            />
          )}
          {challenge.id === 4 && (
            <EncryptionPuzzle
              isSolved={isSolved}
              onSolve={handleSolve}
              onWrongAttempt={handleWrongAttempt}
            />
          )}
          {challenge.id === 5 && (
            <BridgeCrossingPuzzle
              isSolved={isSolved}
              onSolve={handleSolve}
              onWrongAttempt={handleWrongAttempt}
            />
          )}
          {challenge.id === 6 && (
            <FinalVaultPuzzle
              completedIds={completedIds}
              isSolved={isSolved}
              onSolve={handleSolve}
              onWrongAttempt={handleWrongAttempt}
            />
          )}
        </div>

        {/* Feedback Banner */}
        {(feedback || isSolved) && (
          <div
            role="status"
            className={`mt-6 flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between ${
              feedback?.type === 'error'
                ? 'border-[#E11D3F]/50 bg-[#C8102E]/15 text-red-100'
                : 'border-emerald-400/40 bg-emerald-950/50 text-emerald-100'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {feedback?.type !== 'error' && (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#F5C542]" />
              )}
              <p className="text-sm leading-relaxed">
                {feedback?.text ??
                  `Cleared · Clue token ${challenge.clueToken} recorded in your Captain's Log.`}
              </p>
            </div>

            {feedback?.type === 'success' && (
              <span className="shrink-0 text-xs font-bold text-emerald-300">Returning to map...</span>
            )}
          </div>
        )}

        {/* Progressive Hint Bar */}
        <div className="mt-6 border-t border-white/10 pt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-medium text-slate-400">
              Need assistance? Hints unlocked: {hintsUsed}/2
            </span>
            {hintsUsed < 2 && (
              <button
                type="button"
                onClick={() => onRevealHint(challenge.id)}
                className="flex min-h-[44px] items-center gap-2 rounded-xl border border-[#F5C542]/35 bg-[#051029] px-4 py-2 text-xs font-semibold text-[#F5C542] hover:bg-[#0D2152]"
              >
                <Lightbulb className="h-4 w-4" />
                <span>Reveal Hint {hintsUsed + 1}</span>
              </button>
            )}
          </div>

          {hintsUsed > 0 && (
            <div className="mt-3 space-y-2">
              {challenge.hints.slice(0, hintsUsed).map((hint, idx) => (
                <p
                  key={idx}
                  className="rounded-xl border border-white/10 bg-[#051029]/80 px-4 py-3 text-xs sm:text-sm text-slate-200"
                >
                  <strong className="text-[#F5C542]">Hint {idx + 1}:</strong> {hint}
                </p>
              ))}
            </div>
          )}
        </div>
      </section>
      )}
    </div>
  );
}
