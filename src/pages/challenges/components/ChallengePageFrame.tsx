import { ArrowRight } from 'lucide-react';
import type { ChallengeId } from '../../../domain/hunt/types';
import type { ChallengePageProps } from '../types';

interface ChallengePageFrameProps extends ChallengePageProps {
  challengeId: ChallengeId;
}

export function ChallengePageFrame({
  challengeId,
  completedIds,
  isUnlocked,
  onComplete,
  onVoyageToMap,
}: ChallengePageFrameProps) {
  const isSolved = completedIds.includes(challengeId);

  const handleContinue = () => {
    if (!isUnlocked) return;
    if (!isSolved) onComplete(challengeId);
    onVoyageToMap(challengeId);
  };

  return (
    <section className="flex min-h-[calc(100svh-5rem)] items-center justify-center">
      <button
        type="button"
        onClick={handleContinue}
        disabled={!isUnlocked}
        className="flex min-h-[62px] w-full max-w-sm items-center justify-center gap-3 rounded-full bg-[#C8102E] px-8 py-4 text-base font-bold tracking-wide text-white shadow-[0_10px_28px_rgba(200,16,46,0.45)] transition-transform hover:bg-[#E11D3F] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        YES, CONTINUE <ArrowRight className="h-5 w-5" />
      </button>
    </section>
  );
}
