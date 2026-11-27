import { Fingerprint, MapPin, Search } from 'lucide-react';

export function ChallengeHeader() {
  return (
    <header className="relative px-4 pb-5 pt-3 text-center">
      <div className="absolute right-0 top-4 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border-[5px] border-[#087cf0] border-t-[#ed1238] bg-[#08204c] shadow-[0_0_20px_rgba(0,132,255,0.22)]">
        <span className="text-lg font-bold tabular-nums text-white">0:07</span>
      </div>

      <div className="relative mx-auto mt-5 flex h-28 w-44 items-center justify-center text-[#00aaff]">
        <div className="absolute inset-2 rounded-[2rem] border border-dashed border-[#087cf0]/30" />
        <Fingerprint className="h-24 w-24 drop-shadow-[0_0_12px_rgba(0,153,255,0.6)]" strokeWidth={1.6} />
        <Search className="absolute bottom-1 right-5 h-12 w-12 rotate-[-18deg] text-slate-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.35)]" strokeWidth={2.5} />
        <span className="absolute -left-1 top-2 h-5 w-5 rounded-tl-md border-l-4 border-t-4 border-[#00aaff]" />
        <span className="absolute -right-1 top-2 h-5 w-5 rounded-tr-md border-r-4 border-t-4 border-[#00aaff]" />
        <span className="absolute -bottom-1 left-0 h-5 w-5 rounded-bl-md border-b-4 border-l-4 border-[#00aaff]" />
        <span className="absolute -bottom-1 right-0 h-5 w-5 rounded-br-md border-b-4 border-r-4 border-[#00aaff]" />
      </div>

      <h1 className="mt-1 text-[2rem] font-extrabold italic leading-[1.05] tracking-tight text-white">
        L’Empreinte
        <br />
        du <span className="text-[#f3294a]">Suspect</span>
      </h1>

      <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-[#00aaff] bg-[#071b43]/80 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_16px_rgba(0,153,255,0.25)]">
        <MapPin className="h-5 w-5 fill-[#f3294a] text-[#f3294a]" aria-hidden="true" />
        Indice Monde Réel #2
      </div>
    </header>
  );
}