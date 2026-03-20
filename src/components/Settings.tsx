import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore } from '../store/useTaskStore';
import { X, Trash2, Settings as SettingsIcon } from 'lucide-react';

export const Settings = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const settings       = useTaskStore(state => state.settings);
  const updateSettings = useTaskStore(state => state.updateSettings);

  const handleWipeData = () => {
    if (confirm('This will erase ALL tasks and settings. Cannot be undone.')) {
      localStorage.removeItem('daily-premium-tasks-storage');
      window.location.reload();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            style={{ background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(8px)' }}
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full max-w-md rounded-2xl overflow-hidden"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid rgba(148,163,184,0.12)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
            }}
          >
            {/* Header */}
            <div
              className="px-6 py-5 flex justify-between items-center"
              style={{
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                boxShadow: '0 8px 24px rgba(99,102,241,0.3)',
              }}
            >
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <SettingsIcon size={18} /> Settings
              </h2>
              <button
                onClick={onClose}
                aria-label="Close"
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={18} color="rgba(255,255,255,0.8)" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-5">
              {/* Name */}
              <div className="space-y-1.5">
                <label
                  htmlFor="settings-name"
                  className="text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Your Name
                </label>
                <input
                  id="settings-name"
                  type="text"
                  title="Name"
                  value={settings.name}
                  onChange={e => updateSettings({ name: e.target.value })}
                  className="input-premium w-full"
                  style={{ color: 'var(--text-primary)' }}
                />
              </div>

              {/* Theme */}
              <div className="space-y-1.5">
                <label
                  htmlFor="settings-theme"
                  className="text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Theme
                </label>
                <select
                  id="settings-theme"
                  title="Theme"
                  value={settings.theme}
                  onChange={e => updateSettings({ theme: e.target.value as 'dark' | 'light' | 'system' })}
                  className="input-premium w-full appearance-none"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <option value="system">System Default</option>
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>

              {/* Danger zone */}
              <div
                className="pt-4 border-t space-y-2"
                style={{ borderColor: 'var(--border-default)' }}
              >
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-disabled)' }}>
                  Danger Zone
                </p>
                <button
                  onClick={handleWipeData}
                  className="w-full py-3 rounded-xl text-sm font-semibold flex justify-center items-center gap-2 transition-all"
                  style={{
                    background: 'rgba(239,68,68,0.08)',
                    color: 'var(--danger)',
                    border: '1px solid rgba(239,68,68,0.2)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.15)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
                >
                  <Trash2 size={15} /> Erase All Data
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
