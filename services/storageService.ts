import * as SQLite from 'expo-sqlite';
import { Reminder } from '@/types/reminder';

const db = SQLite.openDatabaseSync('reminders.db');

// Initialize database
export const initDatabase = async () => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS reminders (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        dateTime TEXT NOT NULL,
        repeat TEXT NOT NULL,
        priority TEXT NOT NULL,
        isActive INTEGER NOT NULL DEFAULT 1,
        notificationId TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
    `);
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export const getAllReminders = async (): Promise<Reminder[]> => {
  try {
    const result = await db.getAllAsync<Reminder>('SELECT * FROM reminders ORDER BY dateTime ASC');
    return result.map(row => ({
      ...row,
      isActive: Boolean(row.isActive)
    }));
  } catch (error) {
    console.error('Error getting reminders:', error);
    return [];
  }
};

export const getReminderById = async (id: string): Promise<Reminder | null> => {
  try {
    const result = await db.getFirstAsync<Reminder>('SELECT * FROM reminders WHERE id = ?', [id]);
    if (!result) return null;
    return {
      ...result,
      isActive: Boolean(result.isActive)
    };
  } catch (error) {
    console.error('Error getting reminder:', error);
    return null;
  }
};

export const createReminder = async (reminder: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>): Promise<Reminder> => {
  const id = Date.now().toString();
  const now = new Date().toISOString();
  
  try {
    await db.runAsync(
      `INSERT INTO reminders (id, title, description, dateTime, repeat, priority, isActive, notificationId, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, reminder.title, reminder.description || '', reminder.dateTime, reminder.repeat, reminder.priority, reminder.isActive ? 1 : 0, reminder.notificationId, now, now]
    );
    
    return {
      id,
      ...reminder,
      createdAt: now,
      updatedAt: now
    };
  } catch (error) {
    console.error('Error creating reminder:', error);
    throw error;
  }
};

export const updateReminder = async (id: string, updates: Partial<Reminder>): Promise<Reminder> => {
  const now = new Date().toISOString();
  
  try {
    const fields: string[] = [];
    const values: any[] = [];
    
    if (updates.title !== undefined) {
      fields.push('title = ?');
      values.push(updates.title);
    }
    if (updates.description !== undefined) {
      fields.push('description = ?');
      values.push(updates.description);
    }
    if (updates.dateTime !== undefined) {
      fields.push('dateTime = ?');
      values.push(updates.dateTime);
    }
    if (updates.repeat !== undefined) {
      fields.push('repeat = ?');
      values.push(updates.repeat);
    }
    if (updates.priority !== undefined) {
      fields.push('priority = ?');
      values.push(updates.priority);
    }
    if (updates.isActive !== undefined) {
      fields.push('isActive = ?');
      values.push(updates.isActive ? 1 : 0);
    }
    if (updates.notificationId !== undefined) {
      fields.push('notificationId = ?');
      values.push(updates.notificationId);
    }
    
    fields.push('updatedAt = ?');
    values.push(now);
    values.push(id);
    
    await db.runAsync(
      `UPDATE reminders SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    const updated = await getReminderById(id);
    if (!updated) throw new Error('Reminder not found after update');
    return updated;
  } catch (error) {
    console.error('Error updating reminder:', error);
    throw error;
  }
};

export const deleteReminder = async (id: string): Promise<void> => {
  try {
    await db.runAsync('DELETE FROM reminders WHERE id = ?', [id]);
  } catch (error) {
    console.error('Error deleting reminder:', error);
    throw error;
  }
};

export const toggleReminderActive = async (id: string): Promise<Reminder> => {
  try {
    const reminder = await getReminderById(id);
    if (!reminder) throw new Error('Reminder not found');
    
    return await updateReminder(id, { isActive: !reminder.isActive });
  } catch (error) {
    console.error('Error toggling reminder:', error);
    throw error;
  }
};