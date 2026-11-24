import { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { soundEngine } from '../../../lib/audio/soundEngine';

interface BridgeCrossingPuzzleProps {
  isSolved: boolean;
  onSolve: () => void;
  onWrongAttempt: (message: string) => void;
}

interface ExplorerUnit {
  id: string;
  name: string;
  minutes: number;
}

const TEAM_MEMBERS: ExplorerUnit[] = [
  { id: 'amine', name: 'Amine', minutes: 1 },
  { id: 'sara', name: 'Sara', minutes: 2 },
  { id: 'youssef', name: 'Youssef', minutes: 5 },
  { id: 'lina', name: 'Lina', minutes: 10 },
];

export function BridgeCrossingPuzzle({
  isSolved,
  onSolve,
  onWrongAttempt,
}: BridgeCrossingPuzzleProps) {
  const [eastIds, setEastIds] = useState<string[]>(isSolved ? TEAM_MEMBERS.map((m) => m.id) : []);
  const [lanternSide, setLanternSide] = useState<'west' | 'east'>(isSolved ? 'east' : 'west');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [elapsedMinutes, setElapsedMinutes] = useState<number>(isSolved ? 17 : 0);

  const westMembers = TEAM_MEMBERS.filter((m) => !eastIds.includes(m.id));
  const eastMembers = TEAM_MEMBERS.filter((m) => eastIds.includes(m.id));

  const toggleMember = (id: string, side: 'west' | 'east') => {
    if (side !== lanternSide) {
      soundEngine.play('error');
      return;
    }
    soundEngine.play('click');
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const handleCross = () => {
    if (selectedIds.length === 0) {
      soundEngine.play('error');
      onWrongAttempt('Select 1 or 2 explorers on the side with the lantern before crossing.');
      return;
    }

    const travelers = TEAM_MEMBERS.filter((m) => selectedIds.includes(m.id));
    const tripMinutes = Math.max(...travelers.map((t) => t.minutes));
    const nextElapsed = elapsedMinutes + tripMinutes;

    const nextEastIds =
      lanternSide === 'west'
        ? [...eastIds, ...selectedIds]
        : eastIds.filter((id) => !selectedIds.includes(id));

    const nextLanternSide = lanternSide === 'west' ? 'east' : 'west';

    setEastIds(nextEastIds);
    setLanternSide(nextLanternSide);
    setElapsedMinutes(nextElapsed);
    setSelectedIds([]);

    if (nextEastIds.length === TEAM_MEMBERS.length) {
      if (nextElapsed <= 17) {
        soundEngine.play('correct');
        onSolve();
      } else {
        soundEngine.play('error');
        onWrongAttempt(
          `Team crossed in ${nextElapsed} minutes, which exceeds the 17-minute lantern limit. Reset and send the two slowest explorers together!`
        );
      }
    } else {
      soundEngine.play('stepUnlock');
    }
  };

  const handleReset = () => {
    soundEngine.play('click');
    setEastIds([]);
    setLanternSide('west');
    setSelectedIds([]);
    setElapsedMinutes(0);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#051029]/70 p-4">
        <div className="space-y-1">
          <p className="text-sm text-slate-200">
            Move all 4 explorers from West Bank to East Bank in <span className="font-semibold text-[#F5C542]">17 minutes or less</span>.
          </p>
          <p className="text-xs text-slate-400">
            Max 2 per crossing · Group moves at the slower explorer&apos;s pace · Lantern is on the {lanternSide === 'west' ? 'West' : 'East'} Bank
          </p>
        </div>
        <div className="text-right">
          <span className="block text-[11px] text-slate-400">Elapsed Time</span>
          <span
            className={`font-mono text-xl font-bold tabular-nums ${
              elapsedMinutes > 17 ? 'text-[#E11D3F]' : 'text-[#F5C542]'
            }`}
          >
            {elapsedMinutes} / 17 min
          </span>
        </div>
      </div>

      {/* Two Banks + Bridge Span */}
      <div className="grid gap-3 sm:grid-cols-2">
        {/* West Bank */}
        <div
          className={`rounded-2xl border p-4 transition-colors ${
            lanternSide === 'west'
              ? 'border-[#F5C542]/50 bg-[#081C4A]'
              : 'border-white/10 bg-[#051029]/60 opacity-80'
          }`}
        >
          <div className="mb-3 flex items-center justify-between text-xs font-semibold">
            <span className="text-white">West Bank ({westMembers.length})</span>
            <span className={lanternSide === 'west' ? 'text-[#F5C542]' : 'text-slate-500'}>
              {lanternSide === 'west' ? 'Lantern Here' : 'Waiting'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {westMembers.map((member) => {
              const selected = selectedIds.includes(member.id);
              return (
                <button
                  key={member.id}
                  type="button"
                  disabled={lanternSide !== 'west'}
                  onClick={() => toggleMember(member.id, 'west')}
                  className={`min-h-[48px] rounded-xl border px-3 py-2 text-left transition-colors ${
                    selected
                      ? 'border-[#F5C542] bg-[#F5C542] text-[#051029]'
                      : 'border-white/15 bg-[#0B1E48] text-slate-100 hover:border-white/35 disabled:cursor-not-allowed'
                  }`}
                >
                  <span className="block text-xs font-bold">{member.name}</span>
                  <span className="block font-mono text-[11px] opacity-80 tabular-nums">
                    {member.minutes} min
                  </span>
                </button>
              );
            })}
            {westMembers.length === 0 && (
              <p className="col-span-2 py-4 text-center text-xs text-slate-400">
                All explorers crossed West Bank
              </p>
            )}
          </div>
        </div>

        {/* East Bank */}
        <div
          className={`rounded-2xl border p-4 transition-colors ${
            lanternSide === 'east'
              ? 'border-[#F5C542]/50 bg-[#081C4A]'
              : 'border-white/10 bg-[#051029]/60 opacity-80'
          }`}
        >
          <div className="mb-3 flex items-center justify-between text-xs font-semibold">
            <span className="text-white">East Bank ({eastMembers.length})</span>
            <span className={lanternSide === 'east' ? 'text-[#F5C542]' : 'text-slate-500'}>
              {lanternSide === 'east' ? 'Lantern Here' : 'Destination'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {eastMembers.map((member) => {
              const selected = selectedIds.includes(member.id);
              return (
                <button
                  key={member.id}
                  type="button"
                  disabled={lanternSide !== 'east'}
                  onClick={() => toggleMember(member.id, 'east')}
                  className={`min-h-[48px] rounded-xl border px-3 py-2 text-left transition-colors ${
                    selected
                      ? 'border-[#F5C542] bg-[#F5C542] text-[#051029]'
                      : 'border-white/15 bg-[#0B1E48] text-slate-100 hover:border-white/35 disabled:cursor-not-allowed'
                  }`}
                >
                  <span className="block text-xs font-bold">{member.name}</span>
                  <span className="block font-mono text-[11px] opacity-80 tabular-nums">
                    {member.minutes} min
                  </span>
                </button>
              );
            })}
            {eastMembers.length === 0 && (
              <p className="col-span-2 py-4 text-center text-xs text-slate-400">
                No explorers on East Bank yet
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleCross}
          disabled={eastIds.length === 4 && elapsedMinutes <= 17}
          className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#C8102E] px-5 py-3 text-sm font-semibold text-white transition-transform duration-150 hover:bg-[#E11D3F] active:scale-[0.98] disabled:opacity-60"
        >
          {lanternSide === 'west' ? (
            <>
              <span>Cross East</span>
              <ArrowRight className="h-4 w-4" />
            </>
          ) : (
            <>
              <ArrowLeft className="h-4 w-4" />
              <span>Return West</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-white/15 bg-[#0B1E48] px-4 py-3 text-xs font-semibold text-slate-200 hover:border-white/35 hover:text-white"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}
