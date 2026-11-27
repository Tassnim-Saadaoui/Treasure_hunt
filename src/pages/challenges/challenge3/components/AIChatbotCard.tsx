import { Quote } from 'lucide-react';

export interface AIChatbot {
  id: 'alpha' | 'beta' | 'gamma';
  name: string;
  declaration: string;
  avatar: string;
  accent: string;
  glow: string;
}

interface AIChatbotCardProps {
  chatbot: AIChatbot;
}

export function AIChatbotCard({ chatbot }: AIChatbotCardProps) {
  return (
    <article
      className="relative flex min-w-0 flex-col items-center overflow-hidden rounded-[1.45rem] border bg-gradient-to-b from-[#0a1c3e] to-[#07142d] px-1.5 pb-2 pt-2 shadow-lg sm:rounded-[1.8rem] sm:px-3 sm:pb-3 sm:pt-3"
      style={{
        borderColor: `${chatbot.accent}88`,
        boxShadow: `0 0 15px ${chatbot.glow}`,
      }}
      aria-label={`Chatbot ${chatbot.name}`}
    >
      <div
        className="absolute inset-x-3 top-3 aspect-square rounded-full opacity-25 blur-xl"
        style={{ backgroundColor: chatbot.accent }}
        aria-hidden="true"
      />
      <img
        src={chatbot.avatar}
        alt={`Avatar du chatbot ${chatbot.name}`}
        className="relative z-10 aspect-square w-full max-w-[112px] rounded-full object-cover"
      />
      <h3
        className="relative z-10 -mt-2 w-full rounded-lg border bg-[#07142d] py-1 text-center text-xs font-extrabold sm:-mt-3 sm:rounded-xl sm:py-1.5 sm:text-base"
        style={{ color: chatbot.accent, borderColor: `${chatbot.accent}88` }}
      >
        {chatbot.name}
      </h3>
      <blockquote
        className="relative mt-1.5 flex min-h-[72px] w-full items-start gap-1 rounded-xl border bg-[#050f24]/95 px-1.5 py-2 text-[0.64rem] font-medium leading-snug text-slate-100 sm:mt-2 sm:min-h-[90px] sm:gap-2 sm:rounded-2xl sm:px-2.5 sm:py-3 sm:text-sm"
        style={{ borderColor: `${chatbot.accent}88` }}
      >
        <Quote
          className="mt-0.5 h-3.5 w-3.5 shrink-0 rotate-180 sm:h-5 sm:w-5"
          style={{ color: chatbot.accent }}
          fill={chatbot.accent}
          aria-hidden="true"
        />
        <span>{chatbot.declaration}</span>
      </blockquote>
    </article>
  );
}
