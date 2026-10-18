import { useState, useEffect } from "react";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { TaskList } from "./components/TaskList";
import { TaskForm } from "./components/TaskForm";
import { Onboarding } from "./components/Onboarding";
import { Settings } from "./components/Settings";
import { LiveClock } from "./components/LiveClock";
import { MessageModal } from "./components/MessageModal";
import { RewardPopup } from "./components/RewardPopup";
import { UserDelightPopup } from "./components/UserDelightPopup";
import { useDailyReset } from "./hooks/useDailyReset";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useTaskStore } from "./store/useTaskStore";
import { getGreeting } from "./data/greetings";
import { STORIES, TIRED_MESSAGES, type StoryItem } from "./data/motivation";
import {
  Settings as SettingsIcon,
  Plus,
  Sparkles,
  Coffee,
  CheckCircle,
  Dumbbell,
  BookOpen,
  WifiOff,
  Download,
} from "lucide-react";
import { motion } from "framer-motion";
import { playModalOpenSound, playButtonTapSound } from "./utils/sound";
import { usePWA } from "./hooks/usePWA";

function App() {
  useDailyReset();
  const { isOnline, isInstallable, promptInstall } = usePWA();
  const tasks = useTaskStore((state) => state.tasks);
  const addTask = useTaskStore((state) => state.addTask);
  const settings = useTaskStore((state) => state.settings);

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [motivateModal, setMotivateModal] = useState<StoryItem | null>(null);
  const [tiredModal, setTiredModal] = useState<string | null>(null);
  const [isUserDelightOpen, setIsUserDelightOpen] = useState(false);

  // Keyboard navigation shortcuts
  useKeyboardShortcuts({
    onNewTask: () => {
      setEditTaskId(null);
      setIsTaskFormOpen(true);
      if (settings.soundEnabled) playButtonTapSound();
    },
    onEscape: () => {
      setIsTaskFormOpen(false);
      setIsSettingsOpen(false);
      setMotivateModal(null);
      setTiredModal(null);
      setIsUserDelightOpen(false);
    },
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const isDarkOS = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark =
      settings.theme === "dark" || (settings.theme === "system" && isDarkOS);

    if (isDark) {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
  }, [settings.theme]);

  const greeting = getGreeting();

  const handleEditTask = (id: string) => {
    setEditTaskId(id);
    setIsTaskFormOpen(true);
  };

  const handleOpenNewTask = () => {
    setEditTaskId(null);
    setIsTaskFormOpen(true);
    if (settings.soundEnabled) playButtonTapSound();
  };

  const handleMotivate = () => {
    if (settings.soundEnabled) playModalOpenSound();
    setMotivateModal(STORIES[Math.floor(Math.random() * STORIES.length)]);
  };

  const handleTired = () => {
    if (settings.soundEnabled) playModalOpenSound();
    setTiredModal(TIRED_MESSAGES[Math.floor(Math.random() * TIRED_MESSAGES.length)]);
  };

  const handleNameClick = () => {
    if (settings.soundEnabled) playModalOpenSound();
    setIsUserDelightOpen(true);
  };

  // Quick Starter Actions for empty state
  const handleQuickAdd = (title: string, category: 'work' | 'personal' | 'health' | 'learning') => {
    addTask({
      title,
      description: '',
      priority: 'medium',
      category,
      recurring: 'daily',
      subtasks: [],
    });
    if (settings.soundEnabled) playButtonTapSound();
  };

  if (!settings.isOnboarded) return <Onboarding />;

  return (
    <Layout>
      {/* ── Top Header / Control Center ─────────────────── */}
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          {/* Greeting & Subtitle */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="w-2 h-2 rounded-full shrink-0 animate-ping"
                style={{ background: greeting.dot }}
              />
              <span
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: "var(--text-disabled)" }}
              >
                Today's Workspace
              </span>
            </div>

            <h1
              className="font-extrabold tracking-tight leading-tight"
              style={{
                color: "var(--text-primary)",
                fontSize: "clamp(1.5rem, 4vw, 2.35rem)",
              }}
            >
              {greeting.text},{" "}
              <button
                onClick={handleNameClick}
                className="text-gradient cursor-pointer hover:opacity-85 transition-opacity focus:outline-none"
                title="Tap for your daily spark"
              >
                {settings.name}
              </button>
            </h1>

            <p className="text-xs sm:text-sm mt-1.5 font-medium" style={{ color: "var(--text-muted)" }}>
              {greeting.sub}
            </p>
          </div>

          {/* Right Header Widget: Live Clock */}
          <div className="shrink-0 flex items-center sm:items-end justify-between sm:justify-start gap-4">
            <LiveClock />
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-2.5 pt-4 border-t border-white/5">
          {/* Left quick inspiration tags */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleMotivate}
              title="Need motivation?"
              aria-label="Get a motivational story"
              className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer focus:outline-none"
              style={{
                background: "rgba(99, 102, 241, 0.1)",
                color: "#A5B4FC",
                border: "1px solid rgba(99, 102, 241, 0.25)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(99, 102, 241, 0.2)";
                e.currentTarget.style.boxShadow = "0 0 16px rgba(99, 102, 241, 0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(99, 102, 241, 0.1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <Sparkles size={13} />
              <span>Spark</span>
            </button>

            <button
              onClick={handleTired}
              title="Feeling tired or overwhelmed?"
              aria-label="I'm feeling tired"
              className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer focus:outline-none"
              style={{
                background: "rgba(245, 158, 11, 0.08)",
                color: "#FCD34D",
                border: "1px solid rgba(245, 158, 11, 0.25)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(245, 158, 11, 0.18)";
                e.currentTarget.style.boxShadow = "0 0 16px rgba(245, 158, 11, 0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(245, 158, 11, 0.08)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <Coffee size={13} />
              <span>Rest & Reset</span>
            </button>

            {!isOnline && (
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-semibold"
                style={{
                  background: "rgba(245, 158, 11, 0.12)",
                  color: "#FBBF24",
                  border: "1px solid rgba(245, 158, 11, 0.25)",
                }}
                title="Running in 100% offline mode from local disk"
              >
                <WifiOff size={11} /> Offline
              </span>
            )}
          </div>

          {/* Right action buttons */}
          <div className="flex items-center gap-2 ml-auto">
            {isInstallable && (
              <button
                onClick={promptInstall}
                title="Install DailyThings app to your device"
                aria-label="Install app"
                className="btn-secondary flex items-center gap-1.5 text-xs px-2.5 py-1.5 cursor-pointer"
              >
                <Download size={13} />
                <span className="hidden sm:inline">Install App</span>
              </button>
            )}

            <button
              onClick={() => setIsSettingsOpen(true)}
              title="Settings & Preferences"
              aria-label="Open Settings"
              className="btn-ghost p-2 rounded-xl cursor-pointer hover:rotate-45 transition-transform duration-300"
            >
              <SettingsIcon size={16} style={{ color: "var(--text-muted)" }} />
            </button>

            <button
              onClick={handleOpenNewTask}
              title="Add New Task (Hotkey: N)"
              aria-label="Add a new task"
              className="btn-primary flex items-center gap-1.5 text-xs px-3.5 py-2 cursor-pointer focus:outline-none"
            >
              <Plus size={14} />
              <span>New Task</span>
              <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.2 text-[9px] font-mono bg-white/20 rounded">
                N
              </kbd>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content Grid ────────────────────────────── */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Dashboard Insights */}
        <div className="lg:col-span-1">
          <Dashboard />
        </div>

        {/* Right Column: Tasks Engine */}
        <div className="lg:col-span-2">
          {tasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="glass-card p-10 flex flex-col items-center justify-center text-center min-h-[380px] relative overflow-hidden"
            >
              {/* Subtle center illumination */}
              <div
                className="absolute w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-20"
                style={{ background: "#6366F1" }}
              />

              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 relative z-10"
                style={{
                  background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))",
                  border: "1px solid rgba(99,102,241,0.3)",
                  boxShadow: "0 0 24px rgba(99,102,241,0.2)",
                }}
              >
                <CheckCircle size={28} className="text-indigo-400" />
              </div>

              <h3 className="text-lg font-bold mb-1.5 tracking-tight relative z-10" style={{ color: "var(--text-primary)" }}>
                Your day is wide open
              </h3>
              <p className="text-xs sm:text-sm max-w-sm mb-6 relative z-10 leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Build your daily momentum. Add a task using <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-xs border border-slate-700 font-mono">N</kbd> or choose a quick blueprint:
              </p>

              {/* Quick Blueprints */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full max-w-md mb-6 relative z-10">
                <button
                  onClick={() => handleQuickAdd('Deep Work & Focus Session', 'work')}
                  className="p-2.5 rounded-xl text-left border text-xs font-medium transition-all hover:scale-[1.02] cursor-pointer"
                  style={{
                    background: 'rgba(99, 102, 241, 0.08)',
                    borderColor: 'rgba(99, 102, 241, 0.2)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <BookOpen size={13} className="text-indigo-400 mb-1" />
                  <span className="block font-semibold text-white">Deep Work</span>
                  <span className="text-[10px] text-slate-400">90 min focus block</span>
                </button>

                <button
                  onClick={() => handleQuickAdd('Daily Physical Workout', 'health')}
                  className="p-2.5 rounded-xl text-left border text-xs font-medium transition-all hover:scale-[1.02] cursor-pointer"
                  style={{
                    background: 'rgba(34, 197, 94, 0.08)',
                    borderColor: 'rgba(34, 197, 94, 0.2)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <Dumbbell size={13} className="text-green-400 mb-1" />
                  <span className="block font-semibold text-white">Exercise</span>
                  <span className="text-[10px] text-slate-400">Cardio / Strength</span>
                </button>

                <button
                  onClick={() => handleQuickAdd('Evening Review & Reset', 'personal')}
                  className="p-2.5 rounded-xl text-left border text-xs font-medium transition-all hover:scale-[1.02] cursor-pointer"
                  style={{
                    background: 'rgba(168, 85, 247, 0.08)',
                    borderColor: 'rgba(168, 85, 247, 0.2)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <Sparkles size={13} className="text-purple-400 mb-1" />
                  <span className="block font-semibold text-white">Review</span>
                  <span className="text-[10px] text-slate-400">Reflect & plan</span>
                </button>
              </div>

              <button
                onClick={handleOpenNewTask}
                className="btn-primary text-xs px-5 py-2.5 cursor-pointer relative z-10"
              >
                + Create Custom Task
              </button>
            </motion.div>
          ) : (
            <TaskList onEditTask={handleEditTask} />
          )}
        </div>
      </main>

      {/* ── Modals & Overlays ────────────────────────────── */}
      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        editTaskId={editTaskId}
      />
      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <RewardPopup />

      {/* Motivate Me modal */}
      {motivateModal && (
        <MessageModal
          isOpen={!!motivateModal}
          onClose={() => setMotivateModal(null)}
          emoji={motivateModal.emoji}
          title={motivateModal.title}
          body={motivateModal.body}
          accentGradient="linear-gradient(90deg, #6366F1, #8B5CF6, #C084FC)"
        />
      )}

      {/* Rest & Reset modal */}
      {tiredModal && (
        <MessageModal
          isOpen={!!tiredModal}
          onClose={() => setTiredModal(null)}
          emoji="💙"
          title="Pause and Recharge"
          body={tiredModal}
          accentGradient="linear-gradient(90deg, #F59E0B, #FBBF24)"
        />
      )}

      {/* User Delight Surprise Modal */}
      <UserDelightPopup
        isOpen={isUserDelightOpen}
        onClose={() => setIsUserDelightOpen(false)}
        userName={settings.name}
      />
    </Layout>
  );
}

export default App;
