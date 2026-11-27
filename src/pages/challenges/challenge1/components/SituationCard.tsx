import { Info } from 'lucide-react';

export function SituationCard() {
  return (
    <section className="flex gap-4 rounded-[1.5rem] border border-[#009cff] bg-[#06204c]/75 p-4 shadow-[inset_0_0_22px_rgba(0,100,255,0.08)] sm:p-5">
      <Info className="mt-1 h-7 w-7 shrink-0 text-[#00b7f4]" strokeWidth={2.5} aria-hidden="true" />
      <div>
        <h2 className="mb-1 text-lg font-bold text-[#00b7f4]">La situation</h2>
        <p className="text-sm leading-[1.5] text-slate-200 sm:text-[15px]">
          En 2050, un pirate informatique s&apos;est infiltré dans cette salle pour copier des données.
          Avant de fuir, il a laissé une preuve physique de son passage près d&apos;un point précis.
        </p>
      </div>
    </section>
  );
}
