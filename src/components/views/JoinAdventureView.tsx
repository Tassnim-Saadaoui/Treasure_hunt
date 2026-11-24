import { useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { soundEngine } from '../../lib/audio/soundEngine';
import type { ExplorerProfile } from '../../domain/hunt/types';
import { CompassIllustration } from '../artwork/ChallengeArtwork';

interface JoinAdventureViewProps {
  existingProfile: ExplorerProfile | null;
  onJoin: (profile: Omit<ExplorerProfile, 'joinedAt'>) => void;
  onNavigate: (path: string, options?: { silent?: boolean }) => void;
}

const SPECIALTIES: ExplorerProfile['specialty'][] = [
  'Frontend',
  'Backend',
  'DevOps',
  'QA / Testing',
];

export function JoinAdventureView({
  existingProfile,
  onJoin,
  onNavigate,
}: JoinAdventureViewProps) {
  const [explorerName, setExplorerName] = useState(existingProfile?.explorerName ?? '');
  const [teamName, setTeamName] = useState(existingProfile?.teamName ?? '');
  const [specialty, setSpecialty] = useState<ExplorerProfile['specialty']>(
    existingProfile?.specialty ?? 'Backend'
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanExplorer = explorerName.trim();
    const cleanTeam = teamName.trim();

    if (!cleanExplorer || !cleanTeam) {
      soundEngine.play('error');
      setError('Please enter both your explorer name and your team name.');
      return;
    }

    onJoin({
      explorerName: cleanExplorer,
      teamName: cleanTeam,
      specialty,
    });
    onNavigate('/challenges/1', { silent: true });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <button
        type="button"
        onClick={() => onNavigate('/')}
        className="flex min-h-[44px] items-center gap-2 rounded-xl border border-white/15 bg-[#0A1B42] px-4 py-2 text-xs sm:text-sm font-medium text-slate-200 hover:border-white/30 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Trail</span>
      </button>

      <section className="rounded-3xl border border-white/10 bg-[#0A1B42] p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center gap-4 border-b border-white/10 pb-6">
          <CompassIllustration className="h-16 w-16 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-[#F5C542]">NATEG ISSATSo Student Chapter</p>
            <h1 className="mt-0.5 font-display text-2xl sm:text-3xl font-bold text-white">
              Join the Adventure
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Register your team details to start the 6-stage treasure hunt.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="explorer-name" className="block text-xs font-semibold text-slate-200">
              Developer Name
            </label>
            <input
              id="explorer-name"
              type="text"
              value={explorerName}
              onChange={(e) => setExplorerName(e.target.value)}
              placeholder="e.g. Tasnim Ben Ali"
              className="mt-1.5 min-h-[48px] w-full rounded-xl border border-white/15 bg-[#051029] px-4 text-sm text-white placeholder:text-slate-500 focus:border-[#F5C542] focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="team-name" className="block text-xs font-semibold text-slate-200">
              Squad Name
            </label>
            <input
              id="team-name"
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. Sousse Pioneers"
              className="mt-1.5 min-h-[48px] w-full rounded-xl border border-white/15 bg-[#051029] px-4 text-sm text-white placeholder:text-slate-500 focus:border-[#F5C542] focus:outline-none"
            />
          </div>

          <div>
            <span className="block text-xs font-semibold text-slate-200">Engineering Role</span>
            <div className="mt-2 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {SPECIALTIES.map((item) => {
                const active = specialty === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      soundEngine.play('click');
                      setSpecialty(item);
                    }}
                    className={`min-h-[44px] rounded-xl border px-3 text-xs font-semibold transition-colors ${
                      active
                        ? 'border-[#F5C542] bg-[#F5C542] text-[#051029]'
                        : 'border-white/15 bg-[#051029] text-slate-300 hover:border-white/35'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <p className="rounded-xl border border-[#E11D3F]/50 bg-[#C8102E]/15 px-4 py-3 text-xs text-red-100">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#C8102E] px-6 py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(200,16,46,0.4)] transition-transform duration-150 hover:bg-[#E11D3F] active:scale-[0.98]"
          >
            <span>Start Challenge 1</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </section>
    </div>
  );
}
