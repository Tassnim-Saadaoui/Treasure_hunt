import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
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
      <div className="rounded-2xl border border-dashed border-[#00B8FF]/70 bg-[#071A3B]/75 p-5 sm:p-6">
        <p className="mb-5 text-center text-xs font-bold uppercase tracking-[0.16em] text-[#00B8FF]">
          Reconstitue le code d'accès
        </p>

        {/* Visual formula */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {/* Factor A */}
          <div className="flex min-w-[130px] flex-col items-center gap-1.5 rounded-xl border border-[#00B8FF]/40 bg-[#00B8FF]/[0.07] px-5 py-4 text-center">
            <span className="font-mono text-2xl font-black text-[#00B8FF]">A</span>
            <span className="text-xs text-slate-400 leading-tight">
              Sessions au<br />programme
            </span>
          </div>

          <span className="text-2xl font-light text-slate-400">×</span>

          {/* Factor B */}
          <div className="flex min-w-[130px] flex-col items-center gap-1.5 rounded-xl border border-[#F22555]/40 bg-[#F22555]/[0.07] px-5 py-4 text-center">
            <span className="font-mono text-2xl font-black text-[#F22555]">B</span>
            <span className="text-xs text-slate-400 leading-tight">
              Membres du<br />bureau (core team)
            </span>
          </div>

          <span className="text-2xl font-light text-slate-400">=</span>

          {/* Result slot */}
          <div className="flex min-w-[130px] flex-col items-center gap-1.5 rounded-xl border border-dashed border-[#00B8FF]/50 bg-[#00B8FF]/[0.04] px-5 py-4 text-center">
            <span className="font-mono text-2xl font-black text-white">?</span>
            <span className="text-xs text-slate-300">Code à trouver</span>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-slate-500">
          Observe la salle et multiplie les deux valeurs relevées.
        </p>
      </div>

      {/* ── Input ── */}
      <motion.form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 sm:flex-row"
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
          className="min-h-[48px] flex-1 rounded-xl border border-white/15 bg-[#051029] px-4 font-mono text-lg font-bold text-white placeholder:font-sans placeholder:text-sm placeholder:font-normal placeholder:text-slate-400 focus:border-[#00B8FF] focus:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isSolved || input.trim() === ''}
          className="min-h-[48px] shrink-0 rounded-xl bg-[#E11D48] px-6 text-sm font-bold text-white transition-colors hover:bg-[#F22555] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSolved ? 'Déverrouillé' : 'Valider'}
        </button>
      </motion.form>
    </div>
  );
}
