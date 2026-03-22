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
      className="min-h-screen relative overflow-hidden flex flex-col"
      style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}
    >
      {/* Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Top-left brand glow */}
        <div
          className="absolute -top-64 -left-64 w-[600px] h-[600px] rounded-full opacity-[0.08]"
          style={{ background: 'radial-gradient(circle, #6366F1 0%, transparent 70%)' }}
        />
        {/* Bottom-right accent glow */}
        <div
          className="absolute -bottom-48 -right-48 w-[500px] h-[500px] rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)' }}
        />
        {/* Center subtle glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(ellipse, #6366F1 0%, transparent 70%)' }}
        />
      </div>

      <FloatingMotivators />

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 min-h-screen flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1"
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
