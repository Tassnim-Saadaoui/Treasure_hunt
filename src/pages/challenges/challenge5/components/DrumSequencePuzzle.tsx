import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw } from 'lucide-react';
import { soundEngine } from '../../../../lib/audio/soundEngine';
import {
  playDrumSequence,
  unlockAudioContext,
  getAudioContext,
  type DrumHit,
} from '../lib/drumPlayer';

interface DrumSequencePuzzleProps {
  isSolved: boolean;
  onSolve: () => void;
  onWrongAttempt: (msg: string) => void;
}

// ─── Hit definitions ──────────────────────────────────────────────────────────

type Hit = DrumHit;

interface HitDef {
  id: Hit;
  label: string;
  sublabel: string;
  color: string;
  activeColor: string;
  textColor: string;
  ringColor: string;
  icon: string;
}

const HITS: HitDef[] = [
  {
    id: 'P',
    label: 'Pied',
    sublabel: 'Grosse caisse',
    icon: '🥁',
    color: 'border-[#C8102E]/40 bg-[#C8102E]/10',
    activeColor: 'border-[#C8102E] bg-[#C8102E]',
    textColor: 'text-[#C8102E]',
    ringColor: 'ring-[#C8102E]',
  },
  {
    id: 'C',
    label: 'Caisse claire',
    sublabel: 'Snare',
    icon: '🪘',
    color: 'border-[#F5C542]/40 bg-[#F5C542]/10',
    activeColor: 'border-[#F5C542] bg-[#F5C542]',
    textColor: 'text-[#F5C542]',
    ringColor: 'ring-[#F5C542]',
  },
  {
    id: 'S',
    label: 'Symbole',
    sublabel: 'Cymbale',
    icon: '🔔',
    color: 'border-[#38BDF8]/40 bg-[#38BDF8]/10',
    activeColor: 'border-[#38BDF8] bg-[#38BDF8]',
    textColor: 'text-[#38BDF8]',
    ringColor: 'ring-[#38BDF8]',
  },
];

function hitDef(id: Hit) {
  return HITS.find((h) => h.id === id)!;
}

// ─── Sequence data ────────────────────────────────────────────────────────────

// Measure 1: PP C S  → 4 notes (indices 0-3)
// Measure 2: PP CC S → 5 notes (indices 4-8)
// Measure 3: PP CCC  → 5 notes (indices 9-13) + 2 blank slots (14-15)
const SEQUENCE: Hit[] = ['P','P','C','S','P','P','C','C','S','P','P','C','C','C'];
const ANSWER: [Hit, Hit] = ['S', 'P'];
const BPM = 108; // slightly relaxed tempo for clarity

const MEASURES: { hits: Hit[]; startIndex: number }[] = [
  { hits: ['P','P','C','S'],       startIndex: 0  },
  { hits: ['P','P','C','C','S'],   startIndex: 4  },
  { hits: ['P','P','C','C','C'],   startIndex: 9  },
];

// ─── Helper: single preview hit sound ────────────────────────────────────────

function playPreviewHit(hit: Hit) {
  switch (hit) {
    case 'P': soundEngine.play('gearClick');   break;
    case 'C': soundEngine.play('compassTick'); break;
    case 'S': soundEngine.play('hoverTick');   break;
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export function DrumSequencePuzzle({ isSolved, onSolve, onWrongAttempt }: DrumSequencePuzzleProps) {
  // Puzzle state
  const [slots, setSlots] = useState<(Hit | null)[]>(
    isSolved ? [ANSWER[0], ANSWER[1]] : [null, null]
  );
  const [wrongSlot, setWrongSlot]   = useState<number | null>(null);
  const [submitted, setSubmitted]   = useState(isSolved);

  // Playback state
  const [isPlaying, setIsPlaying]       = useState(false);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  // Refs
  const cancelPlaybackRef = useRef<(() => void) | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelPlaybackRef.current?.();
    };
  }, []);

  // ── Playback ────────────────────────────────────────────────────────────

  const handlePlay = () => {
    if (isPlaying) return;

    // ── iOS/Android unlock — MUST happen synchronously in this onClick ──
    // 1. getAudioContext() creates or reuses the AudioContext
    // 2. unlockAudioContext() calls resume() AND fires a silent node
    //    in the same synchronous call stack — this is what actually
    //    unlocks audio on iOS Safari and Android Chrome.
    // 3. playDrumSequence() schedules all notes immediately after,
    //    also synchronously, with a 200ms lookahead that covers the
    //    iOS resume latency.
    const ctx = getAudioContext();
    if (!ctx) return;

    unlockAudioContext(ctx); // synchronous unlock

    setIsPlaying(true);
    setPlayingIndex(null);

    cancelPlaybackRef.current = playDrumSequence( // synchronous scheduling
      ctx,
      SEQUENCE,
      BPM,
      (index) => setPlayingIndex(index),
      () => {
        setIsPlaying(false);
        setPlayingIndex(null);
      },
    );
  };

  const handleStopPlayback = () => {
    cancelPlaybackRef.current?.();
    cancelPlaybackRef.current = null;
    setIsPlaying(false);
    setPlayingIndex(null);
  };

  // ── Puzzle interaction ──────────────────────────────────────────────────

  const handlePick = (slotIndex: number, hit: Hit) => {
    if (submitted) return;
    playPreviewHit(hit);
    setSlots((prev) => {
      const next = [...prev];
      next[slotIndex] = hit;
      return next;
    });
    setWrongSlot(null);
  };

  const handleSubmit = () => {
    if (submitted) return;
    if (slots[0] === null || slots[1] === null) {
      soundEngine.play('error');
      onWrongAttempt('Complète les deux cases avant de valider.');
      return;
    }
    if (slots[0] === ANSWER[0] && slots[1] === ANSWER[1]) {
      handleStopPlayback();
      soundEngine.play('treasureFanfare');
      setSubmitted(true);
      onSolve();
    } else {
      soundEngine.play('error');
      setWrongSlot(slots[0] !== ANSWER[0] ? 0 : 1);
      onWrongAttempt(
        'Ce roulement ne sonne pas juste… Écoute attentivement le schéma et repère la logique qui monte en puissance.'
      );
    }
  };

  const handleReset = () => {
    if (submitted) return;
    soundEngine.play('click');
    setSlots([null, null]);
    setWrongSlot(null);
  };

  // ── Render helpers ──────────────────────────────────────────────────────

  /** A note badge, with a pulse ring when the sequencer is on this index */
  function NoteBadge({ hit, globalIndex }: { hit: Hit; globalIndex: number }) {
    const def    = hitDef(hit);
    const active = playingIndex === globalIndex;
    return (
      <motion.span
        className={`relative inline-flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-black text-white ${def.activeColor}`}
        animate={active ? { scale: [1, 1.28, 1] } : { scale: 1 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
      >
        {hit}
        {active && (
          <motion.span
            className={`pointer-events-none absolute inset-0 rounded-lg ring-2 ${def.ringColor}`}
            initial={{ opacity: 0.9, scale: 1 }}
            animate={{ opacity: 0, scale: 1.6 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
        )}
      </motion.span>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── Listen button ── */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={isPlaying ? handleStopPlayback : handlePlay}
          className={`flex min-h-[44px] items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542] ${
            isPlaying
              ? 'bg-white/10 text-white hover:bg-white/15'
              : 'bg-[#1D4ED8] text-white hover:bg-[#2563EB]'
          }`}
        >
          {isPlaying ? (
            <>
              {/* Animated equalizer bars */}
              <span className="flex items-end gap-[3px] h-4" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-[3px] rounded-full bg-[#F5C542]"
                    animate={{ height: ['4px', '14px', '6px', '12px', '4px'] }}
                    transition={{ duration: 0.7, delay: i * 0.15, repeat: Infinity, ease: 'easeInOut' }}
                  />
                ))}
              </span>
              Lecture en cours…
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-white" />
              Écouter le morceau
            </>
          )}
        </button>

        {!isPlaying && (
          <p className="text-xs text-slate-400">
            Écoute le rythme, puis complète les deux dernières notes.
          </p>
        )}
      </div>

      {/* ── Sequence display ── */}
      <div className="rounded-2xl border border-white/10 bg-[#051029]/70 p-5">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-[#F5C542]">
          Partition de batterie
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          {MEASURES.map((m, mi) => (
            <div key={mi} className="flex items-center gap-1">
              <span className="mr-1 text-[10px] font-bold text-slate-500">{mi + 1}.</span>

              {m.hits.map((hit, hi) => {
                const globalIndex = m.startIndex + hi;
                return (
                  <motion.div
                    key={hi}
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: globalIndex * 0.035, type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    <NoteBadge hit={hit} globalIndex={globalIndex} />
                  </motion.div>
                );
              })}

              {/* Blank slots on last measure */}
              {mi === MEASURES.length - 1 && [0, 1].map((slotIdx) => {
                const globalIndex = SEQUENCE.length + slotIdx;
                const isActive = playingIndex === globalIndex;
                return (
                  <motion.div
                    key={`slot-${slotIdx}`}
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.55 + slotIdx * 0.07, type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    <div
                      className={`relative inline-flex h-9 w-9 items-center justify-center rounded-lg border-2 text-sm font-black transition-all duration-150 ${
                        slots[slotIdx] !== null
                          ? wrongSlot === slotIdx
                            ? 'border-[#E11D3F] bg-[#E11D3F]/20 text-white'
                            : submitted
                            ? 'border-emerald-400 bg-emerald-400/20 text-white'
                            : 'border-[#F5C542]/80 bg-[#F5C542]/15 text-white'
                          : isActive
                          ? 'border-[#F5C542] bg-[#F5C542]/20 text-[#F5C542]'
                          : 'border-dashed border-white/30 bg-white/5 text-slate-500'
                      }`}
                    >
                      {slots[slotIdx] ?? '?'}
                    </div>
                  </motion.div>
                );
              })}

              {mi < MEASURES.length - 1 && (
                <span className="ml-1 select-none text-lg font-thin text-slate-600">|</span>
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4">
          {HITS.map((h) => (
            <div key={h.id} className="flex items-center gap-1.5">
              <span className={`text-xs font-black ${h.textColor}`}>{h.id}</span>
              <span className="text-xs text-slate-400">= {h.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Slot selectors ── */}
      {!submitted && (
        <div className="grid gap-4 sm:grid-cols-2">
          {[0, 1].map((slotIdx) => (
            <div key={slotIdx} className="rounded-2xl border border-white/10 bg-[#081C4A] p-4">
              <p className="mb-3 text-xs font-semibold text-slate-400">
                Note {14 + slotIdx} — Case {slotIdx + 1}
                {wrongSlot === slotIdx && (
                  <span className="ml-2 font-bold text-[#E11D3F]">✗ incorrect</span>
                )}
              </p>
              <div className="flex gap-2">
                {HITS.map((h) => {
                  const active = slots[slotIdx] === h.id;
                  return (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => handlePick(slotIdx, h.id)}
                      className={`flex flex-1 flex-col items-center gap-1 rounded-xl border py-3 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542] ${
                        active
                          ? `${h.activeColor} scale-[1.04] text-white`
                          : `${h.color} text-slate-300 hover:border-white/40`
                      }`}
                    >
                      <span className="text-xl">{h.icon}</span>
                      <span className="text-xs font-black">{h.id}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Success feedback ── */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-emerald-400/40 bg-emerald-400/10 p-4"
          >
            <p className="font-semibold text-emerald-300">🥁 Roulement parfait !</p>
            <p className="mt-1 text-sm text-slate-300">
              La mesure se clôt sur un{' '}
              <span className="font-bold text-[#38BDF8]">S (Symbole)</span> pour
              marquer la fin du temps, puis repart sur un{' '}
              <span className="font-bold text-[#C8102E]">P (Pied)</span> pour
              lancer la mesure suivante. Le studio est déverrouillé !
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Action bar ── */}
      {!submitted && (
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={slots[0] === null || slots[1] === null}
            className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#C8102E] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#E11D3F] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Valider le roulement
          </button>
          <button
            type="button"
            onClick={handleReset}
            aria-label="Effacer les cases"
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-white/15 bg-[#0B1E48] px-4 text-xs font-semibold text-slate-300 hover:border-white/35 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
