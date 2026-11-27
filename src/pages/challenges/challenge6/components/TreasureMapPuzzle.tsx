import { useState } from 'react';
import { ArrowLeftRight, Check, RotateCcw, Shuffle } from 'lucide-react';
import { soundEngine } from '../../../../lib/audio/soundEngine';

interface TreasureMapPuzzleProps {
  isSolved: boolean;
  imageSrc: string | null;
  onSolve: () => void;
}

const SOLVED_TILES = [0, 1, 2, 3, 4, 5, 6, 7, 8];

function shuffleTiles() {
  const shuffled = [...SOLVED_TILES];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  if (shuffled.every((tile, index) => tile === index)) {
    [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
  }
  return shuffled;
}

export function TreasureMapPuzzle({ isSolved, imageSrc, onSolve }: TreasureMapPuzzleProps) {
  const [tiles, setTiles] = useState(() => (isSolved ? SOLVED_TILES : shuffleTiles()));
  const [selectedTile, setSelectedTile] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);

  const handleTileClick = (position: number) => {
    if (!imageSrc || isSolved) return;
    soundEngine.play('click');

    if (selectedTile === null) {
      setSelectedTile(position);
      return;
    }
    if (selectedTile === position) {
      setSelectedTile(null);
      return;
    }

    const nextTiles = [...tiles];
    [nextTiles[selectedTile], nextTiles[position]] = [nextTiles[position], nextTiles[selectedTile]];
    setTiles(nextTiles);
    setSelectedTile(null);
    setMoves((current) => current + 1);

    if (nextTiles.every((tile, index) => tile === index)) {
      soundEngine.play('treasureFanfare');
      onSolve();
    }
  };

  const handleShuffle = () => {
    if (!imageSrc || isSolved) return;
    soundEngine.play('click');
    setTiles(shuffleTiles());
    setSelectedTile(null);
    setMoves(0);
  };

  return (
    <section className="grid gap-5 rounded-3xl border border-white/10 bg-[#0A1B42] p-4 shadow-xl sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(240px,0.72fr)] lg:gap-7 lg:p-7">
      <div>
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F5C542]">La carte déchirée</p>
            <p className="mt-1 text-sm text-slate-300">Échange deux morceaux pour les remettre à leur place.</p>
          </div>
          <span className="shrink-0 rounded-full border border-white/10 bg-[#051029]/70 px-3 py-1.5 font-mono text-xs text-slate-300">
            {moves} échange{moves === 1 ? '' : 's'}
          </span>
        </div>

        {imageSrc ? (
          <div className="mx-auto grid w-full max-w-[480px] grid-cols-3 gap-1.5 rounded-2xl border border-[#D2AE63]/70 bg-[#6C482A] p-2 shadow-[0_18px_40px_rgba(0,0,0,0.28)] sm:gap-2 sm:p-3" aria-label="Puzzle de la carte au trésor, neuf pièces">
            {tiles.map((tile, position) => {
              const row = Math.floor(tile / 3);
              const column = tile % 3;
              const isSelected = selectedTile === position;

              return (
                <button
                  key={position}
                  type="button"
                  onClick={() => handleTileClick(position)}
                  aria-label={`Morceau de carte ${position + 1}${isSelected ? ', sélectionné' : ''}`}
                  aria-pressed={isSelected}
                  disabled={isSolved}
                  className={`group relative aspect-square overflow-hidden rounded-md border-2 bg-[#D8C18C] transition-[border-color,transform,filter] duration-150 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542] disabled:cursor-default ${
                    isSelected
                      ? 'z-10 scale-[0.96] border-[#F5C542] shadow-[0_0_0_3px_rgba(245,197,66,0.28)]'
                      : 'border-[#80603A] hover:border-[#F5C542]/80'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url("${imageSrc}")`,
                      backgroundSize: '300% 300%',
                      backgroundPosition: `${column * 50}% ${row * 50}%`,
                    }}
                  />
                  {isSelected && <span aria-hidden="true" className="absolute inset-0 bg-[#F5C542]/10" />}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mx-auto flex aspect-square w-full max-w-[480px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#D2AE63]/50 bg-[#051029]/70 p-6 text-center" role="status">
            <span className="grid h-14 w-14 place-items-center rounded-2xl border border-[#F5C542]/20 bg-[#F5C542]/10 text-2xl" aria-hidden="true">🗺️</span>
            <p className="max-w-xs text-sm leading-relaxed text-slate-300">Le puzzle est prêt. Ajoute l’image de la carte pour découper celle-ci en neuf morceaux.</p>
          </div>
        )}

        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-xs text-slate-400">
            <ArrowLeftRight className="h-4 w-4 text-[#F5C542]" /> Sélectionne deux pièces pour les échanger.
          </p>
          {!isSolved && (
            <button
              type="button"
              onClick={handleShuffle}
              disabled={!imageSrc}
              className="flex min-h-10 shrink-0 items-center gap-2 rounded-lg border border-white/10 bg-[#051029]/60 px-3 text-xs font-semibold text-slate-300 transition-colors hover:border-white/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Shuffle className="h-3.5 w-3.5" /> Mélanger
            </button>
          )}
        </div>
      </div>

      <aside className="flex flex-col justify-center rounded-2xl border border-white/10 bg-[#051029]/65 p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Indice du vieux pirate</p>
        <p className="mt-3 font-display text-xl font-semibold leading-snug text-white">« Gérard, rends-moi ma carte ! »</p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          Aligne le rivage et le chemin pointillé. Quand les neuf morceaux seront à leur place, le X et le message caché apparaîtront.
        </p>

        {isSolved ? (
          <div className="mt-5 space-y-3" role="status" aria-live="polite">
            <div className="flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-200">
              <Check className="h-5 w-5" /> Carte reconstituée : le X indique où creuser !
            </div>
            <div className="rounded-xl border border-[#F5C542]/40 bg-[#F5C542]/10 p-4 text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#F5C542]">Code pour la suite</p>
              <p className="mt-1 font-mono text-3xl font-black tracking-[0.3em] text-white">X</p>
            </div>
          </div>
        ) : (
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-[#F5C542]/15 bg-[#F5C542]/[0.06] px-4 py-3 text-xs leading-relaxed text-slate-300">
            <RotateCcw className="h-4 w-4 shrink-0 text-[#F5C542]" />
            Si tu te trompes, continue à échanger les pièces : rien n’est perdu.
          </div>
        )}
      </aside>
    </section>
  );
}
