import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationStore } from '../store/useNotificationStore';
import type { RewardData } from '../store/useNotificationStore';
import { X } from 'lucide-react';
import type { Variants } from 'framer-motion';

/* ── Color Moods (spec-compliant) ── */
const MOODS = {
  achievement: {
    gradient: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
    glow: 'rgba(99,102,241,0.4)',
  },
  momentum: {
    gradient: 'linear-gradient(135deg, #22C55E, #4ADE80)',
    glow: 'rgba(34,197,94,0.4)',
  },
  motivation: {
    gradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
    glow: 'rgba(245,158,11,0.4)',
  },
  power: {
    gradient: 'linear-gradient(135deg, #EF4444, #F87171)',
    glow: 'rgba(239,68,68,0.35)',
  },
  growth: {
    gradient: 'linear-gradient(135deg, #38BDF8, #60A5FA)',
    glow: 'rgba(56,189,248,0.4)',
  },
};

type MoodKey = keyof typeof MOODS;

const styleMap: Record<string, MoodKey> = {
  fire:        'power',
  calm:        'growth',
  growth:      'momentum',
  celebration: 'achievement',
  success:     'motivation',
};

const variants: Variants = {
  initial: { opacity: 0, x: 40, scale: 0.9 },
  animate: { opacity: 1, x: 0, scale: 1, transition: { type: 'spring', damping: 20, stiffness: 280 } },
  exit:    { opacity: 0, x: 40, scale: 0.9, transition: { duration: 0.2 } },
};

const RewardItem = ({ reward, onRemove }: { reward: RewardData; onRemove: (id: string) => void }) => {
  const moodKey = styleMap[reward.style] ?? 'achievement';
  const mood = MOODS[moodKey];

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative flex items-center gap-3 mb-3 rounded-2xl overflow-hidden"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid rgba(148,163,184,0.15)',
        boxShadow: `0 12px 36px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04), 0 0 24px ${mood.glow}`,
        backdropFilter: 'blur(16px)',
        width: 320,
        maxWidth: '90vw',
      }}
    >
      {/* Left gradient accent bar */}
      <div
        className="absolute left-0 inset-y-0 w-1 rounded-l-2xl"
        style={{ background: mood.gradient }}
      />

      {/* Emoji */}
      <div
        className="flex-shrink-0 text-2xl ml-5"
        style={{ filter: `drop-shadow(0 0 8px ${mood.glow})` }}
      >
        <motion.span
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ display: 'inline-block' }}
        >
          {reward.emoji}
        </motion.span>
      </div>

      {/* Message */}
      <div className="flex-1 py-4 pr-2">
        <p className="text-sm font-semibold leading-snug" style={{ color: 'var(--text-primary)' }}>
          {reward.message}
        </p>
      </div>

      {/* Gradient shimmer at top */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: mood.gradient, opacity: 0.6 }}
      />

      <button
        onClick={() => onRemove(reward.id)}
        aria-label="Dismiss"
        className="p-2 mr-2 my-2 rounded-lg transition-colors"
        style={{ color: 'var(--text-muted)' }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
      >
        <X size={15} />
      </button>
    </motion.div>
  );
};

export const RewardPopup = () => {
  const rewards      = useNotificationStore(state => state.rewards);
  const removeReward = useNotificationStore(state => state.removeReward);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      <div className="pointer-events-auto">
        <AnimatePresence>
          {rewards.map(reward => (
            <RewardItem key={reward.id} reward={reward} onRemove={removeReward} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
