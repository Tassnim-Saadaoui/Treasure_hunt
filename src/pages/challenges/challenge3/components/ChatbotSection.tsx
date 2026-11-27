import { AIChatbotCard, type AIChatbot } from './AIChatbotCard';

const CHATBOTS: AIChatbot[] = [
  {
    id: 'alpha',
    name: 'Alpha',
    declaration: 'Le virus est chez Gamma.',
    avatar: '/chatbots/alpha.svg',
    accent: '#13D8FF',
    glow: 'rgba(0, 199, 255, .18)',
  },
  {
    id: 'beta',
    name: 'Bêta',
    declaration: 'Le virus n’est pas chez moi.',
    avatar: '/chatbots/beta.svg',
    accent: '#FF3657',
    glow: 'rgba(255, 40, 75, .2)',
  },
  {
    id: 'gamma',
    name: 'Gamma',
    declaration: 'Alpha dit la vérité.',
    avatar: '/chatbots/gamma.svg',
    accent: '#B68AFF',
    glow: 'rgba(169, 119, 255, .2)',
  },
];

export function ChatbotSection() {
  return (
    <section aria-label="Déclarations des trois serveurs" className="grid grid-cols-3 gap-2.5 sm:gap-5">
      {CHATBOTS.map((chatbot) => (
        <AIChatbotCard key={chatbot.id} chatbot={chatbot} />
      ))}
    </section>
  );
}
