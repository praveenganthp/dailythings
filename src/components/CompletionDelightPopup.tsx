import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export interface CompletionDelightPopupProps {
  isOpen: boolean;
  onClose: () => void;
  percent: number;
}

const COMPLETION_STORIES = [
  // LOW (0-20%)
  { emoji: "🌱", title: "A Gentle Start", body: "Hey… every big journey begins with a small step.\n\nYou’ve started — and that’s already powerful.\n\nDon’t rush. Just keep moving forward.", range: "low" },
  { emoji: "🐣", title: "You Showed Up", body: "You opened the app. You took a step.\n\nThat matters more than you think.\n\nLet’s take one more step together. 💙", range: "low" },
  { emoji: "🌅", title: "New Beginnings", body: "Blank canvas. Fresh start.\n\nYou have the whole day ahead of you. No pressure, just progress.", range: "low" },
  { emoji: "☕", title: "Warm Up Mode", body: "Take a sip. Take a breath.\n\nYou're just warming up the engines. Let's do this.", range: "low" },

  // MID (21-50%)
  { emoji: "🚶‍♂️", title: "You're Moving", body: "You’re no longer at zero.\n\nYou’ve started building momentum.\n\nKeep going — it only gets easier from here.", range: "mid" },
  { emoji: "✨", title: "Progress Feels Good", body: "Look at you… making progress.\n\nIt might not feel huge, but it’s real.\n\nAnd real progress compounds.", range: "mid" },
  { emoji: "🐤", title: "Finding Your Stride", body: "You're figuring it out.\n\nOne task down, onto the next. That's the rhythm.", range: "mid" },
  { emoji: "🧭", title: "On The Right Path", body: "You knew what you had to do today, and you're actively doing it.\n\nKeep following your compass.", range: "mid" },

  // HIGH (51-80%)
  { emoji: "🚀", title: "Momentum Activated", body: "Now this is where things get exciting.\n\nYou’ve built momentum — and momentum changes everything.\n\nRide it. 🔥", range: "high" },
  { emoji: "💪", title: "You're Locked In", body: "This is discipline in action.\n\nYou didn’t just start — you continued.\n\nThat’s rare. That’s powerful.", range: "high" },
  { emoji: "🐦", title: "Taking Flight", body: "Look at you go!\n\nYou're cruising now. Don't slow down the engines.", range: "high" },
  { emoji: "🔥", title: "On Fire", body: "You are officially in the zone.\n\nWhatever you're doing right now, don't stop.", range: "high" },

  // ALMOST (81-99%)
  { emoji: "⚡", title: "Almost There", body: "You’re so close.\n\nThis is where most people slow down.\n\nYou? Push a little more. Finish strong.", range: "almost" },
  { emoji: "🌟", title: "Finish Line Energy", body: "You can see the finish line.\n\nNow go claim it.\n\nThis moment matters.", range: "almost" },
  { emoji: "🏃", title: "The Final Stretch", body: "One last push.\n\nYou've done 90% of the work. Now bring it home.", range: "almost" },

  // COMPLETE (100%)
  { emoji: "🎉", title: "You Did It!", body: "100% complete.\n\nTake a second and feel that.\n\nYou showed up. You finished. You delivered.\n\nThat’s who you are. 🏆", range: "complete" },
  { emoji: "🏆", title: "Champion Day", body: "Not everyone finishes what they start.\n\nBut you did.\n\nThat’s what separates you.", range: "complete" },
  { emoji: "🦅", title: "Absolute Legend", body: "You cleared the board.\n\nNothing left but to enjoy the victory. Incredible work today.", range: "complete" },
  { emoji: "💎", title: "Flawless Execution", body: "You set out to do something, and you did exactly that.\n\nA perfect 100%.", range: "complete" }
];

const THEME_MAP = {
  low: { grad: 'linear-gradient(135deg, #334155, #1E293B)', ringGrad: ['#334155', '#1E293B'] },
  mid: { grad: 'linear-gradient(135deg, #6366F1, #8B5CF6)', ringGrad: ['#6366F1', '#8B5CF6'] },
  high: { grad: 'linear-gradient(135deg, #22C55E, #4ADE80)', ringGrad: ['#22C55E', '#4ADE80'] },
  almost: { grad: 'linear-gradient(135deg, #F59E0B, #FBBF24)', ringGrad: ['#F59E0B', '#FBBF24'] },
  complete: { grad: 'linear-gradient(135deg, #FACC15, #FB923C)', ringGrad: ['#FACC15', '#FB923C'] }
};

let lastShownIndex = -1;

export const CompletionDelightPopup = ({ isOpen, onClose, percent }: CompletionDelightPopupProps) => {
  const [content, setContent] = useState(COMPLETION_STORIES[0]);
  const [rangeKey, setRangeKey] = useState<'low'|'mid'|'high'|'almost'|'complete'>('low');

  useEffect(() => {
    if (isOpen) {
      let r: 'low'|'mid'|'high'|'almost'|'complete' = 'low';
      if (percent <= 20) r = 'low';
      else if (percent <= 50) r = 'mid';
      else if (percent <= 80) r = 'high';
      else if (percent < 100) r = 'almost';
      else r = 'complete';

      setRangeKey(r);

      const possible = COMPLETION_STORIES.map((s, i) => ({ ...s, origIndex: i })).filter(s => s.range === r);
      let picked = possible[Math.floor(Math.random() * possible.length)];
      
      // Try to avoid repeat if possible
      if (picked.origIndex === lastShownIndex && possible.length > 1) {
        picked = possible.find(s => s.origIndex !== lastShownIndex) || picked;
      }
      
      lastShownIndex = picked.origIndex;
      setContent(picked);

      if (r === 'complete') {
        const duration = 2000;
        const end = Date.now() + duration;

        const frame = () => {
          confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#FACC15', '#FB923C', '#22C55E']
          });
          confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#FACC15', '#FB923C', '#6366F1']
          });

          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        };
        frame();
      }
    }
  }, [isOpen, percent]);

  const themeConfig = THEME_MAP[rangeKey];
  const R = 46;
  const circumference = 2 * Math.PI * R;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <AnimatePresence>
      {isOpen && (
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
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                title="Close"
              >
                ✕
              </button>

              {/* Central Progress Ring */}
              <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
                {/* SVG Ring Background */}
                <svg width="120" height="120" className="absolute" style={{ transform: 'rotate(-90deg)' }}>
                  <circle
                    cx="60" cy="60" r={R}
                    strokeWidth="8" fill="transparent"
                    stroke="rgba(255,255,255,0.15)"
                  />
                  {/* Foreground Animated Ring */}
                  {/* Instead of pure svg stroke, using a white glowing line for high contrast */}
                  <motion.circle
                    cx="60" cy="60" r={R}
                    strokeWidth="8" fill="transparent"
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

              {/* Bounding percentage below ring temporarily for dramatic effect */}
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
                style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)' }}
              />
            </div>

            {/* Content Body */}
            <div className="px-7 py-8 flex flex-col items-center text-center">
              <h2 className="text-xl font-bold mb-3 tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {content.title}
              </h2>

              <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>
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
      )}
    </AnimatePresence>
  );
};
