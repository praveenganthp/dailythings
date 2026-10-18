import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export interface CompletionDelightPopupProps {
  isOpen: boolean;
  onClose: () => void;
  percent: number;
}

const THEME_MAP = {
  low: {
    grad: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
    barGrad: 'linear-gradient(90deg, #6366F1, #818CF8)',
  },
  mid: {
    grad: 'linear-gradient(135deg, #064E3B 0%, #065F46 100%)',
    barGrad: 'linear-gradient(90deg, #10B981, #34D399)',
  },
  high: {
    grad: 'linear-gradient(135deg, #701A75 0%, #86198F 100%)',
    barGrad: 'linear-gradient(90deg, #D946EF, #E879F9)',
  },
  almost: {
    grad: 'linear-gradient(135deg, #7C2D12 0%, #9A3412 100%)',
    barGrad: 'linear-gradient(90deg, #F97316, #FB923C)',
  },
  complete: {
    grad: 'linear-gradient(135deg, #78350F 0%, #B45309 100%)',
    barGrad: 'linear-gradient(90deg, #F59E0B, #FBBF24)',
  },
};

const COMPLETION_STORIES = [
  // 0% - 20%
  { range: 'low', emoji: '🌱', title: 'The Spark', body: 'The tallest trees began as a single seed beneath cold soil.\n\nYou started. That tiny step changes the trajectory of your entire day.' },
  { range: 'low', emoji: '👣', title: 'First Footprint', body: 'A mountain cannot stop someone who refuses to look up at its height, but instead watches their very next step.\n\nYou’re moving.' },
  { range: 'low', emoji: '💧', title: 'The Drop', body: 'Water hollows out stone not through power, but through consistency.\n\nEvery checkmark is a drop wearing away the impossible.' },

  // 21% - 50%
  { range: 'mid', emoji: '🚀', title: 'Escape Velocity', body: 'Getting off the launchpad takes the most fuel.\n\nYou’ve broken gravity. You’re building the inertia that makes greatness feel effortless.' },
  { range: 'mid', emoji: '⚙️', title: 'The Flywheel', body: 'Heavy gears turn painfully slow at first.\n\nKeep pushing. Soon, the wheel turns you.' },
  { range: 'mid', emoji: '🔥', title: 'Catching Fire', body: 'A spark is just heat. Momentum is fire.\n\nYou’ve turned a quiet decision into visible progress.' },

  // 51% - 80%
  { range: 'high', emoji: '⚡', title: 'The Tipping Point', body: 'Most people stop right here when the finish line is still invisible.\n\nChampions thrive in the quiet space between halfway and done. Stay ferocious.' },
  { range: 'high', emoji: '🧗‍♂️', title: 'Above the Clouds', body: 'The air is thin, but the view is opening up.\n\nYou are outworking who you were yesterday.' },
  { range: 'high', emoji: '🏹', title: 'The Released Arrow', body: 'You’ve pulled the bow back. Now let discipline carry you through.' },

  // 81% - 99%
  { range: 'almost', emoji: '👑', title: 'The Final Strike', body: 'The last 10% is where pride is born.\n\nDo not ease off the throttle. Finish with absolute conviction.' },
  { range: 'almost', emoji: '🐅', title: 'Closing In', body: 'Sight is locked. There is no hesitation now.\n\nLeave nothing on the table.' },

  // 100%
  { range: 'complete', emoji: '🏆', title: 'Day Conquered', body: 'You kept every promise you made to yourself today.\n\nThat quiet pride in your chest? That is self-respect, earned in full.' },
  { range: 'complete', emoji: '🌟', title: 'A Masterclass in Execution', body: 'You didn’t just finish your tasks—you proved what is possible when focus meets dedication.\n\nRest proudly tonight.' },
  { range: 'complete', emoji: '⚡', title: 'Unshakable Standard', body: 'Today was an undeniable win.\n\nTake this momentum, bottle it, and remember this feeling.' },
];

const getRangeKey = (percent: number): 'low' | 'mid' | 'high' | 'almost' | 'complete' => {
  if (percent <= 20) return 'low';
  if (percent <= 50) return 'mid';
  if (percent <= 80) return 'high';
  if (percent < 100) return 'almost';
  return 'complete';
};

const CompletionDialogContent = ({
  percent,
  onClose,
}: {
  percent: number;
  onClose: () => void;
}) => {
  const rangeKey = getRangeKey(percent);

  const [content] = useState(() => {
    const possible = COMPLETION_STORIES.filter((s) => s.range === rangeKey);
    return possible[Math.floor(Math.random() * possible.length)] || COMPLETION_STORIES[0];
  });

  useEffect(() => {
    if (rangeKey === 'complete') {
      const duration = 2000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#FACC15', '#FB923C', '#22C55E'],
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#FACC15', '#FB923C', '#6366F1'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [rangeKey]);

  const themeConfig = THEME_MAP[rangeKey];
  const R = 46;
  const circumference = 2 * Math.PI * R;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0"
        style={{
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300, duration: 0.3 }}
        className="relative w-full max-w-sm overflow-hidden"
        style={{
          background: 'var(--bg-card)',
          borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
        }}
      >
        {/* Dynamic Header Gradient Area */}
        <div
          className="w-full flex flex-col items-center justify-center relative overflow-hidden"
          style={{ background: themeConfig.grad, padding: '40px 20px' }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close"
          >
            ✕
          </button>

          {/* Central Progress Ring */}
          <div
            className="relative flex items-center justify-center"
            style={{ width: 120, height: 120 }}
          >
            <svg
              width="120"
              height="120"
              className="absolute"
              style={{ transform: 'rotate(-90deg)' }}
            >
              <circle
                cx="60"
                cy="60"
                r={R}
                strokeWidth="8"
                fill="transparent"
                stroke="rgba(255,255,255,0.15)"
              />
              <motion.circle
                cx="60"
                cy="60"
                r={R}
                strokeWidth="8"
                fill="transparent"
                stroke="rgba(255,255,255,0.95)"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.4, ease: 'easeOut' }}
                style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))' }}
              />
            </svg>

            {/* Bouncing Emoji inside ring */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="text-4xl absolute z-10 drop-shadow-lg"
            >
              {content.emoji}
            </motion.div>
          </div>

          {/* Percentage */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-3 font-bold text-3xl tabular-nums drop-shadow-md text-white tracking-tight"
          >
            {percent}%
          </motion.div>

          {/* Ambient Glow */}
          <motion.div
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)',
            }}
          />
        </div>

        {/* Content Body */}
        <div className="px-7 py-8 flex flex-col items-center text-center">
          <h2
            className="text-xl font-bold mb-3 tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            {content.title}
          </h2>

          <p
            className="text-sm font-medium leading-relaxed whitespace-pre-wrap"
            style={{ color: 'var(--text-secondary)' }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.8 }}
            >
              {content.body}
            </motion.span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export const CompletionDelightPopup = ({
  isOpen,
  onClose,
  percent,
}: CompletionDelightPopupProps) => {
  return (
    <AnimatePresence>
      {isOpen && <CompletionDialogContent percent={percent} onClose={onClose} />}
    </AnimatePresence>
  );
};
