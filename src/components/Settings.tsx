import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore } from '../store/useTaskStore';
import { usePWA } from '../hooks/usePWA';
import {
  X,
  Trash2,
  Settings as SettingsIcon,
  Volume2,
  ArrowRightLeft,
  Sun,
  Moon,
  Laptop,
  Play,
  User,
  Download,
  Upload,
  HardDrive,
  Smartphone,
  Check,
} from 'lucide-react';
import {
  playTaskCompleteSound,
  playSubtaskCheckSound,
  playStreakCelebrationSound,
} from '../utils/sound';
import { exportDataAsJSON, parseBackupFile } from '../utils/backup';

export const Settings = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const settings = useTaskStore((state) => state.settings);
  const tasks = useTaskStore((state) => state.tasks);
  const history = useTaskStore((state) => state.history);
  const dateLastReset = useTaskStore((state) => state.dateLastReset);
  const updateSettings = useTaskStore((state) => state.updateSettings);
  const importFullBackup = useTaskStore((state) => state.importFullBackup);

  const { isInstallable, isInstalled, promptInstall } = usePWA();

  const [testingSound, setTestingSound] = useState(false);
  const [backupMessage, setBackupMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleWipeData = () => {
    if (confirm('This will erase ALL tasks, habits, and history. This action cannot be undone.')) {
      localStorage.removeItem('daily-premium-tasks-storage');
      window.location.reload();
    }
  };

  const handleSampleAudio = () => {
    setTestingSound(true);
    playTaskCompleteSound();
    setTimeout(() => {
      playSubtaskCheckSound();
    }, 450);
    setTimeout(() => {
      playStreakCelebrationSound();
      setTestingSound(false);
    }, 900);
  };

  const handleExportBackup = () => {
    exportDataAsJSON({
      tasks,
      history,
      dateLastReset,
      settings,
    });
    setBackupMessage({ type: 'success', text: 'Backup downloaded successfully!' });
    setTimeout(() => setBackupMessage(null), 3500);
  };

  const handleTriggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await parseBackupFile(file);
    if (!result.success || !result.data) {
      setBackupMessage({ type: 'error', text: result.error || 'Invalid backup file.' });
      return;
    }

    importFullBackup(result.data);
    playStreakCelebrationSound();
    setBackupMessage({ type: 'success', text: 'Backup restored successfully!' });
    setTimeout(() => setBackupMessage(null), 4000);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Frosted Glass Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            style={{
              background: 'rgba(8, 12, 21, 0.8)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
            onClick={onClose}
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative w-full max-w-md max-h-[90vh] flex flex-col rounded-2xl overflow-hidden"
            style={{
              background: 'var(--bg-card-solid)',
              border: '1px solid var(--border-hover)',
              boxShadow:
                'inset 0 1px 0 rgba(255,255,255,0.1), 0 24px 64px rgba(0,0,0,0.6), 0 0 32px rgba(99,102,241,0.15)',
            }}
          >
            {/* Header */}
            <div
              className="px-6 py-4.5 flex justify-between items-center relative overflow-hidden shrink-0"
              style={{
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                boxShadow: '0 4px 20px rgba(99,102,241,0.3)',
              }}
            >
              <h2 className="text-base font-bold text-white flex items-center gap-2 tracking-tight">
                <SettingsIcon size={18} /> Preferences & Data Engine
              </h2>
              <button
                onClick={onClose}
                aria-label="Close"
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer text-white/80 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Form */}
            <div className="p-6 space-y-5 overflow-y-auto">
              {/* Name */}
              <div className="space-y-1.5">
                <label
                  htmlFor="settings-name"
                  className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <User size={11} /> Your Name
                </label>
                <input
                  id="settings-name"
                  type="text"
                  title="Name"
                  value={settings.name}
                  onChange={(e) => updateSettings({ name: e.target.value })}
                  className="input-premium w-full text-sm"
                  style={{ color: 'var(--text-primary)' }}
                />
              </div>

              {/* Theme Segmented Control */}
              <div className="space-y-1.5">
                <label
                  className="text-[10px] font-bold uppercase tracking-widest block"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Appearance Theme
                </label>
                <div
                  className="grid grid-cols-3 gap-1.5 p-1 rounded-xl"
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-default)',
                  }}
                >
                  {(
                    [
                      { id: 'dark', label: 'Dark', icon: <Moon size={12} /> },
                      { id: 'light', label: 'Light', icon: <Sun size={12} /> },
                      { id: 'system', label: 'System', icon: <Laptop size={12} /> },
                    ] as const
                  ).map((themeOpt) => {
                    const isSelected = settings.theme === themeOpt.id;
                    return (
                      <button
                        key={themeOpt.id}
                        type="button"
                        onClick={() => updateSettings({ theme: themeOpt.id })}
                        className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                        style={{
                          background: isSelected ? 'var(--brand)' : 'transparent',
                          color: isSelected ? '#FFFFFF' : 'var(--text-muted)',
                          boxShadow: isSelected ? '0 2px 8px rgba(99,102,241,0.3)' : 'none',
                        }}
                      >
                        {themeOpt.icon}
                        <span>{themeOpt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Carry Forward Unfinished */}
              <div
                className="flex items-center justify-between py-2.5 border-t"
                style={{ borderColor: 'var(--border-default)' }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: 'rgba(99, 102, 241, 0.1)',
                      color: 'var(--brand)',
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                    }}
                  >
                    <ArrowRightLeft size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                      Carry Forward Unfinished
                    </p>
                    <p className="text-[10px]" style={{ color: 'var(--text-disabled)' }}>
                      Transfer pending tasks to tomorrow's list
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateSettings({
                      carryForwardUnfinished: !settings.carryForwardUnfinished,
                    })
                  }
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none ${
                    settings.carryForwardUnfinished ? 'bg-indigo-600' : 'bg-slate-700'
                  }`}
                  style={{
                    boxShadow: settings.carryForwardUnfinished
                      ? '0 0 12px rgba(99,102,241,0.5)'
                      : 'none',
                  }}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.carryForwardUnfinished ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Sound Effects & Test Button */}
              <div
                className="flex items-center justify-between py-2.5 border-t"
                style={{ borderColor: 'var(--border-default)' }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: 'rgba(34, 197, 94, 0.1)',
                      color: '#4ADE80',
                      border: '1px solid rgba(34, 197, 94, 0.2)',
                    }}
                  >
                    <Volume2 size={14} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Tactile Sound Effects
                      </p>
                      {settings.soundEnabled !== false && (
                        <button
                          type="button"
                          onClick={handleSampleAudio}
                          disabled={testingSound}
                          className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-0.5 cursor-pointer disabled:opacity-50"
                        >
                          <Play size={9} fill="currentColor" /> Test
                        </button>
                      )}
                    </div>
                    <p className="text-[10px]" style={{ color: 'var(--text-disabled)' }}>
                      Micro-synthesizer chimes, clicks, and celebrations
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateSettings({
                      soundEnabled: settings.soundEnabled === false ? true : false,
                    })
                  }
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none ${
                    settings.soundEnabled !== false ? 'bg-indigo-600' : 'bg-slate-700'
                  }`}
                  style={{
                    boxShadow:
                      settings.soundEnabled !== false
                        ? '0 0 12px rgba(99,102,241,0.5)'
                        : 'none',
                  }}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.soundEnabled !== false ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Install PWA App */}
              {(isInstallable || isInstalled) && (
                <div
                  className="flex items-center justify-between py-2.5 border-t"
                  style={{ borderColor: 'var(--border-default)' }}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: 'rgba(56, 189, 248, 0.1)',
                        color: '#38BDF8',
                        border: '1px solid rgba(56, 189, 248, 0.25)',
                      }}
                    >
                      <Smartphone size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Install as App
                      </p>
                      <p className="text-[10px]" style={{ color: 'var(--text-disabled)' }}>
                        {isInstalled
                          ? 'Installed to your device for instant offline use'
                          : 'Add DailyThings to your home screen or dock'}
                      </p>
                    </div>
                  </div>
                  {isInstallable && (
                    <button
                      type="button"
                      onClick={promptInstall}
                      className="btn-primary text-xs px-3 py-1.5 cursor-pointer flex items-center gap-1.5"
                    >
                      <Download size={12} /> Install
                    </button>
                  )}
                  {isInstalled && (
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                      <Check size={13} /> Installed
                    </span>
                  )}
                </div>
              )}

              {/* Data Backup & Portability */}
              <div
                className="pt-3 border-t space-y-2.5"
                style={{ borderColor: 'var(--border-default)' }}
              >
                <div className="flex items-center gap-2">
                  <HardDrive size={13} className="text-indigo-400" />
                  <p
                    className="text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Backup & Data Portability
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleExportBackup}
                    className="btn-secondary py-2 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer hover:border-indigo-500/40"
                  >
                    <Download size={13} /> Export JSON
                  </button>

                  <button
                    type="button"
                    onClick={handleTriggerFileInput}
                    className="btn-secondary py-2 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer hover:border-indigo-500/40"
                  >
                    <Upload size={13} /> Restore JSON
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileImport}
                    className="hidden"
                  />
                </div>

                {backupMessage && (
                  <p
                    className={`text-[11px] font-medium text-center ${
                      backupMessage.type === 'success' ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {backupMessage.text}
                  </p>
                )}
              </div>

              {/* Danger Zone */}
              <div
                className="pt-3 border-t space-y-2"
                style={{ borderColor: 'var(--border-default)' }}
              >
                <p
                  className="text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: 'var(--text-disabled)' }}
                >
                  Storage & Data Reset
                </p>
                <button
                  onClick={handleWipeData}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold flex justify-center items-center gap-2 transition-all cursor-pointer"
                  style={{
                    background: 'rgba(239,68,68,0.08)',
                    color: 'var(--danger)',
                    border: '1px solid rgba(239,68,68,0.2)',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = 'rgba(239,68,68,0.16)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')
                  }
                >
                  <Trash2 size={13} /> Erase All Local Data
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
