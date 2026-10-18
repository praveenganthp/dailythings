import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface UserDelightPopupProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

const SURPRISES = [
  // MOTIVATION
  { emoji: "🔥", title: "Momentum is On Your Side", body: "You’ve started something — and that’s the hardest part.\n\nNow keep moving.\n\nSmall wins stack. And you're stacking them right now.", type: "motivation" },
  { emoji: "⚡", title: "Energy Follows Action", body: "Don't wait for motivation to hit you.\n\nYou create the energy by taking the first step.\n\nKeep moving, {name}.", type: "motivation" },
  { emoji: "🚀", title: "You're Built for This", body: "Everything you've overcome has prepared you for this moment.\n\nDon't hold back.\n\nGive it everything.", type: "motivation" },
  { emoji: "💎", title: "Pressure Makes Diamonds", body: "It's supposed to be hard.\n\nThat's how you know you're growing.\n\nEmbrace the friction, {name}.", type: "motivation" },
  { emoji: "⚔️", title: "Conquer Your Day", body: "You didn't wake up today to be average.\n\nYou woke up to build your future.\n\nGo execute.", type: "motivation" },
  { emoji: "📈", title: "Compounding Greatness", body: "One tiny step today.\n\nAnother tomorrow.\n\nSoon, you'll be unstoppable. Keep stacking wins.", type: "motivation" },
  { emoji: "🔥", title: "Burn the Ships", body: "There is no plan B.\n\nThere is only moving forward.\n\nMake today count.", type: "motivation" },

  // EMOTIONAL SUPPORT
  { emoji: "🌟", title: "You’re Doing Better Than You Think", body: "Hey {name}…\n\nYou don’t always see your progress because you’re living inside it.\n\nBut step back for a second — you’re showing up, trying, and building something meaningful.\n\nThat’s not small. That’s powerful.", type: "emotional" },
  { emoji: "💙", title: "I See You", body: "It's not always easy keeping it all together.\n\nBut you're doing it.\n\nAnd I just want you to know—you're doing a great job.", type: "emotional" },
  { emoji: "🤍", title: "Be Gentle With Yourself", body: "You expect a lot from yourself, {name}.\n\nAnd that's okay.\n\nBut remember to forgive yourself when you stumble.", type: "emotional" },
  { emoji: "🫂", title: "You Are Enough", body: "Not because of what you produce.\n\nNot because of what you accomplish.\n\nJust because you are you.", type: "emotional" },
  { emoji: "✨", title: "Your Effort is Valid", body: "Even the days that feel like a waste are part of the process.\n\nEvery day counts.\n\nYou count.", type: "emotional" },
  { emoji: "🌿", title: "Quiet Strength", body: "You've been battling silently.\n\nAnd you're winning.\n\nI'm proud of you.", type: "emotional" },

  // ACHIEVEMENT
  { emoji: "🏆", title: "Hidden Achievement Unlocked", body: "Consistency Builder 🧠\n\nYou’ve been showing up even when it’s hard.\n\nThat quiet discipline? That’s your real superpower.", type: "achievement" },
  { emoji: "👑", title: "Top 1% Mindset", body: "Most people quit when it gets slightly uncomfortable.\n\nYou kept going.\n\nThat's why you're going to win.", type: "achievement" },
  { emoji: "🎯", title: "Focus Master", body: "You've been locked in lately.\n\nDistractions are bouncing off you.\n\nKeep that elite focus, {name}.", type: "achievement" },
  { emoji: "🏅", title: "Secret Reward Unlocked", body: "Resilience 📈\n\nYou're officially getting stronger every single day.\n\nDon't break the chain.", type: "achievement" },
  { emoji: "💪", title: "Iron Will", body: "Your discipline is becoming unbreakable.\n\nYou are literally rewiring your brain right now.", type: "achievement" },
  { emoji: "🌟", title: "Star Player", body: "If life was a game, you'd be carrying the team right now.\n\nIncredible work.", type: "achievement" },

  // FUTURE SELF
  { emoji: "👀", title: "Message From Your Future Self", body: "Hey {name},\n\nI’m living the life you’re working toward right now.\n\nThank you for not quitting on the hard days.\n\nIt was all worth it.", type: "future" },
  { emoji: "⏳", title: "A Quick Reminder From Ahead", body: "You were worried about so many things that never ended up happening.\n\nTrust the process, {name}.\n\nYou figured it out.", type: "future" },
  { emoji: "🕊️", title: "Peace is Waiting", body: "The chaos you're navigating today? It turns into the calm you enjoy tomorrow.\n\nKeep going.", type: "future" },

  // FUN / LIGHT
  { emoji: "😎", title: "You’re Built Different", body: "Not everyone keeps going when things get tough.\n\nBut you do.\n\nThat’s what separates you.", type: "fun" },
  { emoji: "🦄", title: "Rare Specimen Detected", body: "Scanning... 🔎\n\nResults: 100% Certified Legend.\n\nKeep being awesome, {name}.", type: "fun" },
  { emoji: "🍕", title: "Fuel Up", body: "You're a high-performance machine.\n\nWhich means you require premium pizza.\n\n(Okay, maybe just water for now).", type: "fun" },
  { emoji: "🛸", title: "Abduction Imminent", body: "Aliens are coming to steal your brain because it's too productive.\n\nHide your notes!", type: "fun" },
  { emoji: "💃", title: "Victory Dance", body: "You are legally required to do a 5-second victory dance right now.\n\nI don't make the rules.", type: "fun" },
  { emoji: "🔥", title: "Too Hot to Handle", body: "Careful, you're becoming dangerously competent.\n\nTry not to break the internet today.", type: "fun" }
];

let lastShownIndex = -1;

const UserDelightDialogContent = ({
  onClose,
  userName,
}: {
  onClose: () => void;
  userName: string;
}) => {
  const [content] = useState(() => {
    let nextIdx = Math.floor(Math.random() * SURPRISES.length);
    if (nextIdx === lastShownIndex) {
      nextIdx = (nextIdx + 1) % SURPRISES.length;
    }
    lastShownIndex = nextIdx;
    return SURPRISES[nextIdx];
  });

  const bodyText = content.body.replace(/{name}/g, userName);

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
        className="relative w-full max-w-sm rounded-[24px] overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #1E293B, #0F172A)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 40px rgba(99,102,241,0.15)',
        }}
      >
        {/* Header Glow */}
        <div
          className="px-6 py-5 flex flex-col items-center justify-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
        >
          {/* Breathing Glow */}
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 opacity-80"
            style={{
              background:
                'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 60%)',
            }}
          />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close"
          >
            ✕
          </button>

          <motion.div
            animate={{ y: [0, -8, 0], rotate: [-2, 2, -2] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="text-6xl mb-2 relative z-10 drop-shadow-xl mt-3"
          >
            {content.emoji}
          </motion.div>
        </div>

        {/* Content Body */}
        <div className="px-7 py-8 flex flex-col items-center text-center">
          <motion.h2
            className="text-xl font-bold mb-4 tracking-tight"
            style={{ color: '#F8FAFC' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {content.title}
          </motion.h2>

          <motion.p
            className="text-[#94A3B8] text-[15px] leading-relaxed mb-6 px-2"
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {bodyText}
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export const UserDelightPopup = ({ isOpen, onClose, userName }: UserDelightPopupProps) => {
  return (
    <AnimatePresence>
      {isOpen && <UserDelightDialogContent onClose={onClose} userName={userName} />}
    </AnimatePresence>
  );
};
