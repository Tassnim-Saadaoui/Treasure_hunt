import { useState } from 'react';
import { Check, Compass, Navigation } from 'lucide-react';
import { soundEngine } from '../../../../lib/audio/soundEngine';

interface TreasureMapPuzzleProps {
  isSolved: boolean;
  onSolve: () => void;
  onWrongAttempt: (message: string) => void;
}

const DIRECTIONS = ['Nord-Ouest', 'Nord-Est', 'Sud-Est', 'Sud-Ouest'] as const;

export function TreasureMapPuzzle({ isSolved, onSolve, onWrongAttempt }: TreasureMapPuzzleProps) {
  const [selectedDirection, setSelectedDirection] = useState<(typeof DIRECTIONS)[number] | null>(null);

  const handleCheck = () => {
    if (selectedDirection === 'Nord-Ouest') {
      soundEngine.play('treasureFanfare');
      onSolve();
      return;
    }

    soundEngine.play('error');
    onWrongAttempt('Observe la boussole et compare le bateau avec le X : le tr\u00e9sor se trouve en haut et \u00e0 gauche du bateau.');
  };

  return (
    <div className="mx-auto w-full max-w-lg space-y-4 text-left">
      <div className="rounded-2xl border border-white/10 bg-[#051029]/70 p-4">
        <p className="text-sm leading-relaxed text-slate-100">
          Le crabe te laisse un indice : <span className="font-semibold italic text-[#F5C542]">&laquo; Creuse ici, mais pas trop fort, j&rsquo;ai mal au dos. &raquo;</span>
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          Depuis le bateau, suis le pointill&eacute;. Dans quelle direction se trouve le X ?
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border-4 border-[#8B5E3C] bg-[#F4E8C9] shadow-lg">
        <svg viewBox="0 0 360 220" role="img" aria-labelledby="treasure-map-title" className="block h-auto w-full">
          <title id="treasure-map-title">Carte au tr&eacute;sor : bateau, pointill&eacute;, X rouge et boussole</title>
          <rect width="360" height="220" fill="#F4E8C9" />
          <path d="M0 177 C45 164 63 193 105 179 S178 167 216 183 S294 198 360 176 V220 H0Z" fill="#B9DFDC" />
          <path d="M47 157 C33 129 43 83 75 60 C102 41 125 27 166 29 C202 30 235 44 255 60 C282 82 297 104 281 119 C264 133 239 119 220 127 C199 136 194 159 168 166 C143 173 123 154 99 164 C77 173 57 174 47 157Z" fill="#F4C542" stroke="#C98D27" strokeWidth="3" />
          <path d="M263 47 C272 38 286 37 295 46 M281 44 L284 27 M278 30 L286 34" fill="none" stroke="#367A3C" strokeWidth="5" strokeLinecap="round" />
          <path d="M270 159 C241 128 220 101 205 76 C190 54 171 45 151 48" fill="none" stroke="#9B4A28" strokeWidth="3" strokeDasharray="6 7" strokeLinecap="round" />
          <path d="M145 39 L162 56 M162 39 L145 56" stroke="#D92727" strokeWidth="6" strokeLinecap="round" />
          <text x="72" y="151" fontSize="30" textAnchor="middle">&#x1F980;</text>
          <path d="M254 165 L288 165 L278 181 L259 181Z" fill="#8B4528" stroke="#60351F" strokeWidth="2" />
          <path d="M271 135 L271 164 L290 164Z" fill="#F7F4E8" stroke="#52677A" strokeWidth="2" />
          <path d="M250 184 H292" stroke="#60351F" strokeWidth="3" strokeLinecap="round" />
          <circle cx="34" cy="34" r="18" fill="#FFFDF6" stroke="#52677A" strokeWidth="2" />
          <path d="M34 20 L40 35 L34 48 L28 35Z" fill="#D92727" stroke="#9D2222" strokeWidth="1" />
          <text x="34" y="14" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#334155">N</text>
          <rect x="0" y="196" width="360" height="24" fill="#FFFDF6" />
          <text x="180" y="212" fontSize="10" fontWeight="700" textAnchor="middle" fill="#55402C">Creuse ici, mais pas trop fort, j&rsquo;ai mal au dos.</text>
        </svg>
      </div>

      {isSolved ? (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-500/10 p-4 text-center font-semibold text-emerald-200" role="status">
          <Check className="h-5 w-5" /> Tr&eacute;sor trouv&eacute; ! Le X se trouve au nord-ouest du bateau.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2">
            {DIRECTIONS.map((direction) => (
              <button
                key={direction}
                type="button"
                aria-pressed={selectedDirection === direction}
                onClick={() => {
                  soundEngine.play('click');
                  setSelectedDirection(direction);
                }}
                className={`flex min-h-[48px] items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
                  selectedDirection === direction
                    ? 'border-[#F5C542] bg-[#F5C542]/15 text-[#F5C542]'
                    : 'border-white/10 bg-[#07163B] text-slate-200 hover:border-white/30'
                }`}
              >
                <Navigation className={`h-4 w-4 ${direction === 'Nord-Ouest' ? '-rotate-45' : direction === 'Nord-Est' ? 'rotate-45' : direction === 'Sud-Est' ? 'rotate-[135deg]' : 'rotate-[225deg]'}`} />
                {direction}
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={!selectedDirection}
            onClick={handleCheck}
            className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#C8102E] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(200,16,46,0.35)] transition-colors hover:bg-[#E11D3F] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Compass className="h-4 w-4" /> Verifier la direction
          </button>
        </>
      )}
    </div>
  );
}
