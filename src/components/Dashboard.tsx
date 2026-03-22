import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { CheckCircle2, CircleDashed, Zap, AlertTriangle, Target } from 'lucide-react';
import { CompletionDelightPopup } from './CompletionDelightPopup';

/* ── Compact stat card with glow hover ─────────────────── */
const StatCard = ({
  icon,
  label,
  value,
  color,
  glowColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  glowColor: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="rounded-xl p-3 flex items-center gap-2.5 cursor-default transition-all duration-200 group"
    style={{
      background: 'var(--bg-card)',
      border: '1px solid rgba(148,163,184,0.08)',
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLDivElement).style.borderColor = color;
      (e.currentTarget as HTMLDivElement).style.boxShadow  = `0 0 18px ${glowColor}`;
      (e.currentTarget as HTMLDivElement).style.transform  = 'translateY(-1px)';
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(148,163,184,0.08)';
      (e.currentTarget as HTMLDivElement).style.boxShadow  = 'none';
      (e.currentTarget as HTMLDivElement).style.transform  = 'translateY(0)';
    }}
  >
    {/* Icon pill */}
    <div
      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200"
      style={{ background: `${glowColor}`, color }}
    >
      {icon}
    </div>

    {/* Value + label */}
    <div className="min-w-0">
      <span
        className="text-lg font-bold block leading-none tabular-nums"
        style={{ color: 'var(--text-primary)' }}
      >
        {value}
      </span>
      <span className="text-[10px] font-semibold block mt-0.5 truncate" style={{ color: 'var(--text-disabled)' }}>
        {label}
      </span>
    </div>
  </motion.div>
);

/* ── Dashboard ─────────────────────────────────────────── */
export const Dashboard = () => {
  const tasks = useTaskStore(state => state.tasks);
  const [isDelightOpen, setIsDelightOpen] = useState(false);

  const total      = tasks.length;
  const completed  = tasks.filter(t => t.completed).length;
  const pending    = total - completed;
  const inProgress = tasks.filter(t => !t.completed && t.progress > 0).length;
  const highP      = tasks.filter(t => t.priority === 'high' && !t.completed).length;
  const pct        = total === 0 ? 0 : Math.round((completed / total) * 100);
  const score      = completed * 10 + inProgress * 5;

  const R             = 36;
  const circumference = 2 * Math.PI * R;
  const offset        = circumference - (pct / 100) * circumference;
  const ringColor     = pct === 100 ? '#22C55E' : '#6366F1';
  const ringGlow      = pct === 100 ? 'rgba(34,197,94,0.6)' : 'rgba(99,102,241,0.5)';

  const handleProgressClick = () => {
    setIsDelightOpen(true);
  };

  return (
    <div className="space-y-3">
      {/* Progress Ring Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl p-5"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid rgba(148,163,184,0.08)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        }}
      >
        <div className="flex items-center justify-between">
          {/* Left */}
          <div className="flex-1 min-w-0 pr-3">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-disabled)' }}>
              Today's Progress
            </p>
            <button
              onClick={handleProgressClick}
              className="flex items-baseline gap-1.5 hover:opacity-80 transition-opacity cursor-pointer focus:outline-none group text-left"
              title="Click for a surprise"
            >
              <span className="text-3xl font-bold text-gradient tabular-nums group-hover:scale-105 transition-transform origin-left">{pct}%</span>
              <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>done</span>
            </button>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-disabled)' }}>
              {completed}/{total} tasks · {score} pts
            </p>
            <p
              className="text-xs mt-2 font-semibold"
              style={{ color: pct === 100 ? 'var(--success)' : 'var(--brand)' }}
            >
              {pct === 100
                ? '🎉 All done! Amazing!'
                : pct >= 50
                  ? '🚀 Halfway there!'
                  : "💪 Let's get going!"}
            </p>
          </div>

          {/* Ring */}
          <div className="relative shrink-0 flex items-center justify-center" style={{ width: 76, height: 76 }}>
            <svg width="76" height="76" style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx="38" cy="38" r={R}
                strokeWidth="6" fill="transparent"
                stroke="rgba(148,163,184,0.1)"
              />
              <motion.circle
                cx="38" cy="38" r={R}
                strokeWidth="6" fill="transparent"
                stroke={ringColor}
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                style={{ filter: `drop-shadow(0 0 5px ${ringGlow})` }}
              />
            </svg>
            <span
              className="absolute text-sm font-bold tabular-nums"
              style={{ color: ringColor }}
            >
              {pct}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 progress-bar" style={{ height: 4 }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className={`progress-bar-fill${pct === 100 ? ' success' : ''}`}
            style={{ height: 4 }}
          />
        </div>
      </motion.div>

      {/* 2×2 Compact Stats Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <StatCard
          icon={<CheckCircle2 size={13} />}
          label="Completed"
          value={completed}
          color="#22C55E"
          glowColor="rgba(34,197,94,0.15)"
        />
        <StatCard
          icon={<CircleDashed size={13} />}
          label="Pending"
          value={pending}
          color="#60A5FA"
          glowColor="rgba(56,189,248,0.15)"
        />
        <StatCard
          icon={<Zap size={13} />}
          label="In Progress"
          value={inProgress}
          color="#818CF8"
          glowColor="rgba(99,102,241,0.15)"
        />
        <StatCard
          icon={<AlertTriangle size={13} />}
          label="High Priority"
          value={highP}
          color="#F87171"
          glowColor="rgba(239,68,68,0.15)"
        />
      </div>

      {/* Score pill */}
      <div
        className="rounded-xl px-3 py-2 flex items-center justify-between"
        style={{
          background: 'rgba(99,102,241,0.06)',
          border: '1px solid rgba(99,102,241,0.15)',
        }}
      >
        <div className="flex items-center gap-2">
          <Target size={13} style={{ color: 'var(--brand)' }} />
          <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
            Productivity Score
          </span>
        </div>
        <span className="text-sm font-bold tabular-nums" style={{ color: '#818CF8' }}>
          {score} pts
        </span>
      </div>

      <CompletionDelightPopup
        isOpen={isDelightOpen}
        onClose={() => setIsDelightOpen(false)}
        percent={pct}
      />
    </div>
  );
};
