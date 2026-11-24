import { useState } from 'react';
import { Compass, MapPin } from 'lucide-react';
import { soundEngine } from '../../../lib/audio/soundEngine';

interface ExplorationMapPuzzleProps {
  isSolved: boolean;
  onSolve: () => void;
  onWrongAttempt: (message: string) => void;
}

const SECTORS = [
  { id: 'A1', label: 'North Gate', note: 'Empty guard post facing the avenue.' },
  { id: 'A2', label: 'Solar Roof', note: 'Photovoltaic panels humming quietly.' },
  { id: 'A3', label: 'Observatory', note: 'Reference landmark at Column 3, Row A.' },
  { id: 'A4', label: 'East Garden', note: 'Olive trees, no relay signal.' },
  { id: 'B1', label: 'Main Hall', note: 'Student boards and registration tables.' },
  { id: 'B2', label: 'Atrium', note: 'Echoing footsteps across marble tiles.' },
  { id: 'B3', label: 'Fountain', note: 'Central courtyard fountain — check one row south.' },
  { id: 'B4', label: 'Robotics Bay', note: 'Spare chassis parts stacked neatly.' },
  { id: 'C1', label: 'West Library', note: 'Engineering archives along the west wall.' },
  { id: 'C2', label: 'Reading Quad', note: 'Stone benches under shaded arches.' },
  { id: 'C3', label: 'Archive Vault', note: 'Subterranean relay marker pulsing faintly!' },
  { id: 'C4', label: 'Print Studio', note: 'Fresh campus maps drying on racks.' },
  { id: 'D1', label: 'South Courtyard', note: 'Bicycles and shaded walkway.' },
  { id: 'D2', label: 'Amphitheater', note: 'Tiered stone steps waiting for the finale.' },
  { id: 'D3', label: 'Storage Annex', note: 'Locked maintenance shutter.' },
  { id: 'D4', label: 'Exit Plaza', note: 'Southern campus perimeter.' },
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
        `Sector ${selectedId} (${selectedSector.label}) holds no archive relay. Align with Column 3 (Observatory) and step one row south of the Fountain.`
      );
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-white/10 bg-[#051029]/70 p-4 sm:p-5 space-y-1.5">
        <p className="text-sm text-slate-200 leading-relaxed">
          Triangulation Clue: <span className="font-semibold text-[#F5C542]">“Align directly south of the Observatory (Column 3) and one row below the Central Fountain (B3).”</span>
        </p>
        <p className="text-xs text-slate-300">
          Tap any campus sector to scan its field note, then confirm the archive coordinate.
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
          {isSolved ? 'Confirmed · C3' : 'Confirm Coordinate'}
        </button>
      </div>
    </div>
  );
}
