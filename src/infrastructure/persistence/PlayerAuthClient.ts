import type { ChallengeId, HuntProgressState } from '../../domain/hunt/types';

export interface PlayerRecord {
  id: string;
  nickname: string;
  avatar: string;
  score: number;
  current_challenge: number;
  completed_challenges: number;
  created_at: string;
}

export interface PlayerAuthResult {
  player: PlayerRecord;
  progress: HuntProgressState;
}

export class PlayerAuthError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
    this.name = 'PlayerAuthError';
  }
}

let activeNickname: string | null = null;

function getFunctionConfig(): { url: string; apiKey: string } {
  const projectUrl = import.meta.env.VITE_SUPABASE_URL?.trim().replace(/\/+$/, '');
  const apiKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
  if (!projectUrl || !apiKey) {
    throw new PlayerAuthError(
      'Player login is not configured. Set the Supabase URL and public anon key, then deploy the player-auth function.',
      0
    );
  }
  return { url: `${projectUrl}/functions/v1/player-auth`, apiKey };
}

export function getAvatarPublicUrl(filename: string): string {
  if (!/^avatar[1-8]\.jpg$/.test(filename)) return '';
  const projectUrl = import.meta.env.VITE_SUPABASE_URL?.trim().replace(/\/+$/, '');
  return projectUrl
    ? `${projectUrl}/storage/v1/object/public/Avatars/${encodeURIComponent(filename)}`
    : '';
}

async function post(body: Record<string, unknown>): Promise<unknown> {
  const { url, apiKey } = getFunctionConfig();
  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: apiKey },
      body: JSON.stringify(body),
    });
  } catch {
    throw new PlayerAuthError('Could not reach the login service. Check your connection and try again.', 0);
  }

  const payload = (await response.json().catch(() => null)) as { error?: unknown } | null;
  if (!response.ok) {
    const message = typeof payload?.error === 'string'
      ? payload.error
      : 'The login service returned an unexpected response.';
    throw new PlayerAuthError(message, response.status);
  }
  return payload;
}

function toProgress(player: PlayerRecord): HuntProgressState {
  const storedCompletedCount = Number.isFinite(player.completed_challenges)
    ? Math.floor(player.completed_challenges)
    : 0;
  const completedCount = Math.max(0, Math.min(6, storedCompletedCount));
  const currentChallenge = Number.isFinite(player.current_challenge)
    ? Math.floor(player.current_challenge)
    : 1;
  const currentChallengeProgress = Math.max(0, Math.min(6, currentChallenge - 1));
  const restoredCount = Math.max(completedCount, currentChallengeProgress);
  const completedIds = Array.from(
    { length: restoredCount },
    (_, index) => index + 1 as ChallengeId
  );
  const createdAt = Date.parse(player.created_at);
  const startedAt = Number.isFinite(createdAt) ? createdAt : Date.now();

  return {
    profile: {
      explorerName: player.nickname,
      teamName: player.nickname,
      specialty: 'Backend',
      joinedAt: startedAt,
      avatar: player.avatar,
    },
    completedIds,
    hintsUsedByChallenge: {},
    startedAt,
    completedAt: null,
    soundEnabled: true,
  };
}

export async function authenticatePlayer(input: {
  nickname: string;
  avatar: string;
}): Promise<PlayerAuthResult> {
  const payload = await post({ action: 'authenticate', ...input }) as {
    player?: PlayerRecord;
  } | null;
  if (!payload?.player) {
    throw new PlayerAuthError('The login service returned incomplete player data.', 502);
  }
  activeNickname = input.nickname;
  return { player: payload.player, progress: toProgress(payload.player) };
}

export async function savePlayerProgress(progress: HuntProgressState): Promise<void> {
  if (!activeNickname) return;
  await post({
    action: 'saveProgress',
    nickname: activeNickname,
    progress,
  });
}

export async function submitChallenge1Answer(answer: string): Promise<void> {
  if (!activeNickname) {
    throw new PlayerAuthError('Sign in before submitting a challenge answer.', 401);
  }

  const payload = await post({
    action: 'submitChallenge1',
    nickname: activeNickname,
    answer,
  }) as { player?: PlayerRecord } | null;
  if (!payload?.player) {
    throw new PlayerAuthError('The challenge service returned incomplete player data.', 502);
  }
}
