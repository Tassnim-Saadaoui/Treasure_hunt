import { UserRound } from 'lucide-react';

interface NicknameInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function NicknameInput({ value, onChange }: NicknameInputProps) {
  return (
    <div className="rounded-3xl border border-[#1B3A70] bg-[#0A1B3D]/90 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.12)] sm:p-5">
      <label htmlFor="player-username" className="flex items-center gap-3 text-lg font-bold text-white sm:text-xl">
        <UserRound className="h-7 w-7 text-[#F5C542]" fill="#F5C542" strokeWidth={1.8} />
        Username
      </label>
      <input
        id="player-username"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Enter your username..."
        autoComplete="username"
        maxLength={20}
        required
        className="mt-3 min-h-[58px] w-full rounded-2xl border border-[#50688F] bg-[#0A1835] px-4 text-base text-white outline-none transition-colors placeholder:text-slate-400 focus:border-[#F5C542] focus:ring-2 focus:ring-[#F5C542]/20 sm:px-5 sm:text-lg"
      />
    </div>
  );
}
