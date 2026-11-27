export interface DiagnosticMetric {
  label: string;
  value: string;
  status?: 'normal' | 'inspect';
}

export const propulsionMetrics: DiagnosticMetric[] = [
  { label: 'Hélices', value: 'Fonctionnement normal', status: 'normal' },
  { label: 'Rotation', value: '4 820 RPM', status: 'normal' },
  { label: 'Synchronisation', value: 'Optimale', status: 'normal' },
  { label: 'Température moteur', value: '46 °C', status: 'normal' },
  { label: 'Vibrations', value: '0,02 G', status: 'normal' },
  { label: 'Contrôleurs ESC', value: 'Actifs · 4/4', status: 'normal' },
];

export const batteryMetrics: DiagnosticMetric[] = [
  { label: 'Niveau de charge', value: '98 %', status: 'normal' },
  { label: 'Tension', value: 'Normale', status: 'normal' },
  { label: 'État batterie', value: 'Opérationnel', status: 'normal' },
  { label: 'Température', value: 'Normale', status: 'normal' },
];

export const sensorMetrics: DiagnosticMetric[] = [
  { label: 'GPS', value: '12 satellites', status: 'normal' },
  { label: 'Signal', value: 'Stable', status: 'normal' },
  { label: 'Altimètre', value: 'Opérationnel', status: 'normal' },
  { label: 'Gyroscope', value: 'Calibré', status: 'normal' },
];

export const cargoMetrics: DiagnosticMetric[] = [
  { label: 'Type de colis', value: 'Carton médical' },
  { label: 'Poids déclaré', value: '1,8 kg' },
  { label: 'Charge maximale', value: '2 kg' },
  { label: 'État du colis', value: 'Inspection visuelle requise', status: 'inspect' },
];

export const progressiveHints = [
  'Vérifiez les caractéristiques de transport du drone. Chaque modèle possède une limite de charge qu’il ne faut pas dépasser.',
  'Le poids déclaré du colis est proche de la limite maximale autorisée. Mais cette valeur correspond-elle forcément à son poids actuel ?',
  'Examinez attentivement le colis dans la vue panoramique. Pensez aux conditions météorologiques et à leur effet sur les matériaux.',
] as const;
