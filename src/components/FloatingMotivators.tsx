import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const motivators = [
  { id: 1, text: "You got this! ✨" },
  { id: 2, text: "Stay focused 🚀" },
  { id: 3, text: "One step at a time 🌱" },
  { id: 4, text: "Keep pushing! 💪" },
  { id: 5, text: "Great job! 🎉" },
  { id: 6, text: "Almost there 🏆" },
];

function randomPos() {
  return {
    top: `${Math.floor(Math.random() * 75) + 5}%`,
    left: `${Math.floor(Math.random() * 80) + 5}%`,
  };
}

export const FloatingMotivators = () => {
  const [positions, setPositions] = useState(motivators.map(randomPos));

  useEffect(() => {
    const t = setInterval(() => {
      setPositions(motivators.map(randomPos));
    }, 18000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {motivators.map((el, i) => (
        <motion.div
          key={el.id}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 0.08,
            top: positions[i].top,
            left: positions[i].left,
            y: [0, -18, 0],
          }}
          transition={{
            duration: 18,
            y: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 },
          }}
          className="absolute text-base font-semibold whitespace-nowrap"
          style={{ color: 'var(--text-muted)', filter: 'blur(0.5px)' }}
        >
          {el.text}
        </motion.div>
      ))}
    </div>
  );
};
