import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task, UserSettings } from '../types';

interface TaskState {
  tasks: Task[];
  settings: UserSettings;
  dateLastReset: string; // YYYY-MM-DD
  
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed' | 'progress'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  reorderTasks: (startIndex: number, endIndex: number) => void;
  
  updateSettings: (settings: Partial<UserSettings>) => void;
  resetDailyTasks: (newDate: string, carryForward: boolean) => void;
}

const defaultSettings: UserSettings = {
  name: '',
  email: '',
  carryForwardUnfinished: true,
  theme: 'system',
  isOnboarded: false
};

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => {
      const d = new Date();
      const localToday = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      
      return {
        tasks: [],
        settings: defaultSettings,
        dateLastReset: localToday,

        addTask: (taskData) => {
          const newTask: Task = {
            ...taskData,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            completed: false,
            progress: 0,
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
              return { 
                ...task, 
                completed: isCompleted,
                progress: isCompleted ? 100 : task.progress === 100 ? 0 : task.progress 
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

      resetDailyTasks: (newDate, carryForward) => {
        set((state) => {
          let nextTasks = state.tasks;
          if (!carryForward) {
            nextTasks = [];
          } else {
            nextTasks = nextTasks.filter((t) => !t.completed);
          }
          return {
             tasks: nextTasks,
             dateLastReset: newDate
          };
        });
      }
    };
  },
  {
    name: 'daily-premium-tasks-storage', // unique name
  }
  )
);
