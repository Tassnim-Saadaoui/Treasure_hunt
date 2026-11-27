import { useState } from 'react';
import { soundEngine } from '../../../../lib/audio/soundEngine';
import type { ChallengePageProps } from '../../types';
import { AnswerSection, type ChatbotAnswer } from './AnswerSection';
import { ChallengeHeader } from './ChallengeHeader';
import { ChatbotSection } from './ChatbotSection';
import { isCorrectServerAnswer } from './challenge3Logic';
import { SituationCard } from './SituationCard';
import { ValidationResult, type ChallengeThreeResult } from './ValidationResult';

export function ChallengeThree({
  completedIds,
  isUnlocked,
  onComplete,
  onVoyageToMap,
}: ChallengePageProps) {
  const isAlreadySolved = completedIds.includes(3);
  const [selectedAnswer, setSelectedAnswer] = useState<ChatbotAnswer | null>(null);
  const [result, setResult] = useState<ChallengeThreeResult>(isAlreadySolved ? 'correct' : null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isSolved = isAlreadySolved || result === 'correct';

  const handleSubmit = async () => {
    if (!isUnlocked || isSubmitting || isSolved) return;
    if (!selectedAnswer) {
      setError('Choisissez le terminal où se cache le virus avant de valider.');
      setResult(null);
      return;
    }

    setError(null);
    setIsSubmitting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 220));
    const isCorrect = isCorrectServerAnswer(selectedAnswer);
    setResult(isCorrect ? 'correct' : 'incorrect');
    setIsSubmitting(false);

    if (isCorrect) {
      soundEngine.play('correct');
      onComplete(3);
    } else {
      soundEngine.play('error');
    }
  };

  return (
    <main className="relative mx-auto flex min-h-[calc(100svh-1rem)] w-full max-w-[760px] flex-col overflow-hidden rounded-[2rem] border border-[#0758b5] bg-[radial-gradient(ellipse_at_50%_10%,#09265a_0%,#041433_48%,#03102c_100%)] px-3 pb-3 pt-2 shadow-[0_0_36px_rgba(0,85,210,.25)] sm:px-5 sm:pb-5">
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-28 h-56 w-72 rounded-full bg-[#ed1238]/35 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -right-24 h-56 w-72 rounded-full bg-[#087cf0]/25 blur-3xl" />

      <div className="relative z-10 mx-auto flex w-full max-w-[690px] flex-1 flex-col gap-3 sm:gap-4">
        <ChallengeHeader />
        <SituationCard />
        <ChatbotSection />

        <section className="mt-auto space-y-3 rounded-[1.9rem] bg-gradient-to-b from-white to-[#f2f4ff] p-2.5 shadow-[0_-8px_24px_rgba(179,197,255,.2)] sm:p-3.5">
          <ValidationResult result={result} onContinue={() => onVoyageToMap(3)} />
          <AnswerSection
            selectedAnswer={selectedAnswer}
            isSubmitting={isSubmitting}
            isSolved={isSolved}
            error={error}
            isUnlocked={isUnlocked}
            onSelect={(answer) => {
              setSelectedAnswer(answer);
              setResult(null);
              setError(null);
            }}
            onSubmit={() => void handleSubmit()}
          />
        </section>
      </div>
    </main>
  );
}
