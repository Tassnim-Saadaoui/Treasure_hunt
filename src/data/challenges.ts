import type { ChallengeDefinition } from '../domain/hunt/types';

/** The trail is deliberately ordered from quick wins to multi-step reasoning. */
export const CHALLENGES: ChallengeDefinition[] = [
  {
    id: 1,
    numberLabel: 'Challenge 1',
    difficulty: 'Warm-up',
    title: 'The Departure',
    discipline: 'Networking',
    shortPrompt: 'Route the release packet from East to the North-East production node.',
    storyBrief:
      'The release bot has one job: send the packet from East (90 degrees) to the North-East production node. It is currently pointing at staging. Rotate the compass 45 degrees counter-clockwise. DevOps says the deployment is "probably fine"; the compass disagrees.',
    locationHint: 'The Router Room',
    hints: [
      'Treat the compass like a simple direction enum: East is 90 degrees. Which way gets you to North-East?',
      'North-East is halfway between North (0) and East (90): select 45 degrees.',
    ],
    clueToken: 'R9',
    estimatedMinutes: 2,
    side: 'left',
  },
  {
    id: 2,
    numberLabel: 'Challenge 2',
    difficulty: 'Easy',
    title: 'The Technological Riddle',
    discipline: 'Performance Engineering',
    shortPrompt: 'Predict the direction and rotation count of the build farm output gear.',
    storyBrief:
      'The build farm has modeled its job scheduler as a literal gear train. Gear A turns once clockwise, then drives B, then C. Predict C before the CI dashboard files another "performance regression" ticket.',
    locationHint: 'The Build Farm',
    hints: [
      'Every pair of meshing gears reverses direction. A to B is one reversal; B to C is a second.',
      'The middle gear changes direction but cancels out of the final ratio. Compare A (24 teeth) with C (12 teeth): C turns twice, clockwise.',
    ],
    clueToken: 'C4',
    estimatedMinutes: 3,
    side: 'right',
  },
  {
    id: 3,
    numberLabel: 'Challenge 3',
    difficulty: 'Intermediate',
    title: 'The Exploration',
    discipline: 'Debugging and Observability',
    shortPrompt: 'Use the incident trace to locate the service returning the mysterious 500.',
    storyBrief:
      'The on-call bot has posted a 47-line stack trace, three screenshots of a dashboard, and the words "works on my machine." Ignore the noise: use the service map and follow the one reliable clue.',
    locationHint: 'The Incident Room',
    hints: [
      'The trace says the failing service is directly south of the Worker. Find the Worker on the grid.',
      'The Worker is at B3. One row south in the same column is C3: Database. The cache is innocent for at least five minutes.',
    ],
    clueToken: 'D2',
    estimatedMinutes: 4,
    side: 'left',
  },
  {
    id: 4,
    numberLabel: 'Challenge 4',
    difficulty: 'Intermediate',
    title: 'The Encryption',
    discipline: 'Binary and Encoding',
    shortPrompt: 'Decode four ASCII bytes to find what the release is ready to do.',
    storyBrief:
      'The CI runner printed its status in binary, then went offline to "focus." Decode the four 8-bit ASCII characters from left to right and enter the release instruction.',
    locationHint: 'The CI Runner Cage',
    hints: [
      'Each 8-bit group is one ASCII character. Convert a byte to decimal, then use the ASCII table; for example, 0100 0001 is 65, or A.',
      'The four bytes decode to S, H, I, P. The runner may now go back to sleep.',
    ],
    clueToken: 'I7',
    estimatedMinutes: 5,
    side: 'right',
  },
  {
    id: 5,
    numberLabel: 'Challenge 5',
    difficulty: 'Hard',
    title: 'The Crossing',
    discipline: 'Scheduling and Optimization',
    shortPrompt: 'Move four CI jobs across a flaky bridge in 17 minutes or less.',
    storyBrief:
      'Four pipeline jobs must cross the bridge to production. The bridge can run at most two jobs at a time, and the single runner token must travel with every crossing. A pair moves at the slower job\'s speed. Ship everything in 17 minutes or less, or the legacy build gets another hour.',
    locationHint: 'The Production Bridge',
    hints: [
      'The two slowest jobs are expensive to move separately. Consider sending them together, then plan how the runner token returns.',
      'One optimal schedule is: Lint + Unit Tests (2), Lint back (1), Integration Tests + Legacy Build (10), Unit Tests back (2), Lint + Unit Tests (2). Total: 17 minutes.',
    ],
    clueToken: 'GREEN',
    estimatedMinutes: 8,
    side: 'left',
  },
  {
    id: 6,
    numberLabel: 'Challenge 6',
    difficulty: 'Final Boss',
    title: 'The Final Challenge',
    discipline: 'Systems Thinking',
    shortPrompt: 'Trace the request through the stack and assemble the vault code from your clues.',
    storyBrief:
      'The vault accepts only the code from a correctly traced request: the Router receives it, Identity checks it, Cache looks for a warm result, and Database handles a miss. Take the digit from each matching clue token in that order. If the order is wrong, the release manager will call it "a learning opportunity."',
    locationHint: 'The Production Vault',
    hints: [
      'Trace the request from entry to storage: Router, Identity, Cache, Database. Match each service to the token with the same first letter.',
      'Read R9, I7, C4, D2 in that order. The code is 9742.',
    ],
    clueToken: 'PROD',
    estimatedMinutes: 6,
    side: 'right',
  },
];

export function getChallengeById(id: number): ChallengeDefinition | undefined {
  return CHALLENGES.find((challenge) => challenge.id === id);
}
