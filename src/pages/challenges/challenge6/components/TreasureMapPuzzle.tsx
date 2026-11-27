import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeftRight, Shuffle } from 'lucide-react';
import { soundEngine } from '../../../../lib/audio/soundEngine';
import piece1 from '../puzzle/1.png';
import piece2 from '../puzzle/2.png';
import piece3 from '../puzzle/3.png';
import piece4 from '../puzzle/4.png';
import piece5 from '../puzzle/5.png';
import piece6 from '../puzzle/6.png';
import piece7 from '../puzzle/7.png';
import piece8 from '../puzzle/8.png';
import piece9 from '../puzzle/9.png';
import piece10 from '../puzzle/10.png';
import piece11 from '../puzzle/11.png';
import piece12 from '../puzzle/12.png';

interface TreasureMapPuzzleProps {
  isSolved: boolean;
  onSolve: () => void;
}

const PIECE_IMAGES = [
  piece1,
  piece2,
  piece3,
  piece4,
  piece5,
  piece6,
  piece7,
  piece8,
  piece9,
  piece10,
  piece11,
  piece12,
];
const SOLVED_ORDER = PIECE_IMAGES.map((_, index) => index + 1);

function getTargetOffset(firstId: number, secondId: number) {
  const firstRow = Math.floor((firstId - 1) / 3);
  const firstColumn = (firstId - 1) % 3;
  const secondRow = Math.floor((secondId - 1) / 3);
  const secondColumn = (secondId - 1) % 3;
  const columnDelta = secondColumn - firstColumn;
  const rowDelta = secondRow - firstRow;

  if (rowDelta === 0 && Math.abs(columnDelta) === 1) {
    return { x: (columnDelta * 100) / 3, y: 0 };
  }
  if (columnDelta === 0 && Math.abs(rowDelta) === 1) {
    return { x: 0, y: (rowDelta * 100) / 4 };
  }
  return null;
}

function getCorrectNeighborPairs(pieces: number[]) {
  const pairs: [number, number][] = [];
  for (let position = 0; position < pieces.length; position += 1) {
    const column = position % 3;
    const row = Math.floor(position / 3);
    const piece = pieces[position];

    if (column < 2 && getTargetOffset(piece, pieces[position + 1])?.x! > 0) {
      pairs.push([piece, pieces[position + 1]]);
    }
    if (row < 3 && getTargetOffset(piece, pieces[position + 3])?.y! > 0) {
      pairs.push([piece, pieces[position + 3]]);
    }
  }
  return pairs;
}

function shufflePieces() {
  let shuffled: number[];
  do {
    shuffled = [...SOLVED_ORDER];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }

    const hasCorrectNeighbor = getCorrectNeighborPairs(shuffled).length > 0;
    const hasPieceInSolvedSlot = shuffled.some((piece, index) => piece === index + 1);
    if (!hasPieceInSolvedSlot && !hasCorrectNeighbor) break;
  } while (true);

  return shuffled;
}

export function TreasureMapPuzzle({ isSolved, onSolve }: TreasureMapPuzzleProps) {
  const [pieces, setPieces] = useState(() => (isSolved ? SOLVED_ORDER : shufflePieces()));
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const [snappingPieces, setSnappingPieces] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const snapTimerRef = useRef<number | null>(null);

  const handlePieceClick = (position: number) => {
    if (isSolved) return;
    soundEngine.play('click');

    if (selectedPosition === null) {
      setSelectedPosition(position);
      return;
    }
    if (selectedPosition === position) {
      setSelectedPosition(null);
      return;
    }

    const previouslyJoinedPairs = new Set(
      getCorrectNeighborPairs(pieces).map(([first, second]) => `${first}:${second}`)
    );
    const nextPieces = [...pieces];
    [nextPieces[selectedPosition], nextPieces[position]] = [nextPieces[position], nextPieces[selectedPosition]];
    const newlyJoinedPairs = getCorrectNeighborPairs(nextPieces).filter(
      ([first, second]) => !previouslyJoinedPairs.has(`${first}:${second}`)
    );
    setPieces(nextPieces);
    setSelectedPosition(null);
    setMoves((current) => current + 1);

    const piecesToSnap = [...new Set(newlyJoinedPairs.flat())];
    if (piecesToSnap.length > 0) {
      setSnappingPieces(piecesToSnap);
      if (snapTimerRef.current !== null) window.clearTimeout(snapTimerRef.current);
      snapTimerRef.current = window.setTimeout(() => setSnappingPieces([]), 320);
    }

    if (nextPieces.every((piece, index) => piece === index + 1)) {
      soundEngine.play('treasureFanfare');
      onSolve();
    }
  };

  const handleShuffle = () => {
    if (isSolved) return;
    soundEngine.play('click');
    setPieces(shufflePieces());
    setSelectedPosition(null);
    setSnappingPieces([]);
    setMoves(0);
  };

  return (
    <section className="mx-auto w-full max-w-3xl rounded-3xl border border-white/10 bg-[#0A1B42] p-4 shadow-xl sm:p-6 lg:p-7">
      <div>
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F5C542]">La carte déchirée</p>
            <p className="mt-1 text-sm text-slate-300">Échange les pièces pour reconstituer la carte.</p>
          </div>
          <span className="shrink-0 rounded-full border border-white/10 bg-[#051029]/70 px-3 py-1.5 font-mono text-xs text-slate-300">
            {moves} échange{moves === 1 ? '' : 's'}
          </span>
        </div>

        <div className="mx-auto grid aspect-square w-full max-w-[520px] grid-cols-3 grid-rows-4 gap-0 overflow-visible rounded-2xl border border-[#D2AE63]/70 bg-[#D8C18C] p-1.5 shadow-[0_18px_40px_rgba(0,0,0,0.28)] sm:p-2" aria-label="Puzzle de la carte au trésor, douze pièces à remettre dans l’ordre">
          {pieces.map((pieceNumber, position) => {
            const isSelected = selectedPosition === position;
            const isSnapping = snappingPieces.includes(pieceNumber);
            return (
              <button
                key={position}
                type="button"
                onClick={() => handlePieceClick(position)}
                aria-label={`Pièce du puzzle à la position ${position + 1}${isSelected ? ', sélectionnée' : ''}`}
                aria-pressed={isSelected}
                disabled={isSolved}
                className={`relative isolate z-0 flex min-h-0 min-w-0 items-center justify-center overflow-visible rounded-md border border-transparent bg-transparent transition-[border-color,transform,filter] duration-150 focus-visible:z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542] disabled:cursor-default ${
                  isSelected
                    ? 'z-20 scale-[0.97] border-[#F5C542] shadow-[0_0_0_3px_rgba(245,197,66,0.28)]'
                    : 'hover:z-10 hover:border-[#F5C542]/80'
                }`}
              >
                <motion.img
                  key={pieceNumber}
                  src={PIECE_IMAGES[pieceNumber - 1]}
                  alt=""
                  draggable={false}
                  initial={false}
                  animate={isSnapping ? { scale: [0.96, 1.06, 1], rotate: [0, -1.5, 0] } : { scale: 1, rotate: 0 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="pointer-events-none absolute h-[170%] w-[170%] max-w-none select-none object-contain"
                />
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-xs text-slate-400">
            <ArrowLeftRight className="h-4 w-4 shrink-0 text-[#F5C542]" /> Sélectionne deux pièces pour les échanger.
          </p>
          {!isSolved && (
            <button
              type="button"
              onClick={handleShuffle}
              className="flex min-h-10 shrink-0 items-center gap-2 rounded-lg border border-white/10 bg-[#051029]/60 px-3 text-xs font-semibold text-slate-300 transition-colors hover:border-white/25 hover:text-white"
            >
              <Shuffle className="h-3.5 w-3.5" /> Mélanger
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
