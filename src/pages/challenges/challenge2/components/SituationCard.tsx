import { Hospital, Siren } from 'lucide-react';

export function SituationCard() {
  return (
    <section className="rounded-2xl border border-[#168bff]/35 bg-[#0a1d43]/90 p-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.16)] sm:p-4">
      <h2 className="mb-2 flex items-center gap-2 text-base font-bold text-white sm:text-lg">
        <Hospital className="h-5 w-5 text-cyan-300" aria-hidden="true" />
        La situation
      </h2>
      <div className="flex items-start gap-2.5">
        <Siren className="mt-0.5 h-5 w-5 shrink-0 text-orange-300" aria-hidden="true" />
        <p className="text-sm leading-relaxed text-slate-200 sm:text-[0.95rem]">
          Un drone médical doit livrer un vaccin urgent sur le toit d’un hôpital, mais il refuse
          de décoller et affiche une alerte orange générique :
          {' '}<span className="font-bold tracking-wide text-orange-300">ERREUR_VOL_04</span>.
          Examinez la scène et les diagnostics pour trouver la vraie cause.
        </p>
      </div>
    </section>
  );
}
