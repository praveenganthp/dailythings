import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore } from '../store/useTaskStore';
import { useNotificationStore } from '../store/useNotificationStore';
import type { Task, Priority } from '../types';
import {
  Check,
  Clock,
  GripVertical,
  MoreVertical,
  Trash2,
  Edit3,
  ArrowRight,
  Repeat,
  CheckSquare,
  ChevronDown,
  Search,
  X,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import {
  playTaskCompleteSound,
  playSubtaskCheckSound,
  playDeleteSound,
} from '../utils/sound';

type FilterType = 'all' | 'active' | 'completed' | 'high';

const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; dot: string; bg: string; border: string; text: string }
> = {
  high: {
    label: 'High',
    dot: '#EF4444',
    bg: 'rgba(239, 68, 68, 0.1)',
    border: 'rgba(239, 68, 68, 0.25)',
    text: '#F87171',
  },
  medium: {
    label: 'Medium',
    dot: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.1)',
    border: 'rgba(245, 158, 11, 0.25)',
    text: '#FBBF24',
  },
  low: {
    label: 'Low',
    dot: '#22C55E',
    bg: 'rgba(34, 197, 94, 0.1)',
    border: 'rgba(34, 197, 94, 0.25)',
    text: '#4ADE80',
  },
};

const CATEGORY_CONFIG: Record<
  string,
  { dot: string; bg: string; border: string; text: string }
> = {
  work: {
    dot: '#818CF8',
    bg: 'rgba(99, 102, 241, 0.1)',
    border: 'rgba(99, 102, 241, 0.2)',
    text: '#A5B4FC',
  },
  personal: {
    dot: '#C084FC',
    bg: 'rgba(168, 85, 247, 0.1)',
    border: 'rgba(168, 85, 247, 0.2)',
    text: '#E9D5FF',
  },
  health: {
    dot: '#4ADE80',
    bg: 'rgba(34, 197, 94, 0.1)',
    border: 'rgba(34, 197, 94, 0.2)',
    text: '#86EFAC',
  },
  learning: {
    dot: '#38BDF8',
    bg: 'rgba(56, 189, 248, 0.1)',
    border: 'rgba(56, 189, 248, 0.2)',
    text: '#BAE6FD',
  },
  other: {
    dot: '#94A3B8',
    bg: 'rgba(148, 163, 184, 0.1)',
    border: 'rgba(148, 163, 184, 0.2)',
    text: '#CBD5E1',
  },
};

/* ── Task Card Content ── */
const TaskCardContent = ({
  task,
  onEdit,
  dragHandleProps,
  isDragging,
}: {
  task: Task;
  onEdit: (id: string) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement> & {
    'data-rbd-drag-handle-draggable-id'?: string;
  };
  isDragging?: boolean;
}) => {
  const toggleTaskCompletion = useTaskStore((state) => state.toggleTaskCompletion);
  const toggleSubtask = useTaskStore((state) => state.toggleSubtask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const settings = useTaskStore((state) => state.settings);
  const showReward = useNotificationStore((state) => state.showReward);

  const [showOptions, setShowOptions] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);

  const handleToggle = () => {
    if (!task.completed) {
      showReward(task.priority, task.category);
      if (settings.soundEnabled) playTaskCompleteSound();
    }
    toggleTaskCompletion(task.id);
  };

  const handleToggleSubtask = (subtaskId: string) => {
    const targetSubtask = task.subtasks.find((s) => s.id === subtaskId);
    const willCompleteTask =
      !targetSubtask?.completed &&
      task.subtasks.filter((s) => s.id !== subtaskId && !s.completed).length === 0;

    toggleSubtask(task.id, subtaskId);

    if (settings.soundEnabled) {
      if (willCompleteTask && !task.completed) {
        playTaskCompleteSound();
        showReward(task.priority, task.category);
      } else {
        playSubtaskCheckSound();
      }
    }
  };

  const handleDelete = () => {
    if (settings.soundEnabled) playDeleteSound();
    deleteTask(task.id);
    setShowOptions(false);
  };

  const priorityMeta = PRIORITY_CONFIG[task.priority] ?? PRIORITY_CONFIG.medium;
  const categoryMeta = CATEGORY_CONFIG[task.category] ?? CATEGORY_CONFIG.other;

  const totalSubtasks = task.subtasks ? task.subtasks.length : 0;
  const completedSubtasks = task.subtasks ? task.subtasks.filter((s) => s.completed).length : 0;

  return (
    <div
      className={`group flex flex-col p-4 rounded-2xl transition-all duration-200 relative ${
        showOptions ? 'z-30' : 'z-10'
      }`}
      style={{
        background: isDragging
          ? 'var(--bg-elevated)'
          : task.completed
            ? 'rgba(17, 24, 39, 0.4)'
            : 'var(--bg-card)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: isDragging
          ? '1px solid rgba(99, 102, 241, 0.8)'
          : task.completed
            ? '1px solid rgba(255, 255, 255, 0.04)'
            : '1px solid var(--border-default)',
        boxShadow: isDragging
          ? '0 20px 48px rgba(0,0,0,0.6), 0 0 0 2px #6366F1'
          : task.completed
            ? 'none'
            : 'inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 16px rgba(0,0,0,0.25)',
        opacity: task.completed ? 0.65 : 1,
        transform: isDragging ? 'rotate(1.2deg) scale(1.01)' : 'none',
      }}
    >
      {/* Specular edge shimmer on active cards */}
      {!task.completed && (
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none rounded-t-2xl"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
          }}
        />
      )}

      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        {dragHandleProps && (
          <div
            {...dragHandleProps}
            className="mt-0.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing shrink-0"
            style={{ color: 'var(--text-disabled)' }}
            title="Drag to reorder"
          >
            <GripVertical size={16} />
          </div>
        )}

        {/* Completion Checkbox */}
        <button
          onClick={handleToggle}
          title="Toggle completion"
          className="mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer focus:outline-none"
          style={{
            background: task.completed
              ? 'linear-gradient(135deg, #10B981, #22C55E)'
              : 'rgba(255, 255, 255, 0.04)',
            border: task.completed
              ? '1.5px solid #22C55E'
              : '1.5px solid rgba(255, 255, 255, 0.2)',
            boxShadow: task.completed
              ? '0 0 14px rgba(34,197,94,0.45), inset 0 1px 0 rgba(255,255,255,0.4)'
              : 'none',
          }}
        >
          <motion.div
            initial={false}
            animate={{ scale: task.completed ? 1 : 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          >
            <Check size={12} strokeWidth={3} color="white" />
          </motion.div>
        </button>

        {/* Task Details */}
        <div className="flex-1 min-w-0">
          <h4
            className="text-sm font-semibold truncate mb-0.5 tracking-tight transition-all"
            style={{
              color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)',
              textDecoration: task.completed ? 'line-through' : 'none',
            }}
          >
            {task.title}
          </h4>

          {task.description && (
            <p className="text-xs truncate mb-2.5" style={{ color: 'var(--text-disabled)' }}>
              {task.description}
            </p>
          )}

          {/* Badges Row */}
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            {/* Priority Badge */}
            <span
              className="badge-subtle"
              style={{
                background: priorityMeta.bg,
                borderColor: priorityMeta.border,
                color: priorityMeta.text,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: priorityMeta.dot }}
              />
              {priorityMeta.label}
            </span>

            {/* Category Badge */}
            <span
              className="badge-subtle capitalize"
              style={{
                background: categoryMeta.bg,
                borderColor: categoryMeta.border,
                color: categoryMeta.text,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: categoryMeta.dot }}
              />
              {task.category}
            </span>

            {/* Recurrence Badge */}
            {task.recurring && task.recurring !== 'none' && (
              <span
                className="badge-subtle"
                style={{
                  background: 'rgba(56, 189, 248, 0.1)',
                  borderColor: 'rgba(56, 189, 248, 0.25)',
                  color: '#38BDF8',
                }}
              >
                <Repeat size={10} className="shrink-0" />
                {task.recurring === 'daily' ? 'Daily' : 'Weekdays'}
              </span>
            )}

            {/* Time Window Badge */}
            {(task.startTime || task.endTime) && (
              <span
                className="badge-subtle"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-muted)',
                }}
              >
                <Clock size={10} className="shrink-0" />
                {task.startTime}
                {task.startTime && task.endTime && <ArrowRight size={8} />}
                {task.endTime}
              </span>
            )}

            {/* Subtasks Toggle Pill */}
            {totalSubtasks > 0 && (
              <button
                type="button"
                onClick={() => setShowSubtasks(!showSubtasks)}
                className="badge-subtle cursor-pointer transition-all hover:brightness-110 focus:outline-none"
                style={{
                  background: 'rgba(99, 102, 241, 0.12)',
                  borderColor: 'rgba(99, 102, 241, 0.28)',
                  color: '#A5B4FC',
                }}
              >
                <CheckSquare size={10} />
                <span>
                  {completedSubtasks}/{totalSubtasks} steps
                </span>
                <ChevronDown
                  size={10}
                  className={`transition-transform duration-200 ${showSubtasks ? 'rotate-180' : ''}`}
                />
              </button>
            )}
          </div>
        </div>

        {/* Options Menu */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowOptions((v) => !v)}
            title="Options"
            className="p-1.5 rounded-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-white/5"
            style={{ color: 'var(--text-muted)' }}
          >
            <MoreVertical size={16} />
          </button>

          <AnimatePresence>
            {showOptions && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowOptions(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 top-8 w-36 rounded-xl overflow-hidden z-50"
                  style={{
                    background: 'var(--bg-card-solid)',
                    border: '1px solid var(--border-hover)',
                    boxShadow: '0 16px 40px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.08)',
                  }}
                >
                  <MenuBtn
                    onClick={() => {
                      onEdit(task.id);
                      setShowOptions(false);
                    }}
                    icon={<Edit3 size={13} />}
                    label="Edit Task"
                    color="var(--text-secondary)"
                    hoverBg="rgba(255,255,255,0.06)"
                  />
                  <MenuBtn
                    onClick={handleDelete}
                    icon={<Trash2 size={13} />}
                    label="Delete"
                    color="var(--danger)"
                    hoverBg="rgba(239,68,68,0.12)"
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Subtasks Collapsible Checklist */}
      {totalSubtasks > 0 && showSubtasks && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-3 pt-3 pl-8 border-t space-y-1.5"
          style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}
        >
          {/* Micro Progress Track */}
          <div className="w-full bg-slate-800/80 rounded-full h-1 overflow-hidden mb-2.5">
            <motion.div
              className="h-full rounded-full"
              style={{
                background:
                  task.progress === 100
                    ? 'linear-gradient(90deg, #10B981, #22C55E)'
                    : 'linear-gradient(90deg, #6366F1, #8B5CF6)',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${task.progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {task.subtasks.map((st) => (
            <div
              key={st.id}
              onClick={() => handleToggleSubtask(st.id)}
              className="flex items-center gap-2.5 py-1 px-2 rounded-lg cursor-pointer hover:bg-white/5 transition-colors group/sub"
            >
              <div
                className="w-4 h-4 rounded-md flex items-center justify-center transition-all duration-150 shrink-0"
                style={{
                  background: st.completed ? 'var(--brand)' : 'transparent',
                  border: st.completed
                    ? '1.5px solid var(--brand)'
                    : '1.5px solid rgba(255, 255, 255, 0.25)',
                  boxShadow: st.completed ? '0 0 10px rgba(99,102,241,0.4)' : 'none',
                }}
              >
                {st.completed && <Check size={10} strokeWidth={3} color="white" />}
              </div>
              <span
                className="text-xs transition-colors"
                style={{
                  color: st.completed ? 'var(--text-disabled)' : 'var(--text-secondary)',
                  textDecoration: st.completed ? 'line-through' : 'none',
                }}
              >
                {st.title}
              </span>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

const MenuBtn = ({
  onClick,
  icon,
  label,
  color,
  hoverBg,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  color: string;
  hoverBg: string;
}) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors cursor-pointer text-left"
    style={{ color }}
    onMouseEnter={(e) => (e.currentTarget.style.background = hoverBg)}
    onMouseLeave={(e) => (e.currentTarget.style.background = '')}
  >
    {icon} {label}
  </button>
);

/* ── Draggable wrapper (active tasks) ── */
const DraggableTaskItem = ({
  task,
  index,
  onEdit,
}: {
  task: Task;
  index: number;
  onEdit: (id: string) => void;
}) => (
  <Draggable draggableId={task.id} index={index}>
    {(provided, snapshot) => (
      <div ref={provided.innerRef} {...provided.draggableProps} className="mb-2.5">
        <TaskCardContent
          task={task}
          onEdit={onEdit}
          dragHandleProps={provided.dragHandleProps ?? undefined}
          isDragging={snapshot.isDragging}
        />
      </div>
    )}
  </Draggable>
);

/* ── Static wrapper (completed tasks) ── */
const StaticTaskItem = ({ task, onEdit }: { task: Task; onEdit: (id: string) => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 4 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -4 }}
    className="mb-2.5"
  >
    <TaskCardContent task={task} onEdit={onEdit} />
  </motion.div>
);

/* ── Main TaskList Component ── */
export const TaskList = ({ onEditTask }: { onEditTask: (id: string) => void }) => {
  const tasks = useTaskStore((state) => state.tasks);
  const reorderTasks = useTaskStore((state) => state.reorderTasks);

  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter & Search Logic
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesDesc = t.description?.toLowerCase().includes(q);
        const matchesSubtasks = t.subtasks?.some((s) => s.title.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesSubtasks) return false;
      }

      // Filter match
      if (activeFilter === 'active') return !t.completed;
      if (activeFilter === 'completed') return t.completed;
      if (activeFilter === 'high') return t.priority === 'high';
      return true;
    });
  }, [tasks, activeFilter, searchQuery]);

  const pendingFiltered = filteredTasks.filter((t) => !t.completed);
  const completedFiltered = filteredTasks.filter((t) => t.completed);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    // Map visual index to global index
    const sourceTask = pendingFiltered[result.source.index];
    const destTask = pendingFiltered[result.destination.index];
    if (!sourceTask || !destTask) return;

    const sourceGlobalIdx = tasks.findIndex((t) => t.id === sourceTask.id);
    const destGlobalIdx = tasks.findIndex((t) => t.id === destTask.id);

    if (sourceGlobalIdx !== -1 && destGlobalIdx !== -1) {
      reorderTasks(sourceGlobalIdx, destGlobalIdx);
    }
  };

  const isDndEnabled = activeFilter === 'all' && !searchQuery.trim();

  return (
    <div className="space-y-4">
      {/* ── Filter Bar & Quick Search ──────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {(
            [
              { id: 'all', label: `All (${tasks.length})` },
              { id: 'active', label: `Active (${tasks.filter((t) => !t.completed).length})` },
              { id: 'completed', label: `Done (${tasks.filter((t) => t.completed).length})` },
              { id: 'high', label: `High Priority (${tasks.filter((t) => t.priority === 'high').length})` },
            ] as const
          ).map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer focus:outline-none"
                style={{
                  background: isActive ? 'var(--brand)' : 'rgba(255, 255, 255, 0.04)',
                  color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                  border: isActive
                    ? '1px solid rgba(255, 255, 255, 0.2)'
                    : '1px solid var(--border-default)',
                  boxShadow: isActive ? '0 2px 10px rgba(99,102,241,0.35)' : 'none',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[160px] sm:w-48">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--text-disabled)' }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-8 pr-7 py-1.5 rounded-xl text-xs outline-none transition-all"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-primary)',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded cursor-pointer"
              style={{ color: 'var(--text-disabled)' }}
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* ── Empty Filter Results ───────────────────────── */}
      {filteredTasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-8 flex flex-col items-center justify-center text-center min-h-[180px]"
        >
          <p className="text-2xl mb-1">🔍</p>
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            No matching tasks
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            Try adjusting your search query or filter tab.
          </p>
          {(searchQuery || activeFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
              className="mt-3 text-xs text-indigo-400 hover:underline cursor-pointer font-semibold"
            >
              Clear filters
            </button>
          )}
        </motion.div>
      )}

      {/* ── Active Tasks ──────────────────────────────── */}
      {pendingFiltered.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <p
              className="text-xs font-bold uppercase tracking-widest flex items-center gap-2"
              style={{ color: 'var(--text-disabled)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-indigo-400" />
              Active · {pendingFiltered.length}
            </p>
            {isDndEnabled && (
              <span className="text-[10px]" style={{ color: 'var(--text-disabled)' }}>
                Drag to prioritize
              </span>
            )}
          </div>

          {isDndEnabled ? (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="active-tasks">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      background: snapshot.isDraggingOver
                        ? 'rgba(99,102,241,0.04)'
                        : 'transparent',
                      borderRadius: 16,
                      transition: 'background 0.2s',
                    }}
                  >
                    {pendingFiltered.map((task, idx) => (
                      <DraggableTaskItem
                        key={task.id}
                        task={task}
                        index={idx}
                        onEdit={onEditTask}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <div>
              {pendingFiltered.map((task) => (
                <StaticTaskItem key={task.id} task={task} onEdit={onEditTask} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Completed Tasks ────────────────────────────── */}
      {completedFiltered.length > 0 && (
        <div className="pt-2">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-2.5 flex items-center gap-2"
            style={{ color: 'var(--text-disabled)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Done · {completedFiltered.length}
          </p>
          <AnimatePresence mode="popLayout">
            {completedFiltered.map((task) => (
              <StaticTaskItem key={task.id} task={task} onEdit={onEditTask} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
