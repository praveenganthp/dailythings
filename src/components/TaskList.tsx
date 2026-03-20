import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore } from '../store/useTaskStore';
import { useNotificationStore } from '../store/useNotificationStore';
import type { Task } from '../types';
import { Check, Clock, GripVertical, MoreVertical, Trash2, Edit3, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';

const PRIORITY_STYLES: Record<string, { bg: string; text: string }> = {
  high:   { bg: 'rgba(239,68,68,0.12)',   text: '#F87171' },
  medium: { bg: 'rgba(245,158,11,0.12)',  text: '#FBBF24' },
  low:    { bg: 'rgba(34,197,94,0.12)',   text: '#4ADE80' },
};

const CATEGORY_STYLES: Record<string, { bg: string; text: string }> = {
  work:     { bg: 'rgba(99,102,241,0.12)',  text: '#818CF8' },
  personal: { bg: 'rgba(139,92,246,0.12)', text: '#C084FC' },
  health:   { bg: 'rgba(34,197,94,0.12)',  text: '#4ADE80' },
  learning: { bg: 'rgba(56,189,248,0.12)', text: '#60A5FA' },
  other:    { bg: 'rgba(148,163,184,0.1)', text: '#94A3B8' },
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
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement> & { 'data-rbd-drag-handle-draggable-id'?: string };
  isDragging?: boolean;
}) => {
  const toggleTaskCompletion = useTaskStore(state => state.toggleTaskCompletion);
  const deleteTask           = useTaskStore(state => state.deleteTask);
  const showReward           = useNotificationStore(state => state.showReward);
  const [showOptions, setShowOptions] = useState(false);

  const handleToggle = () => {
    if (!task.completed) showReward(task.priority, task.category);
    toggleTaskCompletion(task.id);
  };

  const pStyle = PRIORITY_STYLES[task.priority] ?? PRIORITY_STYLES.medium;
  const cStyle = CATEGORY_STYLES[task.category] ?? CATEGORY_STYLES.other;

  return (
    <div
      className="group flex items-start gap-3 p-4 rounded-2xl transition-all duration-200"
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
        opacity: task.completed ? 0.55 : 1,
        transform: isDragging ? 'rotate(1.5deg)' : 'none',
      }}
    >
      {/* Drag Handle (only for pending draggable tasks) */}
      {dragHandleProps && (
        <div
          {...dragHandleProps}
          className="mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing flex-shrink-0"
          style={{ color: 'var(--text-disabled)' }}
        >
          <GripVertical size={16} />
        </div>
      )}

      {/* Completion toggle */}
      <button
        onClick={handleToggle}
        title="Toggle Complete"
        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 mt-0.5"
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

        <div className="flex flex-wrap gap-1.5">
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
        </div>
      </div>

      {/* Options */}
      <div className="relative flex-shrink-0">
        <button
          onClick={() => setShowOptions(v => !v)}
          title="Options"
          className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
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
                  onClick={() => { onEdit(task.id); setShowOptions(false); }}
                  icon={<Edit3 size={12} />}
                  label="Edit"
                  color="var(--text-secondary)"
                  hoverBg="rgba(255,255,255,0.05)"
                />
                <MenuBtn
                  onClick={() => { deleteTask(task.id); setShowOptions(false); }}
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
    className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold transition-colors"
    style={{ color }}
    onMouseEnter={e => (e.currentTarget.style.background = hoverBg)}
    onMouseLeave={e => (e.currentTarget.style.background = '')}
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
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        className="mb-2.5"
      >
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
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="mb-2.5"
  >
    <TaskCardContent task={task} onEdit={onEdit} />
  </motion.div>
);

/* ── Main TaskList ── */
export const TaskList = ({ onEditTask }: { onEditTask: (id: string) => void }) => {
  const tasks        = useTaskStore(state => state.tasks);
  const reorderTasks = useTaskStore(state => state.reorderTasks);

  const pendingTasks   = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

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
                    background: snapshot.isDraggingOver
                      ? 'rgba(99,102,241,0.04)'
                      : 'transparent',
                    borderRadius: 16,
                    transition: 'background 0.2s',
                    padding: 2,
                  }}
                >
                  {pendingTasks.map((task, idx) => (
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
            {completedTasks.map(task => (
              <StaticTaskItem key={task.id} task={task} onEdit={onEditTask} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
