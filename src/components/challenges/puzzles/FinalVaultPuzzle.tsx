import { useState } from 'react';
import { ChevronDown, ChevronUp, KeyRound } from 'lucide-react';
import { CHALLENGES } from '../../../data/challenges';
import { soundEngine } from '../../../lib/audio/soundEngine';
import type { ChallengeId } from '../../../domain/hunt/types';

interface FinalVaultPuzzleProps {
  completedIds: ChallengeId[];
  isSolved: boolean;
  onSolve: () => void;
  onWrongAttempt: (message: string) => void;
}

export function FinalVaultPuzzle({
  completedIds,
  isSolved,
  onSolve,
  onWrongAttempt,
}: FinalVaultPuzzleProps) {
  const [digits, setDigits] = useState<[number, number, number, number]>(
    isSolved ? [4, 7, 2, 9] : [0, 0, 0, 0]
  );

  const firstFour = CHALLENGES.slice(0, 4);

  const adjustDigit = (slotIndex: number, delta: number) => {
    soundEngine.play('keyTurn');
    setDigits((prev) => {
      const next = [...prev] as [number, number, number, number];
      next[slotIndex] = (next[slotIndex] + delta + 10) % 10;
      return next;
    });
  };

  const handleUnlock = () => {
    if (digits.join('') === '4729') {
      soundEngine.play('treasureFanfare');
      onSolve();
    } else {
      soundEngine.play('error');
      onWrongAttempt(
        'Vault tumblers did not align. Combine the digits inside the Clue Tokens from Challenges 1 to 4 (N4, T7, G2, E9).'
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-[#051029]/70 p-4 sm:p-5 space-y-2">
        <p className="text-sm text-slate-200 leading-relaxed">
          Align the four golden key tumblers using the numeric digits from the first four Clue Tokens (<span className="font-mono text-[#F5C542]">N4 · T7 · G2 · E9</span>).
        </p>
        <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-300">
          {firstFour.map((c) => {
            const earned = completedIds.includes(c.id);
            return (
              <span key={c.id} className="font-mono tabular-nums">
                C{c.id}:{' '}
                <strong className={earned ? 'text-[#F5C542]' : 'text-slate-500'}>
                  {earned ? c.clueToken : 'Locked'}
                </strong>
              </span>
            );
          })}
        </div>
      </div>

      {/* 4 Tumbler Dials */}
      <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-md mx-auto">
        {digits.map((digit, index) => (
          <div
            key={index}
            className="flex flex-col items-center rounded-2xl border border-[#F5C542]/35 bg-[#081A42] p-2"
          >
            <button
              type="button"
              aria-label={`Increase tumbler ${index + 1}`}
              onClick={() => adjustDigit(index, 1)}
              className="flex min-h-[44px] w-full items-center justify-center rounded-xl text-slate-300 hover:bg-white/10 hover:text-[#F5C542]"
            >
              <ChevronUp className="h-5 w-5" />
            </button>
            <span className="py-2 font-mono text-2xl sm:text-3xl font-bold text-[#F5C542] tabular-nums">
              {digit}
            </span>
            <button
              type="button"
              aria-label={`Decrease tumbler ${index + 1}`}
              onClick={() => adjustDigit(index, -1)}
              className="flex min-h-[44px] w-full items-center justify-center rounded-xl text-slate-300 hover:bg-white/10 hover:text-[#F5C542]"
            >
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleUnlock}
        className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#C8102E] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(200,16,46,0.4)] transition-transform duration-150 hover:bg-[#E11D3F] active:scale-[0.98]"
      >
        <KeyRound className="h-4 w-4" />
        <span>{isSolved ? 'Vault Unlocked · 4-7-2-9' : 'Turn Golden Key'}</span>
      </button>
    </div>
  );
}
