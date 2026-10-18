import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { CheckCircle2, CircleDashed, Zap, AlertTriangle, Target, Flame } from 'lucide-react';
import { CompletionDelightPopup } from './CompletionDelightPopup';
import { playStreakCelebrationSound } from '../utils/sound';

/* ── Compact Stat Card with Specular Micro-Highlight ─────────────────── */
const StatCard = ({
  icon,
  label,
  value,
  accentColor,
  glowColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accentColor: string;
  glowColor: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="rounded-2xl p-3.5 flex items-center gap-3 cursor-default transition-all duration-200 group relative overflow-hidden"
    style={{
      background: 'var(--bg-card)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid var(--border-default)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 16px rgba(0,0,0,0.2)',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = accentColor;
      e.currentTarget.style.boxShadow = `inset 0 1px 0 rgba(255,255,255,0.1), 0 8px 24px -4px rgba(0,0,0,0.4), 0 0 16px ${glowColor}`;
      e.currentTarget.style.transform = 'translateY(-1px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = 'var(--border-default)';
      e.currentTarget.style.boxShadow =
        'inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 16px rgba(0,0,0,0.2)';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
  >
    {/* Micro-glow in corner */}
    <div
      className="absolute -right-4 -top-4 w-12 h-12 rounded-full blur-xl pointer-events-none opacity-20 transition-opacity group-hover:opacity-40"
      style={{ background: accentColor }}
    />

    {/* Icon Chip */}
    <div
      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 duration-200"
      style={{
        background: `color-mix(in srgb, ${accentColor} 15%, transparent)`,
        color: accentColor,
        border: `1px solid color-mix(in srgb, ${accentColor} 25%, transparent)`,
      }}
    >
      {icon}
    </div>

    {/* Value & Label */}
    <div className="min-w-0">
      <span
        className="text-xl font-bold block leading-none tabular-nums tracking-tight"
        style={{ color: 'var(--text-primary)' }}
      >
        {value}
      </span>
      <span
        className="text-[10px] font-semibold uppercase tracking-wider block mt-1 truncate"
        style={{ color: 'var(--text-disabled)' }}
      >
        {label}
      </span>
    </div>
  </motion.div>
);

/* ── Dashboard Component ─────────────────────────────────────────── */
export const Dashboard = () => {
  const tasks = useTaskStore((state) => state.tasks);
  const history = useTaskStore((state) => state.history);
  const dateLastReset = useTaskStore((state) => state.dateLastReset);
  const getStreak = useTaskStore((state) => state.getStreak);
  const settings = useTaskStore((state) => state.settings);
  const [isDelightOpen, setIsDelightOpen] = useState(false);

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const inProgress = tasks.filter((t) => !t.completed && t.progress > 0).length;
  const highP = tasks.filter((t) => t.priority === 'high' && !t.completed).length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  const score = completed * 10 + inProgress * 5;
  const streak = getStreak();

  const R = 34;
  const circumference = 2 * Math.PI * R;
  const offset = circumference - (pct / 100) * circumference;

  const handleProgressClick = () => {
    if (settings.soundEnabled && pct === 100) {
      playStreakCelebrationSound();
    }
    setIsDelightOpen(true);
  };

  // Build last 7 days consistency array
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(dateLastReset + 'T00:00:00');
    d.setDate(d.getDate() - (6 - i));
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const dayLabel = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
    const isToday = i === 6;
    const isCompleted = isToday
      ? completed > 0
      : (history[dateStr]?.completedTasks ?? 0) > 0;
    return { dateStr, dayLabel, isCompleted, isToday };
  });

  const activeDaysCount = last7Days.filter((d) => d.isCompleted).length;

  return (
    <div className="space-y-3.5">
      {/* ── Progress Card with Ambient Ring ──────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card p-5 relative overflow-hidden"
      >
        {/* Subtle background gradient glow */}
        <div
          className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ background: pct === 100 ? '#22C55E' : '#6366F1' }}
        />

        <div className="flex items-center justify-between relative z-10">
          {/* Left info */}
          <div className="flex-1 min-w-0 pr-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              <p
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: 'var(--text-disabled)' }}
              >
                Today's Velocity
              </p>
            </div>

            <button
              onClick={handleProgressClick}
              className="flex items-baseline gap-2 hover:opacity-85 transition-all cursor-pointer focus:outline-none group text-left"
              title="Click for celebratory surprise"
            >
              <span className="text-3xl font-extrabold text-gradient tabular-nums group-hover:scale-105 transition-transform origin-left">
                {pct}%
              </span>
              <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                complete
              </span>
            </button>

            <p className="text-[11px] font-medium mt-1 tabular-nums" style={{ color: 'var(--text-disabled)' }}>
              {completed} of {total} tasks · <span className="text-indigo-400 font-semibold">{score} pts</span>
            </p>

            <div className="mt-2.5">
              <span
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full"
                style={{
                  background:
                    pct === 100
                      ? 'rgba(34, 197, 94, 0.12)'
                      : pct >= 50
                        ? 'rgba(99, 102, 241, 0.12)'
                        : 'rgba(255, 255, 255, 0.05)',
                  color:
                    pct === 100
                      ? 'var(--success)'
                      : pct >= 50
                        ? '#818CF8'
                        : 'var(--text-muted)',
                  border: `1px solid ${
                    pct === 100
                      ? 'rgba(34, 197, 94, 0.25)'
                      : pct >= 50
                        ? 'rgba(99, 102, 241, 0.25)'
                        : 'var(--border-default)'
                  }`,
                }}
              >
                {pct === 100
                  ? '🎉 All Done! Peak Day!'
                  : pct >= 50
                    ? '🚀 Halfway mark reached'
                    : '💪 Ready to conquer'}
              </span>
            </div>
          </div>

          {/* Glowing SVG Ring with Gradient */}
          <div
            className="relative shrink-0 flex items-center justify-center"
            style={{ width: 80, height: 80 }}
          >
            <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
              <defs>
                <linearGradient id="dashboardRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="50%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
                <linearGradient id="dashboardSuccessGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#22C55E" />
                </linearGradient>
              </defs>

              <circle
                cx="40"
                cy="40"
                r={R}
                strokeWidth="6"
                fill="transparent"
                stroke="rgba(255, 255, 255, 0.06)"
              />
              <motion.circle
                cx="40"
                cy="40"
                r={R}
                strokeWidth="6"
                fill="transparent"
                stroke={pct === 100 ? 'url(#dashboardSuccessGradient)' : 'url(#dashboardRingGradient)'}
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  filter: `drop-shadow(0 0 6px ${pct === 100 ? 'rgba(34,197,94,0.5)' : 'rgba(99,102,241,0.5)'})`,
                }}
              />
            </svg>
            <span
              className="absolute text-sm font-extrabold tabular-nums tracking-tight"
              style={{ color: pct === 100 ? 'var(--success)' : '#A5B4FC' }}
            >
              {pct}%
            </span>
          </div>
        </div>

        {/* Bottom micro progress line */}
        <div className="mt-4 progress-bar">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className={`progress-bar-fill${pct === 100 ? ' success' : ''}`}
          />
        </div>
      </motion.div>

      {/* ── 2×2 Metric Cards ────────────────────────────── */}
      <div className="grid grid-cols-2 gap-2.5">
        <StatCard
          icon={<CheckCircle2 size={15} />}
          label="Completed"
          value={completed}
          accentColor="#22C55E"
          glowColor="rgba(34,197,94,0.18)"
        />
        <StatCard
          icon={<CircleDashed size={15} />}
          label="Pending"
          value={pending}
          accentColor="#38BDF8"
          glowColor="rgba(56,189,248,0.18)"
        />
        <StatCard
          icon={<Zap size={15} />}
          label="In Progress"
          value={inProgress}
          accentColor="#818CF8"
          glowColor="rgba(99,102,241,0.18)"
        />
        <StatCard
          icon={<AlertTriangle size={15} />}
          label="High Priority"
          value={highP}
          accentColor="#F87171"
          glowColor="rgba(239,68,68,0.18)"
        />
      </div>

      {/* ── Streak & Score Micro Panels ─────────────────── */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Streak Panel */}
        <div
          className="rounded-2xl px-3.5 py-3 flex items-center justify-between relative overflow-hidden transition-all duration-200"
          style={{
            background: 'var(--bg-card)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 16px rgba(245,158,11,0.08)',
          }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#F59E0B',
                border: '1px solid rgba(245, 158, 11, 0.3)',
              }}
            >
              <Flame size={15} className="animate-pulse" />
            </div>
            <div>
              <span
                className="text-[10px] font-bold uppercase tracking-wider block"
                style={{ color: '#FBBF24' }}
              >
                Streak
              </span>
              <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                {streak} {streak === 1 ? 'day' : 'days'}
              </span>
            </div>
          </div>
          <span className="text-xl font-extrabold tabular-nums tracking-tight" style={{ color: '#FBBF24' }}>
            {streak}
          </span>
        </div>

        {/* Score Panel */}
        <div
          className="rounded-2xl px-3.5 py-3 flex items-center justify-between relative overflow-hidden transition-all duration-200"
          style={{
            background: 'var(--bg-card)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 16px rgba(99,102,241,0.08)',
          }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#818CF8',
                border: '1px solid rgba(99, 102, 241, 0.3)',
              }}
            >
              <Target size={15} />
            </div>
            <div>
              <span
                className="text-[10px] font-bold uppercase tracking-wider block"
                style={{ color: '#818CF8' }}
              >
                Score
              </span>
              <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                Points
              </span>
            </div>
          </div>
          <span className="text-xl font-extrabold tabular-nums tracking-tight" style={{ color: '#818CF8' }}>
            {score}
          </span>
        </div>
      </div>

      {/* ── 7-Day Consistency Tracker ───────────────────── */}
      <div
        className="glass-card p-4 flex flex-col gap-2.5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: 'var(--text-disabled)' }}
            >
              7-Day Consistency
            </span>
          </div>
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: 'rgba(34, 197, 94, 0.1)',
              color: '#4ADE80',
              border: '1px solid rgba(34, 197, 94, 0.2)',
            }}
          >
            {activeDaysCount}/7 active
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 text-center mt-1">
          {last7Days.map((d) => (
            <div key={d.dateStr} className="flex flex-col items-center gap-1.5 group/day">
              <div
                className="w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-200 cursor-default"
                style={{
                  background: d.isCompleted
                    ? 'linear-gradient(135deg, rgba(16,185,129,0.3) 0%, rgba(34,197,94,0.4) 100%)'
                    : 'rgba(255, 255, 255, 0.04)',
                  border: d.isCompleted
                    ? '1.5px solid #22C55E'
                    : d.isToday
                      ? '1px dashed rgba(99,102,241,0.5)'
                      : '1px solid rgba(255, 255, 255, 0.06)',
                  boxShadow: d.isCompleted ? '0 0 12px rgba(34,197,94,0.35)' : 'none',
                }}
                title={`${d.dateStr}: ${d.isCompleted ? 'Goal Achieved' : 'No Activity'}`}
              >
                {d.isCompleted ? (
                  <span className="text-xs text-green-300 font-bold">✓</span>
                ) : (
                  <span className="text-[10px]" style={{ color: 'var(--text-disabled)' }}>
                    •
                  </span>
                )}
              </div>
              <span
                className="text-[9px] font-bold uppercase tracking-wider"
                style={{ color: d.isToday ? 'var(--brand)' : 'var(--text-disabled)' }}
              >
                {d.dayLabel}
              </span>
            </div>
          ))}
        </div>
      </div>

      <CompletionDelightPopup
        isOpen={isDelightOpen}
        onClose={() => setIsDelightOpen(false)}
        percent={pct}
      />
    </div>
  );
};
