import { useState } from 'react';
import { ArrowRight, Bird, Compass, LockKeyhole, MapPinned, Sparkles } from 'lucide-react';
import type { ChallengePageProps } from '../types';
import { TreasureMapPuzzle } from './components/TreasureMapPuzzle';
import goalImage from './puzzle/goal.png';

export function Challenge6Page({
  completedIds,
  isUnlocked,
  onComplete,
  onVoyageToMap,
}: ChallengePageProps) {
  const [hasSolved, setHasSolved] = useState(completedIds.includes(6));

  const handleSolve = () => {
    setHasSolved(true);
    onComplete(6);
  };

  return (
    <section className="mx-auto w-full max-w-5xl space-y-5 pb-8">
      <header className="relative overflow-hidden rounded-3xl border border-[#F5C542]/20 bg-gradient-to-br from-[#112754] via-[#0A1B42] to-[#07132E] p-5 shadow-2xl sm:p-8">
        <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-10 opacity-[0.08]">
          <Compass className="h-44 w-44 text-[#F5C542]" strokeWidth={1} />
        </div>
        <div className="relative flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#F5C542] sm:text-xs">
          <span className="rounded-full border border-[#F5C542]/30 bg-[#F5C542]/10 px-3 py-1">Challenge 6</span>
          <span>Boss final</span>
        </div>
        <h1 className="relative mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
          La carte de Barbe-Rouillée
        </h1>
        <div className="relative mt-4 flex items-start gap-3 rounded-2xl border border-white/10 bg-[#051029]/55 p-4 sm:p-5">
          <Bird className="mt-0.5 h-5 w-5 shrink-0 text-[#F5C542]" />
          <p className="text-sm leading-relaxed text-slate-200 sm:text-base">
            Barbe-Rouillée avait dessiné sa carte au trésor avec amour. Mais Gérard, une mouette voleuse,
            l’a emportée pour faire son nid : les douze morceaux se sont éparpillés sur la plage. Gérard
            jure qu’il n’y est pour rien… même s’il a encore un bout de papier dans le bec. Remets la
            carte en ordre pour trouver où creuser, moussaillon !
          </p>
        </div>
      </header>

      {!isUnlocked ? (
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0A1B42] p-5 text-slate-300" role="status">
          <LockKeyhole className="h-5 w-5 shrink-0 text-[#F5C542]" />
          <p>Cette carte est encore scellée. Termine les étapes précédentes pour l’ouvrir.</p>
        </div>
      ) : (
        <TreasureMapPuzzle isSolved={hasSolved} onSolve={handleSolve} onRedirect={() => onVoyageToMap(6)} />
      )}

      {hasSolved && isUnlocked && (
        <div className="grid gap-5 rounded-2xl border border-[#F5C542]/30 bg-[#F5C542]/[0.07] p-4 sm:p-6 md:grid-cols-[minmax(0,1.15fr)_minmax(240px,0.85fr)] md:items-center">
          <img
            src={goalImage}
            alt="La carte au trésor reconstituée, avec un X rouge indiquant où creuser."
            className="mx-auto w-full max-w-xl rounded-xl border border-[#D2AE63]/40 shadow-lg"
          />
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-[#F5C542]" />
              <div>
                <p className="font-semibold text-white">La carte est reconstituée !</p>
                <p className="mt-1 text-sm text-slate-300">Le X indique l’endroit où creuser. Garde le code révélé pour la suite de l’aventure.</p>
              </div>
            </div>
            <div className="w-full rounded-xl border border-[#F5C542]/40 bg-[#F5C542]/10 p-4 text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#F5C542]">Code pour la suite</p>
              <p className="mt-1 font-mono text-3xl font-black tracking-[0.3em] text-white">X</p>
            </div>
            <button
              type="button"
              onClick={() => onVoyageToMap(6)}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#C8102E] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#E11D3F]"
            >
              Terminer l’expédition <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <p className="flex items-center justify-center gap-2 text-center text-xs text-slate-500">
        <MapPinned className="h-3.5 w-3.5" />
        La crique de Barbe-Rouillée
      </p>
    </section>
  );
}
