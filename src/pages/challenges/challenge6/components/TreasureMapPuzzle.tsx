/**
 * TreasureMapPuzzle – Challenge 6
 *
 * HOW THE JIGSAW GEOMETRY WORKS
 * ─────────────────────────────
 * Each piece PNG is 584 × 498 px.  The piece's "core" rectangle starts at
 * (121, 121) in image space and measures 341 × 255 px.  The remaining 121 px
 * on every side is "tab space" — the region that may contain a protruding tab
 * OR an indentation (blank).  Adjacent pieces have complementary shapes: if
 * piece A's right edge has a tab, piece B's left edge has the matching blank.
 *
 * To assemble the puzzle seamlessly the pieces must OVERLAP on screen:
 *   • Place piece at grid position (row, col) with its image top-left at
 *       left = col × CORE_W − TAB   (= col × 341 − 121)
 *       top  = row × CORE_H − TAB   (= row × 255 − 121)
 *   • The piece image (584 px wide) therefore extends 121 px beyond its core
 *     cell on every side, sharing screen space with its neighbours.
 *   • Because the PNGs are RGBA the transparent blank of piece B is filled by
 *     the opaque tab of piece A that occupies the same pixels — no gap needed.
 *
 * The click-detection layer is a grid of 341 × 255 core cells placed on top.
 * Clicking a cell swaps the logical piece IDs; the visual layer re-renders
 * with updated absolute positions immediately.
 */

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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

// ─── Geometry constants (all values in native image pixels) ──────────────────

/** Transparent buffer on each side of every piece image for tab space. */
const TAB = 121;
/** Width of one core grid cell. */
const CORE_W = 341;
/** Height of one core grid cell. */
const CORE_H = 255;
/** Native pixel width of each piece PNG. */
const IMG_W = 584;
/** Native pixel height of each piece PNG. */
const IMG_H = 498;
/** Number of columns. */
const COLS = 3;
/** Number of rows. */
const ROWS = 4;
/** Total width of the assembled core (without tabs). */
const TOTAL_W = CORE_W * COLS; // 1023
/** Total height of the assembled core (without tabs). */
const TOTAL_H = CORE_H * ROWS; // 1020

// ─── Piece images in order (index 0 = piece 1, …, index 11 = piece 12) ───────

const PIECE_IMAGES = [
  piece1, piece2, piece3,
  piece4, piece5, piece6,
  piece7, piece8, piece9,
  piece10, piece11, piece12,
];

const SOLVED_ORDER = PIECE_IMAGES.map((_, i) => i + 1); // [1, 2, … 12]

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Convert a linear position (0–11) to { row, col }. */
function posToGrid(pos: number) {
  return { row: Math.floor(pos / COLS), col: pos % COLS };
}

/**
 * Returns true when the piece at `posA` and the piece at `posA + 1`
 * (horizontally adjacent) are in the correct relative order, or when
 * the piece at `posA` and the piece at `posA + COLS` (vertically adjacent)
 * are in the correct relative order.
 */
function getCorrectNeighborPairs(pieces: number[]): [number, number][] {
  const pairs: [number, number][] = [];
  for (let pos = 0; pos < pieces.length; pos++) {
    const { row, col } = posToGrid(pos);
    const piece = pieces[pos];

    // Right neighbour
    if (col < COLS - 1) {
      const rightPiece = pieces[pos + 1];
      const { row: pr, col: pc } = posToGrid(piece - 1);
      const { row: rr, col: rc } = posToGrid(rightPiece - 1);
      if (pr === rr && rc === pc + 1) pairs.push([piece, rightPiece]);
    }
    // Bottom neighbour
    if (row < ROWS - 1) {
      const bottomPiece = pieces[pos + COLS];
      const { row: pr, col: pc } = posToGrid(piece - 1);
      const { row: br, col: bc } = posToGrid(bottomPiece - 1);
      if (pc === bc && br === pr + 1) pairs.push([piece, bottomPiece]);
    }
  }
  return pairs;
}

function shufflePieces(): number[] {
  let shuffled: number[];
  do {
    shuffled = [...SOLVED_ORDER];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
  } while (
    shuffled.some((p, i) => p === i + 1) ||
    getCorrectNeighborPairs(shuffled).length > 0
  );
  return shuffled;
}

// ─── Component ───────────────────────────────────────────────────────────────

interface TreasureMapPuzzleProps {
  isSolved: boolean;
  onSolve: () => void;
}

export function TreasureMapPuzzle({ isSolved, onSolve }: TreasureMapPuzzleProps) {
  const [pieces, setPieces] = useState<number[]>(() =>
    isSolved ? SOLVED_ORDER : shufflePieces()
  );
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const [snappingPieces, setSnappingPieces] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const snapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Interaction ──────────────────────────────────────────────────────────

  function handleCellClick(position: number) {
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

    const previousPairs = new Set(
      getCorrectNeighborPairs(pieces).map(([a, b]) => `${a}:${b}`)
    );

    const next = [...pieces];
    [next[selectedPosition], next[position]] = [next[position], next[selectedPosition]];

    const newPairs = getCorrectNeighborPairs(next).filter(
      ([a, b]) => !previousPairs.has(`${a}:${b}`)
    );

    setPieces(next);
    setSelectedPosition(null);
    setMoves((m) => m + 1);

    if (newPairs.length > 0) {
      const toSnap = [...new Set(newPairs.flat())];
      setSnappingPieces(toSnap);
      if (snapTimerRef.current !== null) clearTimeout(snapTimerRef.current);
      snapTimerRef.current = setTimeout(() => setSnappingPieces([]), 350);
    }

    if (next.every((p, i) => p === i + 1)) {
      soundEngine.play('treasureFanfare');
      onSolve();
    }
  }

  function handleShuffle() {
    if (isSolved) return;
    soundEngine.play('click');
    setPieces(shufflePieces());
    setSelectedPosition(null);
    setSnappingPieces([]);
    setMoves(0);
  }

  // ── Render ───────────────────────────────────────────────────────────────

  /**
   * For a piece currently occupying grid `position`, compute its CSS
   * left/top as percentages of the container (TOTAL_W × TOTAL_H).
   *
   * The container represents the CORE area only.  Pieces hang outside it via
   * their tab regions, so the container uses `overflow: visible`.  A wrapper
   * div clips to the container dimensions to avoid showing stray tab content
   * beyond the puzzle border.
   */
  function pieceStyle(position: number) {
    const { row, col } = posToGrid(position);
    const leftPx = col * CORE_W - TAB; // negative for col 0
    const topPx = row * CORE_H - TAB;  // negative for row 0
    return {
      left: `${(leftPx / TOTAL_W) * 100}%`,
      top:  `${(topPx  / TOTAL_H) * 100}%`,
      width:  `${(IMG_W / TOTAL_W) * 100}%`,
      height: `${(IMG_H / TOTAL_H) * 100}%`,
    };
  }

  return (
    <section className="mx-auto w-full max-w-3xl rounded-3xl border border-white/10 bg-[#0A1B42] p-4 shadow-xl sm:p-6 lg:p-7">
      {/* Header row */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F5C542]">La carte déchirée</p>
          <p className="mt-1 text-sm text-slate-300">Échange les pièces pour reconstituer la carte.</p>
        </div>
        <span className="shrink-0 rounded-full border border-white/10 bg-[#051029]/70 px-3 py-1.5 font-mono text-xs text-slate-300">
          {moves} échange{moves === 1 ? '' : 's'}
        </span>
      </div>

      {/*
        ┌─────────────────────────────────────────────────────────┐
        │  Outer clip wrapper                                     │
        │  Clips the puzzle to the core area so stray tab pixels  │
        │  beyond the border are hidden.                          │
        │                                                         │
        │  ┌─────────────────────────────────────────────────┐   │
        │  │ Inner container (aspect = TOTAL_W : TOTAL_H)    │   │
        │  │ position:relative  overflow:visible             │   │
        │  │                                                 │   │
        │  │  12 piece <img> elements: position:absolute    │   │
        │  │  left/top extend beyond container for tabs      │   │
        │  │                                                 │   │
        │  │  12 click-detection cells: position:absolute   │   │
        │  │  cover each core cell exactly                   │   │
        │  └─────────────────────────────────────────────────┘   │
        └─────────────────────────────────────────────────────────┘
      */}
      <div
        className="mx-auto w-full max-w-[520px] overflow-hidden rounded-2xl border border-[#D2AE63]/70 shadow-[0_18px_40px_rgba(0,0,0,0.28)]"
        aria-label="Puzzle de la carte au trésor, douze pièces à remettre dans l'ordre"
      >
        {/* Inner container: aspect ratio = TOTAL_W / TOTAL_H */}
        <div
          className="relative w-full overflow-visible bg-[#D8C18C]"
          style={{ paddingTop: `${(TOTAL_H / TOTAL_W) * 100}%` }}
        >
          {/* ── Piece images (absolutely positioned, overlap at tabs) ── */}
          {pieces.map((pieceNumber, position) => {
            const isSnapping = snappingPieces.includes(pieceNumber);
            const isSelected = selectedPosition === position;
            const style = pieceStyle(position);

            return (
              <motion.img
                key={pieceNumber}
                src={PIECE_IMAGES[pieceNumber - 1]}
                alt=""
                draggable={false}
                className="pointer-events-none absolute select-none"
                style={{
                  ...style,
                  /**
                   * Z-index: selected piece on top (z=30), snapping next (z=20),
                   * otherwise REVERSE row-major order so top-row pieces render
                   * above bottom-row pieces.  Their downward tabs must cover the
                   * top-edge blank of the row below; without this the bottom
                   * piece's upward tab would incorrectly sit on top and create a
                   * visible overlap seam.
                   */
                  zIndex: isSelected ? 30 : isSnapping ? 20 : ROWS * COLS - position,
                  filter: isSelected
                    ? 'drop-shadow(0 0 6px rgba(245,197,66,0.9)) drop-shadow(0 2px 4px rgba(83,56,20,0.6))'
                    : 'drop-shadow(0 1px 2px rgba(83,56,20,0.45))',
                }}
                initial={false}
                animate={
                  isSnapping
                    ? { scale: [0.97, 1.05, 1], rotate: [0, -1.2, 0] }
                    : { scale: 1, rotate: 0 }
                }
                transition={{
                  scale:  { type: 'spring', stiffness: 600, damping: 20 },
                  rotate: { duration: 0.28, ease: 'easeOut' },
                }}
              />
            );
          })}

          {/* ── Click-detection cells (cover core cells exactly) ── */}
          {pieces.map((pieceNumber, position) => {
            const { row, col } = posToGrid(position);
            const isSelected = selectedPosition === position;

            return (
              <button
                key={`cell-${position}`}
                type="button"
                onClick={() => handleCellClick(position)}
                disabled={isSolved}
                aria-label={`Pièce du puzzle à la position ${position + 1}${isSelected ? ', sélectionnée' : ''}`}
                aria-pressed={isSelected}
                className={[
                  'absolute cursor-pointer rounded-sm border-2 transition-[border-color,background-color] duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542]',
                  'disabled:cursor-default',
                  isSelected
                    ? 'border-[#F5C542] bg-[#F5C542]/10'
                    : 'border-transparent hover:border-[#F5C542]/60 hover:bg-[#F5C542]/5',
                ].join(' ')}
                style={{
                  left:   `${(col * CORE_W / TOTAL_W) * 100}%`,
                  top:    `${(row * CORE_H / TOTAL_H) * 100}%`,
                  width:  `${(CORE_W   / TOTAL_W) * 100}%`,
                  height: `${(CORE_H   / TOTAL_H) * 100}%`,
                  zIndex: 30,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Footer row */}
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-xs text-slate-400">
          <ArrowLeftRight className="h-4 w-4 shrink-0 text-[#F5C542]" />
          Sélectionne deux pièces pour les échanger.
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
    </section>
  );
}
