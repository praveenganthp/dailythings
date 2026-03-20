import { create } from 'zustand';

export type RewardStyle = 'success' | 'celebration' | 'calm' | 'growth' | 'fire';
export type AnimationType = 'bounce' | 'fade-up' | 'slide-in' | 'scale' | 'confetti';

export interface RewardData {
  id: string;
  message: string;
  emoji: string;
  style: RewardStyle;
  animation: AnimationType;
}

interface NotificationState {
  rewards: RewardData[];
  showReward: (priority?: string, category?: string) => void;
  removeReward: (id: string) => void;
}

const ALL_EMOJIS = ['✅', '🎉', '🚀', '💪', '🌟', '🔥', '📚', '🏆', '😎', '🙌', '✨', '🎯', '⚡'];
const QUOTES = [
  "Awesome work! 🚀 One more step toward your goals.",
  "You did it! 🌟 Progress is built one task at a time.",
  "Strong move 💪 Small wins create big success.",
  "Task crushed 🔥 Keep your momentum alive.",
  "Brilliant! 🏆 You're showing real consistency.",
  "Done and dusted 😎 Keep the energy going.",
  "Great focus 📚 Learning and growth never fail.",
  "Nice job 🙌 Your discipline is paying off.",
  "Unstoppable! ⚡ Keep slicing through the list.",
  "Epic win! 🎯 Aim high and keep hitting targets.",
  "That's how it's done! ✨",
  "Phenomenal effort! 🎉 Have a moment to smile.",
  "Another one down! 🚀 You're on fire today.",
  "Execution is everything! 💪 Fantastic job."
];

const HEALTH_QUOTES = ["Health is wealth! 🌱", "Self-care win! 🧘‍♀️", "Taking care of you! 💧"];
const LEARNING_QUOTES = ["Brain gains! 🧠", "Knowledge is power! 📚", "Leveling up your mind! 🎓"];
const WORK_QUOTES = ["Professional momentum! 💼", "Crushing the grind! 🚀", "Taking care of business! 📈"];
const HIGH_PRIORITY_QUOTES = ["Big obstacle cleared! 🏆", "Massive impact! 🔥", "You crushed the top priority! ⚡"];

const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const useNotificationStore = create<NotificationState>((set) => ({
  rewards: [],
  
  showReward: (priority, category) => {
    let quotePool = QUOTES;
    let preferredStyle: RewardStyle = 'success';
    let preferredEmojiPool = ALL_EMOJIS;

    if (priority === 'high') {
      quotePool = [...quotePool, ...HIGH_PRIORITY_QUOTES];
      preferredStyle = 'fire';
      preferredEmojiPool = ['🔥', '⚡', '🏆'];
    }

    if (category === 'health') {
      quotePool = [...quotePool, ...HEALTH_QUOTES];
      preferredStyle = 'calm';
      preferredEmojiPool = ['🌱', '🧘‍♀️', '💧', '✨'];
    } else if (category === 'learning') {
      quotePool = [...quotePool, ...LEARNING_QUOTES];
      preferredStyle = 'growth';
      preferredEmojiPool = ['🧠', '📚', '🎓', '💡'];
    } else if (category === 'work') {
      quotePool = [...quotePool, ...WORK_QUOTES];
      preferredStyle = 'celebration';
      preferredEmojiPool = ['💼', '🚀', '📈'];
    }

    const newReward: RewardData = {
      id: crypto.randomUUID(),
      message: getRandom(quotePool),
      emoji: getRandom(preferredEmojiPool),
      style: preferredStyle,
      animation: getRandom(['bounce', 'fade-up', 'slide-in', 'scale', 'confetti'])
    };

    set((state) => ({ rewards: [...state.rewards, newReward] }));

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      set((state) => ({
        rewards: state.rewards.filter(r => r.id !== newReward.id)
      }));
    }, 4000);
  },

  removeReward: (id) => {
    set((state) => ({ rewards: state.rewards.filter(r => r.id !== id) }));
  }
}));
