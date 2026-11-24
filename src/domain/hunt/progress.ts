import type { ChallengeId, ExplorerProfile, HuntProgressState } from './types';

export const CHALLENGE_IDS: readonly ChallengeId[] = [1, 2, 3, 4, 5, 6];

export function createInitialProgressState(): HuntProgressState {
  return {
    profile: null,
    completedIds: [],
    hintsUsedByChallenge: {},
    startedAt: null,
    completedAt: null,
    soundEnabled: true,
  };
}

export function normalizeProgressState(value: unknown): HuntProgressState {
  const initial = createInitialProgressState();
  if (!value || typeof value !== 'object') return initial;

  const candidate = value as Partial<HuntProgressState>;
  const completedIds = Array.isArray(candidate.completedIds)
    ? [...new Set(candidate.completedIds.filter(isChallengeId))].sort((a, b) => a - b)
    : [];
  const hintsUsedByChallenge: Record<number, number> = {};

  if (candidate.hintsUsedByChallenge && typeof candidate.hintsUsedByChallenge === 'object') {
    for (const [rawId, rawCount] of Object.entries(candidate.hintsUsedByChallenge)) {
      const id = Number(rawId);
      if (isChallengeId(id) && Number.isFinite(rawCount)) {
        hintsUsedByChallenge[id] = Math.max(0, Math.min(2, Math.floor(rawCount)));
      }
    }
  }

  return {
    profile: isExplorerProfile(candidate.profile) ? candidate.profile : null,
    completedIds,
    hintsUsedByChallenge,
    startedAt: isTimestamp(candidate.startedAt) ? candidate.startedAt : null,
    completedAt: isTimestamp(candidate.completedAt) ? candidate.completedAt : null,
    soundEnabled: typeof candidate.soundEnabled === 'boolean' ? candidate.soundEnabled : true,
  };
}

export function joinHunt(
  state: HuntProgressState,
  profile: Omit<ExplorerProfile, 'joinedAt'>,
  now = Date.now()
): HuntProgressState {
  return {
    ...state,
    profile: { ...profile, joinedAt: now },
    startedAt: state.startedAt ?? now,
  };
}

export function completeChallenge(
  state: HuntProgressState,
  id: ChallengeId,
  now = Date.now()
): HuntProgressState {
  const completedIds = state.completedIds.includes(id)
    ? state.completedIds
    : [...state.completedIds, id].sort((a, b) => a - b);
  const isComplete = completedIds.length === CHALLENGE_IDS.length;

  return {
    ...state,
    startedAt: state.startedAt ?? now,
    completedIds,
    completedAt: isComplete ? state.completedAt ?? now : state.completedAt,
  };
}

export function recordHint(state: HuntProgressState, id: ChallengeId): HuntProgressState {
  const currentCount = state.hintsUsedByChallenge[id] ?? 0;
  return {
    ...state,
    hintsUsedByChallenge: {
      ...state.hintsUsedByChallenge,
      [id]: Math.min(2, currentCount + 1),
    },
  };
}

export function toggleSound(state: HuntProgressState): HuntProgressState {
  return { ...state, soundEnabled: !state.soundEnabled };
}

export function resetProgress(state: HuntProgressState): HuntProgressState {
  return { ...createInitialProgressState(), soundEnabled: state.soundEnabled };
}

export function getNextChallengeId(completedIds: readonly ChallengeId[]): ChallengeId {
  return CHALLENGE_IDS.find((id) => !completedIds.includes(id)) ?? CHALLENGE_IDS.at(-1)!;
}

export function areAllChallengesCompleted(completedIds: readonly ChallengeId[]): boolean {
  return CHALLENGE_IDS.every((id) => completedIds.includes(id));
}

function isChallengeId(value: unknown): value is ChallengeId {
  return typeof value === 'number' && CHALLENGE_IDS.includes(value as ChallengeId);
}

function isTimestamp(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isExplorerProfile(value: unknown): value is ExplorerProfile {
  if (!value || typeof value !== 'object') return false;
  const profile = value as Partial<ExplorerProfile>;
  return (
    typeof profile.explorerName === 'string' &&
    typeof profile.teamName === 'string' &&
    ['Navigation', 'Engineering', 'Cryptography', 'Strategy'].includes(profile.specialty ?? '') &&
    isTimestamp(profile.joinedAt)
  );
}
