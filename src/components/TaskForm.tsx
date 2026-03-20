import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore } from '../store/useTaskStore';
import type { Priority, Category } from '../types';
import { X, Flag, Tag } from 'lucide-react';
import { CustomTimePicker } from './CustomTimePicker';
import { CustomSelect } from './CustomSelect';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  editTaskId?: string | null;
}

const PRIORITY_OPTIONS = [
  { value: 'low',    label: '🟢 Low' },
  { value: 'medium', label: '🟡 Medium' },
  { value: 'high',   label: '🔴 High' },
];

const CATEGORY_OPTIONS = [
  { value: 'work',     label: '💼 Work' },
  { value: 'personal', label: '🏠 Personal' },
  { value: 'health',   label: '🌱 Health' },
  { value: 'learning', label: '📚 Learning' },
  { value: 'other',    label: '✨ Other' },
];

export const TaskForm = ({ isOpen, onClose, editTaskId }: TaskFormProps) => {
  const addTask    = useTaskStore(state => state.addTask);
  const updateTask = useTaskStore(state => state.updateTask);
  const tasks      = useTaskStore(state => state.tasks);

  const [title,       setTitle]       = useState('');
  const [description, setDescription] = useState('');
  const [priority,    setPriority]    = useState<unknown>('medium');
  const [category,    setCategory]    = useState<unknown>('work');
  const [startTime,   setStartTime]   = useState('');
  const [endTime,     setEndTime]     = useState('');

  useEffect(() => {
    if (editTaskId && isOpen) {
      const task = tasks.find(t => t.id === editTaskId);
      if (task) {
        setTitle(task.title);
        setDescription(task.description || '');
        setPriority(task.priority);
        setCategory(task.category);
        setStartTime(task.startTime || '');
        setEndTime(task.endTime || '');
      }
    } else if (isOpen) {
      setTitle(''); setDescription('');
      setPriority('medium'); setCategory('work');
      setStartTime(''); setEndTime('');
    }
  }, [editTaskId, isOpen, tasks]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const payload = { title, description, priority: priority as Priority, category: category as Category, startTime, endTime };
    editTaskId ? updateTask(editTaskId, payload) : addTask({ ...payload, subtasks: [] });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="relative w-full max-w-lg overflow-hidden rounded-2xl"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid rgba(148,163,184,0.12)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
            }}
          >
            {/* Header with gradient */}
            <div
              className="px-6 py-5 flex justify-between items-center"
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
                className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
                style={{ color: 'rgba(255,255,255,0.8)' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Title */}
              <div>
                <input
                  type="text"
                  placeholder="What do you need to accomplish?"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  autoFocus
                  className="input-premium w-full text-base font-medium"
                  style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                />
              </div>

              {/* Description */}
              <div>
                <textarea
                  placeholder="Notes or details... (optional)"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="input-premium w-full text-sm resize-none"
                  rows={3}
                  style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                />
              </div>

              {/* Priority & Category */}
              <div className="grid grid-cols-2 gap-4 relative z-20">
                <CustomSelect
                  label="Priority"
                  icon={<Flag size={12} />}
                  value={priority as string}
                  options={PRIORITY_OPTIONS}
                  onChange={setPriority}
                />
                <CustomSelect
                  label="Category"
                  icon={<Tag size={12} />}
                  value={category as string}
                  options={CATEGORY_OPTIONS}
                  onChange={setCategory}
                />
              </div>

              {/* Times */}
              <div className="grid grid-cols-2 gap-4 relative z-10">
                <CustomTimePicker label="Start" value={startTime} onChange={setStartTime} />
                <CustomTimePicker label="End"   value={endTime}   onChange={setEndTime} />
              </div>

              {/* Footer */}
              <div
                className="pt-4 flex justify-end gap-3 border-t"
                style={{ borderColor: 'var(--border-default)' }}
              >
                <button type="button" onClick={onClose} className="btn-secondary px-5 py-2.5 text-sm">
                  Cancel
                </button>
                <button type="submit" disabled={!title.trim()} className="btn-primary px-6 py-2.5 text-sm">
                  {editTaskId ? 'Save Changes' : 'Add Task'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
