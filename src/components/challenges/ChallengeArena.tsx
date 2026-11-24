import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Lightbulb, Volume2, VolumeX } from 'lucide-react';
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
  hintsUsed: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onComplete: (id: ChallengeId) => void;
  onRevealHint: (id: ChallengeId) => void;
  onNavigate: (path: string, options?: { silent?: boolean }) => void;
}

export function ChallengeArena({
  challengeId,
  completedIds,
  hintsUsed,
  soundEnabled,
  onToggleSound,
  onComplete,
  onRevealHint,
  onNavigate,
}: ChallengeArenaProps) {
  const challenge = getChallengeById(challengeId) ?? CHALLENGES[0];
  const isSolved = completedIds.includes(challenge.id);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  useEffect(() => {
    setFeedback(null);
  }, [challengeId]);

  const handleSolve = () => {
    onComplete(challenge.id);
    setFeedback({
      type: 'success',
      text: `${challenge.numberLabel} solved! Clue token ${challenge.clueToken} added to your expedition log.`,
    });
  };

  const handleWrongAttempt = (message: string) => {
    setFeedback({ type: 'error', text: message });
  };

  const nextId = challenge.id < CHALLENGES.length ? ((challenge.id + 1) as ChallengeId) : null;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Top Action Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="flex min-h-[44px] items-center gap-2 rounded-xl border border-white/15 bg-[#0A1B42] px-4 py-2 text-xs sm:text-sm font-medium text-slate-200 transition-colors hover:border-white/30 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Trail</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5" aria-label="Jump to stage">
            {CHALLENGES.map((item) => {
              const active = item.id === challenge.id;
              const done = completedIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(`/challenges/${item.id}`)}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border text-xs font-bold tabular-nums transition-colors ${
                    active
                      ? 'border-[#F5C542] bg-[#F5C542] text-[#051029]'
                      : done
                        ? 'border-[#F5C542]/40 bg-[#166534]/70 text-[#F5C542]'
                        : 'border-white/15 bg-[#0A1B42] text-slate-300 hover:border-white/35'
                  }`}
                >
                  {item.id}
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

      {/* Main Challenge Card */}
      <section className="rounded-3xl border border-white/10 bg-[#0A1B42] p-5 sm:p-8 shadow-2xl">
        <div className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#051029] p-2">
            <ChallengeIcon id={challenge.id} className="h-16 w-16" />
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
              <span className="font-semibold text-[#F5C542]">{challenge.numberLabel}</span>
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
                  `Solved · Clue token ${challenge.clueToken} recorded in your expedition log.`}
              </p>
            </div>

            {feedback?.type !== 'error' && (
              <button
                type="button"
                onClick={() => {
                  soundEngine.play(nextId ? 'stepUnlock' : 'treasureFanfare');
                  onNavigate(nextId ? `/challenges/${nextId}` : '/treasure', { silent: true });
                }}
                className="flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-xl bg-[#F5C542] px-4 py-2 text-xs font-bold text-[#051029] hover:bg-[#FDE047] whitespace-nowrap"
              >
                <span>{nextId ? `Next: Challenge ${nextId}` : 'Open Treasure Vault'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
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
    </div>
  );
}
