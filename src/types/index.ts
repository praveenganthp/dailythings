export type Priority = 'low' | 'medium' | 'high';
export type Category = 'work' | 'personal' | 'health' | 'learning' | 'other';
export type RecurrenceType = 'none' | 'daily' | 'weekdays';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  priority: Priority;
  category: Category;
  progress: number; // 0 to 100
  completed: boolean;
  subtasks: Subtask[];
  recurring?: RecurrenceType;
  createdAt: string;
}

export interface DailySummary {
  date: string;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks?: number;
  completionPercentage: number;
  productivityScore?: number;
}

export interface UserSettings {
  name: string;
  email: string;
  carryForwardUnfinished: boolean;
  theme: 'dark' | 'light' | 'system';
  isOnboarded: boolean;
  soundEnabled: boolean;
}
