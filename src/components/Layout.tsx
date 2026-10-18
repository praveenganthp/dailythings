import React from 'react';
import { motion } from 'framer-motion';
import { FloatingMotivators } from './FloatingMotivators';
import { AppFooter } from './AppFooter';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div
      className="min-h-screen relative overflow-x-hidden flex flex-col bg-grid-subtle transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}
    >
      {/* Ambient Atmospheric Lighting */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Top-left primary brand glow */}
        <div
          className="absolute -top-48 -left-48 w-[640px] h-[640px] rounded-full blur-[120px] opacity-25"
          style={{ background: 'radial-gradient(circle, #6366F1 0%, rgba(99,102,241,0) 70%)' }}
        />
        {/* Top-right violet aura */}
        <div
          className="absolute -top-32 right-0 w-[500px] h-[500px] rounded-full blur-[130px] opacity-20"
          style={{ background: 'radial-gradient(circle, #8B5CF6 0%, rgba(139,92,246,0) 70%)' }}
        />
        {/* Bottom-right cyan whisper */}
        <div
          className="absolute -bottom-48 -right-36 w-[560px] h-[560px] rounded-full blur-[140px] opacity-15"
          style={{ background: 'radial-gradient(circle, #06B6D4 0%, rgba(6,182,212,0) 70%)' }}
        />
        {/* Center subtle glow */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[720px] h-[360px] rounded-full blur-[150px] opacity-10"
          style={{ background: 'radial-gradient(ellipse, #4F46E5 0%, rgba(79,70,229,0) 70%)' }}
        />
      </div>

      <FloatingMotivators />

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 min-h-screen flex flex-col w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 flex flex-col"
        >
          {children}
        </motion.div>
      </main>

      <div className="relative z-20 mt-auto">
        <AppFooter />
      </div>
    </div>
  );
};
