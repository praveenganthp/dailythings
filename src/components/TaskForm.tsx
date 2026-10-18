import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore } from '../store/useTaskStore';
import type { Priority, Category, Subtask, RecurrenceType } from '../types';
import { X, Flag, Tag, Repeat, ListPlus, Trash2 } from 'lucide-react';
import { CustomTimePicker } from './CustomTimePicker';
import { CustomSelect, type SelectOption } from './CustomSelect';
import { SecureInput } from './ui/SecureInput';
import { SecureTextarea } from './ui/SecureTextarea';
import { hasImproperContent } from '../utils/sanitize';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  editTaskId?: string | null;
}

const PRIORITY_OPTIONS: SelectOption<Priority>[] = [
  { value: 'low', label: '🟢 Low' },
  { value: 'medium', label: '🟡 Medium' },
  { value: 'high', label: '🔴 High' },
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
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0"
        style={{ background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="relative w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden rounded-2xl"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid rgba(148,163,184,0.12)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
        }}
      >
        {/* Header with gradient */}
        <div
          className="px-6 py-5 flex justify-between items-center rounded-t-2xl shrink-0"
          style={{
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            boxShadow: '0 8px 24px rgba(99,102,241,0.3)',
          }}
        >
          <h2 className="text-lg font-bold text-white tracking-tight">
            {editTaskId ? '✏️ Edit Task' : '✨ New Task'}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg transition-colors hover:bg-white/10 cursor-pointer"
            style={{ color: 'rgba(255,255,255,0.8)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          {/* Title */}
          <div>
            <SecureInput
              type="text"
              placeholder="What do you need to accomplish?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
              className="input-premium w-full text-base font-medium"
              style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
            />
          </div>

          {/* Description */}
          <div>
            <SecureTextarea
              placeholder="Notes or details... (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-premium w-full text-sm resize-none"
              rows={2}
              style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
            />
          </div>

          {/* Priority & Category */}
          <div className="grid grid-cols-2 gap-4 relative z-20">
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

          {/* Recurrence & Times */}
          <div className="space-y-4">
            <div className="relative z-15">
              <CustomSelect<RecurrenceType>
                label="Recurrence / Habit"
                icon={<Repeat size={12} />}
                value={recurring}
                options={RECURRENCE_OPTIONS}
                onChange={setRecurring}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10">
              <CustomTimePicker label="Start" value={startTime} onChange={setStartTime} />
              <CustomTimePicker label="End" value={endTime} onChange={setEndTime} />
            </div>
          </div>

          {/* Subtasks Checklist Builder */}
          <div className="space-y-2 pt-2 border-t" style={{ borderColor: 'var(--border-default)' }}>
            <label
              className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5"
              style={{ color: 'var(--text-muted)' }}
            >
              <ListPlus size={12} /> Subtasks ({subtasks.length})
            </label>

            {/* Input row */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add step (e.g. Write intro outline)..."
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
                className="btn-secondary px-3 py-2 text-xs font-semibold cursor-pointer disabled:opacity-40"
              >
                + Add
              </button>
            </div>

            {/* Subtasks List */}
            {subtasks.length > 0 && (
              <div className="space-y-1.5 mt-2 max-h-36 overflow-y-auto pr-1">
                {subtasks.map((st) => (
                  <div
                    key={st.id}
                    className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs"
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid rgba(148,163,184,0.1)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <span className="truncate">{st.title}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(st.id)}
                      title="Remove subtask"
                      className="p-1 rounded text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className="pt-4 flex justify-end gap-3 border-t shrink-0"
            style={{ borderColor: 'var(--border-default)' }}
          >
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary px-5 py-2.5 text-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                !title.trim() || hasImproperContent(title) || hasImproperContent(description)
              }
              className="btn-primary px-6 py-2.5 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editTaskId ? 'Save Changes' : 'Add Task'}
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
