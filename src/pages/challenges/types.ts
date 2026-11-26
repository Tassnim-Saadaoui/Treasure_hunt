import type { ChallengeId } from '../../domain/hunt/types';

export interface ChallengePageProps {
  completedIds: ChallengeId[];
  isUnlocked: boolean;
  onComplete: (id: ChallengeId) => void;
  onVoyageToMap: (fromId: ChallengeId) => void;
}

