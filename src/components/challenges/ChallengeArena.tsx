import { ArrowLeft, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import type { ChallengeId } from '../../domain/hunt/types';

interface ChallengeArenaProps {
  challengeId: ChallengeId;
  completedIds: ChallengeId[];
  maxUnlockedId: ChallengeId;
  isUnlocked: boolean;
  onComplete: (id: ChallengeId) => void;
  onVoyageToMap: (fromId: ChallengeId) => void;
  onNavigate: (path: string, options?: { silent?: boolean }) => void;
}

export function ChallengeArena({
  challengeId,
  completedIds,
  maxUnlockedId,
  isUnlocked,
  onComplete,
  onVoyageToMap,
  onNavigate,
}: ChallengeArenaProps) {
  const isSolved = completedIds.includes(challengeId);
  const isFinalChallenge = challengeId === 6;

  const handleContinue = () => {
    if (isSolved) {
      onNavigate('/', { silent: true });
      return;
    }
    onComplete(challengeId);
    onVoyageToMap(challengeId);
  };

  if (!isUnlocked) {
    return (
      <section className="rounded-3xl border border-white/10 bg-[#0A1B42] p-8 text-center shadow-2xl">
        <Lock className="mx-auto h-8 w-8 text-[#F5C542]" />
        <h1 className="mt-4 font-display text-2xl font-bold text-white">This challenge is locked</h1>
        <p className="mt-2 text-sm text-slate-300">Complete challenge {maxUnlockedId} first.</p>
        <button
          type="button"
          onClick={() => onNavigate(`/challenges/${maxUnlockedId}`, { silent: true })}
          className="mt-6 inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-[#C8102E] px-6 py-3 text-sm font-bold text-white hover:bg-[#E11D3F]"
        >
          Go to challenge {maxUnlockedId}
          <ArrowRight className="h-4 w-4" />
        </button>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#0A1B42] shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-7">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-slate-300 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Hunt
        </button>
        <span className="text-xs font-semibold tracking-[0.16em] text-[#F5C542]">
          {challengeId} / 6
        </span>
      </div>

      <div className="flex min-h-[560px] flex-col items-center justify-center px-6 py-16 text-center sm:min-h-[620px] sm:px-10">
        <p className="font-display text-base font-bold tracking-[0.22em] text-[#F5C542]">NATEG HUNT</p>
        <h1 className="mt-5 font-display text-4xl font-bold text-white sm:text-5xl">
          Challenge {challengeId}
        </h1>
        <p className="mt-4 max-w-xs text-base leading-relaxed text-slate-300">
          Your next step is ready.
        </p>

        <button
          type="button"
          onClick={handleContinue}
          className="mt-12 inline-flex min-h-[62px] w-full max-w-sm items-center justify-center gap-3 rounded-full bg-[#C8102E] px-8 py-4 text-base font-bold tracking-wide text-white shadow-[0_10px_28px_rgba(200,16,46,0.45)] transition-transform hover:bg-[#E11D3F] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F5C542]"
        >
          {isSolved ? 'BACK TO THE HUNT' : isFinalChallenge ? 'YES, FINISH THE HUNT' : 'YES, CONTINUE'}
          {isSolved ? <CheckCircle2 className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
        </button>
      </div>
    </section>
  );
}
