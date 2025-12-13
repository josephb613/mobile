import { RepeatType, PriorityLevel } from '@/types/reminder';

// Date formatting functions
export const formatReminderDate = (date: Date): string => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) {
    return `Aujourd'hui à ${formatTime(date)}`;
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return `Demain à ${formatTime(date)}`;
  } else {
    return `${formatDate(date)} à ${formatTime(date)}`;
  }
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};

export const getRepeatLabel = (repeat: RepeatType): string => {
  const labels = {
    none: 'Unique',
    daily: 'Quotidienne',
    weekly: 'Hebdomadaire'
  };
  return labels[repeat];
};

export const getPriorityLabel = (priority: PriorityLevel): string => {
  const labels = {
    low: 'Faible',
    medium: 'Moyenne',
    high: 'Élevée'
  };
  return labels[priority];
};