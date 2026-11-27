import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEngine } from '../../../../lib/audio/soundEngine';

interface BuildingCluesPuzzleProps {
  isSolved: boolean;
  onSolve: () => void;
  onWrongAttempt: (msg: string) => void;
}

const ANSWER = 20;

export function BuildingCluesPuzzle({ isSolved, onSolve, onWrongAttempt }: BuildingCluesPuzzleProps) {
  const [input, setInput]       = useState(isSolved ? String(ANSWER) : '');
  const [attempts, setAttempts] = useState(0);
  const [shake, setShake]       = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const val = parseInt(input.trim(), 10);

    if (val === ANSWER) {
      soundEngine.play('correct');
      onSolve();
      return;
    }

    soundEngine.play('error');
    setAttempts((n) => n + 1);
    setShake(true);
    setTimeout(() => setShake(false), 500);

    const hint =
      attempts === 0
        ? 'Regarde bien autour de toi — observe le nombre de sessions sur le programme et compte les membres du bureau.'
        : attempts === 1
        ? 'Indice : le résultat est un multiple de 4. Recompte les deux valeurs.'
        : 'Toujours raté… Le résultat est entre 15 et 25.';

    onWrongAttempt(hint);
  };

  return (
    <div className="space-y-6">

      {/* ── Formula card ── */}
      <div className="rounded-2xl border border-white/10 bg-[#051029]/70 p-5 sm:p-6">
        <p className="mb-5 text-xs font-bold uppercase tracking-[0.16em] text-[#F5C542]">
          Formule de déverrouillage
        </p>

        {/* Visual formula */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {/* Factor A */}
          <div className="flex flex-col items-center gap-1.5 rounded-xl border border-[#38BDF8]/30 bg-[#38BDF8]/5 px-5 py-4 text-center">
            <span className="font-mono text-2xl font-black text-[#38BDF8]">A</span>
            <span className="text-xs text-slate-400 leading-tight">
              Nombre de<br />sessions aujourd'hui
            </span>
          </div>

          <span className="text-2xl font-thin text-slate-500">×</span>

          {/* Factor B */}
          <div className="flex flex-col items-center gap-1.5 rounded-xl border border-[#F5C542]/30 bg-[#F5C542]/5 px-5 py-4 text-center">
            <span className="font-mono text-2xl font-black text-[#F5C542]">B</span>
            <span className="text-xs text-slate-400 leading-tight">
              Membres du<br />bureau (core team)
            </span>
          </div>

          <span className="text-2xl font-thin text-slate-500">=</span>

          {/* Result slot */}
          <div className="flex flex-col items-center gap-1.5 rounded-xl border border-dashed border-white/30 bg-white/5 px-5 py-4 text-center">
            <span className="font-mono text-2xl font-black text-slate-300">?</span>
            <span className="text-xs text-slate-500">Ton résultat</span>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-slate-500">
          Observe l'environnement autour de toi — les réponses sont dans la salle.
        </p>
      </div>

      {/* ── Input ── */}
      <motion.form
        onSubmit={handleSubmit}
        className="flex gap-3"
        animate={shake ? { x: [-6, 6, -4, 4, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <label htmlFor="building-clue-input" className="sr-only">
          Résultat du calcul
        </label>
        <input
          id="building-clue-input"
          type="number"
          inputMode="numeric"
          min={1}
          max={999}
          value={input}
          disabled={isSolved}
          onChange={(e) => {
            soundEngine.play('click');
            setInput(e.target.value);
          }}
          placeholder="Entrez le résultat"
          className="min-h-[48px] flex-1 rounded-xl border border-white/15 bg-[#051029] px-4 font-mono text-lg font-bold text-[#F5C542] placeholder:text-slate-500 focus:border-[#F5C542] focus:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isSolved || input.trim() === ''}
          className="min-h-[48px] shrink-0 rounded-xl bg-[#C8102E] px-6 text-sm font-bold text-white transition-colors hover:bg-[#E11D3F] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSolved ? 'Déverrouillé' : 'Valider'}
        </button>
      </motion.form>

      {/* ── Success ── */}
      <AnimatePresence>
        {isSolved && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4"
          >
            <p className="font-semibold text-emerald-300">Accès accordé !</p>
            <p className="mt-1 text-sm text-slate-300">
              La porte de secours du serveur s'ouvre. Tu as su lire ton environnement.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
