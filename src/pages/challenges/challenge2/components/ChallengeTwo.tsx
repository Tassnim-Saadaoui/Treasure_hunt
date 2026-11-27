import { useState } from 'react';
import { motion } from 'motion/react';
import { CircleCheck, Info } from 'lucide-react';
import { soundEngine } from '../../../../lib/audio/soundEngine';
import type { ChallengePageProps } from '../../types';
import { AnswerOptions, type DiagnosticAnswer } from './AnswerOptions';
import { ChallengeHeader } from './ChallengeHeader';
import { DiagnosticTabs } from './DiagnosticTabs';
import { DroneScene } from './DroneScene';
import { HintButton } from './HintButton';
import { HintModal } from './HintModal';
import { SituationCard } from './SituationCard';
import { ValidationResult } from './ValidationResult';

type AnswerStatus = 'correct' | 'incorrect' | null;

export function ChallengeTwo({
  completedIds,
  isUnlocked,
  onComplete,
  onVoyageToMap,
}: ChallengePageProps) {
  const isAlreadySolved = completedIds.includes(2);
  const [selectedAnswer, setSelectedAnswer] = useState<DiagnosticAnswer | null>(null);
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>(isAlreadySolved ? 'correct' : null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHintOpen, setIsHintOpen] = useState(false);
  const [hintsSeen, setHintsSeen] = useState(0);
  const [answerError, setAnswerError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!isUnlocked || isSubmitting || answerStatus === 'correct' || isAlreadySolved) return;
    if (!selectedAnswer) {
      setAnswerError('Sélectionnez une proposition avant de valider.');
      setAnswerStatus(null);
      return;
    }

    setAnswerError(null);
    setIsSubmitting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 300));
    const isCorrect = selectedAnswer === 'weight';
    setAnswerStatus(isCorrect ? 'correct' : 'incorrect');
    setIsSubmitting(false);

    if (isCorrect) {
      soundEngine.play('correct');
      onComplete(2);
    } else {
      soundEngine.play('error');
    }
  };

  const solved = isAlreadySolved || answerStatus === 'correct';

  return (
    <section className="relative mx-auto flex min-h-[calc(100svh-1rem)] w-full max-w-[760px] flex-col overflow-hidden rounded-[2rem] border border-[#0758b5] bg-[radial-gradient(ellipse_at_50%_8%,#09265a_0%,#041433_48%,#03102c_100%)] px-3 pb-4 shadow-[0_0_36px_rgba(0,85,210,0.25)] sm:px-5 sm:pb-5">
      <div className="pointer-events-none absolute -left-24 -top-24 h-52 w-72 -rotate-12 rounded-[50%] bg-gradient-to-br from-[#ed1238]/40 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-20 h-52 w-72 rotate-[-15deg] rounded-[50%] bg-gradient-to-tl from-[#ed1238]/35 to-transparent blur-3xl" />

      <div className="relative z-10 mx-auto flex w-full max-w-[620px] flex-1 flex-col gap-3 sm:gap-4">
        <ChallengeHeader />
        <SituationCard />
        <DroneScene />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className="min-w-0 flex-1">
            <DiagnosticTabs />
          </div>
          <div className="shrink-0 sm:pt-7">
            <HintButton hintsSeen={hintsSeen} onClick={() => setIsHintOpen(true)} />
          </div>
        </div>

        <HintModal
          isOpen={isHintOpen}
          hintsSeen={hintsSeen}
          onNext={() => setHintsSeen((current) => Math.min(current + 1, 2))}
          onClose={() => setIsHintOpen(false)}
        />

        <section className="mt-auto rounded-t-[1.8rem] border-t border-blue-100 bg-gradient-to-b from-white to-[#f2f4ff] px-3 pb-3 pt-3 text-slate-900 shadow-[0_-8px_24px_rgba(179,197,255,0.18)] sm:px-5 sm:pt-4">
          <AnswerOptions
            value={selectedAnswer}
            disabled={solved || isSubmitting}
            onChange={(value) => {
              setSelectedAnswer(value);
              setAnswerStatus(null);
              setAnswerError(null);
            }}
          />

          {answerError && (
            <p className="mb-2 text-center text-xs font-semibold text-[#c8102e]" role="alert">
              {answerError}
            </p>
          )}
          <ValidationResult
            status={answerStatus}
            onContinue={() => onVoyageToMap(2)}
          />

          {!solved && (
            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={!isUnlocked || isSubmitting}
              className="flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#fa1235] to-[#d90025] px-5 py-2.5 text-base font-bold text-white shadow-[0_8px_20px_rgba(220,0,38,0.24)] transition-transform hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:text-lg"
            >
              <CircleCheck className="h-6 w-6" strokeWidth={2.5} aria-hidden="true" />
              {isSubmitting ? 'Analyse en cours…' : 'Valider'}
            </button>
          )}
          {!isUnlocked && (
            <p className="mt-2 text-center text-xs font-semibold text-[#c8102e]" role="alert">
              Ce challenge est encore verrouillé.
            </p>
          )}
          <div className="mx-auto mt-3 h-1.5 w-1/2 max-w-36 rounded-full bg-[#2f4f91]" aria-hidden="true" />
          {solved && answerStatus !== 'correct' && (
            <motion.button
              type="button"
              onClick={() => onVoyageToMap(2)}
              whileTap={{ scale: 0.98 }}
              className="mt-3 flex min-h-11 w-full items-center justify-center rounded-full bg-[#087cf0] px-5 text-sm font-bold text-white"
            >
              Retourner à la carte
            </motion.button>
          )}
          <p className="mt-2 flex items-center justify-center gap-1 text-[0.65rem] text-slate-500">
            <Info className="h-3.5 w-3.5" aria-hidden="true" />
            Un seul diagnostic peut être sélectionné.
          </p>
        </section>
      </div>
    </section>
  );
}
