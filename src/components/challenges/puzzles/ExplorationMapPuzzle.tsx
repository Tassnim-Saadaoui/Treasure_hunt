import { useState } from 'react';
import { Compass, MapPin } from 'lucide-react';
import { soundEngine } from '../../../lib/audio/soundEngine';

interface ExplorationMapPuzzleProps {
  isSolved: boolean;
  onSolve: () => void;
  onWrongAttempt: (message: string) => void;
}

const SECTORS = [
  { id: 'A1', label: 'Docs', note: 'The README says "just run the tests." The tests disagree.' },
  { id: 'A2', label: 'Auth', note: 'Login works, unless you are logged out.' },
  { id: 'A3', label: 'Cache', note: 'Serving yesterday\'s fix with today\'s confidence.' },
  { id: 'A4', label: 'CDN', note: 'Fast, global, and confidently serving the wrong build.' },
  { id: 'B1', label: 'API Gateway', note: 'Every request gets a ticket. Some even get responses.' },
  { id: 'B2', label: 'Queue', note: 'Your job is number 847. It is optimistic.' },
  { id: 'B3', label: 'Worker', note: 'The worker is alive and waiting for its database connection.' },
  { id: 'B4', label: 'Metrics', note: 'Everything is green because the dashboard stopped checking.' },
  { id: 'C1', label: 'Search', note: 'Found 0 results for "why is production down".' },
  { id: 'C2', label: 'Logs', note: 'Forty-seven lines of stack trace; one useful clue.' },
  { id: 'C3', label: 'Database', note: 'The database is returning 500s. It would like everyone to remain calm.' },
  { id: 'C4', label: 'Billing', note: 'No charges were made during this incident. Probably.' },
  { id: 'D1', label: 'Web UI', note: 'The button is centered. The API is still down.' },
  { id: 'D2', label: 'Object Store', note: 'Contains 19 copies of final-final-v3.zip.' },
  { id: 'D3', label: 'Notifications', note: 'Sent the incident alert to the service that caused it.' },
  { id: 'D4', label: 'Rate Limiter', note: 'Blocking retries and, briefly, the CEO.' },
];

export function ExplorationMapPuzzle({
  isSolved,
  onSolve,
  onWrongAttempt,
}: ExplorationMapPuzzleProps) {
  const [selectedId, setSelectedId] = useState<string>(isSolved ? 'C3' : 'B3');

  const selectedSector = SECTORS.find((s) => s.id === selectedId) ?? SECTORS[0];

  const handleSelectSector = (id: string) => {
    soundEngine.play('click');
    setSelectedId(id);
  };

  const handleVerify = () => {
    if (selectedId === 'C3') {
      soundEngine.play('correct');
      onSolve();
    } else {
      soundEngine.play('error');
      onWrongAttempt(
        `The trace does not point to ${selectedSector.label} (${selectedId}). Find the Worker and inspect the service directly south of it.`
      );
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-white/10 bg-[#051029]/70 p-4 sm:p-5 space-y-1.5">
        <p className="text-sm text-slate-200 leading-relaxed">
          Incident trace: <span className="font-semibold text-[#F5C542]">"The service returning 500 is directly south of the Worker."</span>
        </p>
        <p className="text-xs text-slate-300">
          Scan the service map, follow the trace, and identify the failing service.
        </p>
      </div>

      {/* 4x4 Interactive Sector Grid */}
      <div className="grid grid-cols-4 gap-2">
        {SECTORS.map((sector) => {
          const isSelected = sector.id === selectedId;
          const isLandmark = sector.id === 'A3' || sector.id === 'B3';
          return (
            <button
              key={sector.id}
              type="button"
              onClick={() => handleSelectSector(sector.id)}
              className={`flex min-h-[58px] flex-col items-start justify-between rounded-xl border p-2 text-left transition-colors ${
                isSelected
                  ? 'border-[#F5C542] bg-[#F5C542]/15 text-white'
                  : 'border-white/10 bg-[#07163B] text-slate-300 hover:border-white/30 hover:bg-[#0B1E48]'
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#F5C542] tabular-nums">
                  {sector.id}
                </span>
                {isLandmark && <Compass className="h-3.5 w-3.5 text-sky-400" />}
                {isSelected && !isLandmark && <MapPin className="h-3.5 w-3.5 text-[#F5C542]" />}
              </div>
              <span className="w-full truncate text-[11px] font-medium leading-tight">
                {sector.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Sector Field Note */}
      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#051029]/80 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400">
            Scanning Sector {selectedSector.id} · {selectedSector.label}
          </p>
          <p className="mt-0.5 text-sm text-slate-100">{selectedSector.note}</p>
        </div>
        <button
          type="button"
          onClick={handleVerify}
          className="min-h-[44px] shrink-0 rounded-xl bg-[#C8102E] px-5 py-2.5 text-sm font-semibold text-white transition-transform duration-150 hover:bg-[#E11D3F] active:scale-[0.98] whitespace-nowrap"
        >
          {isSolved ? 'Incident Located · C3' : 'Confirm Service'}
        </button>
      </div>
    </div>
  );
}
