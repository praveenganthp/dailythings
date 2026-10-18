import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore } from '../store/useTaskStore';
import type { Priority, Category, Subtask, RecurrenceType } from '../types';
import { X, Flag, Tag, Repeat, ListPlus, Trash2, Plus } from 'lucide-react';
import { CustomTimePicker } from './CustomTimePicker';
import { CustomSelect, type SelectOption } from './CustomSelect';
import { SecureInput } from './ui/SecureInput';
import { SecureTextarea } from './ui/SecureTextarea';
import { hasImproperContent } from '../utils/sanitize';
import { playButtonTapSound } from '../utils/sound';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  editTaskId?: string | null;
}

const PRIORITY_OPTIONS: SelectOption<Priority>[] = [
  { value: 'low', label: '🟢 Low Priority' },
  { value: 'medium', label: '🟡 Medium Priority' },
  { value: 'high', label: '🔴 High Priority' },
];

const CATEGORY_OPTIONS: SelectOption<Category>[] = [
  { value: 'work', label: '💼 Work' },
  { value: 'personal', label: '🏠 Personal' },
  { value: 'health', label: '🌱 Health' },
  { value: 'learning', label: '📚 Learning' },
  { value: 'other', label: '✨ Other' },
];

const RECURRENCE_OPTIONS: SelectOption<RecurrenceType>[] = [
  { value: 'none', label: 'Does not repeat' },
  { value: 'daily', label: '🔁 Repeat daily' },
  { value: 'weekdays', label: '💼 Repeat weekdays (Mon-Fri)' },
];

const TaskFormDialog = ({
  editTaskId,
  onClose,
}: {
  editTaskId?: string | null;
  onClose: () => void;
}) => {
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const tasks = useTaskStore((state) => state.tasks);
  const settings = useTaskStore((state) => state.settings);

  const initialTask = editTaskId ? tasks.find((t) => t.id === editTaskId) : undefined;

  const [title, setTitle] = useState(initialTask?.title ?? '');
  const [description, setDescription] = useState(initialTask?.description ?? '');
  const [priority, setPriority] = useState<Priority>(initialTask?.priority ?? 'medium');
  const [category, setCategory] = useState<Category>(initialTask?.category ?? 'work');
  const [recurring, setRecurring] = useState<RecurrenceType>(initialTask?.recurring ?? 'none');
  const [startTime, setStartTime] = useState(initialTask?.startTime ?? '');
  const [endTime, setEndTime] = useState(initialTask?.endTime ?? '');
  const [subtasks, setSubtasks] = useState<Subtask[]>(initialTask?.subtasks ?? []);
  const [subtaskInput, setSubtaskInput] = useState('');

  const handleAddSubtask = () => {
    if (!subtaskInput.trim() || hasImproperContent(subtaskInput)) return;
    const newSub: Subtask = {
      id: crypto.randomUUID(),
      title: subtaskInput.trim(),
      completed: false,
    };
    setSubtasks([...subtasks, newSub]);
    setSubtaskInput('');
    if (settings.soundEnabled) playButtonTapSound();
  };

  const handleKeyDownSubtask = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSubtask();
    }
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter((s) => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || hasImproperContent(title) || hasImproperContent(description)) return;
    const payload = {
      title,
      description,
      priority,
      category,
      recurring,
      startTime,
      endTime,
      subtasks,
    };
    if (editTaskId) {
      updateTask(editTaskId, payload);
    } else {
      addTask(payload);
    }
    if (settings.soundEnabled) playButtonTapSound();
    onClose();
  };

  return (
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

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        className="relative w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden rounded-2xl"
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
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            {editTaskId ? '✏️ Edit Task' : '✨ Create New Task'}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg transition-colors hover:bg-white/10 cursor-pointer text-white/80 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          {/* Title */}
          <div>
            <label
              htmlFor="task-title-input"
              className="text-[10px] font-bold uppercase tracking-widest block mb-1.5"
              style={{ color: 'var(--text-muted)' }}
            >
              Task Title *
            </label>
            <SecureInput
              id="task-title-input"
              type="text"
              placeholder="What do you need to accomplish?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
              className="input-premium w-full text-sm font-medium"
              style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="task-notes-input"
              className="text-[10px] font-bold uppercase tracking-widest block mb-1.5"
              style={{ color: 'var(--text-muted)' }}
            >
              Notes / Context (Optional)
            </label>
            <SecureTextarea
              id="task-notes-input"
              placeholder="Add details, links, or notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-premium w-full text-xs resize-none"
              rows={2}
              style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
            />
          </div>

          {/* Priority & Category Selects */}
          <div className="grid grid-cols-2 gap-3.5 relative z-20">
            <CustomSelect<Priority>
              label="Priority"
              icon={<Flag size={12} />}
              value={priority}
              options={PRIORITY_OPTIONS}
              onChange={setPriority}
            />
            <CustomSelect<Category>
              label="Category"
              icon={<Tag size={12} />}
              value={category}
              options={CATEGORY_OPTIONS}
              onChange={setCategory}
            />
          </div>

          {/* Recurrence & Time Pickers */}
          <div className="space-y-3.5">
            <div className="relative z-15">
              <CustomSelect<RecurrenceType>
                label="Habit Recurrence"
                icon={<Repeat size={12} />}
                value={recurring}
                options={RECURRENCE_OPTIONS}
                onChange={setRecurring}
              />
            </div>

            <div className="grid grid-cols-2 gap-3.5 relative z-10">
              <CustomTimePicker label="Start Time" value={startTime} onChange={setStartTime} />
              <CustomTimePicker label="End Time" value={endTime} onChange={setEndTime} />
            </div>
          </div>

          {/* Subtasks Checklist Builder */}
          <div
            className="space-y-2.5 pt-3 border-t"
            style={{ borderColor: 'var(--border-default)' }}
          >
            <div className="flex items-center justify-between">
              <label
                className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5"
                style={{ color: 'var(--text-muted)' }}
              >
                <ListPlus size={12} /> Subtasks / Steps ({subtasks.length})
              </label>
              {subtasks.length > 0 && (
                <span className="text-[10px]" style={{ color: 'var(--text-disabled)' }}>
                  Break tasks down for focus
                </span>
              )}
            </div>

            {/* Input row */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add actionable step..."
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                onKeyDown={handleKeyDownSubtask}
                className="input-premium flex-1 text-xs py-2"
                style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                disabled={!subtaskInput.trim()}
                className="btn-secondary px-3 py-2 text-xs font-semibold cursor-pointer disabled:opacity-40 flex items-center gap-1"
              >
                <Plus size={12} /> Add
              </button>
            </div>

            {/* Subtasks List */}
            {subtasks.length > 0 && (
              <div className="space-y-1.5 mt-2 max-h-36 overflow-y-auto pr-1">
                {subtasks.map((st) => (
                  <div
                    key={st.id}
                    className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs transition-all"
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-default)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <span className="truncate">{st.title}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(st.id)}
                      title="Remove step"
                      className="p-1 rounded text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div
            className="pt-4 flex justify-end gap-3 border-t shrink-0"
            style={{ borderColor: 'var(--border-default)' }}
          >
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary px-4 py-2 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                !title.trim() || hasImproperContent(title) || hasImproperContent(description)
              }
              className="btn-primary px-5 py-2 text-xs font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editTaskId ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export const TaskForm = ({ isOpen, onClose, editTaskId }: TaskFormProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <TaskFormDialog key={editTaskId ?? 'new'} editTaskId={editTaskId} onClose={onClose} />
      )}
    </AnimatePresence>
  );
};
