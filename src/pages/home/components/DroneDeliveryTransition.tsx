import { AnimatePresence, motion } from 'motion/react';
import { HeartPulse } from 'lucide-react';

interface DroneDeliveryTransitionProps {
  isActive: boolean;
}

export function DroneDeliveryTransition({ isActive }: DroneDeliveryTransitionProps) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_80%,#164b79_0%,#071a3a_50%,#030b1c_100%)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24 }}
          role="status"
          aria-live="polite"
          aria-label="Le drone médical transporte le colis vers le challenge 2"
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#123c5d]/60 to-transparent" />
          <motion.div
            aria-hidden="true"
            className="absolute left-[12%] top-[23%] h-16 w-52 rounded-full bg-slate-300/10 blur-2xl"
            animate={{ x: ['-12vw', '18vw', '-12vw'] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute right-[8%] top-[38%] h-20 w-64 rounded-full bg-cyan-200/10 blur-2xl"
            animate={{ x: ['12vw', '-18vw', '12vw'] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            {Array.from({ length: 28 }, (_, index) => (
              <span
                key={index}
                className="transition-rain-drop absolute rounded-full"
                style={{
                  left: `${(index * 37) % 100}%`,
                  top: `${(index * 23) % 100}%`,
                  height: `${3 + (index % 3)}px`,
                  animationDelay: `${-(index % 7) * 0.16}s`,
                  animationDuration: `${0.65 + (index % 4) * 0.12}s`,
                }}
              />
            ))}
          </div>

          <div className="relative h-40 w-full">
            <div className="drone-delivery-flight absolute left-0 top-1/2 h-36 w-56 drop-shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
              <svg viewBox="0 0 220 145" className="h-full w-full" aria-hidden="true">
                <g stroke="#c7e9f4" strokeWidth="5" strokeLinecap="round" fill="none">
                  <path d="M110 57L54 35M110 57l56-22M110 57l-56 22M110 57l56 22" />
                </g>
                <g fill="#071b33" stroke="#78c9e6" strokeWidth="3">
                  <ellipse cx="48" cy="31" rx="31" ry="7" />
                  <ellipse cx="172" cy="31" rx="31" ry="7" />
                  <ellipse cx="48" cy="83" rx="31" ry="7" />
                  <ellipse cx="172" cy="83" rx="31" ry="7" />
                </g>
                <g stroke="#d9f5ff" strokeWidth="2" opacity=".8">
                  <path d="M25 31h46M149 31h46M25 83h46M149 83h46" />
                </g>
                <path d="M84 49Q110 34 136 49L129 68Q110 79 91 68Z" fill="#13a8dc" stroke="#d8f4ff" strokeWidth="3" />
                <circle cx="101" cy="54" r="3" fill="#f3fbff" />
                <circle cx="119" cy="54" r="3" fill="#f3fbff" />
                <path d="M96 70v12M124 70v12M87 82h46" stroke="#d8f4ff" strokeWidth="4" strokeLinecap="round" />
                <path d="M110 81v16" stroke="#d8f4ff" strokeWidth="2" strokeDasharray="3 3" />
                <g>
                  <path d="M90 96l20-8 22 8-2 28-20 8-20-8Z" fill="#b9854d" stroke="#f1d0a1" strokeWidth="2" />
                  <path d="M90 96l20 8 22-8M110 104v28" fill="none" stroke="#f4d8b1" strokeWidth="2" />
                  <path d="M104 89l6-3 6 3-6 3Z" fill="#d62645" />
                </g>
                <circle cx="110" cy="57" r="4" fill="#fb4057">
                  <animate attributeName="opacity" values=".4;1;.4" dur=".7s" repeatCount="indefinite" />
                </circle>
              </svg>
            </div>
          </div>

          <div className="absolute bottom-[18%] flex flex-col items-center px-6 text-center">
            <HeartPulse className="mb-2 h-7 w-7 text-rose-400" aria-hidden="true" />
            <p className="text-sm font-bold tracking-wide text-white sm:text-base">Livraison médicale en route</p>
            <p className="mt-1 text-xs text-cyan-100/70">Préparation du diagnostic suivant…</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
