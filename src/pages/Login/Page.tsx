import { useState, type FormEvent } from 'react';
import {
  authenticatePlayer,
  PlayerAuthError,
  type PlayerAuthResult,
} from '../../infrastructure/persistence/PlayerAuthClient';
import { AvatarSelector } from './components/AvatarSelector';
import { NicknameInput } from './components/NicknameInput';
import { StartAdventureButton } from './components/StartAdventureButton';

interface PlayerAuthPageProps {
  onAuthenticated: (player: PlayerAuthResult) => void;
  initialError?: string | null;
}

export function PlayerAuthPage({ onAuthenticated, initialError }: PlayerAuthPageProps) {
  const [nickname, setNickname] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('avatar1.jpg');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError ?? null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanNickname = nickname.trim();
    if (cleanNickname.length < 2 || cleanNickname.length > 20) {
      setError('Nickname must contain between 2 and 20 characters.');
      return;
    }
    if (!/^[\p{L}\p{N} _-]+$/u.test(cleanNickname)) {
      setError('Use letters, numbers, spaces, hyphens, or underscores in your nickname.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const player = await authenticatePlayer({
        nickname: cleanNickname,
        avatar: selectedAvatar,
      });
      onAuthenticated(player);
    } catch (requestError) {
      setError(
        requestError instanceof PlayerAuthError
          ? requestError.message
          : 'Something went wrong while starting your adventure. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#061535] text-slate-100">
      <div aria-hidden="true" className="auth-corner auth-corner-top" />
      <div aria-hidden="true" className="auth-corner auth-corner-bottom" />

      <div className="relative z-10 mx-auto w-full max-w-[650px] px-5 pb-10 pt-10 sm:px-8 sm:pt-12">
        <header className="mb-8 text-center sm:mb-9">
          <img
            src="/nateg-treasure-hunt-logo.png"
            alt="NATEG Treasure Hunt"
            className="mx-auto w-full max-w-[585px] select-none"
            draggable={false}
          />
          <p className="mx-auto mt-2 max-w-md text-base font-semibold leading-relaxed text-slate-300 sm:mt-4 sm:text-lg">
            Choose your identity to
            <br className="sm:hidden" /> start the <span className="text-[#F02B43]">adventure!</span>
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-7">
          <NicknameInput
            value={nickname}
            onChange={(value) => {
              setNickname(value);
              setError(null);
            }}
          />
          <AvatarSelector
            selectedAvatar={selectedAvatar}
            onSelect={(avatar) => {
              setSelectedAvatar(avatar);
              setError(null);
            }}
          />
          {error && (
            <p
              role="alert"
              className="rounded-xl border border-[#F02B43]/60 bg-[#8F1028]/30 px-4 py-3 text-center text-sm font-medium text-red-100"
            >
              {error}
            </p>
          )}

          <StartAdventureButton isLoading={isLoading} disabled={isLoading} />
        </form>
      </div>
    </main>
  );
}