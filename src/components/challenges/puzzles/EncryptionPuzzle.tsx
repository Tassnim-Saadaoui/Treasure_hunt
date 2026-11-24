import { useState, type FormEvent } from 'react';
import { soundEngine } from '../../../lib/audio/soundEngine';

interface EncryptionPuzzleProps {
  isSolved: boolean;
  onSolve: () => void;
  onWrongAttempt: (message: string) => void;
}

const BYTES = [
  { binary: '0100 1000', decimal: 72, index: 8 },
  { binary: '0101 0101', decimal: 85, index: 21 },
  { binary: '0100 1110', decimal: 78, index: 14 },
  { binary: '0101 0100', decimal: 84, index: 20 },
] as const;

export function EncryptionPuzzle({ isSolved, onSolve, onWrongAttempt }: EncryptionPuzzleProps) {
  const [answer, setAnswer] = useState<string>(isSolved ? 'HUNT' : '');
  const [inspectedIdx, setInspectedIdx] = useState<number | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleaned = answer.trim().toUpperCase();
    if (cleaned === 'HUNT') {
      soundEngine.play('correct');
      onSolve();
    } else {
      soundEngine.play('error');
      onWrongAttempt(
        'Incorrect cipher word. Remember: ASCII 65 = A (1st letter), 66 = B (2nd), ..., 72 = H (8th).'
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-[#051029]/70 p-4 sm:p-5 space-y-1.5">
        <p className="text-sm text-slate-200 leading-relaxed">
          Tap any 8-bit circuit register to inspect its decimal ASCII code, then enter the 4-letter passkey.
        </p>
        <p className="text-xs text-slate-400">
          Reference: 0100 0001 = 65 (A) · Alphabet position = Decimal − 64
        </p>
      </div>

      {/* Interactive Binary Circuit Registers */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {BYTES.map((byte, idx) => {
          const isInspected = inspectedIdx === idx;
          return (
            <button
              key={byte.binary}
              type="button"
              onClick={() => {
                soundEngine.play('hoverTick');
                setInspectedIdx(isInspected ? null : idx);
              }}
              className={`flex min-h-[76px] flex-col items-center justify-center rounded-xl border p-3 transition-colors ${
                isInspected
                  ? 'border-sky-400 bg-sky-950/60 text-sky-200'
                  : 'border-sky-500/30 bg-[#04182E] text-sky-300 hover:border-sky-400/70'
              }`}
            >
              <span className="font-mono text-sm font-semibold tracking-wider tabular-nums">
                {byte.binary}
              </span>
              <span className="mt-1.5 text-[11px] font-medium text-slate-300 tabular-nums">
                {isInspected ? `ASCII ${byte.decimal} · #${byte.index}` : 'Inspect Byte'}
              </span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="cipher-input" className="sr-only">
          Four-letter decoded passkey
        </label>
        <input
          id="cipher-input"
          type="text"
          maxLength={4}
          value={answer}
          onChange={(e) => {
            soundEngine.play('click');
            setAnswer(e.target.value.toUpperCase());
          }}
          placeholder="Enter 4-letter word"
          className="min-h-[48px] flex-1 rounded-xl border border-white/15 bg-[#051029] px-4 font-mono text-base font-semibold tracking-[0.25em] text-[#F5C542] uppercase placeholder:tracking-normal placeholder:text-slate-500 focus:border-[#F5C542] focus:outline-none"
        />
        <button
          type="submit"
          className="min-h-[48px] shrink-0 rounded-xl bg-[#C8102E] px-6 py-3 text-sm font-semibold text-white transition-transform duration-150 hover:bg-[#E11D3F] active:scale-[0.98] whitespace-nowrap"
        >
          {isSolved ? 'Decrypted · HUNT' : 'Decode Transmission'}
        </button>
      </form>
    </div>
  );
}
