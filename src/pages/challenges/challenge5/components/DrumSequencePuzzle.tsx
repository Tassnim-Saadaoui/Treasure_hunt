import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEngine } from '../../../../lib/audio/soundEngine';

interface DrumSequencePuzzleProps {
  isSolved: boolean;
  onSolve: () => void;
  onWrongAttempt: (msg: string) => void;
}

// ─── Drum hit types ───────────────────────────────────────────────────────────

type Hit = 'P' | 'C' | 'S';

interface HitDef {
  id: Hit;
  label: string;
  sublabel: string;
  color: string;
  activeColor: string;
  textColor: string;
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
  },
  {
    id: 'C',
    label: 'Caisse claire',
    sublabel: 'Snare',
    icon: '🪘',
    color: 'border-[#F5C542]/40 bg-[#F5C542]/10',
    activeColor: 'border-[#F5C542] bg-[#F5C542]',
    textColor: 'text-[#F5C542]',
  },
  {
    id: 'S',
    label: 'Symbole',
    sublabel: 'Cymbale',
    icon: '🔔',
    color: 'border-[#38BDF8]/40 bg-[#38BDF8]/10',
    activeColor: 'border-[#38BDF8] bg-[#38BDF8]',
    textColor: 'text-[#38BDF8]',
  },
];

// ─── The sequence ─────────────────────────────────────────────────────────────

// Measure 1: PP C S
// Measure 2: PP CC S
// Measure 3: PP CCC [?][?]
const SEQUENCE: Hit[] = ['P','P','C','S','P','P','C','C','S','P','P','C','C','C'];
const BLANKS = 2; // last two positions are blank
const ANSWER: [Hit, Hit] = ['S', 'P'];

// Visual grouping: measures separated by | for display
const MEASURES: Hit[][] = [
  ['P','P','C','S'],
  ['P','P','C','C','S'],
  ['P','P','C','C','C'],
];

// ─── Helper: play a drum sound via soundEngine ────────────────────────────────

function playDrumHit(hit: Hit) {
  switch (hit) {
    case 'P': soundEngine.play('gearClick');   break;
    case 'C': soundEngine.play('compassTick'); break;
    case 'S': soundEngine.play('hoverTick');   break;
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function HitBadge({ hit, dim = false }: { hit: Hit; dim?: boolean }) {
  const def = HITS.find((h) => h.id === hit)!;
  return (
    <span
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-black transition-opacity ${def.activeColor} text-white ${dim ? 'opacity-30' : 'opacity-100'}`}
    >
      {hit}
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function DrumSequencePuzzle({ isSolved, onSolve, onWrongAttempt }: DrumSequencePuzzleProps) {
  const [slots, setSlots] = useState<(Hit | null)[]>(
    isSolved ? [ANSWER[0], ANSWER[1]] : [null, null]
  );
  const [wrongSlot, setWrongSlot] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(isSolved);

  const handlePick = (slotIndex: number, hit: Hit) => {
    if (submitted) return;
    playDrumHit(hit);
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
      soundEngine.play('treasureFanfare');
      setSubmitted(true);
      onSolve();
    } else {
      soundEngine.play('error');
      // Mark which slot(s) are wrong
      const wrongIdx = slots[0] !== ANSWER[0] ? 0 : 1;
      setWrongSlot(wrongIdx);
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

  return (
    <div className="space-y-6">

      {/* ── Sequence display ── */}
      <div className="rounded-2xl border border-white/10 bg-[#051029]/70 p-5">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-[#F5C542]">
          Partition de batterie
        </p>

        <div className="flex flex-wrap items-end gap-3">
          {MEASURES.map((measure, mi) => (
            <div key={mi} className="flex items-center gap-1">
              {/* Measure number */}
              <span className="mr-1 text-[10px] font-bold text-slate-500">{mi + 1}.</span>

              {/* Hits in measure */}
              {measure.map((hit, hi) => (
                <motion.div
                  key={hi}
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: (mi * 5 + hi) * 0.04, type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <HitBadge hit={hit} />
                </motion.div>
              ))}

              {/* Blank slots only on last measure */}
              {mi === MEASURES.length - 1 && (
                <>
                  {[0, 1].map((slotIdx) => (
                    <motion.div
                      key={`slot-${slotIdx}`}
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.6 + slotIdx * 0.08, type: 'spring', stiffness: 400, damping: 20 }}
                    >
                      <div
                        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border-2 text-sm font-black transition-all duration-200 ${
                          slots[slotIdx] !== null
                            ? wrongSlot === slotIdx
                              ? 'border-[#E11D3F] bg-[#E11D3F]/20 text-white'
                              : submitted
                              ? 'border-emerald-400 bg-emerald-400/20 text-white'
                              : 'border-[#F5C542]/80 bg-[#F5C542]/15 text-white'
                            : 'border-dashed border-white/30 bg-white/5 text-slate-500'
                        }`}
                      >
                        {slots[slotIdx] ?? '?'}
                      </div>
                    </motion.div>
                  ))}
                </>
              )}

              {/* Measure separator */}
              {mi < MEASURES.length - 1 && (
                <span className="ml-1 text-lg font-thin text-slate-600">|</span>
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-3">
          {HITS.map((h) => (
            <div key={h.id} className="flex items-center gap-1.5">
              <span className={`text-xs font-black ${h.textColor}`}>{h.id}</span>
              <span className="text-xs text-slate-400">= {h.label} ({h.sublabel})</span>
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
                Note {slotIdx === 0 ? '15' : '16'} — Case {slotIdx + 1}
                {wrongSlot === slotIdx && (
                  <span className="ml-2 text-[#E11D3F]">✗ incorrect</span>
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
                          ? `${h.activeColor} text-white scale-[1.04]`
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
              La mesure se clôt sur un <span className="font-bold text-[#38BDF8]">S (Symbole)</span> pour
              marquer la fin du temps, puis repart sur un{' '}
              <span className="font-bold text-[#C8102E]">P (Pied)</span> pour lancer la mesure suivante.
              Le studio est déverrouillé !
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
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-white/15 bg-[#0B1E48] px-4 text-xs font-semibold text-slate-300 hover:border-white/35 hover:text-white"
          >
            Effacer
          </button>
        </div>
      )}
    </div>
  );
}
