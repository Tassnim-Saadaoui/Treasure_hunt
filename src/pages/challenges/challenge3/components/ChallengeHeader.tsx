import { CircleHelp, MapPin } from 'lucide-react';

export function ChallengeHeader() {
  return (
    <header className="relative px-3 pb-3 pt-1 text-center sm:px-5">
      <div className="absolute right-0 top-9 flex h-14 w-14 items-center justify-center rounded-full border-[4px] border-[#087cf0] border-t-[#ed1238] bg-[#08204c] shadow-[0_0_20px_rgba(0,132,255,0.22)] sm:right-2 sm:top-10 sm:h-16 sm:w-16">
        <span className="text-sm font-bold tabular-nums text-white sm:text-base">0:07</span>
      </div>

      <div className="relative mx-auto mt-2 flex h-[112px] w-[170px] items-center justify-center sm:mt-3 sm:h-[135px] sm:w-[205px]">
        <span className="absolute left-1 top-2 h-9 w-9 rounded-tl-lg border-l-[5px] border-t-[5px] border-[#00aaff] shadow-[-4px_-4px_15px_rgba(0,170,255,.35)]" />
        <span className="absolute right-1 top-2 h-9 w-9 rounded-tr-lg border-r-[5px] border-t-[5px] border-[#00aaff] shadow-[4px_-4px_15px_rgba(0,170,255,.35)]" />
        <img
          src="/chatbots/alpha.svg"
          alt=""
          className="h-[112px] w-[112px] object-contain drop-shadow-[0_0_16px_rgba(0,166,255,.5)] sm:h-[132px] sm:w-[132px]"
        />
        <span className="absolute right-5 top-6 flex h-12 w-12 items-center justify-center rounded-full border border-cyan-300/70 bg-[#061535]/90 text-cyan-100 shadow-[0_0_14px_rgba(0,170,255,.4)] sm:right-3">
          <CircleHelp className="h-8 w-8" />
        </span>
        <span className="absolute bottom-1 left-0 h-8 w-8 rounded-bl-lg border-b-[5px] border-l-[5px] border-[#00aaff]" />
        <span className="absolute bottom-1 right-0 h-8 w-8 rounded-br-lg border-b-[5px] border-r-[5px] border-[#00aaff]" />
      </div>

      <h1 className="mx-auto mt-1 max-w-[540px] text-[1.65rem] font-extrabold italic leading-[1.08] tracking-tight text-white sm:text-4xl">
        Le Paradoxe
        <br />
        des <span className="text-[#f3294a]">Trois</span> Serveurs
      </h1>

      <div className="mx-auto mt-3 inline-flex items-center gap-2 rounded-full border border-[#00aaff] bg-[#071b43]/80 px-5 py-2 text-sm font-semibold text-white shadow-[0_0_16px_rgba(0,153,255,0.25)]">
        <MapPin className="h-5 w-5 fill-[#f3294a] text-[#f3294a]" aria-hidden="true" />
        Défi Logique
      </div>
    </header>
  );
}