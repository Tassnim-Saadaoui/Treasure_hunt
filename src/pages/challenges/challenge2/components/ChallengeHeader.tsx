import { AlertTriangle, Clock3, Plane } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ChallengeHeader() {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setElapsedSeconds((seconds) => seconds + 1);
    }, 1000);
    return () => window.clearInterval(timerId);
  }, []);

  const minutes = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
  const seconds = (elapsedSeconds % 60).toString().padStart(2, '0');

  return (
    <header className="relative px-3 pb-3 pt-2 text-center sm:px-5">
      <div className="absolute right-0 top-2 flex h-14 w-14 items-center justify-center rounded-full border-[4px] border-[#087cf0] border-t-[#ed1238] bg-[#08204c] shadow-[0_0_20px_rgba(0,132,255,0.22)] sm:right-2 sm:h-16 sm:w-16">
        <span className="flex items-center gap-0.5 text-xs font-bold tabular-nums text-white sm:text-sm">
          <Clock3 className="h-3.5 w-3.5 text-cyan-300" aria-hidden="true" />
          {minutes}:{seconds}
        </span>
      </div>

      <div className="relative mx-auto mt-2 flex h-20 w-32 items-center justify-center text-[#00aaff] sm:h-24 sm:w-40">
        <div className="absolute inset-2 rounded-[2rem] border border-dashed border-[#087cf0]/40" />
        <Plane className="h-16 w-16 rotate-[-18deg] drop-shadow-[0_0_12px_rgba(0,153,255,0.6)] sm:h-20 sm:w-20" strokeWidth={1.6} />
        <span className="absolute right-2 top-1 flex h-8 w-8 items-center justify-center rounded-full border border-orange-300/70 bg-orange-500 text-white shadow-[0_0_16px_rgba(249,115,22,0.7)]">
          <AlertTriangle className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="absolute -left-1 top-1 h-4 w-4 rounded-tl-md border-l-4 border-t-4 border-[#00aaff]" />
        <span className="absolute -right-1 top-1 h-4 w-4 rounded-tr-md border-r-4 border-t-4 border-[#00aaff]" />
        <span className="absolute -bottom-1 left-0 h-4 w-4 rounded-bl-md border-b-4 border-l-4 border-[#00aaff]" />
        <span className="absolute -bottom-1 right-0 h-4 w-4 rounded-br-md border-b-4 border-r-4 border-[#00aaff]" />
      </div>

      <h1 className="mt-1 text-[1.65rem] font-extrabold italic leading-tight tracking-tight text-white sm:text-3xl">
        Diagnostic : le drone
        <br />
        de livraison <span className="text-[#f3294a]">bloqué</span>
      </h1>

      <div className="mx-auto mt-3 inline-flex items-center gap-2 rounded-full border border-[#00aaff] bg-[#071b43]/80 px-3.5 py-2 text-xs font-semibold text-white shadow-[0_0_16px_rgba(0,153,255,0.25)] sm:text-sm">
        <span className="h-2 w-2 rounded-full bg-[#f3294a] shadow-[0_0_8px_rgba(243,41,74,0.8)]" />
        Résolution de problème réel
      </div>
    </header>
  );
}
