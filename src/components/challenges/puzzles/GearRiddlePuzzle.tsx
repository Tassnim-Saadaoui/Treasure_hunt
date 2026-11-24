import { useState } from 'react';
import { soundEngine } from '../../../lib/audio/soundEngine';

interface GearRiddlePuzzleProps {
  isSolved: boolean;
  onSolve: () => void;
  onWrongAttempt: (message: string) => void;
}

export function GearRiddlePuzzle({ isSolved, onSolve, onWrongAttempt }: GearRiddlePuzzleProps) {
  const [direction, setDirection] = useState<'clockwise' | 'counter'>(isSolved ? 'clockwise' : 'counter');
  const [turns, setTurns] = useState<number>(isSolved ? 2 : 1);
  const [spinStep, setSpinStep] = useState<number>(0);

  const handleTestSpin = () => {
    soundEngine.play('gearClick');
    setSpinStep((prev) => prev + 1);
  };

  const handleVerify = () => {
    if (direction === 'clockwise' && turns === 2) {
      soundEngine.play('correct');
      onSolve();
    } else {
      soundEngine.play('error');
      onWrongAttempt(
        'Check the two parts separately: each gear mesh reverses direction, and the output speed is 24 / 12 = 2 turns. The middle gear changes direction, not the final ratio.'
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-[#051029]/70 p-4 sm:p-5 space-y-2">
        <p className="text-sm text-slate-200 leading-relaxed">
          Build farm schematic: <span className="font-semibold text-[#F5C542]">Gear A (24 teeth)</span> turns <span className="font-semibold text-white">1 full rotation clockwise</span>. It drives <span className="font-semibold text-white">Gear B (16 teeth)</span>, which drives <span className="font-semibold text-white">Gear C (12 teeth)</span>.
        </p>
        <p className="text-xs text-slate-300">
          Predict Gear C's direction and number of turns. No benchmarking laptop required.
        </p>
      </div>

      {/* Interactive Gear Train Preview */}
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-[#07163B] p-4 sm:flex-row sm:justify-between">
        <svg viewBox="0 0 260 110" className="h-28 w-full max-w-[260px]" aria-hidden="true">
          {/* Gear A */}
          <g
            style={{
              transform: `rotate(${spinStep * 90}deg)`,
              transformOrigin: '52px 55px',
              transition: 'transform 350ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <circle cx="52" cy="55" r="28" fill="#64748B" stroke="#CBD5E1" strokeWidth="4" strokeDasharray="7 4" />
            <circle cx="52" cy="55" r="10" fill="#07163B" />
            <line x1="52" y1="30" x2="52" y2="42" stroke="#F5C542" strokeWidth="3" strokeLinecap="round" />
          </g>
          <text x="52" y="102" textAnchor="middle" fill="#CBD5E1" fontSize="10" fontWeight="600">
            A · 24T
          </text>

          {/* Gear B */}
          <g
            style={{
              transform: `rotate(${-spinStep * 135}deg)`,
              transformOrigin: '124px 55px',
              transition: 'transform 350ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <circle cx="124" cy="55" r="21" fill="#94A3B8" stroke="#E2E8F0" strokeWidth="4" strokeDasharray="6 3.5" />
            <circle cx="124" cy="55" r="7" fill="#07163B" />
            <line x1="124" y1="37" x2="124" y2="46" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
          </g>
          <text x="124" y="102" textAnchor="middle" fill="#CBD5E1" fontSize="10" fontWeight="600">
            B · 16T
          </text>

          {/* Gear C */}
          <g
            style={{
              transform: `rotate(${spinStep * 180}deg)`,
              transformOrigin: '188px 55px',
              transition: 'transform 350ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <circle cx="188" cy="55" r="16" fill="#F5C542" stroke="#FEF08A" strokeWidth="3.5" strokeDasharray="5 3" />
            <circle cx="188" cy="55" r="5.5" fill="#07163B" />
            <line x1="188" y1="41" x2="188" y2="48" stroke="#051029" strokeWidth="2.5" strokeLinecap="round" />
          </g>
          <text x="188" y="102" textAnchor="middle" fill="#F5C542" fontSize="10" fontWeight="700">
            C · 12T
          </text>
        </svg>

        <button
          type="button"
          onClick={handleTestSpin}
          className="min-h-[44px] shrink-0 rounded-xl border border-[#F5C542]/40 bg-[#0B1E48] px-4 py-2 text-xs font-semibold text-[#F5C542] transition-colors hover:bg-[#10295E] whitespace-nowrap"
        >
          Pulse Drive Train
        </button>
      </div>

      {/* Controls */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <span className="block text-xs font-medium text-slate-300">Gear C Direction</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                soundEngine.play('gearClick');
                setDirection('clockwise');
              }}
              className={`min-h-[44px] rounded-xl border px-3 text-xs font-semibold transition-colors ${
                direction === 'clockwise'
                  ? 'border-[#F5C542] bg-[#F5C542] text-[#051029]'
                  : 'border-white/15 bg-[#0B1E48] text-slate-200 hover:border-white/35'
              }`}
            >
              Clockwise
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.play('gearClick');
                setDirection('counter');
              }}
              className={`min-h-[44px] rounded-xl border px-3 text-xs font-semibold transition-colors ${
                direction === 'counter'
                  ? 'border-[#F5C542] bg-[#F5C542] text-[#051029]'
                  : 'border-white/15 bg-[#0B1E48] text-slate-200 hover:border-white/35'
              }`}
            >
              Counter-Clockwise
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <span className="block text-xs font-medium text-slate-300">Gear C Rotations</span>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => {
                  soundEngine.play('gearClick');
                  setTurns(val);
                }}
                className={`min-h-[44px] rounded-xl border text-xs font-semibold tabular-nums transition-colors ${
                  turns === val
                    ? 'border-[#F5C542] bg-[#F5C542] text-[#051029]'
                    : 'border-white/15 bg-[#0B1E48] text-slate-200 hover:border-white/35'
                }`}
              >
                {val} {val === 1 ? 'Turn' : 'Turns'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleVerify}
        className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[#C8102E] px-5 py-3 text-sm font-semibold text-white transition-transform duration-150 hover:bg-[#E11D3F] active:scale-[0.98]"
      >
        {isSolved ? 'Verified · Clockwise, 2 Turns' : 'Submit Gear Solution'}
      </button>
    </div>
  );
}
