import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { Onboarding } from './components/Onboarding';
import { Settings } from './components/Settings';
import { useDailyReset } from './hooks/useDailyReset';
import { RewardPopup } from './components/RewardPopup';
import { useTaskStore } from './store/useTaskStore';
import { Settings as SettingsIcon, Plus, Sparkles, BatteryLow, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Greetings ─────────────────────────────────────────────── */
function getGreeting() {
  const h = new Date().getHours();
  if (h >= 5  && h < 12) return { text: 'Good Morning',   sub: 'Ready to win the day? ✨', dot: '#22C55E' };
  if (h >= 12 && h < 17) return { text: 'Good Afternoon', sub: 'Keep the momentum going 🚀', dot: '#6366F1' };
  if (h >= 17 && h < 22) return { text: 'Good Evening',   sub: 'Wrapping up strong 💪',     dot: '#F59E0B' };
  return { text: "It's Late", sub: 'Rest up for tomorrow 😴', dot: '#94A3B8' };
}

/* ── Motivational Stories ──────────────────────────────────── */
const STORIES = [
  { emoji: '🌱', title: 'The Seed', body: "A seed doesn't know it will become a tree. You don't need to see the whole staircase — just take the next step. The consistency you build today is quietly constructing someone remarkable." },
  { emoji: '💡', title: 'Edison\'s Secret', body: "Thomas Edison failed 10,000 times before the light bulb worked. He said: 'I found 10,000 ways that don't work.' Every struggle you face is narrowing you down to the one way that does." },
  { emoji: '⛰️', title: 'The Mountain Law', body: "The mountain doesn't get smaller the more you look at it — you get stronger. Every hard day you survive makes the next challenge smaller. You're already stronger than you were yesterday." },
  { emoji: '🚀', title: 'Resistance = Launch', body: "Rockets need resistance to launch. Without gravity's push-back, they'd go nowhere. The resistance you feel right now? That's exactly what's going to launch you forward. Lean into it." },
  { emoji: '💎', title: 'Pressure Makes Diamonds', body: "Diamonds are just coal that handled pressure incredibly well. You're in the pressure phase — the transformation phase. Don't run from it. Let it shape you into something brilliant." },
  { emoji: '🏆', title: 'Champions Aren\'t Made on Easy Days', body: "The easy days feel good, but the hard days are where legends are built. Champions are forged in moments when everything says 'stop' and they whisper 'one more.' That's today. One more." },
  { emoji: '🌟', title: 'Your Future Self', body: "One day you'll look back at today and feel incredibly proud that you didn't quit. Your future self is watching. They're cheering for you right now, knowing what you become if you hold on." },
  { emoji: '🦋', title: 'Trust the Process', body: "The caterpillar doesn't 'try' to become a butterfly. It surrenders to the process and trusts the transformation. You're in your chrysalis. Don't rush it. Something beautiful is being built inside you." },
  { emoji: '⚡', title: 'Your Season is Coming', body: "Your current situation is not your final destination. Every expert was once a beginner. Every legend was once unknown. Every master was once a disaster. Your time is coming — keep building." },
  { emoji: '🌊', title: 'Unshakeable', body: "The ocean doesn't apologize for its waves. Stop shrinking yourself to fit into spaces that were never meant for you. You were built for depth. Go deep. Go wide. The world needs all of you." },
];

const TIRED_MESSAGES = [
  "I hear you. I really do. 💙\n\nBeing tired isn't weakness — it's proof you've been giving everything you have. That matters.\n\nTake a breath. Put down what's heavy, even just for a moment. Rest is not giving up — rest is recharging.\n\nYou don't have to carry everything at once. You don't have to solve it all today.\n\nBut know this: the fact that you're still here, still trying, still showing up — that's not nothing. That's everything.\n\nYou are not weak. You are someone who cares deeply, tries relentlessly, and keeps going even when no one's watching.\n\nTake your rest. Come back stronger. Because that's what you do. 💪",
  "Hey. I see you. 🤍\n\nSometimes the most courageous thing you can do is admit you're tired. It takes real strength to acknowledge that.\n\nWhatever is making you tired — whether it's the work, the waiting, the uncertainty — I want you to know: it won't always feel like this.\n\nYou've survived 100% of your hardest days. Every single one. And you're still here.\n\nLet the tiredness speak. Listen to it. Then, when you're ready — not when the world says, but when *you* say — rise again.\n\nYou are not behind. You are exactly where you need to be. You are enough. 🌿",
  "I understand. Truly. 💜\n\nTired is real. The exhaustion you feel isn't just in your body — it's in the effort you've been pouring out every single day.\n\nKeep pushing if the thing tires you for a reason worth fighting for. Or — and this takes even more courage — take a leave from the thing that drains you without giving back.\n\nEither way, you come back. Stronger. Clearer. More you.\n\nBecause here's the truth: you play your role in this world perfectly. There is no one else who can be you. No one. Your presence matters. Your effort matters. You matter.\n\nYou are not weak. You are strong in ways you haven't even discovered yet. ✨",
];

/* ── Live Clock ─────────────────────────────────────────────── */
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const LiveClock = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const h    = now.getHours();
  const m    = String(now.getMinutes()).padStart(2, '0');
  const s    = String(now.getSeconds()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12  = h % 12 || 12;

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-end select-none"
    >
      <div className="flex items-baseline gap-1">
        <span
          className="text-xl md:text-2xl font-bold tabular-nums"
          style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
        >
          {h12}:{m}
        </span>
        <div className="flex flex-col items-start ml-0.5">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={s}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="text-[10px] font-bold tabular-nums"
              style={{ color: 'var(--text-muted)' }}
            >
              {s}
            </motion.span>
          </AnimatePresence>
          <span className="text-[10px] font-bold tracking-wider" style={{ color: 'var(--brand)' }}>
            {ampm}
          </span>
        </div>
      </div>
      <p className="text-[10px] font-medium" style={{ color: 'var(--text-disabled)' }}>
        {DAYS[now.getDay()]}, {MONTHS[now.getMonth()]} {now.getDate()}
      </p>
    </motion.div>
  );
};

/* ── Motivation Modal ───────────────────────────────────────── */
const Modal = ({
  isOpen,
  onClose,
  title,
  emoji,
  body,
  accentGradient,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  emoji: string;
  body: string;
  accentGradient: string;
}) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          style={{ background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 16 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="relative w-full max-w-md rounded-2xl overflow-hidden"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid rgba(148,163,184,0.12)',
            boxShadow: '0 32px 72px rgba(0,0,0,0.5)',
          }}
        >
          {/* Accent top strip */}
          <div className="h-1" style={{ background: accentGradient }} />

          {/* Header */}
          <div className="px-6 pt-5 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.span
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="text-3xl"
                style={{ display: 'inline-block' }}
              >
                {emoji}
              </motion.span>
              <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                {title}
              </h2>
            </div>
            <button
              onClick={onClose}
              title="Close"
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 pb-6">
            <p
              className="text-sm leading-relaxed whitespace-pre-line"
              style={{ color: 'var(--text-secondary)' }}
            >
              {body}
            </p>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

/* ── App ────────────────────────────────────────────────────── */
function App() {
  useDailyReset();
  const tasks    = useTaskStore(state => state.tasks);
  const settings = useTaskStore(state => state.settings);

  const [isTaskFormOpen,  setIsTaskFormOpen]  = useState(false);
  const [isSettingsOpen,  setIsSettingsOpen]  = useState(false);
  const [editTaskId,      setEditTaskId]      = useState<string | null>(null);
  const [motivateModal,   setMotivateModal]   = useState<typeof STORIES[0] | null>(null);
  const [tiredModal,      setTiredModal]      = useState<string | null>(null);

  const greeting = getGreeting();

  const handleEditTask     = (id: string) => { setEditTaskId(id); setIsTaskFormOpen(true); };
  const handleOpenNewTask  = ()            => { setEditTaskId(null); setIsTaskFormOpen(true); };
  const handleMotivate     = ()            => setMotivateModal(STORIES[Math.floor(Math.random() * STORIES.length)]);
  const handleTired        = ()            => setTiredModal(TIRED_MESSAGES[Math.floor(Math.random() * TIRED_MESSAGES.length)]);

  if (!settings.isOnboarded) return <Onboarding />;

  return (
    <Layout>
      {/* ── Header ──────────────────────────────────────── */}
      <header className="mb-8">
        {/* Row 1: greeting (left) | clock (right) — these two never compete */}
        <div className="flex items-start justify-between gap-3">

          {/* LEFT: full greeting — allowed to grow */}
          <div className="min-w-0 flex-1">
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-0.5 flex items-center gap-1.5"
              style={{ color: 'var(--text-disabled)' }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse"
                style={{ background: greeting.dot }}
              />
              Dashboard
            </p>
            <h1
              className="font-bold tracking-tight leading-tight"
              style={{ color: 'var(--text-primary)', fontSize: 'clamp(1.15rem, 5vw, 2.25rem)' }}
            >
              {greeting.text},{' '}
              <span className="text-gradient">{settings.name}</span>
            </h1>
            <p className="text-xs mt-1 font-medium" style={{ color: 'var(--text-muted)' }}>
              {greeting.sub}
            </p>
          </div>

          {/* RIGHT: clock only — compact, never clips the name */}
          <div className="shrink-0">
            <LiveClock />
          </div>
        </div>

        {/* Row 2: action buttons — their own line, right-aligned */}
        <div className="mt-3 flex items-center justify-end gap-1.5">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsSettingsOpen(true)}
                title="Settings"
                aria-label="Open Settings"
                className="btn-ghost p-2 rounded-xl"
              >
                <SettingsIcon size={16} style={{ color: 'var(--text-muted)' }} />
              </button>

              <button
                onClick={handleMotivate}
                title="Motivate Me"
                aria-label="Get a motivational story"
                className="flex items-center gap-1 rounded-xl px-2.5 py-2 text-xs font-semibold transition-all"
                style={{
                  background: 'rgba(99,102,241,0.1)',
                  color: '#818CF8',
                  border: '1px solid rgba(99,102,241,0.2)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(99,102,241,0.2)';
                  e.currentTarget.style.boxShadow = '0 0 16px rgba(99,102,241,0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(99,102,241,0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Sparkles size={13} />
                <span className="hidden sm:inline">Motivate</span>
              </button>

              <button
                onClick={handleTired}
                title="I'm Tired"
                aria-label="I'm feeling tired"
                className="flex items-center gap-1 rounded-xl px-2.5 py-2 text-xs font-semibold transition-all"
                style={{
                  background: 'rgba(245,158,11,0.08)',
                  color: '#FBBF24',
                  border: '1px solid rgba(245,158,11,0.2)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(245,158,11,0.16)';
                  e.currentTarget.style.boxShadow = '0 0 16px rgba(245,158,11,0.2)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(245,158,11,0.08)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <BatteryLow size={13} />
                <span className="hidden sm:inline">Tired</span>
              </button>

              <button
                onClick={handleOpenNewTask}
                title="Add New Task"
                aria-label="Add a new task"
                className="btn-primary flex items-center gap-1.5 text-xs px-3 py-2"
              >
                <Plus size={14} />
                <span>New Task</span>
              </button>
            </div>
          </div>

        {/* Divider */}
        <div
          className="mt-5 h-px w-full"
          style={{ background: 'linear-gradient(to right, rgba(99,102,241,0.3), transparent)' }}
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
            style={{ color: 'var(--text-disabled)' }}
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
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                No tasks yet
              </h3>
              <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
                Start building your day — add your first task.
              </p>
              <button onClick={handleOpenNewTask} className="btn-primary">
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
        <Modal
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
        <Modal
          isOpen={!!tiredModal}
          onClose={() => setTiredModal(null)}
          emoji="💙"
          title="I hear you."
          body={tiredModal}
          accentGradient="linear-gradient(90deg, #F59E0B, #FBBF24)"
        />
      )}
    </Layout>
  );
}

export default App;
