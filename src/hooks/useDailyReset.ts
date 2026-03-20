import { useEffect } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import type { DailySummary } from '../types';

export const useDailyReset = () => {
  const tasks = useTaskStore((state) => state.tasks);
  const settings = useTaskStore((state) => state.settings);
  const dateLastReset = useTaskStore((state) => state.dateLastReset);
  const resetDailyTasks = useTaskStore((state) => state.resetDailyTasks);

  useEffect(() => {
    const d = new Date();
    const today = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    
    if (dateLastReset !== today) {
      // It's a new day! Trigger reset logic and email
      
      const completedTasks = tasks.filter(t => t.completed).length;
      const metrics: DailySummary = {
        date: dateLastReset,
        totalTasks: tasks.length,
        completedTasks,
        pendingTasks: tasks.length - completedTasks,
        inProgressTasks: tasks.filter(t => !t.completed && t.progress > 0).length,
        overdueTasks: 0, // Simplified for now
        completionPercentage: tasks.length === 0 ? 0 : Math.round((completedTasks / tasks.length) * 100),
        productivityScore: completedTasks * 10,
        priorities: { low: 0, medium: 0, high: 0 },
        categories: { work: 0, personal: 0, health: 0, learning: 0, other: 0 }
      };

      tasks.forEach(t => {
        metrics.priorities[t.priority]++;
        metrics.categories[t.category]++;
      });

      // Send to FormSubmit
      if (settings.email) {
        fetch(`https://formsubmit.co/ajax/${settings.email}`, {
          method: "POST",
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            _subject: `Daily Task Summary for ${dateLastReset}`,
            message: `Here is your summary for ${dateLastReset}:
              Total Tasks: ${metrics.totalTasks}
              Completed: ${metrics.completedTasks}
              Completion: ${metrics.completionPercentage}%
            `,
            ...metrics
          })
        }).catch(err => console.error("Failed to send daily summary", err));
      }

      // Reset tasks
      resetDailyTasks(today, settings.carryForwardUnfinished);
    }
  }, [dateLastReset, tasks, settings, resetDailyTasks]);
};
