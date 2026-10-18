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
import { useTaskStore } from "./store/useTaskStore";
import { getGreeting } from "./data/greetings";
import { STORIES, TIRED_MESSAGES, type StoryItem } from "./data/motivation";
import { Settings as SettingsIcon, Plus, Sparkles, BatteryLow } from "lucide-react";
import { motion } from "framer-motion";

function App() {
  useDailyReset();
  const tasks = useTaskStore((state) => state.tasks);
  const settings = useTaskStore((state) => state.settings);

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [motivateModal, setMotivateModal] = useState<StoryItem | null>(null);
  const [tiredModal, setTiredModal] = useState<string | null>(null);
  const [isUserDelightOpen, setIsUserDelightOpen] = useState(false);

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
  };

  const handleMotivate = () =>
    setMotivateModal(STORIES[Math.floor(Math.random() * STORIES.length)]);

  const handleTired = () =>
    setTiredModal(TIRED_MESSAGES[Math.floor(Math.random() * TIRED_MESSAGES.length)]);

  const handleNameClick = () => {
    setIsUserDelightOpen(true);
  };

  if (!settings.isOnboarded) return <Onboarding />;

  return (
    <Layout>
      {/* ── Header ──────────────────────────────────────── */}
      <header className="mb-8">
        {/* Row 1: greeting (left) | clock (right) */}
        <div className="flex items-start justify-between gap-3">
          {/* LEFT: full greeting */}
          <div className="min-w-0 flex-1">
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-0.5 flex items-center gap-1.5"
              style={{ color: "var(--text-disabled)" }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse"
                style={{ background: greeting.dot }}
              />
              Dashboard
            </p>
            <h1
              className="font-bold tracking-tight leading-tight"
              style={{ color: "var(--text-primary)", fontSize: "clamp(1.15rem, 5vw, 2.25rem)" }}
            >
              {greeting.text},{" "}
              <button
                onClick={handleNameClick}
                className="text-gradient cursor-pointer hover:opacity-80 transition-opacity focus:outline-none"
                title="Tap for a surprise"
              >
                {settings.name}
              </button>
            </h1>
            <p className="text-xs mt-1 font-medium" style={{ color: "var(--text-muted)" }}>
              {greeting.sub}
            </p>
          </div>

          {/* RIGHT: clock only */}
          <div className="shrink-0">
            <LiveClock />
          </div>
        </div>

        {/* Row 2: action buttons */}
        <div className="mt-3 flex items-center justify-end gap-1.5">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsSettingsOpen(true)}
              title="Settings"
              aria-label="Open Settings"
              className="btn-ghost p-2 rounded-xl cursor-pointer"
            >
              <SettingsIcon size={16} style={{ color: "var(--text-muted)" }} />
            </button>

            <button
              onClick={handleMotivate}
              title="Motivate Me"
              aria-label="Get a motivational story"
              className="flex items-center gap-1 rounded-xl px-2.5 py-2 text-xs font-semibold transition-all cursor-pointer"
              style={{
                background: "rgba(99,102,241,0.1)",
                color: "#818CF8",
                border: "1px solid rgba(99,102,241,0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(99,102,241,0.2)";
                e.currentTarget.style.boxShadow = "0 0 16px rgba(99,102,241,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(99,102,241,0.1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <Sparkles size={13} />
              <span className="hidden sm:inline">Motivate</span>
            </button>

            <button
              onClick={handleTired}
              title="I'm Tired"
              aria-label="I'm feeling tired"
              className="flex items-center gap-1 rounded-xl px-2.5 py-2 text-xs font-semibold transition-all cursor-pointer"
              style={{
                background: "rgba(245,158,11,0.08)",
                color: "#FBBF24",
                border: "1px solid rgba(245,158,11,0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(245,158,11,0.16)";
                e.currentTarget.style.boxShadow = "0 0 16px rgba(245,158,11,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(245,158,11,0.08)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <BatteryLow size={13} />
              <span className="hidden sm:inline">Tired</span>
            </button>

            <button
              onClick={handleOpenNewTask}
              title="Add New Task"
              aria-label="Add a new task"
              className="btn-primary flex items-center gap-1.5 text-xs px-3 py-2 cursor-pointer"
            >
              <Plus size={14} />
              <span>New Task</span>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div
          className="mt-5 h-px w-full"
          style={{ background: "linear-gradient(to right, rgba(99,102,241,0.3), transparent)" }}
        />
      </header>

      {/* ── Content ─────────────────────────────────────── */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1">
          <Dashboard />
        </div>

        <div className="lg:col-span-2">
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-4"
            style={{ color: "var(--text-disabled)" }}
          >
            Tasks · {tasks.length}
          </p>

          {tasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-12 flex flex-col items-center justify-center text-center min-h-[320px]"
            >
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                No tasks yet
              </h3>
              <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
                Start building your day — add your first task.
              </p>
              <button onClick={handleOpenNewTask} className="btn-primary cursor-pointer">
                + Add First Task
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

      {/* I'm Tired modal */}
      {tiredModal && (
        <MessageModal
          isOpen={!!tiredModal}
          onClose={() => setTiredModal(null)}
          emoji="💙"
          title="I hear you."
          body={tiredModal}
          accentGradient="linear-gradient(90deg, #F59E0B, #FBBF24)"
        />
      )}

      {/* Premium User Delight Modal */}
      <UserDelightPopup
        isOpen={isUserDelightOpen}
        onClose={() => setIsUserDelightOpen(false)}
        userName={settings.name}
      />
    </Layout>
  );
}

export default App;
