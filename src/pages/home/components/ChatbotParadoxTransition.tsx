import { AnimatePresence, motion } from 'motion/react';
import { ScanEye, Sparkles } from 'lucide-react';

interface ChatbotParadoxTransitionProps {
  isActive: boolean;
}

const SERVERS = [
  {
    name: 'ALPHA',
    avatar: '/chatbots/alpha.svg',
    accent: '#13D8FF',
    startX: -190,
    startRotate: -12,
    endX: -74,
  },
  {
    name: 'BÊTA',
    avatar: '/chatbots/beta.svg',
    accent: '#FF3657',
    startX: 0,
    startRotate: 0,
    endX: 0,
  },
  {
    name: 'GAMMA',
    avatar: '/chatbots/gamma.svg',
    accent: '#B68AFF',
    startX: 190,
    startRotate: 12,
    endX: 74,
  },
] as const;

export function ChatbotParadoxTransition({ isActive }: ChatbotParadoxTransitionProps) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-[110] flex flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_48%,#102b58_0%,#071735_48%,#030b1c_100%)] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="status"
          aria-live="polite"
          aria-label="Les trois serveurs s’affrontent pour révéler la vérité"
        >
          <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-rose-500/15 blur-3xl" />

          <div className="relative flex h-48 w-full max-w-[500px] items-center justify-center sm:h-60">
            <motion.div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/60"
              initial={{ scale: 0.1, opacity: 0 }}
              animate={{ scale: [0.1, 1.8, 2.8], opacity: [0, 0.8, 0] }}
              transition={{ duration: 1.1, delay: 0.9, ease: 'easeOut' }}
            />
            <motion.div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 blur-xl"
              animate={{ scale: [0.5, 1.7, 0.7], opacity: [0.3, 0.9, 0.3] }}
              transition={{ duration: 0.7, delay: 0.9, repeat: 2, ease: 'easeInOut' }}
            />

            {SERVERS.map((server, index) => (
              <motion.div
                key={server.name}
                className="absolute top-1/2 flex -translate-y-1/2 flex-col items-center"
                initial={{ x: server.startX, y: 30, rotate: server.startRotate, scale: 0.7, opacity: 0 }}
                animate={{
                  x: [server.startX, server.endX, server.endX + (index === 1 ? 0 : index === 0 ? 10 : -10), server.endX],
                  y: [30, -8, 5, 0],
                  rotate: [server.startRotate, 0, index === 0 ? -5 : index === 2 ? 5 : 2, 0],
                  scale: [0.7, 1.08, 0.94, 1],
                  opacity: 1,
                }}
                transition={{
                  duration: 2.1,
                  delay: index * 0.12,
                  times: [0, 0.55, 0.72, 1],
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ zIndex: index === 1 ? 2 : 1 }}
              >
                <motion.div
                  className="relative h-24 w-24 overflow-hidden rounded-full border-2 bg-[#06132d] sm:h-32 sm:w-32"
                  style={{
                    borderColor: server.accent,
                    boxShadow: `0 0 24px ${server.accent}88, inset 0 0 20px ${server.accent}22`,
                  }}
                  animate={{
                    boxShadow: [
                      `0 0 12px ${server.accent}66`,
                      `0 0 34px ${server.accent}`,
                      `0 0 18px ${server.accent}88`,
                    ],
                  }}
                  transition={{ duration: 0.8, delay: 0.5 + index * 0.12, repeat: 1 }}
                >
                  <img src={server.avatar} alt="" className="h-full w-full object-cover" />
                </motion.div>
                <span
                  className="mt-2 rounded-full border px-3 py-1 text-[0.65rem] font-extrabold tracking-[0.18em] sm:text-xs"
                  style={{
                    color: server.accent,
                    borderColor: `${server.accent}99`,
                    backgroundColor: '#07142ddd',
                    boxShadow: `0 0 12px ${server.accent}44`,
                  }}
                >
                  {server.name}
                </span>
              </motion.div>
            ))}

            <motion.div
              className="absolute left-1/2 top-1/2 z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-[#07142d] text-white shadow-[0_0_24px_rgba(255,255,255,.55)]"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: [0, 1.25, 0.9, 1], rotate: 0 }}
              transition={{ duration: 0.65, delay: 0.9, ease: 'backOut' }}
            >
              <ScanEye className="h-5 w-5" aria-hidden="true" />
            </motion.div>
          </div>

          <motion.div
            className="mt-5 flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.55 }}
          >
            <Sparkles className="mb-2 h-6 w-6 text-cyan-200" aria-hidden="true" />
            <p className="text-sm font-extrabold tracking-wide text-white sm:text-base">
              Les serveurs s’affrontent…
            </p>
            <p className="mt-1 text-xs text-slate-300">
              Qui dit la vérité ? À vous de le découvrir.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
