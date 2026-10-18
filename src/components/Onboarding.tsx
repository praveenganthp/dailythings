import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTaskStore } from '../store/useTaskStore';
import { Layout } from './Layout';

export const Onboarding = () => {
  const updateSettings = useTaskStore(state => state.updateSettings);
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) updateSettings({ name: name.trim(), isOnboarded: true });
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid rgba(148,163,184,0.12)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 60px rgba(99,102,241,0.12)',
          }}
        >
          {/* Top gradient banner */}
          <div
            className="h-1.5 w-full"
            style={{ background: 'linear-gradient(90deg, #6366F1, #8B5CF6, #C084FC)' }}
          />

          {/* Subtle ambient inside glow */}
          <div
            className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', transform: 'translate(40%, -40%)' }}
          />

          <div className="p-10 text-center relative z-10">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="text-6xl mb-6"
            >
              👋
            </motion.div>

            <h1
              className="text-3xl font-bold mb-2 tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Welcome to{' '}
              <span className="text-gradient">DailyThings</span>
            </h1>

            <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
              Your premium daily habit & task flow. Let's make today count — what should we call you?
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your name..."
                maxLength={24}
                autoFocus
                className="input-premium w-full text-center text-lg"
                style={{ color: 'var(--text-primary)' }}
              />

              <button
                type="submit"
                disabled={!name.trim()}
                className="btn-primary py-4 text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Get Started 🚀
              </button>
            </form>

            <p className="text-xs mt-6" style={{ color: 'var(--text-disabled)' }}>
              Your data stays private on this device.
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};
