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
    clueToken: 'Bonjour',
    estimatedMinutes: 2,
    side: 'left',
  },
  {
    id: 2,
    numberLabel: 'Challenge 2',
    difficulty: 'Intermediate',
    title: 'Le drone de livraison bloqué',
    discipline: 'Résolution de problème réel',
    shortPrompt: 'Diagnostiquez pourquoi un drone médical refuse de décoller.',
    storyBrief:
      'Un drone médical doit livrer un vaccin urgent sur le toit d’un hôpital, mais il refuse de décoller et affiche une alerte orange générique : ERREUR_VOL_04.',
    locationHint: 'Toit de l’hôpital',
    hints: [
      'Vérifiez les caractéristiques de transport du drone. Chaque modèle possède une limite de charge qu’il ne faut pas dépasser.',
      'Le poids déclaré du colis est proche de la limite maximale autorisée. Mais cette valeur correspond-elle forcément à son poids actuel ?',
    ],
    clueToken: 'WEIGHT',
    estimatedMinutes: 5,
    side: 'right',
  },
  {
    id: 3,
    numberLabel: 'Challenge 3',
    difficulty: 'Intermediate',
    title: 'Le Paradoxe des Trois Serveurs',
    discipline: 'Défi Logique',
    shortPrompt: 'Déterminez dans quel terminal se cache le virus.',
    storyBrief:
      'Trois terminaux d’IA (Alpha, Bêta, Gamma) sont en réseau. Un seul dit toujours la vérité, les deux autres mentent toujours. Un virus est caché dans un seul terminal. Alpha dit : « Le virus est chez Gamma. » Bêta dit : « Le virus n’est pas chez moi. » Gamma dit : « Alpha dit la vérité. » Dans quel terminal se cache le virus ?',
    locationHint: 'Salle des serveurs',
    hints: [
      'Un seul terminal dit vrai. Essayez chaque emplacement possible du virus et comptez combien de déclarations deviennent vraies.',
      'Si le virus est chez Alpha, vérifiez séparément les affirmations de Bêta et de Gamma : combien sont vraies ?',
    ],
    clueToken: 'ALPHA',
    estimatedMinutes: 5,
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
    title: 'La carte au tr\u00e9sor',
    discipline: 'Navigation et observation',
    shortPrompt: 'Lis la carte et trouve la direction du bateau vers le X.',
    storyBrief:
      'Un vieux crabe garde le tr\u00e9sor de la crique. Suis le pointill\u00e9 depuis le bateau et rep\u00e8re le X avec la boussole pour trouver o\u00f9 creuser.',
    locationHint: 'La crique du crabe',
    hints: [
      'Sur la boussole, le nord est en haut et l\u2019ouest \u00e0 gauche. Compare la position du bateau avec celle du X.',
      'Le X est au nord-ouest du bateau.',
    ],
    clueToken: 'X',
    estimatedMinutes: 2,
    side: 'right',
  },
];

export function getChallengeById(id: number): ChallengeDefinition | undefined {
  return CHALLENGES.find((challenge) => challenge.id === id);
}
