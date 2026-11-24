import type { ChallengeDefinition } from '../domain/hunt/types';

export const CHALLENGES: ChallengeDefinition[] = [
  {
    id: 1,
    numberLabel: 'Challenge 1',
    title: 'The Departure',
    discipline: 'Orientation',
    shortPrompt: 'Calibrate the expedition compass to the ISSATSo North-East beacon.',
    storyBrief:
      'Every expedition begins with true bearing. Read the field log carefully and rotate the brass compass ring until the needle locks onto the exact departure azimuth.',
    locationHint: 'Main Courtyard Sundial · Sousse Campus',
    hints: [
      'Start facing East (90°), then rotate 45° counter-clockwise toward North-East.',
      'The target bearing sits halfway between North (0°) and East (90°): 45° NE.',
    ],
    clueToken: 'N4',
    estimatedMinutes: 2,
    side: 'left',
  },
  {
    id: 2,
    numberLabel: 'Challenge 2',
    title: 'The Technological Riddle',
    discipline: 'Engineering Logic',
    shortPrompt: 'Synchronize the interlocking gear ratios and solve the workshop riddle.',
    storyBrief:
      'Inside the robotics lab, a three-gear drive blocks the next waypoint. Determine how the drive train turns and set the final output gear state.',
    locationHint: 'Mechatronics Workshop · Block B',
    hints: [
      'Adjacent meshing gears always spin in opposite directions: Gear A clockwise means Gear B spins counter-clockwise.',
      'With 3 gears in series (A → B → C), Gear C spins clockwise at 24 teeth = 12 teeth × 2, so 1 full turn of A yields 2 turns of C.',
    ],
    clueToken: 'T7',
    estimatedMinutes: 3,
    side: 'right',
  },
  {
    id: 3,
    numberLabel: 'Challenge 3',
    title: 'The Exploration',
    discipline: 'Cartography',
    shortPrompt: 'Cross-reference the campus sector grid to pinpoint the buried archive.',
    storyBrief:
      'Use the explorer magnifier over the 4×4 sector map. Follow the triangulation clues to mark the exact coordinate holding the third relay.',
    locationHint: 'Engineering Library · West Wing',
    hints: [
      'The archive is NOT in Row A or Row D, and it shares a column with the Observatory (Column 3).',
      'Check Row C, Column 3 (C3) — south of the central courtyard fountain.',
    ],
    clueToken: 'G2',
    estimatedMinutes: 3,
    side: 'left',
  },
  {
    id: 4,
    numberLabel: 'Challenge 4',
    title: 'The Encryption',
    discipline: 'Cryptography',
    shortPrompt: 'Decode the 4-byte binary circuit transmission left by the NATEG cipher team.',
    storyBrief:
      'A glowing circuit board pulses with 8-bit ASCII frames. Convert each byte from binary to its uppercase letter to reveal the four-letter passkey.',
    locationHint: 'Computer Science Terminal · Lab 04',
    hints: [
      'Uppercase ASCII letters start at 65 (0100 0001 = A). Count the offset in the lower 5 bits!',
      '0100 1000 = 72 (H), 0101 0101 = 85 (U), 0100 1110 = 78 (N), 0101 0100 = 84 (T).',
    ],
    clueToken: 'E9',
    estimatedMinutes: 4,
    side: 'right',
  },
  {
    id: 5,
    numberLabel: 'Challenge 5',
    title: 'The Crossing',
    discipline: 'Systems Strategy',
    shortPrompt: 'Route all four team members across the crimson bridge before the lantern fades.',
    storyBrief:
      'Only two explorers may cross the suspension span at once, and they must carry the single signal lantern back each trip. Keep total crossing time within 17 minutes.',
    locationHint: 'Crimson Suspension Span · East Gate',
    hints: [
      'Send the two fastest explorers (1 min & 2 min) first, return the 1 min runner, then send the two slowest (5 min & 10 min) together!',
      'Optimal sequence: (1+2)=2 → return 1 (+1=3) → (5+10)=10 (+10=13) → return 2 (+2=15) → (1+2)=2 (Total = 17 min).',
    ],
    clueToken: 'C5',
    estimatedMinutes: 4,
    side: 'left',
  },
  {
    id: 6,
    numberLabel: 'Challenge 6',
    title: 'The Final Challenge',
    discipline: 'Master Key Vault',
    shortPrompt: 'Align the golden key tumblers using your collected clues to unlock the chest.',
    storyBrief:
      'You stand before the NATEG Treasure Vault. Enter the 4-digit master cipher formed by the numeric digits of your first four clue tokens (Challenges 1 to 4) or verify the vault seal.',
    locationHint: 'Grand Amphitheater · Final Vault',
    hints: [
      'Look at the numbers inside the Clue Tokens earned from Challenges 1, 2, 3, and 4.',
      'Combine the digits from N4, T7, G2, and E9 in order: 4-7-2-9.',
    ],
    clueToken: 'GOLD',
    estimatedMinutes: 2,
    side: 'right',
  },
];

export function getChallengeById(id: number): ChallengeDefinition | undefined {
  return CHALLENGES.find((challenge) => challenge.id === id);
}
