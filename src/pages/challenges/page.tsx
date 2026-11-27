import { Challenge1Page } from './challenge1/page';
import { Challenge2Page } from './challenge2/page';
import { Challenge3Page } from './challenge3/page';
import { Challenge4Page } from './challenge4/page';
import { Challenge5Page } from './challenge5/page';
import { Challenge6Page } from './challenge6/page';
import type { ChallengeId } from '../../domain/hunt/types';
import type { ChallengePageProps } from './types';
import { CHALLENGE_CONTENT_ID_BY_STAGE } from '../../data/challenges';

interface ChallengePagesProps extends ChallengePageProps {
  challengeId: ChallengeId;
}

const PAGES = {
  1: Challenge5Page,
  2: Challenge1Page,
  3: Challenge2Page,
  4: Challenge4Page,
  5: Challenge3Page,
  6: Challenge6Page,
};

const CONTENT_ID_BY_STAGE = Object.fromEntries(
  CHALLENGE_CONTENT_ID_BY_STAGE.map((contentId, index) => [index + 1, contentId])
) as Record<ChallengeId, ChallengeId>;
const STAGE_ID_BY_CONTENT_ID = Object.fromEntries(
  CHALLENGE_CONTENT_ID_BY_STAGE.map((contentId, index) => [contentId, index + 1])
) as Record<ChallengeId, ChallengeId>;

export function ChallengePages({ challengeId, ...pageProps }: ChallengePagesProps) {
  const Page = PAGES[challengeId];
  return (
    <Page
      {...pageProps}
      completedIds={pageProps.completedIds.map((stageId) => CONTENT_ID_BY_STAGE[stageId])}
      onComplete={(contentId) => pageProps.onComplete(STAGE_ID_BY_CONTENT_ID[contentId])}
      onVoyageToMap={(contentId) => pageProps.onVoyageToMap(STAGE_ID_BY_CONTENT_ID[contentId])}
    />
  );
}
