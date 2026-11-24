export type ChallengeId = 1 | 2 | 3 | 4 | 5 | 6;

export type AppRoute =
  | { path: '/'; view: 'home' }
  | { path: '/join'; view: 'join' }
  | { path: '/rules'; view: 'rules' }
  | { path: '/treasure'; view: 'treasure' }
  | { path: `/challenges/${ChallengeId}`; view: 'challenge'; challengeId: ChallengeId };

export type ChallengeStatus = 'locked' | 'active' | 'completed';

export interface ChallengeDefinition {
  id: ChallengeId;
  numberLabel: string;
  difficulty: 'Warm-up' | 'Easy' | 'Intermediate' | 'Hard' | 'Final Boss';
  title: string;
  discipline: string;
  shortPrompt: string;
  storyBrief: string;
  locationHint: string;
  hints: [string, string];
  clueToken: string;
  estimatedMinutes: number;
  side: 'left' | 'right';
}

export interface ExplorerProfile {
  explorerName: string;
  teamName: string;
  specialty: 'Frontend' | 'Backend' | 'DevOps' | 'QA / Testing';
  joinedAt: number;
}

export interface HuntProgressState {
  profile: ExplorerProfile | null;
  completedIds: ChallengeId[];
  hintsUsedByChallenge: Record<number, number>;
  startedAt: number | null;
  completedAt: number | null;
  soundEnabled: boolean;
}

export type SoundEffectName =
  | 'click'
  | 'hoverTick'
  | 'stepUnlock'
  | 'correct'
  | 'error'
  | 'hint'
  | 'compassTick'
  | 'gearClick'
  | 'keyTurn'
  | 'treasureFanfare';
