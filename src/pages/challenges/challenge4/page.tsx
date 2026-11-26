import { ChallengePageFrame } from '../components/ChallengePageFrame';
import type { ChallengePageProps } from '../types';

export function Challenge4Page(props: ChallengePageProps) {
  return (
    <ChallengePageFrame {...props} challengeId={4} />
  );
}
