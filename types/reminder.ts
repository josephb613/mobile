export type RepeatType = 'none' | 'daily' | 'weekly';
export type PriorityLevel = 'low' | 'medium' | 'high';

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  dateTime: string; // ISO string
  repeat: RepeatType;
  priority: PriorityLevel;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationConfig {
  id: string;
  reminderId: string;
  title: string;
  body: string;
  trigger: Date;
  sound: boolean;
  vibrate: boolean;
}