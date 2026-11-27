import type { ChatbotAnswer } from './AnswerSection';

const CORRECT_ANSWER: ChatbotAnswer = 'alpha';

export function isCorrectServerAnswer(answer: ChatbotAnswer | null): boolean {
  return answer === CORRECT_ANSWER;
}
