import type { ChallengeDefinition, ChallengeId } from '../domain/hunt/types';

/** Existing content IDs in the new trail order: 5, 1, 2, 4, 3, 6. */
export const CHALLENGE_CONTENT_ID_BY_STAGE: readonly ChallengeId[] = [5, 1, 2, 4, 3, 6];

const CONTENT_CHALLENGES: ChallengeDefinition[] = [
  {
    id: 1,
    numberLabel: 'Challenge 1',
    difficulty: 'Warm-up',
    title: 'L’Empreinte du Suspect',
    discipline: 'Recherche d’indice',
    shortPrompt: 'Trouvez le QR code caché et validez le mot-clé.',
    storyBrief:
      'Un indice QR est caché près de l’entrée principale. Scannez-le, puis entrez le mot-clé pour poursuivre la chasse.',
    locationHint: 'Près de l’entrée principale',
    hints: [
      'Cherchez près de l’entrée principale, autour d’une prise électrique.',
      'Le QR code est à moins de trois mètres de l’entrée.',
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
    title: 'Le Code de la Salle Serveur',
    discipline: 'Observation et calcul',
    shortPrompt: 'Repérez deux nombres dans la salle et multipliez-les pour trouver le code.',
    storyBrief:
      'Repérez le nombre de sessions au programme et le nombre de membres du bureau, puis multipliez ces deux valeurs.',
    locationHint: 'La salle serveur',
    hints: [
      'Observez le nombre de sessions au programme et comptez les membres du bureau.',
      'Multipliez les deux nombres pour obtenir le code.',
    ],
    clueToken: '20',
    estimatedMinutes: 2,
    side: 'right',
  },
  {
    id: 5,
    numberLabel: 'Challenge 5',
    difficulty: 'Hard',
    title: 'L’Énigme musicale',
    discipline: 'Écoute et déduction',
    shortPrompt: 'Écoutez le rythme et trouvez les deux notes manquantes.',
    storyBrief:
      'Le studio a laissé deux notes manquantes à la fin du roulement. Écoutez le motif, repérez sa progression et complétez les deux temps.',
    locationHint: 'Le studio de batterie',
    hints: [
      'Écoutez les trois mesures et repérez le motif qui se répète.',
      'La séquence complète se termine par les notes S puis P.',
    ],
    clueToken: 'SP',
    estimatedMinutes: 3,
    side: 'left',
  },
  {
    id: 6,
    numberLabel: 'Challenge 6',
    difficulty: 'Final Boss',
    title: 'La carte de Barbe-Rouill\u00e9e',
    discipline: 'Navigation et observation',
    shortPrompt: 'Remets les douze pièces de la carte dans l’ordre pour trouver le X et le code de la suite.',
    storyBrief:
      'Barbe-Rouill\u00e9e avait dessin\u00e9 sa carte au tr\u00e9sor avec amour. La mouette G\u00e9rard l\u2019a vol\u00e9e pour faire son nid et en a dispers\u00e9 les douze morceaux sur la plage. Remets la carte en ordre pour trouver o\u00f9 creuser.',
    locationHint: 'La crique de Barbe-Rouill\u00e9e',
    hints: [
      'Replace les pièces numérotées dans l’ordre, de 1 à 12, de gauche à droite puis rangée par rangée.',
      'Une fois assembl\u00e9e, la carte indique le X et r\u00e9v\u00e8le le code inscrit au dos.',
    ],
    clueToken: 'X',
    estimatedMinutes: 2,
    side: 'right',
  },
];

/** Stage IDs describe progression order; content IDs keep page implementations identifiable. */
export const CHALLENGES: ChallengeDefinition[] = CHALLENGE_CONTENT_ID_BY_STAGE.map(
  (contentId, index) => {
    const content = CONTENT_CHALLENGES.find((challenge) => challenge.id === contentId);
    if (!content) throw new Error(`Challenge content ${contentId} is missing.`);
    return {
      ...content,
      id: (index + 1) as ChallengeId,
      numberLabel: `Challenge ${index + 1}`,
    };
  }
);

export function getChallengeById(id: number): ChallengeDefinition | undefined {
  return CHALLENGES.find((challenge) => challenge.id === id);
}
