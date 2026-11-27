import { Info } from 'lucide-react';

export function SituationCard() {
  return (
    <section className="flex gap-3 rounded-[1.7rem] border-2 border-[#078bff] bg-gradient-to-br from-[#08234d]/95 to-[#061638]/95 px-3.5 py-3.5 shadow-[0_0_18px_rgba(0,137,255,0.2)] sm:gap-4 sm:px-5 sm:py-4">
      <Info className="mt-1 h-8 w-8 shrink-0 text-cyan-400 sm:h-9 sm:w-9" strokeWidth={2.5} aria-hidden="true" />
      <div>
        <h2 className="text-base font-extrabold text-cyan-400 sm:text-lg">La situation :</h2>
        <p className="mt-1 text-xs leading-relaxed text-slate-100 sm:text-sm">
          Trois terminaux d’IA (Alpha, Bêta, Gamma) sont en réseau. Un seul dit toujours la
          vérité, les deux autres mentent toujours. Un virus est caché dans un seul terminal.
        </p>
      </div>
    </section>
  );
}
