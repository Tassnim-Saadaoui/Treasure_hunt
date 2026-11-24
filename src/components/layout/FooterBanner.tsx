interface FooterBannerProps {
  onNavigate: (path: string) => void;
  onReset: () => void;
}

export function FooterBanner({ onNavigate, onReset }: FooterBannerProps) {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#040C20]/90 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-white/20" />
          <p className="text-center text-xs sm:text-sm font-medium tracking-wide text-slate-200">
            Un événement organisé par NATEG ISSATSo Student Chapter
          </p>
          <div className="h-px flex-1 bg-white/20" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="min-h-[44px] px-1 hover:text-white transition-colors whitespace-nowrap"
            >
              Expedition Map
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/rules')}
              className="min-h-[44px] px-1 hover:text-white transition-colors whitespace-nowrap"
            >
              Event Rules
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/treasure')}
              className="min-h-[44px] px-1 hover:text-white transition-colors whitespace-nowrap"
            >
              Treasure Vault
            </button>
          </div>

          <button
            type="button"
            onClick={onReset}
            className="min-h-[44px] px-2 text-slate-400 hover:text-[#F5C542] transition-colors whitespace-nowrap"
          >
            Reset Expedition Progress
          </button>
        </div>
      </div>
    </footer>
  );
}
