import type { Task, UserSettings, DailySummary } from '../types';

export interface BackupData {
  version: string;
  exportedAt: string;
  appName: string;
  data: {
    tasks: Task[];
    history: Record<string, DailySummary>;
    dateLastReset: string;
    settings: UserSettings;
  };
}

/**
 * Exports application state to a timestamped JSON file download
 */
export function exportDataAsJSON(state: {
  tasks: Task[];
  history: Record<string, DailySummary>;
  dateLastReset: string;
  settings: UserSettings;
}) {
  const payload: BackupData = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    appName: 'DailyThings',
    data: {
      tasks: state.tasks,
      history: state.history,
      dateLastReset: state.dateLastReset,
      settings: state.settings,
    },
  };

  const jsonStr = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const d = new Date();
  const dateTag = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const filename = `dailythings-backup-${dateTag}.json`;

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Validates and imports a JSON backup file
 */
export async function parseBackupFile(
  file: File
): Promise<{ success: boolean; data?: BackupData['data']; error?: string }> {
  try {
    const text = await file.text();
    const parsed = JSON.parse(text) as Partial<BackupData>;

    // Basic structure check
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, error: 'Invalid JSON file format.' };
    }

    const data = parsed.data || (parsed as unknown as BackupData['data']);
    if (!data || !Array.isArray(data.tasks)) {
      return {
        success: false,
        error: 'Incompatible backup file: missing tasks structure.',
      };
    }

    return {
      success: true,
      data: {
        tasks: data.tasks,
        history: data.history || {},
        dateLastReset: data.dateLastReset || new Date().toISOString().split('T')[0],
        settings: data.settings || {
          name: '',
          email: '',
          carryForwardUnfinished: true,
          theme: 'system',
          isOnboarded: true,
          soundEnabled: true,
        },
      },
    };
  } catch (err) {
    return {
      success: false,
      error: `Failed to read file: ${err instanceof Error ? err.message : 'Unknown error'}`,
    };
  }
}
