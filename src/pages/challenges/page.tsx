import { Challenge1Page } from './challenge1/page';
import { Challenge2Page } from './challenge2/page';
import { Challenge3Page } from './challenge3/page';
import { Challenge4Page } from './challenge4/page';
import { Challenge5Page } from './challenge5/page';
import { Challenge6Page } from './challenge6/page';
import type { ChallengeId } from '../../domain/hunt/types';
import type { ChallengePageProps } from './types';

interface ChallengePagesProps extends ChallengePageProps {
  challengeId: ChallengeId;
}

const PAGES = {
  1: Challenge1Page,
  2: Challenge2Page,
  3: Challenge3Page,
  4: Challenge4Page,
  5: Challenge5Page,
  6: Challenge6Page,
};

export function ChallengePages({ challengeId, ...pageProps }: ChallengePagesProps) {
  const Page = PAGES[challengeId];
  return <Page {...pageProps} />;
}
