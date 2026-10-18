import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore } from '../store/useTaskStore';
import { useNotificationStore } from '../store/useNotificationStore';
import type { Task } from '../types';
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
} from 'lucide-react';
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { playCompletionChime, playSubtaskTick } from '../utils/sound';

const PRIORITY_STYLES: Record<string, { bg: string; text: string }> = {
  high: { bg: 'rgba(239,68,68,0.12)', text: '#F87171' },
  medium: { bg: 'rgba(245,158,11,0.12)', text: '#FBBF24' },
  low: { bg: 'rgba(34,197,94,0.12)', text: '#4ADE80' },
};

const CATEGORY_STYLES: Record<string, { bg: string; text: string }> = {
  work: { bg: 'rgba(99,102,241,0.12)', text: '#818CF8' },
  personal: { bg: 'rgba(139,92,246,0.12)', text: '#C084FC' },
  health: { bg: 'rgba(34,197,94,0.12)', text: '#4ADE80' },
  learning: { bg: 'rgba(56,189,248,0.12)', text: '#60A5FA' },
  other: { bg: 'rgba(148,163,184,0.1)', text: '#94A3B8' },
};

/* ── Shared card content (used by both draggable and static) ── */
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
      if (settings.soundEnabled) playCompletionChime();
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
        playCompletionChime();
        showReward(task.priority, task.category);
      } else {
        playSubtaskTick();
      }
    }
  };

  const pStyle = PRIORITY_STYLES[task.priority] ?? PRIORITY_STYLES.medium;
  const cStyle = CATEGORY_STYLES[task.category] ?? CATEGORY_STYLES.other;

  const totalSubtasks = task.subtasks ? task.subtasks.length : 0;
  const completedSubtasks = task.subtasks ? task.subtasks.filter((s) => s.completed).length : 0;

  return (
    <div
      className="group flex flex-col p-4 rounded-2xl transition-all duration-200"
      style={{
        background: isDragging
          ? 'var(--bg-elevated)'
          : task.completed
            ? 'rgba(30,41,59,0.35)'
            : 'var(--bg-card)',
        border: isDragging
          ? '1px solid rgba(99,102,241,0.6)'
          : task.completed
            ? '1px solid rgba(148,163,184,0.05)'
            : '1px solid rgba(148,163,184,0.1)',
        boxShadow: isDragging
          ? '0 20px 48px rgba(0,0,0,0.5), 0 0 0 2px #6366F1'
          : task.completed
            ? 'none'
            : '0 2px 12px rgba(0,0,0,0.15)',
        opacity: task.completed ? 0.6 : 1,
        transform: isDragging ? 'rotate(1.5deg)' : 'none',
      }}
    >
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        {dragHandleProps && (
          <div
            {...dragHandleProps}
            className="mt-0.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing flex-shrink-0"
            style={{ color: 'var(--text-disabled)' }}
          >
            <GripVertical size={16} />
          </div>
        )}

        {/* Completion toggle */}
        <button
          onClick={handleToggle}
          title="Toggle Complete"
          className="mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200 flex-shrink-0 cursor-pointer"
          style={{
            background: task.completed ? 'var(--success)' : 'transparent',
            border: task.completed
              ? '2px solid var(--success)'
              : '2px solid rgba(148,163,184,0.3)',
            boxShadow: task.completed ? '0 0 12px rgba(34,197,94,0.45)' : 'none',
          }}
        >
          <motion.div
            initial={false}
            animate={{ scale: task.completed ? 1 : 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <Check size={11} strokeWidth={3} color="white" />
          </motion.div>
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4
            className="text-sm font-semibold truncate mb-0.5"
            style={{
              color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)',
              textDecoration: task.completed ? 'line-through' : 'none',
            }}
          >
            {task.title}
          </h4>

          {task.description && (
            <p className="text-xs truncate mb-2" style={{ color: 'var(--text-disabled)' }}>
              {task.description}
            </p>
          )}

          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ background: pStyle.bg, color: pStyle.text }}
            >
              {task.priority}
            </span>

            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ background: cStyle.bg, color: cStyle.text }}
            >
              {task.category}
            </span>

            {task.recurring && task.recurring !== 'none' && (
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1"
                style={{ background: 'rgba(56,189,248,0.12)', color: '#38BDF8' }}
              >
                <Repeat size={9} />
                {task.recurring === 'daily' ? 'Daily' : 'Weekdays'}
              </span>
            )}

            {(task.startTime || task.endTime) && (
              <span
                className="text-[10px] font-medium flex items-center gap-1 px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(148,163,184,0.08)', color: 'var(--text-muted)' }}
              >
                <Clock size={9} />
                {task.startTime}
                {task.startTime && task.endTime && <ArrowRight size={8} />}
                {task.endTime}
              </span>
            )}

            {/* Subtasks toggle badge */}
            {totalSubtasks > 0 && (
              <button
                type="button"
                onClick={() => setShowSubtasks(!showSubtasks)}
                className="text-[10px] font-semibold flex items-center gap-1.5 px-2 py-0.5 rounded-full cursor-pointer transition-colors"
                style={{
                  background: 'rgba(99,102,241,0.12)',
                  color: '#818CF8',
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

        {/* Options */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowOptions((v) => !v)}
            title="Options"
            className="p-1.5 rounded-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
          >
            <MoreVertical size={16} />
          </button>

          <AnimatePresence>
            {showOptions && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowOptions(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  className="absolute right-0 top-8 w-36 rounded-xl overflow-hidden z-20"
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid rgba(148,163,184,0.15)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                  }}
                >
                  <MenuBtn
                    onClick={() => {
                      onEdit(task.id);
                      setShowOptions(false);
                    }}
                    icon={<Edit3 size={12} />}
                    label="Edit"
                    color="var(--text-secondary)"
                    hoverBg="rgba(255,255,255,0.05)"
                  />
                  <MenuBtn
                    onClick={() => {
                      deleteTask(task.id);
                      setShowOptions(false);
                    }}
                    icon={<Trash2 size={12} />}
                    label="Delete"
                    color="var(--danger)"
                    hoverBg="rgba(239,68,68,0.08)"
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
          className="mt-3 pt-3 pl-8 border-t space-y-1.5"
          style={{ borderColor: 'rgba(148,163,184,0.1)' }}
        >
          {/* Mini progress bar */}
          <div className="w-full bg-slate-800/80 rounded-full h-1 overflow-hidden mb-2">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'var(--brand)' }}
              initial={{ width: 0 }}
              animate={{ width: `${task.progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {task.subtasks.map((st) => (
            <div
              key={st.id}
              onClick={() => handleToggleSubtask(st.id)}
              className="flex items-center gap-2 py-1 px-2 rounded-lg cursor-pointer hover:bg-white/5 transition-colors group/sub"
            >
              <div
                className="w-3.5 h-3.5 rounded flex items-center justify-center transition-all"
                style={{
                  background: st.completed ? 'var(--brand)' : 'transparent',
                  border: st.completed
                    ? '1.5px solid var(--brand)'
                    : '1.5px solid rgba(148,163,184,0.4)',
                }}
              >
                {st.completed && <Check size={9} strokeWidth={3} color="white" />}
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
    className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold transition-colors cursor-pointer"
    style={{ color }}
    onMouseEnter={(e) => (e.currentTarget.style.background = hoverBg)}
    onMouseLeave={(e) => (e.currentTarget.style.background = '')}
  >
    {icon} {label}
  </button>
);

/* ── Draggable wrapper (active tasks only) ── */
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

/* ── Static wrapper (completed tasks — NO Draggable) ── */
const StaticTaskItem = ({ task, onEdit }: { task: Task; onEdit: (id: string) => void }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mb-2.5">
    <TaskCardContent task={task} onEdit={onEdit} />
  </motion.div>
);

/* ── Main TaskList ── */
export const TaskList = ({ onEditTask }: { onEditTask: (id: string) => void }) => {
  const tasks = useTaskStore((state) => state.tasks);
  const reorderTasks = useTaskStore((state) => state.reorderTasks);

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    reorderTasks(result.source.index, result.destination.index);
  };

  return (
    <div className="space-y-6">
      {/* ── Active / Draggable Tasks ── */}
      {pendingTasks.length > 0 && (
        <div>
          <p
            className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2"
            style={{ color: 'var(--text-disabled)' }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: 'var(--brand)' }}
            />
            Active · {pendingTasks.length}
          </p>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="active-tasks">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    background: snapshot.isDraggingOver ? 'rgba(99,102,241,0.04)' : 'transparent',
                    borderRadius: 16,
                    transition: 'background 0.2s',
                    padding: 2,
                  }}
                >
                  {pendingTasks.map((task, idx) => (
                    <DraggableTaskItem key={task.id} task={task} index={idx} onEdit={onEditTask} />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}

      {/* ── Completed (static, no DnD context needed) ── */}
      {completedTasks.length > 0 && (
        <div>
          <p
            className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2"
            style={{ color: 'var(--text-disabled)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--success)' }} />
            Done · {completedTasks.length}
          </p>
          <AnimatePresence mode="popLayout">
            {completedTasks.map((task) => (
              <StaticTaskItem key={task.id} task={task} onEdit={onEditTask} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
