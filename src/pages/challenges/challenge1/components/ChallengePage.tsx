import { useCallback, useState } from 'react';
import { soundEngine } from '../../../../lib/audio/soundEngine';
import { getChallengeById } from '../../../../data/challenges';
import { PlayerAuthError, submitChallenge1Answer } from '../../../../infrastructure/persistence/PlayerAuthClient';
import type { ChallengePageProps } from '../../types';
import { AnswerSection } from './AnswerSection';
import { ChallengeHeader } from './ChallengeHeader';
import { HintButton } from './HintButton';
import { HintModal } from './HintModal';
import { QRCodeScanner } from './QRCodeScanner';
import { SituationCard } from './SituationCard';

const challenge = getChallengeById(1);
if (!challenge) throw new Error('Challenge 1 configuration is missing.');

const hint = "Cherchez là où l'on branche l'énergie, à moins de 3 mètres de l'entrée principale.";

export function ChallengePage({
  completedIds,
  isUnlocked,
  onComplete,
  onVoyageToMap,
}: ChallengePageProps) {
  const isSolved = completedIds.includes(1);
  const [answer, setAnswer] = useState('');
  const [isHintOpen, setIsHintOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDetected = useCallback((value: string) => {
    setAnswer(value);
    setError(null);
    setIsScannerOpen(false);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!isUnlocked) {
      setError('Ce challenge est encore verrouillé.');
      return;
    }

    if (isSolved) {
      onVoyageToMap(1);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await submitChallenge1Answer(answer);
    } catch (submitError) {
      soundEngine.play('error');
      setError(
        submitError instanceof PlayerAuthError
          ? submitError.message
          : 'Impossible de vérifier la réponse. Réessayez.'
      );
      return;
    } finally {
      setIsSubmitting(false);
    }

    soundEngine.play('correct');
    onComplete(1);
    onVoyageToMap(1);
  }, [answer, isSolved, isUnlocked, onComplete, onVoyageToMap]);

  return (
    <section className="relative mx-auto flex min-h-[calc(100svh-6.5rem)] w-full max-w-[430px] flex-col overflow-hidden rounded-[2rem] border border-[#0758b5] bg-[radial-gradient(ellipse_at_50%_25%,#09265a_0%,#041433_52%,#03102c_100%)] px-4 pb-3 shadow-[0_0_36px_rgba(0,85,210,0.25)] sm:px-5">
      <div className="pointer-events-none absolute -left-20 -top-20 h-40 w-64 -rotate-12 rounded-[50%] bg-gradient-to-br from-[#ed1238]/70 to-transparent blur-2xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-16 h-40 w-64 rotate-[-15deg] rounded-[50%] bg-gradient-to-tl from-[#ed1238]/60 to-transparent blur-2xl" />
      <div className="relative z-10 flex min-h-[inherit] flex-1 flex-col">
        <ChallengeHeader />
        <main className="flex flex-col gap-3">
          <SituationCard />
          <QRCodeScanner
            isOpen={isScannerOpen}
            onOpen={() => setIsScannerOpen(true)}
            onClose={() => setIsScannerOpen(false)}
            onDetected={handleDetected}
          />
          <HintButton onClick={() => setIsHintOpen(true)} />
          <HintModal isOpen={isHintOpen} hint={hint} onClose={() => setIsHintOpen(false)} />
        </main>
        <div className="mt-auto pt-4">
          <AnswerSection
            value={answer}
            isUnlocked={isUnlocked}
            isSubmitting={isSubmitting}
            error={error}
            onChange={(value) => {
              setAnswer(value);
              setError(null);
            }}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </section>
  );
}
