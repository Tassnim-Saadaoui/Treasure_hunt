import { Check, ImageOff, Palette } from 'lucide-react';
import { getAvatarPublicUrl } from '../../../infrastructure/persistence/PlayerAuthClient';

const AVATARS = Array.from({ length: 8 }, (_, index) => `avatar${index + 1}.jpg`);

interface AvatarSelectorProps {
  selectedAvatar: string;
  onSelect: (avatar: string) => void;
}

export function AvatarSelector({ selectedAvatar, onSelect }: AvatarSelectorProps) {
  return (
    <section aria-labelledby="avatar-title">
      <h2 id="avatar-title" className="mb-3 flex items-center gap-3 text-lg font-bold text-slate-200 sm:text-xl">
        <Palette className="h-7 w-7 text-[#E11D3F]" fill="#E11D3F" strokeWidth={1.8} />
        <span>
          Choose your <span className="text-[#E11D3F]">avatar</span>
        </span>
      </h2>
      <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
        {AVATARS.map((filename) => {
          const isSelected = selectedAvatar === filename;
          const imageUrl = getAvatarPublicUrl(filename);
          return (
            <button
              key={filename}
              type="button"
              onClick={() => onSelect(filename)}
              aria-label={`Choose pirate avatar ${filename.replace('.jpg', '')}`}
              aria-pressed={isSelected}
              className={`group relative aspect-square rounded-2xl border-2 bg-[#0A1B3D] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C542] focus-visible:ring-offset-2 focus-visible:ring-offset-[#061535] ${
                isSelected
                  ? 'scale-[1.03] border-[#FFC247] shadow-[0_0_20px_rgba(255,194,71,0.7)]'
                  : 'border-[#39547E] hover:scale-[1.02] hover:border-[#F5C542]/70'
              }`}
            >
              <span className="absolute inset-0 overflow-hidden rounded-[0.85rem]">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                    loading="eager"
                  />
                ) : (
                  <span className="flex h-full flex-col items-center justify-center gap-1 text-[10px] text-slate-400">
                    <ImageOff className="h-5 w-5" />
                    {filename.replace('.jpg', '')}
                  </span>
                )}
              </span>
              {isSelected && (
                <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#061535] bg-[#D71936] text-white shadow-lg">
                  <Check className="h-4 w-4" strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
