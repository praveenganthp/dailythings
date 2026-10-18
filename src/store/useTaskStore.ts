import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task, UserSettings, DailySummary, RecurrenceType } from '../types';

interface TaskState {
  tasks: Task[];
  settings: UserSettings;
  dateLastReset: string; // YYYY-MM-DD
  history: Record<string, DailySummary>; // YYYY-MM-DD -> summary
  
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed' | 'progress'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  reorderTasks: (startIndex: number, endIndex: number) => void;
  
  updateSettings: (settings: Partial<UserSettings>) => void;
  recordDailySummary: (summary: DailySummary) => void;
  resetDailyTasks: (newDate: string, carryForward: boolean) => void;
  importFullBackup: (backup: {
    tasks: Task[];
    history: Record<string, DailySummary>;
    settings: UserSettings;
    dateLastReset: string;
  }) => void;
  getStreak: () => number;
}

const defaultSettings: UserSettings = {
  name: '',
  email: '',
  carryForwardUnfinished: true,
  theme: 'system',
  isOnboarded: false,
  soundEnabled: true,
};

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => {
      const d = new Date();
      const localToday = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      
      return {
        tasks: [],
        settings: defaultSettings,
        dateLastReset: localToday,
        history: {},

        addTask: (taskData) => {
          const newTask: Task = {
            ...taskData,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            completed: false,
            progress: 0,
            subtasks: taskData.subtasks || [],
            recurring: taskData.recurring || 'none',
          };
          set((state) => ({ tasks: [...state.tasks, newTask] }));
        },

        updateTask: (id, updates) => {
          set((state) => ({
            tasks: state.tasks.map((task) =>
              task.id === id ? { ...task, ...updates } : task
            ),
          }));
        },

        deleteTask: (id) => {
          set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== id),
          }));
        },

        toggleTaskCompletion: (id) => {
          set((state) => ({
            tasks: state.tasks.map((task) => {
              if (task.id === id) {
                const isCompleted = !task.completed;
                const updatedSubtasks = task.subtasks.map((s) => ({
                  ...s,
                  completed: isCompleted,
                }));
                return {
                  ...task,
                  completed: isCompleted,
                  progress: isCompleted ? 100 : 0,
                  subtasks: updatedSubtasks,
                };
              }
              return task;
            }),
          }));
        },

        toggleSubtask: (taskId, subtaskId) => {
          set((state) => ({
            tasks: state.tasks.map((task) => {
              if (task.id === taskId) {
                const updatedSubtasks = task.subtasks.map((s) =>
                  s.id === subtaskId ? { ...s, completed: !s.completed } : s
                );
                const total = updatedSubtasks.length;
                const completedCount = updatedSubtasks.filter((s) => s.completed).length;
                const progress = total > 0 ? Math.round((completedCount / total) * 100) : 0;
                const isAllCompleted = total > 0 && completedCount === total;

                return {
                  ...task,
                  subtasks: updatedSubtasks,
                  progress,
                  completed: isAllCompleted,
                };
              }
              return task;
            }),
          }));
        },

        reorderTasks: (startIndex, endIndex) => {
          set((state) => {
            const result = Array.from(state.tasks);
            const [removed] = result.splice(startIndex, 1);
            result.splice(endIndex, 0, removed);
            return { tasks: result };
          });
        },

        updateSettings: (newSettings) => {
          set((state) => ({
            settings: { ...state.settings, ...newSettings },
          }));
        },

        recordDailySummary: (summary) => {
          set((state) => ({
            history: {
              ...state.history,
              [summary.date]: summary,
            },
          }));
        },

        importFullBackup: (backup) => {
          set(() => ({
            tasks: backup.tasks,
            history: backup.history,
            settings: backup.settings,
            dateLastReset: backup.dateLastReset,
          }));
        },

        resetDailyTasks: (newDate, carryForward) => {
          set((state) => {
            const nextDateObj = new Date(newDate + 'T00:00:00');
            const dayOfWeek = nextDateObj.getDay(); // 0 is Sun, 1-5 is Mon-Fri, 6 is Sat
            const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;

            const nextTasks: Task[] = [];

            for (const task of state.tasks) {
              const recurring: RecurrenceType = task.recurring || 'none';

              if (recurring === 'daily') {
                // Re-arm daily habit task for the new day
                nextTasks.push({
                  ...task,
                  completed: false,
                  progress: 0,
                  subtasks: task.subtasks.map((s) => ({ ...s, completed: false })),
                });
              } else if (recurring === 'weekdays' && isWeekday) {
                // Re-arm weekday habit task
                nextTasks.push({
                  ...task,
                  completed: false,
                  progress: 0,
                  subtasks: task.subtasks.map((s) => ({ ...s, completed: false })),
                });
              } else if (carryForward && !task.completed) {
                // Carry forward unfinished non-recurring task
                nextTasks.push(task);
              }
            }

            return {
              tasks: nextTasks,
              dateLastReset: newDate,
            };
          });
        },

        getStreak: () => {
          const state = get();
          const today = state.dateLastReset;
          let streak = 0;

          // Check if at least 1 task is completed today
          const completedToday = state.tasks.filter((t) => t.completed).length;
          if (completedToday > 0) {
            streak++;
          }

          // Step back day by day through history
          const checkDate = new Date(today + 'T00:00:00');
          checkDate.setDate(checkDate.getDate() - 1);

          while (true) {
            const dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
            const summary = state.history[dateStr];

            if (summary && summary.completedTasks > 0) {
              streak++;
              checkDate.setDate(checkDate.getDate() - 1);
            } else {
              break;
            }
          }

          return streak;
        },
      };
    },
    {
      name: 'daily-premium-tasks-storage',
    }
  )
);
