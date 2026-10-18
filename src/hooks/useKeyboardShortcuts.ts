import { useEffect } from 'react';

interface KeyboardShortcutHandlers {
  onNewTask?: () => void;
  onEscape?: () => void;
}

export function useKeyboardShortcuts({ onNewTask, onEscape }: KeyboardShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      if (e.key === 'Escape') {
        onEscape?.();
        return;
      }

      // If user is actively typing in an input, don't trigger hotkeys
      if (isInput) return;

      if ((e.key === 'n' || e.key === 'N' || e.key === 'c' || e.key === 'C') && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        onNewTask?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNewTask, onEscape]);
}
