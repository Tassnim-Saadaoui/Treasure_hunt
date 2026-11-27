import type { ChallengeId } from '../../domain/hunt/types';
import { Building2, Compass, Drum, MapPinned } from 'lucide-react';

interface ArtworkProps {
  className?: string;
}

export function CompassIllustration({ className = 'w-16 h-16' }: ArtworkProps) {
  return (
    <svg viewBox="0 0 96 96" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="compassGold" x1="16" y1="16" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFE27A" />
          <stop offset="50%" stopColor="#F5C542" />
          <stop offset="100%" stopColor="#C48A14" />
        </linearGradient>
      </defs>
      <circle cx="48" cy="14" r="6" stroke="url(#compassGold)" strokeWidth="4" />
      <rect x="44" y="18" width="8" height="6" rx="2" fill="url(#compassGold)" />
      <circle cx="48" cy="54" r="32" fill="url(#compassGold)" />
      <circle cx="48" cy="54" r="25.5" fill="#F8FAFC" stroke="#B45309" strokeWidth="1.5" />
      <path d="M48 31V35M48 73V77M25 54H29M67 54H71" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
      <text x="48" y="42" textAnchor="middle" fill="#1E293B" fontSize="8" fontWeight="700">
        N
      </text>
      <text x="48" y="70" textAnchor="middle" fill="#475569" fontSize="7" fontWeight="700">
        S
      </text>
      <text x="63" y="56.5" textAnchor="middle" fill="#475569" fontSize="7" fontWeight="700">
        E
      </text>
      <text x="33" y="56.5" textAnchor="middle" fill="#475569" fontSize="7" fontWeight="700">
        W
      </text>
      <g transform="rotate(34 48 54)">
        <polygon points="48,35 53,54 43,54" fill="#DC2626" />
        <polygon points="48,73 53,54 43,54" fill="#2563EB" />
      </g>
      <circle cx="48" cy="54" r="4" fill="#F5C542" stroke="#1E293B" strokeWidth="1.5" />
    </svg>
  );
}

export function GearsIllustration({ className = 'w-16 h-16' }: ArtworkProps) {
  return (
    <svg viewBox="0 0 96 96" fill="none" className={className} aria-hidden="true">
      <g transform="translate(36 52)">
        <circle cx="0" cy="0" r="18" fill="#64748B" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <rect
            key={deg}
            x="-4"
            y="-24"
            width="8"
            height="10"
            rx="2"
            fill="#94A3B8"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle cx="0" cy="0" r="16" fill="#94A3B8" />
        <circle cx="0" cy="0" r="7" fill="#0A1B42" />
      </g>
      <g transform="translate(65 31)">
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <rect
            key={deg}
            x="-3.5"
            y="-17"
            width="7"
            height="8"
            rx="1.5"
            fill="#CBD5E1"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle cx="0" cy="0" r="12" fill="#CBD5E1" />
        <circle cx="0" cy="0" r="5" fill="#0A1B42" />
      </g>
      <g transform="translate(67 66)">
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <rect
            key={deg}
            x="-2.5"
            y="-12"
            width="5"
            height="6"
            rx="1"
            fill="#94A3B8"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle cx="0" cy="0" r="8.5" fill="#94A3B8" />
        <circle cx="0" cy="0" r="3.5" fill="#0A1B42" />
      </g>
    </svg>
  );
}

export function MapMagnifierIllustration({ className = 'w-16 h-16' }: ArtworkProps) {
  return (
    <svg viewBox="0 0 96 96" fill="none" className={className} aria-hidden="true">
      <polygon points="14,26 36,20 36,68 14,74" fill="#E2D3B3" />
      <polygon points="36,20 58,26 58,74 36,68" fill="#F4EBD3" />
      <polygon points="58,26 80,20 80,68 58,74" fill="#E2D3B3" />
      <path d="M22 54 C30 40, 44 58, 52 44 C60 32, 68 48, 74 36" stroke="#16A34A" strokeWidth="3" strokeDasharray="4 3" fill="none" />
      <path d="M28 32 C31 27, 36 29, 34 34 L31 41 L28 34 Z" fill="#DC2626" />
      <circle cx="31" cy="32" r="2" fill="#FFFFFF" />
      <g transform="translate(62 52) rotate(38)">
        <rect x="-3" y="14" width="6" height="20" rx="3" fill="#7C2D12" />
        <circle cx="0" cy="0" r="15" fill="#BAE6FD" fillOpacity="0.45" stroke="#475569" strokeWidth="4" />
        <path d="M-7 -6 C-4 -10, 2 -11, 6 -8" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function CircuitChipIllustration({ className = 'w-16 h-16' }: ArtworkProps) {
  return (
    <svg viewBox="0 0 96 96" fill="none" className={className} aria-hidden="true">
      <rect x="16" y="20" width="64" height="56" rx="8" fill="#06233D" stroke="#38BDF8" strokeWidth="2.5" />
      <path d="M8 34H16M8 48H16M8 62H16M80 34H88M80 48H88M80 62H88" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
      <text x="24" y="37" fill="#7DD3FC" fontFamily="monospace" fontSize="10" fontWeight="700">
        0100
      </text>
      <text x="24" y="51" fill="#38BDF8" fontFamily="monospace" fontSize="10" fontWeight="700">
        0010
      </text>
      <text x="24" y="65" fill="#7DD3FC" fontFamily="monospace" fontSize="10" fontWeight="700">
        0101
      </text>
      <path d="M54 34H66V44M54 52H68V64" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
      <circle cx="66" cy="44" r="3" fill="#38BDF8" />
      <circle cx="68" cy="64" r="3" fill="#7DD3FC" />
    </svg>
  );
}

export function SuspensionBridgeIllustration({ className = 'w-16 h-16' }: ArtworkProps) {
  return (
    <svg viewBox="0 0 96 96" fill="none" className={className} aria-hidden="true">
      <path d="M8 66 Q48 56 88 66" stroke="#C8102E" strokeWidth="4" strokeLinecap="round" />
      <rect x="28" y="30" width="5" height="36" rx="1.5" fill="#DC2626" />
      <rect x="63" y="30" width="5" height="36" rx="1.5" fill="#DC2626" />
      <path d="M10 62 Q20 44 30 32 Q48 58 66 32 Q76 44 86 62" stroke="#EF4444" strokeWidth="2.5" fill="none" />
      <path d="M21 48V63M39 46V61M48 48V60M57 46V61M75 48V63" stroke="#C8102E" strokeWidth="1.5" />
    </svg>
  );
}

export function GoldenKeyIllustration({ className = 'w-16 h-16' }: ArtworkProps) {
  return (
    <svg viewBox="0 0 96 96" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="keyGold" x1="20" y1="76" x2="76" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D97706" />
          <stop offset="50%" stopColor="#FACC15" />
          <stop offset="100%" stopColor="#FEF08A" />
        </linearGradient>
      </defs>
      <g transform="rotate(-42 48 48)">
        <circle cx="68" cy="48" r="14" stroke="url(#keyGold)" strokeWidth="7" />
        <rect x="18" y="44" width="38" height="8" rx="3" fill="url(#keyGold)" />
        <rect x="20" y="52" width="6" height="10" rx="1.5" fill="url(#keyGold)" />
        <rect x="30" y="52" width="6" height="7" rx="1.5" fill="url(#keyGold)" />
      </g>
    </svg>
  );
}

export function TreasureChestIllustration({ className = 'w-32 h-32' }: ArtworkProps) {
  return (
    <svg viewBox="0 0 140 120" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="chestWood" x1="25" y1="40" x2="115" y2="105" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#B45309" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
        <linearGradient id="chestGold" x1="20" y1="20" x2="120" y2="110" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="50%" stopColor="#F5C542" />
          <stop offset="100%" stopColor="#CA8A04" />
        </linearGradient>
      </defs>
      <ellipse cx="70" cy="106" rx="46" ry="8" fill="#000000" fillOpacity="0.45" />
      {/* Open Lid */}
      <path d="M26 52 C26 24, 52 14, 92 22 L110 40 L34 56 Z" fill="url(#chestWood)" stroke="url(#chestGold)" strokeWidth="5" />
      <path d="M46 22 L62 48M74 20 L88 44" stroke="url(#chestGold)" strokeWidth="4" />
      {/* Gold & Gems inside */}
      <ellipse cx="72" cy="56" rx="38" ry="13" fill="#451A03" />
      <circle cx="52" cy="52" r="7" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
      <circle cx="64" cy="48" r="8" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" />
      <circle cx="78" cy="50" r="7.5" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
      <circle cx="91" cy="53" r="6.5" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" />
      <polygon points="69,40 77,45 73,53 65,52" fill="#EC4899" />
      <polygon points="84,42 93,44 90,52 82,49" fill="#38BDF8" />
      <polygon points="56,43 62,48 56,54 50,48" fill="#34D399" />
      {/* Base */}
      <path d="M26 56 H114 L108 100 H32 Z" fill="url(#chestWood)" stroke="url(#chestGold)" strokeWidth="5" strokeLinejoin="round" />
      <rect x="38" y="56" width="8" height="44" fill="url(#chestGold)" />
      <rect x="94" y="56" width="8" height="44" fill="url(#chestGold)" />
      {/* Lock */}
      <rect x="62" y="64" width="16" height="18" rx="4" fill="url(#chestGold)" stroke="#78350F" strokeWidth="2" />
      <circle cx="70" cy="71" r="2.5" fill="#451A03" />
      <path d="M68.5 72 L71.5 72 L72 77 L68 77 Z" fill="#451A03" />
      {/* Loose coins */}
      <ellipse cx="22" cy="102" rx="8" ry="4" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
      <ellipse cx="32" cy="105" rx="7" ry="3.5" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" />
    </svg>
  );
}

export function ChallengeIcon({ id, className }: { id: ChallengeId; className?: string }) {
  switch (id) {
    case 1:
      return <CompassIllustration className={className} />;
    case 2:
      return <GearsIllustration className={className} />;
    case 3:
      return <MapMagnifierIllustration className={className} />;
    case 4:
      return <Building2 className={className ? `${className} text-[#00B8FF]` : 'h-16 w-16 text-[#00B8FF]'} strokeWidth={1.5} />;
    case 5:
      return <Drum className={className ? `${className} text-[#00B8FF]` : 'h-16 w-16 text-[#00B8FF]'} strokeWidth={1.5} />;
    case 6:
      return (
        <span className={`relative inline-flex shrink-0 items-center justify-center ${className ?? 'h-16 w-16'}`} aria-hidden="true">
          <Compass className="h-[82%] w-[82%] text-[#00B8FF]" strokeWidth={1.5} />
          <MapPinned className="absolute bottom-[2%] right-[1%] h-[42%] w-[42%] rounded-full bg-[#061433] p-[2px] text-[#F22555]" strokeWidth={2} />
        </span>
      );
  }
}
