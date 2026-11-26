import type { ChallengeId } from '../../domain/hunt/types';
import { TreasureTrailMap, type VoyageTransition } from './components/TreasureTrailMap';

interface HomePageProps {
  completedIds: ChallengeId[];
  nextRecommendedId: ChallengeId;
  maxUnlockedId: ChallengeId;
  isAllCompleted: boolean;
  voyageTransition: VoyageTransition | null;
  onVoyageArrival: () => void;
  onSelectChallenge: (id: ChallengeId) => void;
  onPrimaryCta: () => void;
}

export function HomePage(props: HomePageProps) {
  return <TreasureTrailMap {...props} />;
}
