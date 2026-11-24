import { useState } from 'react';
import { soundEngine } from '../../../lib/audio/soundEngine';

interface CompassPuzzleProps {
  isSolved: boolean;
  onSolve: () => void;
  onWrongAttempt: (message: string) => void;
}

const COMPASS_HEADINGS = [
  { deg: 0, label: 'N' },
  { deg: 45, label: 'NE' },
  { deg: 90, label: 'E' },
  { deg: 135, label: 'SE' },
  { deg: 180, label: 'S' },
  { deg: 225, label: 'SW' },
  { deg: 270, label: 'W' },
  { deg: 315, label: 'NW' },
] as const;

export function CompassPuzzle({ isSolved, onSolve, onWrongAttempt }: CompassPuzzleProps) {
  const [selectedDeg, setSelectedDeg] = useState<number>(isSolved ? 45 : 90);

  const handleSelectHeading = (deg: number) => {
    soundEngine.play('compassTick');
    setSelectedDeg(deg);
  };

  const handleVerify = () => {
    if (selectedDeg === 45) {
      soundEngine.play('correct');
      onSolve();
    } else {
      soundEngine.play('error');
      onWrongAttempt(
        `Route still points to ${selectedDeg} degrees. Start at East (90) and rotate 45 degrees counter-clockwise to reach the production node.`
      );
    }
  };

  const activeHeading = COMPASS_HEADINGS.find((h) => h.deg === selectedDeg);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-[#051029]/70 p-4 sm:p-5">
        <p className="text-sm text-slate-200 leading-relaxed">
          Deploy note: <span className="font-semibold text-[#F5C542]">"Packet starts at East (90 degrees). Turn 45 degrees counter-clockwise to reach the North-East production node."</span>
        </p>
      </div>

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-around">
        {/* Interactive Compass Dial */}
        <div className="relative flex h-52 w-52 items-center justify-center rounded-full border-4 border-[#F5C542]/80 bg-[#081A42] shadow-[0_0_30px_rgba(245,197,66,0.12)]">
          <svg viewBox="0 0 160 160" className="h-44 w-44" aria-hidden="true">
            <circle cx="80" cy="80" r="68" fill="#0B1F4F" stroke="#F5C542" strokeOpacity="0.35" strokeWidth="1.5" />
            <circle cx="80" cy="80" r="52" fill="none" stroke="#94A3B8" strokeOpacity="0.25" strokeDasharray="3 4" />
            <text x="80" y="24" textAnchor="middle" fill="#F5C542" fontSize="11" fontWeight="700">
              N
            </text>
            <text x="138" y="84" textAnchor="middle" fill="#CBD5E1" fontSize="11" fontWeight="700">
              E
            </text>
            <text x="80" y="143" textAnchor="middle" fill="#CBD5E1" fontSize="11" fontWeight="700">
              S
            </text>
            <text x="22" y="84" textAnchor="middle" fill="#CBD5E1" fontSize="11" fontWeight="700">
              W
            </text>
            <g
              style={{
                transform: `rotate(${selectedDeg}deg)`,
                transformOrigin: '80px 80px',
                transition: 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <polygon points="80,28 87,80 73,80" fill="#E11D3F" />
              <polygon points="80,132 87,80 73,80" fill="#60A5FA" />
            </g>
            <circle cx="80" cy="80" r="7" fill="#F5C542" stroke="#051029" strokeWidth="2" />
          </svg>
        </div>

        {/* Heading Selector Grid */}
        <div className="w-full max-w-xs space-y-4">
          <div className="flex items-baseline justify-between text-xs text-slate-300">
            <span>Selected Azimuth</span>
            <span className="font-mono text-base font-semibold text-[#F5C542] tabular-nums">
              {selectedDeg}° {activeHeading?.label}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {COMPASS_HEADINGS.map((heading) => {
              const active = heading.deg === selectedDeg;
              return (
                <button
                  key={heading.deg}
                  type="button"
                  onClick={() => handleSelectHeading(heading.deg)}
                  className={`min-h-[44px] rounded-xl border text-xs font-semibold tabular-nums transition-colors ${
                    active
                      ? 'border-[#F5C542] bg-[#F5C542] text-[#051029]'
                      : 'border-white/15 bg-[#0B1E48] text-slate-200 hover:border-white/35 hover:bg-[#10295E]'
                  }`}
                >
                  {heading.label}
                  <span className="block text-[10px] opacity-80">{heading.deg}°</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleVerify}
            className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[#C8102E] px-5 py-3 text-sm font-semibold text-white transition-transform duration-150 hover:bg-[#E11D3F] active:scale-[0.98]"
          >
            {isSolved ? 'Verified · 45° NE' : 'Lock Bearing'}
          </button>
        </div>
      </div>
    </div>
  );
}
